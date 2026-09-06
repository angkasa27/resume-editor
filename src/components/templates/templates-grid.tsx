import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/landing/reveal";
import { FOCUS_RING_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import {
  templateLabel,
  type ResumeTemplatePreset,
} from "@/features/resume-editor/domain/presentation/template-presets";
import { cn } from "@/lib/utils";

import { presetsInCategory, type CategoryFilter } from "./categories";

const COLUMNS = 4;

export function TemplatesGrid({ category }: { category: CategoryFilter }) {
  const presets = presetsInCategory(category);
  return (
    <section className="px-6 pb-24 sm:pb-32">
      {/* Keyed on the category so a filter re-deals the whole grid in one
          cascade. Without it, cards that survive the filter keep their identity
          and stay put while only the new ones animate in. */}
      <div
        key={category}
        className="mx-auto grid max-w-[80rem] grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
      >
        {presets.map((preset, i) => (
          // Each card reveals on its own scroll-in, offset by its column so a
          // row cascades left to right. One <RevealStagger> over all of them
          // would run a single 4s cascade from the top of the page and be over
          // long before most are scrolled to.
          <Reveal key={preset.id} delay={(i % COLUMNS) * 0.08}>
            <TemplateCard preset={preset} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Browsable grid card. The carousel's card is marquee-shaped (fixed width,
 *  hover-only label) — this one is read, not glanced at. */
function TemplateCard({ preset }: { preset: ResumeTemplatePreset }) {
  const label = templateLabel(preset);
  return (
    <Link
      href={`/editor?template=${preset.id}`}
      className={cn("group flex flex-col gap-3 rounded-xl", FOCUS_RING_CLASS)}
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
      <span className="text-center text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
        {label}
      </span>
    </Link>
  );
}
