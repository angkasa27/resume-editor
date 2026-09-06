import type { Metadata } from "next";
import Link from "next/link";

import { Contribute } from "@/components/landing/contribute";
import { GrainOverlay } from "@/components/landing/grain-overlay";
import { LandingBody } from "@/components/landing/landing-body";
import { PageBackdrop } from "@/components/landing/page-backdrop";
import { Reveal, RevealItem, RevealStagger } from "@/components/landing/reveal";
import { SiteFooter } from "@/components/landing/site-footer";
import { TemplateGridCard } from "@/components/landing/template-grid-card";
import { toggleVariants } from "@/components/ui/toggle";
import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  resumeTemplatePresets,
  templateCategories,
  templateCategoryIds,
  templateLabel,
  type TemplateCategoryId,
} from "@/features/resume-editor/domain/presentation/template-presets";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

type CategoryFilter = TemplateCategoryId | "all";

const FILTERS: ReadonlyArray<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "ats", label: "ATS" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
];

/** The chips are links, not state — each category is its own shareable URL and
 *  the page needs no client JS. */
function readCategory(raw: string | string[] | undefined): CategoryFilter {
  return templateCategoryIds.includes(raw as TemplateCategoryId)
    ? (raw as TemplateCategoryId)
    : "all";
}

function categoryHref(category: CategoryFilter): string {
  return category === "all" ? "/templates" : `/templates?category=${category}`;
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const category = readCategory((await searchParams).category);
  const label = FILTERS.find((filter) => filter.value === category)!.label;
  const title =
    category === "all"
      ? `${resumeTemplatePresets.length} Resume Templates`
      : `${label} Resume Templates`;
  const description = `${label === "All" ? "Every" : label} resume template in ${brand.name}, across ${pdfLayoutIds.length} layouts. Free, open source, no sign-up.`;
  return {
    title,
    description,
    alternates: { canonical: categoryHref(category) },
    openGraph: { title, description, url: "/templates", type: "website" },
  };
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  const category = readCategory((await searchParams).category);

  // Sorted by card name like the editor gallery, so a chip only removes cards
  // rather than reshuffling the ones that stay.
  const presets = resumeTemplatePresets
    .filter(
      (preset) =>
        category === "all" || templateCategories(preset).includes(category),
    )
    .toSorted((a, b) => templateLabel(a).localeCompare(templateLabel(b)));

  return (
    <main className="flex min-h-dvh flex-col overflow-x-clip">
      <GrainOverlay />
      <LandingBody>
        {/* The backdrop is scoped to this header, like the hero's — spanning the
            grid too would stretch the aurora over the whole page. */}
        <section className="relative overflow-hidden px-6 pt-24 pb-12 sm:pt-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <PageBackdrop />
          </div>

          <RevealStagger className="relative mx-auto max-w-2xl text-center">
            <RevealItem>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Templates{" "}
                <span className="bg-linear-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
                  Collection
                </span>
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
                From strictly ATS-safe to boldly creative, pick the one that
                fits the job you&apos;re going for.
              </p>
            </RevealItem>
            {/* In the cascade, not after it — the chips are the third beat of
                the header, following the heading and the subtitle. */}
            <RevealItem className="relative mx-auto mt-12 max-w-2xl">
              <nav
                aria-label="Filter templates by category"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {FILTERS.map((filter) => {
                  const active = filter.value === category;
                  return (
                    <Link
                      key={filter.value}
                      href={categoryHref(filter.value)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        toggleVariants({ variant: "outline", size: "sm" }),
                        // The variant is `bg-transparent`, which works on the
                        // editor's solid panel but not over the page gradient —
                        // the chip needs its own surface here.
                        "h-7 rounded-full bg-background px-4 text-xs",
                        // Active state is applied directly rather than through
                        // `aria-pressed:` — these are links, so the current one
                        // is marked with aria-current, not a pressed state. The
                        // tint is a background-image so it lays over that
                        // surface instead of replacing it.
                        active &&
                          "border-primary/20 bg-linear-to-r from-primary/10 to-primary/10 text-primary",
                      )}
                    >
                      {filter.label}
                    </Link>
                  );
                })}
              </nav>
            </RevealItem>
          </RevealStagger>
        </section>

        <section className="px-6 pb-24 sm:pb-32">
          {/* Keyed on the category so a filter re-deals the whole grid in one
              cascade. Without it, cards that survive the filter keep their
              identity and stay put while only the new ones animate in. */}
          <div
            key={category}
            className="mx-auto grid max-w-[80rem] grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
          >
            {presets.map((preset, i) => (
              // Each card reveals on its own scroll-in, offset by its column so
              // a row cascades left to right. One <RevealStagger> over all 58
              // would run a single 4s cascade from the top of the page and be
              // over long before most of them are scrolled to.
              <Reveal key={preset.id} delay={(i % 4) * 0.08}>
                <TemplateGridCard preset={preset} />
              </Reveal>
            ))}
          </div>
        </section>

        <Contribute />
      </LandingBody>
      <SiteFooter />
    </main>
  );
}
