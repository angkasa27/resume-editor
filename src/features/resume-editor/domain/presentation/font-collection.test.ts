import { describe, expect, it } from "vitest";

import {
  RESUME_FONTS,
  getFont,
  type ResumeFontId,
} from "@/features/resume-editor/domain/presentation/font-collection";

describe("getFont", () => {
  it("resolves a valid font by id", () => {
    const font = getFont("inter");
    expect(font.name).toBe("Inter");
    expect(font.stack).toContain("--font-sans");
  });

  it("returns the first font for unknown ids", () => {
    const result = getFont("comic-sans" as ResumeFontId);
    expect(result.id).toBe("inter");
  });
});

describe("RESUME_FONTS", () => {
  // Every entry reaches the font picker and a `font-family` declaration, so a
  // blank name renders an unpickable row and a blank stack renders no font at
  // all. `toBeDefined` would pass for both.
  it("gives every font the fields the picker and the stylesheet need", () => {
    for (const font of RESUME_FONTS) {
      expect(font.id.trim()).not.toBe("");
      expect(font.name.trim()).not.toBe("");
      expect(font.stack.trim()).not.toBe("");
      expect(font.category).toMatch(/^(sans|serif)$/);
      expect(font.source).toMatch(/^(google|system)$/);
    }
  });

  // getFont resolves by id, so a duplicate makes the later font unreachable.
  it("keeps ids unique", () => {
    const ids = RESUME_FONTS.map((font) => font.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(getFont(id).id).toBe(id);
  });
});
