import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { previewLayoutDefinitions } from "@/features/resume-editor/preview/layout-registry";

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

  it("configures its own link cue, since one blunt underline cannot suit nineteen designs", () => {
    for (const layoutId of pdfLayoutIds) {
      expect(
        layoutCss(layoutId),
        `${layoutId} never sets --resume-link-decoration, so it silently inherits the default underline`,
      ).toContain("--resume-link-decoration");
    }
  });

  it("never underlines item titles in a different style from contacts", () => {
    // Titles inherit --resume-link-decoration. A layout may only override it to
    // `none`, and only because a titleLinkMarker glyph is carrying the cue there;
    // any other value means one layout marks its two link kinds two ways.
    for (const layout of previewLayoutDefinitions) {
      const override = /--resume-link-title-decoration:\s*([^;]+);/.exec(
        layoutCss(layout.id),
      )?.[1];
      if (override === undefined) {
        expect(
          layout.titleLinkMarker,
          `${layout.id} has a titleLinkMarker glyph but still lets titles inherit the contact rule, so they carry both`,
        ).toBeUndefined();
        continue;
      }
      expect(
        override.trim(),
        `${layout.id} gives item titles their own decoration instead of its contact one`,
      ).toBe("none");
      expect(
        layout.titleLinkMarker,
        `${layout.id} drops the title rule without a glyph to replace it, leaving links unmarked`,
      ).toBeDefined();
    }
  });

  it("spends none of the heading's own emphasis on the link cue", () => {
    // Proxy for "weaker than the section heading", which CSS text can't compare
    // directly: a link may take a rule, a colour or the arrow marker — never
    // weight, a fill, or capitals, which are what the headings use to dominate.
    for (const layoutId of pdfLayoutIds) {
      const css = layoutCss(layoutId);
      // Just the declaration block that holds the cue — slicing to EOF would
      // silently police every rule appended after it.
      const start = css.indexOf("--resume-link-decoration");
      const cue = css.slice(start, css.indexOf("}", start));
      for (const forbidden of ["font-weight", "background", "text-transform"]) {
        expect(
          cue,
          `${layoutId} gives its links ${forbidden}, which competes with its section headings`,
        ).not.toContain(forbidden);
      }
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
