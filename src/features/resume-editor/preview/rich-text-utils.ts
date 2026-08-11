import { stripRichText } from "@/features/resume-editor/domain/insights/extract-text";
import {
  sanitizeRichTextHtml,
} from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

export function renderHtml(content: string) {
  return { __html: sanitizeRichTextHtml(content) };
}

/** Gates whether a description renders at all, so it must strip exactly like
 *  the insights extractor — one stripper, not two that can drift. */
export function richTextHasContent(value: string) {
  return stripRichText(value).length > 0;
}
