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
 * page's three tracks, and a narrow cell taking the third.
 *
 *     row 0:  [ section 0 — items in 2 columns ] [ section 1 — 1 column ]
 *     row 1:  [ section 2 — items in 2 columns ] [ section 3 — 1 column ]
 *
 * So position decides the shape: even-indexed sections are wide and lay their
 * items out side by side, odd-indexed ones are narrow and stack. Reordering
 * therefore reshapes the page, which is the point — a section has one position
 * in the draft and no column field, so anything richer could not be expressed
 * by dragging.
 *
 * Rows are real block-level siblings rather than implicit grid rows, because
 * the pagination pass moves a block by inserting a spacer before it: inside a
 * grid that spacer becomes another grid item and reflows the whole tiling. Each
 * row is marked `data-page-unit`, so the pass moves it whole and never descends
 * into the two-column item grid inside the wide cell.
 *
 * ponytail: a row taller than one page still spills into the next page's margin
 * band — nothing can move within it without reflowing the grid. Real résumés
 * pair a long section with a short one and stay under that, but if it starts
 * showing up, the fix is to paginate the wide cell's two columns as two separate
 * flows rather than one item grid.
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
      {/* The headline labels the summary instead of sitting under the name: the
          name is set large enough that a subtitle beneath it would read as a
          second line of the same block. Its own <h2> is suppressed here. */}
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
};
