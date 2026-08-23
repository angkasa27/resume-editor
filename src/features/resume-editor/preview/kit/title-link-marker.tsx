"use client";

import { ArrowUpRight, Link } from "lucide-react";
import { createContext, useContext } from "react";

/** Which glyph, if any, marks a linked item title. Chosen per layout. */
export type TitleLinkMarker = "arrow" | "link";

const TitleLinkMarkerContext = createContext<TitleLinkMarker | undefined>(
  undefined,
);

export const TitleLinkMarkerProvider = TitleLinkMarkerContext.Provider;

/** Item views only receive `{ item }`, so the layout's choice arrives by context
 *  instead of a prop threaded through every item component. */
export function TitleLinkMarkerIcon() {
  const marker = useContext(TitleLinkMarkerContext);
  if (!marker) return null;
  const Icon = marker === "link" ? Link : ArrowUpRight;
  return <Icon className="link-marker" aria-hidden={true} />;
}
