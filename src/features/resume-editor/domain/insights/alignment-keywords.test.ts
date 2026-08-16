import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { ExtractedKeyword } from "@/features/resume-editor/domain/schema/insights-schemas";

import {
  ALIGNMENT_KEYWORD_LIMIT,
  selectAlignmentKeywords,
} from "./alignment-keywords";

function draftWith(keywords: ExtractedKeyword[]): ResumeDraft {
  const draft = createDefaultResumeDraft();
  draft.sections.skills.items = [
    { id: "s1", categoryName: "Core", skills: ["React"] },
  ];
  draft.insights = {
    jobDescription: "…",
    keywords,
    analyzedAt: "2026-08-08T00:00:00.000Z",
  };
  return draft;
}

const kw = (term: string, weight: number): ExtractedKeyword => ({
  term,
  category: "hard-skill",
  weight,
});

describe("selectAlignmentKeywords", () => {
  it("returns nothing without an analyzed job description", () => {
    expect(selectAlignmentKeywords(createDefaultResumeDraft())).toEqual([]);
  });

  it("offers only terms the resume is missing", () => {
    // "React" is in the skills list; the other two are not.
    const draft = draftWith([
      kw("React", 1),
      kw("Zircondrive", 0.9),
      kw("Quantumfoil", 0.8),
    ]);

    expect(selectAlignmentKeywords(draft)).toEqual([
      "Zircondrive",
      "Quantumfoil",
    ]);
  });

  it("orders by weight, heaviest first", () => {
    const draft = draftWith([
      kw("Zircondrive", 0.2),
      kw("Quantumfoil", 0.9),
      kw("Blorptech", 0.5),
    ]);

    expect(selectAlignmentKeywords(draft)).toEqual([
      "Quantumfoil",
      "Blorptech",
      "Zircondrive",
    ]);
  });

  // Regression: extraction order ≠ importance, so blind truncation could drop the
  // terms that mattered and keep a dozen that didn't.
  it("keeps the heaviest terms when more exist than the cap allows", () => {
    const many = Array.from({ length: 40 }, (_, i) =>
      kw(`Zzterm${i}`, i / 40),
    );
    const selected = selectAlignmentKeywords(draftWith(many));

    expect(selected).toHaveLength(ALIGNMENT_KEYWORD_LIMIT);
    expect(selected[0]).toBe("Zzterm39");
    expect(selected).not.toContain("Zzterm0");
  });
});
