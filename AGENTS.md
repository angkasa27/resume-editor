<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Vocabulary

`CONTEXT.md` is the canonical glossary (Draft, Profile, Section, Item, Panel,
Layout, Presentation, Template). Use those terms in code, UI copy, and docs;
when something disagrees, the glossary wins.

# Design system

Read `docs/design-system.md` before touching a form, a control surface, spacing, typography, a button, or an interaction state (hover / focus / selected / press) under `src/features` or `src/components/ui`. It owns the spacing scale (4/8/12/16), the type ramp, the placeholder-carries-the-label recipe, the button table, the ring-vs-fill rule, and the Field API; six ESLint rules enforce parts of it. The landing page is exempt.

# Save flow

Read `docs/save-flow.md` before touching `forms/use-auto-save.ts`, the store's commit path, `revision`, or anything that renders a registered input. There is no save button — persistence is a side effect of typing, so a broken save looks like a working app until reload. The doc holds the six invariants that keep the form, the store, and the preview in agreement, including why `reactCompiler` means a re-seed has to write the DOM itself.

# Résumé layouts

Read `src/features/resume-editor/preview/layouts/AGENTS.md` before adding, editing, or restyling any layout under `preview/layouts/` — including a header, a section heading, an item view, or a `styles.module.css`. It holds the render contract a layout has to honour: the `slots` it is handed, the `--resume-*` variables it must consume instead of hard-coding, full-bleed insets, `data-page-unit` pagination, the `print-color-adjust` pair every painted surface needs, and the link-cue rule. Each layout folder also has a `README.md` describing what that layout looks like on paper — read it when you cannot see the screenshot.

Note the vocabulary: a **layout** is the rendering; a **template** is a layout plus a curated style preset. The gallery shows templates.

<!-- rtk-instructions v2 -->

# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. RTK got dedicated filter → use it. If not → pass through unchanged. So RTK always safe.

**Important**: Even in command chains with `&&`, use `rtk`:

```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

Full command-by-workflow reference (git, GitHub, JS/TS tooling, files/search, analysis/debug, network, meta commands): see the `rtk-commands` skill.

<!-- /rtk-instructions -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

<!-- charaphy rules -->

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work. Use judgment on trivial tasks.

## Rule 1 — Think Before Coding

State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

## Rule 2 — Goal-Driven Execution

Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.

## Rule 3 — Use the model only for judgment calls

Use me for: classification, drafting, summarization, extraction.
Do NOT use me for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 4 — Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

## Rule 5 — Read before you write

Before adding code, read exports, immediate callers, shared utilities.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

## Rule 6 — Tests verify intent, not just behavior

Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 7 — Checkpoint after every significant step

Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.
If you lose track, stop and restate.

## Rule 8 — Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase.
If you genuinely think a convention is harmful, surface it. Don't fork silently.

## Rule 9 — Fail loud

"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

## Rule 10 - Don't write spam comments

Only add comments if other agent's or person need to know if they want to continue development on that part.
Don't write comments that explain why you do something.
Write a clear, short, to the points comment, like 1-2 lines only
