import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
});
