import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";
import { TitleWithSubject } from "@/features/resume-editor/preview/layouts/_shared/items/title-with-subject";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";

/** Employer leads, role follows in italic — the reverse of marquee, and the way
 * the reference sets it. Date over place, both ranged right. */
function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <TitleWithSubject title={item.companyName} subject={item.position} />
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
          <TitleWithSubject title={item.name} subject={item.degree} />
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

/** A group heading over its own dashed list, two groups across. */
function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      <ul className="skill-list">
        {item.skills.map((skill, index) => (
          <li key={`${skill}-${index}`}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

/** Certificates and languages both run as one line of bullet-separated entries;
 * the separator is a CSS ::after, so it never orphans at a wrap. */
function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <div className="item item-inline">
      <h3 className="item-title">
        <PreviewLinkedTitle
          title={item.certificationName}
          link={item.certificationLink}
        />
      </h3>
    </div>
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item item-inline">
      <h3 className="item-title">{item.language}</h3>
      {item.proficiency ? (
        <span className="meta">({item.proficiency})</span>
      ) : null}
    </div>
  );
}

export const meridianItemViews: LayoutSectionItemMap = {
  ...defaultItemViews,
  workExperience: WorkExperienceItem,
  education: EducationItem,
  skills: SkillsItem,
  certifications: CertificationsItem,
  languages: LanguagesItem,
};
