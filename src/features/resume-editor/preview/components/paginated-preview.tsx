"use client";

import { useCallback, useRef, useState } from "react";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { useDocumentPagination } from "@/features/resume-editor/preview/use-document-pagination";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";

/**
 * The editor's copy of the paper, laid out by the same pass the export runs, so
 * a break seen here is the break in the PDF. No debounce of its own: the store
 * already commits on a 500ms debounce (docs/save-flow.md).
 */
export function PaginatedPreview({
  draft,
  onSelectSection,
  activeSection,
}: {
  draft: ResumeDraft;
  onSelectSection?: (panel: EditorPanelKey) => void;
  activeSection?: EditorPanelKey | null;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const { layoutId } = draft.pdfPresentation;

  useDocumentPagination(
    hostRef,
    draft,
    // Re-rendering here is safe and intended: the setter bails when the count
    // is unchanged, so a pass that shifts nothing costs no render.
    useCallback((next: number) => setPageCount(next), []),
  );

  return (
    <div ref={hostRef}>
      {/* Keyed on the layout so switching one remounts the document: the pass's
          spacers are raw DOM nodes React does not own, and reconciling a
          different layout's tree around them strands them in unmeasured
          containers. */}
      <ResumeDocument
        key={layoutId}
        draft={draft}
        onSelectSection={onSelectSection}
        activeSection={activeSection}
        pageCount={pageCount}
      />
    </div>
  );
}
