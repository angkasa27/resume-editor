import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

const ATTEMPT_TIMEOUT_MS = 20_000;
/** Kept under the routes' `maxDuration` so our own 504 wins the race. */
const TOTAL_BUDGET_MS = 50_000;

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
};

/** A cut-off candidate still carries text, so without this the JSON callers
 *  parse half a document and the HTML caller writes half a sentence into the
 *  resume behind a 200. Truncation has to fail, not degrade. */
function assertCompleteResponse(payload: GeminiResponse): void {
  const finishReason = payload.candidates?.[0]?.finishReason;

  if (!finishReason || finishReason === "STOP") {
    return;
  }

  if (finishReason === "MAX_TOKENS") {
    throw new ResumeImportError(
      "The response was cut off because the content is too long. Try a shorter section.",
      502,
    );
  }

  throw new ResumeImportError(
    `Gemini stopped before finishing (${finishReason}).`,
    502,
  );
}

export function extractResponseText(payload: GeminiResponse): string | undefined {
  return payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
}

export function stripCodeFences(value: string): string {
  return value
    // Any language tag, not just json — the HTML caller strips fences too.
    .replace(/^```[a-z]*\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Quota, auth and transport faults are per-key, so another key may succeed.
 *  A 400/404 is the request or the model itself: no key fixes it. */
function isKeyFault(status: number): boolean {
  return status === 401 || status === 403 || status === 429 || status >= 500;
}

export async function callGeminiApi(
  prompt: string,
  generationConfig?: Record<string, unknown>,
): Promise<GeminiResponse> {
  const apiKeys = splitList(process.env.GEMINI_API_KEY);

  if (apiKeys.length === 0) {
    throw new ResumeImportError("GEMINI_API_KEY is not configured.", 503);
  }

  const models = splitList(process.env.GEMINI_MODEL);
  // The fallback chain is sequential, so without a deadline a full model x key
  // sweep of hung connections outlives the route's own timeout and the caller
  // gets a platform error instead of ours.
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      // Gemini 3 thinks by default, and on these extraction and rewrite tasks
      // it spent 8x more tokens reasoning than answering. Callers that benefit
      // from reasoning raise this themselves.
      thinkingConfig: { thinkingLevel: "minimal" },
      ...generationConfig,
    },
  });

  // Exhaust every key on a model before moving down the model list, so a
  // rate-limited key falls back to a sibling key rather than a weaker model.
  for (const model of models.length > 0 ? models : [DEFAULT_GEMINI_MODEL]) {
    for (const apiKey of apiKeys) {
      if (Date.now() >= deadline) {
        throw new ResumeImportError("Gemini API request timed out.", 504);
      }

      let response: Response;

      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body,
            // A hung attempt is a key fault like any other: time it out and let
            // the loop fall through to the next key.
            signal: AbortSignal.timeout(
              Math.min(ATTEMPT_TIMEOUT_MS, deadline - Date.now()),
            ),
          },
        );
      } catch {
        continue;
      }

      if (response.ok) {
        const payload = (await response.json()) as GeminiResponse;
        assertCompleteResponse(payload);
        return payload;
      }

      // Not a key problem, so the remaining keys would fail identically.
      if (!isKeyFault(response.status)) {
        break;
      }
    }
  }

  throw new ResumeImportError("Gemini API request failed.", 502);
}
