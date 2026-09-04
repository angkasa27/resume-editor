import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";

/** Two tracks: the left gutter holds the date with the place stacked under it,
 * the right holds a bold organisation followed by an italic role on the same
 * line, then the bullets. Every item keeps this grid — a foreign item DOM would
 * drop its children into the gutter. */
function LintelItem({
  date,
  place,
  title,
  role,
  description,
}: {
  date?: string;
  place?: string;
  title: React.ReactNode;
  role?: string;
  description?: string;
}) {
  return (
    <div className="item">
      <ItemDate>
        {date ? <span className="lintel-date">{date}</span> : null}
        {place ? <span className="lintel-place">{place}</span> : null}
      </ItemDate>
      <div className="item-main">
        <h3 className="item-title">
          {title}
          {role ? <span className="lintel-role">{role}</span> : null}
        </h3>
        <PreviewRichTextBlock content={description ?? ""} />
      </div>
    </div>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <LintelItem
      date={renderDateRange(item.startDate, item.endDate)}
      place={item.location}
      title={<WrapOnSpace text={item.companyName} />}
      role={item.position}
      description={item.description}
    />
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <LintelItem
      date={renderDateRange(item.startDate, item.endDate)}
      place={item.location}
      title={<WrapOnSpace text={item.degree || item.name} />}
      role={commaJoin([
        item.degree ? item.name : undefined,
        item.gpa ? `GPA: ${item.gpa}` : undefined,
      ])}
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
    <LintelItem
      date={renderDateRange(item.startDate, item.endDate)}
      place={item.location}
      title={<WrapOnSpace text={item.organizationName} />}
      role={item.position}
      description={item.description}
    />
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <LintelItem
      date={renderDateRange(item.startDate, item.endDate)}
      title={
        <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
      }
      description={item.description}
    />
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <LintelItem
      date={item.publicationDate}
      title={
        <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
      }
      role={item.publisher}
      description={item.description}
    />
  );
}

function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <LintelItem
      date={item.issuedDate}
      title={
        <PreviewLinkedTitle
          title={item.certificationName}
          link={item.certificationLink}
        />
      }
      role={commaJoin([
        item.issuingOrganization,
        item.credentialId ? `ID ${item.credentialId}` : undefined,
      ])}
    />
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <LintelItem
      date={item.issuedDate}
      title={<WrapOnSpace text={item.title} />}
      role={item.issuer}
      description={item.description}
    />
  );
}

/* Skills normally render as a three-column bullet grid (see layout.tsx); this
   is the fallback for a skills section handed through unchanged. */
function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <LintelItem title={item.categoryName} role={commaJoin(item.skills)} />
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return <LintelItem title={item.language} role={item.proficiency} />;
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <LintelItem
      title={item.name}
      role={commaJoin([item.background, item.contactDetails])}
    />
  );
}

export const lintelItemViews: LayoutSectionItemMap = {
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
