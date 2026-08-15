import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

/**
 * One full-bleed band in two courses: the centered identity above, and the contact
 * strip below a rule that runs the full width of the paper. The rule is a border on
 * the strip, not a separate element, so it can never drift off the band's edges.
 */
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
        {/* Guarded: the rule belongs to the strip, so an empty strip would draw a
            hairline across the band with nothing under it. */}
        {context.contactItems.length > 0 ? (
          <div className="crest-contacts">
            <PreviewContactLine context={context} />
          </div>
        ) : null}
      </div>
    </header>
  );
}
