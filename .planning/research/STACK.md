# Stack Research

**Domain:** Personal landing page (static, zero JS, GitHub Pages)
**Researched:** 2026-02-19
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | 5.17.3 (stable) | Static site framework | Default `output: 'static'` produces zero-JS HTML; island architecture ships no JS unless you explicitly add interactive components; first-class markdown support; fastest build on GitHub Pages |
| Node.js | 22.x LTS | Build runtime | Astro 5 officially supports v18.20.8, v20.3.0, v22+; Node 18 is EOL; Node 22 is current LTS and avoids future forced upgrades |
| GitHub Actions | N/A | CI/CD pipeline | Native GitHub Pages support; free for public repos; `withastro/action` abstracts all build complexity |
| withastro/action | v5.2.0 | Astro build action | Official action from Astro team; auto-detects package manager from lockfile; handles artifact upload for Pages |
| actions/deploy-pages | v4 | GitHub Pages deploy | Official GitHub action for the new Pages API; pairs with `withastro/action` |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | Built-in (Astro ships it) | Type safety in frontmatter & components | Always — Astro includes TS support; use `strict` tsconfig preset; zero overhead for static output |
| Astro scoped `<style>` | Built-in | Component-scoped CSS | For all component styles; no bleed, no specificity fights |
| CSS custom properties | Native CSS | Design tokens / typography scale | Define tokens in global CSS (`:root`), consume in scoped styles; zero runtime cost |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `npm create astro@latest` | Project scaffold | Use `--template minimal` to avoid starter bloat; pick TypeScript when prompted |
| Astro VS Code extension | Editor support | Syntax highlighting, IntelliSense for `.astro` files; required for productive DX |
| `npx @astrojs/upgrade` | Dependency upgrades | Official upgrade CLI handles Astro + all official integrations at once |

## Installation

```bash
# Scaffold new project (minimal template, TypeScript, no sample content)
npm create astro@latest toto-castaldi.github.io -- --template minimal

# Inside the project directory:
# All core dependencies installed by the wizard
# No additional installs needed for a zero-JS static site
```

If CSS utility classes are desired later (optional, not recommended for this project):

```bash
# Tailwind v4 (Vite plugin approach — do NOT use @astrojs/tailwind which is deprecated for Tailwind 4)
npm install tailwindcss @tailwindcss/vite
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro 5 (stable) | Astro 6 beta | When 6 reaches stable release (targeting mid-2026); beta has Node 22 hard requirement and breaks Astro.glob() and ViewTransitions API |
| Plain CSS + custom properties | Tailwind CSS | Only if the design requires a large utility class system; overkill for a single-page minimal site with light typography refresh |
| Plain CSS + custom properties | Sass/SCSS | Only if nesting or mixins are needed at scale; Astro supports Sass natively but one page does not justify the dependency |
| npm | pnpm | pnpm requires `.npmrc` with `shamefully-hoist=true` for Astro; adds friction with no benefit at this project size |
| `withastro/action@v5` | Manual build workflow | Manual workflow is 30+ lines vs 10 lines; no advantage; official action is maintained by Astro team |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@astrojs/tailwind` integration | Deprecated for Tailwind v4; only supports Tailwind v3 | `@tailwindcss/vite` plugin (or skip Tailwind entirely for this project) |
| `output: 'server'` or `output: 'hybrid'` | Requires a server runtime; incompatible with GitHub Pages static hosting | Default `output: 'static'` (Astro's default, no config needed) |
| React / Vue / Svelte component islands | Adds JS to the bundle; contradicts the zero-JS goal; no interactive requirements exist | Plain `.astro` components with scoped `<style>` |
| `Astro.glob()` | Deprecated in Astro 5; removed in Astro 6 | `getCollection()` from content collections, or direct page imports |
| MDX | Heavier than plain Markdown; designed for embedding components; the zero-JS constraint means no components to embed | Plain `.md` files with YAML frontmatter |
| Jekyll/Liquid templating | Current stack being replaced; no reason to carry patterns forward | Astro layouts and components |
| Node 18 or 20 | Node 18 is EOL; Node 20 support will be dropped in Astro 6 | Node 22 LTS |
| `<ViewTransitions />` (old API) | Removed in Astro 6; the new `<ClientRouter />` replaced it in Astro 5 | Not needed at all for a zero-JS static landing page |

## Stack Patterns by Variant

**If single-page, zero JS (this project):**
- Use `src/pages/index.astro` as the root page
- Put markdown content in `src/content/` (content collections) or inline as Markdown imports
- All styling in component `<style>` blocks + `src/styles/global.css` for tokens
- No framework integrations needed

**If blog is added later:**
- Add `src/content/blog/` directory
- Define a collection schema in `src/content.config.ts`
- Use `getCollection('blog')` in pages — replaces deprecated `Astro.glob()`

**If any interactive element is needed:**
- Use `client:visible` hydration directive on a minimal vanilla JS component
- Never add a full UI framework (React/Vue) for one widget

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| astro@5.17.3 | Node 18.20.8, 20.3.0, 22.x | Node 22 strongly recommended; 18 is EOL |
| withastro/action@v5.2.0 | astro@5.x, GitHub-hosted runners | Released 2026-02-11; latest stable |
| actions/deploy-pages@v4 | GitHub Pages new API | Required alongside withastro/action v5 |
| tailwindcss@4.x + @tailwindcss/vite | astro@5.2+ | Only if Tailwind is adopted; do NOT use @astrojs/tailwind |

## GitHub Actions Workflow

The complete `.github/workflows/deploy.yml` for this project:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ master ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5
      - name: Install, build, and upload site
        uses: withastro/action@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Note: `site: 'https://toto-castaldi.github.io'` must be set in `astro.config.mjs`. No `base` needed because this IS the root `username.github.io` repository.

## `astro.config.mjs` Baseline

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  output: 'static',  // default, explicit for clarity
});
```

## Sources

- GitHub releases page (withastro/astro) — confirmed 5.17.3 as latest stable, 6.0.0-beta.14 as latest beta (HIGH confidence)
- https://docs.astro.build/en/guides/deploy/github/ — official deploy workflow, withastro/action@v5 (HIGH confidence)
- https://github.com/withastro/action — confirmed v5.2.0 released 2026-02-11 (HIGH confidence)
- https://docs.astro.build/en/install-and-setup/ — Node version requirements, project creation (HIGH confidence)
- https://tailwindcss.com/docs/installation/framework-guides/astro — Tailwind v4 + Astro setup, @tailwindcss/vite (HIGH confidence)
- https://docs.astro.build/en/basics/rendering-modes/ — static output mode, zero JS default (HIGH confidence)
- https://docs.astro.build/en/guides/styling/ — scoped styles, CSS variables, is:global directive (HIGH confidence)
- https://docs.astro.build/en/guides/markdown-content/ — markdown support, frontmatter, content collections (HIGH confidence)
- WebSearch: Astro 5 TypeScript tsconfig, strict preset (MEDIUM confidence — corroborated by official TypeScript docs page reference)

---
*Stack research for: Astro personal landing page on GitHub Pages*
*Researched: 2026-02-19*
