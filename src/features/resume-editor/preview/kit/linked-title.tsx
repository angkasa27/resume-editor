import { ArrowUpRight } from "lucide-react";

import {
  sanitizeRichTextHref,
  shouldOpenHrefInNewTab,
} from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

export function PreviewLinkedTitle({
  title,
  link,
}: {
  title: string;
  link?: string;
}) {
  const safeHref = link ? sanitizeRichTextHref(link) : null;

  if (!safeHref) {
    return <span>{title}</span>;
  }

  return (
    <a
      href={safeHref}
      target={shouldOpenHrefInNewTab(safeHref) ? "_blank" : undefined}
      rel={shouldOpenHrefInNewTab(safeHref) ? "noopener noreferrer" : undefined}
    >
      {title}
      {/* Always emitted, hidden by CSS: item views only receive `{ item }`, so the
          layout's choice can't reach here as a prop. */}
      <ArrowUpRight className="link-marker" aria-hidden={true} />
    </a>
  );
}
