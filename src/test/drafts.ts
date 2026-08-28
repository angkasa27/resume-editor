/**
 * Draft fixtures shared by more than one test or e2e script. A fixture with a
 * single consumer belongs next to that consumer, not here.
 */
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

/**
 * A draft sized to span pages. `workCount` selects the shape:
 * `0` short (one page), `-1` one over-tall item, `-2` prose crossing a break,
 * `n > 0` that many work items.
 */
export function longDraft(layoutId: PdfLayoutId, workCount: number): ResumeDraft {
  const draft = createDefaultResumeDraft();
  const s = draft.sections;

  // workCount 0: the short-resume case — must export as exactly one page, no
  // blank trailing sheet. Sections are hidden, not emptied (schema needs ≥1 item).
  if (workCount === 0) {
    s.projects = { ...s.projects, visible: false };
    s.certifications = { ...s.certifications, visible: false };
    s.languages = { ...s.languages, visible: false };
    s.references = { ...s.references, visible: false };
    s.organizationVolunteering = {
      ...s.organizationVolunteering,
      visible: false,
    };
    s.awards = { ...s.awards, visible: false };
    s.workExperience = {
      ...s.workExperience,
      items: [s.workExperience.items[0]],
    };
    return { ...draft, pdfPresentation: { ...draft.pdfPresentation, layoutId } };
  }

  // workCount -1: one item taller than the usable page — allowed to fragment,
  // else break-inside: avoid moves it at print time (44 bullets is load-bearing).
  if (workCount === -1) {
    const bullets = Array.from(
      { length: 44 },
      (_, i) =>
        `<li>Bullet ${i + 1}: led a migration, cut load time, mentored engineers, and shipped a design system used across six squads.</li>`,
    ).join("");
    const one = s.workExperience.items[0];
    s.workExperience = {
      ...s.workExperience,
      items: [{ ...one, description: `<ul>${bullets}</ul>` }],
    };
    return {
      ...draft,
      pdfPresentation: { ...draft.pdfPresentation, layoutId },
    };
  }

  // workCount -2: a prose section (no .item) crossing a page — only the heading
  // and first lines must stay together, so the largest gap stays under a page.
  if (workCount === -2) {
    const sentence =
      "Software engineer with a decade of experience building resilient, accessible interfaces for enterprise teams. ";
    s.summary = { ...s.summary, content: `<p>${sentence.repeat(60)}</p>` };
    s.workExperience = {
      ...s.workExperience,
      items: [s.workExperience.items[0]],
    };
    return { ...draft, pdfPresentation: { ...draft.pdfPresentation, layoutId } };
  }

  const work = s.workExperience.items[0];
  s.workExperience = {
    ...s.workExperience,
    items: Array.from({ length: workCount }, (_, i) => ({
      ...work,
      id: `work-${i}`,
      companyName: `${work.companyName} ${i + 1}`,
    })),
  };
  const project = s.projects.items[0];
  s.projects = {
    ...s.projects,
    items: Array.from({ length: 4 }, (_, i) => ({
      ...project,
      id: `project-${i}`,
      projectName: `${project.projectName} ${i + 1}`,
    })),
  };
  return { ...draft, pdfPresentation: { ...draft.pdfPresentation, layoutId } };
}
