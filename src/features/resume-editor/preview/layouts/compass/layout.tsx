import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";
import { inlineTitleItemViews } from "@/features/resume-editor/preview/layouts/_shared/items/inline-title-items";
import {
  RailLanguagesItem,
  RailSkillsItem,
} from "@/features/resume-editor/preview/layouts/_shared/items/rail-items";
import { renderIconSectionHeading } from "@/features/resume-editor/preview/layouts/_shared/section-icons";

import { ContactRailBlocks } from "../_shared/contact-rail";
import { getSideRailColumn } from "../_shared/side-rail-sections";
import { CompassHeader } from "./header";
import styles from "./styles.module.css";

function CompassLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getSideRailColumn(entry.key) === "side" ? side : main).push(entry);
  }

  return (
    <div className={`${styles.layout} page-inset`}>
      {slots.header}
      <div className="layout-body">
        <div className="layout-main">
          {slots.summary}
          {main.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
        <div className="layout-side">
          <ContactRailBlocks context={context} detailVariant="stacked" />
          {side.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const compassLayout: PreviewLayoutDefinition = {
  id: "compass",
  label: "Compass",
  description:
    "Icon-marked section headings hanging in the margin, beside a plain rail of contacts and links.",
  Component: CompassLayout,
  Header: CompassHeader,
  itemViews: {
    ...inlineTitleItemViews,
    skills: RailSkillsItem,
    languages: RailLanguagesItem,
  },
  renderSectionHeading: renderIconSectionHeading,
  getColumn: getSideRailColumn,
  titleLinkMarker: "link",
};
