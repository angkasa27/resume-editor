import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HTMLMotionProps } from "motion/react";

import { motionTokens } from "@/lib/motion-tokens";

/** Wires a row into dnd-kit sortable context, shared by section and item rows so the
 * drag/motion wiring can't drift. Motion is opacity-only — dnd-kit owns `transform`. */
export function useSortableRow(id: string, hasDragOverlay = false) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  // RowDragHandle carries the drag role; a duplicate on the wrapper confuses assistive tech.
  const { role: _role, tabIndex: _tabIndex, ...dragAttributes } = attributes;
  void _role;
  void _tabIndex;

  const motionProps: HTMLMotionProps<"div"> = {
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
      // With an overlay the source must vanish (`visibility`, not opacity — a fade
      // back on drop reads as a flash once the overlay is gone).
      visibility: hasDragOverlay && isDragging ? "hidden" : undefined,
    },
    initial: { opacity: 0 },
    animate: { opacity: isDragging ? 0.8 : 1 },
    exit: { opacity: 0 },
    transition: { duration: motionTokens.duration.fast },
  };

  return { setNodeRef, isDragging, dragAttributes, listeners, motionProps };
}
