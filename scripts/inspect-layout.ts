/**
 * Renders one real draft through /resume-pdf per layout and reports every inserted
 * spacer and margin-band violation (real item shapes, unlike generated drafts).
 *
 *   pnpm tsx scripts/inspect-layout.ts <draft.json> [layout,layout,...]
 *   SHOTS=1 ... # also write /tmp/layout/<id>.png
 */
import { readFileSync, mkdirSync } from "node:fs";

import puppeteer from "puppeteer";

import {
  exportResumeDraft,
  importResumeDraft,
} from "@/features/resume-editor/domain/draft/resume-draft-storage";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";
import {
  pdfLayoutIds,
  type PdfLayoutId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

const ORIGIN = process.env.BASE_URL ?? "http://localhost:4000";
const [, , draftPath, layoutArg] = process.argv;

if (!draftPath) {
  console.error("usage: tsx scripts/inspect-layout.ts <draft.json> [layouts]");
  process.exit(1);
}

const layouts = (
  layoutArg ? (layoutArg.split(",") as PdfLayoutId[]) : [...pdfLayoutIds]
).filter((id) => pdfLayoutIds.includes(id));

const source = importResumeDraft(readFileSync(draftPath, "utf8"));

async function main() {
  if (process.env.SHOTS) mkdirSync("/tmp/layout", { recursive: true });
  const browser = await puppeteer.launch({ headless: true });

  for (const layoutId of layouts) {
    const draft = {
      ...source,
      pdfPresentation: { ...source.pdfPresentation, layoutId },
    };
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1400, deviceScaleFactor: 2 });
    await page.evaluateOnNewDocument(
      ({ key, value }) => window.sessionStorage.setItem(key, value),
      { key: RESUME_PDF_SESSION_STORAGE_KEY, value: exportResumeDraft(draft) },
    );
    // esbuild (via tsx) wraps named functions in a Node-only `__name` helper that
    // throws in the page; inject it as a source string so esbuild can't rewrite it.
    await page.evaluateOnNewDocument("globalThis.__name = (fn) => fn;");
    await page.goto(new URL("/resume-pdf", ORIGIN).toString(), {
      waitUntil: "networkidle0",
      timeout: 30_000,
    });
    await page.waitForSelector('[data-pdf-ready="true"]', { timeout: 30_000 });

    // Inlined, not a named function: keepNames would wrap it in a Node-only __name() helper.
    const report = await page.evaluate(() => {
  const article = document.querySelector<HTMLElement>(".resume-document");
  if (!article) return null;
  const styles = getComputedStyle(article);
  const px = (name: string) =>
    Number.parseFloat(styles.getPropertyValue(name)) * (96 / 25.4);
  const pageHeight = px("--resume-paper-height");
  const margin = px("--resume-page-margin");
  const top = article.getBoundingClientRect().top;

  const spacers = Array.from(
    article.querySelectorAll<HTMLElement>("[data-page-spacer]"),
  ).map((s) => {
    const next = s.nextElementSibling as HTMLElement | null;
    const rect = next?.getBoundingClientRect();
    const blockTop = rect ? rect.top - top : 0;
    return {
      h: Math.round(s.getBoundingClientRect().height),
      into: Math.round(blockTop - Math.floor(blockTop / pageHeight) * pageHeight),
      tall: rect ? Math.round(rect.height) : 0,
      label: (next?.textContent ?? "").trim().slice(0, 24),
    };
  });

  const bands: string[] = [];
  for (const block of Array.from(
    article.querySelectorAll<HTMLElement>(".section, .item"),
  )) {
    const rect = block.getBoundingClientRect();
    const blockTop = rect.top - top;
    const page = Math.floor(blockTop / pageHeight);
    const label = (block.textContent ?? "").trim().slice(0, 28);
    if (page > 0 && blockTop - page * pageHeight < margin - 1) {
      bands.push(`top band p${page + 1}: "${label}"`);
    }
  }
  return {
    pageHeight: Math.round(pageHeight),
    margin: Math.round(margin),
    spacers,
    bands,
    height: Math.round(article.getBoundingClientRect().height),
  };
});
    if (!report) {
      console.log(`FAIL ${layoutId}: no article`);
      await page.close();
      continue;
    }
    const usable = report.pageHeight - report.margin * 2;
    const big = report.spacers.filter((s) => s.h > usable * 0.4);
    const flags = [
      ...report.bands,
      ...big.map(
        (s) =>
          `spacer ${s.h}px before "${s.label}" (h=${s.tall}, lands ${s.into}px into its page, margin ${report.margin}, usable ${Math.round(usable)})`,
      ),
    ];
    console.log(
      `${flags.length ? "FAIL" : "ok  "} ${layoutId.padEnd(16)} ` +
        `pages=${Math.round(report.height / report.pageHeight)} ` +
        `spacers=[${report.spacers.map((s) => s.h).join(",")}]` +
        (flags.length ? `\n     ${flags.join("\n     ")}` : ""),
    );

    if (process.env.SHOTS) {
      await page.screenshot({
        path: `/tmp/layout/${layoutId}.png`,
        fullPage: true,
      });
    }
    await page.close();
  }

  await browser.close();
}

void main();
