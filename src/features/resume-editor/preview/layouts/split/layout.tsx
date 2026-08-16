import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

import { getSideRailColumn } from "../_shared/side-rail-sections";
import { SplitHeader } from "./header";
import { splitItemViews } from "./items";
import styles from "./styles.module.css";

function SplitLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getSideRailColumn(entry.key) === "side" ? side : main).push(entry);
  }
  const { photo, fullName } = context.draft.profile;

  return (
    <div className={styles.layout}>
      <div className="layout-side">
        {photo ? (
          <div className="side-photo" data-slot="photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={fullName} />
          </div>
        ) : null}
        {/* Stacked: in a 0.36fr rail an inline run has nowhere to wrap. */}
        <PreviewContactLine
          context={context}
          presentation={{ variant: "stacked", icons: true }}
        />
        {side.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
      <div className="layout-main">
        {slots.header}
        {slots.summary}
        {main.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
    </div>
  );
}

export const splitLayout: PreviewLayoutDefinition = {
  id: "split",
  label: "Split",
  description:
    "Full-height colored rail with photo, contacts, and skills beside a clean main column.",
  Component: SplitLayout,
  hideSummaryHeading: true,
  Header: SplitHeader,
  itemViews: splitItemViews,
  getColumn: getSideRailColumn,
};
