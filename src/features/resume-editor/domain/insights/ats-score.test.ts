import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { computeAtsScore, type AtsCategory, type Suggestion } from "./ats-score";
import type { JobMatchResult } from "./match-keywords";

function scoreOf(draft: ResumeDraft, category: AtsCategory) {
  return computeAtsScore(draft).breakdown[category]?.pct ?? 0;
}

function find(draft: ResumeDraft, id: string): Suggestion | undefined {
  return computeAtsScore(draft).suggestions.find((s) => s.id === id);
}

/** A draft whose only bullets are the one role under test, so content ratios are exact. */
function withRole(overrides: Partial<ResumeDraft["sections"]["workExperience"]["items"][number]>) {
  const draft = createDefaultResumeDraft();
  for (const key of [
    "projects",
    "education",
    "awards",
    "organizationVolunteering",
  ] as const) {
    for (const item of draft.sections[key].items) item.description = "";
  }
  draft.sections.workExperience.items = [
    {
      id: "we-1",
      companyName: "Acme",
      position: "Engineer",
      location: "Remote",
      startDate: "Jan 2024",
      endDate: "current",
      description: "<ul><li>Led a migration that cut p95 latency by 40%</li></ul>",
      ...overrides,
    },
  ];
  return draft;
}

describe("computeAtsScore", () => {
  it("returns a 0-100 score and omits job match without a job description", () => {
    const result = computeAtsScore(createDefaultResumeDraft());
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.breakdown.jobMatch).toBeNull();
  });

  it("reports passing checks too, so the score is explainable", () => {
    const result = computeAtsScore(createDefaultResumeDraft());
    expect(result.suggestions.some((s) => s.severity === "ok")).toBe(true);
  });

  it("never attaches a Fix action to a passing check", () => {
    const passing = computeAtsScore(createDefaultResumeDraft()).suggestions.filter(
      (s) => s.severity === "ok",
    );
    expect(passing.length).toBeGreaterThan(0);
    expect(passing.every((s) => s.fix === undefined)).toBe(true);
  });

  it("sorts fails ahead of warns ahead of passes", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.email = ""; // fail
    draft.profile.phone = ""; // warn

    const severities = computeAtsScore(draft).suggestions.map((s) => s.severity);
    expect(severities.indexOf("fail")).toBe(0);
    expect(severities.indexOf("warn")).toBeGreaterThan(0);
    expect(severities.lastIndexOf("warn")).toBeLessThan(
      severities.indexOf("ok"),
    );
  });
});

/** Every field blanked, but structurally valid (sections keep their min(1) row). */
function emptyDraft(): ResumeDraft {
  const draft = createDefaultResumeDraft();
  draft.profile = {
    fullName: "",
    location: "",
    phone: "",
    email: "",
    photo: "",
    extraLinks: [],
  };
  draft.sections.summary.content = "";
  for (const section of Object.values(draft.sections)) {
    if (!("items" in section)) continue;
    for (const item of section.items as Record<string, unknown>[]) {
      for (const key of Object.keys(item)) {
        if (key === "id") continue;
        item[key] = Array.isArray(item[key]) ? [] : "";
      }
    }
  }
  return draft;
}

describe("scoring floors", () => {
  // An all-blank resume once scored 73 — missing checks passed vacuously with no content
  // to violate them. Those are `na` now; parseability stays high on purpose.
  it("scores an empty resume far below a filled one", () => {
    const empty = computeAtsScore(emptyDraft()).score;
    expect(empty).toBeLessThan(45);
    expect(empty).toBeLessThan(computeAtsScore(createDefaultResumeDraft()).score);
  });

  it("awards no content credit for an empty resume", () => {
    expect(computeAtsScore(emptyDraft()).breakdown.content?.pct).toBe(0);
  });

  it("fails an empty resume on name, work items and core sections", () => {
    const failed = computeAtsScore(emptyDraft())
      .suggestions.filter((s) => s.severity === "fail")
      .map((s) => s.id);

    expect(failed).toContain("contact/full-name");
    expect(failed).toContain("contact/email");
    expect(failed).toContain("structure/complete-items");
    expect(failed).toContain("structure/core-sections");
  });

  it("fails a missing full name — it keys the whole candidate record", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "";
    expect(find(draft, "contact/full-name")?.severity).toBe("fail");
    expect(computeAtsScore(draft).score).toBeLessThan(
      computeAtsScore(createDefaultResumeDraft()).score,
    );
  });

  it("scores a blank role below a complete one", () => {
    const complete = computeAtsScore(createDefaultResumeDraft()).score;
    const blank = createDefaultResumeDraft();
    blank.sections.workExperience.items = [
      { ...blank.sections.workExperience.items[0], companyName: "" },
    ];
    expect(computeAtsScore(blank).score).toBeLessThan(complete);
  });

  it("rescales category weights to 100 when job match is absent", () => {
    const sum = (score: ReturnType<typeof computeAtsScore>) =>
      Object.values(score.breakdown).reduce(
        (total, category) => total + (category?.weight ?? 0),
        0,
      );

    expect(sum(computeAtsScore(createDefaultResumeDraft()))).toBe(100);
  });
});

