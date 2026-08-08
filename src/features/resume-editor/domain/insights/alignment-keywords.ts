import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { matchKeywords } from "./match-keywords";

/**
 * How many terms may travel with one rewrite request. The server enforces the
 * same cap; this exists so the *choice* of which terms survive is made here,
 * where weights are known, rather than by a blind truncation downstream.
 */
export const ALIGNMENT_KEYWORD_LIMIT = 12;

/**
 * The terms worth asking a rewrite to work in: the ones the resume is missing,
 * heaviest first.
 *
 * Sending every job-description keyword and letting the far end truncate is
 * worse than useless — extraction order has nothing to do with importance, so
 * the terms that actually matter can all fall outside the cap while a dozen
 * already-covered ones take their place.
 */
export function selectAlignmentKeywords(draft: ResumeDraft): string[] {
  const insights = draft.insights;
  if (!insights || insights.keywords.length === 0) return [];

  return matchKeywords(draft, insights.jobDescription, insights.keywords)
    .missing.slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, ALIGNMENT_KEYWORD_LIMIT)
    .map((keyword) => keyword.term);
}
