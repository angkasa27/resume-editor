import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("useResumeEditorController", () => {
  // Why: the top bar's save indicator reads this and nothing else. The
  // controller and the store have to share one storage instance — give the
  // store its own and this subscription watches an object that never saves,
  // leaving the indicator permanently on "idle" while saves succeed.
  it("tracks the save status through a real save", () => {
    const { result } = renderHook(() =>
      useResumeEditorController({ initialDraft: createDefaultResumeDraft() }),
    );

    expect(result.current.saveStatus).toBe("idle");

    act(() => {
      result.current.saveProfile({
        ...result.current.draft.profile,
        fullName: "Saved Once",
      });
    });

    expect(result.current.saveStatus).toBe("saved");
    expect(result.current.draft.profile.fullName).toBe("Saved Once");
  });

  describe("exporting", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    // Why: there is no save button, so an export fired within the 500ms debounce
    // used to serialize the pre-keystroke draft — the file silently lost the last
    // thing the user typed. Both halves are load-bearing: the flush lands the
    // pending edit, and the re-read picks it up (the captured `draft` binding
    // does not refresh synchronously). SAVE-FLOW.md invariant 6.
    it("flushes the open form and re-reads before serializing", async () => {
      const { result } = renderHook(() =>
        useResumeEditorController({ initialDraft: createDefaultResumeDraft() }),
      );

      // Stands in for an open section form with an edit still in the debounce.
      const flush = () => {
        result.current.saveProfile({
          ...result.current.draft.profile,
          fullName: "Typed But Not Yet Saved",
        });
      };
      window.addEventListener("resume-editor:flush-forms", flush);

      let exported: Blob | undefined;
      vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
        exported = blob as Blob;
        return "blob:stub";
      });
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
      vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
        () => {},
      );

      act(() => {
        result.current.handleExport();
      });
      window.removeEventListener("resume-editor:flush-forms", flush);

      expect(await exported?.text()).toContain("Typed But Not Yet Saved");
    });
  });
});
