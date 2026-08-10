import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";
import { getSideRailColumn } from "@/features/resume-editor/preview/layouts/_shared/side-rail-sections";
import { sidebarItemViews } from "@/features/resume-editor/preview/layouts/sidebar/items";

import { SpotlightHeader } from "./header";
import styles from "./styles.module.css";

// Unlike split, the whole identity block (photo, name, contacts) sits in the rail,
// so the main column opens on the summary instead of a second name.
function SpotlightLayout({ context, slots }: LayoutComponentProps) {
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

export const spotlightLayout: PreviewLayoutDefinition = {
  id: "spotlight",
  label: "Spotlight",
  description:
    "Gradient rail carrying the photo, name, and contacts, beside a clean main column.",
  Component: SpotlightLayout,
  Header: SpotlightHeader,
  itemViews: sidebarItemViews,
  getColumn: getSideRailColumn,
};
