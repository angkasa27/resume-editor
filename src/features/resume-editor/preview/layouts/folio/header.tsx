import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/** A round photo with the name and role on one line beside it, and the reach
 * set as a two-column grid of iconed fields underneath. Centred: the frame is
 * symmetrical, so anything ranged left fights it. */
export function FolioHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;

  return (
    <header className={`${styles.header} layout-header`} data-layout="folio">
      <div className="folio-identity">
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
      <PreviewContactLine
        context={context}
        presentation={{ variant: "stacked", icons: true }}
      />
    </header>
  );
}
