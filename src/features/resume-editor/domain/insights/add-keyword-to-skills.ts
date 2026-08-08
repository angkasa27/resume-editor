import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SkillsSection = ResumeDraft["sections"]["skills"];

/**
 * Appends a job-description term to a skills category.
 *
 * Most missing keywords are hard skills or tools, and putting one on the resume
 * is a list append — no model required. Only weaving a term into an
 * accomplishment bullet actually needs generation.
 *
 * Returns the section unchanged when the term is already present (compared
 * case- and whitespace-insensitively across every category, so "Node.js" isn't
 * added a second time next to "node.js"), which keeps the caller's commit a
 * no-op rather than pushing an empty entry onto the undo stack.
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

  // Fall back to the first category when the requested one is gone (or none was
  // asked for) — every collection section is guaranteed at least one row.
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
