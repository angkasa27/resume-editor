import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { createLocalId } from "@/features/resume-editor/domain/create-local-id";
import {
  languageProficiencyOptions,
  resumeSectionKeys,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import {
  parseResumeDraft,
  type AwardItem,
  type CertificationItem,
  type EducationItem,
  type LanguageItem,
  type OrganizationItem,
  type ProjectItem,
  type PublicationItem,
  type ReferenceItem,
  type ResumeDraft,
  type SkillCategoryItem,
  type WorkExperienceItem,
} from "@/features/resume-editor/domain/schema";
import {
  sanitizeRichTextHtml,
  sanitizeRichTextHref,
} from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";
import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import type { ImportedResume } from "@/features/resume-editor/server/imported-resume-schema";

type BuildImportedResumeDraftResult = {
  draft: ResumeDraft;
  warnings: string[];
};

// Imported proficiency strings outside the fixed taxonomy would render blank in
// the exact-match Select; fall back to the section's valid default instead.
const defaultLanguageProficiency = (
  collectionSectionConfigs.languages.createItem() as { proficiency: string }
).proficiency;

const monthMap: Record<string, string> = {
  january: "Jan",
  jan: "Jan",
  february: "Feb",
  feb: "Feb",
  march: "Mar",
  mar: "Mar",
  april: "Apr",
  apr: "Apr",
  may: "May",
  june: "Jun",
  jun: "Jun",
  july: "Jul",
  jul: "Jul",
  august: "Aug",
  aug: "Aug",
  september: "Sep",
  sep: "Sep",
  sept: "Sep",
  october: "Oct",
  oct: "Oct",
  november: "Nov",
  nov: "Nov",
  december: "Dec",
  dec: "Dec",
};

function cleanText(value: string | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toRichTextParagraphs(values: string[]) {
  const cleanedValues = values.map(cleanText).filter(Boolean);

  if (cleanedValues.length === 0) {
    return "<p></p>";
  }

  return sanitizeRichTextHtml(
    cleanedValues.map((value) => `<p>${escapeHtml(value)}</p>`).join(""),
  );
}

function toRichTextBullets(values: string[]) {
  const cleanedValues = values.map(cleanText).filter(Boolean);

  if (cleanedValues.length === 0) {
    return "<p></p>";
  }

  return sanitizeRichTextHtml(
    `<ul>${cleanedValues.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>`,
  );
}

function normalizeUrl(value: string) {
  const cleanedValue = cleanText(value);

  if (!cleanedValue) {
    return "";
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(cleanedValue)
    ? cleanedValue
    : `https://${cleanedValue.replace(/^\/+/, "")}`;

  return sanitizeRichTextHref(withProtocol) ?? "";
}

// monthMap has two keys per month, so Object.values repeats abbreviations;
// dedupe once to get a calendar-ordered lookup from month number (1-12).
const orderedMonthAbbreviations = [...new Set(Object.values(monthMap))];

function monthNumberToAbbreviation(monthNumber: number) {
  return orderedMonthAbbreviations[monthNumber - 1];
}

function matchCurrentDate(cleanedValue: string, allowCurrent: boolean) {
  if (allowCurrent && /^(current|present|now|ongoing)$/i.test(cleanedValue)) {
    return "current";
  }

  return null;
}

function matchMonthYearDate(cleanedValue: string) {
  const monthYearMatch = cleanedValue.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (!monthYearMatch) {
    return null;
  }

  const month = monthMap[monthYearMatch[1].toLowerCase()];
  return month ? `${month} ${monthYearMatch[2]}` : null;
}

function matchNumericDate(
  cleanedValue: string,
  pattern: RegExp,
  monthGroup: 1 | 2,
  yearGroup: 1 | 2,
) {
  const match = cleanedValue.match(pattern);
  if (!match) {
    return null;
  }

  const month = monthNumberToAbbreviation(Number(match[monthGroup]));
  return month ? `${month} ${match[yearGroup]}` : null;
}

function normalizeDateValue(
  value: string,
  label: string,
  warnings: string[],
  allowCurrent = false,
) {
  const cleanedValue = cleanText(value);

  if (!cleanedValue) {
    return "";
  }

  const normalizedValue =
    matchCurrentDate(cleanedValue, allowCurrent) ??
    matchMonthYearDate(cleanedValue) ??
    matchNumericDate(cleanedValue, /^(\d{1,2})[/-](\d{4})$/, 1, 2) ??
    matchNumericDate(cleanedValue, /^(\d{4})[/-](\d{1,2})$/, 2, 1);

  if (normalizedValue) {
    return normalizedValue;
  }

  warnings.push(`${label} used an unsupported date format and was left blank.`);
  return "";
}

function buildHiddenSection<K extends CollectionSectionKey>(sectionKey: K) {
  return {
    visible: false,
    order: resumeSectionKeys.indexOf(sectionKey),
    items: [collectionSectionConfigs[sectionKey].createItem()],
  } as ResumeDraft["sections"][K];
}

function dedupe(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function buildCollectionSection<K extends CollectionSectionKey, TItem>(
  sectionKey: K,
  items: TItem[],
) {
  return {
    visible: true,
    order: resumeSectionKeys.indexOf(sectionKey),
    items,
  };
}

function buildProfileSection(
  profile: ImportedResume["profile"],
): ResumeDraft["profile"] {
  return {
    fullName: cleanText(profile.fullName),
    headline: cleanText(profile.headline),
    location: cleanText(profile.location),
    phone: cleanText(profile.phone),
    email: cleanText(profile.email),
    photo: "",
    extraLinks: dedupe(
      profile.extraLinks.map(normalizeUrl),
    ).map((url) => ({
      id: createLocalId("profile-link"),
      url,
    })),
  };
}

function buildSummarySection(
  summary: ImportedResume["summary"],
): ResumeDraft["sections"]["summary"] {
  return {
    visible: summary.some((paragraph) => cleanText(paragraph)),
    order: resumeSectionKeys.indexOf("summary"),
    content: toRichTextParagraphs(summary),
  };
}

function mapWorkExperienceItem(
  item: ImportedResume["workExperience"][number],
  warnings: string[],
): WorkExperienceItem {
  return {
    id: createLocalId("work-experience"),
    companyName: cleanText(item.companyName),
    position: cleanText(item.position),
    location: cleanText(item.location),
    startDate: normalizeDateValue(
      item.startDate,
      `Work experience start date for ${item.companyName || item.position || "an entry"}`,
      warnings,
    ),
    endDate: normalizeDateValue(
      item.endDate,
      `Work experience end date for ${item.companyName || item.position || "an entry"}`,
      warnings,
      true,
    ),
    description: toRichTextBullets(item.highlights),
  };
}

function buildWorkExperienceSection(
  items: ImportedResume["workExperience"],
  warnings: string[],
): ResumeDraft["sections"]["workExperience"] {
  return items.length
    ? buildCollectionSection(
        "workExperience",
        items.map((item) => mapWorkExperienceItem(item, warnings)),
      )
    : buildHiddenSection("workExperience");
}

function mapSkillCategoryItem(
  item: ImportedResume["skills"][number],
): SkillCategoryItem {
  return {
    id: createLocalId("skill-category"),
    categoryName: cleanText(item.categoryName),
    skills: dedupe(item.skills.map(cleanText)),
  };
}

function buildSkillsSection(
  items: ImportedResume["skills"],
): ResumeDraft["sections"]["skills"] {
  return items.length
    ? buildCollectionSection(
        "skills",
        items.map(mapSkillCategoryItem),
      )
    : buildHiddenSection("skills");
}

function mapProjectItem(
  item: ImportedResume["projects"][number],
  warnings: string[],
): ProjectItem {
  return {
    id: createLocalId("project"),
    projectName: cleanText(item.projectName),
    projectLink: normalizeUrl(item.projectLink),
    startDate: normalizeDateValue(
      item.startDate,
      `Project start date for ${item.projectName || "an entry"}`,
      warnings,
    ),
    endDate: normalizeDateValue(
      item.endDate,
      `Project end date for ${item.projectName || "an entry"}`,
      warnings,
      true,
    ),
    description: toRichTextBullets(item.highlights),
  };
}

function buildProjectsSection(
  items: ImportedResume["projects"],
  warnings: string[],
): ResumeDraft["sections"]["projects"] {
  return items.length
    ? buildCollectionSection(
        "projects",
        items.map((item) => mapProjectItem(item, warnings)),
      )
    : buildHiddenSection("projects");
}

function mapEducationItem(
  item: ImportedResume["education"][number],
  warnings: string[],
): EducationItem {
  return {
    id: createLocalId("education"),
    name: cleanText(item.name),
    location: cleanText(item.location),
    startDate: normalizeDateValue(
      item.startDate,
      `Education start date for ${item.name || "an entry"}`,
      warnings,
    ),
    endDate: normalizeDateValue(
      item.endDate,
      `Education end date for ${item.name || "an entry"}`,
      warnings,
      true,
    ),
    degree: cleanText(item.degree),
    gpa: cleanText(item.gpa),
    description: toRichTextBullets(item.highlights),
  };
}

function buildEducationSection(
  items: ImportedResume["education"],
  warnings: string[],
): ResumeDraft["sections"]["education"] {
  return items.length
    ? buildCollectionSection(
        "education",
        items.map((item) => mapEducationItem(item, warnings)),
      )
    : buildHiddenSection("education");
}

function mapPublicationItem(
  item: ImportedResume["publications"][number],
  warnings: string[],
): PublicationItem {
  return {
    id: createLocalId("publication"),
    title: cleanText(item.title),
    publisher: cleanText(item.publisher),
    publicationUrl: normalizeUrl(item.publicationUrl),
    publicationDate: normalizeDateValue(
      item.publicationDate,
      `Publication date for ${item.title || "an entry"}`,
      warnings,
    ),
    description: toRichTextBullets(item.highlights),
  };
}

function buildPublicationsSection(
  items: ImportedResume["publications"],
  warnings: string[],
): ResumeDraft["sections"]["publications"] {
  return items.length
    ? buildCollectionSection(
        "publications",
        items.map((item) => mapPublicationItem(item, warnings)),
      )
    : buildHiddenSection("publications");
}

function mapCertificationItem(
  item: ImportedResume["certifications"][number],
  warnings: string[],
): CertificationItem {
  return {
    id: createLocalId("certification"),
    certificationName: cleanText(item.certificationName),
    issuingOrganization: cleanText(item.issuingOrganization),
    issuedDate: normalizeDateValue(
      item.issuedDate,
      `Certification date for ${item.certificationName || "an entry"}`,
      warnings,
    ),
    certificationLink: normalizeUrl(item.certificationLink),
    credentialId: cleanText(item.credentialId),
  };
}

function buildCertificationsSection(
  items: ImportedResume["certifications"],
  warnings: string[],
): ResumeDraft["sections"]["certifications"] {
  return items.length
    ? buildCollectionSection(
        "certifications",
        items.map((item) => mapCertificationItem(item, warnings)),
      )
    : buildHiddenSection("certifications");
}

function mapAwardItem(
  item: ImportedResume["awards"][number],
  warnings: string[],
): AwardItem {
  return {
    id: createLocalId("award"),
    title: cleanText(item.title),
    issuer: cleanText(item.issuer),
    issuedDate: normalizeDateValue(
      item.issuedDate,
      `Award date for ${item.title || "an entry"}`,
      warnings,
    ),
    description: toRichTextBullets(item.highlights),
  };
}

function buildAwardsSection(
  items: ImportedResume["awards"],
  warnings: string[],
): ResumeDraft["sections"]["awards"] {
  return items.length
    ? buildCollectionSection(
        "awards",
        items.map((item) => mapAwardItem(item, warnings)),
      )
    : buildHiddenSection("awards");
}

function mapLanguageItem(item: ImportedResume["languages"][number]): LanguageItem {
  const proficiency = cleanText(item.proficiency);
  return {
    id: createLocalId("language"),
    language: cleanText(item.language),
    proficiency: languageProficiencyOptions.includes(proficiency)
      ? proficiency
      : defaultLanguageProficiency,
  };
}

function buildLanguagesSection(
  items: ImportedResume["languages"],
): ResumeDraft["sections"]["languages"] {
  return items.length
    ? buildCollectionSection("languages", items.map(mapLanguageItem))
    : buildHiddenSection("languages");
}

function mapReferenceItem(
  item: ImportedResume["references"][number],
): ReferenceItem {
  return {
    id: createLocalId("reference"),
    name: cleanText(item.name),
    background: cleanText(item.background),
    contactDetails: cleanText(item.contactDetails),
  };
}

function buildReferencesSection(
  items: ImportedResume["references"],
): ResumeDraft["sections"]["references"] {
  return items.length
    ? buildCollectionSection("references", items.map(mapReferenceItem))
    : buildHiddenSection("references");
}

function mapOrganizationItem(
  item: ImportedResume["organizationVolunteering"][number],
  warnings: string[],
): OrganizationItem {
  return {
    id: createLocalId("organization"),
    organizationName: cleanText(item.organizationName),
    position: cleanText(item.position),
    location: cleanText(item.location),
    startDate: normalizeDateValue(
      item.startDate,
      `Organization start date for ${item.organizationName || "an entry"}`,
      warnings,
    ),
    endDate: normalizeDateValue(
      item.endDate,
      `Organization end date for ${item.organizationName || "an entry"}`,
      warnings,
      true,
    ),
    description: toRichTextBullets(item.highlights),
  };
}

function buildOrganizationVolunteeringSection(
  items: ImportedResume["organizationVolunteering"],
  warnings: string[],
): ResumeDraft["sections"]["organizationVolunteering"] {
  return items.length
    ? buildCollectionSection(
        "organizationVolunteering",
        items.map((item) => mapOrganizationItem(item, warnings)),
      )
    : buildHiddenSection("organizationVolunteering");
}

function buildSections(
  importedResume: ImportedResume,
  warnings: string[],
): ResumeDraft["sections"] {
  return {
    summary: buildSummarySection(importedResume.summary),
    workExperience: buildWorkExperienceSection(
      importedResume.workExperience,
      warnings,
    ),
    skills: buildSkillsSection(importedResume.skills),
    projects: buildProjectsSection(importedResume.projects, warnings),
    education: buildEducationSection(importedResume.education, warnings),
    publications: buildPublicationsSection(
      importedResume.publications,
      warnings,
    ),
    certifications: buildCertificationsSection(
      importedResume.certifications,
      warnings,
    ),
    awards: buildAwardsSection(importedResume.awards, warnings),
    languages: buildLanguagesSection(importedResume.languages),
    references: buildReferencesSection(importedResume.references),
    organizationVolunteering: buildOrganizationVolunteeringSection(
      importedResume.organizationVolunteering,
      warnings,
    ),
  };
}

export function buildImportedResumeDraft(
  importedResume: ImportedResume,
): BuildImportedResumeDraftResult {
  const baseDraft = createDefaultResumeDraft();
  const warnings: string[] = [];

  const draft: ResumeDraft = {
    ...baseDraft,
    updatedAt: new Date().toISOString(),
    profile: buildProfileSection(importedResume.profile),
    sections: buildSections(importedResume, warnings),
  };

  return {
    draft: parseResumeDraft(draft),
    warnings: dedupe(warnings),
  };
}
