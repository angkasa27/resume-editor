import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";
import { renderIconSectionHeading } from "@/features/resume-editor/preview/layouts/_shared/section-icons";
import type { LayoutSectionSlot } from "@/features/resume-editor/preview/layout-types";

import { PorticoHeader } from "./header";
import { porticoItemViews } from "./items";
import styles from "./styles.module.css";

/** Skills as one running bullet-separated line: the group names are scaffolding
 * this page does not show. Same shape as folio's, `slot.key` narrowing and all.
 * The separator is a CSS ::after so it never trails the last term. */
function renderPorticoSection(slot: LayoutSectionSlot) {
  const { key, node } = slot;
  if (slot.key !== "skills" || !slot.section) return <div key={key}>{node}</div>;

  const terms = slot.section.items.flatMap((item) => item.skills).filter(Boolean);
  if (terms.length === 0) return <div key={key}>{node}</div>;

  return (
    <section className="section" data-section="skills" key={key}>
      <h2 className="section-heading">
        {renderIconSectionHeading("skills", slot.section.heading)}
      </h2>
      <div className={styles.skillsLine}>
        {terms.map((term, index) => (
          <span key={`${term}-${index}`}>{term}</span>
        ))}
      </div>
    </section>
  );
}

/**
 * A two-tone frame around every sheet — accent down the left and along the
 * bottom, secondary across the top and down the right — with a plain icon-led
 * single column inside it over a date gutter that also carries the place.
 */
export const porticoLayout = createSingleColumnLayout({
  id: "portico",
  label: "Portico",
  description:
    "A two-tone frame around every sheet, icon-led headings, and a date gutter that carries the place.",
  styles,
  Header: PorticoHeader,
  itemViews: porticoItemViews,
  renderSectionHeading: renderIconSectionHeading,
  renderSection: renderPorticoSection,
  titleLinkMarker: "link",
});
