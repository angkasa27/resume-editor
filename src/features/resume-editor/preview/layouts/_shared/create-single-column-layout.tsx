import type { ReactNode } from "react";

import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
  LayoutHeaderProps,
  LayoutSectionItemMap,
  LayoutSlots,
} from "@/features/resume-editor/preview/layout-types";

type SingleColumnConfig = {
  id: PreviewLayoutDefinition["id"];
  label: string;
  description: string;
  /** Each layout MUST pass its own hashed CSS module (only `.layout` is read). */
  styles: Readonly<Record<string, string>>;
  Header: (props: LayoutHeaderProps) => ReactNode;
  itemViews: LayoutSectionItemMap;
  hideSummaryHeading?: boolean;
  renderSectionHeading?: PreviewLayoutDefinition["renderSectionHeading"];
  /** `"page"` (default) applies shared `page-inset` padding; `"none"` lets full-bleed layouts (e.g. banner) manage their own insets. */
  inset?: "page" | "none";
  /** Extension point for structural uniqueness; defaults to the plain `<div>{node}</div>` wrapper. */
  renderSection?: (entry: LayoutSlots["sections"][number]) => ReactNode;
  titleLinkMarker?: PreviewLayoutDefinition["titleLinkMarker"];
};

const defaultRenderSection = (
  entry: LayoutSlots["sections"][number],
): ReactNode => <div key={entry.key}>{entry.node}</div>;

// Factory for single-column layouts whose Component body is otherwise
// byte-identical; a genuinely different structure writes its own Component.
export function createSingleColumnLayout(
  config: SingleColumnConfig,
): PreviewLayoutDefinition {
  const renderSection = config.renderSection ?? defaultRenderSection;
  const rootClassName =
    config.inset === "none"
      ? config.styles.layout
      : `${config.styles.layout} page-inset`;

  function SingleColumnLayout({ slots }: LayoutComponentProps) {
    return (
      <div className={rootClassName}>
        {slots.header}
        <div className="layout-body">
          {slots.summary}
          {slots.sections.map(renderSection)}
        </div>
      </div>
    );
  }

  return {
    id: config.id,
    label: config.label,
    description: config.description,
    hideSummaryHeading: config.hideSummaryHeading,
    renderSectionHeading: config.renderSectionHeading,
    Component: SingleColumnLayout,
    Header: config.Header,
    itemViews: config.itemViews,
    titleLinkMarker: config.titleLinkMarker,
  };
}
