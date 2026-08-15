import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

/* Photo and name in the wide column; no contacts — dossier renders those in the rail. */
export function DossierHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="dossier">
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