describe("parse checks", () => {
  it("fails two-column layouts and passes single-column ones", () => {
    const classic = createDefaultResumeDraft();
    classic.pdfPresentation.layoutId = "classic";
    const sidebar = createDefaultResumeDraft();
    sidebar.pdfPresentation.layoutId = "dossier";

    expect(find(classic, "parse/layout")?.severity).toBe("ok");
    expect(find(sidebar, "parse/layout")?.severity).toBe("fail");
    expect(scoreOf(sidebar, "parse")).toBeLessThan(scoreOf(classic, "parse"));
  });

  it("fails a table in a description — parsers read it cell by cell", () => {
    const draft = withRole({
      description: "<table><tr><td>Built things</td></tr></table>",
    });
    expect(find(draft, "parse/tables")?.severity).toBe("fail");
  });

  it("warns on nested bullets but not on a flat list", () => {
    const flat = withRole({ description: "<ul><li>Shipped the thing</li></ul>" });
    const nested = withRole({
      description: "<ul><li>Shipped the thing<ul><li>and a sub-thing</li></ul></li></ul>",
    });
    expect(find(flat, "parse/nested-lists")?.severity).toBe("ok");
    expect(find(nested, "parse/nested-lists")?.severity).toBe("warn");
  });

  it("warns on decorative glyphs and quotes the offending line", () => {
    const draft = withRole({
      description: "<ul><li>Shipped the launch 🚀 on time</li></ul>",
    });
    const result = find(draft, "parse/glyphs");
    expect(result?.severity).toBe("warn");
    expect(result?.evidence?.[0]).toContain("Shipped the launch");
  });

  it("warns when a photo is attached", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.photo = "data:image/png;base64,iVBOR";
    expect(find(draft, "parse/photo")?.severity).toBe("warn");
  });
});

describe("contact & date checks", () => {
  it("fails a malformed email, not just a missing one", () => {
    const missing = createDefaultResumeDraft();
    missing.profile.email = "";
    const malformed = createDefaultResumeDraft();
    malformed.profile.email = "dimas@localhost";

    expect(find(missing, "contact/email")?.severity).toBe("fail");
    // The old scorer only checked for non-empty — this is the regression that matters.
    expect(find(malformed, "contact/email")?.severity).toBe("fail");
    expect(find(malformed, "contact/email")?.evidence).toEqual([
      "dimas@localhost",
    ]);
  });

  it("passes a well-formed email", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.email = "dimas@example.com";
    expect(find(draft, "contact/email")?.severity).toBe("ok");
  });

  it("fails dates the app's own parser cannot read, and names them", () => {
    const draft = withRole({ startDate: "Mar '21", endDate: "now" });
    const result = find(draft, "contact/dates-readable");
    expect(result?.severity).toBe("fail");
    expect(result?.evidence).toEqual([
      'Engineer at Acme: "Mar \'21"',
      'Engineer at Acme: "now"',
    ]);
  });

  it("accepts the `current` sentinel and blank dates as readable", () => {
    const draft = withRole({ startDate: "Jan 2024", endDate: "current" });
    expect(find(draft, "contact/dates-readable")?.severity).toBe("ok");
  });

  it("warns when roles are not newest-first", () => {
    const draft = createDefaultResumeDraft();
    const base = draft.sections.workExperience.items[0];
    draft.sections.workExperience.items = [
      { ...base, id: "old", startDate: "Jan 2018", endDate: "Jan 2019" },
      { ...base, id: "new", startDate: "Jan 2022", endDate: "Jan 2023" },
    ];
    expect(find(draft, "contact/chronological")?.severity).toBe("warn");

    draft.sections.workExperience.items.reverse();
    expect(find(draft, "contact/chronological")?.severity).toBe("ok");
  });

  it("flags an employment gap longer than six months", () => {
    const draft = createDefaultResumeDraft();
    const base = draft.sections.workExperience.items[0];
    draft.sections.workExperience.items = [
      { ...base, id: "b", position: "Lead", startDate: "Jan 2023", endDate: "Jan 2024" },
      { ...base, id: "a", position: "Engineer", startDate: "Jan 2020", endDate: "Jan 2021" },
    ];
    const result = find(draft, "contact/gaps");
    expect(result?.severity).toBe("warn");
    expect(result?.evidence?.[0]).toContain("Lead");
  });

  it("does not flag a gap when roles run back to back", () => {
    const draft = createDefaultResumeDraft();
    const base = draft.sections.workExperience.items[0];
    draft.sections.workExperience.items = [
      { ...base, id: "b", startDate: "Feb 2021", endDate: "Jan 2024" },
      { ...base, id: "a", startDate: "Jan 2020", endDate: "Jan 2021" },
    ];
    expect(find(draft, "contact/gaps")?.severity).toBe("ok");
  });

  it("warns about links written without a scheme", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.extraLinks = [{ id: "l1", url: "linkedin.com/in/dimas" }];
    const result = find(draft, "contact/links");
    expect(result?.severity).toBe("warn");
    expect(result?.evidence).toEqual(["linkedin.com/in/dimas"]);

    draft.profile.extraLinks = [{ id: "l1", url: "https://linkedin.com/in/dimas" }];
    expect(find(draft, "contact/links")?.severity).toBe("ok");
  });
});

