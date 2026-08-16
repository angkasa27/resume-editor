"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  fadeVariants,
  reducedTransition,
  slideTransition,
  slideVariants,
} from "@/features/resume-editor/editor/sections/drill-in-motion";
import { SectionBody } from "@/features/resume-editor/editor/sections/section-body";
import { SectionFormHeader } from "@/features/resume-editor/editor/sections/section-form-header";
import { SectionList } from "@/features/resume-editor/editor/sections/section-list";
import type {
  CollectionSectionKey,
  ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type SectionEditPanelProps = {
  draft: ResumeDraft;
  /** The section whose form is open; `null` shows the list. */
  openSection: ResumeEditorPanelKey | null;
  activeSection: ResumeEditorPanelKey | null;
  /** +1 = drilling into a form, -1 = returning to the list. */
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
  onOpen: (key: ResumeEditorPanelKey) => void;
  onBack: () => void;
  onExtractCv: () => void;
  onImportJson: () => void;
  isImportingPdf?: boolean;
  /** Disambiguates input ids between the two surfaces. */
  idPrefix: string;
  scrollPaddingClassName?: string;
};

/** The Edit surface: a horizontal drill-in between the section list and the active
 * section's auto-saving form. Shared by the desktop sidebar and the mobile Edit tab. */
export function SectionEditPanel({
  draft,
  openSection,
  activeSection,
  direction,
  onSaveProfile,
  onSaveSection,
  onReorderSection,
  onSetSectionVisibility,
  onAutoSortSection,
  onOpen,
  onBack,
  onExtractCv,
  onImportJson,
  isImportingPdf,
  idPrefix,
  scrollPaddingClassName,
}: SectionEditPanelProps) {
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? fadeVariants : slideVariants;

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        {openSection ? (
          <motion.div
            key={openSection}
            className="absolute inset-0 flex transform-gpu flex-col bg-background"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? reducedTransition : slideTransition}
          >
            {/* Inside the filmstrip, not above it — as a sibling, its mount would
                resize the animated box mid-slide and jolt the content. */}
            <SectionFormHeader
              sectionKey={openSection}
              draft={draft}
              onBack={onBack}
              // Built here: the one layer that already holds the draft and the save callback.
              onRename={(title) => {
                if (openSection === "profile") return;
                onSaveSection(openSection, {
                  ...draft.sections[openSection],
                  title,
                });
              }}
              onAutoSortSection={onAutoSortSection}
              onSetSectionVisibility={onSetSectionVisibility}
            />
            <div
              className={cn(
                "min-h-0 flex-1 overflow-y-auto p-3 @container/form",
                scrollPaddingClassName,
              )}
            >
              <SectionBody
                draft={draft}
                activeSection={openSection}
                onSaveProfile={onSaveProfile}
                onSaveSection={onSaveSection}
                idPrefix={idPrefix}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="absolute inset-0 transform-gpu bg-background"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? reducedTransition : slideTransition}
          >
            <SectionList
              draft={draft}
              activeSection={activeSection}
              onReorderSection={onReorderSection}
              onSetSectionVisibility={onSetSectionVisibility}
              onOpen={onOpen}
              onExtractCv={onExtractCv}
              onImportJson={onImportJson}
              isImportingPdf={isImportingPdf}
              className={scrollPaddingClassName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
