import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

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
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    ...(generationConfig ? { generationConfig } : {}),
  });

  // Exhaust every key on a model before moving down the model list, so a
  // rate-limited key falls back to a sibling key rather than a weaker model.
  for (const model of models.length > 0 ? models : [DEFAULT_GEMINI_MODEL]) {
    for (const apiKey of apiKeys) {
      let response: Response;

      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body,
          },
        );
      } catch {
        continue;
      }

      if (response.ok) {
        return (await response.json()) as GeminiResponse;
      }

      // Not a key problem, so the remaining keys would fail identically.
      if (!isKeyFault(response.status)) {
        break;
      }
    }
  }

  throw new ResumeImportError("Gemini API request failed.", 502);
}
