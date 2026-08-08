"use client";

import { createContext, useContext } from "react";

const EMPTY: string[] = [];

/**
 * The analyzed job description's terms, carried to every rich-text field so the
 * "Improve with AI" dialog can offer to align content with the target role.
 * A context rather than props: the fields sit five layers down the form tree,
 * and this is read-only data none of those layers care about — same reasoning
 * as `EditorRevisionContext`.
 *
 * Defaults to empty, so a field outside a provider (tests, the print route)
 * simply doesn't show the job-alignment action.
 */
export const JobKeywordsContext = createContext<string[]>(EMPTY);

export function useJobKeywords(): string[] {
  return useContext(JobKeywordsContext);
}
