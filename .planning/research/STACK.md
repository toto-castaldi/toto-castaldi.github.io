# Technology Stack — v2.0 Enhancement & i18n

**Project:** toto-castaldi.github.io
**Researched:** 2026-02-19
**Overall confidence:** HIGH

## Existing Stack (validated, DO NOT change)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| Astro | 5.17.3 | Static site framework | Installed, working |
| Node.js | 22.x LTS | Build runtime | Working in CI |
| GitHub Actions + withastro/action@v5 | v5.2.0 | CI/CD | Working |
| System font stack | N/A | Typography | Working |
| CSS custom properties + clamp() | N/A | Design tokens, fluid type | Working |
| ESM CSS imports | N/A | Astro CSS processing | Working |

## New Stack Additions

### 1. Dark Mode Toggle

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Inline `<script>` (vanilla JS) | N/A | Theme detection + toggle | Astro's `is:inline` directive runs JS synchronously before paint, preventing FOUC. No framework, no build step, no hydration. ~30 lines of JS total. |
| CSS custom properties (existing) | N/A | Theme-aware color tokens | Already using `:root` variables (`--color-bg`, `--color-text`, etc.). Dark mode adds a `[data-theme="dark"]` selector block overriding the same variables. Zero new dependencies. |

**Implementation approach:** Use `data-theme` attribute on `<html>` element (not class-based). The `is:inline` script in `<head>` checks `localStorage` then `prefers-color-scheme`, sets `data-theme` synchronously before first paint. A button component toggles the attribute and persists to `localStorage`.

**Why NOT a library:**
- `astro-themes` (alex-grover) and `astro-color-scheme` (surjithctly) add abstraction for ~30 lines of vanilla JS. Unnecessary dependency for a site with one toggle.
- Tailwind dark mode is irrelevant -- project uses plain CSS custom properties.
- No framework island needed. The `<script>` tag in Astro runs as vanilla JS with zero hydration cost.

**JS budget:** ~30 lines inline (head script for FOUC prevention) + ~15 lines for toggle button event handler. Total: under 1KB unminified. This is the ONLY JavaScript on the site.

### 2. Astro i18n Routing (IT/EN)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro built-in i18n | Built into Astro 5.x | Locale-aware routing, URL helpers | Native feature since Astro 3.5. No extra dependency. Provides `getRelativeLocaleUrl()`, `Astro.currentLocale`, hreflang support. Works with static output. |
| `astro:i18n` module | Built-in | URL generation helpers | `getRelativeLocaleUrl()` and `getAbsoluteLocaleUrl()` generate correct locale-prefixed paths. Used in language switcher and hreflang tags. |
| TypeScript translation map | N/A | UI string translations | `src/i18n/ui.ts` exports a typed object `{ it: { ... }, en: { ... } }`. Utility functions `getLangFromUrl()` and `useTranslations()` provide type-safe access. No i18n library needed. |

**Configuration in `astro.config.mjs`:**

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      prefixDefaultLocale: false,  // IT at /, EN at /en/
    },
  },
});
```

**File structure:**

```
src/pages/
  index.astro          # IT (default, served at /)
  en/
    index.astro        # EN (served at /en/)
