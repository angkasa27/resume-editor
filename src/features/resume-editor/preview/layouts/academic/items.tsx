import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.companyName || item.position}</h3>
          {item.companyName && item.position ? (
            <em className="meta italic">{item.position}</em>
          ) : null}
          {item.location ? <span className="meta">{item.location}</span> : null}
        </div>
        <div className="item-header-side">
          <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
        </div>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      <span className="meta">{commaJoin(item.skills)}</span>
    </div>
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <h3 className="item-title">
          <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
        </h3>
        <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
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
          <h3 className="item-title">{item.name || item.degree}</h3>
          {item.degree && item.name ? (
            <em className="meta italic">{item.degree}</em>
          ) : null}
          {item.location ? <span className="meta">{item.location}</span> : null}
          {item.gpa ? <span className="meta">GPA: {item.gpa}</span> : null}
        </div>
        <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  // Same shape as every other academic entry; a run-on bibliography line read
  // as one justified paragraph with a real conference name.
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">
            <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
          </h3>
          {item.publisher ? (
            <em className="meta italic">{item.publisher}</em>
          ) : null}
        </div>
        <ItemDate>{item.publicationDate}</ItemDate>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function CertificationsItem({
  item,
}: {
  item: SectionItem<"certifications">;
}) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">
            <PreviewLinkedTitle
              title={item.certificationName}
              link={item.certificationLink}
            />
          </h3>
          {item.issuingOrganization ? (
            <em className="meta italic">{item.issuingOrganization}</em>
          ) : null}
          {item.credentialId ? (
            <span className="meta">Credential ID: {item.credentialId}</span>
          ) : null}
        </div>
        <ItemDate>{item.issuedDate}</ItemDate>
      </div>
    </div>
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.title}</h3>
          {item.issuer ? <em className="meta italic">{item.issuer}</em> : null}
        </div>
        <ItemDate>{item.issuedDate}</ItemDate>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item item-row">
      <h3 className="item-title">{item.language}</h3>
      <em className="meta italic">{item.proficiency}</em>
    </div>
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.name}</h3>
      {item.background ? (
        <em className="meta italic">{item.background}</em>
      ) : null}
      {item.contactDetails ? (
        <span className="meta">{item.contactDetails}</span>
      ) : null}
    </div>
  );
}

function OrganizationVolunteeringItem({
  item,
}: {
  item: SectionItem<"organizationVolunteering">;
}) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.organizationName || item.position}</h3>
          {item.organizationName && item.position ? (
            <em className="meta italic">{item.position}</em>
          ) : null}
          {item.location ? <span className="meta">{item.location}</span> : null}
        </div>
        <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

export const academicItemViews: LayoutSectionItemMap = {
  workExperience: WorkExperienceItem,
  skills: SkillsItem,
  projects: ProjectsItem,
  education: EducationItem,
  publications: PublicationsItem,
  certifications: CertificationsItem,
  awards: AwardsItem,
  languages: LanguagesItem,
  references: ReferencesItem,
  organizationVolunteering: OrganizationVolunteeringItem,
};
