import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { HarvardHeader } from "./header";
import { harvardItemViews } from "./items";
import styles from "./styles.module.css";

export const harvardLayout = createSingleColumnLayout({
  id: "harvard",
  label: "Harvard",
  description:
    "The Harvard MCS format: centered headings, organization over role, dates and places flush right. Plain enough for any parser.",
  styles,
  Header: HarvardHeader,
  itemViews: harvardItemViews,
});
