import { describe, expect, it } from "vitest";

import { buildKeywordInstruction } from "./improve-content-with-gemini";

describe("buildKeywordInstruction", () => {
  it("names every term it was given", () => {
    const instruction = buildKeywordInstruction(["Kubernetes", "GraphQL"]);
    expect(instruction).toContain("Kubernetes");
    expect(instruction).toContain("GraphQL");
  });

  // The whole feature turns on this: told to work a term in, a model will invent the experience that justifies it.
  it("forbids inventing experience to justify a term", () => {
    const instruction = buildKeywordInstruction(["Kubernetes"]).toLowerCase();

    expect(instruction).toContain("already supports them");
    expect(instruction).toContain("leave it out");
    expect(instruction).toContain("never acceptable");
  });

  // The model mirrors the prompt's own punctuation, so a dash in here comes
  // back out in the user's bullets.
  it("is written without em or en dashes", () => {
    const instruction = buildKeywordInstruction(["Kubernetes"]);
    expect(instruction).not.toMatch(/[—–]/);
  });
});
