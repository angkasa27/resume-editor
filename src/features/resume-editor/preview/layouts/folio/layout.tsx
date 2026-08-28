import type { ReactNode } from "react";

import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";
import type {
  LayoutComponentProps,
  LayoutSectionSlot,
  PreviewLayoutDefinition,
} from "@/features/resume-editor/preview/layout-types";

import { FolioHeader } from "./header";
import styles from "./styles.module.css";

/**
 * Sections that are a few short lines rather than dated entries. Once the page
 * reaches these, the rest of it is set two-up — which is what turns the foot of
 * the page into a band instead of a column of stubs.
 */
const COMPACT_SECTIONS = new Set<LayoutSectionSlot["key"]>([
  "skills",
  "languages",
  "certifications",
  "references",
  "awards",
]);

/** Skills as one running line, the way the reference sets them: every term from
 * every group, pipe-separated (the separator is a CSS ::after, so it never lands
 * on the last term or gets copied into a paste). */
function SkillsLine({ slot }: { slot: Extract<LayoutSectionSlot, { key: "skills" }> }) {
  const terms = (slot.section?.items ?? [])
    .flatMap((item) => item.skills)
    .filter(Boolean);
  if (terms.length === 0) return <div>{slot.node}</div>;
  return (
    <section className="section" data-section="skills">
      <h2 className="section-heading">{slot.section?.heading}</h2>
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
 * edge, and inside it a single column of ruled sections that ends two-up.
 */
function FolioLayout({ slots }: LayoutComponentProps) {
  const render = (slot: LayoutSectionSlot): ReactNode =>
    slot.key === "skills" ? (
      <SkillsLine slot={slot} key={slot.key} />
    ) : (
      <div key={slot.key}>{slot.node}</div>
    );

  // Every *run* of consecutive compact sections is set two-up. Runs, not a
  // trailing block: the compact sections are not always last (the stock order
  // ends with Organizations), and not a fixed pair either, so a run of three
  // balances across the two columns instead of leaving one stranded below.
  // Order is never rearranged — only the sections that already sit together do.
  const rows: ReactNode[] = [];
  for (let index = 0; index < slots.sections.length; index++) {
    const run: LayoutSectionSlot[] = [];
    while (
      index + run.length < slots.sections.length &&
      COMPACT_SECTIONS.has(slots.sections[index + run.length].key)
    ) {
      run.push(slots.sections[index + run.length]);
    }

    if (run.length > 1) {
      rows.push(
        // data-page-unit: the paginator must not descend into the columns — a
        // spacer inside would reflow the balance across both of them.
        <div className={styles.folioTail} data-page-unit="" key={run[0].key}>
          {run.map(render)}
        </div>,
      );
      index += run.length - 1;
      continue;
    }
    rows.push(render(slots.sections[index]));
  }

  return (
    <div className={`${styles.layout} page-inset`}>
      {slots.header}
      <div className="layout-body">
        {slots.summary}
        {rows}
      </div>
    </div>
  );
}

export const folioLayout: PreviewLayoutDefinition = {
  id: "folio",
  label: "Folio",
  description:
    "A solid band framing every sheet, a photo header ranged left, and short closing sections set two-up.",
  Component: FolioLayout,
  Header: FolioHeader,
  itemViews: defaultItemViews,
};
