import type { ReactNode } from "react";

import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";

/** The unit of the format: a bold lead flush left, a place or a date flush
 * right. Drops out entirely when neither side has content, so an entry missing
 * its role or its dates doesn't leave a gap where a line should be. */
function EntryRow({
  lead,
  side,
  heading = false,
}: {
  lead?: ReactNode;
  side?: string;
  heading?: boolean;
}) {
  if (!lead && !side) return null;
  return (
    <div className="item-header">
      {heading ? (
        <h3 className="item-title">{lead}</h3>
      ) : (
        <div className="item-line-lead">{lead}</div>
      )}
      <div className="item-line-side">{side}</div>
    </div>
  );
}

/** "Technical: Python, SQL" — label and list on one line, as the format sets
 * its Skills & Interests block. */
function InlineEntry({ label, value }: { label: string; value: string }) {
  const trimmed = label.trim();
  return (
    <div className="item inline-item">
      <h3 className="item-title">
        {trimmed.endsWith(":") ? trimmed : `${trimmed}:`}
      </h3>
      <span className="meta">{value}</span>
    </div>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <EntryRow
        heading
        lead={item.companyName || item.position}
        side={item.location}
      />
      <EntryRow
        lead={item.companyName ? item.position : null}
        side={renderDateRange(item.startDate, item.endDate)}
      />
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
      <EntryRow
        heading
        lead={item.organizationName || item.position}
        side={item.location}
      />
      <EntryRow
        lead={item.organizationName ? item.position : null}
        side={renderDateRange(item.startDate, item.endDate)}
      />
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  // Degree and GPA share the second line, as the format's Education entry does.
  const degreeLine = [
    item.name ? item.degree : "",
    item.gpa ? `GPA ${item.gpa}` : "",
  ]
    .filter(Boolean)
    .join(". ");
  return (
    <div className="item">
      <EntryRow heading lead={item.name || item.degree} side={item.location} />
      <EntryRow
        lead={degreeLine}
        side={renderDateRange(item.startDate, item.endDate)}
      />
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <div className="item">
      <EntryRow
        heading
        lead={
          <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
        }
        side={renderDateRange(item.startDate, item.endDate)}
      />
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <div className="item">
      <EntryRow
        heading
        lead={<PreviewLinkedTitle title={item.title} link={item.publicationUrl} />}
        side={item.publicationDate}
      />
      <EntryRow lead={item.publisher} />
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <div className="item">
      <EntryRow
        heading
        lead={
          <PreviewLinkedTitle
            title={item.certificationName}
            link={item.certificationLink}
          />
        }
        side={item.issuedDate}
      />
      <EntryRow
        lead={item.issuingOrganization}
        side={item.credentialId ? `ID ${item.credentialId}` : undefined}
      />
    </div>
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <div className="item">
      <EntryRow heading lead={item.title} side={item.issuedDate} />
      <EntryRow lead={item.issuer} />
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <InlineEntry label={item.categoryName} value={commaJoin(item.skills)} />
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return <InlineEntry label={item.language} value={item.proficiency} />;
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item">
      <EntryRow heading lead={item.name} side={item.background} />
      {item.contactDetails ? (
        <span className="meta">{item.contactDetails}</span>
      ) : null}
    </div>
  );
}

export const harvardItemViews: LayoutSectionItemMap = {
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
