import type { Metadata } from "next";

import { Contribute } from "@/components/landing/contribute";
import { GrainOverlay } from "@/components/landing/grain-overlay";
import { LandingBody } from "@/components/landing/landing-body";
import { SiteFooter } from "@/components/landing/site-footer";
import {
  categoryHref,
  filterLabel,
  readCategory,
} from "@/components/templates/categories";
import { TemplatesGrid } from "@/components/templates/templates-grid";
import { TemplatesHero } from "@/components/templates/templates-hero";
import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { resumeTemplatePresets } from "@/features/resume-editor/domain/presentation/template-presets";
import { brand } from "@/lib/brand";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const category = readCategory((await searchParams).category);
  const label = filterLabel(category);
  const title =
    category === "all"
      ? `${resumeTemplatePresets.length} Resume Templates`
      : `${label} Resume Templates`;
  const description = `${category === "all" ? "Every" : label} resume template in ${brand.name}, across ${pdfLayoutIds.length} layouts. Free, open source, no sign-up.`;
  return {
    title,
    description,
    alternates: { canonical: categoryHref(category) },
    openGraph: { title, description, url: "/templates", type: "website" },
  };
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  const category = readCategory((await searchParams).category);

  return (
    <main className="flex min-h-dvh flex-col overflow-x-clip">
      <GrainOverlay />
      <LandingBody>
        <TemplatesHero category={category} />
        <TemplatesGrid category={category} />
        <Contribute />
      </LandingBody>
      <SiteFooter />
    </main>
  );
}
