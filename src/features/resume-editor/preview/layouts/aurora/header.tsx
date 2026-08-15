import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

/* Photo left, name and contacts right, all inside a full-bleed gradient band. */
export function AuroraHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="aurora">
      <div className="aurora-band">
        {draft.profile.photo ? (
          <div className="header-photo" data-slot="photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={draft.profile.photo} alt={draft.profile.fullName} />
          </div>
        ) : null}
        <div className="header-body">
          <div className="name-block">
            <h1 className="name" data-testid="resume-preview-full-name">
              <WrapOnSpace text={draft.profile.fullName} />
            </h1>
            {draft.profile.headline ? (
              <p className="headline">{draft.profile.headline}</p>
            ) : null}
          </div>
          <PreviewContactLine
            context={context}
            presentation={{ variant: "inline", icons: true }}
          />
        </div>
      </div>
    </header>
  );
}
