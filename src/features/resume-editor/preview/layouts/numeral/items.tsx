import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import { ItemDate } from "@/features/resume-editor/preview/layouts/_shared/items/item-date";

/** Three columns per item: date in the left gutter, title and body in the
 * middle, place italic on the right — the left edge is a column of dates and
 * indices. `side` is for place only; anything that can run long goes in
 * `subtitle`, since the right track sizes to its content and would starve the
 * middle column. */
function NumeralItem({
  date,
  title,
  subtitle,
  side,
  description,
}: {
  date?: string;
  title: React.ReactNode;
  subtitle?: string;
  side?: string;
  description?: string;
}) {
  return (
    <div className="item">
      <ItemDate>{date}</ItemDate>
      <div className="item-main">
        <h3 className="item-title">{title}</h3>
        {subtitle ? <div className="meta">{subtitle}</div> : null}
        <PreviewRichTextBlock content={description ?? ""} />
      </div>
      {side ? <div className="item-place">{side}</div> : null}
    </div>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <NumeralItem
      date={renderDateRange(item.startDate, item.endDate)}
      title={
        <WrapOnSpace text={commaJoin([item.position, item.companyName])} />
      }
      side={item.location}
      description={item.description}
    />
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <NumeralItem
      date={renderDateRange(item.startDate, item.endDate)}
      title={<WrapOnSpace text={item.name || item.degree} />}
      subtitle={commaJoin([
        item.name ? item.degree : undefined,
        item.gpa ? `GPA: ${item.gpa}` : undefined,
      ])}
      side={item.location}
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
    <NumeralItem
      date={renderDateRange(item.startDate, item.endDate)}
      title={
        <WrapOnSpace
          text={commaJoin([item.position, item.organizationName])}
        />
      }
      side={item.location}
      description={item.description}
    />
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <NumeralItem
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
    <NumeralItem
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
    <NumeralItem
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
    <NumeralItem
      date={item.issuedDate}
      title={<WrapOnSpace text={item.title} />}
      subtitle={item.issuer}
      description={item.description}
    />
  );
}

/* Every item is the same three-column grid, skills included — a foreign item DOM
   here would drop its children into the date and place cells. */
function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <NumeralItem
      title={item.categoryName}
      subtitle={commaJoin(item.skills)}
    />
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <NumeralItem title={item.language} subtitle={item.proficiency} />
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <NumeralItem
      title={item.name}
      subtitle={commaJoin([item.background, item.contactDetails])}
    />
  );
}

export const numeralItemViews: LayoutSectionItemMap = {
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
