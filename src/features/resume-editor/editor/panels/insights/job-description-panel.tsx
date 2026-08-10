"use client";

import { useState } from "react";
import { PencilIcon, PlusIcon, TelescopeIcon, XIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobMatchResult } from "@/features/resume-editor/domain/insights/match-keywords";

type JobDescriptionPanelProps = {
  jobMatch: JobMatchResult | null;
  onAnalyzeClick: () => void;
  onReset: () => void;
  /** Opens the tailor dialog for a missing term. */
  onTailor: (term: string) => void;
};

export function JobDescriptionPanel({
  jobMatch,
  onAnalyzeClick,
  onReset,
  onTailor,
}: JobDescriptionPanelProps) {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);


  if (!jobMatch) {
    return (
      <section className="flex flex-col gap-2 rounded-md border border-dashed bg-muted/30 p-3 text-center">
        <div className="mx-auto grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
          <TelescopeIcon className="size-4" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">Tailor to a role</h3>
          <p className="text-xs text-muted-foreground">
            Paste a job description to see how well your resume covers it.
          </p>
        </div>
        <Button
          type="button"
          variant="ai"
          size="sm"
          className="w-full"
          onClick={onAnalyzeClick}
        >
          <TelescopeIcon data-icon="inline-start" />
          Analyze a job
        </Button>
      </section>
    );
  }

  const coveragePct = Math.round(jobMatch.coverage * 100);

  return (
    <section className="flex flex-col gap-2 rounded-md border bg-background p-3">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">Job match</h3>
        {/* Exact hits only. Coverage is separate because partial matches earn
            half credit — showing both against one fraction read as "0/1 (50%)". */}
        <span className="text-xs tabular-nums text-muted-foreground">
          {jobMatch.matched.length}/{jobMatch.keywords.length} exact
          <span className="ml-1 font-semibold text-foreground">
            · {coveragePct}% coverage
          </span>
        </span>
      </header>

      {jobMatch.missing.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Missing from your resume. Tap one to add it.
          </span>
          <ul className="flex flex-wrap gap-1">
            {jobMatch.missing
              .slice()
              .sort((a, b) => b.weight - a.weight)
              .map((kw) => (
                <li key={`${kw.term}-${kw.category}`}>
                  <Badge
                    render={
                      <button
                        type="button"
                        onClick={() => onTailor(kw.term)}
                        aria-label={`Add ${kw.term} to your resume`}
                      />
                    }
                    variant="outline"
                    className="cursor-pointer text-xs transition-[color,box-shadow,transform] hover:bg-muted active:translate-y-px"
                  >
                    <PlusIcon data-icon="inline-start" />
                    {kw.term}
                  </Badge>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {jobMatch.partial.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Spelled differently. Write both forms.
          </span>
          <ul className="flex flex-wrap gap-1">
            {jobMatch.partial.map((kw) => (
              <li key={`${kw.term}-${kw.category}`}>
                <Badge
                  variant="outline"
                  className="border-amber-500/40 text-xs text-amber-700 dark:text-amber-400"
                  title={`You wrote "${kw.foundAs}"`}
                >
                  {kw.term}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {jobMatch.missing.length === 0 && jobMatch.partial.length === 0 ? (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          Every keyword from the job is on your resume.
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onAnalyzeClick}
        >
          <PencilIcon data-icon="inline-start" />
          Edit / re-analyze
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Clear job description"
          onClick={() => setIsResetConfirmOpen(true)}
        >
          <XIcon />
        </Button>
      </div>

      <AlertDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear job match?</AlertDialogTitle>
            <AlertDialogDescription>
              The saved job description and its keyword analysis will be
              removed. You can analyze a new job description anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onReset();
                setIsResetConfirmOpen(false);
              }}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
