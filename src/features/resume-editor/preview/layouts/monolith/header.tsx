import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/** Photo in the label rail, name and reach in the body column, so the header
 * sits on the same two tracks as every section below it. The headline is not
 * here: the layout files it in the rail beside the summary, where it labels the
 * paragraph the way a section name labels its items. Location is not here
 * either — it closes the page. */
export function MonolithHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;

  return (
    <header className={`${styles.header} layout-header`} data-layout="monolith">
      {draft.profile.photo ? (
        <PhotoFrame src={draft.profile.photo} alt={draft.profile.fullName} />
      ) : null}
      <div className="name-block">
        <h1 className="name" data-testid="resume-preview-full-name">
          <WrapOnSpace text={draft.profile.fullName} />
        </h1>
        <PreviewContactLine
          context={context}
          className="monolith-reach"
          presentation={{ variant: "stacked", icons: false }}
          exclude="location"
        />
      </div>
    </header>
  );
}
