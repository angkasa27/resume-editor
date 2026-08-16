import { create } from "zustand";

import type { SaveStatus } from "@/features/resume-editor/domain/draft/local-draft-storage";

type EditorHeaderState = {
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

type EditorHeaderStore = EditorHeaderState & {
  setControls: (patch: Partial<EditorHeaderState>) => void;
};

const noop = () => {};

export const useEditorHeaderStore = create<EditorHeaderStore>((set) => ({
  saveStatus: "idle",
  canUndo: false,
  canRedo: false,
  onUndo: noop,
  onRedo: noop,
  onExportPdf: noop,
  isExportingPdf: false,
  onExportJson: noop,
  setControls: (patch) => set(patch),
}));
