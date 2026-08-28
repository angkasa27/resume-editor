import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";
import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";
import type { LayoutSectionSlot } from "@/features/resume-editor/preview/layout-types";

import { FolioHeader } from "./header";
import styles from "./styles.module.css";

/**
 * Skills as one running line, the way the reference sets them: every term from
 * every group, pipe-separated. `slot.key === "skills"` narrows `slot.section`,
 * so `.skills` is typed. The separator is a CSS ::after, so it never lands on
 * the last term or gets copied into a paste.
 */
function renderFolioSection(slot: LayoutSectionSlot) {
  const { key, node } = slot;
  if (slot.key !== "skills" || !slot.section) return <div key={key}>{node}</div>;

  const terms = slot.section.items.flatMap((item) => item.skills).filter(Boolean);
  if (terms.length === 0) return <div key={key}>{node}</div>;

  return (
    <section className="section" data-section="skills" key={key}>
      <h2 className="section-heading">{slot.section.heading}</h2>
      <div className={styles.skillsLine}>
        {terms.map((term, index) => (
          <span key={`${term}-${index}`}>{term}</span>
        ))}
      </div>
    </section>
  );
}

/**
 * A framed page. Every sheet carries the same solid band bleeding to the paper
 * edge (see the stylesheet — it is four tiled background layers, because nothing
 * else spans sheets), and inside it a plain single column of ruled sections.
 */
export const folioLayout = createSingleColumnLayout({
  id: "folio",
  label: "Folio",
  description:
    "A solid band framing every sheet, a photo header ranged left, and a short rule under every heading.",
  styles,
  Header: FolioHeader,
  itemViews: defaultItemViews,
  renderSection: renderFolioSection,
});
