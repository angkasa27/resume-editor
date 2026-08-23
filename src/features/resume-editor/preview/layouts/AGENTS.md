# Layouts — how a résumé page gets drawn

A **layout** is one rendering of the document: columns, header shape, where each
section lands, what the headings look like. Nineteen live in this folder, one per
subdirectory, each with a `README.md` describing what it looks like on paper,
with its gallery screenshots (`public/templates/<preset-id>.webp`) embedded at
the top — read that before editing a layout, especially if you cannot see the
screenshot.

A **layout is not a template.** A template is a layout *plus* a curated style
(accent, font, scale, spacing, line height) and lives in
`domain/presentation/template-presets.ts`. Several templates share one layout.
The gallery shows templates; this folder holds layouts.

## The render path

```
draft → createPreviewRenderContext (engine.ts)   → context
      → PreviewDocumentRoot (kit/document-root)  → sets every --resume-* var,
                                                    data-layout, data-link-highlight
      → your Component({ context, slots })       → the page
```

`slots` arrives pre-built and pre-wrapped for click-to-edit — never rebuild a
section node yourself unless you also reproduce that wrapping:

| slot | what it is |
| --- | --- |
| `slots.header` | your own `Header` component, already rendered |
| `slots.summary` | the summary block, or `null` when empty |
| `slots.sections` | `{ key, node, section? }[]`, in the user's chosen order |

Your Component's root element is the document root's **first child**, which the
shared CSS stretches with `flex: 1 0 auto`. That is what lets a coloured rail or
band reach the bottom paper edge.

## Two ways to build one

**`createSingleColumnLayout(config)`** — header, then a `.layout-body` holding the
summary and every section. Reach for this first; eleven of the nineteen use it.

```tsx
export const classicLayout = createSingleColumnLayout({
  id: "classic",
  label: "Classic",
  description: "…",     // one line, user-visible in the gallery
  styles,               // your own hashed CSS module; only `.layout` is read
  Header: ClassicHeader,
  itemViews: defaultItemViews,
});
```

Optional knobs: `hideSummaryHeading`, `renderSectionHeading`, `inset: "none"`,
and `renderSection` (per-section override — `inset/` uses it to merge skills into
one line).

**Your own `Component`** — needed the moment the structure is not
`header → body`: two columns (`split`, `duet`, `ledger`, `dossier`, `compass`), a
tiling grid (`atlas`), or slots placed out of order (`editorial` puts the summary
inside the opening band). Write a plain `PreviewLayoutDefinition`.

Split sections between columns with `getColumn`. Rail layouts share
`_shared/side-rail-sections.ts` so they can never disagree on what a rail holds
(skills, languages, certifications, references).

## The CSS contract

Your `styles.module.css` is scoped. The factory reads **only `.layout`**; style
everything else through `:global()`. Every value below is set on the document
root by `resolvePdfPresentation`, so a layout never hard-codes a colour, size, or
gap — it consumes these:

| variable | is |
| --- | --- |
| `--resume-accent` / `--resume-on-accent` | the user's accent, and readable text on it |
| `--resume-secondary` / `--resume-on-secondary` | second hue (falls back to accent) |
| `--resume-secondary-tint` | that hue at 90% white — for washes |
| `--resume-text` / `--resume-muted` / `--resume-border` | the neutral ramp |
| `--resume-h1` / `h2` / `h3` / `--resume-body` / `--resume-meta` | the type ramp, off the user's font scale |
| `--resume-font` / `--resume-leading` | family and line height |
| `--resume-gap-section` / `-item` / `-inner` / `--resume-indent` | the spacing ramp |
| `--resume-page-margin` / `--resume-gutter` | page margin, and half of it |
| `--resume-paper-width` / `-height` | A4 or Letter |
| `--resume-photo-aspect` / `-radius` | **only when the user picks a shape** — always `var(…, <your default>)` |

Three properties exist for a layout to *hand a colour back*, because a layout
override would otherwise merely tie with the shared rule on specificity:
`--resume-name-color`, `--resume-headline-color`, `--resume-heading-color`.

Global classes you can style: `.name` `.headline` `.name-block` `.contact-block`
`.contact-line` `.section` `.section-heading` `.item-list` `.item` `.item-header`
`.item-header-main` `.item-header-side` `.item-title` `.item-date` `.item-row`
`.meta` `.rich-text`. `kit/section-kit.tsx` emits the same contract if you build
a section by hand.

## Insets and full-bleed

The document root has **zero padding**. Content gets its margin from the
`page-inset` utilities (`page-inset`, `-x`, `-t`, `-b`), so a decorative surface
can bleed past them to the paper edge. `createSingleColumnLayout` applies
`page-inset` for you; pass `inset: "none"` when the layout paints to an edge
(`aurora`, `crest`, `masthead` do), then re-add the margin on the inner blocks.

## Pagination

`paginate-document.ts` breaks the flow by inserting spacers.

- `.item` already carries `break-inside: avoid`, so breaks land in section gaps.
- Mark a block `data-page-unit=""` when it must move whole and the paginator must
  not descend into it — `atlas` marks each tiling row, because a spacer inside a
  grid would reflow the entire page.

## Printing

Anything that paints — a background, a border colour, a gradient, a counter disc
— needs `print-color-adjust: exact` **and** `-webkit-print-color-adjust: exact`,
or it vanishes in the exported PDF. This is the single most common bug in a new
layout.

