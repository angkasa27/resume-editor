"use client";

import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { FOCUS_RING_CLASS } from "@/features/resume-editor/forms/fields/field-control";

type EditorRowProps = {
  /** Drag grip; a fixed-width spacer keeps the left edge even when absent. */
  handle?: ReactNode;
  /** Section icon (section rows) or disclosure chevron (item rows). */
  leading?: ReactNode;
  title: string;
  /** Muted meta after the title — the item count on section rows. */
  badge?: ReactNode;
  /** Affordance before the menu — the nav chevron on section rows. */
  indicator?: ReactNode;
  /** The overflow menu — same slot on every row kind, so delete always sits in one place. */
  menu?: ReactNode;
  active?: boolean;
  /** Section rows open the form; item rows toggle their accordion. */
  onActivate: () => void;
  className?: string;
};

/** One row at both levels: sections in the list and items in a section.
 * `div role="button"` because rows nest interactive controls (grip, menu). */
export function EditorRow({
  handle,
  leading,
  title,
  badge,
  indicator,
  menu,
  active = false,
  onActivate,
  className,
}: EditorRowProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Ignore keys bubbling from the grip/menu — dnd-kit lifts on Space there too.
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/row flex cursor-pointer select-none items-center gap-2 rounded-md border border-border bg-background p-2 outline-none transition-colors",
        FOCUS_RING_CLASS,
        "aria-pressed:bg-muted aria-[pressed=false]:hover:bg-muted/60",
        className,
      )}
    >
      {handle ? (
        <span className="flex w-4 shrink-0 items-center justify-center">
          {handle}
        </span>
      ) : null}
      {leading ? (
        <span
          className={cn(
            "flex shrink-0 text-muted-foreground group-aria-pressed/row:text-foreground [&_svg]:size-4",
          )}
        >
          {leading}
        </span>
      ) : null}
      <span className={cn("min-w-0 truncate text-sm font-medium")}>
        {title}
      </span>
      {badge}
      <span className="flex-1" />
      {menu}
      {indicator}
    </div>
  );
}
