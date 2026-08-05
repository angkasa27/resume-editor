"use client";

import { TelescopeIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRotatingMessage } from "@/features/resume-editor/editor/shared/use-rotating-message";

const PROGRESS_MESSAGES = [
  "Reading the job description…",
  "Extracting required skills…",
  "Weighing must-haves vs nice-to-haves…",
  "Matching to your resume…",
  "Looking for keyword gaps…",
  "Almost done…",
];

export function JdAnalyzeProgress({ open }: { open: boolean }) {
  const message = useRotatingMessage(PROGRESS_MESSAGES, 4000);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="gap-0 sm:max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <TelescopeIcon className="size-6" />
            <Spinner aria-hidden className="absolute inset-0 size-14 text-primary/40" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">{message}</p>
            <p className="text-xs text-muted-foreground">
              This may take a few seconds.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
