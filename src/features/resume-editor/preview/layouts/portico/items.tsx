import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";

/** Two columns per item: the left gutter holds the date and, under it, the
 * place — the reference stacks them as one block of circumstance — and the
 * right column holds the title and body. Entries with neither still keep the
 * gutter, because `.item-main` names its own column. */
function PorticoItem({
  date,
  place,
  title,
  subtitle,
  description,
}: {
  date?: string;
  place?: string;
  title: React.ReactNode;
  subtitle?: string;
  description?: string;
}) {
  return (
    <div className="item">
      <ItemDate>
        {date ? <span className="portico-date">{date}</span> : null}
        {place ? <span className="portico-place">{place}</span> : null}
      </ItemDate>
      <div className="item-main">
        <h3 className="item-title">{title}</h3>
        {subtitle ? <div className="meta">{subtitle}</div> : null}
        <PreviewRichTextBlock content={description ?? ""} />
      </div>
    </div>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <PorticoItem
      date={renderDateRange(item.startDate, item.endDate)}
      place={item.location}
      title={<WrapOnSpace text={commaJoin([item.companyName, item.position])} />}
      description={item.description}
    />
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <PorticoItem
      date={renderDateRange(item.startDate, item.endDate)}
      place={item.location}
      title={<WrapOnSpace text={commaJoin([item.degree, item.name])} />}
      subtitle={item.gpa ? `GPA: ${item.gpa}` : undefined}
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
    <PorticoItem
      date={renderDateRange(item.startDate, item.endDate)}
      place={item.location}
      title={
        <WrapOnSpace text={commaJoin([item.organizationName, item.position])} />
      }
      description={item.description}
    />
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <PorticoItem
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
    <PorticoItem
      date={item.publicationDate}
      title={
        <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
      }
      subtitle={item.publisher}
      description={item.description}
    />
  );
}

function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <PorticoItem
      date={item.issuedDate}
      title={
        <PreviewLinkedTitle
          title={item.certificationName}
          link={item.certificationLink}
        />
      }
      subtitle={commaJoin([
        item.issuingOrganization,
        item.credentialId ? `ID ${item.credentialId}` : undefined,
      ])}
    />
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <PorticoItem
      date={item.issuedDate}
      title={<WrapOnSpace text={item.title} />}
      subtitle={item.issuer}
      description={item.description}
    />
  );
}

/* Skills normally render as one bullet line (see layout.tsx); this view is the
   fallback for a skills section the layout hands through unchanged, and it has
   to keep the same grid or its children land in the date gutter. */
function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <PorticoItem title={item.categoryName} subtitle={commaJoin(item.skills)} />
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return <PorticoItem title={item.language} subtitle={item.proficiency} />;
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <PorticoItem
      title={item.name}
      subtitle={commaJoin([item.background, item.contactDetails])}
    />
  );
}

export const porticoItemViews: LayoutSectionItemMap = {
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
