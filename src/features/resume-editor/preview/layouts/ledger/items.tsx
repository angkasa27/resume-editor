import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import { WrapOnSpace } from "@/features/resume-editor/preview/kit/wrap-on-space";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import {
  RailLanguagesItem,
  RailSkillsItem,
} from "@/features/resume-editor/preview/layouts/_shared/items/rail-items";

/**
 * Ledger's item: role and employer on the title line, the place alone on the right,
 * and the date on its own line *under* the title rather than beside it. The canonical
 * `item-header` pairs date and location in the right column; here the right column
 * carries place only, so the eye scans titles down one edge and places down the other.
 */
function TitleRow({
  title,
  side,
}: {
  title: React.ReactNode;
  side?: string;
}) {
  return (
    <div className="item-header">
      <h3 className="item-title">
        {typeof title === "string" ? <WrapOnSpace text={title} /> : title}
      </h3>
      {side ? <div className="meta">{side}</div> : null}
    </div>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <TitleRow
        title={commaJoin([item.position, item.companyName])}
        side={item.location}
      />
      <div className="item-date">
        {renderDateRange(item.startDate, item.endDate)}
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <div className="item">
      <TitleRow
        title={commaJoin([item.degree || item.name, item.degree ? item.name : undefined])}
        side={item.location}
      />
      <div className="item-date">
        {renderDateRange(item.startDate, item.endDate)}
        {item.gpa ? ` · GPA: ${item.gpa}` : ""}
      </div>
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
      <TitleRow
        title={commaJoin([item.position, item.organizationName])}
        side={item.location}
      />
      <div className="item-date">
        {renderDateRange(item.startDate, item.endDate)}
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <div className="item">
      <TitleRow
        title={
          <PreviewLinkedTitle
            title={item.projectName}
            link={item.projectLink}
          />
        }
      />
      <div className="item-date">
        {renderDateRange(item.startDate, item.endDate)}
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <div className="item">
      <TitleRow
        title={
          <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
        }
        side={item.publisher}
      />
      <div className="item-date">{item.publicationDate}</div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <div className="item">
      <TitleRow
        title={
          <PreviewLinkedTitle
            title={item.certificationName}
            link={item.certificationLink}
          />
        }
        side={item.issuingOrganization}
      />
      <div className="item-date">
        {item.issuedDate}
        {item.credentialId ? ` · ID ${item.credentialId}` : ""}
      </div>
    </div>
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <div className="item">
      <TitleRow title={item.title} side={item.issuer} />
      <div className="item-date">{item.issuedDate}</div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.name}</h3>
      {item.background ? <div className="meta">{item.background}</div> : null}
      {item.contactDetails ? (
        <div className="meta">{item.contactDetails}</div>
      ) : null}
    </div>
  );
}

export const ledgerItemViews: LayoutSectionItemMap = {
  workExperience: WorkExperienceItem,
  skills: RailSkillsItem,
  projects: ProjectsItem,
  education: EducationItem,
  publications: PublicationsItem,
  certifications: CertificationsItem,
  awards: AwardsItem,
  languages: RailLanguagesItem,
  references: ReferencesItem,
  organizationVolunteering: OrganizationVolunteeringItem,
};
