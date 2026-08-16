import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

export function AcademicHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header
      className={`${styles.header} layout-header`}
      data-layout="academic"
    >
      {draft.profile.photo ? (
        <div className="header-photo" data-slot="photo-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={draft.profile.photo} alt={draft.profile.fullName} />
        </div>
      ) : null}
      <div className="name-block">
        <h1 className="name" data-testid="resume-preview-full-name">
          <WrapOnSpace text={draft.profile.fullName} />
        </h1>
        {draft.profile.headline ? (
          <p className="headline">{draft.profile.headline}</p>
        ) : null}
      </div>
      {/* No icons: contacts render in small-caps, where a glyph looks alien and a
          raw URL is illegible — shorten instead. */}
      <PreviewContactLine
        context={context}
        presentation={{ variant: "inline", icons: false }}
      />
    </header>
  );
}
