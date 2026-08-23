"use client";

import { Controller } from "react-hook-form";
import {
  ClockIcon,
  HeartIcon,
  MailboxIcon,
  MapPinIcon,
  PhoneIcon,
  SpellCheckIcon,
  UsersIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  getLayoutExtraFields,
  type LayoutExtraField,
  type LayoutExtraFieldIcon,
} from "@/features/resume-editor/domain/presentation/layout-section-rules";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FIELD_CONTROL_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import { FieldLabelText } from "@/features/resume-editor/forms/fields/field-label-text";
import { MonthYearPicker } from "@/features/resume-editor/forms/fields/month-year-picker";
import { ProfileTextField } from "@/features/resume-editor/forms/profile-fields";
import type { ProfileFormContext } from "@/features/resume-editor/forms/use-profile-form";

/** The spec names what a field is; the glyph is this layer's choice, the same
 * way Profile picks a pin for its location. */
const ICONS: Record<LayoutExtraFieldIcon, LucideIcon> = {
  reading: SpellCheckIcon,
  gender: UsersRoundIcon,
  postal: MailboxIcon,
  phone: PhoneIcon,
  address: MapPinIcon,
  time: ClockIcon,
  people: UsersIcon,
  spouse: HeartIcon,
};

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
  const { control, register, setValue, formState, getFieldState } = ctx.form;

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
          const Icon = field.icon ? ICONS[field.icon] : null;

          if (field.type === "date") {
            return (
              <Field
                key={field.key}
                data-invalid={state.invalid || undefined}
                className={field.fullWidth ? "col-span-full" : undefined}
              >
                {/* The picker's trigger is a plain button with no placeholder of
                    its own, so an sr-only label carries the accessible name —
                    the same wiring every dated section field uses. */}
                <FieldLabel htmlFor={id} className="sr-only">
                  <FieldLabelText label={field.label} />
                </FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field: bound }: { field: { value?: string } }) => (
                      <MonthYearPicker
                        id={id}
                        precision="day"
                        value={bound.value}
                        placeholder={field.label}
                        ariaInvalid={state.invalid}
                        onChange={(next) =>
                          setValue(name, next, {
                            shouldDirty: true,
                            shouldValidate: formState.isSubmitted,
                          })
                        }
                      />
                    )}
                  />
                  <FieldError errors={[state.error]} />
                </FieldContent>
              </Field>
            );
          }

          if (field.type === "select") {
            return (
              <Field
                key={field.key}
                data-invalid={state.invalid || undefined}
                className={field.fullWidth ? "col-span-full" : undefined}
              >
                <FieldContent>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field: bound }: { field: { value?: string } }) => (
                      <Select
                        value={bound.value ?? ""}
                        onValueChange={(next: string | null) =>
                          setValue(name, next ?? "", {
                            shouldDirty: true,
                            shouldValidate: formState.isSubmitted,
                          })
                        }
                      >
                        <SelectTrigger
                          id={id}
                          className={FIELD_CONTROL_CLASS}
                          aria-label={field.label}
                          aria-invalid={state.invalid || undefined}
                        >
                          <SelectValue placeholder={field.label} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {(field.options ?? []).map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[state.error]} />
                </FieldContent>
              </Field>
            );
          }

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
                    placeholder={field.label}
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
              placeholder={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              icon={Icon ? <Icon /> : undefined}
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
