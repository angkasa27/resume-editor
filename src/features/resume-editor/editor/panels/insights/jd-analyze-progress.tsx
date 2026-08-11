"use client";

import { TelescopeIcon } from "lucide-react";

import { ProgressDialog } from "@/features/resume-editor/editor/shared/progress-dialog";

const PROGRESS_MESSAGES = [
  "Reading the job description…",
  "Extracting required skills…",
  "Weighing must-haves vs nice-to-haves…",
  "Matching to your resume…",
  "Looking for keyword gaps…",
  "Almost done…",
];

export function JdAnalyzeProgress({ open }: { open: boolean }) {
  return (
    <ProgressDialog
      open={open}
      icon={TelescopeIcon}
      messages={PROGRESS_MESSAGES}
    />
  );
}
