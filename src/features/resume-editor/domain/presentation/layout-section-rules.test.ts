import { describe, expect, it } from "vitest";

import {
  getLayoutExtraFields,
  isSectionHiddenByLayout,
  layoutPinsSectionTitles,
  layoutSectionTitle,
} from "@/features/resume-editor/domain/presentation/layout-section-rules";
import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { resumeSectionKeys } from "@/features/resume-editor/domain/sections/section-metadata";

/**
 * The rules table is keyed by strings on both axes, so a typo in a layout id or
 * a section key is not a type error — it silently makes a rule do nothing, and
 * the layout prints the wrong document. These tests are that missing check.
 */
describe("layout section rules table", () => {
  it("keys every rule to a layout that exists", () => {
    // A rule under a stale id would never fire. `layoutPinsSectionTitles` and
    // `getLayoutExtraFields` read the table directly, so a real id answers true
    // for at least one of the four accessors.
    const withRules = pdfLayoutIds.filter(
      (layoutId) =>
        layoutPinsSectionTitles(layoutId) ||
        getLayoutExtraFields(layoutId) !== null ||
        resumeSectionKeys.some((key) => isSectionHiddenByLayout(layoutId, key)),
    );
    expect(withRules).toEqual(["rirekisho"]);
  });

  it("pins titles only to sections that exist", () => {
    for (const layoutId of pdfLayoutIds) {
      for (const sectionKey of resumeSectionKeys) {
        const title = layoutSectionTitle(layoutId, sectionKey);
        if (title !== undefined) expect(title.trim()).not.toBe("");
      }
    }
  });

  it("gives every extra field a unique key and a label", () => {
    for (const layoutId of pdfLayoutIds) {
      const group = getLayoutExtraFields(layoutId);
      if (!group) continue;
      const keys = group.fields.map((field) => field.key);
      expect(new Set(keys).size, `${layoutId} has duplicate extra-field keys`).toBe(
        keys.length,
      );
      for (const field of group.fields) {
        expect(field.label.trim()).not.toBe("");
        // A select with no options renders an empty dropdown the user can't fill.
        if (field.type === "select") expect(field.options?.length).toBeGreaterThan(0);
        // Options are only meaningful on a select.
        if (field.options) expect(field.type).toBe("select");
      }
    }
  });
});

describe("layouts without rules", () => {
  const plainLayouts = pdfLayoutIds.filter((id) => id !== "rirekisho");

  // The table's contract: absence means "print everything, under the user's own
  // titles". A default leaking in here would change 19 layouts at once.
  it("hides nothing and pins nothing", () => {
    for (const layoutId of plainLayouts) {
      expect(getLayoutExtraFields(layoutId)).toBeNull();
      expect(layoutPinsSectionTitles(layoutId)).toBe(false);
      for (const sectionKey of resumeSectionKeys) {
        expect(isSectionHiddenByLayout(layoutId, sectionKey)).toBe(false);
        expect(layoutSectionTitle(layoutId, sectionKey)).toBeUndefined();
      }
    }
  });
});

describe("rirekisho", () => {
  // A 履歴書 is a fixed government form. These five sections have no box on the
  // sheet — they belong on the companion 職務経歴書 — so printing them would not
  // be the format. Hidden, never deleted: the content survives a layout switch.
  it("hides the sections the form has no box for", () => {
    const hidden = resumeSectionKeys.filter((key) =>
      isSectionHiddenByLayout("rirekisho", key),
    );
    expect(hidden.sort()).toEqual(
      [
        "awards",
        "organizationVolunteering",
        "projects",
        "publications",
        "references",
      ].sort(),
    );
  });

  // The form prints its own headings; a user's rename must not reach the paper.
  it("pins the form's own headings", () => {
    expect(layoutSectionTitle("rirekisho", "summary")).toBe("志望動機");
    expect(layoutSectionTitle("rirekisho", "education")).toBe("学歴");
    expect(layoutSectionTitle("rirekisho", "workExperience")).toBe("職歴");
    expect(layoutSectionTitle("rirekisho", "certifications")).toBe("免許・資格");
    expect(layoutPinsSectionTitles("rirekisho")).toBe(true);
  });

  it("offers the boxes a resume has no field for", () => {
    const group = getLayoutExtraFields("rirekisho");
    const keys = group?.fields.map((field) => field.key) ?? [];
    // The identity boxes the sheet demands and the schema has nowhere to put.
    expect(keys).toContain("nameReading");
    expect(keys).toContain("birthDate");
    expect(keys).toContain("gender");
  });

  // 有り / 無し are indistinguishable without their label, which is why the label
  // carries the Japanese too — see the note on `LayoutExtraField.label`.
  it("labels both 有り / 無し fields distinguishably", () => {
    const group = getLayoutExtraFields("rirekisho");
    const spouse = group?.fields.find((field) => field.key === "spouse");
    const support = group?.fields.find((field) => field.key === "spouseSupport");
    expect(spouse?.options).toEqual(["有り", "無し"]);
    expect(support?.options).toEqual(["有り", "無し"]);
    expect(spouse?.label).not.toBe(support?.label);
  });
});
