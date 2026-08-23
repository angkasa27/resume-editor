<div align="center">
  <a href="https://resummme.asaa.dev">
    <img src="public/og-image.png" alt="Resummme - Open Source Resume Editor" width="800" />
  </a>

  <h1>Resummme</h1>

  <p>Build a recruiter-ready resume in minutes. Write once, preview as you type, and export a clean PDF.</p>

  <p>
    <a href="https://resummme.asaa.dev"><strong>Live Demo</strong></a>
    ·
    <a href="https://github.com/angkasa27/resummme"><strong>GitHub Repo</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/github/package-json/v/angkasa27/resummme?style=flat-square" alt="Version">
    <img src="https://img.shields.io/github/stars/angkasa27/resummme?style=flat-square" alt="GitHub Stars">
    <img src="https://img.shields.io/github/license/angkasa27/resummme?style=flat-square" alt="License" />
  </p>
</div>

---

Resummme is a focused, fast resume editor designed to give you everything you need to craft your resume, with nothing that gets in your way. 

Built with privacy as a core principle, Resummme gives you complete ownership of your data. The codebase is fully open-source under the GNU Affero General Public License v3, with no tracking, no ads, and no paywalls. All your data stays in your browser and never leaves your machine unless you choose to use the AI or PDF export features.

## Features

**Resume Building**
- **Sidebar editor + live canvas preview**: Form fields on the left, an instant zoomable preview of the actual paper on the right, always in sync — no save button, autosave is a side effect of typing.
- **Drag-to-reorder sections and items**: Reorder sections and repeatable items (jobs, projects, education) directly in the sidebar.
- **Undo/redo**: Full history for every edit, not just the last one.
- **Rich text editor**: Edit with formatting support powered by TipTap.
- **Import and export**: Bring in an existing resume to get started, or download/upload your resume data as portable JSON.

**Templates & Style Control**
- **19 templates on 19 layouts**: Switch between nineteen polished templates (Classic, Modern Centered, Timeline, Academic, Inset, Split, Duet, Bold Type, Studio, Aurora, Ledger, Dossier, Crest, Masthead, Compass, Numeral, Atlas, Editorial, Harvard) without retyping a thing — each pairs a layout with a curated presentation.
- **Typography**: Choose from Google Fonts and web-safe system fonts, with each option rendered in its own typeface in the font picker.
- **Design control**: Full control over accent color, font scale, line height, section spacing, paper size (A4 / Letter), and page margins.

**AI Assistance**
- **AI PDF extraction**: Upload an existing resume PDF and Gemini parses it directly into the editor fields.
- **AI writing assistant**: Improve any bullet point with AI; choose quick actions (stronger verb, add a metric, make it concise) or write custom instructions powered by Gemini.
- **ATS score**: Live structural/content scoring with feedback and keyword-gap analysis against any job description.

**Privacy & Security**
- **No account required**: Start building immediately. No registration, login, or passwords needed.
- **Private by default**: Your data is stored locally in the browser via `localStorage` and never leaves your device.

## Templates

<table>
  <tr>
    <td align="center">
      <img src="public/templates/classic-modern.webp" alt="Classic" width="180" />
      <br /><sub><b>Classic</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/centered-ocean.webp" alt="Modern Centered" width="180" />
      <br /><sub><b>Modern Centered</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/timeline-indigo.webp" alt="Timeline" width="180" />
      <br /><sub><b>Timeline</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/academic-oxford.webp" alt="Academic" width="180" />
      <br /><sub><b>Academic</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/inset-steel.webp" alt="Inset" width="180" />
      <br /><sub><b>Inset</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/split-midnight.webp" alt="Split" width="180" />
      <br /><sub><b>Split</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/bold-citrus.webp" alt="Bold Type" width="180" />
      <br /><sub><b>Bold Type</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/studio-violet.webp" alt="Studio" width="180" />
      <br /><sub><b>Studio</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/aurora-haze.webp" alt="Aurora" width="180" />
      <br /><sub><b>Aurora</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/ledger-graphite.webp" alt="Ledger" width="180" />
      <br /><sub><b>Ledger</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/dossier-navy.webp" alt="Dossier" width="180" />
      <br /><sub><b>Dossier</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/crest-charcoal.webp" alt="Crest" width="180" />
      <br /><sub><b>Crest</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/masthead-citrus.webp" alt="Masthead" width="180" />
      <br /><sub><b>Masthead</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/compass-slate.webp" alt="Compass" width="180" />
      <br /><sub><b>Compass</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/numeral-mono.webp" alt="Numeral" width="180" />
      <br /><sub><b>Numeral</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/atlas-onyx.webp" alt="Atlas" width="180" />
      <br /><sub><b>Atlas</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/editorial-sand.webp" alt="Editorial" width="180" />
      <br /><sub><b>Editorial</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/duet-stone.webp" alt="Duet" width="180" />
      <br /><sub><b>Duet</b></sub>
    </td>
  </tr>
</table>

## Quick Start

The quickest way to run Resummme locally:

