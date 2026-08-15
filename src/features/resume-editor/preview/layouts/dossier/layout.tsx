import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";
import { inlineTitleItemViews } from "@/features/resume-editor/preview/layouts/_shared/items/inline-title-items";
import {
  RailLanguagesItem,
  RailSkillsItem,
} from "@/features/resume-editor/preview/layouts/_shared/items/rail-items";

import { ContactRailBlocks } from "../_shared/contact-rail";
import { getSideRailColumn } from "../_shared/side-rail-sections";
import { DossierHeader } from "./header";
import styles from "./styles.module.css";

function DossierLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getSideRailColumn(entry.key) === "side" ? side : main).push(entry);
  }

  // Main column first in DOM as well as on screen: the rail is supporting
  // detail, and a screen reader should hear the history before the phone number.
  return (
    <div className={styles.layout}>
      <div className="layout-main">
        {slots.header}
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
  );
}

export const dossierLayout: PreviewLayoutDefinition = {
  id: "dossier",
  label: "Dossier",
  description:
    "Wide main column with the photo and name, beside a narrow colored rail of contacts on the right.",
  Component: DossierLayout,
  Header: DossierHeader,
  // Rail variants for the two sections that land in the narrow column, same as sidebar/split.
  itemViews: {
    ...inlineTitleItemViews,
    skills: RailSkillsItem,
    languages: RailLanguagesItem,
  },
  getColumn: getSideRailColumn,
};
