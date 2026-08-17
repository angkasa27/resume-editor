import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

import { getSideRailColumn } from "../_shared/side-rail-sections";
import { splitItemViews } from "../split/items";
import { DuetHeader } from "./header";
import styles from "./styles.module.css";

function DuetLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getSideRailColumn(entry.key) === "side" ? side : main).push(entry);
  }

  return (
    <div className={styles.layout}>
      <div className="layout-side">
        {slots.header}
        <PreviewContactLine
          context={context}
          presentation={{ variant: "stacked", icons: true }}
        />
        {/* Summary sits in the rail, so the main column stays chronological. */}
        {slots.summary}
        {side.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
      <div className="layout-main">
        {main.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
    </div>
  );
}

export const duetLayout: PreviewLayoutDefinition = {
  id: "duet",
  label: "Duet",
  description:
    "Near-even columns: a tinted left column with photo, contacts, and summary beside the career history, both under banded headings.",
  Component: DuetLayout,
  Header: DuetHeader,
  itemViews: splitItemViews,
  getColumn: getSideRailColumn,
};
