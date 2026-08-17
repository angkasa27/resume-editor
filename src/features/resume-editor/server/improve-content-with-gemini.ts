import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";
import {
  callGeminiApi,
  extractResponseText,
  stripCodeFences,
} from "@/features/resume-editor/server/gemini-client";

export type ImproveContentInput = {
  html: string;
  chips: string[];
  customInstruction: string;
  /** Job-description terms to weave in. Only the terms cross the wire — the
   *  instruction wrapping them is built here, never sent by the client. */
  keywords?: string[];
};

// Server-controlled chip label → instruction mapping keeps the prompt
// authoritative and stops clients injecting arbitrary instructions.
const CHIP_INSTRUCTIONS: Record<string, string> = {
  "Add a metric":
    "Add a specific number, percentage, or scale to quantify the impact (e.g. '30%', '1M users', 'team of 8'). If no reasonable metric can be inferred, leave a placeholder like '[X%]'.",
  "Stronger verb":
    "Replace the opening verb of each bullet with a stronger, more impactful action verb (e.g. 'Led', 'Built', 'Drove', 'Shipped').",
  "More concise":
    "Trim filler words and unnecessary phrases. Aim for under 20 words per bullet.",
  "Sound more senior":
    "Elevate the language to convey ownership, leadership, and strategic impact.",
  "Fix grammar":
    "Correct grammar and punctuation only. Keep the original meaning and language intact.",
};

/** Wraps JD terms in a fixed instruction. The anti-fabrication clause is load-bearing: told to work a term in, a model will invent the experience that justifies it. */
export function buildKeywordInstruction(keywords: string[]): string {
  return `Work these terms from the target job description into the content, but only where the existing content already supports them: ${keywords.join(", ")}. Only use a term if what is already written genuinely demonstrates it. Reword to surface skills that are already implied. If a term is not supported, leave it out entirely. Omitting a term is always correct. Inventing experience to justify one is never acceptable. Use each term at most once. Write it in lower case unless it is a proper noun such as a product, company, or technology name: write "leadership", not "Leadership", and "mentorship", not "Mentorship". Capitalising an ordinary word mid-sentence is the clearest sign of keyword stuffing and gets a resume discarded. The result must read as ordinary prose, not as a keyword list.`;
}

function collectInstructions(input: ImproveContentInput): string[] {
  const instructions = input.chips
    .map((chip) => CHIP_INSTRUCTIONS[chip])
    .filter((instruction): instruction is string => Boolean(instruction));

  const keywords = (input.keywords ?? []).filter((term) => term.trim());
  if (keywords.length > 0) {
    instructions.push(buildKeywordInstruction(keywords));
  }

  const trimmedCustom = input.customInstruction.trim();
  if (trimmedCustom) {
    instructions.push(trimmedCustom);
  }

  return instructions;
}

function buildPrompt(input: ImproveContentInput): string {
  const instructions = collectInstructions(input);

  const instructionList =
    instructions.length > 0
      ? instructions.map((inst, i) => `${i + 1}. ${inst}`).join("\n")
      : "1. Improve the overall quality, clarity, and impact of the content.";

  return `You improve resume bullet points and descriptions for a resume editor.

CRITICAL, language preservation: Detect the language of the content provided below. Write your entire response in the SAME language as the input. For example, if the content is written in Bahasa Indonesia, respond in Bahasa Indonesia. If the user's additional instruction explicitly requests a specific target language, use that language instead.

Rules:
- Keep the same HTML structure. Use ONLY these tags: <p> <ul> <ol> <li> <strong> <em> <u> <a> <br>
- Apply every improvement listed below.
- Return ONLY the improved HTML. No commentary, no markdown fences, no explanation.
- Do not invent facts, companies, job titles, metrics, or details not implied by the original content.
- Never use em dashes or en dashes. Use a comma, a colon, or a full stop instead. Write plainly and avoid marketing language.

Content to improve:
"""
${input.html}
"""

Improvements to apply:
${instructionList}`.trim();
}

export async function improveContentWithGemini(
  input: ImproveContentInput,
): Promise<string> {
  const payload = await callGeminiApi(buildPrompt(input), {
    responseMimeType: "text/plain",
    // Rewriting prose is the one call here that gains from reasoning; Gemini 3
    // wants its default temperature, so the knob is thinking, not sampling.
    thinkingConfig: { thinkingLevel: "low" },
  });

  const responseText = extractResponseText(payload);

  if (!responseText) {
    throw new ResumeImportError("Gemini returned an empty response.", 502);
  }

  // Strip markdown code fences in case the model wraps HTML anyway.
  return stripCodeFences(responseText);
}
