import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

/** Two blocks bleeding off the top corners with a hairline gap between them:
 * the square uncropped photo and the accent plate carrying the name. With no
 * photo the plate takes the whole width rather than leaving a hole. */
export function MastheadHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="masthead">
      <div className="masthead-band">
        {draft.profile.photo ? (
          <PhotoFrame src={draft.profile.photo} alt={draft.profile.fullName} />
        ) : null}
        <div className="masthead-plate">
          <div className="name-block">
            <h1 className="name" data-testid="resume-preview-full-name">
              <WrapOnSpace text={draft.profile.fullName} />
            </h1>
            {draft.profile.headline ? (
              <p className="headline">{draft.profile.headline}</p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
