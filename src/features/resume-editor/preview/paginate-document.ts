/**
 * Keeps content off the page edges of a multi-page export.
 *
 * The document is one continuous flow printed with zero physical margins so
 * decorative surfaces can bleed to the paper edge, which means the page margin
 * only exists once — as the layout's own padding at the top and bottom of the
 * whole document. `@page { margin }` would restore it but nothing can paint
 * inside a page margin in Chrome, trading the bleed away. So we measure instead
 * and push any block that lands in a page's edge band down to the next page.
 *
 * The gap is an inserted element rather than a `margin-top`, and that is
 * load-bearing: a margin is truncated where it crosses a page break, so a
 * margin big enough to move a block to the next page evaporates at the break
 * and drops the block flush against the top edge — the exact bug being fixed.
 * A block box fragments across the break instead.
 *
 * The editor preview runs the same pass, so what it shows is the export by
 * construction rather than by a second implementation kept in sync by hand.
 */

const PX_PER_MM = 96 / 25.4;

/**
 * Overflow absorbed at the last page's bottom edge, in px — both the noise floor
 * for the page count and what the clip may cut, so the two can't disagree. It
 * falls inside the bottom margin band, which the pass keeps empty of content.
 */
export const PAGE_SLACK_PX = 1;

/**
 * Units that must not be cut by a page edge, in document order. The whole
 * section moves, not just its heading, because the label-column layouts put the
 * two in one grid row and shifting the heading alone would slide it out of line.
 */
const BLOCK_SELECTOR = [
  ".section",
  ".item",
  // Lines inside a long entry. Making the bullet a unit is what lets a tall
  // entry span a page break without either leaving a third of a page blank
  // (moving it whole) or dropping its continuation flush against the next
  // page's top edge (letting it fragment freely): the entry's head stays put,
  // and each bullet that would land in an edge band takes its own correction.
  ".rich-text > ul > li",
  ".rich-text > ol > li",
  ".rich-text > p",
].join(", ");

/**
 * A subtree the pass must treat as one block and not descend into. Grid-based
 * layouts set it: a spacer inserted before a grid child becomes another grid
 * item and reflows the whole tiling, so the row moves as a unit instead.
 */
const PAGE_UNIT_ATTR = "data-page-unit";

/**
 * Fraction of a page's usable height above which a block is allowed to break
 * across the page edge instead of moving to the next page whole.
 *
 * Moving is right for a short entry — a three-line award split over two sheets
 * reads as a mistake. It is wrong for a long one: a work entry with nine bullets
 * is a third of a page, so moving it wholesale leaves a third of a page blank
 * and it still has to break somewhere. Above this threshold only the entry's
 * *head* (its title plus a couple of lines) is kept out of the edge band, and
 * the rest flows across, which is what every word processor does.
 */
const FRAGMENT_RATIO = 0.32;

type BlockGeometry = {
  /** Block top, relative to the document's first page. */
  top: number;
  /** Bottom of what must stay with the block — its first item, for a section. */
  unitBottom: number;
  pageHeight: number;
  margin: number;
};

/** Height of the head that must not be stranded at a page foot: a title and ~2 lines. */
function headBottom(block: HTMLElement, rect: DOMRect): number {
  const head = block.querySelector<HTMLElement>(
    ".item-title, .section-heading",
  );
  if (!head) return rect.bottom;
  const headRect = head.getBoundingClientRect();
  return Math.min(rect.bottom, headRect.bottom + headRect.height * 2);
}

/**
 * True when a block can't fit between the margins of any page, so no amount of
 * moving will save it. The caller needs this independently of the shift: an
 * oversized block still takes its top-margin correction, and it always needs
 * `break-inside: avoid` lifted.
 */
export function exceedsUsableHeight({
  top,
  unitBottom,
  pageHeight,
  margin,
}: BlockGeometry): boolean {
  return unitBottom - top > pageHeight - margin * 2;
}

/**
 * How far a block has to move to clear the page edges, in px (0 = leave it).
 * Split out from the DOM walk so the rule is testable without a layout engine.
 */
