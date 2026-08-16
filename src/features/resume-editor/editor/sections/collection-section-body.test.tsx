import { render, screen, act, waitFor } from "@testing-library/react";
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
    // A removed card stays mounted through its exit animation, and its fields write
    // back into the spliced-out index — normalizing used to resurrect it as a blank item.
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

  it("collapses every item once a drag starts, not just the dragged one", async () => {
    // Mixed row heights make the swap preview unreadable. Safe only because the dragged
    // row is in a DragOverlay — its list slot collapses under it.
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

    // KeyboardSensor lifts on Space from the handle.
    screen.getAllByRole("button", { name: /^drag /i })[1].focus();
    await user.keyboard(" ");

    // Bodies unmount after the close animation, not synchronously.
    await waitFor(() =>
      expect(screen.queryAllByLabelText(/company name/i)).toHaveLength(0),
    );

    await user.keyboard(" ");
  });
});
