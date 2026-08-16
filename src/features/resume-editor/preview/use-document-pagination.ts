"use client";

import { useEffect, useRef, type RefObject } from "react";

import { paginateResumeDocument } from "@/features/resume-editor/preview/paginate-document";

/** Runs the page-edge pass over the `.resume-document` inside `host` once fonts
 * and photos have settled, and reports the page count. The wait is load-bearing:
 * measuring before they load sizes every block against fallback metrics. */
export function useDocumentPagination(
  hostRef: RefObject<HTMLElement | null>,
  /** Re-runs the pass whenever this changes. The draft, for both callers. */
  source: unknown,
  onSettled: (pageCount: number) => void,
): void {
  // Held in a ref so an inline caller callback doesn't re-run the pass on every
  // render; synced first so it lands before the pass reads it.
  const onSettledRef = useRef(onSettled);
  useEffect(() => {
    onSettledRef.current = onSettled;
  }, [onSettled]);

  useEffect(() => {
    const host = hostRef.current;
    if (!source || !host) return;
    let isCurrent = true;

    // Forces layout before the wait: the fonts are `preload: false`, so Chrome
    // only requests one once text is laid out in it — awaiting `fonts.ready`
    // straight out of commit resolves immediately, and the pass measures fallbacks.
    void host.offsetHeight;

    let pageCount = 1;

    void Promise.all([
      document.fonts.ready,
      // A failed image still resolves: a missing photo must not stall the export.
      ...Array.from(host.querySelectorAll("img"), (image) =>
        image.decode().catch(() => undefined),
      ),
    ])
      .then(() => {
        if (!isCurrent) return;
        const article = host.querySelector<HTMLElement>(".resume-document");
        if (article) pageCount = paginateResumeDocument(article);
      })
      // Bad page breaks beat no PDF: export the unpaginated document rather
      // than leave the printer waiting on a ready flag that never flips.
      .catch((error: unknown) => console.error("Resume pagination failed", error))
      .then(() => {
        if (isCurrent) onSettledRef.current(pageCount);
      });

    return () => {
      isCurrent = false;
    };
  }, [hostRef, source]);
}
