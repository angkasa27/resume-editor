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
  /** Invariant 5: bumps only on external replacement, never on a form's own save. */
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

/** History entries predate the analysis, so carry the live insights across — see `saveInsights`. */
function carryInsights(
  currentDraft: ResumeDraft,
  restoredDraft: ResumeDraft,
): ResumeDraft {
  if (restoredDraft.insights === currentDraft.insights) return restoredDraft;
  return { ...restoredDraft, insights: currentDraft.insights };
}

const MAX_HISTORY = 50;

// By reference, no clone — nothing mutates a draft in place. Keep it that way.
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
    // Persist, snapshot the previous draft, clear redo. `bumpRevision` marks an
    // external replace so an open form re-seeds (invariant 5); throws deliberately.
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
      // Not `commit`: analyzing a job description isn't a document edit, so it
      // must take no undo slot and must not clear redo. Pairs with `carryInsights`.
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
      // Fires from the open form's own header, so it must bump the revision or
      // the form keeps showing the pre-sort order. Callers flush first (invariant 6).
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
