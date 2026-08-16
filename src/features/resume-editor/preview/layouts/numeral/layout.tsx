import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { NumeralHeader } from "./header";
import { numeralItemViews } from "./items";
import styles from "./styles.module.css";

export const numeralLayout = createSingleColumnLayout({
  id: "numeral",
  label: "Numeral",
  description:
    "Sections numbered 01, 02, 03 over a date gutter, with contacts as a labelled table.",
  styles,
  Header: NumeralHeader,
  itemViews: numeralItemViews,
});
