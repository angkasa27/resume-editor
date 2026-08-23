"use client";

import { CalendarIcon } from "lucide-react";

import { FieldGroup } from "@/components/ui/field";
import {
  getLayoutExtraFields,
  type LayoutExtraField,
} from "@/features/resume-editor/domain/presentation/layout-section-rules";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabelText } from "@/features/resume-editor/forms/fields/field-label-text";
import { ProfileTextField } from "@/features/resume-editor/forms/profile-fields";
import type { ProfileFormContext } from "@/features/resume-editor/forms/use-profile-form";

/** The identity fields one layout prints and the others ignore — kana readings,
 * a birth date, a postal code. Declared per layout in `layout-section-rules.ts`
 * and stored in the free `profile.extras` map, so a new locale is a data edit. */
export function ExtraFieldsForm({
  ctx,
  idPrefix,
  layoutId,
}: {
  ctx: ProfileFormContext;
  idPrefix: string;
  layoutId: PdfLayoutId;
}) {
  const group = getLayoutExtraFields(layoutId);
  const { register, formState, getFieldState } = ctx.form;

  // Reachable: the panel stays open while the user switches to a layout that
  // declares nothing, and the row it was opened from is already gone.
  if (!group) {
    return (
      <p className="text-sm text-muted-foreground">
        This template needs no extra details.
      </p>
    );
  }

  const path = (field: LayoutExtraField) => `extras.${field.key}` as const;

  return (
    <div className="@container/fields flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{group.description}</p>
      <FieldGroup layout="grid">
        {group.fields.map((field) => {
          const name = path(field);
          const state = getFieldState(name, formState);
          const id = `${idPrefix}-${field.key}`;

          if (field.type === "textarea") {
            return (
              <Field
                key={field.key}
                data-invalid={state.invalid || undefined}
                className="col-span-full"
              >
                <FieldLabel htmlFor={id} className="sr-only">
                  <FieldLabelText label={field.label} />
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id={id}
                    rows={3}
                    placeholder={field.placeholder ?? field.label}
                    aria-invalid={state.invalid || undefined}
                    {...register(name)}
                  />
                  <FieldError errors={[state.error]} />
                </FieldContent>
              </Field>
            );
          }

          return (
            <ProfileTextField
              key={field.key}
              register={register}
              name={name}
              id={id}
              label={field.label}
              placeholder={field.placeholder ?? field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              // A native date input paints its own format mask, so the
              // placeholder that carries every other field's name never shows.
              icon={field.type === "date" ? <CalendarIcon /> : undefined}
              invalid={state.invalid || undefined}
              error={state.error}
              className={field.fullWidth ? "col-span-full" : undefined}
            />
          );
        })}
      </FieldGroup>
    </div>
  );
}
