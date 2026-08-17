import { describe, expect, it } from "vitest";

import { parseJsonBody } from "./http";

function jsonRequest(body: string, contentLength?: number) {
  return new Request("https://example.test/api", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "content-length": String(contentLength ?? body.length),
    },
    body,
  });
}

describe("parseJsonBody size guard", () => {
  // Route handlers impose no body limit of their own, so every downstream field
  // cap is checked against something already buffered in memory.
  it("rejects an oversized body before parsing it", async () => {
    const result = await parseJsonBody(jsonRequest("{}", 5 * 1024 * 1024));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(413);
  });

  // A draft carrying a re-encoded profile photo is the largest legitimate body,
  // and it has to keep working.
  it("accepts a body the size of a draft with a photo", async () => {
    const photo = "a".repeat(200_000);
    const result = await parseJsonBody<{ draft: { photo: string } }>(
      jsonRequest(JSON.stringify({ draft: { photo } })),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.draft.photo).toHaveLength(200_000);
  });

  it("returns the caller's message for malformed JSON", async () => {
    const result = await parseJsonBody(jsonRequest("{nope"), "Invalid JSON.");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toEqual({
      message: "Invalid JSON.",
    });
  });
});
