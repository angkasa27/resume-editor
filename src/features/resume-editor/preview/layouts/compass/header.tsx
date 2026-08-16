import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/**
 * Full width, above both columns: a small photo and the name on one line. The name
 * is held to a single line here (see the stylesheet) so the two columns below start
 * from a flat edge instead of one that moves with the length of the name.
 */
export function CompassHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="compass">
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
    </header>
  );
}
