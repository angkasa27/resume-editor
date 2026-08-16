// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { improveContentWithGemini } = vi.hoisted(() => ({
  improveContentWithGemini: vi.fn(),
}));

vi.mock("@/features/resume-editor/server/improve-content-with-gemini", () => ({
  improveContentWithGemini,
}));

import { POST } from "@/app/api/improve-content/route";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/improve-content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

/** The keywords the route actually handed to the model. */
function forwardedKeywords(): string[] {
  return improveContentWithGemini.mock.calls[0][0].keywords;
}

describe("POST /api/improve-content keyword handling", () => {
  beforeEach(() => {
    improveContentWithGemini.mockReset();
    improveContentWithGemini.mockResolvedValue("<p>improved</p>");
  });

  it("forwards well-formed keywords", async () => {
    await post({ html: "<p>x</p>", keywords: ["Kubernetes", " GraphQL "] });
    expect(forwardedKeywords()).toEqual(["Kubernetes", "GraphQL"]);
  });

  // This field reaches a prompt — a trust boundary, so it's strings-only, short, and few.
  it("drops non-string entries", async () => {
    await post({
      html: "<p>x</p>",
      keywords: ["React", 42, null, { term: "x" }, ["nested"]],
    });
    expect(forwardedKeywords()).toEqual(["React"]);
  });

  it("drops over-long terms", async () => {
    await post({ html: "<p>x</p>", keywords: ["React", "z".repeat(61)] });
    expect(forwardedKeywords()).toEqual(["React"]);
  });

  it("caps how many terms reach the prompt", async () => {
    await post({
      html: "<p>x</p>",
      keywords: Array.from({ length: 40 }, (_, i) => `term-${i}`),
    });
    expect(forwardedKeywords()).toHaveLength(12);
  });

  it("treats a non-array as no keywords at all", async () => {
    await post({ html: "<p>x</p>", keywords: "Kubernetes" });
    expect(forwardedKeywords()).toEqual([]);
  });

  it("still works with no keywords field", async () => {
    const response = await post({ html: "<p>x</p>" });
    expect(response.status).toBe(200);
    expect(forwardedKeywords()).toEqual([]);
  });
});
