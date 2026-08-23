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
/** What the field *is*, not which glyph to draw — the form maps these to icons,
 *  so the domain stays free of components. */
export type LayoutExtraFieldIcon =
  | "reading"
  | "gender"
  | "postal"
  | "phone"
  | "address"
  | "time"
  | "people"
  | "spouse";

export type LayoutExtraField = {
  /** Key under `profile.extras`. */
  key: string;
  /** Carries the placeholder too, so every field reads "English (日本語)" — a
   *  sample value in one box and a label in the next is what made the pair of
   *  有 / 無 fields indistinguishable. */
  label: string;
  type?: "text" | "date" | "select" | "textarea";
  /** The answers, for `type: "select"`. A blank option is added for clearing. */
  options?: ReadonlyArray<string>;
  /** A leading glyph, where one reinforces scanning; the date picker draws its
   *  own calendar. */
  icon?: LayoutExtraFieldIcon;
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
        "The boxes the 履歴書 form prints that a resume has no field for. Every one is optional; blank prints an empty box, exactly like the paper form.",
      fields: [
        // The 履歴書's own boxes, in the order the sheet prints them. The
        // address, e-mail and mobile number are the Profile's — only what the
        // form asks for beyond a résumé is here.
        {
          key: "nameReading",
          label: "Name in kana (ふりがな)",
          icon: "reading",
          fullWidth: true,
        },
        {
          key: "birthDate",
          label: "Date of birth (生年月日)",
          type: "date",
          autoComplete: "bday",
        },
        {
          key: "gender",
          label: "Gender (性別)",
          type: "select",
          options: ["男", "女"],
          icon: "gender",
        },
        {
          key: "addressReading",
          label: "Address in kana (ふりがな)",
          icon: "reading",
          fullWidth: true,
        },
        {
          key: "postalCode",
          label: "Postal code (郵便番号)",
          icon: "postal",
          autoComplete: "postal-code",
        },
        { key: "homePhone", label: "Home phone (自宅電話)", icon: "phone" },
        // 連絡先 — the second address the form asks for, and only when post
        // should go somewhere other than 現住所 (a student's family home, say).
        {
          key: "contactAddressReading",
          label: "Contact address in kana (ふりがな)",
          icon: "reading",
          fullWidth: true,
        },
        {
          key: "contactPostalCode",
          label: "Contact postal code (郵便番号)",
          icon: "postal",
        },
        { key: "contactPhone", label: "Contact phone (連絡先電話)", icon: "phone" },
        {
          key: "contactAddress",
          label: "Contact address (連絡先)",
          icon: "address",
          fullWidth: true,
        },
        { key: "commuteTime", label: "Commute time (通勤時間)", icon: "time" },
        { key: "dependents", label: "Dependents (扶養家族数)", icon: "people" },
        {
          key: "spouse",
          label: "Spouse (配偶者)",
          type: "select",
          options: ["有", "無"],
          icon: "spouse",
        },
        {
          key: "spouseSupport",
          label: "Spousal support (配偶者の扶養義務)",
          type: "select",
          options: ["有", "無"],
          icon: "spouse",
        },
        {
          key: "requests",
          label: "Requests (本人希望記入欄)",
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
