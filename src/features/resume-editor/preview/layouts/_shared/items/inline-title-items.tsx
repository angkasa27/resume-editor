import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { commaJoin, joinParts } from "@/features/resume-editor/preview/helpers/string";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import {
  ReferencesItem,
  SkillsItem,
} from "@/features/resume-editor/preview/layouts/_shared/items";
// Left-stacked: these layouts put every field on the left edge, and the canonical
// LanguagesItem is an `.item-row` that pushes the proficiency to the right margin.
import { RailLanguagesItem } from "@/features/resume-editor/preview/layouts/_shared/items/rail-items";
import { ItemDate } from "./item-date";

/** Item DOM for layouts whose header reads as one sentence: role, employer and
 * place run together on the title line, the date underneath — not the canonical
 * two-column `item-header`. Shared by dossier/crest/masthead. */
function InlineTitle({ parts }: { parts: (string | undefined)[] }) {
  return (
    <h3 className="item-title">
      <WrapOnSpace text={commaJoin(parts)} />
    </h3>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <InlineTitle parts={[item.position, item.companyName, item.location]} />
      <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <div className="item">
      <InlineTitle
        parts={[item.degree || item.name, item.degree ? item.name : undefined, item.location]}
      />
      <ItemDate>
        {joinParts([
          renderDateRange(item.startDate, item.endDate),
          item.gpa ? `GPA: ${item.gpa}` : undefined,
        ])}
      </ItemDate>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <div className="item">
      <h3 className="item-title">
        <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
      </h3>
      <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <div className="item">
      <h3 className="item-title">
        <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
      </h3>
      <ItemDate>{commaJoin([item.publisher, item.publicationDate])}</ItemDate>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <div className="item">
      <h3 className="item-title">
        <PreviewLinkedTitle
          title={commaJoin([item.certificationName, item.issuingOrganization])}
          link={item.certificationLink}
        />
      </h3>
      <ItemDate>
        {joinParts([
          item.issuedDate,
          item.credentialId ? `ID ${item.credentialId}` : undefined,
        ])}
      </ItemDate>
    </div>
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <div className="item">
      <InlineTitle parts={[item.title, item.issuer]} />
      <ItemDate>{item.issuedDate}</ItemDate>
      <PreviewRichTextBlock content={item.description} />
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
      <InlineTitle
        parts={[item.position, item.organizationName, item.location]}
      />
      <ItemDate>{renderDateRange(item.startDate, item.endDate)}</ItemDate>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

export const inlineTitleItemViews: LayoutSectionItemMap = {
  workExperience: WorkExperienceItem,
  skills: SkillsItem,
  projects: ProjectsItem,
  education: EducationItem,
  publications: PublicationsItem,
  certifications: CertificationsItem,
  awards: AwardsItem,
  languages: RailLanguagesItem,
  references: ReferencesItem,
  organizationVolunteering: OrganizationVolunteeringItem,
};
