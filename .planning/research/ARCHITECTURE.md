# Architecture Research

**Domain:** Dark mode, i18n, Schema.org, og:image, Lighthouse optimization -- integration with existing Astro 5 static site
**Researched:** 2026-02-19
**Confidence:** HIGH (verified against official Astro docs, community patterns, existing codebase)

## System Overview

### Current State

```
src/
├── pages/
│   └── index.astro          # Single Italian landing page
├── layouts/
│   └── Base.astro            # HTML shell, OG tags, favicon, CSS import
├── components/
│   └── Section.astro         # Reusable section wrapper (title + slot)
└── styles/
    └── global.css            # Design tokens, fluid typography, minimal white
```

Current constraints:
- `<html lang="it">` is hardcoded
- Colors are hardcoded light-only in `:root`
- No `og:image` meta tag exists
- No JSON-LD structured data
- No client-side JavaScript at all (zero JS shipped)
- Section.astro already accepts `id` prop (anchor targets exist)

### Target State

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Build Time (Astro SSG + i18n)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  src/i18n/                    src/pages/                            │
│  ┌──────────┐  ┌────────┐    ┌──────────────┐  ┌──────────────┐   │
│  │  ui.ts   │  │utils.ts│    │ index.astro  │  │en/index.astro│   │
│  │(IT + EN) │  │(t, lang│    │ (IT default) │  │ (EN mirror)  │   │
│  └────┬─────┘  └───┬────┘    └──────┬───────┘  └──────┬───────┘   │
│       │            │                │                  │           │
│       └────────────┴────────────────┴──────────────────┘           │
│                            │                                       │
│  src/layouts/              │         src/components/               │
│  ┌─────────────────┐      │    ┌────────────┐ ┌──────────────┐   │
│  │   Base.astro    │      │    │Section.astro│ │ThemeToggle   │   │
│  │ (lang, og:image,│◄─────┘    │(anchor link)│ │  .astro      │   │
│  │  JSON-LD, dark  │          └────────────┘ │(is:inline JS) │   │
│  │  mode script)   │                         └──────────────┘   │
│  └────────┬────────┘                                              │
│           │                                                       │
│  src/styles/global.css                                             │
│  ┌──────────────────────────────────────────────────────┐         │
│  │ :root { light tokens }                                │         │
│  │ :root[data-theme="dark"] { dark tokens }              │         │
│  │ @media(prefers-color-scheme:dark) { fallback }        │         │
│  └──────────────────────────────────────────────────────┘         │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                     dist/ (static HTML per locale)                  │
│  index.html (IT) + en/index.html (EN) + og-image.png              │
└────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Status | Responsibility | Changes Required |
|-----------|--------|----------------|------------------|
| `src/layouts/Base.astro` | MODIFY | HTML shell, `<head>`, meta tags | Add: `lang` prop, `og:image` meta, JSON-LD script, dark mode inline script, `hreflang` links |
| `src/components/Section.astro` | MODIFY | Section wrapper with heading | Add: anchor link icon on hover next to heading |
| `src/components/ThemeToggle.astro` | NEW | Dark/light/system toggle button | Inline script for FOUC prevention, `<button>` with icons |
| `src/components/LanguagePicker.astro` | NEW | IT/EN language switcher | Links to alternate locale page |
| `src/components/JsonLd.astro` | NEW | Schema.org Person JSON-LD | Renders `<script type="application/ld+json">` |
| `src/i18n/ui.ts` | NEW | Translation dictionary (IT + EN) | UI strings, section titles, descriptions |
| `src/i18n/utils.ts` | NEW | Language detection helpers | `getLangFromUrl()`, `useTranslations()` |
| `src/styles/global.css` | MODIFY | Design tokens, typography | Add: dark mode color tokens, `scroll-behavior`, `color-scheme` |
| `src/pages/index.astro` | MODIFY | IT landing page (default locale) | Use `useTranslations('it')`, pass lang to Base |
| `src/pages/en/index.astro` | NEW | EN landing page | Mirror of index.astro using `useTranslations('en')` |
| `public/og-image.png` | NEW | Social sharing preview image | Static 1200x630 PNG |
| `astro.config.mjs` | MODIFY | Framework configuration | Add: `i18n` block with locales and routing |

## Recommended Project Structure

```
src/
├── pages/
│   ├── index.astro              # IT landing page (default locale)
│   └── en/
│       └── index.astro          # EN landing page
├── layouts/
│   └── Base.astro               # HTML shell (modified: lang, og:image, JSON-LD, theme script)
├── components/
│   ├── Section.astro            # Section wrapper (modified: anchor link)
│   ├── ThemeToggle.astro        # Dark mode toggle button (NEW)
│   ├── LanguagePicker.astro     # IT/EN switcher (NEW)
│   └── JsonLd.astro             # Schema.org Person markup (NEW)
├── i18n/
│   ├── ui.ts                    # Translation strings dictionary (NEW)
│   └── utils.ts                 # getLangFromUrl, useTranslations (NEW)
└── styles/
    └── global.css               # Design tokens (modified: dark mode vars, scroll-behavior)
public/
├── favicon.svg                  # Existing
├── og-image.png                 # Social card image (NEW, 1200x630)
└── assets/images/               # Existing lesson thumbnails
```

### Structure Rationale

- **`src/i18n/`:** Astro's official recipe recommends this exact structure. Two files: `ui.ts` for the string dictionary, `utils.ts` for helpers. No third-party i18n library needed.
- **`src/pages/en/`:** Astro's built-in i18n routing with `prefixDefaultLocale: false` means IT content stays at `/` and EN content lives at `/en/`. This matches the requirement for separate pages at `/en/`.
- **Components stay flat:** With only 4 components (Section, ThemeToggle, LanguagePicker, JsonLd), a flat `src/components/` directory is appropriate. No subdirectories.
- **`public/og-image.png`:** A single static og:image at the root. For a one-page site, one social card is sufficient. No build-time generation with Satori needed.

## Architectural Patterns

### Pattern 1: Translation Dictionary with Fallback

**What:** A TypeScript object maps translation keys to locale-specific strings. A `useTranslations(lang)` function returns a `t()` helper that falls back to the default locale for missing keys.
**When to use:** Small sites with limited UI strings (under ~50 keys). This site has roughly 15-20 translatable strings.
**Trade-offs:** No build-time validation that all keys exist in all locales (mitigated by TypeScript types). Scales poorly past ~100 keys, but this site will never reach that.

**Example:**
```typescript
// src/i18n/ui.ts
export const languages = {
  it: 'Italiano',
  en: 'English',
} as const;

export const defaultLang = 'it';

export const ui = {
  it: {
    'site.title': 'Antonio Castaldi',
    'site.description': 'Pagina personale di Antonio Castaldi — Imprenditore, informatico, personal trainer.',
    'intro.greeting': 'Mi chiamo Antonio Castaldi ma tutti mi chiamano Toto, fallo anche tu :)',
    'intro.subtitle': 'Ecco qualche parte di me :',
    'section.business': 'Imprenditoria',
    'section.tech': 'Informatica',
    'section.fitness': 'Fitness',
    'section.cnv': 'Comunicazione Non Violenta',
    // ... section content strings
    'footer.contact': 'Mi puoi contattare scrivendomi alla mail',
    'footer.noai': 'scritto senza AI',
  },
  en: {
    'site.title': 'Antonio Castaldi',
    'site.description': 'Personal page of Antonio Castaldi — Entrepreneur, software engineer, personal trainer.',
    'intro.greeting': 'My name is Antonio Castaldi but everyone calls me Toto, you can too :)',
    'intro.subtitle': 'Here are some parts of me:',
    'section.business': 'Entrepreneurship',
    'section.tech': 'Computer Science',
    'section.fitness': 'Fitness',
    'section.cnv': 'Nonviolent Communication',
    // ... section content strings
    'footer.contact': 'You can reach me by writing to',
    'footer.noai': 'written without AI',
  },
} as const;
```

```typescript
// src/i18n/utils.ts
import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
```

### Pattern 2: Dark Mode via CSS Custom Properties + data-theme

**What:** Define light tokens in `:root`, dark tokens in `:root[data-theme="dark"]`. An inline `<script is:inline>` in `<head>` reads localStorage/system preference and sets `data-theme` on `<html>` before first paint (preventing FOUC). A `ThemeToggle` component toggles between light/dark/system.
**When to use:** Any site that wants dark mode without a framework dependency. Works with zero-JS fallback (respects `prefers-color-scheme` via media query).
**Trade-offs:** The inline script is the site's only mandatory client-side JavaScript (~400 bytes). This is acceptable since it runs synchronously before paint and prevents flash.

**Example (global.css additions):**
```css
/* Light mode (default) */
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #555555;
  --color-link: #0056b3;
  --color-link-hover: #003d80;
  --color-border: #e0e0e0;
  color-scheme: light;
}

/* Dark mode override */
:root[data-theme="dark"] {
  --color-bg: #121212;
  --color-text: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-link: #6db3f2;
  --color-link-hover: #90caf9;
  --color-border: #333333;
  color-scheme: dark;
}

/* Fallback for no-JS: respects system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --color-bg: #121212;
    --color-text: #e0e0e0;
    --color-text-secondary: #a0a0a0;
    --color-link: #6db3f2;
    --color-link-hover: #90caf9;
    --color-border: #333333;
    color-scheme: dark;
  }
}
```

**Example (inline FOUC prevention in Base.astro):**
```html
<script is:inline>
  (function() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

### Pattern 3: Schema.org JSON-LD as Astro Component

**What:** A dedicated `JsonLd.astro` component receives structured data as a prop, serializes it with `JSON.stringify()`, and renders a `<script type="application/ld+json">` tag in the `<head>`.
**When to use:** Any page that needs structured data. The component approach keeps JSON-LD out of the layout clutter.
**Trade-offs:** Minimal. The component is ~10 lines. Using `JSON.stringify` with the `set:html` directive avoids double-escaping issues.

**Example:**
```astro
---
// src/components/JsonLd.astro
interface Props {
  data: Record<string, unknown>;
}
const { data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

**Usage in Base.astro:**
```astro
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Antonio Castaldi",
  "alternateName": "Toto",
  "url": "https://toto-castaldi.github.io",
  "jobTitle": ["Entrepreneur", "Software Engineer", "Personal Trainer"],
  "worksFor": {
    "@type": "Organization",
    "name": "Skillbill srl",
    "url": "https://www.skillbill.it/"
  },
  "sameAs": [
    "https://github.com/toto-castaldi",
    "https://toto-castaldi.com"
  ]
}} />
```

### Pattern 4: Section Anchor Links with CSS-Only Reveal

**What:** Add an anchor link (`<a href="#id">`) next to each section heading that becomes visible on hover/focus. Use `scroll-behavior: smooth` on `html` with `prefers-reduced-motion` override. Add `scroll-margin-top` to prevent headings from sitting flush against viewport top.
**When to use:** Any content-heavy page where users want to share links to specific sections.
**Trade-offs:** Zero JavaScript required. The anchor icon needs a small inline SVG or Unicode character (use `#` or link icon). Hover-to-reveal is inaccessible for touch users -- mitigation: make anchor links always visible on mobile via media query.

**Example (Section.astro modification):**
```astro
---
interface Props {
  title: string;
  id?: string;
}
const { title, id } = Astro.props;
---
<section id={id}>
  <h2>
    {title}
    {id && (
      <a href={`#${id}`} class="anchor-link" aria-label={`Link to ${title}`}>#</a>
    )}
  </h2>
  <slot />
