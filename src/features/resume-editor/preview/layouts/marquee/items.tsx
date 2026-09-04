import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";

/** Role and employer read as one sentence — bold role, comma, italic employer —
 * with the date and place ranged right. The canonical item view stacks the
 * employer under the role, which costs a line on every entry. */
function TitleWithSubject({
  title,
  subject,
}: {
  title: string;
  subject?: string;
}) {
  return (
    <h3 className="item-title">
      <WrapOnSpace text={subject ? `${title},` : title} />
      {subject ? (
        <>
          {" "}
          <span className="item-subject">
            <WrapOnSpace text={subject} />
          </span>
        </>
      ) : null}
    </h3>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <TitleWithSubject title={item.position} subject={item.companyName} />
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

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <TitleWithSubject
            title={item.degree || item.name}
            subject={item.degree ? item.name : undefined}
          />
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

/** A bullet in the three-track grid, so the issuer and date drop under the name
 * rather than being pushed to a right margin a third of a column wide. */
function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <div className="item item-bullet">
      <h3 className="item-title">
        <PreviewLinkedTitle
          title={item.certificationName}
          link={item.certificationLink}
        />
      </h3>
      {item.issuingOrganization ? (
        <div className="meta">{item.issuingOrganization}</div>
      ) : null}
      {item.issuedDate ? <ItemDate>{item.issuedDate}</ItemDate> : null}
    </div>
  );
}

/** One running line of `Language — Proficiency`, pipe-separated by CSS. */
function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item item-inline">
      <h3 className="item-title">{item.language}</h3>
      {item.proficiency ? (
        <div className="meta">— {item.proficiency}</div>
      ) : null}
    </div>
  );
}

export const marqueeItemViews: LayoutSectionItemMap = {
  ...defaultItemViews,
  workExperience: WorkExperienceItem,
  education: EducationItem,
  certifications: CertificationsItem,
  languages: LanguagesItem,
};
