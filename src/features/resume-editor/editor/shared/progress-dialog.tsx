"use client";

import type { LucideIcon } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useRotatingMessage } from "@/features/resume-editor/editor/shared/use-rotating-message";

/** Uncloseable "working on it" dialog: a spinning ring around an icon and a
 *  message that rotates while a long AI call runs. */
export function ProgressDialog({
  open,
  icon: Icon,
  messages,
}: {
  open: boolean;
  icon: LucideIcon;
  messages: string[];
}) {
  const message = useRotatingMessage(messages, 4000);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="gap-0 sm:max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-6" />
            <Spinner
              aria-hidden
              className="absolute inset-0 size-14 text-primary/40"
            />
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
