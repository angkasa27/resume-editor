import type { SectionDescriptor } from "./types";

export const skillsDescriptor: SectionDescriptor<"skills"> = {
  key: "skills",
  hasContent: (item) => Boolean(item.categoryName || item.skills.some(Boolean)),
};
