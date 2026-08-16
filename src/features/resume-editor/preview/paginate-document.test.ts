import { describe, expect, it } from "vitest";

import {
  computeBlockShift,
  exceedsUsableHeight,
  PAGE_SLACK_PX,
  paginateResumeDocument,
} from "./paginate-document";

const PX_PER_MM = 96 / 25.4;
const mm = (value: number) => value * PX_PER_MM;

/** jsdom has no layout, so give each element a rect that flows: base top plus
 * every spacer inserted above it — the one thing the pass depends on. */
function place(
  article: HTMLElement,
  element: HTMLElement,
  baseTop: number,
  height: number,
) {
  element.getBoundingClientRect = () => {
    let pushed = 0;
    for (const spacer of article.querySelectorAll<HTMLElement>(
      "[data-page-spacer]",
    )) {
      const isAbove =
        spacer.compareDocumentPosition(element) &
        Node.DOCUMENT_POSITION_FOLLOWING;
      if (isAbove) pushed += Number.parseFloat(spacer.style.height) || 0;
    }
    const top = baseTop + pushed;
    return { top, bottom: top + height, height, width: mm(210) } as DOMRect;
  };
}

/** The article grows by every spacer inside it; width matches the paper, so the pass reads a zoom of 1. */
function placeArticle(article: HTMLElement, contentHeight: number) {
  article.getBoundingClientRect = () => {
    let height = contentHeight;
    for (const spacer of article.querySelectorAll<HTMLElement>(
      "[data-page-spacer]",
    )) {
      height += Number.parseFloat(spacer.style.height) || 0;
    }
    return { top: 0, bottom: height, height, width: mm(210) } as DOMRect;
  };
}

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
    // correction only moves it down its own page, so it takes the top margin
    // like anything else; the caller lifts `break-inside: avoid` separately.
    const oversizedInBand = { top: 1020, unitBottom: 1990, ...page };
    expect(exceedsUsableHeight(oversizedInBand)).toBe(true);
    expect(computeBlockShift(oversizedInBand)).toBe(80);
  });

  it("flags every block that can't fit between the margins", () => {
    // The flag drives `break-inside: auto` and must be independent of the shift:
    // gating it on `shift === 0` would miss a too-tall block that also earns a
    // top-margin correction.
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

describe("paginateResumeDocument", () => {
  const pageHeight = mm(297);
  const margin = mm(14);

  function buildArticle({ withVars = true } = {}) {
    document.body.innerHTML = "";
    const article = document.createElement("article");
    if (withVars) {
      article.style.setProperty("--resume-paper-height", "297mm");
      article.style.setProperty("--resume-paper-width", "210mm");
      article.style.setProperty("--resume-page-margin", "14mm");
    }
    article.innerHTML = `
      <div class="section" id="intro"></div>
      <div class="section" id="work"><div class="item" id="job"></div></div>
    `;
    document.body.append(article);

    const intro = article.querySelector<HTMLElement>("#intro")!;
    const work = article.querySelector<HTMLElement>("#work")!;
    const job = article.querySelector<HTMLElement>("#job")!;

    place(article, intro, 0, 200);
    place(article, work, 1010, 300);
    place(article, job, 1030, 90);
    placeArticle(article, 1120);

    return { article, work, job };
  }

  it("drops a section that straddles the page edge onto the next margin line", () => {
    const { article, work } = buildArticle();

    const pageCount = paginateResumeDocument(article);

    const spacer = work.previousElementSibling as HTMLElement;
    expect(spacer?.dataset.pageSpacer).toBe("");
    // The point of the whole pass: the section now starts exactly on page two's
    // margin line, not in the band above it.
    expect(work.getBoundingClientRect().top).toBeCloseTo(pageHeight + margin, 5);
    expect(pageCount).toBe(2);
    // Rounded out to whole pages so a full-bleed rail reaches the last edge.
    expect(article.style.height).toBe(`${2 * pageHeight}px`);
  });

  it("pins the paper to a definite, clipped height", () => {
    // A `min-height` lets the stretched first child spill a sub-pixel fragment
    // past the last page edge — a blank sheet in the PDF. Only a definite height
    // plus the clip makes the count printable.
    for (const [contentHeight, expectedPages] of [
      [600, 1],
      [1500, 2],
      [2500, 3],
    ] as const) {
      const { article, work, job } = buildArticle();
      // Clear of every band, so nothing shifts and the height under test is the
      // one the pass forces rather than one the spacers moved.
      place(article, work, 300, 200);
      place(article, job, 320, 90);
      placeArticle(article, contentHeight);

      expect(paginateResumeDocument(article)).toBe(expectedPages);
      expect(article.style.height).toBe(`${expectedPages * pageHeight}px`);
      expect(article.style.overflow).toBe("clip");
      expect(article.style.minHeight).toBe("");
    }
  });

  it("absorbs a hairline of overflow instead of buying a whole page for it", () => {
    // Within the slack it is measurement noise, clipped from the empty bottom
    // band. Past it, real content — which does earn another page.
    const build = (contentHeight: number) => {
      const { article, work, job } = buildArticle();
      place(article, work, 300, 200);
      place(article, job, 320, 90);
      placeArticle(article, contentHeight);
      return article;
    };

    expect(paginateResumeDocument(build(pageHeight + PAGE_SLACK_PX / 2))).toBe(1);
    expect(paginateResumeDocument(build(pageHeight + PAGE_SLACK_PX * 2))).toBe(2);
  });

  it("moves nothing when every block already clears both edges", () => {
    const { article, work, job } = buildArticle();
    place(article, work, 300, 300);
    place(article, job, 320, 90);
    placeArticle(article, 600);

    expect(paginateResumeDocument(article)).toBe(1);
    expect(article.querySelectorAll("[data-page-spacer]")).toHaveLength(0);
  });

  it("lifts break-inside off a child of a page unit without shifting it", () => {
    // Atlas rows are data-page-unit: the row moves whole, so the pass must not
    // double-shift a child out of its cell — but a fragmentable child still has
    // to stop honouring `.item { break-inside: avoid }`.
    document.body.innerHTML = "";
    const article = document.createElement("article");
    article.style.setProperty("--resume-paper-height", "297mm");
    article.style.setProperty("--resume-paper-width", "210mm");
    article.style.setProperty("--resume-page-margin", "14mm");
    const row = document.createElement("div");
    row.setAttribute("data-page-unit", "");
    const item = document.createElement("div");
    item.className = "item";
    row.append(item);
    article.append(row);
    document.body.append(article);

    // Page two, clear of both bands; both blocks are fragmentable, so the
    // break-inside lift is what's under test, not a shift.
    place(article, row, 1300, 600);
    place(article, item, 1310, 400);
    placeArticle(article, 1900);

    expect(paginateResumeDocument(article)).toBe(2);
    expect(row.style.breakInside).toBe("auto");
    expect(item.style.breakInside).toBe("auto");
    // The child is corrected by neither a spacer nor the row's own shift.
    expect(article.querySelectorAll("[data-page-spacer]")).toHaveLength(0);
  });

  it("leaves the previous pass standing when the paper vars can't be read", () => {
    // The guard must bail *before* the reset: stripping spacers and then
    // reporting one page loses the page markers and the rail, with no retry
    // until the draft changes again.
    const { article } = buildArticle({ withVars: false });
    const stale = document.createElement("div");
    stale.dataset.pageSpacer = "";
    stale.style.height = "120px";
    article.prepend(stale);
    article.style.minHeight = "999px";

    expect(paginateResumeDocument(article)).toBe(1);
    expect(article.querySelectorAll("[data-page-spacer]")).toHaveLength(1);
    expect(article.style.minHeight).toBe("999px");
  });
});
