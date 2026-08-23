import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type { TitleLinkMarker } from "@/features/resume-editor/preview/kit/title-link-marker";
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

/** Distributed over CollectionSectionKey so `slot.key === "skills"` narrows
 * `slot.section` type-safely. `section` is optional — guard before reading. */
export type LayoutSectionSlot = {
  [K in CollectionSectionKey]: {
    key: K;
    node: ReactNode;
    section?: PreviewRenderableSection<K>;
  };
}[CollectionSectionKey];

export type LayoutSlots = {
  header: ReactNode;
  summary: ReactNode | null;
  sections: LayoutSectionSlot[];
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
  /** True when the layout renders its own Summary heading, so SummaryView
   * suppresses its <h2>. Hide only where the summary reads as a lede under the
   * header; elsewhere a visible heading is the safer ATS default. */
  hideSummaryHeading?: boolean;
  Component: (props: LayoutComponentProps) => ReactNode;
  Header: (props: LayoutHeaderProps) => ReactNode;
  itemViews: LayoutSectionItemMap;
  /** Decorates the shared section <h2> (e.g. with an icon). Layouts can't do it
   * themselves: the node they receive is already wrapped for click-to-edit. */
  renderSectionHeading?: (
    sectionKey: CollectionSectionKey | "summary",
    heading: ReactNode,
  ) => ReactNode;
  getColumn?: (sectionKey: CollectionSectionKey) => LayoutColumn;
  /** Glyph marking a linked item title. Layouts that mark titles with an
   *  underline instead leave this unset and set `--resume-link-title-decoration`. */
  titleLinkMarker?: TitleLinkMarker;
};
