import { createPhotoHeader } from "@/features/resume-editor/preview/layouts/_shared/create-photo-header";
import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";
import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";

import styles from "./styles.module.css";

// The card is drawn on `.section` itself — no wrapper element — so the summary
// and every section become cards from one rule, and nothing needs renderSection.
export const mosaicLayout = createSingleColumnLayout({
  id: "mosaic",
  label: "Mosaic",
  description:
    "Tinted section cards stacked down the page; colour does the work, no icons.",
  styles,
  Header: createPhotoHeader({ dataLayout: "mosaic", styles }),
  itemViews: defaultItemViews,
});
