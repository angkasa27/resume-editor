import type { CSSProperties } from "react";

import { getCounterFont } from "@/features/resume-editor/domain/presentation/font-collection";
import { inlineTitleItemViews } from "@/features/resume-editor/preview/layouts/_shared/items/inline-title-items";
import type {
  LayoutComponentProps,
  PreviewLayoutDefinition,
} from "@/features/resume-editor/preview/layout-types";

import { MonolithHeader } from "./header";
import styles from "./styles.module.css";

/**
 * One saturated field, two voices. The page is a single accent colour with the
 * readable on-accent as the only foreground — no muted grey, no rules, no
 * second hue — so the hierarchy has to come from size and family alone.
 *
 * `--monolith-counter` is the user's font flipped to the opposite category:
 * their pick keeps the display voice (name, summary, item titles) and its
 * partner takes the reading voice (rail labels, dates, prose). Deriving it
 * means changing the font still changes both halves.
 */
function MonolithLayout({ context, slots }: LayoutComponentProps) {
  const { draft } = context;
  const headline = draft.profile.headline?.trim();
  const location = context.contactItems.find(
    (item) => item.kind === "location",
  );
  const counter = getCounterFont(draft.pdfPresentation.fontFamilyId).stack;

  return (
    <div
      className={`${styles.layout} page-inset`}
      style={{ "--monolith-counter": counter } as CSSProperties}
    >
      {slots.header}
      <div className="layout-body">
        {/* The headline labels the summary from the rail. Both cells are always
            emitted so the paragraph keeps its column when there is no headline. */}
        {slots.summary || headline ? (
          <div className="monolith-row">
            {headline ? <p className="monolith-label">{headline}</p> : <span />}
            <div className="monolith-lede">{slots.summary}</div>
          </div>
        ) : null}
        {slots.sections.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
      {/* Location closes the page rather than crowding the reach block, which
          stays three flush lines of contact. */}
      {location ? <p className="monolith-place">{location.value}</p> : null}
    </div>
  );
}

export const monolithLayout: PreviewLayoutDefinition = {
  id: "monolith",
  label: "Monolith",
  description:
    "The whole page in one saturated colour, with size and a paired second typeface carrying every level of the hierarchy.",
  Component: MonolithLayout,
  hideSummaryHeading: true,
  Header: MonolithHeader,
  itemViews: inlineTitleItemViews,
};
