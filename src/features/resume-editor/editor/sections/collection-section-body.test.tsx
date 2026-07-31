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

  it("does not resurrect a deleted item from its leftover form slot", async () => {
    // Removing a row leaves a ghost behind: the card stays mounted through its
    // exit animation and its Controller-driven date fields write back into the
    // index `remove()` spliced out. Normalizing that partial against the item
    // template used to rebuild it as a blank item — the deleted row "came back"
    // on the next save.
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

    await user.click(screen.getByRole("button", { name: /add experience/i }));
    expect(screen.getAllByLabelText(/company name/i)).toHaveLength(2);

    await user.type(screen.getAllByLabelText(/company name/i)[1], "Doomed");
    await user.click(screen.getAllByRole("button", { name: /remove experience/i })[1]);
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await act(() => new Promise((r) => setTimeout(r, 700)));

    expect(onSave.mock.calls.at(-1)?.[0].items).toHaveLength(1);
  });
});
