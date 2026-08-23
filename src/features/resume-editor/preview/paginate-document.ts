/**
 * Keeps content off the page edges of a multi-page export: blocks landing in a
 * page's edge band are pushed to the next page by an inserted spacer (not a
 * margin-top, which is truncated at page breaks). The preview runs the same
 * pass, so it matches the export by construction.
 */

const PX_PER_MM = 96 / 25.4;

/** Overflow absorbed at the last page's bottom edge — the noise floor for the page count and what the clip may cut. */
export const PAGE_SLACK_PX = 1;

/** Units that must not be cut by a page edge. The whole section moves, not just
 * its heading — the label-column layouts put them in one grid row. */
const BLOCK_SELECTOR = [
  ".section",
  ".item",
  // Lines inside a long item: each bullet is a unit, so the item's head stays
  // put and only bullets landing in an edge band take their own correction.
  ".rich-text > ul > li",
  ".rich-text > ol > li",
  ".rich-text > p",
].join(", ");

/** A subtree the pass must treat as one block and not descend into. Grid layouts
 * set it: a spacer inserted before a grid child becomes another grid item. */
const PAGE_UNIT_ATTR = "data-page-unit";

/**
 * Fraction of a page's usable height above which a block may break across the
 * page edge instead of moving whole. Short items must not be split; long ones
 * (a third of a page) must, or moving them leaves a blank third of a page —
 * only the item's *head* (title plus a couple of lines) is kept out of the band.
 */
const FRAGMENT_RATIO = 0.32;

type BlockGeometry = {
  /** Block top, relative to the document's first page. */
  top: number;
  /** Bottom of what must stay with the block (its first item, for a section). */
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

/** True when no amount of moving will fit a block between the margins of a
 * page — it still takes its top-margin correction and always needs the
 * `break-inside: avoid` lifted. */
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

  // Page one's top margin is the layout's own padding; adding to it here would
  // double the inset under the header. This correction moves within the page,
  // so it applies to oversized blocks too: no break is crossed.
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

/** Opens `shift` px of flow above `block`; height is corrected after insertion
 * because a `gap`-spaced flex or grid container adds spacing of its own. */
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
    // Floors at zero: a shift below the container's own gap can't be corrected,
    // so it lands up to one gap low — more clearance, never less.
    spacer.style.height = `${Math.max(0, shift - overshoot)}px`;
  }
}

/** Bottom of what must travel with `block` across a break: for a section, its
 * first item; for prose (no `.item`), just the heading plus a couple of lines
 * so a page of text isn't moved wholesale. */
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
    // The heading keeps company with the start of its first item, not all of
    // a long one — moving whole sections left the previous page two-thirds empty.
    if (itemRect.height <= fragmentAbove) return itemRect.bottom;
    return headBottom(firstItem, itemRect);
  }

  const heading = block
    .querySelector<HTMLElement>(".section-heading")
    ?.getBoundingClientRect();
  if (!heading) return rect.bottom;
  return Math.min(rect.bottom, heading.bottom + heading.height * 2);
}

/** Undoes the previous pass so the next one measures the bare document. The
 * forced height must go too, or the pass measures the last count and the clip
 * cuts what the user added. */
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
  // Zero must fail too, not just NaN: a zero page height yields an Infinity page
  // count. Bail before the reset — a pass that can't measure must leave the
  // previous pass's layout standing, not strip it and report one page.
  if (!(pageHeight > 0) || !(margin >= 0)) return 1;

  resetPagination(article);

  const articleRect = article.getBoundingClientRect();
  const articleTop = articleRect.top;

  // The canvas renders the paper under CSS `zoom`, scaling every rect here while
  // the paper vars stay in unscaled CSS px. Derive the factor from the paper's
  // own width so the pass calibrates itself instead of trusting a caller.
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
    // avoid` would have print move it a whole page, a move this pass never
    // measured, throwing off every spacer after it.
    if (cssPx(rect.height) > usableHeight * FRAGMENT_RATIO) {
      block.style.breakInside = "auto";
    }

    // A block that can't fit between the margins keeps its top-margin correction
    // but must stop honouring `.item { break-inside: avoid }`: print would
    // otherwise shunt it a whole page, a move this pass never measured.
    if (exceedsUsableHeight(geometry)) block.style.breakInside = "auto";

    // Inside a page unit the parent already moved as a whole; correcting a child
    // too would double-shift it out of its row. The `break-inside` lift above
    // still has to reach it: when the unit spans the break, an `avoid` child
    // gets shunted a whole page by print, a move this pass never measured.
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

  // Round the paper to whole pages so a full-bleed rail still reaches the final
  // page's bottom edge instead of stopping where the text ended. Definite and
  // clipped, not a `min-height`: the stretched first child spills a sub-pixel
  // fragment past the last page edge, which prints as a blank sheet.
  const measuredHeight = cssPx(article.getBoundingClientRect().height);
  const pageCount = Math.max(
    1,
    Math.ceil((measuredHeight - PAGE_SLACK_PX) / pageHeight),
  );
  article.style.height = `${pageCount * pageHeight}px`;
  article.style.overflow = "clip";
  return pageCount;
}
