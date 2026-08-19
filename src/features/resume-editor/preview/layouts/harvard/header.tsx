import { createPhotoHeader } from "@/features/resume-editor/preview/layouts/_shared/create-photo-header";

import styles from "./styles.module.css";

// Plain dotted contact line: the format has no icons and no colour.
export const HarvardHeader = createPhotoHeader({
  dataLayout: "harvard",
  styles,
  contact: { variant: "inline", icons: false },
});