export function computeBlockShift({
  top,
  unitBottom,
  pageHeight,
  margin,
}: BlockGeometry): number {
  const pageStart = Math.floor(top / pageHeight) * pageHeight;
  const pageEnd = pageStart + pageHeight;

  // Page one's top margin is the layout's own padding — adding to it here would
  // double the inset under the header. This correction moves the block within
  // its own page, so it applies to oversized blocks too: no break is crossed.
  if (pageStart > 0 && top < pageStart + margin) return pageStart + margin - top;

  // Taller than a page can hold: moving it only relocates the overflow, so let
  // it break where it falls rather than burn a page first.
  if (exceedsUsableHeight({ top, unitBottom, pageHeight, margin })) return 0;

  return unitBottom > pageEnd - margin ? pageEnd + margin - top : 0;
}

function readMmVar(element: HTMLElement, name: string): number {
  const raw = getComputedStyle(element).getPropertyValue(name);
  return Number.parseFloat(raw) * PX_PER_MM;
}

/**
 * Opens `shift` px of flow above `block`. The height is corrected after
 * insertion because the spacer becomes a sibling in a `gap`-spaced flex or grid
 * container, which adds spacing of its own that the measurement can't predict.
 */
function insertSpacerBefore(
  block: HTMLElement,
  shift: number,
  top: number,
  articleTop: number,
  scale: number,
): void {
  const spacer = document.createElement("div");
  // Read by scripts/check-pagebreak.ts to assert no gap approaches a full page.
  spacer.dataset.pageSpacer = "";
  spacer.style.height = `${shift}px`;
  block.before(spacer);

  const landed = (block.getBoundingClientRect().top - articleTop) / scale;
  const overshoot = landed - (top + shift);
  if (Math.abs(overshoot) > 0.5) {
    // Floors at zero: a shift smaller than the container's own gap can't be
    // corrected away, so the block lands up to one gap low. That errs towards
    // more clearance, never less, so it can't put content back in the band.
    spacer.style.height = `${Math.max(0, shift - overshoot)}px`;
  }
}

/**
 * The bottom of what has to travel with `block` across a break: for a section,
 * its first item — the rest flow on and are each checked in turn. A prose
 * section (the summary) has no `.item`, and taking its whole height would move
 * a page of text wholesale to keep a heading company, so only the heading plus
 * a couple of lines travels and the paragraph flows across the break.
 */
function measureUnitBottom(
  block: HTMLElement,
  rect: DOMRect,
  usableHeight: number,
): number {
  const fragmentAbove = usableHeight * FRAGMENT_RATIO;

  if (!block.classList.contains("section")) {
    // Short enough to move whole; anything taller only has to keep its head off
    // the page foot and may break below it.
    if (rect.height <= fragmentAbove) return rect.bottom;
    return headBottom(block, rect);
  }

  const firstItem = block.querySelector<HTMLElement>(".item");
  if (firstItem) {
    const itemRect = firstItem.getBoundingClientRect();
    // The heading has to keep company with the start of its first entry, but
    // not with all of a long one — that is what moved whole sections a page
    // early and left the previous one two-thirds empty.
    if (itemRect.height <= fragmentAbove) return itemRect.bottom;
    return headBottom(firstItem, itemRect);
  }

  const heading = block
    .querySelector<HTMLElement>(".section-heading")
    ?.getBoundingClientRect();
  if (!heading) return rect.bottom;
  return Math.min(rect.bottom, heading.bottom + heading.height * 2);
}

/**
 * Undoes a previous pass so the next one measures the bare document. The forced
 * height matters as much as the spacers: left in place, the next pass measures
 * the last count instead of the content, and the clip cuts what the user added.
 */
