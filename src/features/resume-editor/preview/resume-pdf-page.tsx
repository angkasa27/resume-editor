"use client";

import { useCallback, useMemo, useRef } from "react";

import { useDocumentPagination } from "@/features/resume-editor/preview/use-document-pagination";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";
import { useClientReady } from "@/hooks/use-client-ready";
import { importResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function loadPdfDraftFromSession(isClientReady: boolean): {
  draft: ResumeDraft | null;
  error: string | null;
} {
  if (!isClientReady) {
    return { draft: null, error: null };
  }

  try {
    const serializedDraft = window.sessionStorage.getItem(
      RESUME_PDF_SESSION_STORAGE_KEY,
    );

    if (!serializedDraft) {
      return { draft: null, error: "No draft was provided for PDF export." };
    }

    return { draft: importResumeDraft(serializedDraft), error: null };
  } catch (nextError) {
    return {
      draft: null,
      error:
        nextError instanceof Error
          ? nextError.message
          : "Unable to load the draft for PDF export.",
    };
  }
}

export function ResumePdfPage() {
  const isClientReady = useClientReady();
  const pdfState = useMemo(
    () => loadPdfDraftFromSession(isClientReady),
    [isClientReady],
  );
  const hostRef = useRef<HTMLElement | null>(null);
  const { draft } = pdfState;

  // Flipped on the node rather than through state: the ready flag is what the
  // printer polls, and re-rendering here would throw away the layout the pass
  // just measured. The page count the pass returns is the preview's business.
  useDocumentPagination(
    hostRef,
    draft,
    useCallback(() => {
      const host = hostRef.current;
      if (host) host.dataset.pdfReady = "true";
    }, []),
  );

  if (pdfState.error) {
    return (
      <main
        data-pdf-ready="error"
        className="flex min-h-screen items-center justify-center bg-white p-6"
      >
        <p className="max-w-xl text-center text-sm text-destructive">
          {pdfState.error}
        </p>
      </main>
    );
  }

  if (!pdfState.draft) {
    return (
      <main
        data-pdf-ready="loading"
        className="flex min-h-screen items-center justify-center bg-white p-6"
      >
        <p className="text-sm text-muted-foreground">Preparing PDF…</p>
      </main>
    );
  }

  return (
    <main
      ref={hostRef}
      data-pdf-ready="loading"
      // `items-start` keeps the article at its content height: stretched to the
      // viewport it measures taller than its content, rounding a one-page résumé
      // up to two and leaving a blank sheet in the PDF.
      className="flex min-h-screen items-start justify-center bg-white p-0"
    >
      <ResumeDocument draft={pdfState.draft} mode="pdf" />
    </main>
  );
}
