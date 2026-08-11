import { createStore } from "zustand/vanilla";

import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import {
  isCollectionSectionKey,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { sortResumeItems } from "@/features/resume-editor/domain/sections/sort-resume-items";
import {
  moveSectionToAnchor,
  reorderSections,
  setSectionVisibilityWithOrder,
} from "@/features/resume-editor/state/draft-utils";
import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";
import { LocalDraftStorage } from "@/features/resume-editor/domain/draft/local-draft-storage";
import type { Insights } from "@/features/resume-editor/domain/schema/insights-schemas";
import type {
  PdfPresentation,
  Profile,
  ResumeDraft,
} from "@/features/resume-editor/domain/schema";

export type ResumeSectionKey = keyof ResumeDraft["sections"];
export type ResumeEditorPanelKey = "profile" | ResumeSectionKey;

type ResumeEditorStoreState = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  undoStack: ResumeDraft[];
  redoStack: ResumeDraft[];
  /** Bumps only on external draft replacement (replaceDraft/undo/redo), never on saveSection/saveProfile — lets an open form tell a genuine replace from its own autosave echo. */
  revision: number;
  saveProfile: (profile: Profile) => void;
  savePdfPresentation: (pdfPresentation: PdfPresentation) => void;
  /** Saves (or clears, with `undefined`) the analyzed job target. */
  saveInsights: (insights: Insights | undefined) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  reorderSection: (
    sectionKey: ResumeSectionKey,
    anchorKey: ResumeSectionKey,
  ) => void;
  setSectionVisibility: (
    sectionKey: ResumeSectionKey,
    visible: boolean,
  ) => void;
  /** Sorts a dated section's items newest-first. No-op for undated sections. */
  autoSortSection: (sectionKey: CollectionSectionKey) => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  replaceDraft: (draft: ResumeDraft) => void;
  undo: () => void;
  redo: () => void;
};

