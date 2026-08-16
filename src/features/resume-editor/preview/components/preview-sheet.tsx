"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { usePreviewScale } from "@/features/resume-editor/preview/components/use-preview-scale";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { useDocumentPagination } from "@/features/resume-editor/preview/use-document-pagination";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type PreviewSheetProps = {
  draft: ResumeDraft;
  presentation: ResumeDraft["pdfPresentation"];
};

export function PreviewSheet({ draft, presentation }: PreviewSheetProps) {
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const previewSheetRef = useRef<HTMLDivElement | null>(null);
  const { previewScale, previewShellSize } = usePreviewScale({
    sheetRef: previewSheetRef,
    viewportRef: previewViewportRef,
  });

  // Memoised because it is the pagination hook's re-run key: a fresh object
  // every render would re-run the pass on the render the pass itself caused.
  const sheetDraft = useMemo(
    () => ({ ...draft, pdfPresentation: presentation }),
    [draft, presentation],
  );

  // `transform` scale leaves layout alone but scales the rects the pass reads —
  // the same calibration that covers the canvas's `zoom`. The shell resizes on
  // its own via `usePreviewScale`'s ResizeObserver.
  const [pageCount, setPageCount] = useState(1);
  useDocumentPagination(
    previewSheetRef,
    sheetDraft,
    useCallback((next: number) => setPageCount(next), []),
  );

  return (
    <div className="h-full min-h-0 w-full overflow-y-auto overflow-x-hidden">
      <div
        ref={previewViewportRef}
        className="w-full min-w-0 overflow-hidden px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="flex w-full min-w-0 justify-center overflow-hidden">
          <div
            data-testid="resume-preview-scale-shell"
            className="relative shrink-0 overflow-hidden"
            style={{
              width: previewShellSize.width || undefined,
              height: previewShellSize.height || undefined,
            }}
          >
            <div
              ref={previewSheetRef}
              className="absolute left-0 top-0"
              style={
                {
                  transform:
                    previewScale < 1 ? `scale(${previewScale})` : undefined,
                  transformOrigin: "top left",
                  // Keeps the page-break chrome at its designed size while the
                  // paper shrinks to fit the phone.
                  "--preview-marker-scale":
                    previewScale < 1 ? 1 / previewScale : 1,
                } as CSSProperties
              }
            >
              <ResumeDocument draft={sheetDraft} pageCount={pageCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
