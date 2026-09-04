import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/** Name, italic role and the contact rows ranged left against the rail, with a
 * squared photo held at the top right. Nothing here is coloured — the rail is
 * the page's only colour. */
export function MeridianHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;

  return (
    <header className={`${styles.header} layout-header`} data-layout="meridian">
      <div className="meridian-identity">
        <div className="name-block">
          <h1 className="name" data-testid="resume-preview-full-name">
            <WrapOnSpace text={draft.profile.fullName} />
          </h1>
          {draft.profile.headline ? (
            <p className="headline">{draft.profile.headline}</p>
          ) : null}
        </div>
        <PreviewContactLine context={context} />
      </div>
      {draft.profile.photo ? (
        <PhotoFrame src={draft.profile.photo} alt={draft.profile.fullName} />
      ) : null}
    </header>
  );
}
