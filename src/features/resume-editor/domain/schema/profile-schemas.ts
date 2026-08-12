import { z } from "zod";

import {
  optionalText,
  requiredText,
  textField,
} from "@/features/resume-editor/domain/schema/shared";

// Lenient persisted schema (see section-schemas.ts): email and link URLs are
// stored as plain strings so a mid-typed value is never rejected. The strict
// email/URL format checks are advisory and live in the form resolver
// (forms/schemas/profile-form-schema.ts).
const extraLinkSchema = z
  .object({
    id: requiredText("Link ID"),
    url: textField(),
  })
  .strict();

export const profileSchema = z.object({
  fullName: textField(),
  // The line under the name ("Front-End Developer · Graphic Designer"). Optional
  // so drafts written before it existed still parse and schemaVersion stays at 3;
  // blank means every layout header simply omits it.
  headline: optionalText(),
  location: textField(),
  phone: textField(),
  email: textField(),
  photo: textField(),
  extraLinks: z.array(extraLinkSchema),
});

export type Profile = z.infer<typeof profileSchema>;
