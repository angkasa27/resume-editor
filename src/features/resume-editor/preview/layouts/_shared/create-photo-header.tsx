import {
  PreviewContactLine,
  type ContactPresentation,
} from "@/features/resume-editor/preview/kit/contact-line";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";

/** The photo-left header shared by several layouts: optional photo frame, then
 * name + contact line. Layouts pass their own `styles` and `data-layout`. */
export function createPhotoHeader({
  dataLayout,
  styles,
  contact,
}: {
  dataLayout: string;
  styles: Readonly<Record<string, string>>;
  contact?: ContactPresentation;
}) {
  return function PhotoHeader({ context }: LayoutHeaderProps) {
    const { draft } = context;
    return (
      <header
        className={`${styles.header} layout-header`}
        data-layout={dataLayout}
      >
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
          <PreviewContactLine context={context} presentation={contact} />
        </div>
      </header>
    );
  };
}
