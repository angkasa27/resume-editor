import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "../resume-document.module.css";
import type { PreviewRenderContext } from "../types";

/**
 * Where each sheet ends, drawn only in the editor. Positioned off
 * --resume-paper-height; --preview-marker-scale counters a shrink-to-fit
 * `transform: scale()` so the chrome doesn't shrink with the paper.
 */
function PageBreakMarkers({ pageCount }: { pageCount: number }) {
  return (
    <>
      {Array.from({ length: pageCount - 1 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          data-page-marker=""
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-neutral-300 print:hidden"
          style={{
            top: `calc(${index + 1} * var(--resume-paper-height))`,
            borderTopWidth: "calc(1px * var(--preview-marker-scale, 1))",
          }}
        >
          <span
            className="absolute right-2 top-1 origin-top-right rounded bg-neutral-100 px-1.5 py-0.5 font-sans text-xs font-medium tracking-wide text-neutral-500"
            style={{ transform: "scale(var(--preview-marker-scale, 1))" }}
          >
            Page {index + 2}
          </span>
        </div>
      ))}
    </>
  );
}

export function PreviewDocumentRoot({
  context,
  className,
  children,
  pageCount,
}: {
  context: PreviewRenderContext;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  /** Editor only: draws a boundary after each page but the last. */
  pageCount?: number;
}) {
  const { presentation, mode } = context;
  // Full-bleed in both modes (preview and pdf render identically); layouts own
  // their insets via the shared `page-inset` utilities / --resume-page-margin.
  const rootStyle: CSSProperties = {
    width: "var(--resume-paper-width)",
    padding: "0",
  };

  return (
    <article
      data-layout={presentation.layoutId}
      data-link-highlight={presentation.linkHighlight ? "on" : "off"}
      style={{
        ...(presentation.vars as CSSProperties),
        ...rootStyle,
      }}
      className={cn(
        styles.root,
        "resume-document",
        mode === "preview"
          ? "relative mx-0 max-w-none bg-white shadow-xl ring-1 ring-border print:min-h-0 print:max-w-none print:bg-white print:shadow-none print:ring-0"
          : "mx-0 max-w-none bg-white ring-0",
        className,
      )}
    >
      {children}
      {/* After the children, so the marker doesn't take the stretched first-child
          slot. Neutral, not themed — the paper stays white in dark mode. */}
      {mode === "preview" && pageCount && pageCount > 1 ? (
        <PageBreakMarkers pageCount={pageCount} />
      ) : null}
    </article>
  );
}
