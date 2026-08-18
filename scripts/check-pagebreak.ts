/**
 * Verifies the multi-page export — asserts no block lands in a page's margin band.
 * Usage: pnpm tsx scripts/check-pagebreak.ts (PDF=1 also writes /tmp/pagebreak/<layout>.pdf)
 */
import { pathToFileURL } from "node:url";

import puppeteer from "puppeteer";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { exportResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import {
  pdfLayoutIds,
  type PdfLayoutId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

const ORIGIN = process.env.BASE_URL ?? "http://localhost:4000";

export function longDraft(layoutId: PdfLayoutId, workCount: number): ResumeDraft {
  const draft = createDefaultResumeDraft();
  const s = draft.sections;

  // workCount 0: the short-résumé case — must export as exactly one page, no
  // blank trailing sheet. Sections are hidden, not emptied (schema needs ≥1 item).
  if (workCount === 0) {
    s.projects = { ...s.projects, visible: false };
    s.certifications = { ...s.certifications, visible: false };
    s.languages = { ...s.languages, visible: false };
    s.references = { ...s.references, visible: false };
    s.organizationVolunteering = {
      ...s.organizationVolunteering,
      visible: false,
    };
    s.awards = { ...s.awards, visible: false };
    s.workExperience = {
      ...s.workExperience,
      items: [s.workExperience.items[0]],
    };
    return { ...draft, pdfPresentation: { ...draft.pdfPresentation, layoutId } };
  }

  // workCount -1: one item taller than the usable page — allowed to fragment,
  // else break-inside: avoid moves it at print time (44 bullets is load-bearing).
  if (workCount === -1) {
    const bullets = Array.from(
      { length: 44 },
      (_, i) =>
        `<li>Bullet ${i + 1}: led a migration, cut load time, mentored engineers, and shipped a design system used across six squads.</li>`,
    ).join("");
    const one = s.workExperience.items[0];
    s.workExperience = {
      ...s.workExperience,
      items: [{ ...one, description: `<ul>${bullets}</ul>` }],
    };
    return {
      ...draft,
      pdfPresentation: { ...draft.pdfPresentation, layoutId },
    };
  }

  // workCount -2: a prose section (no .item) crossing a page — only the heading
  // and first lines must stay together, so the largest gap stays under a page.
  if (workCount === -2) {
    const sentence =
      "Software engineer with a decade of experience building resilient, accessible interfaces for enterprise teams. ";
    s.summary = { ...s.summary, content: `<p>${sentence.repeat(60)}</p>` };
    s.workExperience = {
      ...s.workExperience,
      items: [s.workExperience.items[0]],
    };
    return { ...draft, pdfPresentation: { ...draft.pdfPresentation, layoutId } };
  }

  const work = s.workExperience.items[0];
  s.workExperience = {
    ...s.workExperience,
    items: Array.from({ length: workCount }, (_, i) => ({
      ...work,
      id: `work-${i}`,
      companyName: `${work.companyName} ${i + 1}`,
    })),
  };
  const project = s.projects.items[0];
  s.projects = {
    ...s.projects,
    items: Array.from({ length: 4 }, (_, i) => ({
      ...project,
      id: `project-${i}`,
      projectName: `${project.projectName} ${i + 1}`,
    })),
  };
  return { ...draft, pdfPresentation: { ...draft.pdfPresentation, layoutId } };
}

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

// Guarded so check-preview-pagination.ts imports longDraft without running this sweep.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void main();
}
