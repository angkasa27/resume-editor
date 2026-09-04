import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";
import { TitleWithSubject } from "@/features/resume-editor/preview/layouts/_shared/items/title-with-subject";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";

/** Employer leads, role follows in italic — the reverse of marquee, and the way
 * the reference sets it.
 *
 * The place sits on the left, under the title, not stacked under the date on the
 * right: the title is one line, so a second right-hand line had nothing beside
 * it and read as a stray in the margin. Only the date is ranged right, and it
 * always has the title line to sit against. */
function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <TitleWithSubject title={item.companyName} subject={item.position} />
          {item.location ? <div className="meta">{item.location}</div> : null}
        </div>
        <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

/** Same split, and the GPA crosses the other way. The right column now reads
 * date over GPA against title over place: every right-hand line has a left-hand
 * line to sit against, which is the whole rule this layout follows. */
function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <TitleWithSubject title={item.name} subject={item.degree} />
          {item.location ? <div className="meta">{item.location}</div> : null}
        </div>
        <div className="item-header-side">
          <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
          {item.gpa ? <div className="meta">GPA: {item.gpa}</div> : null}
        </div>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

/** The third and last section carrying a place. The canonical view ranges it
 * right under the date; here every place reads down the left edge. */
function OrganizationVolunteeringItem({
  item,
}: {
  item: SectionItem<"organizationVolunteering">;
}) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.position}</h3>
          <div className="meta">{item.organizationName}</div>
          {item.location ? <div className="meta">{item.location}</div> : null}
        </div>
        <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
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
  organizationVolunteering: OrganizationVolunteeringItem,
};
