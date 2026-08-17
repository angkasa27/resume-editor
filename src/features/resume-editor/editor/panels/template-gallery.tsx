"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DocumentPreviewCard } from "@/features/resume-editor/editor/panels/document-preview-card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  applyTemplatePreset,
  applyTemplatePresetLayoutOnly,
  getActiveTemplatePresetId,
  resumeTemplatePresets,
  templateCategories,
  templateLabel,
  type ResumeTemplatePreset,
  type TemplateCategoryId,
} from "@/features/resume-editor/domain/presentation/template-presets";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type FilterValue = TemplateCategoryId | "all";

const FILTERS: ReadonlyArray<{ value: FilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "ats", label: "ATS" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
];

type TemplateGalleryProps = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  onApply: (next: PdfPresentation) => void;
  scrollPaddingClassName?: string;
};

/** Applying a preset is one presentation commit — unless the style was hand-tweaked,
 * in which case a dialog offers to keep it. */
export function TemplateGallery({
  draft,
  presentation,
  onApply,
  scrollPaddingClassName,
}: TemplateGalleryProps) {
  // Snapshot the draft on mount: the gallery remounts when opened, and live
  // previews shouldn't re-render per keystroke.
  const [snapshot] = useState(draft);
  const activePresetId = getActiveTemplatePresetId(presentation);
  const [pending, setPending] = useState<ResumeTemplatePreset | null>(null);
  const [filter, setFilter] = useState<FilterValue>("all");

  // Sort by the card name, so the grid reads alphabetically and a chip only
  // removes cards, never reshuffles the ones that stay.
  const visiblePresets = useMemo(
    () =>
      resumeTemplatePresets
        .filter(
          (preset) =>
            filter === "all" || templateCategories(preset).includes(filter),
        )
        .sort((a, b) => templateLabel(a).localeCompare(templateLabel(b))),
    [filter],
  );

  // Stable handler so preset cards don't re-render on every apply.
  const presentationRef = useRef(presentation);
  useEffect(() => {
    presentationRef.current = presentation;
  }, [presentation]);
  const handleSelect = useCallback(
    (preset: ResumeTemplatePreset) => {
      const current = presentationRef.current;
      if (getActiveTemplatePresetId(current) === null) {
        // Hand-tweaked style on a template — confirm before overwriting.
        setPending(preset);
      } else {
        onApply(applyTemplatePreset(preset, current));
      }
    },
    [onApply],
  );

  // Preset previews depend only on the paper setup; the preset overrides style.
  const paperKey = presentation.paperSize;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const basePresentation = useMemo(() => presentation, [paperKey]);

  return (
    <>
      {/* Filter row sits outside the scroll box, so it holds without sticky. */}
      <div className="flex h-full flex-col">
        <div className="shrink-0 px-3 pt-3 pb-2">
          {/* spacing detaches the group into chips — a joined 4-up segment reads as a second tab bar. */}
          <ToggleGroup
            multiple
            spacing={2}
            aria-label="Filter templates"
            value={[filter]}
            variant="outline"
            size="sm"
            className="flex flex-wrap"
            onValueChange={(next) => {
              const value = next.at(-1);
              if (value) setFilter(value as FilterValue);
            }}
          >
            {FILTERS.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                // Active reads as the rail's nav item, not the toggle's muted fill.
                className="rounded-full aria-pressed:border-primary/20 aria-pressed:bg-primary/10 aria-pressed:text-primary px-4 h-7 text-xs"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto p-3 pt-2",
            scrollPaddingClassName,
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            {visiblePresets.map((preset) => (
              <TemplatePresetCard
                key={preset.id}
                draft={snapshot}
                basePresentation={basePresentation}
                preset={preset}
                selected={preset.id === activePresetId}
                onApply={handleSelect}
              />
            ))}
          </div>
        </div>
      </div>
      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apply &quot;{pending ? templateLabel(pending) : ""}&quot;
              template?
            </DialogTitle>
            <DialogDescription>
              This template has its own colors and fonts that will replace your
              current custom style.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" size="sm" />}
              className="mr-auto"
            >
              Cancel
            </DialogClose>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!pending) return;
                onApply(applyTemplatePresetLayoutOnly(pending, presentation));
                setPending(null);
              }}
            >
              Layout only
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                if (!pending) return;
                onApply(applyTemplatePreset(pending, presentation));
                setPending(null);
              }}
            >
              Replace style
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type TemplatePresetCardProps = {
  draft: ResumeDraft;
  basePresentation: PdfPresentation;
  preset: ResumeTemplatePreset;
  selected: boolean;
  onApply: (preset: ResumeTemplatePreset) => void;
};

function TemplatePresetCard({
  draft,
  basePresentation,
  preset,
  selected,
  onApply,
}: TemplatePresetCardProps) {
  const cardPresentation = useMemo(
    () => applyTemplatePreset(preset, basePresentation),
    [preset, basePresentation],
  );
  const handleSelect = useCallback(() => onApply(preset), [onApply, preset]);

  const label = templateLabel(preset);

  return (
    <DocumentPreviewCard
      draft={draft}
      presentation={cardPresentation}
      label={label}
      ariaLabel={`Use ${label} template`}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}
