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
 * Sections that are a few short lines rather than dated entries. Two of these
 * in a row are set side by side, which is what turns the end of the page into a
 * footer band instead of a column of stubs.
 */
const COMPACT_SECTIONS = new Set<LayoutSectionSlot["key"]>([
  "skills",
  "languages",
  "certifications",
  "references",
  "awards",
]);

/**
 * A framed page. Every sheet carries the same ruled border (see the stylesheet
 * — it is four tiled background layers, because nothing else spans sheets), and
 * the body inside it is a plain single column that pairs off its short trailing
 * sections.
 */
function FolioLayout({ slots }: LayoutComponentProps) {
  const rows: ReactNode[] = [];

  // Pairs are formed from *adjacent* sections only, so the user's chosen order
  // is never rearranged — just laid out two-up where it already reads that way.
  for (let index = 0; index < slots.sections.length; index++) {
    const current = slots.sections[index];
    const next = slots.sections[index + 1];
    if (
      COMPACT_SECTIONS.has(current.key) &&
      next &&
      COMPACT_SECTIONS.has(next.key)
    ) {
      rows.push(
        <div className={styles.folioPair} key={current.key}>
          <div>{current.node}</div>
          <div>{next.node}</div>
        </div>,
      );
      index++;
      continue;
    }
    rows.push(<div key={current.key}>{current.node}</div>);
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
    "A ruled border framing every sheet, a centered photo header, and short closing sections set two-up.",
  Component: FolioLayout,
  Header: FolioHeader,
  itemViews: defaultItemViews,
};
