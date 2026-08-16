"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { postJson } from "@/lib/api-client";

import {
  matchKeywords,
  type ExtractedKeyword,
  type JobMatchResult,
} from "@/features/resume-editor/domain/insights/match-keywords";
import {
  extractedKeywordSchema,
  type Insights,
} from "@/features/resume-editor/domain/schema/insights-schemas";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

/** Where the job target used to live: one key shared by every resume. */
const LEGACY_STORAGE_KEY = "resume-editor:insights:job-match";

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string };

async function requestKeywordMatch(
  jobDescription: string,
): Promise<ExtractedKeyword[]> {
  const fallback = "Could not analyze the job description.";
  const payload = await postJson<{ keywords: ExtractedKeyword[] }>(
    "/api/insights/match-keywords",
    { jobDescription },
    fallback,
  );

  if (!payload.keywords) throw new Error(payload.message || fallback);

  return payload.keywords;
}

/** Reads the pre-per-resume job target. Deliberately does NOT delete the key — the
 * caller removes it only once the value is on the draft. Bad keywords are dropped
 * rather than rejecting the whole blob. */
function readLegacyInsights(): Insights | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      jobDescription?: unknown;
      keywords?: unknown;
    };
    if (typeof parsed.jobDescription !== "string" || !parsed.jobDescription) {
      return null;
    }

    const keywords = (
      Array.isArray(parsed.keywords) ? parsed.keywords : []
    ).flatMap((keyword) => {
      const result = extractedKeywordSchema.safeParse(keyword);
      return result.success ? [result.data] : [];
    });

    return {
      jobDescription: parsed.jobDescription,
      keywords,
      analyzedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function useJobMatch(
  draft: ResumeDraft,
  onSaveInsights: (insights: Insights | undefined) => void,
) {
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });
  const insights = draft.insights;
  const hasMigrated = useRef(false);

  useEffect(() => {
    if (hasMigrated.current) return;
    hasMigrated.current = true;
    if (insights) return;
    const legacy = readLegacyInsights();
    if (!legacy) return;
    onSaveInsights(legacy);
    // Only now is it safe to drop the old key — the value is on the draft.
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, [insights, onSaveInsights]);

  const jobMatch: JobMatchResult | null = useMemo(() => {
    if (!insights) return null;
    return matchKeywords(draft, insights.jobDescription, insights.keywords);
  }, [draft, insights]);

  const analyze = useCallback(
    async (jobDescription: string) => {
      const trimmed = jobDescription.trim();
      if (!trimmed) return;

      setSubmitState({ status: "loading" });
      try {
        const keywords = await requestKeywordMatch(trimmed);
        onSaveInsights({
          jobDescription: trimmed,
          keywords,
          analyzedAt: new Date().toISOString(),
        });
        setSubmitState({ status: "idle" });
        toast.add({ title: "Job description analyzed.", type: "success" });
      } catch (error) {
        console.error("Analyzing the job description failed", error);
        const message =
          error instanceof Error
            ? error.message
            : "Could not analyze the job description.";
        toast.add({ title: message, type: "error" });
        setSubmitState({ status: "error", message });
      }
    },
    [onSaveInsights],
  );

  const reset = useCallback(() => {
    onSaveInsights(undefined);
    setSubmitState({ status: "idle" });
  }, [onSaveInsights]);

  return {
    jobMatch,
    jobDescription: insights?.jobDescription ?? "",
    submitState,
    analyze,
    reset,
  };
}
