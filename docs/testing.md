# Testing

Two tiers. The first runs on every push; the second needs a browser and a
running app, so it runs by hand.

## Tier 1 — `pnpm test` (Vitest, in CI)

Tests live next to the code they test: `foo.ts` gets `foo.test.ts`. There is no
`tests/` directory and there should not be one — colocation is the convention.

### Which environment a test gets

`vitest.config.ts` defines two projects, and the file extension picks between
them:

| File | Project | Environment |
| --- | --- | --- |
| `*.test.ts` | `node` | `node`, no setup file |
| `*.test.tsx` | `dom` | `jsdom`, loads `src/test/setup.ts` |

Most of the suite is pure functions — domain logic, the presentation resolver,
server modules, API route handlers — and none of it needs a DOM. Booting jsdom
for those cost more than running them, so the default is `node`.

A handful of `.ts` tests have no JSX but do drive real DOM nodes
(`local-draft-storage`, `paginate-document`, `use-keyboard-shortcuts`). They are
listed by name in `domUnits` in `vitest.config.ts`, which moves them into the
`dom` project. **If you write a `.ts` test that touches `document`, `window`, or
`localStorage`, add it to that list** — otherwise it fails with
`document is not defined`.

Don't reach for a `// @vitest-environment` docblock. One list in the config is
easier to audit than a comment buried in a file, and a docblock would skip
`setup.ts` (jest-dom matchers, the `matchMedia` / `ResizeObserver` / `Range`
stubs) and fail in confusing ways.

### Fixtures

`createDefaultResumeDraft()` is the starting point for any draft fixture — mutate
a copy rather than writing a literal.

`src/test/drafts.ts` holds fixtures with more than one consumer. A fixture used
by exactly one test belongs in that test file. Don't promote a fixture on
speculation; move it when the second consumer actually shows up.

## Tier 2 — e2e checks (Puppeteer, by hand)

These assert things a unit test cannot see: real layout geometry, and what
Chrome actually prints. They drive a running app, so start one first.

```bash
pnpm dev            # terminal 1
pnpm e2e:pagebreak  # terminal 2 — PDF=1 also writes /tmp/pagebreak/<layout>.pdf
pnpm e2e:pagination
```

- **`e2e:pagebreak`** sweeps all 25 layouts × 9 content shapes and asserts no
  block lands in a page's margin band. With `PDF=1` it also prints each case and
  compares the sheet count against the laid-out page count — the only way to
  catch a sub-pixel spill that prints a blank trailing sheet.
- **`e2e:pagination`** asserts the zoomed editor preview paginates identically to
  the export. The two can silently disagree, because the pagination pass only
  re-runs while zoomed after an edit.

Both exit non-zero on failure. **Run them before merging any change to
`paginate-document.ts`, a layout's `styles.module.css`, or the print pipeline.**
CI does not run them; nothing but you will catch a page-break regression.

`pnpm inspect:layout` is a debugging tool, not a check — it dumps computed
geometry for one layout and always exits zero.
