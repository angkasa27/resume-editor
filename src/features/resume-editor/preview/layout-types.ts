import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type {
  PreviewRenderableSection,
  PreviewRenderContext,
} from "@/features/resume-editor/preview/types";

export type LayoutColumn = "main" | "side";

export type LayoutSectionItemMap = {
  [K in CollectionSectionKey]: (props: {
    item: SectionItem<K>;
  }) => ReactNode;
};

/**
 * Distributed over CollectionSectionKey so `entry.key === "skills"` narrows `entry.section` type-safely, no cast needed.
 * `section` is optional: canvas renders a slot for every section including empty ones, so guard before reading it.
 */
export type LayoutSectionEntry = {
  [K in CollectionSectionKey]: {
    key: K;
    node: ReactNode;
    section?: PreviewRenderableSection<K>;
  };
}[CollectionSectionKey];

export type LayoutSlots = {
  header: ReactNode;
  summary: ReactNode | null;
  sections: LayoutSectionEntry[];
};

export type LayoutComponentProps = {
  context: PreviewRenderContext;
  slots: LayoutSlots;
};

export type LayoutHeaderProps = {
  context: PreviewRenderContext;
};

export type PreviewLayoutDefinition = {
  id: PdfLayoutId;
  label: string;
  description: string;
  /**
   * True when the layout renders its own Summary heading, so the shared SummaryView suppresses its <h2>.
   * Single source of truth for `shouldHideSummaryHeading` — no separate hardcoded id list.
   * Hide only where the summary reads as a lede paragraph under the header (classic, banner, timeline);
   * keep it shown elsewhere, since a visible heading is also the safer default for ATS parsers.
   */
  hideSummaryHeading?: boolean;
  Component: (props: LayoutComponentProps) => ReactNode;
  Header: (props: LayoutHeaderProps) => ReactNode;
  itemViews: LayoutSectionItemMap;
  getColumn?: (sectionKey: CollectionSectionKey) => LayoutColumn;
};
