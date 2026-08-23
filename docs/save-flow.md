# Save flow — how an edit reaches the document

Every keystroke in a section form travels the same path. Six bugs have come from
breaking one of the invariants below, all with the same symptom class: the form
and the document silently disagree. Read this before touching `useAutoSave`, the
store's commit path, or anything that renders a registered input.

## The path

```
input → react-hook-form → useAutoSave (debounce 500ms)
      → onSave(values)   → store.saveSection / saveProfile
      → commit()         → storage.save() → parseResumeDraft (lenient)
      → set({ draft })   → preview re-renders from the store
```

Only four files matter:

| File | Owns |
| --- | --- |
| `forms/use-auto-save.ts` | debounce, flush, re-seed — both directions |
| `forms/use-collection-items-form.ts` | form values ↔ persisted section value |
| `state/resume-editor-store.ts` | commit, undo/redo history, `revision` |
| `state/use-resume-editor-controller.ts` | every store passthrough, the imports and exports, and the only `flushOpenForms` callers |

Not every write comes from a form. Style controls, template presets, section
rename/reorder/visibility, the two AI dialogs in Insights, and import all call
`saveSection`/`savePdfPresentation`/`replaceDraft` directly. Those are safe only
because no section form is mounted at the time (the sidebar rail and the mobile
tab each render one panel) — a new caller has to re-check that, or bump the
revision.

There is no separate "save" button, and no form submit. Persistence is a side
effect of editing, so anything that silently skips a save looks exactly like a
working app until the user reloads.

## Two commit shapes

`commit()` is the normal one: persist, push the previous draft onto `undoStack`,
clear `redoStack`, and optionally bump `revision`.

`saveInsights` deliberately uses neither half — analyzing a job description isn't
a document edit, so it must not burn an undo slot or kill a pending redo. The
cost is that history entries predating the analysis carry the *old* job target,
so `undo`/`redo` run the restored draft through `carryInsights` to keep the live
one. Anything else that stores non-document state belongs on that same path.

## Invariants

**1. The last-saved snapshot is a string, never an object.**
`getValues()` hands back nested objects (collection items) *by reference*, and
RHF mutates them in place. An object snapshot therefore aliases the live values:
after the first save every later edit compares equal and nothing is ever saved
again. Flat forms (profile, summary) hide the bug — their top-level strings are
copied out — so it presents as "only section item forms are broken".

**2. `save()` is idempotent.**
It saves only when the serialized values differ, and it clears any debounce it
beats. Both halves matter: a re-seed applies values field by field, and those
half-applied states arm the debounce. If that timer fires it commits values
identical to the ones just seeded, which — because `commit()` clears
`redoStack` — silently kills redo.

**3. Only real items get persisted.**
Removing a collection row leaves a ghost in the form: the card stays mounted
through its exit animation, and its `Controller`-driven fields write themselves
back into the index `remove()` just spliced out, leaving a partial like
`{ startDate, endDate }`. `normalizeCollectionItem` would fill that out from the
template into a complete blank item — the deleted row, resurrected. Real items
always carry an `id`; a ghost rebuilt from rendered fields never does, so
`toSectionValue` filters on that.

**4. A re-seed must write the DOM itself.**
The app builds with `reactCompiler: true`. The compiler memoizes the field
components on props that never change (`form` is a stable ref, `name`/`label`
are constants), so **they do not re-render after mount**. RHF's uncontrolled
inputs normally pick up a `reset` when `register` re-attaches on the next
render — that render never comes. So the re-seed resets with
`keepFieldsRef: true` (to keep the refs reachable) and then walks the value tree
calling `setValue` per leaf path. Reset's own write-back can't be used: it
empties RHF's mounted-name list, so it goes silent from the *second* re-seed on.

> This one cannot be reproduced in vitest — jsdom runs without the compiler, so
> a plain `reset` looks fine there. Verify re-seeds in a real browser.

**5. `revision` means "the draft was replaced".**
Bumped by `undo`, `redo`, `replaceDraft` — and by `autoSortSection`, which
rewrites the items the open form is showing. A bump makes the open form re-seed
and *abandon* its pending edit, which is what stops a stale in-flight value from
being flushed back over the replacement. Never bump it for a form's own save.

**6. Anything that reads the draft from outside the store must flush first —
and then re-read.**
Auto-sort reads the stored items and then bumps the revision, so an edit still
in the debounce would be both ignored by the sort and discarded by the re-seed.
The exports have the same problem with no replace at all: typing and hitting
Download PDF within 500ms used to produce a file missing the last keystrokes.

Both halves are load-bearing. `flushOpenForms()` dispatches synchronously and
`commit` sets synchronously, so the store is current the instant it returns — but
a captured `draft` prop or closure is *not*, since React has not re-rendered.
Flush, then read `store.getState().draft`. A bare flush fixes nothing.

Undo/redo/import deliberately do *not* flush — there, flushing is precisely the
clobber invariant 5 prevents.

## Traps

- **The store is the only source of truth for the preview.** A change that
  reaches RHF but not the store renders nowhere. "It shows in the form" proves
  nothing.
- **A rejected draft throws, and must keep throwing.** `parseResumeDraft` runs
  inside `storage.save()`, so an invalid draft aborts the write, leaves the store
  and preview on the old value, and propagates out of a `setTimeout` with no UI.
  `save()` flips the status to `"error"` first so the header indicator stops
  claiming "Saved" — but it rethrows, because `useAutoSave` updates its snapshot
  only *after* `onSave` returns. Swallow it and the lost edit is marked persisted
  and never retried.
- **Every section schema requires `items.min(1)`.** A section reaching zero items
  makes the whole draft fail to parse and kills the commit. Deleting the last
  row is disabled in the UI; keep it that way.
- **The persisted schema is deliberately lenient** (dates, URLs and emails are
  plain strings). Format validation is advisory and lives in the form resolver,
  so a mid-typed value is never rejected or dropped.

## Verifying a change

Unit tests cover the invariants that survive jsdom:

```bash
pnpm vitest run src/features/resume-editor/forms src/features/resume-editor/state
```

Anything touching re-seeding needs a browser (invariant 4). With `pnpm dev`
running, in an open section form:

1. Type in a text field → wait 1s → the preview updates.
2. Type in a *second* field → wait 1s → it updates too. (Invariant 1 — the
   regression only shows on the second edit.)
3. Type in the rich-text field → wait 1s → the preview updates.
4. Add an item, type in it, delete it → it stays gone after a reload.
   (Invariant 3.)
5. Type, then hit Sort within 500ms → the typing survives. Same for Download PDF
   and Export JSON: the file carries the last keystrokes. (Invariant 6.)
6. Make three separate edits, then Undo three times → the inputs and the preview
   agree at every step, and Redo is enabled. (Invariants 2 and 4 — the second
   and third undo are the ones that catch it.)
