import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { FOCUS_RING_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import {
  templateLabel,
  type ResumeTemplatePreset,
} from "@/features/resume-editor/domain/presentation/template-presets";

/** Browsable grid card. The carousel's card is marquee-shaped (fixed width,
 *  hover-only label) — this one is read, not glanced at. */
export function TemplateGridCard({
  preset,
}: {
  preset: ResumeTemplatePreset;
}) {
  const label = templateLabel(preset);
  return (
    <Link
      href={`/editor?template=${preset.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl",
        FOCUS_RING_CLASS,
      )}
    >
      <div className="relative aspect-[1/1.414] overflow-hidden rounded-xl border bg-background transition-shadow duration-300 group-hover:shadow-lg">
        <Image
          src={`/templates/${preset.id}.webp`}
          alt={`${label} resume template`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
          className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          quality={80}
        />
      </div>
      <span className="text-sm font-semibold tracking-tight transition-colors group-hover:text-primary text-center">
        {label}
      </span>
    </Link>
  );
}
