import { afterEach, describe, expect, it, vi } from "vitest";

import { postJson } from "@/lib/api-client";

function respond(body: string, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(body, {
        status,
        headers: { "content-type": "application/json" },
      }),
    ),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

/**
 * Every AI feature funnels its errors through here, so what the user is shown
 * when a route fails is decided in this one function.
 */
describe("postJson", () => {
  it("returns the parsed payload on success", async () => {
    respond(JSON.stringify({ keywords: ["React"] }));
    await expect(postJson("/api/x", { a: 1 }, "fallback")).resolves.toEqual({
      keywords: ["React"],
    });
  });

  it("posts the body as JSON", async () => {
    respond(JSON.stringify({}));
    await postJson("/api/x", { a: 1 }, "fallback");
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("/api/x");
    expect(init).toMatchObject({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ a: 1 }),
    });
  });

  // The route's own message is the useful one — it says what the user can do.
  it("throws the server's message on failure", async () => {
    respond(JSON.stringify({ message: "Job description is too long." }), 413);
    await expect(postJson("/api/x", {}, "fallback")).rejects.toThrow(
      "Job description is too long.",
    );
  });

  it("falls back when the error body carries no message", async () => {
    respond(JSON.stringify({}), 500);
    await expect(postJson("/api/x", {}, "Could not analyze.")).rejects.toThrow(
      "Could not analyze.",
    );
  });

  // An empty `message` is as useless as a missing one — `||`, not `??`.
  it("falls back on an empty message", async () => {
    respond(JSON.stringify({ message: "" }), 500);
    await expect(postJson("/api/x", {}, "Could not analyze.")).rejects.toThrow(
      "Could not analyze.",
    );
  });

  // A proxy or a crashed route answers with HTML, not JSON. Without the parse
  // guard this surfaces as a SyntaxError instead of something the user can read.
  it("falls back when the error body is not JSON", async () => {
    respond("<html>502 Bad Gateway</html>", 502);
    await expect(postJson("/api/x", {}, "Could not analyze.")).rejects.toThrow(
      "Could not analyze.",
    );
  });

  it("returns an empty payload when a 200 body is not JSON", async () => {
    respond("", 200);
    await expect(postJson("/api/x", {}, "fallback")).resolves.toEqual({});
  });
});
