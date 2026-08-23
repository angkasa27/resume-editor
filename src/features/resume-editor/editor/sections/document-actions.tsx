"use client";

import { FileUpIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type DocumentActionsProps = {
  onExtractCv: () => void;
  onImportJson: () => void;
  /** Extract is disabled while a PDF import is already running. */
  isImportingPdf?: boolean;
};

/** Both replace the draft. Exports live in the top bar — see docs/design-system.md. */
export function DocumentActions({
  onExtractCv,
  onImportJson,
  isImportingPdf,
}: DocumentActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="ai"
        className="w-full"
        disabled={isImportingPdf}
        onClick={onExtractCv}
      >
        <SparklesIcon data-icon="inline-start" />
        Extract from PDF
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onImportJson}
      >
        <FileUpIcon data-icon="inline-start" />
        Import JSON
      </Button>
    </div>
  );
}
