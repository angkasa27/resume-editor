import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

import { EditorialHeader } from "./header";
import { editorialItemViews } from "./items";
import styles from "./styles.module.css";

/** The summary lives in the tinted opening band at display size — the pull
 * quote the layout is built around, lifted out of the section flow. */
function EditorialLayout({ slots }: LayoutComponentProps) {
  return (
    <div className={styles.layout}>
      <div className="editorial-opening">
        {slots.header}
        {slots.summary}
      </div>
      <div className="layout-body page-inset-x page-inset-b">
        {slots.sections.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
    </div>
  );
}

export const editorialLayout: PreviewLayoutDefinition = {
  id: "editorial",
  label: "Editorial",
  description:
    "Magazine opening: a tinted band carrying the masthead and a display-size summary, over wide-margin spreads.",
  Component: EditorialLayout,
  hideSummaryHeading: true,
  Header: EditorialHeader,
  itemViews: editorialItemViews,
};
