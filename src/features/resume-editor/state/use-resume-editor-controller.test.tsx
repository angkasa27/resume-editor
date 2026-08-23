import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("useResumeEditorController", () => {
  // Why: the top bar's save indicator reads this and nothing else — controller and
  // store must share one storage instance, or the indicator stays "idle" while saves work.
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

    // Why: no save button — an export inside the 500ms debounce used to serialize the
    // pre-keystroke draft. Flush lands the edit; the re-read picks it up (the captured
    // `draft` binding doesn't refresh synchronously). docs/save-flow.md invariant 6.
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
