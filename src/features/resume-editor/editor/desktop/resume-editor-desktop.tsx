"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";

import { toast } from "@/components/ui/toast";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import type { EditorControlProps } from "@/features/resume-editor/editor/panels/control-props";
import { ExtractCvDialog } from "@/features/resume-editor/editor/panels/extract-cv-dialog";
import { PdfImportProgress } from "@/features/resume-editor/editor/panels/pdf-import-progress";
import { EditorCanvas } from "@/features/resume-editor/editor/desktop/editor-canvas";
import {
  EditorRail,
  type RailKey,
} from "@/features/resume-editor/editor/desktop/editor-rail";
import { EditorSidebar } from "@/features/resume-editor/editor/desktop/editor-sidebar";
import { ZOOM_DEFAULT } from "@/features/resume-editor/editor/desktop/zoom";
import { useDirection } from "@/features/resume-editor/editor/sections/use-direction";
import { PaginatedPreview } from "@/features/resume-editor/preview/components/paginated-preview";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  needsSectionReveal,
  type EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/state/resume-editor-store";
import { useEditorHeader } from "@/features/resume-editor/editor/top-bar/use-editor-header";
import { EditorRevisionContext } from "@/features/resume-editor/state/editor-revision";
import { JobKeywordsContext } from "@/features/resume-editor/state/job-keywords";
import { selectAlignmentKeywords } from "@/features/resume-editor/domain/insights/alignment-keywords";

export function ResumeEditorDesktop() {
  const {
    jsonFileInputRef,
    draft,
    isExportingPdf,
    isImportingPdf,
    openJsonImportPicker,
    handleJsonImport,
    submitPdfFile,
    handleExport,
    handlePrint,
    saveProfile,
    saveSection,
    savePdfPresentation,
    saveInsights,
    reorderSection,
    setSectionVisibility,
    autoSortSection,
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

  const [rail, setRail] = useState<RailKey>("edit");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState<ResumeEditorPanelKey | null>(
    null,
  );
  const [isExtractCvOpen, setIsExtractCvOpen] = useState(false);
  const [zoom, setZoom] = useState<number>(ZOOM_DEFAULT);
  // +1 = drilling into a form, -1 = back to the list.
  const nav = useDirection();

  useKeyboardShortcuts({
    "mod+z": undo,
    "mod+shift+z": redo,
    "mod+s": {
      handler: () => toast.add({ title: "Auto-saved", type: "success" }),
      ignoreInputFocus: false,
    },
    escape: { handler: closeCurrentSurface, ignoreInputFocus: true },
  });

  const presentation = useMemo(
    () => normalizePdfPresentation(draft.pdfPresentation),
    [draft.pdfPresentation],
  );

  // Every rich-text field reads this to offer "Align to the job". Only the
  // gaps, heaviest first — see selectAlignmentKeywords for why order matters.
  const jobKeywords = useMemo(
    () => selectAlignmentKeywords(draft),
    [draft],
  );

  function selectRail(key: RailKey) {
    // Re-picking the open panel toggles the sidebar shut, so the rail doubles
    // as the collapse control.
    if (key === rail && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
      return;
    }
    setRail(key);
    setIsSidebarCollapsed(false);
    if (key !== "edit") backToList();
  }

  function backToList() {
    nav.backward();
    setOpenSection(null);
  }

  /** Escape backs out one level: form → list → collapsed sidebar. */
  function closeCurrentSurface() {
    if (openSection) {
      backToList();
      return;
    }
    setIsSidebarCollapsed(true);
  }

  /** The single way a section opens (paper click, list, or Insights). Hidden sections
   * are revealed first, else the form edits what the paper can't show. */
  function focusSection(panel: EditorPanelKey) {
    if (needsSectionReveal(draft.sections, panel)) {
      setSectionVisibility(panel, true);
    }
    nav.forward();
    setRail("edit");
    setIsSidebarCollapsed(false);
    setOpenSection(panel);
  }

  const controls: EditorControlProps = {
    presentation,
    draft,
    onPresentationChange: savePdfPresentation,
    onSaveInsights: saveInsights,
    onImportJson: openJsonImportPicker,
    onExtractCv: () => setIsExtractCvOpen(true),
    isImportingPdf,
  };

  return (
    <EditorRevisionContext.Provider value={revision}>
    <JobKeywordsContext.Provider value={jobKeywords}>
    <div className="flex h-[calc(100dvh-3rem)]">
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
      />
      <PdfImportProgress open={isImportingPdf} />

      <EditorRail
        value={rail}
        collapsed={isSidebarCollapsed}
        onSelect={selectRail}
      />

      {/* Collapsing still unmounts — forms and TipTap tear down, just after the exit. */}
      <AnimatePresence initial={false}>
        {!isSidebarCollapsed ? (
          <EditorSidebar
            rail={rail}
            draft={draft}
            controls={controls}
            openSection={openSection}
            direction={nav.direction}
            onSaveProfile={saveProfile}
            onSaveSection={saveSection}
            onReorderSection={reorderSection}
            onSetSectionVisibility={setSectionVisibility}
            onAutoSortSection={autoSortSection}
            onOpenSection={focusSection}
            onBack={backToList}
          />
        ) : null}
      </AnimatePresence>

      <EditorCanvas zoom={zoom} onZoomChange={setZoom}>
        <PaginatedPreview
          draft={draft}
          onSelectSection={focusSection}
          activeSection={openSection}
        />
      </EditorCanvas>
    </div>
    </JobKeywordsContext.Provider>
    </EditorRevisionContext.Provider>
  );
}
