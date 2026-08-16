import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { matchKeywords } from "./match-keywords";

/** Max terms per rewrite request — the server caps too, but the choice of which
 *  survive is made here, where weights are known, not by blind truncation. */
export const ALIGNMENT_KEYWORD_LIMIT = 12;

/** The terms worth a rewrite: the ones the resume is missing, heaviest first.
 *  Sending everything and letting the far end truncate is worse than useless — extraction order ≠ importance. */
export function selectAlignmentKeywords(draft: ResumeDraft): string[] {
  const insights = draft.insights;
  if (!insights || insights.keywords.length === 0) return [];

  return matchKeywords(draft, insights.jobDescription, insights.keywords)
    .missing.slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, ALIGNMENT_KEYWORD_LIMIT)
    .map((keyword) => keyword.term);
}
