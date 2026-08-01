import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResolvedPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export type PreviewMode = "preview" | "pdf";

// Carries its own kind rather than being identified by position: empty fields are dropped before
// render, so an index-based guess would mislabel every item after the gap.
export type PreviewContactItem =
  | { kind: "location"; value: string }
  | { kind: "phone"; value: string }
  | { kind: "email"; value: string }
  | { kind: "link"; value: string };

export type PreviewSectionItemMap = {
  [K in CollectionSectionKey]: ResumeDraft["sections"][K]["items"][number];
};

export type PreviewRenderableSection<
  K extends CollectionSectionKey = CollectionSectionKey,
> = {
  key: K;
  label: string;
  heading: string;
  items: PreviewSectionItemMap[K][];
};

export type AnyPreviewRenderableSection = {
  [K in CollectionSectionKey]: PreviewRenderableSection<K>;
}[CollectionSectionKey];

export type PreviewRenderContext = {
  draft: ResumeDraft;
  mode: PreviewMode;
  presentation: ResolvedPdfPresentation;
  contactItems: PreviewContactItem[];
  summaryContent: string | null;
  sections: AnyPreviewRenderableSection[];
};

export type PreviewRendererProps = {
  draft: ResumeDraft;
  mode?: PreviewMode;
  className?: string;
};
