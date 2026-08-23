# CONTEXT.md — domain glossary

Canonical vocabulary for Resummme, a résumé editor. Use these terms in code,
UI copy, and docs. When a doc or identifier disagrees with this file, this file
wins.

## The document

**Draft** — the resume being edited: profile, sections, presentation, insights.
There is no bare "Resume" object. One active draft exists per session; it is
autosaved on every edit (there is no save button).

**Profile** — the identity content: name, headline, contacts, photo. Rendered
by a layout's header. **Not a section** — it cannot be reordered, hidden,
renamed, or emptied.

**Section** — a titled block of the résumé that the user can reorder, hide, and
rename. Two kinds:
- **Collection section** — holds **items** (work experience, projects,
  education, skills, publications, certifications, awards, languages,
  references, volunteering).
- **Summary** — the single prose section; has content instead of items.

The header is *not* a section, even though users may perceive it as one because
the editor lists Profile above the sections.

**Item** — one entry inside a collection section (one job, one project, one
degree). The word is always "item" — never "entry", never "block".

## The editor

**Panel** — an editor surface in the sidebar rail: the Profile panel, one panel
per section, Insights, Design. A panel is UI, not document structure — "profile"
is a panel but not a section.

**Gallery** — the template browser in the Design tab.

## Appearance

**Layout** — the rendering structure of the document: columns, header shape,
where sections land, what headings look like. Purely structural; carries no
colours or fonts of its own.

**Presentation** — the live visual state: accent colour, font family and scale,
spacing, line height, paper size. What the Customize tab edits and what a
template application overwrites.

**Template** — a layout plus a curated presentation, shown in the gallery.
Several templates can share one layout. The word is reserved for this — never
use "template" for a default-object used when creating an item.

## Decided usages

- "item", not "entry" — including in user-facing copy.
- "header" is a part of every layout, fed by the Profile — never a section.
- "template" means only layout + presentation.
