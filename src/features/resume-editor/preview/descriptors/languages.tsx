import type { SectionDescriptor } from "./types";

export const languagesDescriptor: SectionDescriptor<"languages"> = {
  key: "languages",
  hasContent: (item) => Boolean(item.language || item.proficiency),
};
