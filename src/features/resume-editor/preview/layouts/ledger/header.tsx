import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

/* Name left, square photo right, spanning both columns — ledger keeps contacts in the left rail. */
export function LedgerHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="ledger">
      <div className="name-block">
        <h1 className="name" data-testid="resume-preview-full-name">
          <WrapOnSpace text={draft.profile.fullName} />
        </h1>
        {draft.profile.headline ? (
          <p className="headline">{draft.profile.headline}</p>
        ) : null}
      </div>
      {draft.profile.photo ? (
        <PhotoFrame src={draft.profile.photo} alt={draft.profile.fullName} />
      ) : null}
    </header>
  );
}
