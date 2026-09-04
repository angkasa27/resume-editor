import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

import { getSideRailColumn } from "../_shared/side-rail-sections";
import { renderIconSectionHeading } from "../_shared/section-icons";
import { DuotoneHeader } from "./header";
import { duotoneItemViews } from "./items";
import styles from "./styles.module.css";

function DuotoneLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getSideRailColumn(entry.key) === "side" ? side : main).push(entry);
  }
  const { photo, fullName } = context.draft.profile;

  return (
    <div className={styles.layout}>
      <div className="layout-side">
        {slots.header}
        {photo ? (
          <div className="side-photo" data-slot="photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={fullName} />
          </div>
        ) : null}
        {/* Stacked: the rail is too narrow for an inline run to wrap cleanly. */}
        <PreviewContactLine
          context={context}
          presentation={{ variant: "stacked", icons: true }}
        />
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
  );
}

export const duotoneLayout: PreviewLayoutDefinition = {
  id: "duotone",
  label: "Duotone",
  description:
    "Two washes of one hue: a pale rail carrying name, photo and skills beside a saturated main column.",
  Component: DuotoneLayout,
  // The summary is the lede opening the coloured column; a heading above it would
  // compete with the name already set at the top of the rail.
  hideSummaryHeading: true,
  Header: DuotoneHeader,
  itemViews: duotoneItemViews,
  renderSectionHeading: renderIconSectionHeading,
  // Headings here are icon-led and bold on a saturated field; an underline strong
  // enough to read against that would outweigh them.
  titleLinkMarker: "arrow",
  getColumn: getSideRailColumn,
};
