import { z } from "zod";

import {
  optionalText,
  requiredText,
  textField,
} from "@/features/resume-editor/domain/schema/shared";

// Lenient persisted schema (see section-schemas.ts): email/URLs stored as plain
// strings so mid-typed values are never rejected; strict checks live in profile-form-schema.ts.
const extraLinkSchema = z
  .object({
    id: requiredText("Link ID"),
    url: textField(),
  })
  .strict();

export const profileSchema = z.object({
  fullName: textField(),
  // Optional so drafts written before it existed still parse; blank renders nothing.
  headline: optionalText(),
  location: textField(),
  /**
   * Identity fields only some layouts print — the 履歴書's ふりがな, 生年月日,
   * 性別 and 〒 today. A free map, not named columns: which keys exist is the
   * layout's business (`layout-section-rules.ts` declares them), and a new
   * locale must not cost a schema version. Optional, so older drafts parse.
   */
  extras: z.record(z.string(), z.string()).optional(),
  phone: textField(),
  email: textField(),
  photo: textField(),
  extraLinks: z.array(extraLinkSchema),
});

export type Profile = z.infer<typeof profileSchema>;
