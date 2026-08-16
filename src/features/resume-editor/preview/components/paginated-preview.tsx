"use client";

import { useCallback, useRef, useState } from "react";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { useDocumentPagination } from "@/features/resume-editor/preview/use-document-pagination";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";

/**
 * The editor's copy of the paper, laid out in pages by the same pass the export
 * runs — so a break the user sees here is the break they get in the PDF, rather
 * than a second implementation kept in sync by hand.
 *
 * No debounce of its own: the store already commits on a 500ms debounce (see
 * SAVE-FLOW.md), so `draft` changes at most that often while typing.
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
    // Re-rendering here is safe and intended, unlike on the PDF page: React
    // leaves the pass's spacers alone (they are not its nodes), and the markers
    // need the count. The setter bails when the count is unchanged, so a pass
    // that shifts nothing costs no render.
    useCallback((next: number) => setPageCount(next), []),
  );

  return (
    <div ref={hostRef}>
      {/* Keyed on the layout so switching one rebuilds the document instead of
          reconciling into it. The pass's spacers are raw DOM nodes React does
          not own: reconciling a *different* layout's component tree around them
          leaves them stranded in containers they were never measured against,
          which is why a layout change produced broken breaks that a reload
          fixed. A remount throws the whole subtree — spacers included — away. */}
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
