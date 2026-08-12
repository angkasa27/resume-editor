/** Background is pinned across every state (hover/expanded/dark) — hover feedback comes from the border/ring instead, like `Input`. */
export const FIELD_CONTROL_CLASS = [
  "h-9 w-full rounded-md border border-input px-2.5 py-1 text-base shadow-xs md:text-sm",
  "transition-[color,box-shadow] outline-none",
  "bg-background hover:bg-background aria-expanded:bg-background data-popup-open:bg-background",
  // dark: stated explicitly — Input/Textarea/etc. carry `dark:bg-input/30`, which twMerge keeps and which
  // outranks a bare `bg-background` on specificity, putting controls back on grey without this.
  "dark:bg-background dark:hover:bg-background",
  "hover:border-ring",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

export const FOCUS_RING_CLASS =
  "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

/** Colour stays at the call site, and it is `ring-primary` everywhere — cards and swatches alike. */
export const SELECTION_RING_CLASS =
  // eslint-disable-next-line no-restricted-syntax -- the one definition the rule points at
  "aria-pressed:ring-2 aria-pressed:ring-offset-2 aria-pressed:ring-offset-background";

/** Paired with `variant="ghost" size="icon-sm"` — a filled destructive button repeated down a list shouts. */
export const DESTRUCTIVE_ICON_CLASS =
  "shrink-0 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive";
