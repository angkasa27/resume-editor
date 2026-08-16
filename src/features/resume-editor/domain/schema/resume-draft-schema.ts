import { z } from "zod";

import { createDefaultPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { insightsSchema } from "@/features/resume-editor/domain/schema/insights-schemas";
import { pdfPresentationSchema } from "@/features/resume-editor/domain/schema/presentation-schemas";
import { profileSchema } from "@/features/resume-editor/domain/schema/profile-schemas";
import { sectionsSchema } from "@/features/resume-editor/domain/schema/section-schemas";

const resumeDraftSchema = z.object({
  schemaVersion: z.literal(3),
  updatedAt: z.string().min(1),
  pdfPresentation: pdfPresentationSchema
    .optional()
    .default(createDefaultPdfPresentation()),
  profile: profileSchema,
  sections: sectionsSchema,
  // Optional so existing drafts parse unchanged (schemaVersion stays 3); `.catch`
  // degrades a malformed blob to "no job target" rather than failing the draft.
  insights: insightsSchema.optional().catch(undefined),
});

export type ResumeDraft = z.infer<typeof resumeDraftSchema>;

export function parseResumeDraft(input: unknown): ResumeDraft {
  return resumeDraftSchema.parse(input);
}
