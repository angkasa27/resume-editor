"use client";

import { useState } from "react";
import { SparklesIcon, TargetIcon } from "lucide-react";
import { toast } from "@/components/ui/toast";

import { Button } from "@/components/ui/button";
import {
  DialogHeaderRow,
  DialogHeaderSection,
} from "@/features/resume-editor/editor/shared/dialog-header";
import { RichTextEditor } from "@/features/resume-editor/forms/rich-text/rich-text-editor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FieldLabelText } from "@/features/resume-editor/forms/fields/field-label-text";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LoadingPhase,
  ResultPhase,
  requestContentImprovement,
} from "@/features/resume-editor/forms/rich-text/improve-phases";
import { useJobKeywords } from "@/features/resume-editor/state/job-keywords";

const QUICK_ACTIONS = [
  { label: "Add a metric" },
  { label: "Stronger verb" },
  { label: "More concise" },
  { label: "Sound more senior" },
  { label: "Fix grammar" },
] as const;

/** Only offered once a job description has been analyzed. Unlike the other
 *  chips it carries data (the JD's terms) rather than a fixed instruction. */
const ALIGN_TO_JOB = "Align to the job";

type Phase =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; improved: string };

type ImproveWithAiDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHtml: string;
  onAccept: (improved: string) => void;
};

function ImproveWithAiDialog({
  open,
  onOpenChange,
  currentHtml,
  onAccept,
}: ImproveWithAiDialogProps) {
  const isMobile = useIsMobile();

  // Mount body only when open so state resets on each open.
  const body = open ? (
    <ImproveWithAiBody
      currentHtml={currentHtml}
      onAccept={(improved) => {
        onAccept(improved);
        onOpenChange(false);
      }}
      onCancel={() => onOpenChange(false)}
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
            icon={<SparklesIcon className="size-4 text-primary" />}
            title="Improve with AI"
            description="Select quick actions or describe what to change."
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
          icon={<SparklesIcon className="size-4 text-primary" />}
          title="Improve with AI"
          description="Select quick actions or describe what to change. The language of your content will be preserved."
          onClose={() => onOpenChange(false)}
        />
        {body}
      </DialogContent>
    </Dialog>
  );
}

type ImproveWithAiBodyProps = {
  currentHtml: string;
  onAccept: (improved: string) => void;
  onCancel: () => void;
};

function ImproveWithAiBody({
  currentHtml,
  onAccept,
  onCancel,
}: ImproveWithAiBodyProps) {
  const jobKeywords = useJobKeywords();
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [customInstruction, setCustomInstruction] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const alignToJob = selectedChips.has(ALIGN_TO_JOB);

  async function handleImprove() {
    setPhase({ kind: "loading" });

    try {
      const improved = await requestContentImprovement({
        html: currentHtml,
        // The job chip is not a fixed instruction, so it never reaches the
        // server's chip table — it travels as the term list instead.
        chips: [...selectedChips].filter((chip) => chip !== ALIGN_TO_JOB),
        customInstruction,
        keywords: alignToJob ? jobKeywords : undefined,
      });
      setPhase({ kind: "result", improved });
    } catch (error) {
      console.error("Improving the content with AI failed", error);
      const message =
        error instanceof Error
          ? error.message
          : "Could not rewrite the content. Try again.";
      toast.add({ title: message, type: "error" });
      setPhase({ kind: "idle" });
    }
  }

  if (phase.kind === "loading") {
    return <LoadingPhase />;
  }

  if (phase.kind === "result") {
    return (
      <ResultPhase
        beforeHtml={currentHtml}
        afterHtml={phase.improved}
        onAccept={() => onAccept(phase.improved)}
        onTryAgain={() => setPhase({ kind: "idle" })}
        onCancel={onCancel}
      />
    );
  }

  const canSubmit =
    selectedChips.size > 0 || customInstruction.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FieldSet>
        <FieldLegend>Quick actions</FieldLegend>
        {/* A real toggle group: these are multi-select and were previously bare
            <button>s with no aria-pressed, so selection was invisible to AT. */}
        <ToggleGroup
          multiple
          aria-label="Quick actions"
          value={[...selectedChips]}
          onValueChange={(next) => setSelectedChips(new Set(next as string[]))}
          className="flex flex-wrap gap-2"
        >
          {jobKeywords.length > 0 ? (
            <ToggleGroupItem value={ALIGN_TO_JOB} variant="ai" size="sm">
              <TargetIcon data-icon="inline-start" />
              {ALIGN_TO_JOB}
            </ToggleGroupItem>
          ) : null}
          {QUICK_ACTIONS.map(({ label }) => (
            <ToggleGroupItem
              key={label}
              value={label}
              variant="ai"
              size="sm"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <Field className="min-h-0 flex-1">
        <FieldLabel htmlFor="improve-instructions">
          <FieldLabelText label="Additional instructions" optional />
        </FieldLabel>
        <FieldContent className="min-h-0 flex-1">
          <Textarea
            id="improve-instructions"
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder={`e.g. "Add experience in React Native"\n"Emphasize the team leadership aspect"\n"Remove the comma after the first line"`}
            rows={4}
            className="resize-none"
          />
        </FieldContent>
      </Field>

      <div className="flex justify-end gap-2 shrink-0">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="ai"
          size="sm"
          disabled={!canSubmit}
          onClick={handleImprove}
        >
          <SparklesIcon data-icon="inline-start" />
          Improve
        </Button>
      </div>
    </div>
  );
}

// ─── Convenience wrapper ──────────────────────────────────────────────────────
// Bundles RichTextEditor + ImproveWithAiDialog so any richText field can opt-in
// to AI improvement without duplicating open-state boilerplate.

type RichTextEditorWithImproveProps = {
  value: string;
  ariaLabel?: string;
  invalid?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function RichTextEditorWithImprove({
  value,
  ariaLabel,
  invalid = false,
  placeholder,
  onChange,
}: RichTextEditorWithImproveProps) {
  const [improveOpen, setImproveOpen] = useState(false);

  return (
    <>
      <RichTextEditor
        value={value}
        ariaLabel={ariaLabel}
        invalid={invalid}
        placeholder={placeholder}
        onChange={onChange}
        onImproveWithAi={() => setImproveOpen(true)}
      />
      <ImproveWithAiDialog
        open={improveOpen}
        onOpenChange={setImproveOpen}
        currentHtml={value}
        onAccept={onChange}
      />
    </>
  );
}
