import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import {
  collectionSectionKeys,
  getOrderedSectionKeys,
  getOrderedVisibleSectionKeys,
  isCollectionSectionKey,
  sectionLabels,
  sectionTitleFor,
} from "@/features/resume-editor/domain/sections/section-metadata";

describe("isCollectionSectionKey", () => {
  it("returns true for collection sections", () => {
    for (const key of collectionSectionKeys) {
      expect(isCollectionSectionKey(key as never)).toBe(true);
    }
  });

  it("returns false for summary", () => {
    expect(isCollectionSectionKey("summary")).toBe(false);
  });
});

describe("getOrderedSectionKeys", () => {
  it("returns section keys sorted by their order field", () => {
    const sections = createDefaultResumeDraft().sections;

    const keys = getOrderedSectionKeys(sections);

    expect(keys[0]).toBe("summary");
    expect(keys[keys.length - 1]).toBe("organizationVolunteering");
    expect(keys.length).toBeGreaterThan(0);
  });
});

describe("getOrderedVisibleSectionKeys", () => {
  it("excludes invisible sections", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.publications.visible = false;

    const keys = getOrderedVisibleSectionKeys(draft.sections);

    expect(keys).not.toContain("publications");
    expect(keys).toContain("summary");
    expect(keys).toContain("workExperience");
  });
});

describe("sectionLabels", () => {
  it("provides a label for every non-profile section", () => {
    for (const key of collectionSectionKeys) {
      expect(sectionLabels[key]).toBeDefined();
    }
    expect(sectionLabels.summary).toBe("Summary");
  });
});

/** Rename contract: user title when set, built-in label otherwise — clearing it is a reset. */
describe("sectionTitleFor", () => {
  const sections = createDefaultResumeDraft().sections;

  it("uses the custom title when set", () => {
    const renamed = {
      ...sections,
      workExperience: {
        ...sections.workExperience,
        title: "Professional Experience",
      },
    };

    expect(sectionTitleFor(renamed, "workExperience")).toBe(
      "Professional Experience",
    );
  });

  it.each([undefined, "", "   "])("falls back to the label for %j", (title) => {
    const blank = { ...sections, summary: { ...sections.summary, title } };

    expect(sectionTitleFor(blank, "summary")).toBe(sectionLabels.summary);
  });

  it("lets a layout that fixes its headings outrank a rename", () => {
    // The 履歴書 form has standard labels a recruiter looks for; a rename there
    // would put one word in the sidebar and another on the paper, so the layout
    // wins and the rename control is disabled.
    const renamed = {
      ...sections,
      workExperience: { ...sections.workExperience, title: "My Jobs" },
    };

    expect(sectionTitleFor(renamed, "workExperience", "rirekisho")).toBe("職歴");
    expect(sectionTitleFor(renamed, "workExperience", "classic")).toBe(
      "My Jobs",
    );
  });
});
