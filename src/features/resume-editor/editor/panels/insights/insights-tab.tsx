"use client";

import { useMemo, useState } from "react";

import { computeAtsScore } from "@/features/resume-editor/domain/insights/ats-score";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { Insights } from "@/features/resume-editor/domain/schema/insights-schemas";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { ResumeSectionKey } from "@/features/resume-editor/state/resume-editor-store";

import { CategoryBreakdown } from "./category-breakdown";
import { JdAnalyzeDialog } from "./jd-analyze-dialog";
import { JdAnalyzeProgress } from "./jd-analyze-progress";
import { JobDescriptionPanel } from "./job-description-panel";
import { ScoreRing } from "./score-ring";
import { SuggestionList } from "./suggestion-list";
import { TailorToJobDialog } from "./tailor-to-job-dialog";
import { useJobMatch } from "./use-job-match";

type InsightsTabProps = {
  draft: ResumeDraft;
  onSaveInsights: (insights: Insights | undefined) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  onOpenSection?: (panel: EditorPanelKey) => void;
};

export function InsightsTab({
  draft,
  onSaveInsights,
  onSaveSection,
  onOpenSection,
}: InsightsTabProps) {
  const { jobMatch, jobDescription, submitState, analyze, reset } = useJobMatch(
    draft,
    onSaveInsights,
  );
  const score = useMemo(
    () => computeAtsScore(draft, jobMatch ?? undefined),
    [draft, jobMatch],
  );
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const [tailorTerm, setTailorTerm] = useState<string | null>(null);

  const isAnalyzing = submitState.status === "loading";

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-4 rounded-md border bg-background p-3">
        <div className="flex flex-col items-center gap-2">
          <ScoreRing score={score.score} />
        </div>

        <CategoryBreakdown breakdown={score.breakdown} />
      </section>

      <SuggestionList suggestions={score.suggestions} onFix={onOpenSection} />
      <JobDescriptionPanel
        jobMatch={jobMatch}
        onAnalyzeClick={() => setIsAnalyzeOpen(true)}
        onReset={reset}
        onTailor={setTailorTerm}
      />

      <JdAnalyzeDialog
        open={isAnalyzeOpen}
        onOpenChange={setIsAnalyzeOpen}
        initialJobDescription={jobDescription}
        onSubmit={analyze}
      />
      <JdAnalyzeProgress open={isAnalyzing} />

      {tailorTerm !== null && jobMatch ? (
        <TailorToJobDialog
          open
          onOpenChange={(open) => {
            if (!open) setTailorTerm(null);
          }}
          draft={draft}
          missing={jobMatch.missing}
          initialTerm={tailorTerm}
          onSaveSection={onSaveSection}
        />
      ) : null}
    </div>
  );
}
