import { createPhotoHeader } from "@/features/resume-editor/preview/layouts/_shared/create-photo-header";
import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { studioItemViews } from "./items";
import { renderIconSectionHeading } from "../_shared/section-icons";
import styles from "./styles.module.css";

export const studioLayout = createSingleColumnLayout({
  id: "studio",
  label: "Studio",
  description:
    "Icon-led single column: every section is badged, skills read as chips, dates as pills.",
  styles,
  Header: createPhotoHeader({ dataLayout: "studio", styles }),
  itemViews: studioItemViews,
  renderSectionHeading: renderIconSectionHeading,
  titleLinkMarker: "arrow",
});
