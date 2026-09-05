"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { ZoomPill } from "@/features/resume-editor/editor/desktop/zoom-pill";
import {
  clampZoom,
  ZOOM_DEFAULT,
} from "@/features/resume-editor/editor/desktop/zoom";

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

/** A pan counts as a click (deselect) only if the pointer barely moved. */
const CLICK_SLOP = 4;
/** Paper edge kept inside the viewport, so it can never be panned out of reach. */
const KEEP_VISIBLE = 120;
/** Gap above the paper when the canvas first centres it. */
const TOP_INSET = 40;
/** Fallback px for a wheel reporting lines (Firefox mice) rather than pixels. */
const LINE_HEIGHT = 16;
/** Quiet time after a gesture before the paper is re-rasterised sharp. */
const SETTLE_MS = 120;

/** Elements that own the space bar themselves. */
const INTERACTIVE =
  "button, a[href], input, textarea, select, summary, [role='button'], [role='checkbox'], [role='switch'], [role='tab'], [tabindex]:not([tabindex='-1'])";

/** Where the paper sits: pan offset in viewport px, plus its scale. */
type View = { x: number; y: number; zoom: number };

/** Wheel input gathered between two frames. */
type PendingWheel = {
  dx: number;
  dy: number;
  /** Multiplied, not summed: zoom composes. 1 = no zoom this frame. */
  factor: number;
  clientX: number;
  clientY: number;
};

const NO_WHEEL: PendingWheel = { dx: 0, dy: 0, factor: 1, clientX: 0, clientY: 0 };

/** Wheel deltas in px. Firefox mice report DOM_DELTA_LINE, where deltaY is a line count. */
function wheelDelta(event: WheelEvent, viewport: HTMLElement) {
  // A page-mode delta is a page along its own axis, so each axis takes its own span.
  if (event.deltaMode === 2) {
    return {
      x: event.deltaX * viewport.clientWidth,
      y: event.deltaY * viewport.clientHeight,
    };
  }
  const unit = event.deltaMode === 1 ? LINE_HEIGHT : 1;
  return { x: event.deltaX * unit, y: event.deltaY * unit };
}

type EditorCanvasProps = {
  /** A click on the dotted surface outside the paper — the deselect gesture. */
  onBackgroundClick?: () => void;
  children: ReactNode;
};

/**
 * The document workspace: an infinite dot-grid surface holding the paper, panned
 * and zoomed like a design tool.
 *
 * The paper rides a `translate`/`scale` transform rather than a scroll container:
 * scrolling can only reach content that overflows, so a paper smaller than the
 * viewport had no horizontal travel at all. Pagination measures rects and
 * calibrates its own scale factor, so it reads a transform exactly as it read
 * the `zoom` this replaced.
 *
 * The view lives in a ref written straight to the paper's `style`, never rendered
 * from state: a trackpad ships wheel events faster than React can re-render the
 * preview, and routing every one through state left the paper lagging the cursor
 * and shivering. State carries only the number the zoom pill prints, synced once
 * a frame.
 */