describe("structure checks", () => {
  it("flags a role missing its employer, and says which field", () => {
    const draft = withRole({ companyName: "" });
    const result = find(draft, "structure/complete-items");
    expect(result?.severity).toBe("fail");
    expect(result?.evidence?.[0]).toContain("missing employer");
  });

  it("flags hidden core sections", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.skills.visible = false;
    const result = find(draft, "structure/core-sections");
    expect(result?.severity).toBe("warn");
    expect(result?.evidence).toEqual(["Skills is hidden"]);
  });
});

describe("content checks", () => {
  it("scores quantified, verb-led bullets above vague ones", () => {
    const vague = withRole({
      description: "<ul><li>Worked on features</li></ul>",
    });
    const sharp = withRole({
      description:
        "<ul><li>Led a migration that cut p95 latency by 40%</li><li>Shipped an onboarding revamp lifting activation 22%</li></ul>",
    });
    expect(scoreOf(sharp, "content")).toBeGreaterThan(scoreOf(vague, "content"));
  });

  it("quotes the bullets that lack a number", () => {
    const draft = withRole({
      description: "<ul><li>Improved the deployment pipeline</li></ul>",
    });
    const result = find(draft, "content/quantified");
    expect(result?.severity).toBe("fail");
    expect(result?.evidence).toEqual(["Improved the deployment pipeline"]);
  });

  it("flags duty-list filler", () => {
    const draft = withRole({
      description: "<ul><li>Responsible for the billing service uptime</li></ul>",
    });
    const result = find(draft, "content/cliches");
    expect(result?.severity).toBe("warn");
    expect(result?.evidence?.[0]).toContain("responsible for");
  });

  it("flags novelty job titles that no ATS dictionary contains", () => {
    const draft = withRole({ position: "Frontend Ninja" });
    const result = find(draft, "content/standard-titles");
    expect(result?.severity).toBe("warn");
    expect(result?.evidence).toEqual(["Frontend Ninja"]);
  });

  it("flags first-person bullets", () => {
    const draft = withRole({
      description: "<ul><li>I rebuilt the checkout flow, lifting conversion 12%</li></ul>",
    });
    expect(find(draft, "content/first-person")?.severity).toBe("warn");
  });
});

describe("job match checks", () => {
  const REACT = { term: "React", category: "hard-skill" as const, weight: 1 };

  function jobMatch(overrides: Partial<JobMatchResult> = {}): JobMatchResult {
    return {
      jobDescription: "Senior engineer with React and Kubernetes experience",
      keywords: [REACT],
      matched: [REACT],
      partial: [],
      missing: [],
      coverage: 1,
      ...overrides,
    };
  }

  it("adds the job match category only when a job description exists", () => {
    const draft = createDefaultResumeDraft();
    expect(computeAtsScore(draft).breakdown.jobMatch).toBeNull();
    expect(computeAtsScore(draft, jobMatch()).breakdown.jobMatch).not.toBeNull();
  });

  // Empty extraction is a service problem, not a resume one — scoring 0% docked the user for it.
  it("stays out of the score when extraction returned no keywords", () => {
    const empty = jobMatch({ keywords: [], matched: [], coverage: 0 });
    const result = computeAtsScore(createDefaultResumeDraft(), empty);

    expect(result.breakdown.jobMatch).toBeNull();
    expect(result.score).toBe(computeAtsScore(createDefaultResumeDraft()).score);
  });

  it("lists the missing terms, heaviest first", () => {
    const result = computeAtsScore(
      createDefaultResumeDraft(),
      jobMatch({
        coverage: 0.2,
        matched: [],
        keywords: [
          { term: "React", category: "hard-skill", weight: 0.4 },
          { term: "Kubernetes", category: "hard-skill", weight: 0.9 },
        ],
        missing: [
          { term: "React", category: "hard-skill", weight: 0.4 },
          { term: "Kubernetes", category: "hard-skill", weight: 0.9 },
        ],
      }),
    );
    const coverage = result.suggestions.find((s) => s.id === "jobMatch/coverage");
    expect(coverage?.severity).toBe("fail");
    expect(coverage?.evidence).toEqual(["Kubernetes", "React"]);
  });

  it("warns when a term only matches via its acronym", () => {
    const result = computeAtsScore(
      createDefaultResumeDraft(),
      jobMatch({
        matched: [],
        keywords: [{ term: "Kubernetes", category: "hard-skill", weight: 1 }],
        partial: [
          {
            term: "Kubernetes",
            category: "hard-skill",
            weight: 1,
            foundAs: "k8s",
          },
        ],
      }),
    );
    const acronyms = result.suggestions.find((s) => s.id === "jobMatch/acronyms");
    expect(acronyms?.severity).toBe("warn");
    expect(acronyms?.evidence?.[0]).toBe(
      'job asks "Kubernetes", you wrote "k8s"',
    );
  });
});
