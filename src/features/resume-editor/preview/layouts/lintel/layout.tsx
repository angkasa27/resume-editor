import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";
import type { LayoutSectionSlot } from "@/features/resume-editor/preview/layout-types";

import { LintelHeader } from "./header";
import { lintelItemViews } from "./items";
import styles from "./styles.module.css";

/**
 * Skills as one flat three-column bullet grid: every term from every group, the
 * group names dropped. `slot.key === "skills"` narrows `slot.section`, so
 * `.skills` is typed. Only skills tiles — languages and certifications keep the
 * date-gutter rows, since both carry a second field the grid has no room for.
 */
function renderLintelSection(slot: LayoutSectionSlot) {
  const { key, node } = slot;
  if (slot.key !== "skills" || !slot.section) return <div key={key}>{node}</div>;

  const terms = slot.section.items.flatMap((item) => item.skills).filter(Boolean);
  if (terms.length === 0) return <div key={key}>{node}</div>;

  return (
    <section className="section" data-section="skills" key={key}>
      <h2 className="section-heading">{slot.section.heading}</h2>
      <ul className={styles.skillsGrid}>
        {terms.map((term, index) => (
          <li key={`${term}-${index}`}>{term}</li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Every section opens with a centred heading on a full-width tinted band — the
 * lintel — under a header that sets the name and role on one line. Bodies hang
 * off a date gutter that carries the place under the date.
 */
export const lintelLayout = createSingleColumnLayout({
  id: "lintel",
  label: "Lintel",
  description:
    "Centred headings on a tinted band over every section, with a date gutter and skills as a three-column grid.",
  styles,
  Header: LintelHeader,
  itemViews: lintelItemViews,
  renderSection: renderLintelSection,
});