```

**Why `prefixDefaultLocale: false`:**
- Italian content stays at `/` (no breaking change from v1.0 URLs)
- English content at `/en/`
- Simpler URLs for the primary (Italian) audience
- `hreflang` tags handle SEO signaling between versions

**Why NOT `prefixDefaultLocale: true`:**
- Would move Italian from `/` to `/it/`, breaking the existing URL
- Requires redirect from `/` to `/it/`
- Adds complexity for no benefit on a single-page site

**Why NOT third-party i18n libraries:**
- `astro-i18n` (Alexandre-Fernandez) -- TypeScript-first but abandoned (last commit 2023), Astro 5 has native support now
- `astro-i18next` (yassinedoghri) -- overkill for 2 locales and ~20 UI strings
- `paraglide-astro` (inlang) -- designed for large translation workflows; massive overhead for a one-page site

### 3. Schema.org JSON-LD (Person)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Manual `<script type="application/ld+json">` | N/A | Person structured data | One static JSON object in the layout `<head>`. No library needed. Astro's `set:html` directive safely injects the JSON string. |

**Why NOT `astro-seo-schema`:**
- Current version 5.2.0 is compatible with Astro 5, but it provides a `<Schema>` component wrapper around `JSON.stringify()` + `<script type="application/ld+json">`. That is literally what we do manually in 5 lines. Adding a dependency for a component that wraps `JSON.stringify` is not justified.
- The Person schema is static (not dynamic per page), so there is no need for a reusable component pattern.

**Implementation:**

```astro
---
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Antonio Castaldi",
  "alternateName": "Toto",
  "url": "https://toto-castaldi.github.io",
  "email": "toto.castaldi@gmail.com",
  "jobTitle": ["Imprenditore", "Personal Trainer"],
  "worksFor": {
    "@type": "Organization",
    "name": "Skillbill srl",
    "url": "https://www.skillbill.it/"
  },
  "knowsAbout": ["Software Development", "Fitness", "Nonviolent Communication"]
};
---
<script type="application/ld+json" set:html={JSON.stringify(personSchema)} />
```

### 4. og:image Generation (1200x630)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| satori | ^0.12.x+ | HTML/CSS to SVG conversion | Vercel's library for converting React-element-like objects to SVG. Used by Next.js, widely adopted. Supports flexbox layout, font embedding. No JSX needed -- uses plain object syntax `{ type: 'div', props: { ... } }`. |
| sharp | ^0.34.x | SVG to PNG conversion | High-performance Node.js image processing. Converts satori's SVG output to 1200x630 PNG. Already used internally by Astro's image optimization. Well-maintained, 0.34.5 is current stable. |

**Why satori + sharp (not alternatives):**

| Alternative | Why Not |
|-------------|---------|
| `@resvg/resvg-js` instead of sharp | Adds a Rust-based native dependency. sharp is more widely used, already in Astro's dependency tree, and handles PNG conversion in one step. Performance difference is negligible for 1-2 images. |
| `satori-html` | Unmaintained (last publish 3 years ago, v0.3.2). The fork `@gotedo/satori-html` (v0.3.4) exists but adds unnecessary HTML parsing. For 1 static image, satori's native object syntax is simpler and has zero additional dependencies. |
| `astro-satori` integration | v0.1.6, last published 1 year ago. Thin wrapper that doesn't add value for a single static OG image endpoint. |
| `@vercel/og` | Designed for Vercel Edge Functions, not static site generation. |
| Canvas-based (node-canvas) | Requires system-level dependencies (Cairo, Pango). Fails on many CI environments. satori is pure JS. |
| Static image file (manual design) | Brittle. Cannot be updated from content. Does not scale if multiple pages are added. satori approach generates at build time with zero runtime cost. |

**Implementation pattern:** Astro static endpoint at `src/pages/og.png.ts` using `getStaticPaths()` (or a simple `GET` export for a single image). Generates PNG at build time, outputs to `/og.png`. Referenced in `<meta property="og:image">`.

**Font requirement:** satori requires embedding a font file (TTF/OTF/WOFF -- not WOFF2). Use the system-ui equivalent: download Inter or Roboto as a TTF file into `src/fonts/` for consistent rendering. ~100KB build-time cost, zero runtime cost.

### 5. Lighthouse Optimization

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| No new dependencies | N/A | Performance, accessibility, SEO, best practices | Astro static sites score 95-100 by default. Remaining optimizations are CSS/HTML patterns, not library additions. |

**What to do (no dependencies needed):**

| Optimization | Category | Approach |
|-------------|----------|----------|
| `<meta name="theme-color">` | Best Practices | Add to `<head>`. Changes dynamically with dark mode via inline script. |
| `color-scheme: light dark` on `:root` | Performance | Tells browser to expect both schemes. Prevents flash. |
| `font-display: optional` or `swap` | Performance | Already using system fonts -- no web font loading. Already optimal. |
| Explicit `width`/`height` on images | CLS prevention | No images currently. If og:image is referenced as `<img>`, set dimensions. |
| `<link rel="alternate" hreflang>` | SEO | Generated from i18n config. Use `getAbsoluteLocaleUrl()`. |
| Preload hints | Performance | Not needed -- zero external resources, system fonts, no JS bundles. |
| Accessibility: skip-link, focus styles, `aria-label` | Accessibility | Add skip-to-content link, visible focus indicators, aria-label on theme toggle. |

**What NOT to add for Lighthouse:**

| Avoid | Why |
|-------|-----|
| `@astrojs/sitemap` | One page (two with EN). Manual `<link rel="sitemap">` or a 5-line `sitemap.xml` in `public/` is simpler. |
| `@astrojs/compress` | Astro already minifies HTML/CSS in production. GitHub Pages serves with gzip. No benefit. |
| `lighthouse-ci` in GitHub Actions | Premature. Run Lighthouse manually via Chrome DevTools or PageSpeed Insights. Add CI check only if scores regress. |
| Web fonts | System font stack already gives optimal LCP. Adding web fonts (even preloaded) adds latency. |

### 6. Section Anchor Links

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| No new dependencies | N/A | `#section-id` deep links | Sections already have `id` attributes (`id="imprenditoria"`, `id="informatica"`, etc.). Anchor links work natively. Enhancement: add visible `#` link next to `<h2>` headings via CSS `::before` or a small Astro component tweak. Zero JS needed. |

**CSS-only approach:**

```css
section h2 a.anchor {
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.2s;
}
section:hover h2 a.anchor,
section h2 a.anchor:focus-visible {
  opacity: 0.5;
}
```

## Complete New Dependencies

```bash
# Build-time only (og:image generation)
npm install satori sharp
```

**That is it.** Two packages, both build-time only, zero client-side impact. Everything else uses Astro built-in features or vanilla CSS/JS.

## What NOT to Install

