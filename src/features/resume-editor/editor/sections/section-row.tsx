"use client";

import type { ReactNode } from "react";
import { TriangleAlertIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EditorRow } from "@/features/resume-editor/editor/sections/editor-row";
import { SectionIcon } from "@/features/resume-editor/editor/shared/section-icons";
import type {
  CollectionSectionKey,
  EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";

type SectionRowProps = {
  sectionKey: EditorPanelKey | CollectionSectionKey | "extras";
  label: string;
  active?: boolean;
  onClick: () => void;
  /** Drag-handle slot (collection rows only). */
  leading?: ReactNode;
  /** Glanceable item count (collection rows only). */
  count?: number;
  /** Nav chevron. */
  trailing?: ReactNode;
  /** The row's "⋯" menu. */
  menu?: ReactNode;
  /** Why this section will not print — e.g. the layout has no place for it. */
  notice?: string;
  className?: string;
};

/** A section row in the list — the same `EditorRow` the item rows use, different slots. */
export function SectionRow({
  sectionKey,
  label,
  active = false,
  onClick,
  leading,
  count,
  trailing,
  menu,
  notice,
  className,
}: SectionRowProps) {
  return (
    <EditorRow
      handle={leading}
      leading={<SectionIcon sectionKey={sectionKey} />}
      title={label}
      badge={
        count !== undefined || notice ? (
          <>
            {count !== undefined ? (
              <Badge
                variant="outline"
                className="shrink-0 bg-background text-xs!"
              >
                {count} item{count === 1 ? "" : "s"}
              </Badge>
            ) : null}
            {notice ? (
              <Badge variant="warning" className="shrink-0 text-xs!">
                <TriangleAlertIcon data-icon="inline-start" />
                {notice}
              </Badge>
            ) : null}
          </>
        ) : undefined
      }
      indicator={trailing}
      menu={menu}
      active={active}
      onActivate={onClick}
      className={className}
    />
  );
}
