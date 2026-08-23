import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SectionBody } from "@/features/resume-editor/editor/sections/section-body";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/state/resume-editor-store";

function renderPanel(
  draft: ResumeDraft,
  activeSection: ResumeEditorPanelKey,
  onSaveProfile = vi.fn(),
) {
  render(
    <SectionBody
      draft={draft}
      activeSection={activeSection}
      onSaveProfile={onSaveProfile}
      onSaveSection={vi.fn()}
    />,
  );
  return onSaveProfile;
}

function rirekishoDraft(): ResumeDraft {
  const draft = createDefaultResumeDraft();
  draft.pdfPresentation = { ...draft.pdfPresentation, layoutId: "rirekisho" };
  return draft;
}

describe("the layout-declared extras panel", () => {
  it("keeps its fields out of Profile, which every layout shares", () => {
    // 生年月日 and 性別 are fields a US or EU résumé is advised not to carry;
    // they belong to the one layout that prints them, not to everyone's Profile.
    renderPanel(rirekishoDraft(), "profile");

    expect(screen.queryByLabelText(/name reading/i)).toBeNull();
    expect(screen.queryByLabelText(/date of birth/i)).toBeNull();
  });

  it("renders the fields the active layout declares, and saves them", async () => {
    const user = userEvent.setup();
    const onSave = renderPanel(rirekishoDraft(), "extras");

    await user.type(screen.getByLabelText(/name reading/i), "たなか けんた");
    await act(() => new Promise((r) => setTimeout(r, 700)));

    expect(onSave.mock.calls.at(-1)?.[0].extras?.nameReading).toBe(
      "たなか けんた",
    );
  });

  it("says so when the active layout declares none", () => {
    // The panel stays open across a template switch, so it must survive one.
    renderPanel(createDefaultResumeDraft(), "extras");

    expect(screen.getByText(/needs no extra details/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/name reading/i)).toBeNull();
  });
});