function resetPagination(article: HTMLElement): void {
  for (const spacer of Array.from(
    article.querySelectorAll("[data-page-spacer]"),
  )) {
    spacer.remove();
  }
  for (const block of Array.from(
    article.querySelectorAll<HTMLElement>(
      `[${PAGE_UNIT_ATTR}], ${BLOCK_SELECTOR}`,
    ),
  )) {
    block.style.removeProperty("break-inside");
  }
  article.style.removeProperty("min-height");
  article.style.removeProperty("height");
  article.style.removeProperty("overflow");
}

/** Lays the document out in pages and returns how many it takes. */
export function paginateResumeDocument(article: HTMLElement): number {
  const pageHeight = readMmVar(article, "--resume-paper-height");
  const margin = readMmVar(article, "--resume-page-margin");
  // Zero has to fail here too, not just NaN: a zero page height divides through
  // to an Infinity page count and a silently dropped `min-height: Infinitypx`.
  // Bail before the reset — a pass that can't measure must leave the previous
  // pass's layout standing, not strip it and report one page.
  if (!(pageHeight > 0) || !(margin >= 0)) return 1;

  resetPagination(article);

  const articleRect = article.getBoundingClientRect();
  const articleTop = articleRect.top;

  // The editor canvas renders the paper under CSS `zoom`, which scales every
  // rect this pass reads while the paper vars stay in unscaled CSS px. Derive
  // the factor from the one length that is both — the paper's own width — so
  // the pass calibrates itself instead of trusting a caller to pass the zoom.
  const paperWidth = readMmVar(article, "--resume-paper-width");
  const measuredScale = paperWidth > 0 ? articleRect.width / paperWidth : 1;
  const scale = measuredScale > 0 ? measuredScale : 1;
  const cssPx = (value: number) => value / scale;

  const usableHeight = pageHeight - margin * 2;

  for (const block of Array.from(
    article.querySelectorAll<HTMLElement>(
      `[${PAGE_UNIT_ATTR}], ${BLOCK_SELECTOR}`,
    ),
  )) {
    const rect = block.getBoundingClientRect();
    const top = cssPx(rect.top - articleTop);

    const unitBottom = cssPx(
      measureUnitBottom(block, rect, usableHeight * scale) - articleTop,
    );
    const geometry = { top, unitBottom, pageHeight, margin };

    // A block allowed to fragment must actually be allowed to: `break-inside:
    // avoid` would otherwise have print move it a whole page, a move this pass
    // never measured, throwing off every spacer after it.
    if (cssPx(rect.height) > usableHeight * FRAGMENT_RATIO) {
      block.style.breakInside = "auto";
    }

    // A block that can't fit between the margins keeps whatever top-margin
    // correction it earns, but it must also stop honouring
    // `.item { break-inside: avoid }`: print would otherwise shunt it a whole
    // page, a move this pass never measured, throwing off every later spacer.
    if (exceedsUsableHeight(geometry)) block.style.breakInside = "auto";

    // Inside a page unit the parent already moved as a whole; correcting a
    // child as well would double-shift it out of the row it belongs to. The
    // `break-inside` lift above still has to reach it: when the unit spans the
    // break on purpose, an `avoid` child gets shunted a whole page by print, a
    // move this pass never measured.
    if (
      !block.hasAttribute(PAGE_UNIT_ATTR) &&
      block.closest(`[${PAGE_UNIT_ATTR}]`)
    ) {
      continue;
    }

    const shift = computeBlockShift(geometry);
    // Sub-pixel shifts are rounding noise, and inserting one costs a reflow.
    if (shift > 0.5) insertSpacerBefore(block, shift, top, articleTop, scale);
  }

  // Round the paper out to whole pages so a full-bleed rail still reaches the
  // bottom edge of the final page instead of stopping where the text ended.
  // Definite and clipped, not a `min-height`: the stretched first child spills a
  // sub-pixel fragment past the last page edge, which prints as a blank sheet.
  const measuredHeight = cssPx(article.getBoundingClientRect().height);
  const pageCount = Math.max(
    1,
    Math.ceil((measuredHeight - PAGE_SLACK_PX) / pageHeight),
  );
  article.style.height = `${pageCount * pageHeight}px`;
  article.style.overflow = "clip";
  return pageCount;
}
