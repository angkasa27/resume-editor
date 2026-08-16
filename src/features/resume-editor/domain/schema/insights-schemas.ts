import { z } from "zod";

/** The job target a resume was last analyzed against — lives on the draft so each
 *  resume keeps its own; lenient `weight` (see section-schemas.ts) so a model
 *  response drifting out of 0..1 can never fail the draft parse. */
const KEYWORD_CATEGORIES = [
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
  analyzedAt: z.string(),
});

export type ExtractedKeyword = z.infer<typeof extractedKeywordSchema>;
export type Insights = z.infer<typeof insightsSchema>;
