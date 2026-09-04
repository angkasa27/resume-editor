import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";
import { renderIconSectionHeading } from "@/features/resume-editor/preview/layouts/_shared/section-icons";
import type { LayoutSectionSlot } from "@/features/resume-editor/preview/layout-types";

import { MarqueeHeader } from "./header";
import { marqueeItemViews } from "./items";
import styles from "./styles.module.css";

/** Both three-track sections move whole. The pagination pass inserts a spacer
 * *before* a block that lands in a page's edge band, and a spacer inserted
 * before a grid child becomes another grid item, reflowing the whole grid —
 * `pnpm e2e:pagebreak` caught a skill sitting 151px into the bottom band.
 * `data-page-unit` is how a layout says "move this, don't descend into it".
 *
 * Ceiling: a grid taller than a page is then moved rather than split. Neither of
 * these sections is anywhere near that; if one ever is, the fix is per-row units
 * the way atlas does it, not dropping the attribute. */
const PAGE_UNIT_SECTIONS = new Set(["skills", "certifications"]);

/**
 * Skills flatten to one bullet per term across the same three tracks the
 * certificates use. The group names are scaffolding this page does not show —
 * `slot.key === "skills"` narrows `slot.section`, so `.skills` is typed.
 */
function renderMarqueeSection(slot: LayoutSectionSlot) {
  const { key, node } = slot;
  const pageUnit = PAGE_UNIT_SECTIONS.has(key) ? "" : undefined;

  if (slot.key !== "skills" || !slot.section) {
    return (
      <div key={key} data-page-unit={pageUnit}>
        {node}
      </div>
    );
  }

  const terms = slot.section.items.flatMap((item) => item.skills).filter(Boolean);
  if (terms.length === 0) {
    return (
      <div key={key} data-page-unit={pageUnit}>
        {node}
      </div>
    );
  }

  return (
    <section className="section" data-section="skills" key={key}>
      <h2 className="section-heading">
        {renderIconSectionHeading("skills", slot.section.heading)}
      </h2>
      <div className="item-list" data-page-unit="">
        {terms.map((term, index) => (
          <div className="item item-bullet" key={`${term}-${index}`}>
            <span className="item-title">{term}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * A dark full-bleed band across the top of the first sheet, and under it a plain
 * single column whose headings are an icon over a short accent bar. The band is
 * the secondary colour and the accent is spent on the name, the bars and the
 * dates — the two-tone contrast is the layout.
 */
export const marqueeLayout = createSingleColumnLayout({
  id: "marquee",
  label: "Marquee",
  description:
    "A dark full-bleed band carrying the name and contacts, over icon-led headings each underscored by a short accent bar.",
  inset: "none",
  styles,
  Header: MarqueeHeader,
  itemViews: marqueeItemViews,
  renderSection: renderMarqueeSection,
  renderSectionHeading: renderIconSectionHeading,
  titleLinkMarker: "link",
});
