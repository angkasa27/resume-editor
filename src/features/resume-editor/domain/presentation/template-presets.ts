import type { ResumeFontId } from "@/features/resume-editor/domain/presentation/font-collection";
import type {
  PdfFontScaleId,
  PdfLayoutId,
  PdfLineHeightId,
  PdfPresentation,
  PdfSpacingId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

/** The style half of a template. `secondary` is explicit — a preset either sets it or clears it back to the accent fallback. */
type ResumeTemplateStyle = {
  accent: string;
  secondary?: string;
  fontFamilyId: ResumeFontId;
  fontScale: PdfFontScaleId;
  spacing: PdfSpacingId;
  lineHeight: PdfLineHeightId;
};

/** A layout plus a curated style. Applying one is a single undo step; paperSize is untouched, photoShape resets. */
export type ResumeTemplatePreset = {
  id: string;
  label: string;
  layoutId: PdfLayoutId;
  style: ResumeTemplateStyle;
};

export const resumeTemplatePresets: ReadonlyArray<ResumeTemplatePreset> = [
  // Curation rules: `secondary` only set for the 3 layouts that render it (modern-centered,
  // sidebar, split) — elsewhere it'd be dead data getActiveTemplatePresetId still has to match.
  // `accent` usage varies per layout (band fill vs. highlighter vs. heading text). Density
  // follows layout structure (rails run tight, whitespace-led run airy), not taste.

  // classic — traditional single column. Plain, ATS-safest pick; matches the stock default.
  {
    id: "classic-modern",
    label: "Modern",
    layoutId: "classic",
    style: {
      accent: "#2563eb",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "classic-executive",
    label: "Executive",
    layoutId: "classic",
    style: {
      accent: "#1e3a5f",
      fontFamilyId: "georgia",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  // Arial + near-black, no flourish: the safest thing to put in a parser.
  {
    id: "classic-ats",
    label: "ATS Safe",
    layoutId: "classic",
    style: {
      accent: "#1f2937",
      fontFamilyId: "arial",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // sidebar — accent band over a secondary-tinted rail. Two colour slots, so
  // accent and secondary are siblings: same hue family, enough gap to read.
  {
    id: "sidebar-slate",
    label: "Slate",
    layoutId: "sidebar",
    style: {
      accent: "#334155",
      secondary: "#475569",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "sidebar-forest",
    label: "Forest",
    layoutId: "sidebar",
    style: {
      accent: "#166534",
      secondary: "#15803d",
      fontFamilyId: "lato",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "sidebar-lavender",
    label: "Lavender",
    layoutId: "sidebar",
    style: {
      accent: "#6d28d9",
      secondary: "#7c3aed",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // modern-centered — secondary is the short rule under the name and headings,
  // so it is set a step brighter than the accent to actually register.
  {
    id: "centered-ocean",
    label: "Ocean",
    layoutId: "modern-centered",
    style: {
      accent: "#0369a1",
      secondary: "#38bdf8",
      fontFamilyId: "open-sans",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "centered-editorial",
    label: "Editorial",
    layoutId: "modern-centered",
    style: {
      accent: "#9f1239",
      secondary: "#e11d48",
      fontFamilyId: "playfair-display",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },

  // timeline — accent draws the dots and the date gutter. The gutter already
  // spends width, so these stay at standard density.
  {
    id: "timeline-indigo",
    label: "Indigo",
    layoutId: "timeline",
    style: {
      accent: "#4338ca",
      fontFamilyId: "roboto",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "timeline-amber",
    label: "Amber",
    layoutId: "timeline",
    style: {
      accent: "#b45309",
      fontFamilyId: "lora",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "relaxed",
    },
  },

  // academic — dense CV in small-caps. Serif by convention, and small scale
  // because a real CV runs long.
  {
    id: "academic-oxford",
    label: "Oxford",
    layoutId: "academic",
    style: {
      accent: "#1e3a8a",
      fontFamilyId: "georgia",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "academic-burgundy",
    label: "Burgundy",
    layoutId: "academic",
    style: {
      accent: "#7f1d1d",
      fontFamilyId: "merriweather",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "academic-journal",
    label: "Journal",
    layoutId: "academic",
    style: {
      accent: "#111827",
      fontFamilyId: "times-new-roman",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },

  // inset — the label gutter eats 110px, so these run tight to keep the
  // content column wide enough to read.
  {
    id: "inset-steel",
    label: "Steel",
    layoutId: "inset",
    style: {
      accent: "#0f766e",
      fontFamilyId: "open-sans",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },
  {
    id: "inset-crimson",
    label: "Crimson",
    layoutId: "inset",
    style: {
      accent: "#b91c1c",
      fontFamilyId: "georgia",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // banner — accent is a full-bleed band behind white text, so every pick is
  // deep enough to carry it. No secondary: banner never renders one.
  {
    id: "banner-royal",
    label: "Royal",
    layoutId: "banner",
    style: {
      accent: "#1d4ed8",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "banner-emerald",
    label: "Emerald",
    layoutId: "banner",
    style: {
      accent: "#047857",
      fontFamilyId: "lato",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "banner-charcoal",
    label: "Charcoal",
    layoutId: "banner",
    style: {
      accent: "#1f2937",
      fontFamilyId: "roboto",
      fontScale: "md",
      spacing: "compact",
      lineHeight: "standard",
    },
  },

  // split — secondary fills the full-height rail and accent is the name beside
  // it, so the two are set far enough apart to separate the columns.
  {
    id: "split-midnight",
    label: "Midnight",
    layoutId: "split",
    style: {
      accent: "#0369a1",
      secondary: "#0f172a",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "split-terracotta",
    label: "Terracotta",
    layoutId: "split",
    style: {
      accent: "#9a3412",
      secondary: "#7c2d12",
      fontFamilyId: "lora",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // bold-type — accent is the marker highlight under each heading and the date
  // colour, NOT the heading text. It has to be vivid; a near-black accent here
  // renders the highlight as a grey smudge.
  {
    id: "bold-citrus",
    label: "Citrus",
    layoutId: "bold-type",
    style: {
      accent: "#ea580c",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "compact",
      lineHeight: "tight",
    },
  },
  {
    id: "bold-lime",
    label: "Lime",
    layoutId: "bold-type",
    style: {
      accent: "#65a30d",
      fontFamilyId: "roboto",
      fontScale: "lg",
      spacing: "standard",
      lineHeight: "tight",
    },
  },

  // studio — badges and chips carry the page, so the accent has to survive being
  // shrunk to a 12% tint. Mid-tone hues only; pale ones vanish in the chip fill.
  {
    id: "studio-violet",
    label: "Violet",
    layoutId: "studio",
    style: {
      accent: "#7c3aed",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "studio-teal",
    label: "Teal",
    layoutId: "studio",
    style: {
      accent: "#0d9488",
      fontFamilyId: "open-sans",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },

  // spotlight — the rail is a gradient between accent and secondary, so both
  // ends must be set and far enough apart to read as a gradient at all.
  {
    id: "spotlight-dusk",
    label: "Dusk",
    layoutId: "spotlight",
    style: {
      accent: "#4338ca",
      secondary: "#0f172a",
      fontFamilyId: "inter",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },
  {
    id: "spotlight-ember",
    label: "Ember",
    layoutId: "spotlight",
    style: {
      accent: "#b45309",
      secondary: "#7f1d1d",
      fontFamilyId: "roboto",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },
];

/** Applies layout + curated style in one shot; preserves paperSize, clears photoShape. */
export function applyTemplatePreset(
  preset: ResumeTemplatePreset,
  current: PdfPresentation,
): PdfPresentation {
  return {
    layoutId: preset.layoutId,
    accent: preset.style.accent,
    secondary: preset.style.secondary,
    fontFamilyId: preset.style.fontFamilyId,
    fontScale: preset.style.fontScale,
    spacing: preset.style.spacing,
    lineHeight: preset.style.lineHeight,
    paperSize: current.paperSize,
    photoShape: undefined,
  };
}

/** Applies only the preset's layout, preserving all of the user's style. */
export function applyTemplatePresetLayoutOnly(
  preset: ResumeTemplatePreset,
  current: PdfPresentation,
): PdfPresentation {
  return { ...current, layoutId: preset.layoutId };
}

/** Derives the active template from the current presentation (not a stored selection), so a hand-tweak drops the highlight naturally. */
export function getActiveTemplatePresetId(
  presentation: PdfPresentation,
): string | null {
  for (const preset of resumeTemplatePresets) {
    const applied = applyTemplatePreset(preset, presentation);
    if (
      applied.layoutId === presentation.layoutId &&
      applied.accent === presentation.accent &&
      (applied.secondary ?? null) === (presentation.secondary ?? null) &&
      applied.fontFamilyId === presentation.fontFamilyId &&
      applied.fontScale === presentation.fontScale &&
      applied.spacing === presentation.spacing &&
      applied.lineHeight === presentation.lineHeight &&
      (presentation.photoShape ?? null) === null
    ) {
      return preset.id;
    }
  }
  return null;
}
