import {
  certificationItemSchema,
  projectItemSchema,
  publicationItemSchema,
} from "@/features/resume-editor/domain/schema";
import { urlField } from "@/features/resume-editor/domain/schema/shared";

/**
 * Persisted schemas (domain/schema) store URLs as plain strings so nothing is ever blocked; these
 * re-apply strict URL checks for the resolver's `errors` only — persistence never consults them.
 */
export const projectFormItemSchema = projectItemSchema.extend({
  projectLink: urlField("Project link"),
});

export const publicationFormItemSchema = publicationItemSchema.extend({
  publicationUrl: urlField("Publication URL"),
});

export const certificationFormItemSchema = certificationItemSchema.extend({
  certificationLink: urlField("Certification link"),
});
