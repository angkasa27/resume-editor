import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

import styles from "./styles.module.css";

/** Name and headline only: the photo and the contact block sit under this in the
 * rail, placed by the layout so they keep the rail's stacking order. */
export function DuotoneHeader({ context }: LayoutHeaderProps) {
  const { profile } = context.draft;
  return (
    <header className={`${styles.header} layout-header`} data-layout="duotone">
      <div className="name-block">
        <h1 className="name" data-testid="resume-preview-full-name">
          <WrapOnSpace text={profile.fullName} />
        </h1>
        {profile.headline ? (
          <p className="headline">{profile.headline}</p>
        ) : null}
      </div>
    </header>
  );
}
