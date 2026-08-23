import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";
import { inlineTitleItemViews } from "@/features/resume-editor/preview/layouts/_shared/items/inline-title-items";

import { AtlasHeader } from "./header";
import styles from "./styles.module.css";

/**
 * Sections pair off into rows of two cells: a wide cell spanning two of the
 * page's three tracks, and a narrow cell taking the third. Position decides the
 * shape — even-indexed sections are wide, odd ones narrow — so reordering
 * reshapes the page.
 *
 * Rows are real block-level siblings, not implicit grid rows, and each is marked
 * `data-page-unit`: the pagination pass moves a row whole (a spacer inside a
 * grid would reflow the whole tiling) and never descends into the two-column
 * item grid. Known limit: a row taller than a page still spills into the next
 * page's margin band; the fix would be paginating the wide cell's columns
 * as two separate flows.
 */
function AtlasLayout({ context, slots }: LayoutComponentProps) {
  const hasLinks = context.contactItems.some((item) => item.kind === "link");
  const rows: (typeof slots.sections)[] = [];
  for (let index = 0; index < slots.sections.length; index += 2) {
    rows.push(slots.sections.slice(index, index + 2));
  }

  return (
    <div className={`${styles.layout} page-inset`}>
      {slots.header}
      {/* The headline labels the summary — beneath the large name it would read
          as a second line of the same block. Its own <h2> is suppressed. */}
      <div className="atlas-lede">
        <div className="atlas-profile">
          {context.draft.profile.headline ? (
            <h2 className="section-heading">
              {context.draft.profile.headline}
            </h2>
          ) : null}
          {slots.summary}
        </div>
        {hasLinks ? (
          <div className="atlas-links">
            <h2 className="section-heading">Links</h2>
            <PreviewContactLine
              context={context}
              only="links"
              presentation={{ variant: "stacked", icons: false }}
            />
          </div>
        ) : null}
      </div>
      <div className="layout-body">
        {rows.map((row) => (
          <div key={row[0].key} className="atlas-row" data-page-unit="">
            {row.map(({ key, node }, column) => (
              <div
                key={key}
                className="atlas-cell"
                data-span={column === 0 ? "wide" : "narrow"}
              >
                {node}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export const atlasLayout: PreviewLayoutDefinition = {
  id: "atlas",
  label: "Atlas",
  description:
    "Sections tile across a three-track grid, each item numbered, divided by hairline rules.",
  Component: AtlasLayout,
  hideSummaryHeading: true,
  Header: AtlasHeader,
  itemViews: inlineTitleItemViews,
  titleLinkMarker: "arrow",
};
