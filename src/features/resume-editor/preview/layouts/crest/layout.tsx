import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";
import { inlineTitleItemViews } from "@/features/resume-editor/preview/layouts/_shared/items/inline-title-items";

import { CrestHeader } from "./header";
import styles from "./styles.module.css";

export const crestLayout = createSingleColumnLayout({
  id: "crest",
  label: "Crest",
  description:
    "Centered photo, name, and contact strip on one full-bleed band, over a quiet single column.",
  inset: "none",
  styles,
  Header: CrestHeader,
  itemViews: inlineTitleItemViews,
});
