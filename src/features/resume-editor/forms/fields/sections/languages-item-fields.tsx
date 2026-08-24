"use client";

import { FieldGroup } from "@/components/ui/field";
import { languageProficiencyOptions } from "@/features/resume-editor/domain/sections/section-metadata";
import {
  type ItemForm,
  SelectField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

export function LanguagesItemFields({
  form,
  index,
}: {
  form: ItemForm;
  index: number;
}) {
  const prefix = `items.${index}` as const;

  return (
    <FieldGroup layout="grid">
      <TextField
        form={form}
        name={`${prefix}.language`}
        label="Language"
        placeholder="Language name"
      />
      <SelectField
        form={form}
        name={`${prefix}.proficiency`}
        label="Proficiency"
        options={languageProficiencyOptions}
      />
    </FieldGroup>
  );
}
