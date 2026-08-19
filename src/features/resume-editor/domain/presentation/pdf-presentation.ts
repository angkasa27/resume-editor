import {
  readableTextOn,
  tintHex,
} from "@/features/resume-editor/domain/presentation/color-utils";
import {
  DEFAULT_FONT_ID,
  getFont,
  resumeFontIds,
  type ResumeFontId,
} from "@/features/resume-editor/domain/presentation/font-collection";

export { resumeFontIds, type ResumeFontId };

export const pdfLayoutIds = [
  "classic",
  "modern-centered",
  "timeline",
  "academic",
  "inset",
  "split",
  "duet",
  "bold-type",
  "studio",
  "aurora",
  "ledger",
  "dossier",
  "crest",
  "masthead",
  "compass",
  "numeral",
  "atlas",
  "editorial",
  "harvard",
] as const;
export type PdfLayoutId = (typeof pdfLayoutIds)[number];

/** Retired layout ids mapped to their closest relative, so a saved draft doesn't silently fall back to `classic`. */
const retiredLayoutIds: Record<string, PdfLayoutId> = {
  tinted: "split",
  minimal: "academic",
  mosaic: "classic",
  // Culled July 2026 — all three read as near-duplicates of what replaced them.
  sidebar: "ledger",
  spotlight: "split",
  banner: "crest",
};

export const pdfFontScaleIds = ["sm", "md", "lg"] as const;
export type PdfFontScaleId = (typeof pdfFontScaleIds)[number];

export const pdfLineHeightIds = ["tight", "standard", "relaxed"] as const;
export type PdfLineHeightId = (typeof pdfLineHeightIds)[number];

export const pdfSpacingIds = ["compact", "standard", "airy"] as const;
export type PdfSpacingId = (typeof pdfSpacingIds)[number];

export const pdfPaperSizes = ["a4", "letter"] as const;
export type PdfPaperSize = (typeof pdfPaperSizes)[number];

export const pdfPhotoShapeIds = ["square", "rectangle", "circle"] as const;
export type PdfPhotoShapeId = (typeof pdfPhotoShapeIds)[number];

/** Layouts whose native photo is a circle: a square/rectangle pick leaves the radius var
 *  unset for other layouts, but these would stay round. Keep in sync with the layout CSS. */
const roundPhotoLayoutFlatRadius: Partial<Record<PdfLayoutId, string>> = {
  split: "12px",
  duet: "12px",
  "modern-centered": "12px",
  dossier: "12px",
  crest: "12px",
};

export type PdfPresentation = {
  layoutId: PdfLayoutId;
  fontFamilyId: ResumeFontId;
  fontScale: PdfFontScaleId;
  spacing: PdfSpacingId;
  lineHeight: PdfLineHeightId;
  accent: string;
  /** Optional second theme color; falls back to `accent` when unset. */
  secondary?: string;
  paperSize: PdfPaperSize;
  /** Optional photo-shape override; unset keeps each layout's native aspect/radius. */
  photoShape?: PdfPhotoShapeId;
  /** Whether links carry their layout's visual cue. Required, not optional: off is a
   *  real choice, so `undefined` would be a third state with no meaning. */
  linkHighlight: boolean;
};

export type ResolvedPdfPresentation = {
  layoutId: PdfLayoutId;
  vars: Record<string, string>;
  /** Drives a root data attribute rather than a var: layouts branch on it, not read it. */
  linkHighlight: boolean;
};

export const pdfPhotoShapeLabels: Record<PdfPhotoShapeId, string> = {
  square: "Square",
  rectangle: "Rectangle",
  circle: "Circle",
};

export const pdfFontScaleLabels: Record<PdfFontScaleId, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
};

export const pdfLineHeightLabels: Record<PdfLineHeightId, string> = {
  tight: "Tight",
  standard: "Standard",
  relaxed: "Relaxed",
};

export const pdfSpacingLabels: Record<PdfSpacingId, string> = {
  compact: "Compact",
  standard: "Standard",
  airy: "Airy",
};

export const pdfPaperSizeLabels: Record<PdfPaperSize, string> = {
  a4: "A4",
  letter: "Letter",
};

const fontBasePx: Record<PdfFontScaleId, number> = {
  sm: 11,
  md: 12,
  lg: 14,
};

const lineHeightValues: Record<PdfLineHeightId, number> = {
  tight: 1.4,
  standard: 1.6,
  relaxed: 1.9,
};

