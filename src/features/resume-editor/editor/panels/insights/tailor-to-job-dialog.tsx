"use client";

import { useState } from "react";
import { ListPlusIcon, SparklesIcon, TargetIcon } from "lucide-react";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { roleLabel } from "@/features/resume-editor/domain/insights/ats-score";
import {
  DialogHeaderRow,
  DialogHeaderSection,
} from "@/features/resume-editor/editor/shared/dialog-header";
import {
  LoadingPhase,
  ResultPhase,
  requestContentImprovement,
} from "@/features/resume-editor/forms/rich-text/improve-phases";
import { addKeywordToSkills } from "@/features/resume-editor/domain/insights/add-keyword-to-skills";
import { ALIGNMENT_KEYWORD_LIMIT } from "@/features/resume-editor/domain/insights/alignment-keywords";
import { stripRichText } from "@/features/resume-editor/domain/insights/extract-text";
import type { ExtractedKeyword } from "@/features/resume-editor/domain/insights/match-keywords";
import type {
  ResumeDraft,
  WorkExperienceItem,
} from "@/features/resume-editor/domain/schema";
import type { ResumeSectionKey } from "@/features/resume-editor/state/resume-editor-store";

/** Categories whose terms belong on a skills list rather than in a bullet. */
const SKILL_LIKE = new Set(["hard-skill", "tool", "qualification"]);

const SKILLS_TARGET = "skills";

type Phase =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; improved: string; roleId: string };

type TailorToJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ResumeDraft;
  /** Terms the resume is missing; the one the user clicked comes first. */
  missing: ExtractedKeyword[];
  initialTerm: string;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
};

export function TailorToJobDialog({
  open,
  onOpenChange,
  draft,
  missing,
  initialTerm,
  onSaveSection,
}: TailorToJobDialogProps) {
  const isMobile = useIsMobile();

  const title = "Add to your resume";
  const description =
    "Put a missing term on the page, either as a skill or worked into a role.";

  // Mount the body only while open so every open starts from a clean state.
  const body = open ? (
    <TailorBody
      draft={draft}
      missing={missing}
      initialTerm={initialTerm}
      onSaveSection={onSaveSection}
      onDone={() => onOpenChange(false)}
    />
  ) : null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="flex max-h-[92dvh] min-h-0 flex-col gap-4 rounded-t-xl p-3"
        >
          <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border" />
          <DialogHeaderSection
            icon={<TargetIcon className="size-4 text-primary" />}
            title={title}
            description={description}
            onClose={() => onOpenChange(false)}
          />
          {body}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85dvh] min-h-0 flex-col gap-4 sm:max-w-lg"
      >
        <DialogHeaderRow
          className="shrink-0"
          icon={<TargetIcon className="size-4 text-primary" />}
          title={title}
          description={description}
          onClose={() => onOpenChange(false)}
        />
        {body}
      </DialogContent>
    </Dialog>
  );
}

type TailorBodyProps = {
  draft: ResumeDraft;
  missing: ExtractedKeyword[];
  initialTerm: string;
  onSaveSection: TailorToJobDialogProps["onSaveSection"];
  onDone: () => void;
};

