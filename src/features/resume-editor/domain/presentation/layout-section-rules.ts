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
  type?: "text" | "date" | "textarea";
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
    // The form's own words, and the regions the layout files them under:
    // 学歴 and 職歴 head the history table, certifications and languages share
    // the 免許・資格 table, summary and skills share the 特技・自己PR box.
    sectionTitles: {
      summary: "志望動機",
      education: "学歴",
      workExperience: "職歴",
      certifications: "免許・資格",
      skills: "特技",
      languages: "語学",
    },
    extraFields: {
      label: "Rirekisho details",
      description:
        "The boxes the 履歴書 form prints that a résumé has no field for. Every one is optional; blank prints an empty box, exactly like the paper form.",
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
        { key: "homePhone", label: "Home phone (自宅電話)" },
        {
          key: "addressReading",
          label: "Address reading (ふりがな)",
          fullWidth: true,
        },
        {
          key: "contactAddress",
          label: "Second address (連絡先)",
          placeholder: "同上",
          fullWidth: true,
        },
        {
          key: "contactAddressReading",
          label: "Second address reading (ふりがな)",
        },
        { key: "contactPhone", label: "Second phone (連絡先電話)" },
        { key: "commuteTime", label: "Commute (通勤時間)", placeholder: "約45分" },
        {
          key: "dependents",
          label: "Dependents (扶養家族数)",
          placeholder: "0",
        },
        { key: "spouse", label: "Spouse (配偶者)", placeholder: "有 / 無" },
        {
          key: "spouseSupport",
          label: "Supporting a spouse (配偶者の扶養義務)",
          placeholder: "有 / 無",
        },
        {
          key: "requests",
          label: "Requests to the employer (本人希望記入欄)",
          placeholder: "貴社規定に従います。",
          type: "textarea",
          fullWidth: true,
        },
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
