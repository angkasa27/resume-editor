import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { MeridianHeader } from "./header";
import { meridianItemViews } from "./items";
import styles from "./styles.module.css";

/**
 * A gradient rail down the left edge of every sheet — accent at the head,
 * secondary at the foot — and beside it a plain black-on-white column of ruled
 * headings. The rail is the only colour on the page, which is what lets it read
 * as a gradient rather than as decoration.
 */
export const meridianLayout = createSingleColumnLayout({
  id: "meridian",
  label: "Meridian",
  description:
    "A gradient rail down the left edge of every sheet, beside a plain black-on-white column of ruled headings.",
  inset: "none",
  styles,
  Header: MeridianHeader,
  itemViews: meridianItemViews,
});
