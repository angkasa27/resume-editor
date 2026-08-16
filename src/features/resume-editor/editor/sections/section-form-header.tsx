"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowDownNarrowWideIcon,
  ArrowLeftIcon,
  PenLineIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import { FOCUS_RING_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import {
  isCollectionSectionKey,
  sectionLabels,
  type CollectionSectionKey,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function sectionLabelFor(key: ResumeEditorPanelKey) {
  return key === "profile"
    ? "Profile"
    : sectionLabels[key as ResumeSectionPanelKey];
}

/** Only sections whose items carry a date range can be sorted newest-first. */
function canAutoSort(key: ResumeEditorPanelKey) {
  if (
    key === "profile" ||
    !isCollectionSectionKey(key as ResumeSectionPanelKey)
  )
    return false;
  return Boolean(
    collectionSectionConfigs[key as CollectionSectionKey].dateRange,
  );
}

/** Sheds its label when tight — driven by container width, not viewport, since the sidebar is resizable. */
function HeaderAction({
  label,
  icon,
  onClick,
  destructive = false,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={destructive ? "destructive" : "outline"}
            size="sm"
            aria-label={label}
            onClick={onClick}
            className="shrink-0 w-8 @sm/section-header:w-auto"
          >
            {icon}
            {/* Label appears only once the header can spare the width. */}
            <span className="hidden @sm/section-header:inline">{label}</span>
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

type SectionFormHeaderProps = {
  sectionKey: ResumeEditorPanelKey;
  draft: ResumeDraft;
  onBack: () => void;
  /** Blank resets the section to its built-in label. */
  onRename: (title: string) => void;
  onAutoSortSection: (sectionKey: CollectionSectionKey) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

/** Contextual header for a drill-in section form. Which actions apply is derived here
 * so desktop and mobile can't disagree. The heading is also the rename field — every
 * section but Profile prints its title on the paper. */
export function SectionFormHeader({
  sectionKey,
  draft,
  onBack,
  onRename,
  onAutoSortSection,
  onSetSectionVisibility,
}: SectionFormHeaderProps) {
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  // The input only exists while renaming, so it mounts fresh from the draft each
  // time — no re-seeding needed when import/undo replaces the draft underneath.
  const [isRenaming, setIsRenaming] = useState(false);
  const defaultLabel = sectionLabelFor(sectionKey);
  const storedTitle =
    sectionKey === "profile"
      ? undefined
      : draft.sections[sectionKey as ResumeSectionPanelKey].title;
  const label = storedTitle?.trim() || defaultLabel;
  const isRemovable =
    sectionKey !== "profile" &&
    isCollectionSectionKey(sectionKey as ResumeSectionPanelKey);

  function commitRename(value: string) {
    setIsRenaming(false);
    const next = value.trim();
    // A focus-and-leave must not burn an undo slot.
    if (next === (storedTitle ?? "").trim()) return;
    onRename(next);
  }

  return (
    <header className="@container/section-header flex h-12 shrink-0 items-center gap-1 border-b bg-background px-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Back to sections"
        onClick={onBack}
        className="shrink-0"
      >
        <ArrowLeftIcon />
      </Button>
      {isRenaming ? (
        <input
          type="text"
          autoFocus
          aria-label={`${defaultLabel} section title`}
          defaultValue={storedTitle ?? ""}
          // Placeholder, not value: an unrenamed section still reads correctly,
          // and clearing the field visibly means "back to the default".
          placeholder={defaultLabel}
          onBlur={(event) => commitRename(event.currentTarget.value)}
          onKeyDown={(event) => {
            // Blur commits; Escape leaves the stored title alone.
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") setIsRenaming(false);
          }}
          className={cn(
            "h-8 min-w-0 flex-1 truncate rounded-md border bg-transparent px-2 text-sm font-semibold",
            "transition-[color,box-shadow] hover:border-ring",
            FOCUS_RING_CLASS,
          )}
        />
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <h2 className="min-w-0 truncate text-sm font-semibold">{label}</h2>
          {sectionKey === "profile" ? null : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Rename ${label} section`}
                    onClick={() => setIsRenaming(true)}
                    className="shrink-0"
                  >
                    <PenLineIcon />
                  </Button>
                }
              />
              <TooltipContent>Rename</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {canAutoSort(sectionKey) ? (
          <HeaderAction
            label="Sort"
            icon={<ArrowDownNarrowWideIcon />}
            onClick={() =>
              onAutoSortSection(sectionKey as CollectionSectionKey)
            }
          />
        ) : null}
        {isRemovable ? (
          <HeaderAction
            label="Remove"
            icon={<Trash2Icon />}
            onClick={() => setIsRemoveOpen(true)}
            destructive
          />
        ) : null}
      </div>

      <ConfirmDeleteDialog
        open={isRemoveOpen}
        onOpenChange={setIsRemoveOpen}
        onConfirm={() => {
          onSetSectionVisibility(sectionKey as ResumeSectionPanelKey, false);
          onBack();
        }}
        title={`Remove ${label} section?`}
        description="Its content is kept — you can add the section back at any time."
      />
    </header>
  );
}
