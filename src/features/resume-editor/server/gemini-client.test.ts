import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { callGeminiApi } from "./gemini-client";

type Attempt = { model: string; key: string };

function mockCandidate(candidate: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ candidates: [candidate] }),
      } as Response),
    ),
  );
}

type SentBody = {
  generationConfig: {
    temperature?: number;
    thinkingConfig?: { thinkingLevel?: string };
  };
};

/** Records the request body of every attempt, so tests can assert what we sent. */
function mockFetchCapturingBodies() {
  const bodies: SentBody[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn((_url: string, init: RequestInit) => {
      bodies.push(JSON.parse(init.body as string));
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ candidates: [] }),
      } as Response);
    }),
  );

  return bodies;
}

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

  // A truncated candidate arrives with HTTP 200 and real text attached, so a
  // missing check does not error: it writes half a sentence into the resume.
  it("rejects a truncated response instead of returning its partial text", async () => {
    mockCandidate({
      content: { parts: [{ text: '{"langs":["Python","Java' }] },
      finishReason: "MAX_TOKENS",
    });

    await expect(callGeminiApi("prompt")).rejects.toThrow("cut off");
  });

  it("rejects a response stopped for any other reason", async () => {
    mockCandidate({ content: { parts: [] }, finishReason: "SAFETY" });

    await expect(callGeminiApi("prompt")).rejects.toThrow("SAFETY");
  });

  it("accepts a completed response", async () => {
    mockCandidate({
      content: { parts: [{ text: "done" }] },
      finishReason: "STOP",
    });

    await expect(callGeminiApi("prompt")).resolves.toBeTruthy();
  });

  // Gemini 3 reasons by default and billed 8x more thinking than answer tokens
  // on these tasks, so the floor has to survive a caller passing its own config.
  it("keeps thinking minimal while letting a caller override it", async () => {
    const bodies = mockFetchCapturingBodies();

    await callGeminiApi("prompt");
    await callGeminiApi("prompt", { thinkingConfig: { thinkingLevel: "low" } });

    const levels = bodies.map(
      (body) => body.generationConfig.thinkingConfig?.thinkingLevel,
    );
    expect(levels).toEqual(["minimal", "low"]);
  });

  // Gemini 3 is optimised for its default temperature and degrades or loops
  // when it is forced lower, so no caller may pin it.
  it("never pins a sampling temperature", async () => {
    const bodies = mockFetchCapturingBodies();

    await callGeminiApi("prompt", { responseMimeType: "application/json" });

    expect(bodies[0].generationConfig.temperature).toBeUndefined();
  });

  // Each attempt is sequential, so an unbounded one lets the chain outlive the
  // route and the client gets a platform error instead of ours.
  it("gives every attempt an abort signal", async () => {
    const signals: Array<AbortSignal | null | undefined> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init: RequestInit) => {
        signals.push(init.signal);
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ candidates: [] }),
        } as Response);
      }),
    );

    await callGeminiApi("prompt");

    expect(signals[0]).toBeInstanceOf(AbortSignal);
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
