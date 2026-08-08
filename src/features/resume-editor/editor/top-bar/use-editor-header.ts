"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";
import { useEditorHeaderStore } from "@/features/resume-editor/editor/top-bar/editor-header-store";

const noop = () => {};

type EditorHeaderControls = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** The top bar's Download PDF action. */
  onExportPdf: () => void;
  isExportingPdf: boolean;
  /** Behind the Download PDF split menu. */
  onExportJson: () => void;
};

/**
 * Publishes an editor page's header controls to the shared store so the persistent top bar
 * (in `app/editor/layout.tsx`) can drive undo/redo, save indicator, and Download PDF. Keeping
 * the bar in the layout lets the Canvas/Classic tab pill animate across navigation.
 */
export function useEditorHeader(controls: EditorHeaderControls) {
  const setControls = useEditorHeaderStore((s) => s.setControls);

  // Handler identities change every render; keep them behind stable refs so the
  // stored controls don't need re-publishing on each keystroke.
  const onUndoRef = useRef(controls.onUndo);
  const onRedoRef = useRef(controls.onRedo);
  const onExportPdfRef = useRef(controls.onExportPdf);
  const onExportJsonRef = useRef(controls.onExportJson);
  useLayoutEffect(() => {
    onUndoRef.current = controls.onUndo;
    onRedoRef.current = controls.onRedo;
    onExportPdfRef.current = controls.onExportPdf;
    onExportJsonRef.current = controls.onExportJson;
  });

  // Handlers are read through refs, so only the export *flag* belongs in the
  // dependency list — re-publishing on every render would re-render the layout
  // for nothing.
  const isExportingPdf = controls.isExportingPdf;

  useEffect(() => {
    setControls({
      onUndo: () => onUndoRef.current(),
      onRedo: () => onRedoRef.current(),
      onExportPdf: () => onExportPdfRef.current(),
      isExportingPdf,
      onExportJson: () => onExportJsonRef.current(),
    });
    // Handlers too: a bar outliving this page would keep firing its refs.
    return () =>
      setControls({
        saveStatus: "idle",
        canUndo: false,
        canRedo: false,
        isExportingPdf: false,
        onUndo: noop,
        onRedo: noop,
        onExportPdf: noop,
        onExportJson: noop,
      });
  }, [setControls, isExportingPdf]);

  const { saveStatus, canUndo, canRedo } = controls;
  useEffect(() => {
    setControls({ saveStatus, canUndo, canRedo });
  }, [setControls, saveStatus, canUndo, canRedo]);
}