export function EditorCanvas({
  onBackgroundClick,
  children,
}: EditorCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const view = useRef<View>({ x: 0, y: TOP_INSET, zoom: ZOOM_DEFAULT });
  /** The paper's untransformed size, so clamping never forces a layout. */
  const paperSize = useRef({ width: 0, height: 0 });
  const syncFrame = useRef(0);
  const wheelFrame = useRef(0);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wheel = useRef<PendingWheel>({ ...NO_WHEEL });
  // A text selection dragged off the paper fires `click` on the viewport, so the
  // gesture is judged by where it started, not where it ended.
  const downOnPaper = useRef(false);
  const dragged = useRef(false);
  /** The pointer currently panning; a second one must not stack another drag. */
  const panPointer = useRef<number | null>(null);
  const [zoomLabel, setZoomLabel] = useState(ZOOM_DEFAULT);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [panning, setPanning] = useState(false);

  /** Writes the view to the DOM, and lets the pill catch up at frame rate. */
  const paint = useCallback(() => {
    const paper = paperRef.current;
    if (!paper) return;
    const { x, y, zoom } = view.current;
    paper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
    // Promoted only while the gesture runs. A composited layer is scaled as a
    // bitmap, so text blurs at any scale it was not rasterised at; dropping the
    // hint once the fingers stop makes the browser redraw it sharp.
    paper.style.willChange = "transform";
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      paper.style.willChange = "";
    }, SETTLE_MS);
    if (syncFrame.current) return;
    syncFrame.current = requestAnimationFrame(() => {
      syncFrame.current = 0;
      setZoomLabel(view.current.zoom);
    });
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(syncFrame.current);
      cancelAnimationFrame(wheelFrame.current);
      clearTimeout(settleTimer.current);
    },
    [],
  );

  /**
   * Holds the paper's edges inside the viewport, against the cached
   * untransformed size: the bound never depends on a transform that has yet to
   * paint, and no gesture step pays for a layout.
   */
  const clampView = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const next = view.current;
    const width = paperSize.current.width * next.zoom;
    const height = paperSize.current.height * next.zoom;
    next.x = Math.min(
      viewport.clientWidth - KEEP_VISIBLE,
      Math.max(KEEP_VISIBLE - width, next.x),
    );
    next.y = Math.min(
      viewport.clientHeight - KEEP_VISIBLE,
      Math.max(KEEP_VISIBLE - height, next.y),
    );
  }, []);

  /** Zoom keeping the point at (clientX, clientY) pinned under the cursor. */
  const zoomAt = useCallback(
    (next: number, clientX: number, clientY: number) => {
      const viewport = viewportRef.current;
      const current = view.current;
      if (!viewport || next === current.zoom) return;
      const box = viewport.getBoundingClientRect();
      const cx = clientX - box.left;
      const cy = clientY - box.top;
      const ratio = next / current.zoom;
      current.x = cx - (cx - current.x) * ratio;
      current.y = cy - (cy - current.y) * ratio;
      current.zoom = next;
      clampView();
      paint();
    },
    [clampView, paint],
  );

  /** Paper centred at the top of the viewport, at `nextZoom`. */
  const centreView = useCallback(
    (nextZoom: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      view.current = {
        x: (viewport.clientWidth - paperSize.current.width * nextZoom) / 2,
        y: TOP_INSET,
        zoom: nextZoom,
      };
      paint();
    },
    [paint],
  );

  // Keep the measurement fresh off the gesture path: the paper's untransformed
  // size only changes when the document does. Centre once, on the first read.
  useLayoutEffect(() => {
    const paper = paperRef.current;
    if (!paper) return;
    let centred = false;
    const observer = new ResizeObserver(() => {
      paperSize.current = { width: paper.offsetWidth, height: paper.offsetHeight };
      if (centred) return;
      centred = true;
      // Only the first layout centres: after that the view is the user's, and a
      // re-centre on every sidebar toggle would yank it back.
      centreView(ZOOM_DEFAULT);
    });
    observer.observe(paper);
    return () => observer.disconnect();
  }, [centreView]);

  // Non-passive: plain wheel pans (a trackpad's two-finger scroll arrives here,
  // deltaX included) and ctrl/⌘+wheel — which is also what a pinch reports — zooms.
  //
  // A trackpad ships wheel events faster than the screen refreshes, so the
  // handler only banks the delta; one frame's worth is applied per frame. Doing
  // the work per event queued a backlog that ran on after the fingers lifted.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const flush = () => {
      wheelFrame.current = 0;
      const banked = wheel.current;
      wheel.current = { ...NO_WHEEL };
      if (banked.dx || banked.dy) {
        view.current.x -= banked.dx;
        view.current.y -= banked.dy;
        clampView();
        paint();
      }
      if (banked.factor !== 1) {
        zoomAt(
          clampZoom(view.current.zoom * banked.factor),
          banked.clientX,
          banked.clientY,
        );
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = wheelDelta(event, viewport);
      const banked = wheel.current;
      if (event.ctrlKey || event.metaKey) {
        // Mouse wheels ship ±100 per notch where a pinch ships single digits;
        // unclamped that is a 2.7× jump per notch.
        const step = Math.max(-16, Math.min(16, delta.y));
        banked.factor *= Math.exp(-step * 0.01);
        banked.clientX = event.clientX;
        banked.clientY = event.clientY;
      } else {
        banked.dx += delta.x;
        banked.dy += delta.y;
      }
      if (!wheelFrame.current) {
        wheelFrame.current = requestAnimationFrame(flush);
      }
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [clampView, paint, zoomAt]);

  // Space-to-pan, Figma style: over the paper too, where a plain drag selects text.
  useEffect(() => {
    const release = () => setSpaceHeld(false);
    const down = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      // Space belongs to whatever has focus — it activates a button, checks a
      // checkbox, types a word. The canvas only claims it when nothing does.
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      if (target?.closest(INTERACTIVE)) return;
      event.preventDefault();
      setSpaceHeld(true);
    };
    const up = (event: KeyboardEvent) => {
      if (event.code === "Space") release();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    // A keyup landing in another window never reaches this one, which would
    // leave the canvas latched in pan mode.
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", release);
    };
  }, []);

  return (
    <main className="relative min-h-0 min-w-0 flex-1 bg-muted/40 print:bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 print:hidden"
        style={dotGridStyle}
      />

      <div
        ref={viewportRef}
        className="absolute inset-0 overflow-hidden print:static print:overflow-visible"
        style={{ cursor: panning ? "grabbing" : "grab" }}
        onPointerDown={(event) => {
          const onPaper = Boolean(
            (event.target as HTMLElement).closest("[data-paper]"),
          );
          downOnPaper.current = onPaper;
          dragged.current = false;
          // The dotted surface always drags. On the paper, only space-hold or the
          // middle button pan — a plain drag there is still a text selection.
          const pans =
            event.button === 1 ||
            (event.button === 0 && (spaceHeld || !onPaper));
          if (!pans || panPointer.current !== null) return;
          event.preventDefault();
          const viewport = event.currentTarget;
          const pointerId = event.pointerId;
          viewport.setPointerCapture(pointerId);
          panPointer.current = pointerId;
          setPanning(true);
          const startX = event.clientX;
          const startY = event.clientY;
          let lastX = startX;
          let lastY = startY;
          const move = (moved: PointerEvent) => {
            if (moved.pointerId !== pointerId) return;
            // Measured from where the drag started: per-move deltas are
            // sub-pixel on a slow drag, which would read as a click.
            if (
              Math.abs(moved.clientX - startX) +
                Math.abs(moved.clientY - startY) >
              CLICK_SLOP
            ) {
              dragged.current = true;
            }
            view.current.x += moved.clientX - lastX;
            view.current.y += moved.clientY - lastY;
            lastX = moved.clientX;
            lastY = moved.clientY;
            clampView();
            paint();
          };
          const stop = (ended: PointerEvent) => {
            if (ended.pointerId !== pointerId) return;
            viewport.removeEventListener("pointermove", move);
            viewport.removeEventListener("pointerup", stop);
            viewport.removeEventListener("pointercancel", stop);
            panPointer.current = null;
            setPanning(false);
          };
          viewport.addEventListener("pointermove", move);
          viewport.addEventListener("pointerup", stop);
          viewport.addEventListener("pointercancel", stop);
        }}
        onClick={(event) => {
          if (!onBackgroundClick || downOnPaper.current || dragged.current) {
            return;
          }
          if (!(event.target as HTMLElement).closest("[data-paper]")) {
            onBackgroundClick();
          }
        }}
      >
        {/* No `transform` in this style: the view is written to the node directly,
            and a render carrying a stale one would fight the gesture. */}
        <div
          ref={paperRef}
          data-paper
          className="absolute top-0 left-0 w-fit print:relative print:[transform:none]!"
          style={{
            transformOrigin: "0 0",
            cursor: spaceHeld || panning ? "inherit" : "auto",
            // Nothing under the pointer should start a selection mid-pan.
            userSelect: spaceHeld || panning ? "none" : undefined,
          }}
        >
          {children}
        </div>
      </div>

      <ZoomPill
        zoom={zoomLabel}
        onZoomChange={(next) => {
          const box = viewportRef.current?.getBoundingClientRect();
          if (!box) return;
          // The pill has no cursor to pin, so it zooms about the viewport centre.
          zoomAt(next, box.left + box.width / 2, box.top + box.height / 2);
        }}
        onResetView={() => centreView(ZOOM_DEFAULT)}
      />
    </main>
  );
}
