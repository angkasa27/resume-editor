"use client";

import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRotatingMessage } from "@/features/resume-editor/editor/shared/use-rotating-message";

// The loading spinner and before/after diff, shared by every surface that
// rewrites content: the per-field "Improve with AI" dialog and the Insights
// "tailor to this job" flow.

const PROGRESS_MESSAGES = [
  "Reading your content…",
  "Applying improvements…",
  "Polishing the language…",
  "Almost done…",
] as const;

export function LoadingPhase() {
  const message = useRotatingMessage(PROGRESS_MESSAGES, 2500);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
      <div className="relative grid size-12 place-items-center rounded-full bg-violet-500/10 text-violet-500">
        <SparklesIcon className="size-5" />
        <Spinner
          aria-hidden
          className="absolute inset-0 size-12 text-violet-400/50"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">
          This takes a few seconds.
        </p>
      </div>
    </div>
  );
}

type ResultPhaseProps = {
  beforeHtml: string;
  afterHtml: string;
  onAccept: () => void;
  onTryAgain: () => void;
  onCancel: () => void;
};

export function ResultPhase({
  beforeHtml,
  afterHtml,
  onAccept,
  onTryAgain,
  onCancel,
}: ResultPhaseProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-muted-foreground">Before</p>
          <div
            className="prose prose-sm max-w-none rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground line-through decoration-muted-foreground/40 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: beforeHtml }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-violet-500">After</p>
          <div
            className="prose prose-sm max-w-none rounded-md border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: afterHtml }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 shrink-0 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onTryAgain}>
          Try again
        </Button>
        <Button type="button" variant="ai" size="sm" onClick={onAccept}>
          Use this
        </Button>
      </div>
    </div>
  );
}

/** Shared client for `/api/improve-content`. */
export async function requestContentImprovement(input: {
  html: string;
  chips: string[];
  customInstruction: string;
  keywords?: string[];
}): Promise<string> {
  const response = await fetch("/api/improve-content", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as {
    improved?: string;
    message?: string;
  };

  if (!response.ok || !payload.improved) {
    throw new Error(
      payload.message ?? "Could not rewrite the content. Try again.",
    );
  }

  return payload.improved;
}
