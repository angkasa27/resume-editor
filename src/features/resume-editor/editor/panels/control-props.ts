import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { Insights } from "@/features/resume-editor/domain/schema/insights-schemas";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

/** The presentation + document-action contract every control surface is handed.
 * Exports are absent by design — they go to the top bar via `useEditorHeader`. */
export type EditorControlProps = {
  presentation: PdfPresentation;
  draft: ResumeDraft;
  onPresentationChange: (next: PdfPresentation) => void;
  onSaveInsights: (insights: Insights | undefined) => void;
  onImportJson: () => void;
  onExtractCv: () => void;
  onOpenSection?: (panel: EditorPanelKey) => void;
  isImportingPdf?: boolean;
};
