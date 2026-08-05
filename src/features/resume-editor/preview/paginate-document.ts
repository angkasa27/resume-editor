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
 * Units that must not be cut by a page edge, in document order. The whole
 * section moves, not just its heading, because the label-column layouts put the
 * two in one grid row and shifting the heading alone would slide it out of line.
 */
const BLOCK_SELECTOR = ".section, .item";

type BlockGeometry = {
  /** Block top, relative to the document's first page. */
  top: number;
  /** Bottom of what must stay with the block — its first item, for a section. */
  unitBottom: number;
  pageHeight: number;
  margin: number;
};

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
function measureUnitBottom(block: HTMLElement, rect: DOMRect): number {
  if (!block.classList.contains("section")) return rect.bottom;

  const firstItem = block.querySelector<HTMLElement>(".item");
  if (firstItem) return firstItem.getBoundingClientRect().bottom;

  const heading = block
    .querySelector<HTMLElement>(".section-heading")
    ?.getBoundingClientRect();
  if (!heading) return rect.bottom;
  return Math.min(rect.bottom, heading.bottom + heading.height * 2);
}

/**
 * Undoes a previous pass so the next one measures the bare document. The
 * min-height matters as much as the spacers: it is a floor, so leaving it in
 * place means the page count can only ever grow as the user edits.
 */
export function resetPagination(article: HTMLElement): void {
  for (const spacer of Array.from(
    article.querySelectorAll("[data-page-spacer]"),
  )) {
    spacer.remove();
  }
  for (const block of Array.from(
    article.querySelectorAll<HTMLElement>(BLOCK_SELECTOR),
  )) {
    block.style.removeProperty("break-inside");
  }
  article.style.removeProperty("min-height");
}

/** Lays the document out in pages and returns how many it takes. */
export function paginateResumeDocument(article: HTMLElement): number {
  resetPagination(article);

  const pageHeight = readMmVar(article, "--resume-paper-height");
  const margin = readMmVar(article, "--resume-page-margin");
  // Zero has to fail here too, not just NaN: a zero page height divides through
  // to an Infinity page count and a silently dropped `min-height: Infinitypx`.
  if (!(pageHeight > 0) || !(margin >= 0)) return 1;

  const articleRect = article.getBoundingClientRect();
  const articleTop = articleRect.top;

  // The editor canvas renders the paper under CSS `zoom`, which scales every
  // rect this pass reads while the paper vars stay in unscaled CSS px. Derive
  // the factor from the one length that is both — the paper's own width — so
  // the pass calibrates itself instead of trusting a caller to pass the zoom.
  const paperWidth = readMmVar(article, "--resume-paper-width");
  const measured = paperWidth > 0 ? articleRect.width / paperWidth : 1;
  const scale = measured > 0 ? measured : 1;
  const cssPx = (value: number) => value / scale;

  for (const block of Array.from(
    article.querySelectorAll<HTMLElement>(BLOCK_SELECTOR),
  )) {
    const rect = block.getBoundingClientRect();
    const top = cssPx(rect.top - articleTop);

    const unitBottom = cssPx(measureUnitBottom(block, rect) - articleTop);
    const geometry = { top, unitBottom, pageHeight, margin };

    // A block that can't fit between the margins keeps whatever top-margin
    // correction it earns, but it must also stop honouring
    // `.item { break-inside: avoid }`: print would otherwise shunt it a whole
    // page, a move this pass never measured, throwing off every later spacer.
    if (exceedsUsableHeight(geometry)) block.style.breakInside = "auto";

    const shift = computeBlockShift(geometry);
    // Sub-pixel shifts are rounding noise, and inserting one costs a reflow.
    if (shift > 0.5) insertSpacerBefore(block, shift, top, articleTop, scale);
  }

  // Round the paper out to whole pages so a full-bleed rail still reaches the
  // bottom edge of the final page instead of stopping where the text ended.
  const pageCount = Math.max(
    1,
    Math.ceil(
      cssPx(article.getBoundingClientRect().height) / pageHeight - 0.001,
    ),
  );
  article.style.minHeight = `${pageCount * pageHeight}px`;
  return pageCount;
}
