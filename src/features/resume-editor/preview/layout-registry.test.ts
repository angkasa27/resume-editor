import { describe, expect, it } from "vitest";

import {
  getLayout,
  previewLayoutDefinitions,
  shouldHideSummaryHeading,
} from "@/features/resume-editor/preview/layout-registry";

describe("preview layout registry", () => {
  it("exposes all twelve built-in layouts", () => {
    const ids = previewLayoutDefinitions.map((layout) => layout.id);
    expect(ids).toEqual([
      "classic",
      "sidebar",
      "modern-centered",
      "timeline",
      "academic",
      "inset",
      "banner",
      "split",
      "bold-type",
      "studio",
      "mosaic",
      "spotlight",
    ]);
  });

  it("resolves layouts by id", () => {
    for (const id of [
      "classic",
      "sidebar",
      "modern-centered",
      "timeline",
      "academic",
      "inset",
      "banner",
      "split",
      "bold-type",
      "studio",
      "mosaic",
      "spotlight",
    ] as const) {
      expect(getLayout(id).id).toBe(id);
    }
  });

  it("falls back to classic when an unknown layout id is requested", () => {
    expect(getLayout("missing" as never).id).toBe("classic");
  });

  it("partitions sections into side and main columns in the sidebar and split layouts", () => {
    for (const id of ["sidebar", "split"] as const) {
      const layout = getLayout(id);
      expect(layout.getColumn?.("skills")).toBe("side");
      expect(layout.getColumn?.("languages")).toBe("side");
      expect(layout.getColumn?.("certifications")).toBe("side");
      expect(layout.getColumn?.("references")).toBe("side");
      expect(layout.getColumn?.("workExperience")).toBe("main");
      expect(layout.getColumn?.("education")).toBe("main");
    }
  });

  it("marks only classic and split as hiding the summary heading", () => {
    // Classic renders its own Summary heading, split runs the name straight
    // into the summary; suppressing the shared <h2> anywhere else loses the
    // section its title.
    const hiding = previewLayoutDefinitions
      .filter((layout) => layout.hideSummaryHeading === true)
      .map((layout) => layout.id);
    expect(hiding.sort()).toEqual(["classic", "split"]);
  });

  it("shouldHideSummaryHeading derives from the layout definition", () => {
    expect(shouldHideSummaryHeading("classic")).toBe(true);
    expect(shouldHideSummaryHeading("split")).toBe(true);
    expect(shouldHideSummaryHeading("bold-type")).toBe(false);
    expect(shouldHideSummaryHeading("timeline")).toBe(false);
    expect(shouldHideSummaryHeading("banner")).toBe(false);
    expect(shouldHideSummaryHeading("sidebar")).toBe(false);
  });

  it("single-column layouts have no column partitioning", () => {
    expect(getLayout("classic").getColumn).toBeUndefined();
    expect(getLayout("modern-centered").getColumn).toBeUndefined();
    expect(getLayout("timeline").getColumn).toBeUndefined();
    expect(getLayout("academic").getColumn).toBeUndefined();
    expect(getLayout("inset").getColumn).toBeUndefined();
    expect(getLayout("banner").getColumn).toBeUndefined();
    expect(getLayout("bold-type").getColumn).toBeUndefined();
    expect(getLayout("studio").getColumn).toBeUndefined();
    expect(getLayout("mosaic").getColumn).toBeUndefined();
  });
});
