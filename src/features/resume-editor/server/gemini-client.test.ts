import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { callGeminiApi } from "./gemini-client";

type Attempt = { model: string; key: string };

/** Records every attempt in order and replies with the queued status codes. */
function mockFetch(statuses: number[]) {
  const attempts: Attempt[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      const parsed = new URL(url);
      attempts.push({
        model: parsed.pathname.split("/").pop()!.replace(":generateContent", ""),
        key: parsed.searchParams.get("key")!,
      });

      const status = statuses[attempts.length - 1] ?? 500;
      return Promise.resolve({
        ok: status < 400,
        status,
        json: () => Promise.resolve({ candidates: [] }),
      } as Response);
    }),
  );

  return attempts;
}

describe("callGeminiApi fallback order", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "key1, key2";
    process.env.GEMINI_MODEL = "model-a, model-b";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
  });

  it("stops at the first key that works", async () => {
    const attempts = mockFetch([200]);

    await callGeminiApi("prompt");

    expect(attempts).toEqual([{ model: "model-a", key: "key1" }]);
  });

  // The point of the feature: a rate-limited key falls back to a sibling key on
  // the same model before dropping to a weaker model.
  it("exhausts every key on a model before moving to the next model", async () => {
    const attempts = mockFetch([429, 429, 200]);

    await callGeminiApi("prompt");

    expect(attempts).toEqual([
      { model: "model-a", key: "key1" },
      { model: "model-a", key: "key2" },
      { model: "model-b", key: "key1" },
    ]);
  });

  // A bad request is not a quota problem, so retrying it on every key just
  // burns latency and quota for the same 400.
  it("skips the remaining keys when the failure is not key-specific", async () => {
    const attempts = mockFetch([400, 200]);

    await callGeminiApi("prompt");

    expect(attempts).toEqual([
      { model: "model-a", key: "key1" },
      { model: "model-b", key: "key1" },
    ]);
  });

  it("retries the next key when the request throws", async () => {
    const attempts: Attempt[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const key = new URL(url).searchParams.get("key")!;
        attempts.push({ model: "model-a", key });
        if (key === "key1") return Promise.reject(new Error("network down"));
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ candidates: [] }),
        } as Response);
      }),
    );

    await callGeminiApi("prompt");

    expect(attempts.map((attempt) => attempt.key)).toEqual(["key1", "key2"]);
  });

  it("fails once every model and key is spent", async () => {
    const attempts = mockFetch([429, 429, 429, 429]);

    await expect(callGeminiApi("prompt")).rejects.toThrow(
      "Gemini API request failed.",
    );
    expect(attempts).toHaveLength(4);
  });

  it("reports a missing key rather than calling the API", async () => {
    delete process.env.GEMINI_API_KEY;
    const attempts = mockFetch([200]);

    await expect(callGeminiApi("prompt")).rejects.toThrow(
      "GEMINI_API_KEY is not configured.",
    );
    expect(attempts).toHaveLength(0);
  });
});
