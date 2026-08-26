import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CollectionSectionBody } from "@/features/resume-editor/editor/sections/collection-section-body";
import { EditorRevisionContext } from "@/features/resume-editor/state/editor-revision";
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
    // Appending auto-opens the new card and closes the first — one open at a time.
    // Bodies unmount after the close animation, not synchronously.
    await waitFor(() =>
      expect(screen.getAllByLabelText(/company name/i)).toHaveLength(1),
    );

    await user.type(screen.getAllByLabelText(/company name/i)[0], "Doomed");
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
    // Bodies unmount after the close animation, not synchronously.
    await waitFor(() =>
      expect(screen.getAllByLabelText(/company name/i)).toHaveLength(1),
    );

    // KeyboardSensor lifts on Space from the handle.
    screen.getAllByRole("button", { name: /^drag /i })[1].focus();
    await user.keyboard(" ");

    // Bodies unmount after the close animation, not synchronously.
    await waitFor(() =>
      expect(screen.queryAllByLabelText(/company name/i)).toHaveLength(0),
    );

    await user.keyboard(" ");
  });

  it("focuses the first field of the newly added item", async () => {
    // Click plus, then type — no extra click into the field.
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(
      <CollectionSectionBody
        draft={draft}
        sectionKey="workExperience"
        onSave={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add experience/i }));

    // Only the new card is open, so its company field is the one mounted.
    await waitFor(() => {
      const [input] = screen.getAllByLabelText(/company name/i);
      expect(input).toHaveFocus();
    });


  });
  it("leaves the open card alone when the draft is replaced under it", async () => {
    // Undo of a delete re-seeds the form with one more item. Keying "was added"
    // off fields.length made that open — and focus — the last card instead.
    const draftWith = (count: number) => {
      const draft = createDefaultResumeDraft();
      const [first] = draft.sections.workExperience.items;
      return {
        ...draft,
        sections: {
          ...draft.sections,
          workExperience: {
            ...draft.sections.workExperience,
            items: Array.from({ length: count }, (_, i) => ({
              ...first,
              id: `we-${i}`,
              companyName: `Company ${i}`,
            })),
          },
        },
      } as typeof draft;
    };

    function App({ revision, count }: { revision: number; count: number }) {
      return (
        <EditorRevisionContext.Provider value={revision}>
          <CollectionSectionBody
            draft={draftWith(count)}
            sectionKey="workExperience"
            onSave={vi.fn()}
          />
        </EditorRevisionContext.Provider>
      );
    }

    const { rerender } = render(<App revision={0} count={2} />);
    expect(screen.getAllByTestId("collection-item-card")[0]).toHaveAttribute(
      "data-open",
    );

    rerender(<App revision={1} count={3} />);
    await waitFor(() =>
      expect(screen.getAllByTestId("collection-item-card")).toHaveLength(3),
    );

    const cards = screen.getAllByTestId("collection-item-card");
    expect(cards[0]).toHaveAttribute("data-open");
    expect(cards[2]).not.toHaveAttribute("data-open");
    expect(document.body).toHaveFocus();
  });
});