```bash
# Clone the repository
git clone https://github.com/angkasa27/resummme.git
cd resummme

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:4000](http://localhost:4000) to see the application.

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Runtime | Node.js 20+ |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Primitives | React 19, Base UI |
| Rich Text | TipTap |
| State Management | Zustand |
| Drag & Drop | dnd-kit |
| Motion | motion |
| PDF Export | Puppeteer (local) / Cloudflare Browser Run (prod) |
| PDF Text Extraction | pdf-parse |
| AI | Google Gemini API |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Testing Library |

## Available Scripts

```bash
pnpm dev          # Start the development server
pnpm build        # Build for production
pnpm start        # Start the production server
pnpm lint         # Run ESLint
pnpm test         # Run Vitest (single pass)
pnpm test:watch   # Run Vitest in watch mode
pnpm typecheck    # Generate Next.js route types, then type-check with tsc
pnpm screenshots  # Regenerate template preview images in public/templates
pnpm og:image     # Regenerate public/og-image.png
```

Diagnostics for the preview/PDF pipeline. These drive headless Puppeteer against a running app, so start `pnpm dev` first:

```bash
pnpm check:pagebreak    # Report where each layout breaks across pages
pnpm check:pagination   # Compare preview pagination against the rendered document
pnpm inspect:layout     # Dump computed geometry for one layout
pnpm verify:pdf         # Round-trip the /api/export-pdf route
```

## Environment Variables

Create a `.env.local` from the template:

```bash
cp .env.example .env.local
```

### AI features — Google Gemini

Powers "Extract from PDF", "Improve with AI", and "Analyze job description".

```bash
GEMINI_API_KEY=                  # https://aistudio.google.com/
GEMINI_MODEL=                    # Optional; defaults to gemini-3.5-flash
```

Both accept a comma-separated list. Every key is tried on the first model before
the next model is attempted, so a rate-limited key falls back to a sibling key
rather than dropping straight to a weaker model:

```bash
GEMINI_API_KEY=key_one,key_two
GEMINI_MODEL=gemini-3.5-flash,gemini-3-flash-preview
```

Without a key, the AI buttons are visible but calls will return a 503 error.

### PDF export

```bash
# "auto" (default) | "puppeteer" | "cloudflare-browser-run"
PDF_EXPORT_PROVIDER=auto
```

`auto` uses local Puppeteer in development. For production with Cloudflare Browser Run:

```bash
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_BROWSER_RUN_API_TOKEN=
CLOUDFLARE_BROWSER_RUN_KEEP_ALIVE_MS=60000
```

### Security

```bash
# Comma-separated origins allowed to call /api/export-pdf cross-origin.
# Same-origin requests are always allowed without this.
PDF_EXPORT_TRUSTED_ORIGINS=https://example.com
```

## Project Structure

```text
src/
  app/
    (landing routes)           # Marketing homepage ("/")
    editor/                    # The actual editor ("/editor")
    resume-pdf/                # Headless page Puppeteer captures to produce the PDF
    api/                       # export-pdf, import-pdf, improve-content, insights/match-keywords
  components/ui/               # Shared UI primitives (Button, Dialog, Select…)
  components/landing/          # Landing page sections
  hooks/                       # App-level React hooks
  lib/                         # Utilities (cn, etc.)
  test/                        # Vitest setup
  features/resume-editor/
    domain/
      draft/                   # Draft storage interface, local-storage impl, default draft
      insights/                # ATS scoring, keyword matching, text extraction
      presentation/            # Layout ids, color/font presets, margins
      rich-text/                # Sanitizers
      schema/                  # Zod schemas for the resume draft (versioned)
      sections/                # Section config & metadata
    editor/
      desktop/                 # Split-panel layout: sidebar + zoomable canvas preview
      mobile/                  # Full-screen guided-forms layout
      panels/                  # Style tab, Design panel, template gallery, Insights tab, extract-CV dialog
      sections/                # Section list, drag-to-reorder, per-section forms
      shared/, top-bar/        # Header (undo/redo, save indicator, Download PDF)
    forms/                     # react-hook-form field bindings, rich-text, schemas
    preview/
      layouts/                 # One folder per layout; layout-registry.tsx holds the registered list
      layout-registry.tsx      # layout id -> definition (the render half of a "template")
      engine.ts                # Layout descriptors + render pipeline
      paginate-document.ts     # Multi-page break pass
      resume-document.tsx      # The paper surface
      resume-pdf-page.tsx      # The page Puppeteer captures
      components/, descriptors/, kit/, helpers/
    server/                    # Server-side PDF export & Gemini helpers
    state/                     # Zustand store
```

## How It Works

The homepage at / is just marketing; the editor itself lives at /editor. On desktop it's a split layout: sidebar form editor on the left, a live zoomable preview of the actual paper on the right, plus a Style/Insights panel. On mobile it's full-screen guided forms. There's no save button, since every keystroke autosaves.

Downloading a PDF opens /resume-pdf, a plain page that Puppeteer (or Cloudflare Browser Run in production) loads and captures. Before the page loads, the export API drops the draft into `sessionStorage` under `resume-editor:pdf-draft`, so the rendering page picks it up from there — no draft data ever touches a query string.

The AI features are thin wrappers around Gemini: importing a PDF extracts its text and asks Gemini to map it into a structured draft, "Improve with AI" sends the current field's HTML plus instructions and gets sanitized HTML back, and the ATS job match endpoint asks Gemini for keywords from a job description and matches them against the current draft on the client.

## Contributing

Contributions make open-source thrive. Whether fixing a typo or adding a feature, all contributions are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Licensed under the [GNU Affero General Public License v3](LICENSE).
