import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

import styles from "./styles.module.css";

/* Rendered inside the tinted left column; contacts follow it in the rail. */
export function DuetHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="duet">
      <div className="name-block">
        <h1 className="name" data-testid="resume-preview-full-name">
          <WrapOnSpace text={draft.profile.fullName} />
        </h1>
        {draft.profile.headline ? (
          <p className="headline">{draft.profile.headline}</p>
        ) : null}
      </div>
      {draft.profile.photo ? (
        <div className="side-photo" data-slot="photo-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={draft.profile.photo} alt={draft.profile.fullName} />
        </div>
      ) : null}
    </header>
  );
}
