import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

const editablePanelKeys = [
  "profile",
  "summary",
  "workExperience",
  "skills",
  "projects",
  "education",
  "publications",
  "certifications",
  "awards",
  "languages",
  "references",
  "organizationVolunteering",
] as const;

export type EditorPanelKey = (typeof editablePanelKeys)[number];
export const resumeSectionKeys = editablePanelKeys.filter(
  (panelKey) => panelKey !== "profile",
) as Exclude<EditorPanelKey, "profile">[];
export type ResumeSectionPanelKey = (typeof resumeSectionKeys)[number];

export const collectionSectionKeys = [
  "workExperience",
  "skills",
  "projects",
  "education",
  "publications",
  "certifications",
  "awards",
  "languages",
  "references",
  "organizationVolunteering",
] as const;

export type CollectionSectionKey = (typeof collectionSectionKeys)[number];

export const sectionLabels: Record<
  Exclude<EditorPanelKey, "profile">,
  string
> = {
  summary: "Summary",
  workExperience: "Work Experience",
  skills: "Skills",
  projects: "Projects",
  education: "Education",
  publications: "Publications",
  certifications: "Certifications",
  awards: "Awards",
  languages: "Languages",
  references: "References",
  organizationVolunteering: "Organizations & Volunteering",
};

/** Single read path for a section heading: the user's title if set, else the built-in
 *  label — clearing the rename field resets to the default. */
export function sectionTitleFor(
  sections: ResumeDraft["sections"],
  sectionKey: ResumeSectionPanelKey,
) {
  return sections[sectionKey].title?.trim() || sectionLabels[sectionKey];
}

export const languageProficiencyOptions = [
  "Elementary proficiency",
  "Limited working proficiency",
  "Professional working proficiency",
  "Full professional proficiency",
  "Native or bilingual proficiency",
];

export function isCollectionSectionKey(
  sectionKey: ResumeSectionPanelKey,
): sectionKey is CollectionSectionKey {
  return collectionSectionKeys.includes(sectionKey as CollectionSectionKey);
}

/** A hidden collection section must be revealed before editing, or the form edits
 *  something the paper can't show. Shared by desktop and mobile panel entry points. */
export function needsSectionReveal(
  sections: ResumeDraft["sections"],
  panel: EditorPanelKey,
): panel is CollectionSectionKey {
  return (
    panel !== "profile" &&
    isCollectionSectionKey(panel as ResumeSectionPanelKey) &&
    !sections[panel].visible
  );
}

export function getOrderedSectionKeys(sections: ResumeDraft["sections"]) {
  return [...resumeSectionKeys].sort(
    (left, right) => sections[left].order - sections[right].order,
  );
}

export function getOrderedVisibleSectionKeys(
  sections: ResumeDraft["sections"],
) {
  return getOrderedSectionKeys(sections).filter(
    (sectionKey) => sections[sectionKey].visible,
  );
}

/** Splits ordered collection sections into visible (drag-sortable) keys and hidden
 *  keys for the "Add section" menu. Shared by desktop and mobile section lists. */
export function partitionCollectionKeys(sections: ResumeDraft["sections"]) {
  const ordered = getOrderedSectionKeys(sections);
  const sortableKeys = ordered.filter(
    (key): key is CollectionSectionKey =>
      isCollectionSectionKey(key) && sections[key].visible,
  );
  const hiddenKeys = ordered.filter(
    (key): key is CollectionSectionKey =>
      isCollectionSectionKey(key) && !sections[key].visible,
  );
  return { sortableKeys, hiddenKeys };
}
