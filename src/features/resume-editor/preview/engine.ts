import {
  getOrderedVisibleSectionKeys,
  isCollectionSectionKey,
  sectionTitleFor,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { isSectionHiddenByLayout } from "@/features/resume-editor/domain/presentation/layout-section-rules";
import {
  resolvePdfPresentation,
  type PdfLayoutId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { sanitizeRichTextHref } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { richTextHasContent } from "./rich-text-utils";
import { sectionDescriptors } from "./descriptors";
import type {
  AnyPreviewRenderableSection,
  PreviewMode,
  PreviewRenderContext,
  PreviewSectionItemMap,
} from "./types";

function createContactItems(draft: ResumeDraft) {
  return [
    { kind: "location" as const, value: draft.profile.location },
    { kind: "phone" as const, value: draft.profile.phone },
    { kind: "email" as const, value: draft.profile.email },
    ...draft.profile.extraLinks
      .map((link) => sanitizeRichTextHref(link.url))
      .filter((value): value is string => Boolean(value))
      .map((value) => ({ kind: "link" as const, value })),
  ].filter((item) => Boolean(item.value));
}

function buildRenderableSection<K extends CollectionSectionKey>(
  sectionKey: K,
  draft: ResumeDraft,
  layoutId: PdfLayoutId,
): AnyPreviewRenderableSection | null {
  const descriptor = sectionDescriptors[sectionKey];
  const items = (draft.sections[sectionKey].items as PreviewSectionItemMap[K][]).filter(
    (item) => descriptor.hasContent(item as never),
  );
  if (items.length === 0) return null;

  // label (the click-to-edit target's name) and heading (what prints) come from
  // one resolver — two sources is what let them drift apart before.
  const title = sectionTitleFor(draft.sections, sectionKey, layoutId);

  return {
    key: sectionKey,
    label: title,
    heading: title,
    items,
  } as AnyPreviewRenderableSection;
}

function createRenderableSections(
  draft: ResumeDraft,
  layoutId: PdfLayoutId,
): AnyPreviewRenderableSection[] {
  const out: AnyPreviewRenderableSection[] = [];
  for (const sectionKey of getOrderedVisibleSectionKeys(draft.sections)) {
    if (!isCollectionSectionKey(sectionKey)) continue;
    // The format has no place for it; the editor says so on the section's row.
    if (isSectionHiddenByLayout(layoutId, sectionKey)) continue;
    const section = buildRenderableSection(sectionKey, draft, layoutId);
    if (section) out.push(section);
  }
  return out;
}

export function createPreviewRenderContext(
  draft: ResumeDraft,
  mode: PreviewMode,
): PreviewRenderContext {
  const presentation = resolvePdfPresentation(draft.pdfPresentation);
  const summaryHidden = isSectionHiddenByLayout(presentation.layoutId, "summary");

  return {
    draft,
    mode,
    presentation,
    contactItems: createContactItems(draft),
    summaryContent:
      !summaryHidden && richTextHasContent(draft.sections.summary.content)
        ? draft.sections.summary.content
        : null,
    sections: createRenderableSections(draft, presentation.layoutId),
  };
}
