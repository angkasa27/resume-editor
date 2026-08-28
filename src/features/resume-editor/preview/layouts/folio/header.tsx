import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/** A round photo on the left, the name and role sharing the line beside it, and
 * the reach under them as a two-column grid of chipped fields. Ranged left, not
 * centred: the band is already the symmetry on this page. */
export function FolioHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;

  return (
    <header className={`${styles.header} layout-header`} data-layout="folio">
      {draft.profile.photo ? (
        <PhotoFrame src={draft.profile.photo} alt={draft.profile.fullName} />
      ) : null}
      <div className="folio-identity">
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
    </header>
  );
}
