import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";

/**
 * Every entry is a two-column spread: a large title and its date on the left, the
 * prose on the right at body size. The size difference between the two columns is
 * the layout — the title column is meant to be read on its own as an index of the
 * career, with the right column available if you want the detail.
 */
function EditorialItem({
  title,
  date,
  meta,
  description,
}: {
  title: React.ReactNode;
  date?: string;
  meta?: string;
  description?: string;
}) {
  return (
    <div className="item">
      <div className="item-lead">
        <h3 className="item-title">{title}</h3>
        {date ? <ItemDate>{date}</ItemDate> : null}
        {meta ? <div className="meta">{meta}</div> : null}
      </div>
      <div className="item-body">
        <PreviewRichTextBlock content={description ?? ""} />
      </div>
    </div>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <EditorialItem
      title={
        <WrapOnSpace
          text={commaJoin([item.position, item.companyName, item.location])}
        />
      }
      date={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <EditorialItem
      title={
        <WrapOnSpace
          text={commaJoin([
            item.degree || item.name,
            item.degree ? item.name : undefined,
            item.location,
          ])}
        />
      }
      date={renderDateRange(item.startDate, item.endDate)}
      meta={item.gpa ? `GPA: ${item.gpa}` : undefined}
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
    <EditorialItem
      title={
        <WrapOnSpace
          text={commaJoin([
            item.position,
            item.organizationName,
            item.location,
          ])}
        />
      }
      date={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <EditorialItem
      title={
        <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
      }
      date={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <EditorialItem
      title={
        <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
      }
      date={item.publicationDate}
      meta={item.publisher}
      description={item.description}
    />
  );
}

function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <EditorialItem
      title={
        <PreviewLinkedTitle
          title={item.certificationName}
          link={item.certificationLink}
        />
      }
      date={item.issuedDate}
      meta={commaJoin([
        item.issuingOrganization,
        item.credentialId ? `ID ${item.credentialId}` : undefined,
      ])}
    />
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <EditorialItem
      title={<WrapOnSpace text={item.title} />}
      date={item.issuedDate}
      meta={item.issuer}
      description={item.description}
    />
  );
}

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <div className="item-lead">
        <h3 className="item-title">{item.categoryName}</h3>
      </div>
      <div className="item-body">{commaJoin(item.skills)}</div>
    </div>
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item">
      <div className="item-lead">
        <h3 className="item-title">{item.language}</h3>
      </div>
      <div className="item-body">{item.proficiency}</div>
    </div>
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item">
      <div className="item-lead">
        <h3 className="item-title">{item.name}</h3>
        {item.background ? <div className="meta">{item.background}</div> : null}
      </div>
      <div className="item-body">{item.contactDetails}</div>
    </div>
  );
}

export const editorialItemViews: LayoutSectionItemMap = {
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
