import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/**
 * Name across the page with a mark at the far right: the photo, cropped square,
 * or — with no photo — a small filled square. The mark is not decoration that can
 * be dropped, it is what balances a single line of very large type against an
 * otherwise empty right margin.
 *
 * Contacts read as a labelled table rather than an icon run, which is the whole
 * point of the layout: everything is named, nothing is a glyph.
 */
export function NumeralHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  const hasLinks = context.contactItems.some((item) => item.kind === "link");

  return (
    <header className={`${styles.header} layout-header`} data-layout="numeral">
      <div className="numeral-identity">
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
        ) : (
          <span className="numeral-mark" aria-hidden={true} />
        )}
      </div>
      <div className="numeral-contacts">
        <PreviewContactLine
          context={context}
          only="details"
          presentation={{ variant: "labeled", icons: false }}
        />
        {hasLinks ? (
          <div className="numeral-links">
            <span className="contact-label">Links</span>
            <PreviewContactLine
              context={context}
              only="links"
              presentation={{ variant: "stacked", icons: false }}
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
