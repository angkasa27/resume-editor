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
 * Derived, not hand-listed — the carousel previews the template gallery, so
 * the two must not drift. `pnpm screenshots` blocks until each preset has a
 * persona, so the image exists before the card does.
 */
export const CAROUSEL_SCREENSHOTS: CarouselScreenshot[] =
  resumeTemplatePresets.map((preset) => ({
    id: preset.id,
    label: templateLabel(preset),
  }));
