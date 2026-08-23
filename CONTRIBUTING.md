# Contributing

Thank you for considering a contribution! Here's what you need to know.

## Development Setup

```bash
git clone https://github.com/angkasa27/resummme.git
cd resummme
pnpm install
cp .env.example .env.local   # fill in any keys you need
pnpm dev
```

## Before You Start

- For **bug fixes** — open an issue first (unless it's trivial) so we can confirm the bug and agree on a fix.
- For **new features** — open an issue and discuss the approach before writing code. Not every feature fits the project scope.
- For **UI/UX changes** — describe the problem you're solving, not just the solution.

## Workflow

1. Fork the repo and create a branch from `master`:
   ```bash
   git checkout -b fix/short-description
   # or
   git checkout -b feat/short-description
   ```
2. Make your changes.
3. Run the checks:
   ```bash
   pnpm typecheck   # must pass
   pnpm lint        # must pass
   pnpm test        # must pass
   ```
4. Open a pull request against `master`. Fill in the PR template.

## Code Style

- TypeScript strict mode — no `any`, no type assertions unless unavoidable.
- Comments explain _why_ (hidden constraints, surprising invariants, workarounds), never _what_.
- Use the canonical vocabulary in [CONTEXT.md](CONTEXT.md): an **item** (never "entry") lives in a section; a **layout** is the rendering; a **template** is a layout plus a curated **presentation** — the gallery shows templates.
- Every editor form auto-saves; there is no Save or Cancel button anywhere in the editor. Read [docs/save-flow.md](docs/save-flow.md) before you touch one — persistence is a side effect of typing, so a broken save looks like a working app until reload.
- Prefer editing existing files to creating new ones. No premature abstractions.
- React 19 rules: no component creation during render, no `setState` in `useEffect` for syncing external state (use `useSyncExternalStore` instead).
- New client components that use `window` must handle SSR (`typeof window === "undefined"` guard or `useSyncExternalStore` `getServerSnapshot`).

## Adding a Layout or a Template

Two different things, and the codebase keeps them apart:

- A **layout** is the rendering — columns, header shape, section order. It lives in `src/features/resume-editor/preview/layouts/<layout-id>/`.
- A **template** is what the gallery shows: a layout plus a curated presentation (accent, font, scale, spacing, line height). It is one entry in [template-presets.ts](src/features/resume-editor/domain/presentation/template-presets.ts). Several templates can share one layout.

> **Whether you are adding a layout or changing one, read [`preview/layouts/AGENTS.md`](src/features/resume-editor/preview/layouts/AGENTS.md) first** — human or agent. It is the authoring guide: the render path and the `slots` a layout is handed, the `--resume-*` CSS contract, insets and full-bleed, pagination, print colour, and the link-cue rule. Every layout folder also has a `README.md` describing what that layout looks like on paper; if you are an agent that cannot see the screenshots, that file is your view of the page.

### A new layout

Start from the `README.md` of the closest existing layout, then register it. Three edits, all load-bearing:

1. Add the id to `pdfLayoutIds` in [pdf-presentation.ts](src/features/resume-editor/domain/presentation/pdf-presentation.ts) — the single source of truth for layout ids.
2. Add the layout to `previewLayoutDefinitions` in [layout-registry.tsx](src/features/resume-editor/preview/layout-registry.tsx).
3. Add at least one preset in `template-presets.ts`. A layout with no preset is unreachable from the gallery, and `template-presets.test.ts` fails on it.

Then update `layout-registry.test.ts` (it asserts the exact id list), add a `README.md` to the layout folder, and optionally map a persona in [personas.ts](scripts/personas.ts) so `pnpm screenshots` has content to render.

### A new template

Add an entry to `resumeTemplatePresets` in `template-presets.ts` pointing at an existing `layoutId`. Ids must be globally unique, and `secondary` is only set for layouts that actually render it — the curation rules are commented at the top of that array.

## Adding a Font

Fonts are defined in [font-collection.ts](src/features/resume-editor/domain/presentation/font-collection.ts).

- For **Google Fonts**: add a `next/font/google` import in [fonts.ts](src/app/fonts.ts), expose it as a CSS variable (e.g. `--font-my-font`), add the variable to the `<html>` classNames in [layout.tsx](src/app/layout.tsx), then add the font entry to `RESUME_FONTS` with the CSS-variable stack.
- For **system fonts**: add the entry directly to `RESUME_FONTS` with the CSS font-stack string — no import needed.

## Generating Screenshots

Screenshots of the editor and the templates are committed (`public/` and `public/templates/`). Regenerate them before committing any change to layout styles or the canvas editor.

The script drives headless Puppeteer against a running app and refuses to start without one, so bring the app up first:

```bash
pnpm dev          # terminal 1 (or `pnpm build && pnpm start`)
pnpm screenshots  # terminal 2
```

It captures against `http://localhost:4000` and overwrites the template and builder images in place. Point it elsewhere with `SCREENSHOT_BASE_URL`.

## Tests

Tests live next to the code they test (`*.test.ts` / `*.test.tsx`). The test suite covers:

- Domain logic (schema parsing, ATS scoring, keyword matching, presentation resolver)
- Server route smoke tests
- UI component rendering

Run `pnpm test:watch` during development. The suite must be green before merging.

## Questions

Open a [GitHub Discussion](../../discussions) for anything that doesn't fit a bug report or feature request.
