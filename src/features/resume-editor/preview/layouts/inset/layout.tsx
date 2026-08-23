import type { LayoutSectionSlot } from "@/features/resume-editor/preview/layout-types";
import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { InsetHeader } from "./header";
import { insetItemViews } from "./items";
import styles from "./styles.module.css";

// Inset merges skills into one inline "·"-joined line. `slot.key === "skills"`
// narrows `slot.section` to the skills section, so `.items` is typed.
function renderInsetSection(slot: LayoutSectionSlot) {
  const { key, node } = slot;
  if (slot.key === "skills" && slot.section) {
    const allSkills = slot.section.items
      .flatMap((item) => item.skills)
      .filter(Boolean)
      .join("  ·  ");
    if (!allSkills) return <div key={key}>{node}</div>;
    return (
      <section className="section" data-section="skills" key={key}>
        <h2 className="section-heading">{slot.section.heading}</h2>
        <div className={styles.skillsLine}>{allSkills}</div>
      </section>
    );
  }
  return <div key={key}>{node}</div>;
}

export const insetLayout = createSingleColumnLayout({
  id: "inset",
  label: "Inset",
  description:
    "Compact inline layout with two-row item headers and merged inline skills.",
  styles,
  Header: InsetHeader,
  itemViews: insetItemViews,
  renderSection: renderInsetSection,
});
