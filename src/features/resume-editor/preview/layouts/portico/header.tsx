import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/** Identity ranged left — name, italic role, then contacts stacked under accent
 * glyphs — with the photo held square at the right, opposite the name. */
export function PorticoHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;

  return (
    <header className={`${styles.header} layout-header`} data-layout="portico">
      <div className="portico-identity">
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
          presentation={{ variant: "stacked", icons: true }}
        />
      </div>
      {draft.profile.photo ? (
        <PhotoFrame src={draft.profile.photo} alt={draft.profile.fullName} />
      ) : null}
    </header>
  );
}
