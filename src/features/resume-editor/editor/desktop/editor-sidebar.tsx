"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

import type { EditorControlProps } from "@/features/resume-editor/editor/panels/control-props";
import { SidebarResizeHandle } from "@/features/resume-editor/editor/desktop/sidebar-resize-handle";
import { useSidebarWidth } from "@/features/resume-editor/editor/desktop/use-sidebar-width";
import { DesignPanel } from "@/features/resume-editor/editor/panels/design-panel";
import { InsightsTab } from "@/features/resume-editor/editor/panels/insights/insights-tab";
import type { RailKey } from "@/features/resume-editor/editor/desktop/editor-rail";
import {
  reducedTransition,
  slideTransition,
} from "@/features/resume-editor/editor/sections/drill-in-motion";
import { SectionEditPanel } from "@/features/resume-editor/editor/sections/section-edit-panel";
import type {
  CollectionSectionKey,
  EditorPanelKey,
  ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type EditorSidebarProps = {
  rail: RailKey;
  draft: ResumeDraft;
  controls: EditorControlProps;
  openSection: ResumeEditorPanelKey | null;
  direction: number;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  onReorderSection: (
    sectionKey: ResumeSectionPanelKey,
    anchorKey: ResumeSectionPanelKey,
  ) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
  onAutoSortSection: (sectionKey: CollectionSectionKey) => void;
  onOpenSection: (panel: EditorPanelKey) => void;
  onBack: () => void;
};

/** The panel the rail selects, beside the paper. Width animates so the canvas reflows;
 * the inner layer keeps a fixed width and slides — width alone would squash content. */
export function EditorSidebar({
  rail,
  draft,
  controls,
  openSection,
  direction,
  onSaveProfile,
  onSaveSection,
  onReorderSection,
  onSetSectionVisibility,
  onAutoSortSection,
  onOpenSection,
  onBack,
}: EditorSidebarProps) {
  const asideRef = useRef<HTMLElement | null>(null);
  const { width, commitWidth, resetWidth } = useSidebarWidth();
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? reducedTransition : slideTransition;

  return (
    <motion.aside
      ref={asideRef}
      initial={{ width: 0 }}
      animate={{ width }}
      exit={{ width: 0 }}
      transition={transition}
      // Sizes the content layer, since the aside's own width animates.
      style={{ "--sidebar-content-w": `${width}px` } as React.CSSProperties}
      className="relative shrink-0 overflow-hidden border-r bg-background print:hidden"
    >
      <motion.div
        style={{ width: "var(--sidebar-content-w)" }}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={transition}
        className="flex h-full flex-col"
      >
        {rail === "edit" ? (
          <div className="min-h-0 flex-1">
            <SectionEditPanel
              draft={draft}
              openSection={openSection}
              activeSection={openSection}
              direction={direction}
              onSaveProfile={onSaveProfile}
              onSaveSection={onSaveSection}
              onReorderSection={onReorderSection}
              onSetSectionVisibility={onSetSectionVisibility}
              onAutoSortSection={onAutoSortSection}
              onOpen={onOpenSection}
              onBack={onBack}
              onExtractCv={controls.onExtractCv}
              onImportJson={controls.onImportJson}
              isImportingPdf={controls.isImportingPdf}
              idPrefix="desktop"
            />
          </div>
        ) : null}

        {rail === "design" ? (
          <DesignPanel
            presentation={controls.presentation}
            draft={draft}
            onPresentationChange={controls.onPresentationChange}
          />
        ) : null}

        {rail === "insights" ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <InsightsTab
              draft={draft}
              onSaveInsights={controls.onSaveInsights}
              onSaveSection={onSaveSection}
              onOpenSection={onOpenSection}
            />
          </div>
        ) : null}
      </motion.div>

      <SidebarResizeHandle
        targetRef={asideRef}
        width={width}
        onCommit={commitWidth}
        onReset={resetWidth}
      />
    </motion.aside>
  );
}
