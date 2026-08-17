import { sanitizeRichTextHtml } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";
import {
  improveContentWithGemini,
  type ImproveContentInput,
} from "@/features/resume-editor/server/improve-content-with-gemini";
import {
  handleResumeImportError,
  parseJsonBody,
} from "@/features/resume-editor/server/http";

export const runtime = "nodejs";
// The Gemini fallback chain is sequential; it budgets 50s, so give it room.
export const maxDuration = 60;

const HTML_CHAR_LIMIT = 8_000;
const CUSTOM_INSTRUCTION_CHAR_LIMIT = 500;
const KEYWORD_LIMIT = 12;
const KEYWORD_CHAR_LIMIT = 60;

type ValidatedBody =
  | { ok: true; input: ImproveContentInput }
  | { ok: false; response: Response };

function validateImproveContentBody(body: unknown): ValidatedBody {
  if (!body || typeof body !== "object") {
    return {
      ok: false,
      response: Response.json(
        { message: "Invalid request body." },
        { status: 400 },
      ),
    };
  }

  const { html, chips, customInstruction, keywords } = body as Record<
    string,
    unknown
  >;

  if (typeof html !== "string" || !html.trim()) {
    return {
      ok: false,
      response: Response.json(
        { message: 'Missing "html" field.' },
        { status: 400 },
      ),
    };
  }

  if (html.length > HTML_CHAR_LIMIT) {
    return {
      ok: false,
      response: Response.json(
        {
          message: `Content exceeds the ${HTML_CHAR_LIMIT.toLocaleString()}-character limit.`,
        },
        { status: 400 },
      ),
    };
  }

  const chipsArray = Array.isArray(chips)
    ? chips.filter((c): c is string => typeof c === "string")
    : [];

  // One instruction line, capped like every other field that reaches the
  // prompt: the chips are server-mapped and the keywords are already bounded.
  const customInstructionText =
    typeof customInstruction === "string"
      ? customInstruction.trim().slice(0, CUSTOM_INSTRUCTION_CHAR_LIMIT)
      : "";

  // Terms only (instruction is built server-side), capped so a crafted request
  // can't stuff the prompt through this field.
  const keywordList = (Array.isArray(keywords) ? keywords : [])
    .filter((term): term is string => typeof term === "string")
    .map((term) => term.trim())
    .filter((term) => term.length > 0 && term.length <= KEYWORD_CHAR_LIMIT)
    .slice(0, KEYWORD_LIMIT);

  return {
    ok: true,
    input: {
      html: html.trim(),
      chips: chipsArray,
      customInstruction: customInstructionText,
      keywords: keywordList,
    },
  };
}

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, "Invalid JSON body.");
  if (!parsed.ok) return parsed.response;

  const validated = validateImproveContentBody(parsed.data);
  if (!validated.ok) return validated.response;

  try {
    const raw = await improveContentWithGemini(validated.input);

    return Response.json(
      { improved: sanitizeRichTextHtml(raw) },
      { status: 200 },
    );
  } catch (error) {
    return handleResumeImportError(error, "Unable to improve the content.");
  }
}
