import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { projectFormItemSchema } from "@/features/resume-editor/forms/schemas/collection-form-item-schemas";
import { profileFormSchema } from "@/features/resume-editor/forms/schemas/profile-form-schema";

// Form schemas only surface advisory format errors; persistence accepts these values.
describe("advisory form schemas", () => {
  it("flags a malformed email but accepts a valid one", () => {
    const { profile } = createDefaultResumeDraft();

    expect(
      profileFormSchema.safeParse({ ...profile, email: "not-an-email" }).success,
    ).toBe(false);
    expect(
      profileFormSchema.safeParse({ ...profile, email: "me@example.com" })
        .success,
    ).toBe(true);
  });

  it("flags a malformed project link but accepts a valid one", () => {
    const [item] = createDefaultResumeDraft().sections.projects.items;

    expect(
      projectFormItemSchema.safeParse({ ...item, projectLink: "notaurl" })
        .success,
    ).toBe(false);
    expect(
      projectFormItemSchema.safeParse({
        ...item,
        projectLink: "https://example.com",
      }).success,
    ).toBe(true);
  });
});