## The link cue

Two cues, set per layout, each with a comment saying why. The rule for both:
**the cue must stay weaker than that layout's own section heading.** A layout
whose headings are filled badges can afford a solid underline; one whose headings
are a flat 400-weight label needs a hairline, a dotted rule, or a glyph.

**Contact links** — every layout sets `--resume-link-decoration` and
`--resume-link-offset` at the end of its stylesheet.

**Linked item titles** (project, publication and certification names) are graded
separately, because a bold `h3` carries the same rule more heavily than a contact
line does. Each layout picks exactly one of:

- `--resume-link-title-decoration` (+ optional `--resume-link-title-offset`) — a
  dotted rule, a `0.5px` hairline, or a `color-mix` softened rule.
- `titleLinkMarker: "arrow" | "link"` in `layout.tsx` — a muted lucide glyph after
  the title, for layouts whose language is already iconic (`studio`, `aurora`,
  `compass`, `atlas`, `masthead`, `bold-type`). The glyph reaches the shared
  `PreviewLinkedTitle` by context, so item views need no new prop.

`layout-theming.test.ts` fails a layout that sets neither.

## Registering a new layout

Three edits, all load-bearing:

1. `domain/presentation/pdf-presentation.ts` — add the id to `pdfLayoutIds`, the
   single source of truth.
2. `preview/layout-registry.tsx` — add the definition to
   `previewLayoutDefinitions`.
3. `domain/presentation/template-presets.ts` — add at least one preset. A layout
   with no preset is unreachable from the gallery and fails
   `template-presets.test.ts`.

Then update `layout-registry.test.ts` (it asserts the exact id list) and add a
`README.md` here. Optionally map a persona in `scripts/personas.ts` so
`pnpm screenshots` has content.

> The `AssertEqual` guard in `layout-registry.tsx` claims registry/id drift is a
> compile error. It is not: a layout annotated `: PreviewLayoutDefinition` widens
> its `id` to the whole union and defeats the check. Trust `pnpm test`.

## Checklist for a new or edited layout

- [ ] No hard-coded colour, font size, or gap — every value comes from a `--resume-*` var.
- [ ] Every painted surface sets both `print-color-adjust` properties.
- [ ] `--resume-photo-aspect` / `-radius` consumed as `var(…, <default>)`, never bare.
- [ ] The link cue is set, commented, and quieter than the section heading.
- [ ] Renders with **no photo**, **no headline**, and **no links** — grid columns declared explicitly so the identity block doesn't slide into a gutter.
- [ ] Long name, long job title, and a 20-word section rename all still wrap.
- [ ] `pnpm test` green (`render-snapshot`, `layout-registry`, `layout-theming`, `template-presets`).
- [ ] Checked at both paper sizes and at the smallest and largest font scale.
- [ ] `README.md` in the layout folder written or updated, with every preset's screenshot embedded in a `## Preview` table (relative path `../../../../../../public/templates/<preset-id>.webp`; regenerate with `pnpm screenshots`).

## Index

| Layout | id | The one-line read |
| --- | --- | --- |
| [Classic](classic/README.md) | `classic` | Single column, photo-left header, ruled uppercase headings. The plain baseline. |
| [Modern](modern-centered/README.md) | `modern-centered` | Everything in the header centred under a round photo; short secondary rules under name and headings. |
| [Timeline](timeline/README.md) | `timeline` | Date column left, a continuous vertical rail with an accent dot at every item. |
| [Academic](academic/README.md) | `academic` | Small-caps headings, italic dates, indented bodies. CV conventions. |
| [Inset](inset/README.md) | `inset` | Headings live in a 110px label rail; skills collapse to one inline line. |
| [Split](split/README.md) | `split` | Full-height secondary-coloured rail on the **left** with photo and contacts. |
| [Duet](duet/README.md) | `duet` | Near-even columns; the left one is painted accent; headings are centred bands. |
| [Bold Type](bold-type/README.md) | `bold-type` | Oversized name and headings under highlighter-marker bands. |
| [Studio](studio/README.md) | `studio` | Every heading badged with an icon chip; dates are pills, skills are chips. |
| [Aurora](aurora/README.md) | `aurora` | Soft gradient wash bleeding off the top edge, over a label-gutter body. |
| [Ledger](ledger/README.md) | `ledger` | Monochrome. A single hairline spine down the middle; accent spent on one short rule. |
| [Dossier](dossier/README.md) | `dossier` | Mirror of Split — narrow coloured rail on the **right**, chapter-title headings. |
| [Crest](crest/README.md) | `crest` | Solid accent band across the top carrying a centred photo, name, and contact strip. |
| [Masthead](masthead/README.md) | `masthead` | Bleeding square photo beside an accent name plate; headings are filled badges. |
| [Compass](compass/README.md) | `compass` | Section icons hang in the margin; a plain contact rail sits right. |
| [Numeral](numeral/README.md) | `numeral` | Sections numbered `01`, `02`; a fixed date gutter and a labelled contact table. |
| [Atlas](atlas/README.md) | `atlas` | Sections tile across three tracks, wide/narrow alternating; items numbered in discs. |
| [Editorial](editorial/README.md) | `editorial` | Magazine opening: tinted band with the summary as a display pull quote. |
| [Harvard](harvard/README.md) | `harvard` | The MCS format. One type size, bold as the only emphasis, no colour. |
