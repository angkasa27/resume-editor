import type { ReactNode } from "react";

/** A date line that disappears when there is no date. Emptiness is a property
 * of the data, so it's handled once here rather than guarded at every call
 * site. Children are often several parts (a date plus a `· GPA`/`· ID`
 * suffix), so emptiness means *every* part is blank. */
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
