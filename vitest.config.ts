import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Agent worktrees live in-repo; else their stale copies get collected too.
const ignored = ["**/node_modules/**", "**/dist/**", "**/.claude/**"];

// `.ts` runs in node, `.tsx` in jsdom. These are the exceptions: no JSX, but they
// drive real DOM nodes, so they join the jsdom project by name.
const domUnits = [
  "src/features/resume-editor/domain/draft/local-draft-storage.test.ts",
  "src/features/resume-editor/preview/paginate-document.test.ts",
  "src/hooks/use-keyboard-shortcuts.test.ts",
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    css: true,
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.ts"],
          exclude: [...ignored, ...domUnits],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          include: ["src/**/*.test.tsx", ...domUnits],
          exclude: ignored,
        },
      },
    ],
  },
});
