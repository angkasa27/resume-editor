import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

import { ContactRailBlocks } from "../_shared/contact-rail";
import { getSideRailColumn } from "../_shared/side-rail-sections";
import { LedgerHeader } from "./header";
import { ledgerItemViews } from "./items";
import styles from "./styles.module.css";

function LedgerLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getSideRailColumn(entry.key) === "side" ? side : main).push(entry);
  }

  return (
    <div className={`${styles.layout} page-inset`}>
      {slots.header}
      <div className="layout-body">
        <div className="layout-side">
          <ContactRailBlocks context={context} detailVariant="labeled" />
          {side.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
        <div className="layout-main">
          {slots.summary}
          {main.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ledgerLayout: PreviewLayoutDefinition = {
  id: "ledger",
  label: "Ledger",
  description:
    "Monochrome two-column: a full-width name over a ruled spine, details left, history right.",
  Component: LedgerLayout,
  Header: LedgerHeader,
  itemViews: ledgerItemViews,
  getColumn: getSideRailColumn,
};
