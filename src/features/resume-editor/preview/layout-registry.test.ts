import { describe, expect, it } from "vitest";

import {
  getLayout,
  previewLayoutDefinitions,
  shouldHideSummaryHeading,
} from "@/features/resume-editor/preview/layout-registry";

describe("preview layout registry", () => {
  it("exposes all nineteen built-in layouts", () => {
    const ids = previewLayoutDefinitions.map((layout) => layout.id);
    expect(ids).toEqual([
      "classic",
      "modern-centered",
      "timeline",
      "academic",
      "inset",
      "split",
      "duet",
      "bold-type",
      "studio",
      "aurora",
      "ledger",
      "dossier",
      "crest",
      "masthead",
      "compass",
      "numeral",
      "atlas",
      "editorial",
      "harvard",
    ]);
  });

  it("resolves layouts by id", () => {
    for (const id of [
      "classic",
      "modern-centered",
      "timeline",
      "academic",
      "inset",
      "split",
      "duet",
      "bold-type",
      "studio",
      "aurora",
      "ledger",
      "dossier",
      "crest",
      "masthead",
      "compass",
      "numeral",
      "atlas",
      "editorial",
      "harvard",
    ] as const) {
      expect(getLayout(id).id).toBe(id);
    }
  });

  it("falls back to classic when an unknown layout id is requested", () => {
    expect(getLayout("missing" as never).id).toBe("classic");
  });

  it("partitions sections into side and main columns in the sidebar and split layouts", () => {
    for (const id of ["split", "duet", "ledger", "dossier", "compass"] as const) {
      const layout = getLayout(id);
      expect(layout.getColumn?.("skills")).toBe("side");
      expect(layout.getColumn?.("languages")).toBe("side");
      expect(layout.getColumn?.("certifications")).toBe("side");
      expect(layout.getColumn?.("references")).toBe("side");
      expect(layout.getColumn?.("workExperience")).toBe("main");
      expect(layout.getColumn?.("education")).toBe("main");
    }
  });

  it("marks only the layouts that re-title the summary as hiding its heading", () => {
    // A few layouts render the summary themselves (classic, split, atlas,
    // editorial); suppressing the shared <h2> anywhere else loses the title.
    const hiding = previewLayoutDefinitions
      .filter((layout) => layout.hideSummaryHeading === true)
      .map((layout) => layout.id);
    expect(hiding.sort()).toEqual([
      "atlas",
      "classic",
      "editorial",
      "split",
    ]);
  });

  it("shouldHideSummaryHeading derives from the layout definition", () => {
    expect(shouldHideSummaryHeading("classic")).toBe(true);
    expect(shouldHideSummaryHeading("split")).toBe(true);
    expect(shouldHideSummaryHeading("bold-type")).toBe(false);
    expect(shouldHideSummaryHeading("timeline")).toBe(false);
    expect(shouldHideSummaryHeading("ledger")).toBe(false);
    expect(shouldHideSummaryHeading("masthead")).toBe(false);
  });

  it("single-column layouts have no column partitioning", () => {
    expect(getLayout("classic").getColumn).toBeUndefined();
    expect(getLayout("modern-centered").getColumn).toBeUndefined();
    expect(getLayout("timeline").getColumn).toBeUndefined();
    expect(getLayout("academic").getColumn).toBeUndefined();
    expect(getLayout("inset").getColumn).toBeUndefined();
    expect(getLayout("bold-type").getColumn).toBeUndefined();
    expect(getLayout("studio").getColumn).toBeUndefined();
    expect(getLayout("aurora").getColumn).toBeUndefined();
    expect(getLayout("crest").getColumn).toBeUndefined();
    expect(getLayout("masthead").getColumn).toBeUndefined();
    expect(getLayout("numeral").getColumn).toBeUndefined();
    expect(getLayout("atlas").getColumn).toBeUndefined();
    expect(getLayout("editorial").getColumn).toBeUndefined();
    expect(getLayout("harvard").getColumn).toBeUndefined();
  });
});