function TailorBody({
  draft,
  missing,
  initialTerm,
  onSaveSection,
  onDone,
}: TailorBodyProps) {
  const roles = draft.sections.workExperience.items;
  const skillCategories = draft.sections.skills.items;
  const clicked = missing.find((keyword) => keyword.term === initialTerm);
  // Heaviest gaps first, so the terms that matter are the ones on offer.
  const offered = [...missing].sort((a, b) => b.weight - a.weight);
  const firstWritableRole = roles.find((role) =>
    stripRichText(role.description).trim(),
  );

  const [selectedTerms, setSelectedTerms] = useState<Set<string>>(
    new Set([initialTerm]),
  );
  // A tool or hard skill belongs on the skills list; anything else needs prose.
  const [target, setTarget] = useState<string>(() =>
    defaultTargetFor(clicked, firstWritableRole, roles),
  );
  const [categoryId, setCategoryId] = useState<string>(
    skillCategories[0]?.id ?? "",
  );
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const terms = [...selectedTerms];
  const isSkillsTarget = target === SKILLS_TARGET;
  const atTermLimit = terms.length >= ALIGNMENT_KEYWORD_LIMIT;
  const selectedRole = roles.find((role) => role.id === target);
  const roleIsEmpty =
    !isSkillsTarget && !stripRichText(selectedRole?.description ?? "").trim();

  // Base UI renders the raw value in the trigger, so labels are looked up here.
  const targetOptions = [
    { value: SKILLS_TARGET, label: "Skills (added as written, no AI)" },
    ...roles.map((role) => ({
      value: role.id,
      label: roleLabel(role),
    })),
  ];
  const labelFor = (options: { value: string; label: string }[], value: string) =>
    options.find((option) => option.value === value)?.label ?? "";

  function handleAddToSkills() {
    // No model involved — a list append. Track what landed: a term already present
    // is skipped, and the toast must not claim credit for it.
    const { next, added } = addTermsToSkills(
      draft.sections.skills,
      terms,
      categoryId,
    );

    if (added.length === 0) {
      toast.add({ title: "Already in your skills.", type: "info" });
      onDone();
      return;
    }

    onSaveSection("skills", next);
    toast.add({
      title: `Added ${added.join(", ")} to skills.`,
      type: "success",
    });
    onDone();
  }

  async function handleTailorRole() {
    const role = roles.find((item) => item.id === target);
    // The route rejects empty content with a developer-facing message — never send a bullet-less role.
    if (!role || !stripRichText(role.description).trim()) return;

    setPhase({ kind: "loading" });
    try {
      const improved = await requestContentImprovement({
        html: role.description,
        chips: [],
        customInstruction: "",
        keywords: terms,
      });
      setPhase({ kind: "result", improved, roleId: role.id });
    } catch (error) {
      console.error("Tailoring the role to the job failed", error);
      toast.add({
        title:
          error instanceof Error
            ? error.message
            : "Could not rewrite this role. Try again.",
        type: "error",
      });
      setPhase({ kind: "idle" });
    }
  }

  function acceptRewrite(improved: string, roleId: string) {
    // Safe to write a section here: no form is mounted outside the "edit" rail, so
    // nothing holds a pending edit this could clobber (SAVE-FLOW invariants 5 and 6).
    onSaveSection(
      "workExperience",
      rewriteRole(draft.sections.workExperience, roleId, improved),
    );
    toast.add({ title: "Role updated.", type: "success" });
    onDone();
  }

  if (phase.kind === "loading") return <LoadingPhase />;

  if (phase.kind === "result") {
    const role = roles.find((item) => item.id === phase.roleId);
    return (
      <ResultPhase
        beforeHtml={role?.description ?? ""}
        afterHtml={phase.improved}
        onAccept={() => acceptRewrite(phase.improved, phase.roleId)}
        onTryAgain={() => setPhase({ kind: "idle" })}
        onCancel={onDone}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      <FieldSet>
        <FieldLegend>Terms to add</FieldLegend>
        <ToggleGroup
          multiple
          aria-label="Terms to add"
          value={terms}
          onValueChange={(next) => {
            // Hard cap: past this many, the request would silently drop the last terms.
            const picked = next as string[];
            if (picked.length > ALIGNMENT_KEYWORD_LIMIT) return;
            setSelectedTerms(new Set(picked));
          }}
          className="flex flex-wrap gap-2"
        >
          {offered.map((keyword) => (
            <ToggleGroupItem
              key={keyword.term}
              value={keyword.term}
              variant="ai"
              size="sm"
              disabled={atTermLimit && !selectedTerms.has(keyword.term)}
            >
              {keyword.term}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {atTermLimit ? (
          <p className="text-xs text-muted-foreground">
            {ALIGNMENT_KEYWORD_LIMIT} at a time. Deselect one to swap it out.
          </p>
        ) : null}
      </FieldSet>

      <Field>
        <FieldLabel htmlFor="tailor-target">Where should it go?</FieldLabel>
        <FieldContent>
          <Select value={target} onValueChange={(v) => setTarget(v ?? SKILLS_TARGET)}>
            <SelectTrigger id="tailor-target">
              <SelectValue>{() => labelFor(targetOptions, target)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {targetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      {isSkillsTarget && skillCategories.length > 1 ? (
        <Field>
          <FieldLabel htmlFor="tailor-category">Skill category</FieldLabel>
          <FieldContent>
            <Select
              value={categoryId}
              onValueChange={(v) => setCategoryId(v ?? "")}
            >
              <SelectTrigger id="tailor-category">
                <SelectValue>
                  {() =>
                    skillCategories.find((c) => c.id === categoryId)
                      ?.categoryName || "Untitled category"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {skillCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.categoryName || "Untitled category"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      ) : null}

      {!isSkillsTarget && roleIsEmpty ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          This role has no bullets yet. Add one before rewriting it.
        </p>
      ) : null}

      {!isSkillsTarget && !roleIsEmpty ? (
        <p className="text-xs text-muted-foreground">
          Your bullets get rewritten to surface these terms, but only where what
          you have already written supports them. Nothing is invented, so a term
          your experience cannot back is left out.
        </p>
      ) : null}

      <div className="flex shrink-0 justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onDone}>
          Cancel
        </Button>
        {isSkillsTarget ? (
          <Button
            type="button"
            size="sm"
            disabled={terms.length === 0}
            onClick={handleAddToSkills}
          >
            <ListPlusIcon data-icon="inline-start" />
            Add to skills
          </Button>
        ) : (
          <Button
            type="button"
            variant="ai"
            size="sm"
            disabled={terms.length === 0 || roleIsEmpty}
            onClick={handleTailorRole}
          >
            <SparklesIcon data-icon="inline-start" />
            Rewrite role
          </Button>
        )}
      </div>
    </div>
  );
}

/** The target a freshly-opened dialog should land on. */
function defaultTargetFor(
  clicked: ExtractedKeyword | undefined,
  firstWritableRole: WorkExperienceItem | undefined,
  roles: readonly WorkExperienceItem[],
): string {
  if (clicked && SKILL_LIKE.has(clicked.category)) return SKILLS_TARGET;
  return firstWritableRole?.id ?? roles[0]?.id ?? SKILLS_TARGET;
}

/** Append `terms` to a skills category; reports which terms actually landed. */
function addTermsToSkills(
  section: ResumeDraft["sections"]["skills"],
  terms: readonly string[],
  categoryId: string,
): { next: ResumeDraft["sections"]["skills"]; added: string[] } {
  const added: string[] = [];
  const next = terms.reduce((current, term) => {
    const updated = addKeywordToSkills(current, term, categoryId);
    if (updated !== current) added.push(term);
    return updated;
  }, section);
  return { next, added };
}

/** Replace one role's description with the rewritten prose. */
function rewriteRole(
  section: ResumeDraft["sections"]["workExperience"],
  roleId: string,
  improved: string,
): ResumeDraft["sections"]["workExperience"] {
  return {
    ...section,
    items: section.items.map((item) =>
      item.id === roleId ? { ...item, description: improved } : item,
    ),
  };
}
