import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { AuroraHeader } from "./header";
import { auroraItemViews } from "./items";
import styles from "./styles.module.css";

export const auroraLayout = createSingleColumnLayout({
  id: "aurora",
  label: "Aurora",
  description:
    "Full-bleed gradient header over a label gutter: section names park left, content runs beside them.",
  inset: "none",
  styles,
  Header: AuroraHeader,
  itemViews: auroraItemViews,
  titleLinkMarker: "arrow",
});
