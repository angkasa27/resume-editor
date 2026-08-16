import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { PaginatedPreview } from "@/features/resume-editor/preview/components/paginated-preview";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

// jsdom has no layout, so the real pass measures zeroes and does nothing useful,
// and it has no `document.fonts` for the hook to await. This test is about
// React's reconciliation around the nodes the pass inserts, not the geometry.
vi.mock("@/features/resume-editor/preview/use-document-pagination", () => ({
  useDocumentPagination: () => undefined,
}));

function draftWith(layoutId: ResumeDraft["pdfPresentation"]["layoutId"]) {
  const draft = createDefaultResumeDraft();
  return {
    ...draft,
    pdfPresentation: { ...draft.pdfPresentation, layoutId },
  };
}

describe("PaginatedPreview", () => {
  it("rebuilds the document when the layout changes, dropping the pass's spacers", () => {
    // The pass inserts plain DOM nodes React does not own; reconciling a different
    // tree around them stranded the spacers, breaking the breaks.
    const { container, rerender } = render(
      <PaginatedPreview draft={draftWith("classic")} />,
    );

    const before = container.querySelector(".resume-document");
    expect(before).not.toBeNull();

    const spacer = document.createElement("div");
    spacer.dataset.pageSpacer = "";
    before!.append(spacer);

    rerender(<PaginatedPreview draft={draftWith("numeral")} />);

    const after = container.querySelector(".resume-document");
    expect(after).not.toBe(before);
    expect(container.querySelector("[data-page-spacer]")).toBeNull();
  });

  it("keeps the same document node when only the style changes", () => {
    // Restyling must not remount the document, or every Design-panel keystroke
    // would flash the whole page.
    const base = draftWith("classic");
    const { container, rerender } = render(<PaginatedPreview draft={base} />);
    const before = container.querySelector(".resume-document");

    rerender(
      <PaginatedPreview
        draft={{
          ...base,
          pdfPresentation: { ...base.pdfPresentation, accent: "#facade" },
        }}
      />,
    );

    expect(container.querySelector(".resume-document")).toBe(before);
  });
});
