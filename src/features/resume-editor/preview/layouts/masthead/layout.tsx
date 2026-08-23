import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";
import { inlineTitleItemViews } from "@/features/resume-editor/preview/layouts/_shared/items/inline-title-items";

import { MastheadHeader } from "./header";
import styles from "./styles.module.css";

function MastheadLayout({ context, slots }: LayoutComponentProps) {
  return (
    <div className={styles.layout}>
      {slots.header}
      <div className="layout-body">
        {/* Contacts lead the body under their own badge — the plate above
            carries the name alone. */}
        {context.contactItems.length > 0 ? (
          <div className="detail-block">
            <h2 className="section-heading">Details</h2>
            <PreviewContactLine
              context={context}
              presentation={{ variant: "stacked", icons: false }}
            />
          </div>
        ) : null}
        {slots.summary}
        {slots.sections.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
    </div>
  );
}

export const mastheadLayout: PreviewLayoutDefinition = {
  id: "masthead",
  label: "Masthead",
  description:
    "Full-bleed square photo beside a colored name plate, over sections tagged with filled badge headings.",
  Component: MastheadLayout,
  Header: MastheadHeader,
  itemViews: inlineTitleItemViews,
  titleLinkMarker: "arrow",
};
