"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import type { SaveStatus } from "@/features/resume-editor/domain/draft/local-draft-storage";
import { useEditorHeaderStore } from "@/features/resume-editor/editor/top-bar/editor-header-store";

const noop = () => {};

type EditorHeaderControls = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  /** Behind the Download PDF split menu. */
  onExportJson: () => void;
};

/** Publishes the page's header controls to the shared store for the persistent top
 * bar (in `app/editor/layout.tsx`) — keeping it there lets the tab pill animate. */
export function useEditorHeader(controls: EditorHeaderControls) {
  const setControls = useEditorHeaderStore((s) => s.setControls);

  // Handler identities change every render; keep them behind stable refs.
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

  // Handlers go through refs, so only the export flag belongs in the deps list —
  // re-publishing every render would re-render the layout for nothing.
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
