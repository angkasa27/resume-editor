"use client";

import { createContext, useContext } from "react";

/** The open form re-seeds on a genuine replacement (import/undo/redo) but not its
 * own autosave. Defaults to `0` so a form outside a provider never remounts. */
export const EditorRevisionContext = createContext(0);

export function useEditorRevision(): number {
  return useContext(EditorRevisionContext);
}
