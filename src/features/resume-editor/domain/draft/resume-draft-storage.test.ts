import { describe, expect, it } from "vitest";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import {
  exportResumeDraft,
  importResumeDraft,
} from "@/features/resume-editor/domain/draft/resume-draft-storage";

describe("importResumeDraft", () => {
  it("reads a plain exported draft", () => {
    const draft = createDefaultResumeDraft();
    expect(importResumeDraft(exportResumeDraft(draft))).toEqual(draft);
  });

  // PDF-import ships `{ draft }`; the envelope used to reach the schema and blow up.
  it("unwraps a { draft } envelope", () => {
    const draft = createDefaultResumeDraft();
    expect(importResumeDraft(JSON.stringify({ draft }))).toEqual(draft);
  });

  it("still rejects a payload that is not a draft", () => {
    expect(() => importResumeDraft(JSON.stringify({ nope: true }))).toThrow();
  });
});
