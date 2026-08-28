import { beforeEach, describe, expect, it, vi } from "vitest";

const { extractJobKeywordsWithGemini } = vi.hoisted(() => ({
  extractJobKeywordsWithGemini: vi.fn(),
}));

vi.mock("@/features/resume-editor/server/extract-job-keywords-with-gemini", () => ({
  extractJobKeywordsWithGemini,
}));

import { POST } from "@/app/api/insights/match-keywords/route";
import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/insights/match-keywords", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

// The job description is pasted by the user and reaches a prompt — the guards
// below are the trust boundary, so each one is asserted rather than assumed.
describe("POST /api/insights/match-keywords", () => {
  beforeEach(() => {
    extractJobKeywordsWithGemini.mockReset();
    extractJobKeywordsWithGemini.mockResolvedValue(["React", "Postgres"]);
  });

  it("returns the extracted keywords", async () => {
    const response = await post({ jobDescription: "We need a React engineer." });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      keywords: ["React", "Postgres"],
    });
  });

  it("trims before handing the description to the model", async () => {
    await post({ jobDescription: "  React engineer  " });
    expect(extractJobKeywordsWithGemini).toHaveBeenCalledWith("React engineer");
  });

  it("rejects a whitespace-only description without calling the model", async () => {
    const response = await post({ jobDescription: "   " });
    expect(response.status).toBe(400);
    expect(extractJobKeywordsWithGemini).not.toHaveBeenCalled();
  });

  it("rejects a missing description", async () => {
    const response = await post({});
    expect(response.status).toBe(400);
    expect(extractJobKeywordsWithGemini).not.toHaveBeenCalled();
  });

  // A non-string would otherwise reach the prompt via String() coercion.
  it("treats a non-string description as missing", async () => {
    const response = await post({ jobDescription: { text: "React" } });
    expect(response.status).toBe(400);
    expect(extractJobKeywordsWithGemini).not.toHaveBeenCalled();
  });

  // The cap protects the token budget, so it must reject rather than truncate.
  it("rejects an over-long description before spending tokens", async () => {
    const response = await post({ jobDescription: "z".repeat(12_001) });
    expect(response.status).toBe(413);
    expect(extractJobKeywordsWithGemini).not.toHaveBeenCalled();
  });

  it("accepts a description exactly at the cap", async () => {
    const response = await post({ jobDescription: "z".repeat(12_000) });
    expect(response.status).toBe(200);
  });

  it("rejects a malformed body", async () => {
    const response = await POST(
      new Request("http://localhost/api/insights/match-keywords", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      }),
    );
    expect(response.status).toBe(400);
    expect(extractJobKeywordsWithGemini).not.toHaveBeenCalled();
  });

  // A model failure must surface as the route's own message, never as a stack trace.
  it("maps an import error to its status and message", async () => {
    extractJobKeywordsWithGemini.mockRejectedValue(
      new ResumeImportError("Model is overloaded.", 503),
    );
    const response = await post({ jobDescription: "React engineer" });
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      message: "Model is overloaded.",
    });
  });

  it("hides an unexpected failure behind the fallback message", async () => {
    // The handler logs the cause on purpose; silence it so the run stays readable.
    vi.spyOn(console, "error").mockImplementation(() => {});
    extractJobKeywordsWithGemini.mockRejectedValue(new Error("ECONNRESET"));
    const response = await post({ jobDescription: "React engineer" });
    expect(response.status).toBeGreaterThanOrEqual(500);
    await expect(response.json()).resolves.toEqual({
      message: "Could not analyze the job description.",
    });
  });
});
