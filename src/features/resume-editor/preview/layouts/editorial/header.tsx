import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PhotoFrame } from "@/features/resume-editor/preview/kit/section-kit";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/**
 * A masthead: photo, name and role on the left, contacts flush right, closed by a
 * heavy rule with the location hanging under it. Small type throughout — the
 * display size in this layout is spent entirely on the summary below.
 */
export function EditorialHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  const location = context.contactItems.find(
    (item) => item.kind === "location",
  );

  return (
    <header
      className={`${styles.header} layout-header`}
      data-layout="editorial"
    >
      <div className="editorial-masthead">
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
        {/* Location is pulled out and set under the rule, so the block above it
            stays two clean lines of contact rather than three ragged ones. */}
        <PreviewContactLine
          context={context}
          className="editorial-reach"
          presentation={{ variant: "stacked", icons: false }}
          exclude="location"
        />
      </div>
      {location ? <p className="editorial-place">{location.value}</p> : null}
    </header>
  );
}
