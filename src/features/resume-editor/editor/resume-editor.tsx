"use client";

import { Spinner } from "@/components/ui/spinner";

import { ResumeEditorDesktop } from "./desktop/resume-editor-desktop";
import { ResumeEditorMobile } from "./mobile/resume-editor-mobile";
import { useClientReady } from "@/hooks/use-client-ready";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Responsive entry point for the editor: desktop (>=768px) gets the
 * drag-and-drop canvas editor, mobile (<768px) gets the guided-forms classic
 * editor.
 */
export function ResumeEditor() {
  const ready = useClientReady();
  const isMobile = useIsMobile();

  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner aria-hidden className="size-8" />
          <p className="text-sm font-semibold tracking-tight">
            Loading editor
          </p>
        </div>
      </div>
    );
  }

  return isMobile ? <ResumeEditorMobile /> : <ResumeEditorDesktop />;
}
