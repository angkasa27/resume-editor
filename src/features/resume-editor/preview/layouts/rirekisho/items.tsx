import type { ReactNode } from "react";

import { parseMonthYear } from "@/features/resume-editor/domain/month-year";
import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { richTextHasContent } from "@/features/resume-editor/preview/rich-text-utils";
import { commaJoin, compactJoin } from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";

/** The 年 / 月 columns. Anything the month picker never produced ("current", a
 * hand-typed date) leaves them blank rather than guessing a number. */
function yearMonth(value?: string) {
  const parsed = parseMonthYear(value);
  if (!parsed) return { year: "", month: "" };
  return {
    year: String(parsed.getFullYear()),
    month: String(parsed.getMonth() + 1),
  };
}

/** One ruled line of the form: year, month, then the entry itself. */
function Row({ date, children }: { date?: string; children: ReactNode }) {
  const { year, month } = yearMonth(date);
  return (
    <div className="rirekisho-row">
      <span className="rirekisho-year">{year}</span>
      <span className="rirekisho-month">{month}</span>
      <span className="rirekisho-body">{children}</span>
    </div>
  );
}

/** A description takes a ruled line of its own — but only when there is one to
 * draw, or every item would trail an empty rule. */
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
        <Row>
          <span className="rirekisho-role">{item.position}</span>
        </Row>
      ) : null}
      <DescriptionRow content={item.description} />
      {isOngoing(item.endDate) ? (
        <Row>現在に至る</Row>
      ) : (
        <Row date={item.endDate}>退職</Row>
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
        <Row>
          <span className="rirekisho-role">{item.position}</span>
        </Row>
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
        <Row date={item.endDate}>{compactJoin([school, "卒業"])}</Row>
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

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <div className="item">
      <Row date={item.issuedDate}>{compactJoin([item.issuer, item.title])}</Row>
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

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <Row>
        {compactJoin([
          item.categoryName ? `${item.categoryName}：` : "",
          commaJoin(item.skills),
        ])}
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
