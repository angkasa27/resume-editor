"use client";

import { FileUpIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type DocumentActionsProps = {
  onExtractCv: () => void;
  onImportJson: () => void;
  /** Extract is disabled while a PDF import is already running. */
  isImportingPdf?: boolean;
};

/**
 * The two ways to seed the résumé from a file you already have. Both replace
 * the draft; the top bar carries the ways to get one back out. See DESIGN.md.
 */
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
