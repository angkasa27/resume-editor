/**
 * Generates landing-page screenshots (public/templates/<id>.webp and public/builder.webp),
 * reusing the /resume-pdf render path.
 * Usage: pnpm dev && pnpm screenshots
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

import puppeteer, { type Browser } from "puppeteer";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { exportResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";
import {
  applyTemplatePreset,
  resumeTemplatePresets,
  type ResumeTemplatePreset,
} from "@/features/resume-editor/domain/presentation/template-presets";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";
import { PERSONAS, type Persona } from "./personas";

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:4000";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const TEMPLATES_DIR = path.join(PUBLIC_DIR, "templates");
const TIMEOUT = 30_000;

const ul = (bullets: string[]) =>
  `<ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`;

/** Deterministic PRNG so the persona→preset mapping is stable between runs. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle backed by a seeded PRNG (reproducible "random" order). */
function seededShuffle<T>(items: ReadonlyArray<T>, seed: number): T[] {
  const copy = [...items];
  const random = seededRandom(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * The landing carousel derives from the preset list, so every preset needs a
 * shot. Ten shared personas are shuffled once and mapped round-robin onto the
 * presets — same seed, same screenshot, so re-runs don't churn the webps.
 */
const PERSONA_BY_PRESET_ID: ReadonlyMap<string, Persona> = new Map(
  seededShuffle(resumeTemplatePresets, 42).map((preset, i) => [
    preset.id,
    PERSONAS[i % PERSONAS.length],
  ]),
);

function buildDraft(p: Persona, preset: ResumeTemplatePreset): ResumeDraft {
  const draft = createDefaultResumeDraft();
  draft.pdfPresentation = applyTemplatePreset(preset, draft.pdfPresentation);
  draft.profile = {
    ...draft.profile,
    fullName: p.fullName,
    location: p.location,
    phone: p.phone,
    email: p.email,
    photo: p.photo,
    extraLinks: p.links.map((url, i) => ({
      id: `link-${preset.id}-${i}`,
      url,
    })),
  };

  const s = draft.sections;
  const workBase = s.workExperience.items[0];
  const projectBase = s.projects.items[0];
  const certBase = s.certifications.items[0];

  s.summary = { ...s.summary, content: p.summary };
  s.workExperience = {
    ...s.workExperience,
    items: p.work.map((w, i) => ({
      ...workBase,
      id: `work-${preset.id}-${i}`,
      companyName: w.company,
      position: w.position,
      location: w.location,
      startDate: w.start,
      endDate: w.end,
      description: ul(w.bullets),
    })),
  };
  s.skills = {
    ...s.skills,
    items: [
      {
        ...s.skills.items[0],
        categoryName: p.skills.category,
        skills: p.skills.items,
      },
    ],
  };
  s.projects = {
    ...s.projects,
    items: p.projects.map((pr, i) => ({
      ...projectBase,
      id: `project-${preset.id}-${i}`,
      projectName: pr.name,
      startDate: pr.start,
      endDate: pr.end,
      description: ul(pr.bullets),
    })),
  };
  s.certifications = {
    ...s.certifications,
    visible: true,
    items: p.certs.map((c, i) => ({
      ...certBase,
      id: `cert-${preset.id}-${i}`,
      certificationName: c.name,
      issuingOrganization: c.org,
      issuedDate: c.date,
    })),
  };
  s.education = {
    ...s.education,
    items: [
      {
        ...s.education.items[0],
        name: p.education.name,
        location: p.education.location,
        startDate: p.education.start,
        endDate: p.education.end,
        degree: p.education.degree,
        gpa: p.education.gpa,
        description: ul([p.education.note]),
      },
    ],
  };
  return draft;
}

/** Forces exactly one A4 page so the clipped screenshot is portrait-proportioned (runs in the browser). */
function shapeAsA4Page() {
  const el = document.querySelector<HTMLElement>(".resume-document");
  if (!el) return;
  const cs = getComputedStyle(el);
  const paper = cs.getPropertyValue("--resume-paper-width").trim();
  el.style.boxSizing = "border-box";
  el.style.alignSelf = "flex-start";
  // The pagination pass (paginate-document.ts) pins a min-height of N whole pages;
  // clear it or a multi-page persona becomes an N-page thumbnail.
  el.style.minHeight = "0";
  if (paper) el.style.width = paper;
  // One A4 page tall (210:297); overflow is cropped so all screenshots match.
  el.style.height = `${el.offsetWidth * 1.41421}px`;
  el.style.overflow = "hidden";
}

/** SCREENSHOT_ONLY=id1,id2 re-shoots just those presets — otherwise adding one template rewrites all ~36 webps. */
function selectedPresets() {
  const only = process.env.SCREENSHOT_ONLY?.split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!only?.length) return resumeTemplatePresets;
  const selected = resumeTemplatePresets.filter((preset) =>
    only.includes(preset.id),
  );
  const unknown = only.filter(
    (id) => !resumeTemplatePresets.some((preset) => preset.id === id),
  );
  if (unknown.length > 0) {
    throw new Error(`SCREENSHOT_ONLY names no such preset: ${unknown.join(", ")}`);
  }
  return selected;
}

async function captureTemplates(browser: Browser) {
  for (const preset of selectedPresets()) {
    const persona = PERSONA_BY_PRESET_ID.get(preset.id);
    if (!persona)
      throw new Error(`No persona mapped for preset ${preset.id}`);
    const serialized = exportResumeDraft(buildDraft(persona, preset));

    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1800, deviceScaleFactor: 2 });
    await page.evaluateOnNewDocument(
      ({ key, value }) => window.sessionStorage.setItem(key, value),
      { key: RESUME_PDF_SESSION_STORAGE_KEY, value: serialized },
    );

    await page.goto(new URL("/resume-pdf", BASE_URL).toString(), {
      waitUntil: "networkidle0",
      timeout: TIMEOUT,
    });
    await page.waitForSelector('[data-pdf-ready="true"]', { timeout: TIMEOUT });
    await page.evaluate(shapeAsA4Page);

    const article = await page.$(".resume-document");
    if (!article)
      throw new Error(`No .resume-document rendered for ${preset.id}`);

    const out = path.join(TEMPLATES_DIR, `${preset.id}.webp`);
    await article.screenshot({
      path: out as `${string}.webp`,
      type: "webp",
      quality: 90,
    });
    console.log(`✓ template  ${preset.id.padEnd(16)} ${persona.fullName}`);
    await page.close();
  }
}

async function captureBuilder(browser: Browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(new URL("/editor", BASE_URL).toString(), {
    waitUntil: "networkidle0",
    timeout: TIMEOUT,
  });
  await page
    .waitForSelector(".resume-document", { timeout: TIMEOUT })
    .catch(() => undefined);
  await new Promise((resolve) => setTimeout(resolve, 1_500));

  const out = path.join(PUBLIC_DIR, "builder.webp");
  await page.screenshot({
    path: out as `${string}.webp`,
    type: "webp",
    quality: 92,
  });
  console.log(`✓ builder   ${"editor".padEnd(16)} → public/builder.webp`);
  await page.close();
}

async function assertServerUp() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Cannot reach ${BASE_URL} (${reason}). Start the app first: \`pnpm dev\` (or \`pnpm build && pnpm start\`).`,
    );
  }
}

async function main() {
  await assertServerUp();
  await mkdir(TEMPLATES_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  try {
    await captureTemplates(browser);
    // A targeted re-shoot means "these templates changed", not "the editor did".
    if (!process.env.SCREENSHOT_ONLY) await captureBuilder(browser);
  } finally {
    await browser.close();
  }
  console.log("✓ Screenshots generated.");
}

main().catch((error) => {
  console.error(`✖ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
