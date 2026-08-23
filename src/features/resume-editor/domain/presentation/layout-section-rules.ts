import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeSectionPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";

/**
 * What a layout demands of the *document*, as opposed to how it paints one.
 *
 * Lives in the domain rather than on `PreviewLayoutDefinition` because the
 * editor sidebar and the section-title resolver both read it, and neither may
 * import the preview registry. Type-only imports here, so there is no runtime
 * cycle with `section-metadata`.
 *
 * Most layouts need none of this: a layout absent from the table below prints
 * every visible section under whatever title the user gave it.
 */
export type LayoutExtraField = {
  /** Key under `profile.extras`. */
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "date";
  autoComplete?: string;
  /** Spans both columns of the form grid. */
  fullWidth?: boolean;
};

export type LayoutExtraFieldGroup = {
  /** The sidebar row and the panel heading. */
  label: string;
  description: string;
  fields: ReadonlyArray<LayoutExtraField>;
};

type LayoutSectionRules = {
  /** Sections the format has no place for. Their content is kept, never printed. */
  hiddenSections?: ReadonlyArray<ResumeSectionPanelKey>;
  /** Titles the format fixes, overriding a rename (the rename control is disabled there). */
  sectionTitles?: Partial<Record<ResumeSectionPanelKey, string>>;
  /** Identity fields the layout prints that no other layout has a use for. */
  extraFields?: LayoutExtraFieldGroup;
};

const layoutSectionRules: Partial<Record<PdfLayoutId, LayoutSectionRules>> = {
  rirekisho: {
    // A 履歴書 carries education, work, licences and the motivation statement.
    // Projects, publications, awards, references and volunteering belong on the
    // companion 職務経歴書, so printing them here would not be the format.
    hiddenSections: [
      "projects",
      "publications",
      "awards",
      "references",
      "organizationVolunteering",
    ],
    // The form's labels are standard: a recruiter looks for these exact words.
    sectionTitles: {
      summary: "志望の動機",
      education: "学歴",
      workExperience: "職歴",
      certifications: "免許・資格",
      skills: "特技・スキル",
      languages: "語学",
    },
    extraFields: {
      label: "Rirekisho details",
      description:
        "Printed in the identity block of the 履歴書 form. Every field is optional.",
      fields: [
        {
          key: "nameReading",
          label: "Name reading (ふりがな)",
          fullWidth: true,
        },
        {
          key: "birthDate",
          label: "Date of birth (生年月日)",
          type: "date",
          autoComplete: "bday",
        },
        { key: "gender", label: "Gender (性別)", placeholder: "男 / 女" },
        {
          key: "postalCode",
          label: "Postal code (郵便番号)",
          placeholder: "123-4567",
          autoComplete: "postal-code",
        },
        { key: "addressReading", label: "Address reading (ふりがな)" },
      ],
    },
  },
};

/** The title this layout fixes for a section, or `undefined` when it fixes none. */
export function layoutSectionTitle(
  layoutId: PdfLayoutId,
  sectionKey: ResumeSectionPanelKey,
): string | undefined {
  return layoutSectionRules[layoutId]?.sectionTitles?.[sectionKey];
}

/** True when the layout pins every title, so renaming is a control that does nothing. */
export function layoutPinsSectionTitles(layoutId: PdfLayoutId): boolean {
  return layoutSectionRules[layoutId]?.sectionTitles !== undefined;
}

/** A section the layout never prints, however the user has it configured. */
export function isSectionHiddenByLayout(
  layoutId: PdfLayoutId,
  sectionKey: ResumeSectionPanelKey,
): boolean {
  return Boolean(
    layoutSectionRules[layoutId]?.hiddenSections?.includes(sectionKey),
  );
}

export function getLayoutExtraFields(
  layoutId: PdfLayoutId,
): LayoutExtraFieldGroup | null {
  return layoutSectionRules[layoutId]?.extraFields ?? null;
}
