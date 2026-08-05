import { z } from "zod";

import { sanitizeRichTextHtml } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

export function requiredText(label: string) {
  return z.string().trim().min(1, `${label} is required.`);
}

export function optionalText() {
  return z.string().trim().optional().or(z.literal(""));
}

function refineBlankableString(
  label: string,
  validator: z.ZodType<string>,
  message: string,
) {
  return z.string().trim().refine(
    (value) => value === "" || validator.safeParse(value).success,
    {
      message: `${label} ${message}`,
    },
  );
}

export function textField() {
  return z.string().trim();
}

export function richTextField() {
  return z.string().trim().transform((value) => sanitizeRichTextHtml(value));
}

export function emailField(label: string) {
  return refineBlankableString(
    label,
    z.email(),
    "must be a valid email address.",
  );
}

export function urlField(label: string) {
  return refineBlankableString(label, z.url(), "must be a valid URL.");
}

