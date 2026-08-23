import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Design-system guards: each rule codifies a regression that already happened.
    // Scope is the editor surfaces + shared primitives; the landing page is exempt.
    files: [
      "src/features/**/*.{ts,tsx}",
      "src/components/ui/**/*.{ts,tsx}",
      "src/app/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXOpeningElement[name.name=/^(Field|FieldGroup|FieldSet|FieldContent)$/] > JSXAttribute[name.name='className'] Literal[value=/\\bgap(-[xy])?-\\d/]",
          message:
            "Form spacing lives in src/components/ui/field.tsx (4/8/12/16). Don't override gap at the call site — fix the primitive or use `layout`.",
        },
        {
          selector: "Literal[value=/\\btext-\\[\\d+px\\]/]",
          message:
            "Use the type scale: text-2xl (display) | text-base (dialog title) | text-sm (default) | text-xs (meta).",
        },
        // Interaction states — see docs/design-system.md.
        {
          selector: "Literal[value=/ring-\\[\\d+px\\]/]",
          message:
            "The focus ring is `ring-3`, never an arbitrary pixel spelling. See docs/design-system.md.",
        },
        {
          selector: "Literal[value=/focus-visible:ring-ring\\/(?!40\\b)/]",
          message:
            "The focus halo is `ring-ring/40`. Semantic states recolor (ring-destructive/20, ring-violet-400/40) but neutral focus does not. See docs/design-system.md.",
        },
        {
          selector: "Literal[value=/ring-offset-background/]",
          message:
            "`ring-offset-*` marks selection, not focus. Use SELECTION_RING_CLASS from forms/fields/field-control.ts.",
        },
        {
          selector: "Literal[value=/\\bdark:hover:bg-(muted|input|accent)/]",
          message:
            "Neutral fills retint per theme — no dark-mode hover override. (Semantic tokens like destructive may still step in dark.)",
        },
      ],
    },
  },
]);

export default eslintConfig;
