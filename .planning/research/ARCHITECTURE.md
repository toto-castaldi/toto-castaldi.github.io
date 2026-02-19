# Architecture Research

**Domain:** Astro static landing page — GitHub Pages
**Researched:** 2026-02-19
**Confidence:** HIGH (verified against official Astro docs)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Build Time (Astro SSG)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │
│  │ src/pages/   │   │ src/layouts/ │   │src/components│         │
│  │ index.astro  │   │ Base.astro   │   │ Section.astro│         │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
│                     Astro Compiler                               │
│                            │                                     │
├────────────────────────────┼────────────────────────────────────┤
│                        dist/ (static HTML)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  index.html  +  _astro/*.css  +  public/* (as-is)        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
                    GitHub Actions CI/CD
                             │
                    GitHub Pages (CDN)
```

Zero JavaScript shipped to browser. No hydration. No islands needed for this project — purely static content with no interactive widgets.

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `src/pages/index.astro` | Single route entry point; orchestrates all sections | Imports Layout and Section components, passes content |
| `src/layouts/Base.astro` | HTML shell: `<html>`, `<head>`, `<body>` wrapper | Receives `title` prop, injects global CSS, renders `<slot />` |
| `src/components/Section.astro` | Renders one content section (heading + body text + links) | Receives `title` and `slot` for body content |
| `src/styles/global.css` | Global reset, typography, spacing, color palette | Imported once in Base.astro; rules apply site-wide |
| `public/CNAME` | Domain routing (currently empty — no custom domain) | Static file, copied verbatim to dist/ |
| `.github/workflows/deploy.yml` | CI/CD: build and push to GitHub Pages | Replaces existing `jekyll.yml`; uses `withastro/action@v5` |
| `astro.config.mjs` | Framework configuration: `site` URL, output mode | Must set `site: "https://toto-castaldi.github.io"` |

## Recommended Project Structure

```
toto-castaldi.github.io/
├── src/
│   ├── pages/
│   │   └── index.astro          # The only page — renders full landing
│   ├── layouts/
│   │   └── Base.astro           # HTML shell, <head>, global styles slot
│   ├── components/
│   │   └── Section.astro        # Reusable section wrapper (title + content)
│   └── styles/
│       └── global.css           # Typography, reset, spacing — minimal white design
├── public/
│   └── CNAME                    # Keep empty (no custom domain)
├── .github/
│   └── workflows/
│       └── deploy.yml           # Replace jekyll.yml — use withastro/action@v5
├── astro.config.mjs             # site URL, static output
├── package.json
└── package-lock.json            # Required by withastro/action for pkg manager detection
```

Files to remove after migration (Jekyll artifacts):
- `Gemfile`, `Gemfile.lock`
- `_layouts/`, `_includes/`, `_sass/`
- `index.markdown` (replaced by `src/pages/index.astro`)
- `.github/workflows/jekyll.yml` (replaced by `deploy.yml`)

### Structure Rationale

- **src/pages/index.astro:** Single page site — one file, one route. No dynamic routing needed.
- **src/layouts/Base.astro:** Separates the HTML shell from page content. If a second page ever appears, layout is reused without duplication.
- **src/components/Section.astro:** The page has four parallel sections (Imprenditoria, Informatica, Fitness, CNV). A shared Section component enforces visual consistency and reduces repetition.
- **src/styles/global.css:** Global styles must live outside component scoping. Import in Base.astro to cascade everywhere.
- **public/:** Only the CNAME file belongs here — no images, no fonts to process.

## Architectural Patterns

### Pattern 1: Layout with Slot

**What:** A Base layout wraps all pages via `<slot />`. Pages inject their content into the slot.
**When to use:** Any multi-page or single-page site — keeps `<head>` and meta tags DRY.
**Trade-offs:** Tiny indirection cost; enormous consistency benefit.

**Example:**
```astro
---
// src/layouts/Base.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pattern 2: Component Props for Section Reuse

**What:** Each section gets a typed `title` prop; body content flows in via `<slot />`.
**When to use:** When multiple page regions share the same visual structure.
**Trade-offs:** Adds one layer of indirection; enables typography refresh to apply uniformly across all sections.

**Example:**
```astro
---
// src/components/Section.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<section class="section">
  <h2>{title}</h2>
  <slot />
</section>

<style>
  .section {
    margin-block: 2.5rem;
  }
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-block-end: 0.75rem;
  }
</style>
```

### Pattern 3: Inline Markdown via Import

**What:** Import the existing `index.markdown` content directly as a component, or inline the markdown text as HTML in `index.astro`.
**When to use:** When content is stable and short enough to live in a single file.
**Trade-offs:** For this project, the content is small enough that inlining it in `index.astro` as HTML (translated from markdown) is simpler than a full content collection. A content collection adds file-watching and type safety but is overkill for one page.

**Decision:** Inline content in `index.astro` — avoids the `src/content/` layer entirely.

## Data Flow

### Build-Time Rendering Flow

```
src/pages/index.astro
    │
    ├── imports Base.astro (layout)
    │       └── injects <html>, <head>, global CSS link
    │
    ├── imports Section.astro (×4 sections)
    │       └── receives title prop + slot content
    │
    └── Astro compiler
            │
            ↓
        dist/index.html   (pure static HTML, zero JS)
        dist/_astro/*.css (scoped + global CSS, hashed)
```

### Deployment Flow

```
git push → master
    │
    └── GitHub Actions: deploy.yml
            │
            ├── actions/checkout@v4
            ├── withastro/action@v5  (npm install + astro build)
            │       └── produces dist/
            ├── actions/upload-pages-artifact@v3
            └── actions/deploy-pages@v4
                    └── serves dist/ at toto-castaldi.github.io
```

### Key Data Flows

1. **Content authoring:** Text lives directly in `src/pages/index.astro` — edit file, push, deploy.
2. **Style cascade:** `global.css` sets base typography; component `<style>` blocks handle per-component specifics (scoped automatically by Astro).
3. **No runtime data:** No API calls, no CMS, no state. Build is fully deterministic.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (1 page) | Single `index.astro` + Base layout + Section component |
| +1-5 pages | Add files to `src/pages/` — routing is automatic; layout already shared |
| Blog or collection | Introduce `src/content/` collections — adds type-safe frontmatter and glob import |

### Scaling Priorities

1. **First addition:** A second page (e.g., `/cv`) — just add `src/pages/cv.astro`, reuse Base.astro. No architectural change.
2. **Content growth:** If sections expand to separate pages, convert section components to full pages and move prose to markdown files in `src/content/`.

## Anti-Patterns

### Anti-Pattern 1: Client-Side JavaScript for Static Content

**What people do:** Add `client:load` or `client:visible` directives on components that display text.
**Why it's wrong:** Ships unnecessary JavaScript bundle to the browser; defeats Astro's zero-JS guarantee; no interactivity benefit for read-only text sections.
**Do this instead:** Keep all components as pure `.astro` files. No `client:*` directives. No React/Vue imports.

### Anti-Pattern 2: Content Collections for a Single Page

**What people do:** Create `src/content/` with YAML/JSON config files to handle a single markdown document.
**Why it's wrong:** Adds indirection and boilerplate for zero benefit when there is only one page of content.
**Do this instead:** Inline HTML content in `index.astro` or import the markdown file directly as a `<Content />` component.

### Anti-Pattern 3: Keeping Jekyll Files Alongside Astro

**What people do:** Leave `_layouts/`, `_includes/`, `_sass/`, `Gemfile` in the repo during or after migration.
**Why it's wrong:** GitHub Pages may detect Jekyll and attempt to build it; confuses tooling; creates maintenance debt.
**Do this instead:** Delete all Jekyll artifacts in the same PR that introduces the Astro structure. Add a `.nojekyll` file if GitHub Pages fallback detection is a concern (Astro's deploy action handles this automatically).

### Anti-Pattern 4: Missing `site` in astro.config.mjs

**What people do:** Skip the `site` option and rely on defaults.
**Why it's wrong:** `<link rel="canonical">` and sitemap generation produce broken URLs. GitHub Actions deploy may also fail asset path resolution for subdirectories.
**Do this instead:**
```js
// astro.config.mjs
export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  // No `base` needed — repo name IS the username, so it serves at root
});
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | `withastro/action@v5` + `actions/deploy-pages@v4` | Replaces Ruby/Jekyll build in existing `jekyll.yml` |
| GitHub Actions | `.github/workflows/deploy.yml` triggers on push to `master` | Same permissions block as existing Jekyll workflow |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `index.astro` → `Base.astro` | Component import + slot | Layout wraps page content |
| `index.astro` → `Section.astro` | Component import + props + slot | Four section instances |
| `Base.astro` → `global.css` | `<link>` tag or `import` | Global styles applied once |
| Astro compiler → `dist/` | Build output | Pure static HTML + hashed CSS |

## Build Order Implications

The dependencies between components determine implementation order:

1. **`astro.config.mjs`** — Must exist before any build command runs. Set `site` immediately.
2. **`src/styles/global.css`** — Define typography and base reset before any visual component.
3. **`src/layouts/Base.astro`** — HTML shell depends on `global.css` being importable.
4. **`src/components/Section.astro`** — Depends on layout existing as reference for visual context.
5. **`src/pages/index.astro`** — Assembles layout + sections + content. Final integration point.
6. **`.github/workflows/deploy.yml`** — Can be written in parallel with any step; only executes on push.

## Sources

- [Astro Project Structure — Official Docs](https://docs.astro.build/en/basics/project-structure/) — HIGH confidence
- [Astro Components — Official Docs](https://docs.astro.build/en/basics/astro-components/) — HIGH confidence
- [Astro Styling Guide — Official Docs](https://docs.astro.build/en/guides/styling/) — HIGH confidence
- [Astro Markdown Guide — Official Docs](https://docs.astro.build/en/guides/markdown-content/) — HIGH confidence
- [Deploy Astro to GitHub Pages — Official Docs](https://docs.astro.build/en/guides/deploy/github/) — HIGH confidence
- [Astro Islands Architecture — Official Docs](https://docs.astro.build/en/concepts/islands/) — HIGH confidence

---
*Architecture research for: Astro personal landing page (toto-castaldi.github.io)*
*Researched: 2026-02-19*
