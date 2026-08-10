"use client";

import { useState } from "react";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CircleAlertIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapse } from "@/features/resume-editor/editor/shared/collapse";
import { EditorRow } from "@/features/resume-editor/editor/sections/editor-row";
import {
  ATS_CATEGORIES,
  ATS_CATEGORY_LABELS,
  type AtsCategory,
  type Suggestion,
} from "@/features/resume-editor/domain/insights/ats-score";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { cn } from "@/lib/utils";

type SuggestionListProps = {
  suggestions: Suggestion[];
  onFix?: (panel: EditorPanelKey) => void;
};

const SEVERITY_ICONS = {
  fail: CircleAlertIcon,
  warn: AlertTriangleIcon,
  ok: CheckCircle2Icon,
};

const SEVERITY_TONES = {
  fail: "text-red-600 dark:text-red-400",
  warn: "text-amber-600 dark:text-amber-400",
  ok: "text-emerald-600 dark:text-emerald-400",
};

export function SuggestionList({ suggestions, onFix }: SuggestionListProps) {
  if (suggestions.length === 0) {
    return null;
  }

  const grouped = ATS_CATEGORIES.map((category) => ({
    category,
    items: suggestions.filter((s) => s.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-2">
      {grouped.map(({ category, items }) => (
        <SuggestionGroup
          key={category}
          category={category}
          items={items}
          onFix={onFix}
        />
      ))}
    </div>
  );
}

function SuggestionGroup({
  category,
  items,
  onFix,
}: {
  category: AtsCategory;
  items: Suggestion[];
  onFix?: (panel: EditorPanelKey) => void;
}) {
  const failCount = items.filter((i) => i.severity === "fail").length;
  const warnCount = items.filter((i) => i.severity === "warn").length;
  const [open, setOpen] = useState(false);

  return (
    <section className="overflow-hidden rounded-md">
      <EditorRow
        title={ATS_CATEGORY_LABELS[category]}
        badge={
          <>
            {failCount > 0 ? (
              <Badge variant="destructive">
                <CircleAlertIcon data-icon="inline-start" />
                {failCount} fail
              </Badge>
            ) : null}
            {warnCount > 0 ? (
              <Badge variant="warning">
                <AlertTriangleIcon data-icon="inline-start" />
                {warnCount} warn
              </Badge>
            ) : null}
          </>
        }
        indicator={
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-aria-pressed/row:rotate-90" />
        }
        active={open}
        onActivate={() => setOpen((value) => !value)}
        className="h-12.5 pl-3 aria-pressed:rounded-b-none aria-pressed:border-b-0"
      />
      <Collapse open={open}>
        <ul className="flex flex-col gap-1 rounded-b-md border border-t bg-muted/20 p-2">
          {items.map((item) => {
            const Icon = SEVERITY_ICONS[item.severity];
            return (
              <li
                key={item.id}
                className="flex items-start gap-2 rounded-sm px-1 py-1.5 text-xs"
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0",
                    SEVERITY_TONES[item.severity],
                  )}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-foreground">{item.message}</span>
                  {item.evidence?.length ? (
                    <ul className="flex flex-col gap-0.5 rounded-md bg-muted px-2 py-1.5 font-mono text-xs text-muted-foreground">
                      {/* Index keys: the same bullet text legitimately repeats
                          across roles, so the line isn't unique. */}
                      {item.evidence.map((line, index) => (
                        <li key={index} className="truncate" title={line}>
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.fix && onFix ? (
                    <Button
                      type="button"
                      size="xs"
                      className="w-fit"
                      onClick={() => onFix(item.fix!.panel)}
                    >
                      Fix
                      <ArrowUpRightIcon data-icon="inline-end" />
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Collapse>
    </section>
  );
}
