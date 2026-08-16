import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SkillsSection = ResumeDraft["sections"]["skills"];

/**
 * Appends a job-description term to a skills category — a list append, no model needed.
 * Returns the section unchanged when the term is already present (case/whitespace-insensitive).
 */
export function addKeywordToSkills(
  section: SkillsSection,
  term: string,
  categoryId?: string,
): SkillsSection {
  const trimmed = term.trim();
  if (!trimmed) return section;

  const normalized = trimmed.toLowerCase();
  const alreadyPresent = section.items.some((item) =>
    item.skills.some((skill) => skill.trim().toLowerCase() === normalized),
  );
  if (alreadyPresent) return section;

  // Fall back to the first category when the requested one is gone or unspecified.
  const targetIndex = categoryId
    ? section.items.findIndex((item) => item.id === categoryId)
    : 0;
  const index = targetIndex === -1 ? 0 : targetIndex;
  if (!section.items[index]) return section;

  return {
    ...section,
    items: section.items.map((item, i) =>
      i === index ? { ...item, skills: [...item.skills, trimmed] } : item,
    ),
  };
}