const sectionGapPx: Record<PdfSpacingId, number> = {
  compact: 12,
  standard: 16,
  airy: 20,
};

const itemGapPx: Record<PdfSpacingId, number> = {
  compact: 6,
  standard: 10,
  airy: 14,
};

const innerGapPx: Record<PdfSpacingId, number> = {
  compact: 4,
  standard: 6,
  airy: 8,
};

const indentPx: Record<PdfSpacingId, number> = {
  compact: 10,
  standard: 14,
  airy: 18,
};

/** Page margin is per-layout, not a user knob: a rail layout needs it tight, a typographic one needs it wide. */
const layoutPageMarginMm: Record<PdfLayoutId, number> = {
  split: 9, // 0.36fr solid full-height rail — tightest; the rail needs the width
  duet: 10, // near-even columns; the tinted left column bleeds, so keep insets tight
  aurora: 14, // the label gutter needs the width back
  "bold-type": 12, // oversized type wants edge tension
  studio: 15, // chips and badges need room to sit apart
  classic: 14, // traditional letter feel
  timeline: 14, // date gutter already eats width
  inset: 14, // boxed items supply their own inner air
  "modern-centered": 16, // centered header needs side air or the name crowds the edge
  academic: 18, // the margin is the formality
  dossier: 10, // 0.34fr solid rail on the right, same economics as split
  masthead: 12, // badge headings already indent the body optically
  crest: 14, // body matches classic; the band owns its own padding
  ledger: 16, // the divider rule needs air on both sides to read as a spine
  atlas: 12, // three tracks; every millimetre of margin costs a track its measure
  compass: 14, // the hanging glyphs already read as a margin of their own
  numeral: 16, // a 150px date gutter inside a wide margin is the whole look
  editorial: 20, // whitespace is the layout — the band and the spreads both need it
  harvard: 18, // the format is a Word document with wide margins; keep them
};

/** Page margin scales with `spacing` so density stays a single coherent choice. */
const pageMarginSpacingFactor: Record<PdfSpacingId, number> = {
  compact: 0.85,
  standard: 1,
  airy: 1.15,
};

export const paperDimensions: Record<
  PdfPaperSize,
  { widthMm: number; heightMm: number }
> = {
  a4: { widthMm: 210, heightMm: 297 },
  letter: { widthMm: 215.9, heightMm: 279.4 },
};

/** CSS px per millimetre at 96dpi — used to scale on-screen paper previews. */
const PX_PER_MM = 96 / 25.4;

/** Paper width in CSS pixels, for scaling a full-size document into a thumbnail. */
export function getPaperWidthPx(paperSize: PdfPaperSize): number {
  return paperDimensions[paperSize].widthMm * PX_PER_MM;
}

/** The stock presentation's accent — aurora-haze's haze violet. */
export const DEFAULT_ACCENT = "#a78bfa";

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export function isValidAccentHex(value: unknown): value is string {
  return typeof value === "string" && hexColorPattern.test(value);
}

export function getEffectiveSecondary(presentation: PdfPresentation): string {
  return presentation.secondary ?? presentation.accent;
}

export function getPaperDimensionsMm(paperSize: PdfPaperSize) {
  return paperDimensions[paperSize];
}

/** Resolved page margin for a layout at a given density, in millimetres. */
export function getPageMarginMm(layoutId: PdfLayoutId, spacing: PdfSpacingId) {
  return (
    Math.round(
      layoutPageMarginMm[layoutId] * pageMarginSpacingFactor[spacing] * 100,
    ) / 100
  );
}

/** Nominal margin for length estimates only — a constant on purpose so the length
 *  score doesn't move when you switch layouts without touching content. */
export const NOMINAL_LENGTH_MARGIN_MM = 14;

export function createDefaultPdfPresentation(): PdfPresentation {
  // The stock default is the aurora-haze preset; keep these in sync with it so
  // the template gallery highlights the default template on first load.
  return {
    layoutId: "aurora",
    fontFamilyId: DEFAULT_FONT_ID,
    fontScale: "sm",
    spacing: "standard",
    lineHeight: "standard",
    accent: DEFAULT_ACCENT,
    secondary: "#a5f3fc",
    paperSize: "a4",
    linkHighlight: true,
  };
}

function isMember<T extends string>(
  ids: ReadonlyArray<T>,
  value: unknown,
): value is T {
  return typeof value === "string" && ids.includes(value as T);
}

