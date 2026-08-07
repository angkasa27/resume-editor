import {
  parseResumeDraft,
  type ResumeDraft,
} from "@/features/resume-editor/domain/schema";

export const RESUME_STORAGE_KEY = "resume-editor:draft:v3";

export function exportResumeDraft(draft: ResumeDraft): string {
  return JSON.stringify(draft, null, 2);
}

export function importResumeDraft(serializedDraft: string): ResumeDraft {
  const parsedJson = JSON.parse(serializedDraft) as unknown;
  // Some producers (the PDF-import response, cloud saves) wrap the draft in a
  // `{ draft }` envelope; accept either shape.
  const unwrapped =
    parsedJson && typeof parsedJson === "object" && "draft" in parsedJson
      ? (parsedJson as { draft: unknown }).draft
      : parsedJson;
  return parseResumeDraft(unwrapped);
}
