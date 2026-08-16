"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  MobileBottomNav,
  type EditorTab,
} from "@/features/resume-editor/editor/mobile/mobile-bottom-nav";
import type { EditorControlProps } from "@/features/resume-editor/editor/panels/control-props";
import { DesignPanel } from "@/features/resume-editor/editor/panels/design-panel";
import { PreviewSheet } from "@/features/resume-editor/preview/components/preview-sheet";
import { InsightsTab } from "@/features/resume-editor/editor/panels/insights/insights-tab";
import {
  fadeVariants,
  reducedTransition,
  slideTransition,
  slideVariants,
} from "@/features/resume-editor/editor/sections/drill-in-motion";
import { SectionEditPanel } from "@/features/resume-editor/editor/sections/section-edit-panel";
import { useDirection } from "@/features/resume-editor/editor/sections/use-direction";
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

type SectionProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  onSelectSection: (sectionKey: ResumeEditorPanelKey) => void;
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
};

type ResumeEditorMobileContentProps = {
  sectionProps: SectionProps;
  controlPanelProps: EditorControlProps;
  draft: ResumeDraft;
  presentation: ResumeDraft["pdfPresentation"];
};

const TAB_ORDER: EditorTab[] = ["preview", "edit", "design", "insights"];

/** Clears the floating bottom nav so the last row stays reachable. */
const NAV_CLEARANCE = "pb-24";

export function ResumeEditorMobileContent({
  sectionProps,
  controlPanelProps,
  draft,
  presentation,
}: ResumeEditorMobileContentProps) {
  const [tab, setTab] = useState<EditorTab>("edit");
  const [openSection, setOpenSection] = useState<ResumeEditorPanelKey | null>(
    null,
  );
  // +1 = navigating into a form / forward tab, -1 = back / previous tab.
  const nav = useDirection();
  const tabs = useDirection();
  const reduceMotion = useReducedMotion();

  function changeTab(next: EditorTab) {
    tabs.set(TAB_ORDER.indexOf(next) >= TAB_ORDER.indexOf(tab) ? 1 : -1);
    setTab(next);
    if (next !== "edit") setOpenSection(null);
  }

  const {
    onSelectSection,
    onSaveProfile,
    onSaveSection,
    onSetSectionVisibility,
  } = sectionProps;
  const onOpenSection = controlPanelProps.onOpenSection;

  function openForm(key: ResumeEditorPanelKey) {
    nav.forward();
    onSelectSection(key);
    setOpenSection(key);
  }

  function backToList() {
    nav.backward();
    setOpenSection(null);
  }

  function handleInsightsOpen(panel: EditorPanelKey) {
    nav.forward();
    onOpenSection?.(panel);
    setTab("edit");
    setOpenSection(panel);
  }

  return (
    <div className="relative flex h-full flex-col lg:hidden">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={tabs.direction}>
          <motion.div
            key={tab}
            className="absolute inset-0 transform-gpu bg-background"
            custom={tabs.direction}
            variants={reduceMotion ? fadeVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? reducedTransition : slideTransition}
          >
            {tab === "edit" ? (
              <SectionEditPanel
                draft={draft}
                openSection={openSection}
                activeSection={sectionProps.activeSection}
                direction={nav.direction}
                onSaveProfile={onSaveProfile}
                onSaveSection={onSaveSection}
                onReorderSection={sectionProps.onReorderSection}
                onSetSectionVisibility={onSetSectionVisibility}
                onAutoSortSection={sectionProps.onAutoSortSection}
                onOpen={openForm}
                onBack={backToList}
                onExtractCv={controlPanelProps.onExtractCv}
                onImportJson={controlPanelProps.onImportJson}
                isImportingPdf={controlPanelProps.isImportingPdf}
                idPrefix="mobile"
                scrollPaddingClassName={NAV_CLEARANCE}
              />
            ) : null}

            {tab === "preview" ? (
              <div className="h-full overflow-hidden bg-muted [&>div]:pb-18">
                <PreviewSheet draft={draft} presentation={presentation} />
              </div>
            ) : null}

            {tab === "design" ? (
              <DesignPanel
                presentation={presentation}
                draft={draft}
                onPresentationChange={controlPanelProps.onPresentationChange}
                scrollPaddingClassName={NAV_CLEARANCE}
              />
            ) : null}

            {tab === "insights" ? (
              <div className={`h-full overflow-y-auto p-3 ${NAV_CLEARANCE}`}>
                <InsightsTab
                  draft={draft}
                  onSaveInsights={controlPanelProps.onSaveInsights}
                  onSaveSection={onSaveSection}
                  onOpenSection={handleInsightsOpen}
                />
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <MobileBottomNav value={tab} onChange={changeTab} />
    </div>
  );
}
