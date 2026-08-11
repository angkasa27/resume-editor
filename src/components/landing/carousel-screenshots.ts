import {
  resumeTemplatePresets,
  templateLabel,
} from "@/features/resume-editor/domain/presentation/template-presets";

type CarouselScreenshot = {
  /** Matches presetId; also the filename stem: public/templates/<id>.webp */
  id: string;
  /** "Classic Modern", "Sidebar Slate" — shown on hover */
  label: string;
};

/**
 * Derived, not hand-listed: the carousel is the landing page's preview of what
 * the template gallery actually offers, so the two must not drift. A new preset
 * appears here automatically, and `pnpm screenshots` refuses to run until that
 * preset has a persona — so the image exists before the card does.
 */
export const CAROUSEL_SCREENSHOTS: CarouselScreenshot[] =
  resumeTemplatePresets.map((preset) => ({
    id: preset.id,
    label: templateLabel(preset),
  }));
