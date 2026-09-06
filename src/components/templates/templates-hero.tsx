import Link from "next/link";

import { PageBackdrop } from "@/components/landing/page-backdrop";
import {
  RevealItem,
  RevealStagger,
} from "@/components/landing/reveal";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

import {
  categoryHref,
  filterLabel,
  templateFilters,
  type CategoryFilter,
} from "./categories";

export function TemplatesHero({ category }: { category: CategoryFilter }) {
  return (
    // The backdrop is scoped to this header, like the hero's — spanning the
    // grid too would stretch the aurora over the whole page.
    <section className="relative overflow-hidden px-6 pt-24 pb-12 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
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
            From strictly ATS-safe to boldly creative, pick the one that fits
            the job you&apos;re going for.
          </p>
        </RevealItem>
        {/* In the cascade, not after it — the chips are the third beat of the
            header, following the heading and the subtitle. */}
        <RevealItem className="relative mx-auto mt-12 max-w-2xl">
          <CategoryNav category={category} />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

function CategoryNav({ category }: { category: CategoryFilter }) {
  return (
    <nav
      aria-label="Filter templates by category"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {templateFilters.map((filter) => {
        const active = filter === category;
        return (
          <Link
            key={filter}
            href={categoryHref(filter)}
            aria-current={active ? "page" : undefined}
            className={cn(
              toggleVariants({ variant: "outline", size: "sm" }),
              // The variant is `bg-transparent`, which works on the editor's
              // solid panel but not over the page gradient — the chip needs
              // its own surface here.
              "h-7 rounded-full bg-background px-4 text-xs",
              // Active state is applied directly rather than through
              // `aria-pressed:` — these are links, so the current one is
              // marked with aria-current, not a pressed state. The tint is a
              // background-image so it lays over that surface instead of
              // replacing it.
              active &&
                "border-primary/20 bg-linear-to-r from-primary/10 to-primary/10 text-primary",
            )}
          >
            {filterLabel(filter)}
          </Link>
        );
      })}
    </nav>
  );
}
