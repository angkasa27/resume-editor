import { describe, expect, it } from "vitest";

import {
  createDefaultPdfPresentation,
  DEFAULT_ACCENT,
  getEffectiveSecondary,
  getPageMarginMm,
  getPaperDimensionsMm,
  isValidAccentHex,
  normalizePdfPresentation,
  resolvePdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

describe("createDefaultPdfPresentation", () => {
  it("returns the aurora layout with haze styling", () => {
    const result = createDefaultPdfPresentation();

    expect(result.layoutId).toBe("aurora");
    expect(result.fontScale).toBe("sm");
    expect(result.spacing).toBe("standard");
    expect(result.lineHeight).toBe("standard");
    expect(result.accent).toBe(DEFAULT_ACCENT);
    expect(result.secondary).toBe("#a5f3fc");
    expect(result.paperSize).toBe("a4");
  });
});

describe("isValidAccentHex", () => {
  it("accepts 6-digit hex colors", () => {
    expect(isValidAccentHex("#2563eb")).toBe(true);
    expect(isValidAccentHex("#ff0000")).toBe(true);
    expect(isValidAccentHex("#aBcDeF")).toBe(true);
  });

  it("rejects non-hex values", () => {
    expect(isValidAccentHex("red")).toBe(false);
    expect(isValidAccentHex("#fff")).toBe(false);
    expect(isValidAccentHex("#12345")).toBe(false);
    expect(isValidAccentHex("#1234567")).toBe(false);
    expect(isValidAccentHex(123)).toBe(false);
    expect(isValidAccentHex(null)).toBe(false);
    expect(isValidAccentHex(undefined)).toBe(false);
  });
});

describe("getPaperDimensionsMm", () => {
  it("returns A4 dimensions", () => {
    expect(getPaperDimensionsMm("a4")).toEqual({
      widthMm: 210,
      heightMm: 297,
    });
  });

  it("returns Letter dimensions", () => {
    expect(getPaperDimensionsMm("letter")).toEqual({
      widthMm: 215.9,
      heightMm: 279.4,
    });
  });
});

describe("getPageMarginMm", () => {
  it("gives rail layouts a tighter margin than typographic ones", () => {
    // The reason margins live on the layout: a 0.36fr rail and a whitespace-led page can't share one value.
    expect(getPageMarginMm("split", "standard")).toBeLessThan(
      getPageMarginMm("academic", "standard"),
    );
  });

  it("scales with spacing", () => {
    expect(getPageMarginMm("classic", "standard")).toBe(14);
    expect(getPageMarginMm("classic", "compact")).toBe(11.9);
    expect(getPageMarginMm("classic", "airy")).toBe(16.1);
  });
});

describe("normalizePdfPresentation", () => {
  it("returns defaults for null/undefined input", () => {
    expect(normalizePdfPresentation(null).layoutId).toBe("aurora");
    expect(normalizePdfPresentation(undefined).layoutId).toBe("aurora");
  });

  it("returns defaults for non-object input", () => {
    expect(normalizePdfPresentation("bad").layoutId).toBe("aurora");
  });

  it("passes through valid values", () => {
    const result = normalizePdfPresentation({ layoutId: "dossier" });
    expect(result.layoutId).toBe("dossier");
  });

  it("remaps a retired layout id to its successor rather than the default", () => {
    // A `tinted` draft must land on split, not the classic default — split's rail keeps the tinted feel.
    expect(normalizePdfPresentation({ layoutId: "tinted" }).layoutId).toBe(
      "split",
    );
    // Culled July 2026: these three were real ids in shipped drafts.
    expect(normalizePdfPresentation({ layoutId: "sidebar" }).layoutId).toBe(
      "ledger",
    );
    expect(normalizePdfPresentation({ layoutId: "banner" }).layoutId).toBe(
      "crest",
    );
    expect(normalizePdfPresentation({ layoutId: "spotlight" }).layoutId).toBe(
      "split",
    );
  });

  it("falls back to defaults for invalid values", () => {
    const result = normalizePdfPresentation({
      layoutId: "nonexistent",
      fontScale: "xxl",
      paperSize: "tabloid",
    });
    expect(result.layoutId).toBe("aurora");
    expect(result.fontScale).toBe("sm");
    expect(result.paperSize).toBe("a4");
  });

  it("validates accent hex", () => {
    expect(
      normalizePdfPresentation({ accent: "red" }).accent,
    ).toBe(DEFAULT_ACCENT);
    expect(
      normalizePdfPresentation({ accent: "#ff0000" }).accent,
    ).toBe("#ff0000");
  });

  it("passes through a valid secondary and drops invalid ones", () => {
    expect(
      normalizePdfPresentation({ secondary: "#10b981" }).secondary,
    ).toBe("#10b981");
    expect(normalizePdfPresentation({ secondary: "green" }).secondary)
      .toBeUndefined();
    expect(normalizePdfPresentation({}).secondary).toBeUndefined();
  });

  it("passes through a valid photoShape and drops invalid/absent ones", () => {
    expect(normalizePdfPresentation({ photoShape: "circle" }).photoShape).toBe(
      "circle",
    );
    expect(
      normalizePdfPresentation({ photoShape: "oval" }).photoShape,
    ).toBeUndefined();
    expect(normalizePdfPresentation({}).photoShape).toBeUndefined();
  });

  it("keeps link highlighting on for a draft saved before the control existed", () => {
    // The alternative silently restyles every resume already in storage.
    expect(normalizePdfPresentation({}).linkHighlight).toBe(true);
    expect(normalizePdfPresentation({ linkHighlight: "yes" }).linkHighlight).toBe(
      true,
    );
    expect(normalizePdfPresentation({ linkHighlight: false }).linkHighlight).toBe(
      false,
    );
  });

  it("resolves linkHighlight for the root attribute the layouts branch on", () => {
    const base = createDefaultPdfPresentation();
    expect(resolvePdfPresentation(base).linkHighlight).toBe(true);
    expect(
      resolvePdfPresentation({ ...base, linkHighlight: false }).linkHighlight,
    ).toBe(false);
  });
});

describe("getEffectiveSecondary", () => {
  it("falls back to the accent when secondary is unset", () => {
    const base = createDefaultPdfPresentation();
    expect(getEffectiveSecondary({ ...base, secondary: undefined })).toBe(
      base.accent,
    );
    expect(
      getEffectiveSecondary({ ...base, secondary: "#10b981" }),
    ).toBe("#10b981");
  });
});

describe("resolvePdfPresentation", () => {
  it("returns a layout ID and CSS variables", () => {
    const result = resolvePdfPresentation();

    expect(result.layoutId).toBe("aurora");
    expect(result.vars).toBeDefined();
    expect(result.vars["--resume-font"]).toBeDefined();
    expect(result.vars["--resume-body"]).toBeDefined();
    expect(result.vars["--resume-leading"]).toBeDefined();
    expect(result.vars["--resume-accent"]).toBe(DEFAULT_ACCENT);
    expect(result.vars["--resume-paper-width"]).toBe("210mm");
    expect(result.vars["--resume-paper-height"]).toBe("297mm");
    expect(result.vars["--resume-page-margin"]).toBe("14mm");
    expect(result.vars["--resume-gutter"]).toBe("7mm");
  });

  it("derives the page margin from the layout, not a user setting", () => {
    const base = createDefaultPdfPresentation();
    const split = resolvePdfPresentation({ ...base, layoutId: "split" });
    const academicMargin = resolvePdfPresentation({ ...base, layoutId: "academic" });
    expect(split.vars["--resume-page-margin"]).toBe("9mm");
    expect(academicMargin.vars["--resume-page-margin"]).toBe("18mm");
  });

  it("ties the gutter to half the page margin so inner air tracks the edge", () => {
    // Gutter is derived from the margin, not set per layout, or tight-margin rails read unbalanced.
    const base = createDefaultPdfPresentation();
    const split = resolvePdfPresentation({ ...base, layoutId: "split" });
    const academicMargin = resolvePdfPresentation({ ...base, layoutId: "academic" });
    expect(split.vars["--resume-gutter"]).toBe("4.5mm");
    expect(academicMargin.vars["--resume-gutter"]).toBe("9mm");
  });

  it("emits paper dimensions for the selected paper size", () => {
    const result = resolvePdfPresentation({
      ...createDefaultPdfPresentation(),
      paperSize: "letter",
    });

    expect(result.vars["--resume-paper-width"]).toBe("215.9mm");
    expect(result.vars["--resume-paper-height"]).toBe("279.4mm");
  });

  it("sets font-size based on fontScale", () => {
    const base = createDefaultPdfPresentation();
    const sm = resolvePdfPresentation({ ...base, fontScale: "sm" });
    const md = resolvePdfPresentation({ ...base, fontScale: "md" });
    const lg = resolvePdfPresentation({ ...base, fontScale: "lg" });

    expect(sm.vars["--resume-body"]).toBe("11px");
    expect(md.vars["--resume-body"]).toBe("12px");
    expect(lg.vars["--resume-body"]).toBe("14px");
  });

  it("makes section headings larger than item titles", () => {
    const result = resolvePdfPresentation();

    expect(parseFloat(result.vars["--resume-h2"])).toBeGreaterThan(
      parseFloat(result.vars["--resume-h3"]),
    );
  });

  it("emits secondary, tint, on-accent, meta, and indent variables", () => {
    const base = createDefaultPdfPresentation();
    const result = resolvePdfPresentation({ ...base, secondary: "#10b981" });

    expect(result.vars["--resume-secondary"]).toBe("#10b981");
    expect(result.vars["--resume-secondary-tint"]).toMatch(/^#[0-9a-f]{6}$/);
    expect(result.vars["--resume-on-accent"]).toBe("#ffffff");
    expect(result.vars["--resume-meta"]).toBeDefined();
    expect(result.vars["--resume-indent"]).toBe("14px");
  });

  it("defaults the secondary variable to the accent", () => {
    // The stock default now curates an explicit secondary, so pin the fallback
    // with a presentation that has none.
    const result = resolvePdfPresentation({
      ...createDefaultPdfPresentation(),
      secondary: undefined,
    });

    expect(result.vars["--resume-secondary"]).toBe(DEFAULT_ACCENT);
  });

  describe("photo shape", () => {
    const base = createDefaultPdfPresentation();

    it("emits no photo vars when photoShape is unset (layouts keep native look)", () => {
      const result = resolvePdfPresentation(base);

      expect(result.vars["--resume-photo-aspect"]).toBeUndefined();
      expect(result.vars["--resume-photo-radius"]).toBeUndefined();
    });

    it("circle forces a 1:1 aspect and a 50% radius", () => {
      const result = resolvePdfPresentation({ ...base, photoShape: "circle" });

      expect(result.vars["--resume-photo-aspect"]).toBe("1 / 1");
      expect(result.vars["--resume-photo-radius"]).toBe("50%");
    });

    it("square is 1:1 and keeps the layout's own corners", () => {
      const result = resolvePdfPresentation({ ...base, photoShape: "square" });

      expect(result.vars["--resume-photo-aspect"]).toBe("1 / 1");
      expect(result.vars["--resume-photo-radius"]).toBeUndefined();
    });

    it("rectangle is portrait 3:4 and keeps the layout's own corners", () => {
      const result = resolvePdfPresentation({
        ...base,
        photoShape: "rectangle",
      });

      expect(result.vars["--resume-photo-aspect"]).toBe("3 / 4");
      expect(result.vars["--resume-photo-radius"]).toBeUndefined();
    });

    // Without this, flat shapes inherit the layout's 50% and render round — the one thing not allowed.
    it("un-rounds a natively circular layout for the flat shapes", () => {
      const result = resolvePdfPresentation({
        ...base,
        layoutId: "crest",
        photoShape: "square",
      });

      expect(result.vars["--resume-photo-radius"]).toBe("12px");
    });
  });
});
