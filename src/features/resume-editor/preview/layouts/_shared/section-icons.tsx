import {
  AwardIcon,
  BookOpenIcon,
  BriefcaseIcon,
  FolderGitIcon,
  GraduationCapIcon,
  HandHeartIcon,
  LanguagesIcon,
  QuoteIcon,
  ScrollTextIcon,
  SparklesIcon,
  UserRoundCheckIcon,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";

const ICON_BY_SECTION: Record<
  CollectionSectionKey | "summary",
  LucideIcon
> = {
  summary: UserRoundCheckIcon,
  workExperience: BriefcaseIcon,
  skills: SparklesIcon,
  projects: FolderGitIcon,
  education: GraduationCapIcon,
  publications: BookOpenIcon,
  certifications: ScrollTextIcon,
  awards: AwardIcon,
  languages: LanguagesIcon,
  references: QuoteIcon,
  organizationVolunteering: HandHeartIcon,
};

/** Renamed sections keep their icon: the key is stable, the title is not.
 * Shared by studio and compass — same markup, different CSS. */
export function renderIconSectionHeading(
  sectionKey: CollectionSectionKey | "summary",
  heading: ReactNode,
): ReactNode {
  const Icon = ICON_BY_SECTION[sectionKey];
  return (
    <>
      <span className="section-icon" aria-hidden={true}>
        <Icon />
      </span>
      <span>{heading}</span>
    </>
  );
}
