/**
 * Verifies the editor preview paginates like the export under canvas zoom —
 * the one place the two can silently disagree (the pass only re-runs while
 * zoomed after an edit, so the script makes one).
 *
 * Usage: pnpm dev && pnpm tsx scripts/check-preview-pagination.ts
 */
import puppeteer from "puppeteer";

import { longDraft } from "./check-pagebreak";
import {
  exportResumeDraft,
  RESUME_STORAGE_KEY,
} from "@/features/resume-editor/domain/draft/resume-draft-storage";
import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";

const ORIGIN = process.env.BASE_URL ?? "http://localhost:4000";
const ZOOM_CLICKS = 3;

/** Same geometry the export check asserts, re-derived in the zoomed frame. */
function readReport() {
  const PX_PER_MM = 96 / 25.4;
  const article = document.querySelector<HTMLElement>(".resume-document");
  if (!article) return null;

  const styles = getComputedStyle(article);
  const mm = (name: string) =>
    Number.parseFloat(styles.getPropertyValue(name)) * PX_PER_MM;
  const pageHeight = mm("--resume-paper-height");
  const margin = mm("--resume-page-margin");

  const rect = article.getBoundingClientRect();
  const scale = rect.width / mm("--resume-paper-width");
  const violations: string[] = [];

  for (const el of article.querySelectorAll<HTMLElement>(
    ".item, .section-heading",
  )) {
    const box = el.getBoundingClientRect();
    const top = (box.top - rect.top) / scale;
    const bottom = (box.bottom - rect.top) / scale;
    const pageStart = Math.floor(top / pageHeight) * pageHeight;
    const label = (el.textContent ?? "").slice(0, 28).trim();
    if (box.height / scale > pageHeight - margin * 2) continue;
    if (pageStart > 0 && top < pageStart + margin - 1) {
      violations.push(`top band: "${label}"`);
    }
    if (bottom > pageStart + pageHeight - margin + 1) {
      violations.push(`bottom band: "${label}"`);
    }
  }

  return {
    violations,
    scale: Number(scale.toFixed(3)),
    // The pass writes this in CSS px, so it is comparable across zoom levels.
    forcedHeight: Math.round(Number.parseFloat(article.style.height)),
    pages: Math.round(Number.parseFloat(article.style.height) / pageHeight),
    markers: article.querySelectorAll("[data-page-marker]").length,
    spacers: article.querySelectorAll("[data-page-spacer]").length,
  };
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  let failures = 0;

  for (const layoutId of pdfLayoutIds) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const serialized = exportResumeDraft(longDraft(layoutId, 7));
    // esbuild's keepNames wraps named functions in a Node-only `__name` helper;
    // `readReport` runs in the page, so stub it there.
    await page.evaluateOnNewDocument(() => {
      (globalThis as { __name?: unknown }).__name ??= (fn: unknown) => fn;
    });
    await page.evaluateOnNewDocument(
      ({ serialized, key }: { serialized: string; key: string }) =>
        window.localStorage.setItem(key, serialized),
      { serialized, key: RESUME_STORAGE_KEY },
    );
    await page.goto(new URL("/editor", ORIGIN).toString(), {
      waitUntil: "networkidle0",
    });
    // The pass writes the forced height last, so a non-empty one means it ran.
    await page.waitForFunction(
      () =>
        !!document.querySelector<HTMLElement>(".resume-document")?.style
          .height,
      { timeout: 20000 },
    );

    const baseline = await page.evaluate(readReport);

    for (let i = 0; i < ZOOM_CLICKS; i++) {
      await page.click('button[aria-label="Zoom in"]');
    }

    // Force a re-paginate at the new scale — the pass re-runs on draft change (500ms store debounce).
    await page.click('[data-testid="resume-preview-full-name"]');
    await page.waitForSelector('input[name="fullName"]', { timeout: 10000 });
    await page.type('input[name="fullName"]', "x");
    // 500ms autosave debounce, then the pass waits on fonts/images.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const zoomed = await page.evaluate(readReport);
    await page.close();

    if (!baseline || !zoomed) {
      console.log(`FAIL ${layoutId}: no article`);
      failures++;
      continue;
    }

    const problems = [...zoomed.violations];
    if (zoomed.scale <= 1.01) {
      problems.push(`zoom never applied (scale ${zoomed.scale})`);
    }
    if (zoomed.pages !== baseline.pages) {
      problems.push(`pages ${baseline.pages} → ${zoomed.pages} under zoom`);
    }
    if (zoomed.markers !== Math.max(0, zoomed.pages - 1)) {
      problems.push(
        `${zoomed.markers} markers for ${zoomed.pages} pages`,
      );
    }

    if (problems.length) failures++;
    console.log(
      `${problems.length ? "FAIL" : "ok  "} ${layoutId} ` +
        `pages=${baseline.pages} zoomed=${zoomed.pages} scale=${zoomed.scale} ` +
        `spacers=${zoomed.spacers} markers=${zoomed.markers}` +
        (problems.length ? `\n     ${problems.join("\n     ")}` : ""),
    );
  }

  await browser.close();
  console.log(failures ? `\n${failures} failing layouts` : "\nall clear");
  process.exit(failures ? 1 : 0);
}

void main();
