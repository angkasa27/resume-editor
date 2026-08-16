import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { ItemDate } from "./item-date";

export function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.title}</h3>
          {item.issuer ? <div className="meta">{item.issuer}</div> : null}
        </div>
        <ItemDate>{item.issuedDate}</ItemDate>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}
