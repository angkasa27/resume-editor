import { layoutSectionTitle } from "@/features/resume-editor/domain/presentation/layout-section-rules";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
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

/** Single read path for a section heading: the layout's fixed title if it has one,
 *  else the user's, else the built-in label — clearing the rename field resets to
 *  the default. `layoutId` is optional only so a caller with no presentation in
 *  hand still resolves; pass it wherever the paper's own title is what's wanted. */
export function sectionTitleFor(
  sections: ResumeDraft["sections"],
  sectionKey: ResumeSectionPanelKey,
  layoutId?: PdfLayoutId,
) {
  const pinned = layoutId ? layoutSectionTitle(layoutId, sectionKey) : undefined;
  return pinned ?? (sections[sectionKey].title?.trim() || sectionLabels[sectionKey]);
}

/** What the editor's section rows and drill-in header show. Where a layout fixes
 *  the heading, the fixed title leads and the section's own name follows in
 *  parentheses — "学歴 (Education)" — so the list stays scannable to someone who
 *  does not read the script the paper prints in. The paper itself gets
 *  `sectionTitleFor`: only the fixed title belongs on the page. */
export function sectionRowLabelFor(
  sections: ResumeDraft["sections"],
  sectionKey: ResumeSectionPanelKey,
  layoutId?: PdfLayoutId,
) {
  const own = sections[sectionKey].title?.trim() || sectionLabels[sectionKey];
  const pinned = layoutId ? layoutSectionTitle(layoutId, sectionKey) : undefined;
  return pinned && pinned !== own ? `${pinned} (${own})` : own;
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
  // Wider than `EditorPanelKey`: the editor has panels (the layout-declared
  // extras block) that are not sections at all, and they simply answer false.
  panel: EditorPanelKey | (string & {}),
): panel is CollectionSectionKey {
  return (
    panel !== "profile" &&
    isCollectionSectionKey(panel as ResumeSectionPanelKey) &&
    !sections[panel as CollectionSectionKey].visible
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
