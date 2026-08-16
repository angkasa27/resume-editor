"use client";

import React, { useMemo, useState } from "react";

import { ResumeEditorMobileContent } from "@/features/resume-editor/editor/mobile/mobile-content";
import type { EditorControlProps } from "@/features/resume-editor/editor/panels/control-props";
import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { ExtractCvDialog } from "@/features/resume-editor/editor/panels/extract-cv-dialog";
import { PdfImportProgress } from "@/features/resume-editor/editor/panels/pdf-import-progress";
import { useEditorHeader } from "@/features/resume-editor/editor/top-bar/use-editor-header";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  needsSectionReveal,
  type EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { toast } from "@/components/ui/toast";
import { EditorRevisionContext } from "@/features/resume-editor/state/editor-revision";
import { JobKeywordsContext } from "@/features/resume-editor/state/job-keywords";
import { selectAlignmentKeywords } from "@/features/resume-editor/domain/insights/alignment-keywords";

export function ResumeEditorMobile() {
  const isMobile = useIsMobile();
  const [isExtractCvOpen, setIsExtractCvOpen] = useState(false);
  const {
    jsonFileInputRef,
    draft,
    activeSection,
    isExportingPdf,
    isImportingPdf,
    openJsonImportPicker,
    handleJsonImport,
    submitPdfFile,
    handleExport,
    handlePrint,
    requestSectionChange,
    reorderSection,
    setSectionVisibility,
    autoSortSection,
    savePdfPresentation,
    saveProfile,
    saveInsights,
    saveSection,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    revision,
  } = useResumeEditorController();

  useEditorHeader({
    saveStatus,
    canUndo,
    canRedo,
    onUndo: undo,
    onRedo: redo,
    onExportPdf: handlePrint,
    isExportingPdf,
    onExportJson: handleExport,
  });

  useKeyboardShortcuts({
    "mod+z": undo,
    "mod+shift+z": redo,
    "mod+s": {
      handler: () => toast.add({ title: "Auto-saved", type: "success" }),
      ignoreInputFocus: true,
    },
  });

  const presentation = useMemo(
    () => normalizePdfPresentation(draft.pdfPresentation),
    [draft.pdfPresentation],
  );

  // Opening a section from Insights: reveal it, then make it active so the form opens.
  function openSection(panel: EditorPanelKey) {
    if (needsSectionReveal(draft.sections, panel)) {
      setSectionVisibility(panel, true);
    }
    requestSectionChange(panel);
  }

  const sectionProps = {
    draft,
    activeSection,
    onSelectSection: requestSectionChange,
    onSaveProfile: saveProfile,
    onSaveSection: saveSection,
    onReorderSection: reorderSection,
    onSetSectionVisibility: setSectionVisibility,
    onAutoSortSection: autoSortSection,
  };

  // Every rich-text field reads this to offer "Align to the job". Only the
  // gaps, heaviest first — see selectAlignmentKeywords for why order matters.
  const jobKeywords = useMemo(
    () => selectAlignmentKeywords(draft),
    [draft],
  );

  const controlPanelProps: EditorControlProps = {
    presentation,
    draft,
    onPresentationChange: savePdfPresentation,
    onSaveInsights: saveInsights,
    onImportJson: openJsonImportPicker,
    onExtractCv: () => setIsExtractCvOpen(true),
    onOpenSection: openSection,
    isImportingPdf,
  };

  return (
    <EditorRevisionContext.Provider value={revision}>
    <JobKeywordsContext.Provider value={jobKeywords}>
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ "--header-height": "3rem" } as React.CSSProperties}
    >
      <input
        ref={jsonFileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleJsonImport}
      />

      <ExtractCvDialog
        open={isExtractCvOpen}
        onOpenChange={setIsExtractCvOpen}
        onSubmit={(file) => {
          void submitPdfFile(file);
        }}
        isMobile={isMobile}
      />
      <PdfImportProgress open={isImportingPdf} />

      <div className="min-h-0 flex-1">
        <ResumeEditorMobileContent
          sectionProps={sectionProps}
          controlPanelProps={controlPanelProps}
          draft={draft}
          presentation={presentation}
        />
      </div>
    </div>
    </JobKeywordsContext.Provider>
    </EditorRevisionContext.Provider>
  );
}
