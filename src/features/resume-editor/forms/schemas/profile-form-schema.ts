import { z } from "zod";

import { profileSchema } from "@/features/resume-editor/domain/schema";
import {
  emailField,
  requiredText,
  urlField,
} from "@/features/resume-editor/domain/schema/shared";

const extraLinkFormSchema = z
  .object({
    id: requiredText("Link ID"),
    url: urlField("Link URL"),
  })
  .strict();

/** Form-only: re-applies strict email/URL checks on the lenient `profileSchema`, so the editor flags errors without ever blocking the save. */
export const profileFormSchema = profileSchema.extend({
  email: emailField("Email address"),
  extraLinks: z.array(extraLinkFormSchema),
});
