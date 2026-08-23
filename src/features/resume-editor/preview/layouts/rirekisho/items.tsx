import type { ReactNode } from "react";

import { parseMonthYear } from "@/features/resume-editor/domain/month-year";
import { commaJoin, compactJoin } from "@/features/resume-editor/preview/helpers/string";
import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { richTextHasContent } from "@/features/resume-editor/preview/rich-text-utils";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";

/** The 年 / 月 columns. Anything the month picker never produced ("current", a
 * hand-typed date) leaves them blank rather than guessing. */
function yearMonth(value?: string) {
  const parsed = parseMonthYear(value);
  if (!parsed) return { year: "", month: "" };
  return {
    year: String(parsed.getFullYear()),
    month: String(parsed.getMonth() + 1),
  };
}

/** One ruled line of the form. Content that wraps takes as many lines as it
 * needs and the shared line grid rules each of them — the row never grows a
 * half-height. */
function Row({ date, children }: { date?: string; children?: ReactNode }) {
  const { year, month } = yearMonth(date);
  return (
    <div className="rirekisho-row">
      <span className="rirekisho-year">{year}</span>
      <span className="rirekisho-month">{month}</span>
      <span className="rirekisho-cell">{children}</span>
    </div>
  );
}

/** A description takes ruled lines of its own — one per line it wraps to, and
 * none at all when there is nothing to say. */
function DescriptionRow({ content }: { content: string }) {
  if (!richTextHasContent(content)) return null;
  return (
    <Row>
      <PreviewRichTextBlock content={content} />
    </Row>
  );
}

const isOngoing = (endDate?: string) => !endDate || endDate === "current";

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <Row date={item.startDate}>
        {compactJoin([item.companyName || item.position, "入社"])}
      </Row>
      {item.companyName && item.position ? (
        <Row>{compactJoin([item.location, item.position])}</Row>
      ) : null}
      <DescriptionRow content={item.description} />
      {isOngoing(item.endDate) ? (
        <Row>現在に至る</Row>
      ) : (
        <Row date={item.endDate}>一身上の都合により退職</Row>
      )}
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
      <Row date={item.startDate}>
        {compactJoin([item.organizationName || item.position, "入会"])}
      </Row>
      {item.organizationName && item.position ? (
        <Row>{item.position}</Row>
      ) : null}
      <DescriptionRow content={item.description} />
      {isOngoing(item.endDate) ? null : <Row date={item.endDate}>退会</Row>}
    </div>
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  const school = item.name || item.degree;
  return (
    <div className="item">
      <Row date={item.startDate}>
        {compactJoin([school, item.name ? item.degree : "", "入学"])}
      </Row>
      {isOngoing(item.endDate) ? (
        <Row>在学中</Row>
      ) : (
        <Row date={item.endDate}>
          {compactJoin([school, item.name ? item.degree : "", "卒業"])}
        </Row>
      )}
      <DescriptionRow content={item.description} />
    </div>
  );
}

function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  return (
    <div className="item">
      <Row date={item.issuedDate}>
        <PreviewLinkedTitle
          title={item.certificationName}
          link={item.certificationLink}
        />
        {item.issuingOrganization ? `（${item.issuingOrganization}）` : null}
        {" 取得"}
      </Row>
    </div>
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item">
      <Row>{compactJoin([item.language, item.proficiency])}</Row>
    </div>
  );
}

/** Skills sit in the 志望動機・特技 box, which is prose — not a ruled table. */
function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item rirekisho-prose">
      {compactJoin([
        item.categoryName ? `${item.categoryName}：` : "",
        commaJoin(item.skills),
      ])}
    </div>
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <div className="item">
      <Row date={item.startDate}>
        <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
      </Row>
      <DescriptionRow content={item.description} />
    </div>
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <div className="item">
      <Row date={item.publicationDate}>
        <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
        {item.publisher ? `（${item.publisher}）` : null}
      </Row>
      <DescriptionRow content={item.description} />
    </div>
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <div className="item">
      <Row date={item.issuedDate}>
        {compactJoin([item.issuer, item.title])}
      </Row>
      <DescriptionRow content={item.description} />
    </div>
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item">
      <Row>{compactJoin([item.name, item.background])}</Row>
      {item.contactDetails ? <Row>{item.contactDetails}</Row> : null}
    </div>
  );
}

export const rirekishoItemViews: LayoutSectionItemMap = {
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
