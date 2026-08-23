import type { ReactNode } from "react";

import type {
  LayoutComponentProps,
  PreviewLayoutDefinition,
} from "@/features/resume-editor/preview/layout-types";

import { RirekishoHeader } from "./header";
import { rirekishoItemViews } from "./items";
import styles from "./styles.module.css";

/** Every table on the form is headed by the same two columns, so the section
 * title arrives as the third cell of its own ruled row. Summary is the one
 * exception — it is a prose box (志望の動機), not a dated table. */
function renderSectionHeading(
  sectionKey: string,
  heading: ReactNode,
): ReactNode {
  if (sectionKey === "summary") return heading;
  return (
    <>
      <span className="rirekisho-year">年</span>
      <span className="rirekisho-month">月</span>
      <span className="rirekisho-body">{heading}</span>
    </>
  );
}

function RirekishoLayout({ slots }: LayoutComponentProps) {
  return (
    <div className={`${styles.layout} page-inset`}>
      {slots.header}
      <div className="layout-body">
        {slots.sections.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
        {/* Closes the history table, as the form requires. */}
        <div className="rirekisho-row rirekisho-close">
          <span className="rirekisho-year" />
          <span className="rirekisho-month" />
          <span className="rirekisho-body">以上</span>
        </div>
        {slots.summary}
      </div>
    </div>
  );
}

export const rirekishoLayout: PreviewLayoutDefinition = {
  id: "rirekisho",
  label: "Rirekisho",
  description:
    "The Japanese 履歴書 form: a ruled identity block with a 30×40mm photo box, then history in 年 / 月 columns.",
  Component: RirekishoLayout,
  Header: RirekishoHeader,
  itemViews: rirekishoItemViews,
  renderSectionHeading,
};
