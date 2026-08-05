import { describe, expect, it } from "vitest";

import { computeBlockShift, exceedsUsableHeight } from "./paginate-document";

// A page is 1000 tall with a 100 margin, so content lives in 100..900 on page
// one, 1100..1900 on page two, and so on.
const page = { pageHeight: 1000, margin: 100 };

describe("computeBlockShift", () => {
  it("leaves a block that clears both edges of its page", () => {
    expect(
      computeBlockShift({ top: 300, unitBottom: 500, ...page }),
    ).toBe(0);
  });

  it("moves a block that would be cut by the page's bottom margin", () => {
    // Ends at 950, inside the bottom band — lands at the next page's 1100.
    expect(computeBlockShift({ top: 850, unitBottom: 950, ...page })).toBe(250);
  });

  it("moves a block that starts inside a page's top margin", () => {
    // Chrome broke the page at 1000 and put it at 1020, above the margin line.
    expect(computeBlockShift({ top: 1020, unitBottom: 1200, ...page })).toBe(80);
  });

  it("leaves page one's top alone — that margin is the layout's own padding", () => {
    expect(computeBlockShift({ top: 40, unitBottom: 200, ...page })).toBe(0);
  });

  it("leaves a block too tall to ever fit between the margins", () => {
    // Moving a 900-tall block just relocates the overflow and wastes a page.
    expect(computeBlockShift({ top: 850, unitBottom: 1750, ...page })).toBe(0);
  });

  it("still corrects a too-tall block sitting in a top margin", () => {
    // 970 tall, so it can never fit the 800 between margins — but the
    // correction only moves it down its own page, crossing no break, so it
    // takes the top margin like anything else. What it must NOT do is stay in
    // the band; the caller lifts `break-inside: avoid` off it separately.
    const oversizedInBand = { top: 1020, unitBottom: 1990, ...page };
    expect(exceedsUsableHeight(oversizedInBand)).toBe(true);
    expect(computeBlockShift(oversizedInBand)).toBe(80);
  });

  it("flags every block that can't fit between the margins", () => {
    // The flag drives `break-inside: auto`, and it has to be independent of the
    // shift: a too-tall block that also earns a top-margin correction returns a
    // non-zero shift, and gating the flag on `shift === 0` would miss it.
    expect(exceedsUsableHeight({ top: 300, unitBottom: 500, ...page })).toBe(
      false,
    );
    expect(exceedsUsableHeight({ top: 850, unitBottom: 1750, ...page })).toBe(
      true,
    );
  });

  it("keeps a section's heading with its first item", () => {
    // The heading itself clears the band; the item under it does not, and the
    // caller passes the item's bottom so the pair travels together.
    expect(computeBlockShift({ top: 700, unitBottom: 750, ...page })).toBe(0);
    expect(computeBlockShift({ top: 700, unitBottom: 920, ...page })).toBe(400);
  });
});
