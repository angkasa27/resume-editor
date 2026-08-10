import type { ReactNode } from "react";

import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";

export function SummaryView({
  content,
  heading,
  showHeading = true,
}: {
  content: string;
  heading: ReactNode;
  showHeading?: boolean;
}) {
  return (
    <section className="section" data-section="summary">
      {showHeading ? (
        <h2 className="section-heading" data-testid="resume-preview-section-heading">
          {heading}
        </h2>
      ) : null}
      <PreviewRichTextBlock content={content} />
    </section>
  );
}
