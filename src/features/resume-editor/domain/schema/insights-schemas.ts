import { z } from "zod";

/**
 * The saved job target a resume was last analyzed against. It lives on the
 * draft rather than in browser storage so each resume keeps its own — the old
 * single localStorage key meant every resume shared one job description.
 *
 * Lenient like the rest of the persisted schema (see section-schemas.ts):
 * `weight` is unbounded here so a model response that drifts out of 0..1 can
 * never make the whole draft fail to parse.
 */
export const KEYWORD_CATEGORIES = [
  "hard-skill",
  "soft-skill",
  "title",
  "qualification",
  "tool",
] as const;

export const extractedKeywordSchema = z.object({
  term: z.string().min(1),
  category: z.enum(KEYWORD_CATEGORIES),
  weight: z.number(),
});

export const insightsSchema = z.object({
  jobDescription: z.string(),
  keywords: z.array(extractedKeywordSchema),
  /** ISO timestamp of the analysis run. */
  analyzedAt: z.string(),
});

export type KeywordCategory = (typeof KEYWORD_CATEGORIES)[number];
export type ExtractedKeyword = z.infer<typeof extractedKeywordSchema>;
export type Insights = z.infer<typeof insightsSchema>;
