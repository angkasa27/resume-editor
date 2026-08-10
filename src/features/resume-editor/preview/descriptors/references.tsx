import type { SectionDescriptor } from "./types";

export const referencesDescriptor: SectionDescriptor<"references"> = {
  key: "references",
  hasContent: (item) =>
    Boolean(item.name || item.background || item.contactDetails),
};
