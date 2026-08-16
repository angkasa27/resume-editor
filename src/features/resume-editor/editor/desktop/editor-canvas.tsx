"use client";

import type { CSSProperties, ReactNode } from "react";

import { ZoomPill } from "@/features/resume-editor/editor/desktop/zoom-pill";

// Same color-mix recipe as the landing backdrops so it tracks the theme. No radial
// mask: unlike the landing, a workspace should read as one uniform surface edge to edge.
const dotGridStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, color-mix(in oklab, var(--foreground) 14%, transparent) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  // Viewport-anchored, else the origin rides the canvas's left edge and the
  // dots slide as the sidebar opens.
  backgroundAttachment: "fixed",
};

type EditorCanvasProps = {
  zoom: number;
  onZoomChange: (next: number) => void;
  children: ReactNode;
};

/** The document workspace: a dot-grid surface holding the paper, with a floating zoom pill. */
export function EditorCanvas({ zoom, onZoomChange, children }: EditorCanvasProps) {
  return (
    <main className="relative min-h-0 min-w-0 flex-1 bg-muted/40 print:bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 print:hidden"
        style={dotGridStyle}
      />

      {/* `zoom` not `transform`, so scroll measures the scaled paper. `min-w-fit` is load-bearing:
          without it scrollWidth ignores the start-side spill and zoom clips the left edge. */}
      <div className="absolute inset-0 overflow-auto">
        <div className="flex min-h-full w-full min-w-fit justify-center px-8 py-10">
          <div style={{ zoom }} className="origin-top print:zoom-[1]">
            {children}
          </div>
        </div>
      </div>

      <ZoomPill zoom={zoom} onZoomChange={onZoomChange} />
    </main>
  );
}
