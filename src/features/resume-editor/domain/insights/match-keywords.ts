import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { extractResumeText } from "./extract-text";

// The keyword shape is defined with the persisted schema (it's saved on the
// draft), and re-exported here so the matcher stays the one import site.
export {
  KEYWORD_CATEGORIES,
  type ExtractedKeyword,
} from "@/features/resume-editor/domain/schema/insights-schemas";

import type { ExtractedKeyword } from "@/features/resume-editor/domain/schema/insights-schemas";

/** A keyword the resume only covers via an acronym/expansion of the JD's wording. */
export type PartialKeyword = ExtractedKeyword & {
  /** The variant actually found on the resume, e.g. "k8s" for a JD asking "Kubernetes". */
  foundAs: string;
};

export type JobMatchResult = {
  jobDescription: string;
  keywords: ExtractedKeyword[];
  matched: ExtractedKeyword[];
  /** Found only as an acronym/expansion — a literal ATS match would miss these. */
  partial: PartialKeyword[];
  missing: ExtractedKeyword[];
  /** 0..1 — weighted coverage. Partial matches count half. */
  coverage: number;
};

/** Weight a partial (acronym-only) match carries relative to a literal one. */
const PARTIAL_CREDIT = 0.5;

/** Common acronym ↔ expansion pairs. A hit on the *other* form is a partial
 *  match, not a full one: real ATS keyword screens compare literal strings, so
 *  writing only "K8s" loses you a JD that asks for "Kubernetes". */
const ALIASES: ReadonlyArray<[string, string]> = [
  ["javascript", "js"],
  ["typescript", "ts"],
  ["kubernetes", "k8s"],
  ["postgres", "postgresql"],
  ["amazon web services", "aws"],
  ["google cloud platform", "gcp"],
  ["continuous integration", "ci"],
  ["continuous delivery", "cd"],
  ["machine learning", "ml"],
  ["artificial intelligence", "ai"],
  ["user interface", "ui"],
  ["user experience", "ux"],
  ["application programming interface", "api"],
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

/** The other form of a term, when it has one. */
function aliasOf(normalized: string): string | undefined {
  for (const [long, short] of ALIASES) {
    if (normalized === long) return short;
    if (normalized === short) return long;
  }
  return undefined;
}

function containsTerm(haystack: string, variant: string): boolean {
  if (!variant) return false;
  // Word-boundary match on the variant (escape regex specials).
  const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\W)${escaped}(?:\\W|$)`, "i").test(haystack);
}

export function matchKeywords(
  draft: ResumeDraft,
  jobDescription: string,
  keywords: ExtractedKeyword[],
): JobMatchResult {
  const haystack = ` ${normalize(extractResumeText(draft))} `;
  const matched: ExtractedKeyword[] = [];
  const partial: PartialKeyword[] = [];
  const missing: ExtractedKeyword[] = [];

  for (const keyword of keywords) {
    const normalized = normalize(keyword.term);
    if (containsTerm(haystack, normalized)) {
      matched.push(keyword);
      continue;
    }

    const alias = aliasOf(normalized);
    if (alias && containsTerm(haystack, alias)) {
      partial.push({ ...keyword, foundAs: alias });
      continue;
    }

    missing.push(keyword);
  }

  const totalWeight = keywords.reduce((sum, kw) => sum + kw.weight, 0);
  const earnedWeight =
    matched.reduce((sum, kw) => sum + kw.weight, 0) +
    partial.reduce((sum, kw) => sum + kw.weight * PARTIAL_CREDIT, 0);
  const coverage = totalWeight === 0 ? 0 : earnedWeight / totalWeight;

  return { jobDescription, keywords, matched, partial, missing, coverage };
}