function normalizeLayoutId(value: unknown, fallback: PdfLayoutId): PdfLayoutId {
  if (isMember(pdfLayoutIds, value)) return value;
  if (typeof value === "string" && value in retiredLayoutIds) {
    return retiredLayoutIds[value];
  }
  return fallback;
}

export function normalizePdfPresentation(input: unknown): PdfPresentation {
  const defaults = createDefaultPdfPresentation();
  if (typeof input !== "object" || input === null) return defaults;

  const source = input as Record<string, unknown>;

  return {
    layoutId: normalizeLayoutId(source.layoutId, defaults.layoutId),
    fontFamilyId: isMember(resumeFontIds, source.fontFamilyId)
      ? source.fontFamilyId
      : defaults.fontFamilyId,
    fontScale: isMember(pdfFontScaleIds, source.fontScale)
      ? source.fontScale
      : defaults.fontScale,
    spacing: isMember(pdfSpacingIds, source.spacing)
      ? source.spacing
      : defaults.spacing,
    lineHeight: isMember(pdfLineHeightIds, source.lineHeight)
      ? source.lineHeight
      : defaults.lineHeight,
    accent: isValidAccentHex(source.accent) ? source.accent : defaults.accent,
    secondary: isValidAccentHex(source.secondary)
      ? source.secondary
      : undefined,
    paperSize: isMember(pdfPaperSizes, source.paperSize)
      ? source.paperSize
      : defaults.paperSize,
    photoShape: isMember(pdfPhotoShapeIds, source.photoShape)
      ? source.photoShape
      : undefined,
    // Drafts saved before the control existed have no value; they keep the
    // underlines they were written with.
    linkHighlight:
      typeof source.linkHighlight === "boolean"
        ? source.linkHighlight
        : defaults.linkHighlight,
  };
}

export function resolvePdfPresentation(
  presentation?: PdfPresentation,
): ResolvedPdfPresentation {
  const p = normalizePdfPresentation(presentation);
  const base = fontBasePx[p.fontScale];
  const leading = lineHeightValues[p.lineHeight];
  const paper = paperDimensions[p.paperSize];
  const margin = getPageMarginMm(p.layoutId, p.spacing);
  const secondary = getEffectiveSecondary(p);

  const vars: Record<string, string> = {
    "--resume-font": getFont(p.fontFamilyId).stack,
    "--resume-text": "#111827",
    "--resume-muted": "#4b5563",
    "--resume-border": "#cbd5e1",
    "--resume-accent": p.accent,
    "--resume-secondary": secondary,
    "--resume-secondary-tint": tintHex(secondary, 0.9),
    "--resume-on-accent": readableTextOn(p.accent),
    "--resume-on-secondary": readableTextOn(secondary),
    "--resume-h1": `${Number((base * 2.3).toFixed(2))}px`,
    "--resume-h2": `${Number((base * 1.25).toFixed(2))}px`,
    "--resume-h3": `${Number((base * 1.05).toFixed(2))}px`,
    "--resume-meta": `${Number((base * 0.92).toFixed(2))}px`,
    "--resume-body": `${base}px`,
    "--resume-leading": String(leading),
    "--resume-gap-section": `${sectionGapPx[p.spacing]}px`,
    "--resume-gap-item": `${itemGapPx[p.spacing]}px`,
    "--resume-gap-inner": `${innerGapPx[p.spacing]}px`,
    "--resume-gutter": `${margin / 2}mm`,
    "--resume-indent": `${indentPx[p.spacing]}px`,
    "--resume-paper-width": `${paper.widthMm}mm`,
    "--resume-paper-height": `${paper.heightMm}mm`,
    "--resume-page-margin": `${margin}mm`,
  };

  // Only emit when set, so unset falls back to each layout's native CSS-var look.
  if (p.photoShape) {
    vars["--resume-photo-aspect"] =
      p.photoShape === "rectangle" ? "3 / 4" : "1 / 1";
    // Shape swaps aspect only; natively round layouts need an explicit flat radius
    // so a square/rectangle pick doesn't stay round.
    if (p.photoShape === "circle") {
      vars["--resume-photo-radius"] = "50%";
    } else if (roundPhotoLayoutFlatRadius[p.layoutId]) {
      vars["--resume-photo-radius"] = roundPhotoLayoutFlatRadius[p.layoutId]!;
    }
  }

  return { layoutId: p.layoutId, vars, linkHighlight: p.linkHighlight };
}
