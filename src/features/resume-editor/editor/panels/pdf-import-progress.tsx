"use client";

import { SparklesIcon } from "lucide-react";

import { ProgressDialog } from "@/features/resume-editor/editor/shared/progress-dialog";

const PROGRESS_MESSAGES = [
  "Extracting PDF data…",
  "Reading your experience…",
  "Matching sections…",
  "Cleaning up formatting…",
  "Polishing the details…",
  "Almost done…",
];

export function PdfImportProgress({ open }: { open: boolean }) {
  return (
    <ProgressDialog
      open={open}
      icon={SparklesIcon}
      messages={PROGRESS_MESSAGES}
    />
  );
}
