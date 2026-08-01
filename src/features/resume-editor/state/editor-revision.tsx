"use client";

import { createContext, useContext } from "react";

/**
 * Carries the store's `revision` to the drill-in without threading it through every layer — the open
 * form re-seeds on a genuine replacement (import/undo/redo) but not its own autosave. Defaults to `0`
 * so a form outside a provider (tests) never remounts from this.
 */
export const EditorRevisionContext = createContext(0);

export function useEditorRevision(): number {
  return useContext(EditorRevisionContext);
}
