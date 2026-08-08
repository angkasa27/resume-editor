import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { addKeywordToSkills } from "./add-keyword-to-skills";

function skills(
  ...categories: { id: string; categoryName: string; skills: string[] }[]
): ResumeDraft["sections"]["skills"] {
  return { ...createDefaultResumeDraft().sections.skills, items: categories };
}

describe("addKeywordToSkills", () => {
  it("appends the term to the first category by default", () => {
    const result = addKeywordToSkills(
      skills({ id: "a", categoryName: "Frontend", skills: ["React"] }),
      "GraphQL",
    );

    expect(result.items[0].skills).toEqual(["React", "GraphQL"]);
  });

  it("appends to the requested category", () => {
    const result = addKeywordToSkills(
      skills(
        { id: "a", categoryName: "Frontend", skills: ["React"] },
        { id: "b", categoryName: "Infra", skills: ["Docker"] },
      ),
      "Kubernetes",
      "b",
    );

    expect(result.items[0].skills).toEqual(["React"]);
    expect(result.items[1].skills).toEqual(["Docker", "Kubernetes"]);
  });

  // A duplicate would show twice on the paper and burn an undo slot for nothing.
  it("is a no-op when the term already exists, whatever the casing", () => {
    const section = skills({
      id: "a",
      categoryName: "Frontend",
      skills: ["node.js"],
    });

    expect(addKeywordToSkills(section, "Node.js")).toBe(section);
    expect(addKeywordToSkills(section, "  NODE.JS  ")).toBe(section);
  });

  it("does not re-add a term that lives in a different category", () => {
    const section = skills(
      { id: "a", categoryName: "Frontend", skills: ["React"] },
      { id: "b", categoryName: "Infra", skills: ["Kubernetes"] },
    );

    expect(addKeywordToSkills(section, "Kubernetes", "a")).toBe(section);
  });

  it("ignores a blank term", () => {
    const section = skills({ id: "a", categoryName: "F", skills: [] });
    expect(addKeywordToSkills(section, "   ")).toBe(section);
  });

  it("falls back to the first category when the target is gone", () => {
    const result = addKeywordToSkills(
      skills({ id: "a", categoryName: "Frontend", skills: [] }),
      "GraphQL",
      "deleted-category",
    );

    expect(result.items[0].skills).toEqual(["GraphQL"]);
  });

  it("does not mutate the input", () => {
    const section = skills({ id: "a", categoryName: "F", skills: ["React"] });
    addKeywordToSkills(section, "GraphQL");
    expect(section.items[0].skills).toEqual(["React"]);
  });
});
