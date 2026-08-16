import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

/** One full-bleed band in two courses: centered identity above, contact strip
 * below. The rule is a border on the strip, so it can't drift off the band. */
export function CrestHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="crest">
      <div className="crest-band">
        <div className="crest-identity">
          {draft.profile.photo ? (
            <PhotoFrame src={draft.profile.photo} alt={draft.profile.fullName} />
          ) : null}
          <div className="name-block">
            <h1 className="name" data-testid="resume-preview-full-name">
              <WrapOnSpace text={draft.profile.fullName} />
            </h1>
            {draft.profile.headline ? (
              <p className="headline">{draft.profile.headline}</p>
            ) : null}
          </div>
        </div>
        {/* Guarded: an empty strip would draw a hairline with nothing under it. */}
        {context.contactItems.length > 0 ? (
          <div className="crest-contacts">
            <PreviewContactLine context={context} />
          </div>
        ) : null}
      </div>
    </header>
  );
}