function createNextDraft(
  currentDraft: ResumeDraft,
  updates: Partial<ResumeDraft>,
): ResumeDraft {
  return {
    ...currentDraft,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeSectionValue<K extends ResumeSectionKey>(
  sectionKey: K,
  sectionValue: ResumeDraft["sections"][K],
): ResumeDraft["sections"][K] {
  if (!isCollectionSectionKey(sectionKey)) {
    return sectionValue;
  }

  const config = collectionSectionConfigs[sectionKey];
  const collectionSectionValue =
    sectionValue as ResumeDraft["sections"][typeof sectionKey] & {
      items: Record<string, unknown>[];
    };

  return {
    ...collectionSectionValue,
    items: collectionSectionValue.items.map((item) =>
      normalizeCollectionItem(item, config.createItem()),
    ),
  } as ResumeDraft["sections"][K];
}

/**
 * The job target isn't part of the edit history — `saveInsights` deliberately
 * doesn't snapshot it — so a history entry predating the analysis still carries
 * the old (usually absent) value. Undoing onto it would silently drop the saved
 * job description, so the live one is carried across instead.
 */
function carryInsights(
  currentDraft: ResumeDraft,
  restoredDraft: ResumeDraft,
): ResumeDraft {
  if (restoredDraft.insights === currentDraft.insights) return restoredDraft;
  return { ...restoredDraft, insights: currentDraft.insights };
}

const MAX_HISTORY = 50;

// History keeps the previous draft by reference (no clone): drafts are never
// mutated in place — createNextDraft spreads a new object, the draft-utils
// mutators clone their input, and parseResumeDraft returns fresh objects.
function pushUndoStack(
  stack: ResumeDraft[],
  draft: ResumeDraft,
): ResumeDraft[] {
  const next = [...stack, draft];
  if (next.length > MAX_HISTORY) next.shift();
  return next;
}

export function createResumeEditorStore(config?: {
  storage?: LocalDraftStorage;
  initialDraft?: ResumeDraft;
}) {
  const storage = config?.storage ?? new LocalDraftStorage();
  const initialDraft = config?.initialDraft ?? storage.load();

  return createStore<ResumeEditorStoreState>()((set, get) => {
    // Shared save path: persist the next draft, snapshot the previous one into
    // history, and clear the redo stack.
    // `bumpRevision` marks the commit as an external replacement, so an open
    // section form re-seeds from it instead of keeping its own stale values.
    const commit = (
      updater: (draft: ResumeDraft) => Partial<ResumeDraft>,
      bumpRevision = false,
    ) => {
      const state = get();
      const nextDraft = storage.save(
        createNextDraft(state.draft, updater(state.draft)),
      );
      set({
        draft: nextDraft,
        undoStack: pushUndoStack(state.undoStack, state.draft),
        redoStack: [],
        revision: bumpRevision ? state.revision + 1 : state.revision,
      });
    };

    return {
      draft: initialDraft,
      activeSection: "profile",
      undoStack: [],
      redoStack: [],
      revision: 0,
      saveProfile: (profile) => commit(() => ({ profile })),
      savePdfPresentation: (pdfPresentation) =>
        commit(() => ({ pdfPresentation })),
      // Deliberately not `commit`: analyzing a job description isn't a document
      // edit, so it must not consume an undo slot — and `commit` clears the redo
      // stack, which would silently kill a pending redo.
      saveInsights: (insights) => {
        const state = get();
        set({
          draft: storage.save(createNextDraft(state.draft, { insights })),
        });
      },
      saveSection: (sectionKey, sectionValue) =>
        commit((draft) => ({
          sections: reorderSections(
            draft.sections,
            sectionKey,
            normalizeSectionValue(sectionKey, sectionValue),
          ),
        })),
      reorderSection: (sectionKey, anchorKey) =>
        commit((draft) => ({
          sections: moveSectionToAnchor(draft.sections, sectionKey, anchorKey),
        })),
      setSectionVisibility: (sectionKey, visible) =>
        commit((draft) => ({
          sections: setSectionVisibilityWithOrder(
            draft.sections,
            sectionKey,
            visible,
          ),
        })),
      // Runs on the store rather than the item form, so it lands on the undo
      // stack (the old form-local version never did). It fires from the section
      // form header, though — so it commits with a revision bump, or the open
      // form would keep showing the pre-sort order while the preview re-sorts.
      autoSortSection: (sectionKey) =>
        commit((draft) => {
          const dateRange = collectionSectionConfigs[sectionKey].dateRange;
          if (!dateRange) return {};

          const sectionValue = draft.sections[sectionKey];
          const sorted = sortResumeItems(
            sectionValue.items as Record<string, unknown>[],
            dateRange.startName,
            dateRange.endName,
          );

          return {
            sections: {
              ...draft.sections,
              [sectionKey]: { ...sectionValue, items: sorted },
            } as ResumeDraft["sections"],
          };
        }, true),
      requestSectionChange: (sectionKey) => {
        set({
          activeSection: sectionKey,
        });
      },
      replaceDraft: (draft) => {
        const nextDraft = storage.save(draft);
        set((state) => ({
          draft: nextDraft,
          activeSection: "profile",
          undoStack: [],
          redoStack: [],
          revision: state.revision + 1,
        }));
      },
      undo: () => {
        const state = get();
        const previousDraft = state.undoStack.at(-1);
        if (!previousDraft) return;
        const nextDraft = storage.save(carryInsights(state.draft, previousDraft));
        set({
          draft: nextDraft,
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, state.draft],
          revision: state.revision + 1,
        });
      },
      redo: () => {
        const state = get();
        const nextDraft = state.redoStack.at(-1);
        if (!nextDraft) return;
        const persistedDraft = storage.save(
          carryInsights(state.draft, nextDraft),
        );
        set({
          draft: persistedDraft,
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, state.draft],
          revision: state.revision + 1,
        });
      },
    };
  });
}
