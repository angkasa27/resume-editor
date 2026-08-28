/**
 * Verifies the multi-page export — asserts no block lands in a page's margin band.
 * Needs a dev server; see docs/testing.md.
 * Usage: pnpm e2e:pagebreak (PDF=1 also writes /tmp/pagebreak/<layout>.pdf)
 */
import puppeteer from "puppeteer";

import { exportResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";
import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { longDraft } from "@/test/drafts";

const ORIGIN = process.env.BASE_URL ?? "http://localhost:4000";

/** Chrome writes the page tree uncompressed; `[^s]` excludes `/Type /Pages`. */
function countPdfPages(pdf: Buffer): number {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  let failures = 0;

  for (const layoutId of pdfLayoutIds) {
    for (const workCount of [-2, -1, 0, 1, 5, 6, 7, 9, 12]) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 1800 });
      const serialized = exportResumeDraft(longDraft(layoutId, workCount));
      await page.evaluateOnNewDocument(
        ({ serialized, key }: { serialized: string; key: string }) =>
          window.sessionStorage.setItem(key, serialized),
        { serialized, key: RESUME_PDF_SESSION_STORAGE_KEY },
      );
      await page.goto(new URL("/resume-pdf", ORIGIN).toString(), {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector('[data-pdf-ready="true"]', { timeout: 20000 });

      const report = await page.evaluate(() => {
        const PX_PER_MM = 96 / 25.4;
        const article = document.querySelector<HTMLElement>(".resume-document");
        if (!article) return null;
        const styles = getComputedStyle(article);
        const pageHeight =
          Number.parseFloat(styles.getPropertyValue("--resume-paper-height")) *
          PX_PER_MM;
        const margin =
          Number.parseFloat(styles.getPropertyValue("--resume-page-margin")) *
          PX_PER_MM;
        const articleTop = article.getBoundingClientRect().top;
        const violations: string[] = [];

        for (const el of article.querySelectorAll<HTMLElement>(
          ".item, .section-heading, .rich-text > ul > li, .rich-text > ol > li",
        )) {
          const rect = el.getBoundingClientRect();
          const top = rect.top - articleTop;
          const bottom = rect.bottom - articleTop;
          const pageStart = Math.floor(top / pageHeight) * pageHeight;
          const pageEnd = pageStart + pageHeight;
          const label = (el.textContent ?? "").slice(0, 28).trim();
          // data-page-unit children are exempt: the parent moves as one block
          // and a spacer would become another grid item and reflow the tiling.
          if (el.closest("[data-page-unit]")) continue;
          // Every block gets its top-margin correction, so the top band must stay
          // clear even for blocks the pass let fragment.
          if (pageStart > 0 && top < pageStart + margin - 1) {
            violations.push(
              `top band: "${label}" at +${(top - pageStart).toFixed(0)}px`,
            );
          }
          // Blocks taller than a page can hold break where they fall — no bottom assertion for them.
          if (rect.height > pageHeight - margin * 2) continue;
          // Fragmentable blocks span the break on purpose; only the head
          // (headBottom(), title + a couple of lines) must clear the band.
          let boundary = bottom;
          if (el.style.breakInside === "auto") {
            const head = el.querySelector<HTMLElement>(
              ".item-title, .section-heading",
            );
            if (head) {
              const headRect = head.getBoundingClientRect();
              boundary = Math.min(
                bottom,
                headRect.bottom - articleTop + headRect.height * 2,
              );
            }
          }
          if (boundary > pageEnd - margin + 1) {
            violations.push(
              `bottom band: "${label}" ${(pageEnd - boundary).toFixed(0)}px from edge`,
            );
          }
        }
        return {
          violations,
          margin: Math.round(margin),
          pages: Math.round(article.getBoundingClientRect().height / pageHeight),
          // Largest gap — near a full page means something moved wholesale
          // that should have been allowed to flow.
          maxGap: Math.round(
            Math.max(
              0,
              ...Array.from(
                article.querySelectorAll<HTMLElement>("[data-page-spacer]"),
                (spacer) => spacer.getBoundingClientRect().height,
              ),
            ),
          ),
          // Blocks the pass let fragment (spacers share the style — excluding them avoids counting gaps).
          fragmented: article.querySelectorAll(
            '.section[style*="break-inside: auto"], .item[style*="break-inside: auto"]',
          ).length,
        };
      });

      // report.pages is what the pass laid out; a sub-pixel spill prints as a blank
      // sheet the DOM can't see, so only the real PDF catches it.
      let pdfPages: number | null = null;
      if (process.env.PDF) {
        const buffer = await page.pdf({
          path: `/tmp/pagebreak/${layoutId}-x${workCount}.pdf`,
          format: "a4",
          printBackground: true,
          margin: { top: "0", right: "0", bottom: "0", left: "0" },
        });
        pdfPages = countPdfPages(Buffer.from(buffer));
      }

      await page.close();
      if (!report) {
        console.log(`FAIL ${layoutId} x${workCount}: no article`);
        failures++;
        continue;
      }
      const violations = [...report.violations];
      if (pdfPages !== null && pdfPages !== report.pages) {
        violations.push(
          `printed ${pdfPages} sheets for ${report.pages} laid-out pages`,
        );
      }
      if (violations.length) failures++;
      console.log(
        `${violations.length ? "FAIL" : "ok  "} ${layoutId} x${workCount} ` +
          `pages=${report.pages}${pdfPages === null ? "" : ` pdf=${pdfPages}`} ` +
          `fragmented=${report.fragmented} maxGap=${report.maxGap} margin=${report.margin}` +
          (violations.length ? `\n     ${violations.join("\n     ")}` : ""),
      );
    }
  }

  await browser.close();
  console.log(failures ? `\n${failures} failing cases` : "\nall clear");
  process.exit(failures ? 1 : 0);
}

void main();
