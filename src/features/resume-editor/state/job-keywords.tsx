"use client";

import { createContext, useContext } from "react";

const EMPTY: string[] = [];

/** Job terms carried to every rich-text field for the "Improve with AI" alignment.
 * Context, not props — the fields sit five layers down. Empty outside a provider. */
export const JobKeywordsContext = createContext<string[]>(EMPTY);

export function useJobKeywords(): string[] {
  return useContext(JobKeywordsContext);
}
