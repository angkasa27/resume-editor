import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";

import type { PreviewRenderableSection } from "./types";
import type { SectionItem } from "./descriptors/types";
import type { PreviewLayoutDefinition } from "./layout-types";

export function renderSectionBody<K extends CollectionSectionKey>(
  layout: PreviewLayoutDefinition,
  section: PreviewRenderableSection<K>,
) {
  const ItemView = layout.itemViews[section.key] as (props: {
    item: SectionItem<K>;
  }) => React.ReactNode;
  const heading = layout.renderSectionHeading
    ? layout.renderSectionHeading(section.key, section.heading)
    : section.heading;
  return (
    <section className="section" data-section={section.key}>
      <h2
        className="section-heading"
        data-testid="resume-preview-section-heading"
      >
        {heading}
      </h2>
      <div className="item-list">
        {section.items.map((item) => (
          <ItemView key={(item as { id: string }).id} item={item} />
        ))}
      </div>
    </section>
  );
}
