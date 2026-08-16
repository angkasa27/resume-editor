import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";

// Byte-identity guard substituting for a screenshot diff; every section is
// forced visible so each itemView is exercised.
function buildFixtureDraft(layoutId: ResumeDraft["pdfPresentation"]["layoutId"]): ResumeDraft {
  const draft = createDefaultResumeDraft();
  draft.updatedAt = "2026-01-01T00:00:00.000Z"; // deterministic, not rendered
  draft.sections.publications.visible = true;
  draft.sections.awards.visible = true;
  draft.pdfPresentation = { ...draft.pdfPresentation, layoutId };
  return draft;
}

// Icon path data is noise: the retained `class="lucide lucide-*"` already proves the right icon
// landed. Collapsing it stops a lucide version bump from rewriting every snapshot.
function collapseIconPaths(html: string): string {
  return html.replace(/(<svg\b[^>]*>).*?<\/svg>/g, "$1</svg>");
}

describe("resume document render snapshots", () => {
  for (const layoutId of pdfLayoutIds) {
    it(`renders the ${layoutId} layout identically`, () => {
      const html = renderToStaticMarkup(
        <ResumeDocument draft={buildFixtureDraft(layoutId)} mode="preview" />,
      );
      expect(collapseIconPaths(html)).toMatchSnapshot();
    });
  }
});