| Package | Why Avoid |
|---------|-----------|
| `astro-seo-schema` | One static JSON-LD block does not justify a dependency |
| `astro-seo` / `@astrolib/seo` | We already have manual OG tags. These packages add abstraction over 5 meta tags. |
| `astro-i18n` / `astro-i18next` / `paraglide-astro` | Astro 5 has built-in i18n routing. Two locales with ~20 strings do not need a library. |
| `astro-themes` / `astro-color-scheme` | 30 lines of vanilla JS do not justify a dependency |
| `satori-html` / `@gotedo/satori-html` | Unmaintained / unnecessary. Use satori's native object syntax. |
| `@resvg/resvg-js` | sharp handles SVG-to-PNG. No need for a second image processor. |
| `@astrojs/sitemap` | Manual sitemap for 2 pages is simpler |
| `@astrojs/compress` | Astro minifies; GitHub Pages gzips |
| `tailwindcss` | Project uses plain CSS custom properties. Do not introduce a utility framework for dark mode variables. |
| Any UI framework (React, Vue, Svelte, Preact) | Dark mode toggle is vanilla JS. No island hydration needed. |

## Updated `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

No other config changes needed. No integrations to add.

## Updated `package.json` (after install)

```json
{
  "dependencies": {
    "astro": "^5.17.1",
    "satori": "^0.12.0",
    "sharp": "^0.34.0"
  }
}
```

## Integration Points

### How new features connect to existing code:

| New Feature | Touches | Integration |
|-------------|---------|-------------|
| Dark mode | `Base.astro` (add inline script in `<head>`, add toggle button), `global.css` (add `[data-theme="dark"]` variable block) | `<html>` gets `data-theme` attribute. Existing CSS variables in `:root` get overridden by `[data-theme="dark"]` selector. |
| i18n | `astro.config.mjs` (add `i18n` block), `src/pages/en/index.astro` (new file), `Base.astro` (add hreflang, lang switcher) | `<html lang>` attribute becomes dynamic via `Astro.currentLocale`. Layout receives locale-aware metadata. |
| Schema.org | `Base.astro` (add `<script type="application/ld+json">` in `<head>`) | Static JSON object. No interaction with other features. |
| og:image | `src/pages/og.png.ts` (new endpoint), `Base.astro` (add `og:image` meta tag) | Build-time only. Generates `/og.png`. Layout references it in `<meta property="og:image">`. |
| Anchor links | `Section.astro` (wrap title in `<a href="#id">`) | Enhances existing `id` attributes. Pure HTML/CSS change. |
| Lighthouse | Across all files | Accessibility improvements (skip link, focus styles, aria attributes). No new files. |

### Dependency on each other:

```
i18n ──> Dark mode (toggle must work on both /it and /en pages)
i18n ──> Schema.org (Person schema may include sameAs with locale URLs)
i18n ──> og:image meta tag (must reference correct absolute URL per locale)
i18n ──> hreflang tags (must be in <head> of both locales)
Dark mode ──> Lighthouse (theme-color meta, color-scheme, aria-label)
All features ──> Lighthouse (final validation pass)
```

## Version Compatibility Matrix

| Package | Requires | Compatible With |
|---------|----------|-----------------|
| astro@5.17.3 | Node 22.x LTS | Built-in i18n, static endpoints |
| satori@^0.12.0 | Node 16+ | Astro static endpoints (`.ts` files in `src/pages/`) |
| sharp@^0.34.0 | Node 18.17.0+ | Runs at build time only; GitHub Actions ubuntu-latest includes required libs |
| Astro i18n | astro@3.5+ | Works with `output: 'static'` (SSG) |

## Sources

- https://docs.astro.build/en/guides/internationalization/ -- Astro i18n routing config, `prefixDefaultLocale`, file structure, helpers (HIGH confidence)
- https://docs.astro.build/en/recipes/i18n/ -- Translation map pattern, `getLangFromUrl()`, `useTranslations()` (HIGH confidence)
- https://docs.astro.build/en/reference/modules/astro-i18n/ -- `getRelativeLocaleUrl()`, `getAbsoluteLocaleUrl()`, static mode support (HIGH confidence)
- https://docs.astro.build/en/tutorial/6-islands/2/ -- Official dark mode toggle tutorial, `is:inline` script, localStorage + prefers-color-scheme (HIGH confidence)
- https://astro-tips.dev/recipes/dark-mode/ -- FOUC prevention with `data-theme`, `color-scheme` CSS property, ThemeManager pattern (MEDIUM confidence)
- https://arne.me/blog/static-og-images-in-astro/ -- satori + sharp build-time OG image in Astro static endpoint (MEDIUM confidence)
- https://www.cemkiray.com/posts/how-to-add-json-ld-schema-in-astro/ -- Manual JSON-LD with `set:html`, no library needed (MEDIUM confidence)
- https://www.npmjs.com/package/satori -- satori package info (HIGH confidence)
- https://www.npmjs.com/package/sharp -- sharp v0.34.5 current stable (HIGH confidence)
- https://www.npmjs.com/package/astro-seo-schema -- v5.2.0, evaluated and rejected (MEDIUM confidence)
- https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/ -- Lighthouse optimization tips for Astro (MEDIUM confidence)
- https://libraries.io/npm/astro-seo-schema -- version history verification (LOW confidence)

---
*Stack research for: v2.0 Enhancement & i18n milestone*
*Researched: 2026-02-19*
