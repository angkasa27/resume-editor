import { richTextHasContent } from "@/features/resume-editor/preview/rich-text-utils";

import type { SectionDescriptor } from "./types";

export const workExperienceDescriptor: SectionDescriptor<"workExperience"> = {
  key: "workExperience",
  hasContent: (item) =>
    Boolean(
      item.companyName ||
        item.position ||
        item.location ||
        item.startDate ||
        item.endDate ||
        richTextHasContent(item.description),
    ),
};
