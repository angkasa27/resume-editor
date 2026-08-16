import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { ItemDate } from "./item-date";

export function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.degree || item.name}</h3>
          {item.degree && item.name ? (
            <div className="meta">{item.name}</div>
          ) : null}
          {/* GPA belongs to the school, not hanging under the date. */}
          {item.gpa ? <div className="meta">GPA: {item.gpa}</div> : null}
        </div>
        <div className="item-header-side">
          <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
          {item.location ? <div className="meta">{item.location}</div> : null}
        </div>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}
