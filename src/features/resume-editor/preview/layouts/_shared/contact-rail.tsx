import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { PreviewRenderContext } from "@/features/resume-editor/preview/types";

/**
 * Contacts split into two headed rail blocks ("Details" / "Links"), the way ledger
 * and dossier's rails read. Each block is dropped when it would be empty — a heading
 * with nothing under it is worse than no heading.
 *
 * Plain `<h2 className="section-heading">` on purpose: these are profile fields, not
 * sections, so they must not carry the section heading test id or a `data-section`.
 */
export function ContactRailBlocks({
  context,
  detailVariant,
}: {
  context: PreviewRenderContext;
  detailVariant: "labeled" | "stacked";
}) {
  const hasDetails = context.contactItems.some((item) => item.kind !== "link");
  const hasLinks = context.contactItems.some((item) => item.kind === "link");

  return (
    <>
      {hasDetails ? (
        <div className="rail-block">
          <h2 className="section-heading">Details</h2>
          <PreviewContactLine
            context={context}
            only="details"
            presentation={{ variant: detailVariant, icons: false }}
          />
        </div>
      ) : null}
      {hasLinks ? (
        <div className="rail-block">
          <h2 className="section-heading">Links</h2>
          <PreviewContactLine
            context={context}
            only="links"
            presentation={{ variant: "stacked", icons: false }}
          />
        </div>
      ) : null}
    </>
  );
}
