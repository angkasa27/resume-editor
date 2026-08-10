import { richTextHasContent } from "@/features/resume-editor/preview/rich-text-utils";

import type { SectionDescriptor } from "./types";

export const organizationVolunteeringDescriptor: SectionDescriptor<"organizationVolunteering"> =
  {
    key: "organizationVolunteering",
    hasContent: (item) =>
      Boolean(
        item.organizationName ||
          item.position ||
          item.location ||
          item.startDate ||
          item.endDate ||
          richTextHasContent(item.description),
      ),
  };
