import type { ReactNode } from "react";

/**
 * A date line that disappears when there is no date.
 *
 * Rendering the element unconditionally looked harmless while `.item-date` was
 * bare text, but layouts decorate it — studio draws it as an outlined pill, and
 * an award with no issue date printed an empty pill. Anywhere else it still
 * costs a row of `gap`. Emptiness is a property of the data, so it is handled
 * once here rather than guarded at every call site.
 *
 * Children are often several parts (a date plus a `· GPA`/`· ID` suffix), so
 * emptiness means *every* part is blank. Call sites join their parts with
 * `joinParts`, which drops the blanks and can't leave a stray leading `·`, but
 * a bare `··` with nothing between is still exactly the artefact this exists
 * to prevent, so the per-part check stays.
 */
export function ItemDate({ children }: { children?: ReactNode }) {
  const parts = Array.isArray(children) ? children : [children];
  const hasContent = parts.some((part) =>
    typeof part === "string" || typeof part === "number"
      ? String(part).trim().length > 0
      : part != null && part !== false,
  );
  if (!hasContent) return null;

  return <div className="item-date">{children}</div>;
}
