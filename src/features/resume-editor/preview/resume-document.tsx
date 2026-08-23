import type { ReactNode } from "react";

import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import { PreviewSectionTarget } from "@/features/resume-editor/preview/kit/section-target";
import { TitleLinkMarkerProvider } from "@/features/resume-editor/preview/kit/title-link-marker";
import {
  getLayout,
  renderLayoutHeader,
  shouldHideSummaryHeading,
} from "@/features/resume-editor/preview/layout-registry";
import { renderSectionBody } from "@/features/resume-editor/preview/layout-section";
import { SummaryView } from "@/features/resume-editor/preview/descriptors/summary";
import type { PreviewRendererProps } from "@/features/resume-editor/preview/types";
import type { LayoutSlots } from "@/features/resume-editor/preview/layout-types";
import {
  sectionTitleFor,
  type EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";

type ResumeDocumentProps = PreviewRendererProps & {
  /** Turns each slot into a click target opening its section in the editor.
   * Omitted by read-only surfaces, so they render the printed document exactly. */
  onSelectSection?: (panel: EditorPanelKey) => void;
  /** The section currently open in the editor, marked on the paper. */
  activeSection?: EditorPanelKey | null;
  /** Measured by the pagination pass; draws page boundaries on the paper. */
  pageCount?: number;
};

export function ResumeDocument({
  draft,
  className,
  mode = "preview",
  onSelectSection,
  activeSection,
  pageCount,
}: ResumeDocumentProps) {
  const context = createPreviewRenderContext(draft, mode);
  const layout = getLayout(context.presentation.layoutId);

  const hideSummaryHeading = shouldHideSummaryHeading(
    context.presentation.layoutId,
  );
  // Summary isn't a descriptor-driven section, so it resolves its own title.
  const summaryTitle = sectionTitleFor(draft.sections, "summary");

  // Read-only surfaces pass no handler and get the bare document back.
  function target(panel: EditorPanelKey, label: string, node: ReactNode) {
    if (!onSelectSection) return node;
    return (
      <PreviewSectionTarget
        panel={panel}
        label={label}
        isActive={activeSection === panel}
        onSelect={onSelectSection}
      >
        {node}
      </PreviewSectionTarget>
    );
  }

  const slots: LayoutSlots = {
    header: target("profile", "Profile", renderLayoutHeader(context)),
    summary: context.summaryContent
      ? target(
          "summary",
          summaryTitle,
          <SummaryView
            content={context.summaryContent}
            heading={
              layout.renderSectionHeading
                ? layout.renderSectionHeading("summary", summaryTitle)
                : summaryTitle
            }
            showHeading={!hideSummaryHeading}
          />,
        )
      : null,
    // `section.key` and `section` co-vary at runtime, but TS can't prove it
    // across the union element, so assert the entry type once here.
    sections: context.sections.map(
      (section) =>
        ({
          key: section.key,
          section,
          node: target(
            section.key,
            section.label,
            renderSectionBody(layout, section),
          ),
        }) as LayoutSlots["sections"][number],
    ),
  };

  return (
    <PreviewDocumentRoot
      context={context}
      className={className}
      pageCount={pageCount}
    >
      <TitleLinkMarkerProvider value={layout.titleLinkMarker}>
        <layout.Component context={context} slots={slots} />
      </TitleLinkMarkerProvider>
    </PreviewDocumentRoot>
  );
}
