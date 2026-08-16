"use client";

import { GripVerticalIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type RowDragHandleProps = ComponentProps<"button"> & {
  /** Announced as "Drag <label>". */
  label: string;
};

/** The grip on a sortable row, shared by section and item rows. */
export function RowDragHandle({
  label,
  className,
  onKeyDown,
  ...props
}: RowDragHandleProps) {
  return (
    <button
      type="button"
      aria-label={`Drag ${label}`}
      // The row is the click target; the grip must not activate it.
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        // dnd-kit's KeyboardSensor lifts and drops on Space, from this element.
        onKeyDown?.(event);
        // preventDefault, not stopPropagation — dnd-kit's document listeners need the event.
        if (event.key === " ") event.preventDefault();
      }}
      className={cn(
        "flex cursor-grab touch-none items-center text-muted-foreground/40 transition-colors group-hover/row:text-muted-foreground/70 hover:text-foreground! active:cursor-grabbing",
        className,
      )}
      {...props}
    >
      <GripVerticalIcon className="size-4" />
    </button>
  );
}
