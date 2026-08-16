import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";

/** Pipe instead of the shared middot, which reads too fussy at this weight. */
function withLocation(name: string | undefined, location: string | undefined) {
  return [name, location].filter(Boolean).join(" | ");
}

/** Title, then "organization | location", then the date row. */
function BoldItem({
  title,
  meta,
  side,
  description,
}: {
  title: React.ReactNode;
  meta?: string;
  side?: React.ReactNode;
  description: string;
}) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{title}</h3>
          {meta ? <div className="meta">{meta}</div> : null}
        </div>
        {side ? <div className="item-header-side">{side}</div> : null}
      </div>
      <PreviewRichTextBlock content={description} />
    </div>
  );
}

function WorkExperienceItem({
  item,
}: {
  item: SectionItem<"workExperience">;
}) {
  return (
    <BoldItem
      title={item.position}
      meta={withLocation(item.companyName, item.location)}
      side={
        <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
      }
      description={item.description}
    />
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <BoldItem
      title={item.degree || item.name}
      meta={withLocation(
        item.degree && item.name ? item.name : undefined,
        item.location,
      )}
      side={
        <>
          <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
          {item.gpa ? <div className="meta">GPA: {item.gpa}</div> : null}
        </>
      }
      description={item.description}
    />
  );
}

function OrganizationVolunteeringItem({
  item,
}: {
  item: SectionItem<"organizationVolunteering">;
}) {
  return (
    <BoldItem
      title={item.position}
      meta={withLocation(item.organizationName, item.location)}
      side={
        <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
      }
      description={item.description}
    />
  );
}

export const boldTypeItemViews: LayoutSectionItemMap = {
  ...defaultItemViews,
  workExperience: WorkExperienceItem,
  education: EducationItem,
  organizationVolunteering: OrganizationVolunteeringItem,
};
