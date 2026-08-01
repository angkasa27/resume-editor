import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";

const layoutCss = (layoutId: string) =>
  readFileSync(join(__dirname, "layouts", layoutId, "styles.module.css"), "utf8");

// Reads stylesheets as text — blunt, but the cheapest place to assert the cross-cutting contract
// that the user's accent colour must land somewhere on every layout.
describe("layout theming contract", () => {
  it("spends the accent somewhere on every layout", () => {
    // A layout must paint with --resume-accent itself, or leave the shared heading rule alone so
    // the heading takes it. Overriding both (as academic once did) makes accent a dead control.
    for (const layoutId of pdfLayoutIds) {
      const css = layoutCss(layoutId);
      const paintsAccent = css.includes("--resume-accent");
      const headingTakesAccent = !css.includes("--resume-heading-color");
      expect(
        paintsAccent || headingTakesAccent,
        `${layoutId} renders the accent nowhere: it overrides the heading colour and never uses --resume-accent`,
      ).toBe(true);
    }
  });

  it("never pins a font, which would override the user's choice", () => {
    // academic hardcoded --resume-font: Georgia, silently making the Style tab's
    // font control a no-op there and any preset naming another serif dead data.
    for (const layoutId of pdfLayoutIds) {
      expect(
        layoutCss(layoutId),
        `${layoutId} sets --resume-font, overriding the user's font choice`,
      ).not.toContain("--resume-font:");
    }
  });
});
