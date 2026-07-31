import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CollectionSectionBody } from "@/features/resume-editor/editor/sections/collection-section-body";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("CollectionSectionBody autosave", () => {
  it("saves an edited item field after the debounce", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const draft = createDefaultResumeDraft();

    render(
      <CollectionSectionBody
        draft={draft}
        sectionKey="workExperience"
        onSave={onSave}
      />,
    );

    const input = screen.getByLabelText(/company name/i);
    await user.clear(input);
    await user.type(input, "Acme");

    await act(() => new Promise((r) => setTimeout(r, 700)));

    expect(onSave).toHaveBeenCalled();
    expect(onSave.mock.calls.at(-1)?.[0].items[0].companyName).toBe("Acme");
  });
});