</section>

<style>
  section {
    margin-block: 2.5rem;
    scroll-margin-top: 1.5rem;
  }
  h2 {
    margin-block-end: 0.75rem;
  }
  .anchor-link {
    visibility: hidden;
    margin-inline-start: 0.35em;
    text-decoration: none;
    font-weight: 400;
    opacity: 0.5;
  }
  h2:hover .anchor-link,
  .anchor-link:focus {
    visibility: visible;
  }
  @media (hover: none) {
    .anchor-link {
      visibility: visible;
    }
  }
</style>
```

**CSS addition to global.css:**
```css
html {
  scroll-behavior: smooth;
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### Pattern 5: Static og:image with Full URL Construction

**What:** Place a pre-designed 1200x630 PNG in `public/og-image.png`. Construct the absolute URL in Base.astro using `new URL('/og-image.png', Astro.site)`. This avoids build-time image generation complexity.
**When to use:** Single-page sites or sites with few distinct pages. When a custom-designed card is preferred over auto-generated text.
**Trade-offs:** Manual image creation. If the site grows to many pages, switch to Satori-based generation later. For one page, a hand-crafted image looks better than auto-generated text anyway.

**Example (Base.astro addition):**
```astro
---
const ogImage = new URL('/og-image.png', Astro.site).href;
---
<!-- In <head> -->
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={ogImage} />
```

## Data Flow

### Build-Time Rendering Flow (with i18n)

```
astro.config.mjs
    │ (i18n: { locales: ['it','en'], defaultLocale: 'it' })
    │
    ├── src/pages/index.astro ────────→ dist/index.html (IT, lang="it")
    │       │
    │       ├── getLangFromUrl() → 'it'
    │       ├── useTranslations('it') → t()
    │       ├── Base.astro (title, description, lang='it')
    │       │     ├── og:image meta (absolute URL)
    │       │     ├── JSON-LD Person (via JsonLd.astro)
    │       │     ├── hreflang links (self + en alternate)
    │       │     ├── dark mode inline script
    │       │     └── <slot />
    │       ├── ThemeToggle.astro
    │       ├── LanguagePicker.astro (links to /en/)
    │       └── Section.astro x4 (translated titles + content)
    │
    └── src/pages/en/index.astro ─────→ dist/en/index.html (EN, lang="en")
            │
            ├── getLangFromUrl() → 'en'
            ├── useTranslations('en') → t()
            └── (same component tree, different translations)
```

### Dark Mode Data Flow (Runtime)

```
Page Load
    │
    ├── <script is:inline> (synchronous, before paint)
    │       ├── Read localStorage('theme')
    │       ├── Read matchMedia('prefers-color-scheme')
    │       └── Set document.documentElement.dataset.theme
    │
    ├── CSS applies via :root[data-theme="dark"] selectors
    │
    └── ThemeToggle.astro (user interaction)
            ├── Click → cycle light/dark/system
            ├── Set data-theme on <html>
            ├── Set color-scheme CSS property
            └── Write localStorage('theme')
```

### hreflang Link Structure

```
IT page (/) includes:
    <link rel="alternate" hreflang="it" href="https://toto-castaldi.github.io/" />
    <link rel="alternate" hreflang="en" href="https://toto-castaldi.github.io/en/" />
    <link rel="alternate" hreflang="x-default" href="https://toto-castaldi.github.io/" />

EN page (/en/) includes:
    <link rel="alternate" hreflang="it" href="https://toto-castaldi.github.io/" />
    <link rel="alternate" hreflang="en" href="https://toto-castaldi.github.io/en/" />
    <link rel="alternate" hreflang="x-default" href="https://toto-castaldi.github.io/" />
```

## Integration Points: What Changes in Each Existing File

### `astro.config.mjs` -- ADD i18n configuration

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

**Impact:** Astro recognizes `/en/` as a locale route. `Astro.currentLocale` becomes available in all pages. The `getRelativeLocaleUrl()` helper works.

### `src/layouts/Base.astro` -- MAJOR CHANGES

New props: `lang`, `ogImage` (optional).
New children in `<head>`: og:image meta tags, twitter card meta, hreflang links, JSON-LD script, dark mode inline script.
Change: `<html lang="it">` becomes `<html lang={lang}>`.
New component imports: `JsonLd.astro`.
New slot before `</body>`: `ThemeToggle.astro` is placed by each page, not the layout (pages control positioning).

### `src/components/Section.astro` -- MINOR CHANGES

Add anchor link next to `<h2>`, `scroll-margin-top` style. No prop changes (already has `id`).

### `src/styles/global.css` -- MODERATE CHANGES

Add dark mode token overrides under `:root[data-theme="dark"]`.
Add `@media (prefers-color-scheme: dark)` no-JS fallback.
Add `scroll-behavior: smooth` + `prefers-reduced-motion` override.
Add `color-scheme` property.
Change `hr` border color to use `var(--color-border)` instead of hardcoded `#e0e0e0`.

### `src/pages/index.astro` -- MODERATE CHANGES

Import i18n utilities. Use `t()` for all user-visible strings. Pass `lang="it"` to Base. Add ThemeToggle and LanguagePicker components in the template.

## Lighthouse Optimization Considerations

The current architecture is already well-positioned for high Lighthouse scores (zero JS, static HTML, system fonts, no images in content). The new features add minimal weight:

| Feature | Lighthouse Impact | Mitigation |
|---------|-------------------|------------|
| Dark mode inline script | +~400 bytes JS (render-blocking by design) | Acceptable: prevents FOUC, under 1KB |
| ThemeToggle component | +~600 bytes JS (interactive) | Use `<script>` tag in .astro file, not a framework component |
| og:image.png | +0 bytes page load (not loaded by browser) | Only fetched by social crawlers |
| JSON-LD script | +~300 bytes HTML | Invisible to users, zero render cost |
| hreflang links | +~200 bytes HTML | Zero render cost |
| Anchor link icons | +~20 bytes per section | CSS-only visibility toggle |

**Key Lighthouse optimizations to implement:**
1. `font-display: swap` -- already using system fonts, so not needed
2. `<meta name="theme-color">` -- add for both light and dark themes
3. Explicit `width`/`height` on any future `<img>` elements to prevent CLS
4. `<link rel="preconnect">` for external domains (skillbill.it, github.com) -- minor improvement for external link clicks
5. Ensure all `<a target="_blank">` have `rel="noopener noreferrer"` -- already done in current code

## Build Order (Dependency-Driven)

Features should be implemented in this order, based on what depends on what:

```
1. global.css (dark tokens)          -- No dependencies. Foundation for everything.
   └── Adds :root[data-theme="dark"], @media fallback, scroll-behavior

2. astro.config.mjs (i18n config)    -- No dependencies. Enables locale routing.
   └── Adds i18n block

3. src/i18n/ui.ts + utils.ts         -- Depends on: #2 (locale config must match)
   └── Translation dictionary + helpers

4. Base.astro (lang, og:image, etc)  -- Depends on: #1 (dark tokens), #3 (lang param)
   └── Dynamic lang, og:image, hreflang, dark mode script, JsonLd

5. JsonLd.astro                      -- No dependencies (generic component)
   └── Used by Base.astro

6. ThemeToggle.astro                 -- Depends on: #1 (dark tokens exist)
   └── Toggle button with localStorage

7. LanguagePicker.astro              -- Depends on: #3 (i18n utils)
   └── Links to alternate locale

8. Section.astro (anchor links)      -- No dependencies (CSS-only change)
   └── Add anchor link, scroll-margin-top

9. index.astro (IT, refactored)      -- Depends on: #3, #4, #6, #7, #8
   └── Use t(), pass lang, include new components

10. en/index.astro                   -- Depends on: #9 (mirrors structure)
    └── EN version of landing page

11. public/og-image.png              -- No code dependencies (design task)
    └── 1200x630 static social card
```

**Parallelizable work:**
- Steps 1, 2, 5, 8, 11 can all proceed in parallel
- Steps 3 + 6 + 7 can proceed in parallel after their dependencies
- Steps 9 + 10 are the final integration point

## Anti-Patterns

### Anti-Pattern 1: Using a Framework Component for Dark Mode Toggle

**What people do:** Import React/Svelte/Vue just for a theme toggle button, using `client:load`.
**Why it's wrong:** Ships a framework runtime (30-100KB) for a feature achievable in ~50 lines of vanilla JS. Destroys Lighthouse performance score. Breaks the zero-framework constraint.
**Do this instead:** Use a plain `.astro` component with a `<script>` tag. Astro automatically bundles and deduplicates `<script>` tags in `.astro` files.

### Anti-Pattern 2: Using `client:load` on Any Component

**What people do:** Slap `client:load` on an Astro component to "make it interactive."
**Why it's wrong:** `client:*` directives only work with framework components (React, Svelte, etc.), not `.astro` components. Astro components render to HTML at build time. Interactivity in `.astro` files comes from `<script>` tags.
**Do this instead:** For ThemeToggle, write a `<script>` block inside the `.astro` file. Astro processes it, bundles it, and includes it on pages that use the component.

### Anti-Pattern 3: Separate CSS Files for Dark Mode

**What people do:** Create `dark.css` and `light.css`, then toggle `<link>` tags or use `@import`.
**Why it's wrong:** Causes flash of unstyled content, doubles CSS download, creates cache invalidation issues.
**Do this instead:** Use CSS custom properties in one file. Toggle via `data-theme` attribute on `<html>`. All CSS loads once; only variable values change.

### Anti-Pattern 4: Duplicating Content Across Locale Pages

**What people do:** Copy-paste full HTML content into `en/index.astro`, maintaining two copies of the page structure.
**Why it's wrong:** Any structural change must be applied twice. Sections drift out of sync. Bug fixes get missed in one locale.
**Do this instead:** Keep all translatable strings in `src/i18n/ui.ts`. Both locale pages import the same components and call `t('key')`. The page structure is identical; only the `lang` variable and `t()` output differ.

### Anti-Pattern 5: Generating og:image at Build Time for a Single Page

**What people do:** Add `@vercel/og`, Satori, Sharp, and a build-time image generation pipeline for auto-generated social cards.
**Why it's wrong:** Adds 3+ dependencies, increases build time, produces generic text-on-background images that look worse than a hand-crafted design.
**Do this instead:** For a single-page personal site, design one og:image manually (Figma, Canva, or even SVG-to-PNG). Place it in `public/`. Revisit auto-generation only if the site grows to 10+ pages.

### Anti-Pattern 6: Using `set:html` for JSON-LD with User Input

**What people do:** Concatenate strings to build JSON-LD markup.
**Why it's wrong:** XSS vulnerability if any values contain `</script>` or similar HTML-breaking content.
**Do this instead:** Build a plain JavaScript object, pass it through `JSON.stringify()`, and use `set:html` on the `<script>` tag. `JSON.stringify` escapes special characters properly.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (1 page, 2 locales) | Inline content in page files, translation dictionary in `ui.ts`, static og:image |
| +5 pages | Each page gets IT + EN versions. Consider extracting shared page structure into a `PageShell.astro` component to avoid duplication |
| +3 locales | Add locale entries to `ui.ts`. Folder structure scales linearly. Consider splitting `ui.ts` into per-locale files if it exceeds ~200 lines |
| Blog/collection | Move to content collections with `src/content/blog/`. Use Satori for dynamic og:image generation per post. JSON-LD switches to Article type |

## Sources

- [Astro Internationalization (i18n) Routing -- Official Docs](https://docs.astro.build/en/guides/internationalization/) -- HIGH confidence
- [Add i18n Features -- Astro Official Recipe](https://docs.astro.build/en/recipes/i18n/) -- HIGH confidence
- [Astro i18n API Reference](https://docs.astro.build/en/reference/modules/astro-i18n/) -- HIGH confidence
- [Dark Mode Recipe -- Astro Tips](https://astro-tips.dev/recipes/dark-mode/) -- MEDIUM confidence
- [Dark Theme Toggle in Astro -- spilled.online](https://spilled.online/posts/astro-dark-theme-toggle/) -- MEDIUM confidence
- [Build a blog tutorial: Day to Night -- Astro Docs](https://docs.astro.build/en/tutorial/6-islands/2/) -- HIGH confidence
- [JSON-LD Person Schema -- jsonld.com](https://jsonld.com/person/) -- MEDIUM confidence
- [Add JSON-LD Structured Data in Astro -- johndalesandro.com](https://johndalesandro.com/blog/astro-add-json-ld-structured-data-to-your-website-for-rich-search-results/) -- MEDIUM confidence
- [Astro Scroll to Anchor -- Rodney Lab](https://rodneylab.com/astro-scroll-to-anchor/) -- MEDIUM confidence
- [Astro Performance Optimization Guide -- BetterLink Blog](https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/) -- MEDIUM confidence
- [Schema.org Person Specification](https://schema.org/Person) -- HIGH confidence

---
*Architecture research for: Dark mode, i18n, Schema.org, og:image, Lighthouse optimization*
*Existing architecture: Astro 5 static site (toto-castaldi.github.io)*
*Researched: 2026-02-19*
