import { describe, expect, it, vi } from "vitest";

import { createResumeEditorStore } from "@/features/resume-editor/state/resume-editor-store";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { LocalDraftStorage } from "@/features/resume-editor/domain/draft/local-draft-storage";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

/** The real storage with its two IO methods spied out — no localStorage here. */
function createMockStorage(initialDraft?: ResumeDraft) {
  const draft = initialDraft ?? createDefaultResumeDraft();
  const storage = new LocalDraftStorage();
  const save = vi.spyOn(storage, "save").mockImplementation((d) => d);
  const load = vi.spyOn(storage, "load").mockReturnValue(structuredClone(draft));
  // spyOn already replaced both in place; re-attaching only widens the type so
  // callers can reach .mockClear() etc.
  return Object.assign(storage, { save, load });
}

describe("resume editor store", () => {
  describe("requestSectionChange", () => {
    it("switches to a collection section", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });

      store.getState().requestSectionChange("projects");
      expect(store.getState().activeSection).toBe("projects");

      store.getState().requestSectionChange("skills");
      expect(store.getState().activeSection).toBe("skills");
    });

    it("switches to the profile section", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });

      store.getState().requestSectionChange("skills");
      store.getState().requestSectionChange("profile");
      expect(store.getState().activeSection).toBe("profile");
    });
  });

  describe("saveProfile", () => {
    it("updates the profile and persists via storage", () => {
      const storage = createMockStorage();
      const store = createResumeEditorStore({ storage });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "Updated Name",
      });

      expect(store.getState().draft.profile.fullName).toBe("Updated Name");
      expect(storage.save).toHaveBeenCalledTimes(1);
    });

    it("pushes the previous draft onto the undo stack", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });
      const previousDraft = store.getState().draft;

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "Updated Name",
      });

      expect(store.getState().undoStack).toHaveLength(1);
      expect(store.getState().undoStack[0]).toEqual(previousDraft);
      expect(store.getState().redoStack).toHaveLength(0);
    });
  });

  describe("savePdfPresentation", () => {
    it("updates the presentation and persists via storage", () => {
      const storage = createMockStorage();
      const store = createResumeEditorStore({ storage });

      store.getState().savePdfPresentation({
        ...store.getState().draft.pdfPresentation,
        layoutId: "dossier",
      });

      expect(store.getState().draft.pdfPresentation.layoutId).toBe("dossier");
      expect(storage.save).toHaveBeenCalledTimes(1);
    });

    it("clears the redo stack on new mutations", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "v1",
      });
      store.getState().undo();
      expect(store.getState().redoStack).toHaveLength(1);

      store.getState().savePdfPresentation({
        ...store.getState().draft.pdfPresentation,
        layoutId: "dossier",
      });

      expect(store.getState().redoStack).toHaveLength(0);
    });
  });

  describe("saveSection", () => {
    it("normalizes collection items before saving", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });

      expect(() =>
        store.getState().saveSection("skills", {
          ...store.getState().draft.sections.skills,
          items: [
            ...store.getState().draft.sections.skills.items,
            {
              categoryName: "Backend",
            } as never,
          ],
        }),
      ).not.toThrow();

      expect(store.getState().draft.sections.skills.items[1]).toEqual(
        expect.objectContaining({
          categoryName: "Backend",
          id: expect.any(String),
          skills: [],
        }),
      );
    });

    it("saves non-collection sections without normalization", () => {
      const storage = createMockStorage();
      const store = createResumeEditorStore({ storage });
      const newContent = "<p>Updated summary</p>";

      store.getState().saveSection("summary", {
        ...store.getState().draft.sections.summary,
        content: newContent,
      });

      expect(store.getState().draft.sections.summary.content).toBe(newContent);
      expect(storage.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("autoSortSection", () => {
    function storeWithTwoRoles() {
      const draft = createDefaultResumeDraft();
      const [item] = draft.sections.workExperience.items;
      draft.sections.workExperience.items = [
        { ...item, id: "old", startDate: "Jan 2018", endDate: "Dec 2019" },
        { ...item, id: "new", startDate: "Jan 2020", endDate: "Dec 2021" },
      ];
      return createResumeEditorStore({ initialDraft: draft });
    }

    it("sorts items newest-first", () => {
      const store = storeWithTwoRoles();

      store.getState().autoSortSection("workExperience");

      expect(
        store.getState().draft.sections.workExperience.items.map((i) => i.id),
      ).toEqual(["new", "old"]);
    });

    // The bump is what makes an open section form re-seed; without it the sort
    // shows in the preview only and the form keeps the old order.
    it("bumps the revision so an open form re-seeds", () => {
      const store = storeWithTwoRoles();
      const before = store.getState().revision;

      store.getState().autoSortSection("workExperience");

      expect(store.getState().revision).toBe(before + 1);
    });

    it("leaves the revision alone for an ordinary section save", () => {
      const store = storeWithTwoRoles();
      const before = store.getState().revision;

      store.getState().saveSection("summary", {
        ...store.getState().draft.sections.summary,
        content: "<p>edited</p>",
      });

      expect(store.getState().revision).toBe(before);
    });
  });

  describe("undo / redo", () => {
    it("restores the previous draft on undo", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });
      const originalName = store.getState().draft.profile.fullName;

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "v2",
      });

      store.getState().undo();

      expect(store.getState().draft.profile.fullName).toBe(originalName);
    });

    it("re-applies the undone draft on redo", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "v2",
      });
      store.getState().undo();
      store.getState().redo();

      expect(store.getState().draft.profile.fullName).toBe("v2");
    });

    it("is a no-op when the undo stack is empty", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });
      const original = store.getState().draft;

      store.getState().undo();

      expect(store.getState().draft).toBe(original);
    });

    it("is a no-op when the redo stack is empty", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });
      const original = store.getState().draft;

      store.getState().redo();

      expect(store.getState().draft).toBe(original);
    });

    it("persists the restored draft via storage on undo", () => {
      const storage = createMockStorage();
      const store = createResumeEditorStore({ storage });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "v2",
      });
      storage.save.mockClear();

      store.getState().undo();

      expect(storage.save).toHaveBeenCalledTimes(1);
    });

    it("persists the re-applied draft via storage on redo", () => {
      const storage = createMockStorage();
      const store = createResumeEditorStore({ storage });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "v2",
      });
      store.getState().undo();
      storage.save.mockClear();

      store.getState().redo();

      expect(storage.save).toHaveBeenCalledTimes(1);
    });

    it("caps the undo stack at 50 entries", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });

      for (let i = 0; i < 60; i++) {
        store.getState().saveProfile({
          ...store.getState().draft.profile,
          fullName: `v${i}`,
        });
      }

      expect(store.getState().undoStack.length).toBeLessThanOrEqual(50);
    });
  });

  describe("replaceDraft", () => {
    it("replaces the draft and resets active section and history", () => {
      const storage = createMockStorage();
      const store = createResumeEditorStore({ storage });
      const newDraft = createDefaultResumeDraft();
      newDraft.profile.fullName = "Replaced";

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "v1",
      });

      store.getState().replaceDraft(newDraft);

      expect(store.getState().draft.profile.fullName).toBe("Replaced");
      expect(store.getState().activeSection).toBe("profile");
      expect(store.getState().undoStack).toHaveLength(0);
      expect(store.getState().redoStack).toHaveLength(0);
      expect(storage.save).toHaveBeenCalledWith(newDraft);
    });
  });

  describe("storage integration", () => {
    it("loads the initial draft from storage when no initialDraft is given", () => {
      const storage = createMockStorage();

      createResumeEditorStore({ storage });

      expect(storage.load).toHaveBeenCalledTimes(1);
    });

    it("uses the provided initialDraft over storage", () => {
      const storage = createMockStorage();
      const providedDraft = createDefaultResumeDraft();
      providedDraft.profile.fullName = "Provided";

      const store = createResumeEditorStore({
        storage,
        initialDraft: providedDraft,
      });

      expect(storage.load).not.toHaveBeenCalled();
      expect(store.getState().draft.profile.fullName).toBe("Provided");
    });
  });

  describe("revision", () => {
    it("starts at 0 and does not bump on a section's own save", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });

      expect(store.getState().revision).toBe(0);

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "Edited",
      });
      store.getState().saveSection("summary", {
        ...store.getState().draft.sections.summary,
        content: "<p>hi</p>",
      });

      expect(store.getState().revision).toBe(0);
    });

    it("bumps on replaceDraft, undo, and redo", () => {
      const store = createResumeEditorStore({
        initialDraft: createDefaultResumeDraft(),
      });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "A",
      });
      expect(store.getState().revision).toBe(0);

      store.getState().undo();
      expect(store.getState().revision).toBe(1);

      store.getState().redo();
      expect(store.getState().revision).toBe(2);

      store.getState().replaceDraft(createDefaultResumeDraft());
      expect(store.getState().revision).toBe(3);
    });
  });

  describe("saveInsights", () => {
    const insights = {
      jobDescription: "Senior engineer, React and Kubernetes",
      keywords: [
        { term: "React", category: "hard-skill" as const, weight: 1 },
      ],
      analyzedAt: "2026-08-07T00:00:00.000Z",
    };

    it("saves the job target onto the draft and persists it", () => {
      const storage = createMockStorage();
      const store = createResumeEditorStore({ storage });

      store.getState().saveInsights(insights);

      expect(store.getState().draft.insights).toEqual(insights);
      expect(storage.save).toHaveBeenCalledTimes(1);
    });

    it("clears the job target when passed undefined", () => {
      const store = createResumeEditorStore({ storage: createMockStorage() });

      store.getState().saveInsights(insights);
      store.getState().saveInsights(undefined);

      expect(store.getState().draft.insights).toBeUndefined();
    });

    // Analyzing a job description is not a document edit. If it went through
    // `commit` it would eat an undo slot and — worse — clear the redo stack.
    it("does not touch undo/redo history", () => {
      const store = createResumeEditorStore({ storage: createMockStorage() });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "Dimas",
      });
      store.getState().undo();
      expect(store.getState().redoStack).toHaveLength(1);

      store.getState().saveInsights(insights);

      expect(store.getState().undoStack).toHaveLength(0);
      expect(store.getState().redoStack).toHaveLength(1);
    });

    // History entries predate the analysis, so restoring one naively would drop the
    // job description — gone for good once a later edit clears the redo stack.
    it("survives undo onto a draft saved before it existed", () => {
      const store = createResumeEditorStore({ storage: createMockStorage() });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "Dimas",
      });
      store.getState().saveInsights(insights);
      store.getState().undo();

      expect(store.getState().draft.insights).toEqual(insights);
      expect(store.getState().draft.profile.fullName).not.toBe("Dimas");
    });

    it("survives redo as well", () => {
      const store = createResumeEditorStore({ storage: createMockStorage() });

      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "Dimas",
      });
      store.getState().undo();
      store.getState().saveInsights(insights);
      store.getState().redo();

      expect(store.getState().draft.insights).toEqual(insights);
      expect(store.getState().draft.profile.fullName).toBe("Dimas");
    });

    it("still lets a later clear win over a stale history entry", () => {
      const store = createResumeEditorStore({ storage: createMockStorage() });

      store.getState().saveInsights(insights);
      store.getState().saveProfile({
        ...store.getState().draft.profile,
        fullName: "Dimas",
      });
      store.getState().saveInsights(undefined);
      store.getState().undo();

      expect(store.getState().draft.insights).toBeUndefined();
    });
  });
});
