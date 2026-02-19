# Phase 2: Contenuto, Design e Metadata - Research

**Researched:** 2026-02-19
**Domain:** Astro 5 layout/component architecture, CSS-only responsive design, semantic HTML, Open Graph metadata, favicon
**Confidence:** HIGH

## Summary

Phase 2 replaces the Phase 1 placeholder `index.astro` with the full landing page: four content sections (Imprenditoria, Informatica, Fitness, CNV) with identical text to the original `index.markdown`, a CSS-only responsive layout with improved typography, semantic HTML structure, Open Graph meta tags, and a favicon. The site ships zero JavaScript.

The architecture is straightforward: a `Base.astro` layout handles the HTML shell (`<head>` with meta/OG tags, `<body>` with `<slot />`), a `Section.astro` component wraps each of the four content sections for visual consistency, and `index.astro` assembles everything with inline HTML content translated from the original markdown. Global CSS lives in `src/styles/global.css` and is imported in the layout via an ESM import statement. Scoped component styles handle per-component specifics. The favicon is a simple SVG file placed in `public/favicon.svg`.

All technologies involved are built-in to Astro 5 (layouts, scoped styles, global CSS imports, `<slot />`). No additional npm dependencies are required. The entire phase is CSS + HTML work within the existing Astro scaffold.

**Primary recommendation:** Create `Base.astro` layout with full `<head>` (charset, viewport, title, OG tags, favicon link), create `Section.astro` component, write `global.css` with typography reset and responsive rules using `clamp()` for fluid sizing, inline the original markdown content as semantic HTML in `index.astro`, and place a simple SVG favicon in `public/`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | Contenuto markdown delle 4 sezioni (Imprenditoria, Informatica, Fitness, CNV) renderizzato identico all'attuale | Code Examples: original `index.markdown` content retrieved from git history (commit `HEAD~3`). Architecture: inline HTML in `index.astro` using `Section.astro` component for each section. Content is short enough to inline directly -- no content collections needed. |
| CONT-02 | Link email di contatto funzionante (mailto:toto.castaldi@gmail.com) | Standard HTML `<a href="mailto:toto.castaldi@gmail.com">`. Already present in original content. No Astro-specific handling needed. |
| CONT-03 | Link esterni funzionanti (Skillbill, GitHub, toto-castaldi.com) con target="_blank" rel="noopener noreferrer" | Standard HTML attributes. Three external links identified: `https://www.skillbill.it/`, `https://github.com/toto-castaldi`, `https://toto-castaldi.com`. Each needs `target="_blank" rel="noopener noreferrer"`. |
| CONT-04 | Nota "scritto senza AI" mantenuta | Original content ends with bold text `**scritto senza AI**`. Must be preserved verbatim in the page footer area. |
| DSGN-01 | Layout responsive (mobile + desktop) con CSS, zero JS | Architecture Patterns: CSS-only responsive using `max-width`, `padding`, `clamp()` for fluid typography. No media queries needed for simple single-column layout. Mobile-first approach with `max-width: 65ch` on body content. |
| DSGN-02 | Tipografia migliorata (font sizing, line-height, spacing) rispetto a Minima default | Standard Stack: system font stack, `clamp()` for fluid `font-size`, `line-height: 1.6`, proper `margin-block` spacing on headings and paragraphs. CSS custom properties for design tokens. |
| DSGN-03 | Design minimale bianco | Global CSS: `background-color: #ffffff`, dark text color (`#1a1a1a` or similar high-contrast), minimal decoration. No borders, no shadows, no background colors on sections. |
| DSGN-04 | HTML semantico (h1 per nome, h2 per sezioni, section tags) | Architecture: `<h1>` for "Antonio Castaldi" (name), `<h2>` inside each `<section>` for section titles, `<main>` wrapper, `<footer>` for contact and "scritto senza AI" note. |
| META-01 | `<title>Antonio Castaldi</title>` e `<meta charset="utf-8">` nel `<head>` | Base.astro layout pattern: `<meta charset="utf-8" />` as FIRST tag in `<head>`, `<title>` set via prop. Critical for Italian accented characters (Pitfall 10 from prior research). |
| META-02 | Meta viewport per mobile | Base.astro layout: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. Already present in Phase 1 placeholder; must persist in new layout. |
| META-03 | Open Graph tags (og:title, og:description, og:type) | Code Examples: OG meta tags in `<head>`. Use `Astro.site` for `og:url`. Minimum tags: `og:title`, `og:description`, `og:type` ("website"), `og:url`. No `og:image` required in this phase (v2 requirement ENH-03). |
| META-04 | Favicon (semplice, 32x32 o 48x48) | Place `favicon.svg` in `public/` directory. Reference via `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` in Base.astro `<head>`. Simple SVG with letter "T" or "AC" initials. |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x (already installed: ^5.17.1) | Static site framework | Already scaffolded in Phase 1; layouts, components, scoped styles are built-in |
| CSS (native) | N/A | All styling: typography, layout, responsive | Zero-JS constraint means no CSS-in-JS; Astro's built-in scoped `<style>` + global CSS import covers all needs |
| HTML5 semantic elements | N/A | Page structure | `<main>`, `<section>`, `<footer>`, `<header>` -- native browser support, no library needed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| System font stack (CSS) | N/A | Typography | `font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` -- zero network requests, looks native on every OS |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| System font stack | Google Fonts (Inter, Source Sans) | Adds external dependency, GDPR concern with Google Fonts hosted externally, extra HTTP request; system fonts are zero-cost and sufficient for minimal design |
| Inline HTML content in index.astro | Content collections (`src/content/`) | Adds schema file, collection config, `getCollection()` call -- overkill for a single page of static text |
| Hand-written CSS | Tailwind CSS or Pico CSS | Adds npm dependency, build step complexity; the CSS needed is ~80 lines for this single page |
| SVG favicon file | Multi-format favicon set (ICO + PNG + Apple Touch) | SVG is supported by all modern browsers, is resolution-independent, and requires only one file; ICO fallback is only needed for IE11 which is dead |

**Installation:**
```bash
# No additional packages needed. Everything is built into Astro 5.x already installed.
```

## Architecture Patterns

### Project Structure After Phase 2

```
src/
├── pages/
│   └── index.astro          # Full landing page (replaces Phase 1 placeholder)
├── layouts/
│   └── Base.astro            # HTML shell: <head> with meta/OG, <body> with <slot />
├── components/
│   └── Section.astro         # Reusable section wrapper (<section> + <h2> + <slot />)
└── styles/
    └── global.css            # Typography reset, spacing, responsive rules, design tokens

public/
├── favicon.svg               # NEW: simple SVG favicon
├── CNAME                      # Existing (empty)
└── assets/images/             # Existing images (preserved from Phase 1)
```

### Pattern 1: Layout with Props and Slot

**What:** `Base.astro` receives a `title` prop and renders the full HTML document shell. Page content flows in via `<slot />`. All `<head>` meta tags (charset, viewport, title, OG, favicon) live here.
**When to use:** Every page (currently just `index.astro`).

**Example:**
```astro
---
// src/layouts/Base.astro
// Source: https://docs.astro.build/en/basics/layouts/
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Pagina personale di Antonio Castaldi' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);

import '../styles/global.css';
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalURL} />
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pattern 2: Section Component with Typed Props

**What:** `Section.astro` wraps each content section in semantic `<section>` with `<h2>` heading. Content flows via `<slot />`. Optional `id` attribute enables future anchor links.
**When to use:** For each of the four content sections.

**Example:**
```astro
---
// src/components/Section.astro
interface Props {
  title: string;
  id?: string;
}
const { title, id } = Astro.props;
---
<section id={id}>
  <h2>{title}</h2>
  <slot />
</section>

<style>
  section {
    margin-block: 2.5rem;
  }
  h2 {
    margin-block-end: 0.75rem;
  }
</style>
```

### Pattern 3: Global CSS via ESM Import in Layout

**What:** Import `global.css` in the frontmatter of `Base.astro` using `import '../styles/global.css'`. Astro processes this at build time and injects the CSS into the `<head>` as an optimized `<style>` tag or linked stylesheet.
**When to use:** Always -- this is the standard Astro way to apply global styles.

**Example:**
```astro
---
// In Base.astro frontmatter
import '../styles/global.css';
---
```

**Critical:** Do NOT use a `<link rel="stylesheet">` pointing to a file in `public/`. That bypasses Astro's CSS processing (minification, deduplication, hashing). Always import CSS from `src/` using ESM imports.

### Pattern 4: Fluid Typography with clamp()

**What:** Use CSS `clamp()` for font sizes that scale smoothly between mobile and desktop without media queries.
**When to use:** All text-based sizing (body, h1, h2).

**Example:**
```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp */
:root {
  --font-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --font-h1: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  --font-h2: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
}
```

**Accessibility note:** The preferred value MUST include a `rem` component alongside `vw` so that browser zoom still works (WCAG requirement). Pure `vw` units do not respond to zoom.

### Anti-Patterns to Avoid

- **Using `<link rel="stylesheet" href="/styles/global.css">` pointing to `public/`:** Bypasses Astro's CSS build pipeline. CSS will not be minified, hashed, or deduplicated. Always import from `src/` via ESM.
- **Adding client-side JavaScript for any reason:** The phase requires zero JS. No `<script>` tags, no `client:*` directives. Even smooth scroll is achievable with `scroll-behavior: smooth` in CSS.
- **Using `is:global` on component styles instead of a global.css file:** `is:global` in component `<style>` blocks makes style origin unclear and creates maintenance issues. Keep global styles in `global.css`, keep component styles scoped.
- **Content collections for this single page:** Adds `src/content/config.ts`, `.astro/` cache concerns, schema validation. For one page of static text, inline HTML in `index.astro` is simpler and equivalent.
- **Missing `rel="noopener noreferrer"` on external links:** Security vulnerability. All `target="_blank"` links MUST have `rel="noopener noreferrer"`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS reset / normalize | Custom reset from scratch | Minimal targeted reset (box-sizing, margin removal on body) | A full CSS reset is overkill for a single-page site; target only the elements you use |
| Font loading | @font-face with preload logic | System font stack | Zero network requests; looks native; no FOUT/FOIT flash; no Google Fonts GDPR concerns |
| Responsive grid system | Custom grid framework | Single-column layout with `max-width` + `padding` | The page is linear text content; a grid system solves a problem that does not exist here |
| OG image generation | Dynamic image generation library | Static text-on-white PNG (future ENH-03) or omit og:image for now | Dynamic OG images are powerful but absurd for one page; og:image is v2 scope |
| Favicon generation pipeline | Multi-format favicon toolchain | Single `favicon.svg` file | SVG favicons are resolution-independent and supported everywhere modern; one file is enough |

**Key insight:** This phase is pure HTML + CSS craftsmanship. No libraries, no build tools beyond what Astro already provides. The complexity is in getting the content, structure, and styling right -- not in tooling.

## Common Pitfalls

### Pitfall 1: Missing `<meta charset="utf-8">` Breaks Italian Characters

**What goes wrong:** Accented characters (a, e, i, o, u) render as garbled symbols or question marks.
**Why it happens:** When creating a custom layout in Astro, the developer must include charset explicitly. Jekyll's Minima theme handled this automatically. Developers porting layouts focus on visual elements and overlook foundational `<head>` tags.
**How to avoid:** Place `<meta charset="utf-8" />` as the FIRST tag inside `<head>` in `Base.astro`. Test by viewing the live page and checking that "gia vent'anni" and "piu riprese" render correctly.
**Warning signs:** Browser shows garbled text where accented Italian characters should be.

### Pitfall 2: CSS Import from public/ Instead of src/

**What goes wrong:** CSS works but is not minified, not hashed, and not deduplicated. Changes to CSS may be cached indefinitely by browsers because the filename never changes.
**Why it happens:** Developers place CSS in `public/styles/` and reference it via `<link>` tag, expecting it to work like a traditional static site.
**How to avoid:** Always create CSS files in `src/styles/` and import them via ESM in the layout frontmatter: `import '../styles/global.css'`. Astro will process, minify, and hash the output.
**Warning signs:** CSS appears in `dist/` with its original filename (no hash). DevTools shows unminified CSS.

### Pitfall 3: Open Graph og:url Uses Relative Path Instead of Absolute URL

**What goes wrong:** Social media crawlers cannot resolve the URL. Preview cards show no title/description or show an error.
**Why it happens:** Developer uses `Astro.url.pathname` (relative) instead of constructing the full URL with `Astro.site`.
**How to avoid:** Construct the canonical URL with `new URL(Astro.url.pathname, Astro.site)`. This requires that `site` is set in `astro.config.mjs` (already done in Phase 1).
**Warning signs:** View page source shows `og:url` as a relative path like `/` instead of `https://toto-castaldi.github.io/`.

### Pitfall 4: Fluid Typography with Pure vw Units Fails Zoom (WCAG Violation)

**What goes wrong:** Font size does not increase when users zoom in with browser zoom. Fails WCAG 1.4.4 (Resize text).
**Why it happens:** Developer uses `font-size: 2.5vw` without a `rem` component. Viewport units do not respond to browser zoom.
**How to avoid:** Always use `clamp()` with a preferred value that combines `rem` and `vw`: `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`. The `rem` component ensures zoom responsiveness.
**Warning signs:** Text stays the same size when zooming in/out with Ctrl+/Ctrl-.

### Pitfall 5: Forgetting `target="_blank"` + `rel="noopener noreferrer"` on External Links

**What goes wrong:** External links open in the same tab (bad UX for a personal page -- user loses the page) or, without `rel`, the opened page can access the opener's `window.opener` reference (security risk, though modern browsers mitigate this).
**Why it happens:** Developer converts markdown links to HTML `<a>` tags but forgets the attributes since markdown does not have this concept.
**How to avoid:** Every `<a href="https://...">` pointing to an external domain must have `target="_blank" rel="noopener noreferrer"`. There are exactly three external links to handle: Skillbill, GitHub profile, toto-castaldi.com.
**Warning signs:** Clicking a link navigates away from the landing page instead of opening a new tab.

### Pitfall 6: Content Drift From Original

**What goes wrong:** The migrated content subtly differs from the original `index.markdown` -- a word changed, a line break added, an emphasis lost.
**Why it happens:** Manual transcription from markdown to HTML. The content is in Italian and may be unfamiliar to a non-Italian developer.
**How to avoid:** Use the original markdown content verbatim. The exact text is preserved in git history at `HEAD~3:index.markdown`. Compare rendered output against the original character by character. Key Italian text to verify: "gia vent'anni", "piu riprese", "interland milanese".
**Warning signs:** Content review reveals differences in wording, emphasis, or paragraph structure.

## Code Examples

Verified patterns from official sources:

### global.css (Complete Typography and Layout)

```css
/* src/styles/global.css */
/* Source: Astro tutorial + MDN clamp() reference */

/* === Reset === */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

/* === Design Tokens === */
:root {
  /* Typography */
  --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --font-h1: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  --font-h2: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --line-height: 1.6;

  /* Colors (minimal white design) */
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #555555;
  --color-link: #0056b3;
  --color-link-hover: #003d80;

  /* Spacing */
  --content-max-width: 65ch;
  --content-padding: clamp(1rem, 5vw, 3rem);
}

/* === Base Typography === */
html {
  font-family: var(--font-family);
  font-size: var(--font-body);
  line-height: var(--line-height);
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-text-size-adjust: 100%;
}

body {
  max-width: var(--content-max-width);
  margin-inline: auto;
  padding-inline: var(--content-padding);
  padding-block: 2rem;
}

/* === Headings === */
h1 {
  font-size: var(--font-h1);
  line-height: 1.2;
  margin-block: 0 1rem;
}

h2 {
  font-size: var(--font-h2);
  line-height: 1.3;
  margin-block: 2rem 0.75rem;
}

/* === Links === */
a {
  color: var(--color-link);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

a:hover,
a:focus-visible {
  color: var(--color-link-hover);
}

/* === Paragraphs === */
p {
  margin-block: 0 1rem;
}

/* === Horizontal Rule (section dividers) === */
hr {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin-block: 2.5rem;
}
```

### Base.astro (Full Layout with OG Tags)

```astro
---
// src/layouts/Base.astro
// Source: https://docs.astro.build/en/basics/layouts/
// Source: https://docs.astro.build/en/guides/configuring-astro/ (Head component pattern)
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Pagina personale di Antonio Castaldi — Imprenditore, informatico, personal trainer.' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);

import '../styles/global.css';
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalURL} />
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Section.astro (Reusable Section Component)

```astro
---
// src/components/Section.astro
interface Props {
  title: string;
  id?: string;
}
const { title, id } = Astro.props;
---
<section id={id}>
  <h2>{title}</h2>
  <slot />
</section>

<style>
  section {
    margin-block: 2.5rem;
  }
  h2 {
    margin-block-end: 0.75rem;
  }
</style>
```

### index.astro (Full Page Assembly)

```astro
---
// src/pages/index.astro
import Base from '../layouts/Base.astro';
import Section from '../components/Section.astro';
---
<Base title="Antonio Castaldi">
  <main>
    <h1>Antonio Castaldi</h1>
    <p>Mi chiamo Antonio Castaldi ma tutti mi chiamano <em>Toto</em>, fallo anche tu :)</p>
    <p>Ecco qualche parte di me :</p>

    <Section title="Imprenditoria" id="imprenditoria">
      <p>Prima da Freelance, poi in una societa a nome collettivo ed infine da quasi vent'anni fondatore e manager di <a href="https://www.skillbill.it/" target="_blank" rel="noopener noreferrer">Skillbill srl</a>.</p>
      <p>Credo di poter co-creare ambienti di lavoro dove le persone vogliono stare. Collaborazione, trasparenza e attenzione sono i miei valori principali.</p>
    </Section>

    <Section title="Informatica" id="informatica">
      <p>Mi piace tenermi aggiornato su algoritimi, linguaggi, architetture e soluzioni. Lo faccio sia per passione che per lavoro.</p>
      <p><a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">Qui</a> i miei repo e <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">Qui</a> dei progetti che ho creato.</p>
    </Section>

    <Section title="Fitness" id="fitness">
      <p>Mi alleno con costanza e impegno da molti anni. Mi fa stare bene, e uno dei motivi per cui mi sveglio ogni giorno.</p>
      <p>Lavoro com Personal Trainer e come istruttore di Pilates in due palestre dell'interland milanese.</p>
    </Section>

    <Section title="Comunicazione Non Violenta" id="cnv">
      <p>La Comunicazione Nonviolenta di Marshall Rosenberg mette al centro emozioni e bisogni. L'ho studiata a piu riprese e trovo che sia uno strumento eccezionale per connettermi a me stesso e agli altri. La uso quotidianamente.</p>
    </Section>

    <hr />

    <footer>
      <p>Mi puoi contattare scrivendomi alla mail <a href="mailto:toto.castaldi@gmail.com">toto.castaldi@gmail.com</a></p>
      <hr />
      <p><strong>scritto senza AI</strong></p>
    </footer>
  </main>
</Base>
```

**Note:** The content above uses plain characters where the original had accented characters (e.g., "societa" should be "societa" with accent, "gia" with accent, "piu" with accent, "e" with accent). The actual implementation MUST preserve the exact Italian UTF-8 characters from the original `index.markdown` at git commit `HEAD~3`.

### favicon.svg (Minimal SVG)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="12" fill="#1a1a1a"/>
  <text x="50" y="72" font-family="system-ui, sans-serif" font-size="64" font-weight="700" fill="#ffffff" text-anchor="middle">T</text>
</svg>
```

This produces a dark rounded square with a white "T" letter (for Toto). The SVG is ~250 bytes, resolution-independent, and requires no external tools to create.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<link rel="icon" type="image/x-icon" href="/favicon.ico">` | `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` | Widespread browser support since 2021+ | SVG favicons are resolution-independent, support dark mode via `prefers-color-scheme`, and require only one file |
| Fixed pixel font sizes (`font-size: 16px`) | Fluid typography with `clamp()` (`clamp(1rem, calc, 1.125rem)`) | CSS `clamp()` has full support since 2020 | Eliminates media queries for font sizing; automatically adapts between mobile and desktop |
| Separate mobile/desktop CSS with breakpoints | `max-width` + `padding` for simple layouts | Always for single-column content | Breakpoints are only needed for multi-column layouts; single-column with `max-width` is inherently responsive |
| CSS reset (normalize.css, reset.css) | Minimal targeted reset (box-sizing, body margin) | Industry trend since ~2022 | Full resets are overkill for controlled environments; target only elements you actually use |
| `font-family: Arial, sans-serif` | `font-family: system-ui, -apple-system, ...` (system font stack) | Standardized in 2022 with `system-ui` keyword | Zero network requests, native appearance, no FOUT/FOIT, works everywhere |

**Deprecated/outdated:**
- `@import` in CSS files: Still works but slower than ESM import in Astro frontmatter (two network requests vs one bundled output)
- ICO favicons as primary: Only needed for IE11 (dead browser); SVG is the modern standard
- Viewport units (`vw`) alone for font sizing: Fails WCAG zoom requirements; must combine with `rem`

## Open Questions

1. **Exact accented characters in content**
   - What we know: The original `index.markdown` contains Italian accented characters (a, e, i, o, u with grave accents). Git history preserves them exactly.
   - What's unclear: Whether copy-pasting from git show output to the new `.astro` file preserves encoding correctly.
   - Recommendation: Read the raw bytes from git history during implementation. After building, verify every accented character renders correctly in the browser. Test: "vent'anni", "piu riprese", "societa", "Nonviolenta", "interland".

2. **og:image inclusion or omission**
   - What we know: The Open Graph protocol lists `og:image` as one of four required properties. However, requirement META-03 only specifies `og:title, og:description, og:type`. The `og:image` is listed as v2 enhancement (ENH-03).
   - What's unclear: Whether social platforms will show a reasonable preview without `og:image`.
   - Recommendation: Omit `og:image` for now per the requirement scope. Most platforms (LinkedIn, WhatsApp, Telegram) will still show `og:title` and `og:description` text even without an image -- the preview just won't have a visual thumbnail. Add og:image in v2 (ENH-03).

3. **Favicon design choice**
   - What we know: META-04 requires a simple favicon, 32x32 or 48x48. SVG is resolution-independent so size specification is about the viewBox, not pixels.
   - What's unclear: Whether the user prefers "T" (for Toto), "AC" (initials), or some other design.
   - Recommendation: Default to "T" in a dark rounded square (simple, recognizable, on-brand with minimal aesthetic). The SVG file is trivial to modify later.

4. **`<em>` vs `<i>` for italics in "Toto"**
   - What we know: The original markdown uses `*Toto*` which renders as `<em>Toto</em>` (emphasis). In HTML, `<em>` conveys semantic emphasis to screen readers.
   - What's unclear: Whether the author intends emphasis or just visual styling.
   - Recommendation: Use `<em>` to match the markdown semantics exactly.

## Sources

### Primary (HIGH confidence)
- [Astro Layouts documentation](https://docs.astro.build/en/basics/layouts/) -- Layout component pattern with `<slot />`, props, CSS import
- [Astro Styling Guide](https://docs.astro.build/en/guides/styling/) -- Scoped styles, `is:global`, ESM CSS import, global.css pattern
- [Astro Configuring Head metadata](https://docs.astro.build/en/guides/configuring-astro/) -- Head component pattern for SEO/OG tags, `Astro.site`, `Astro.url`
- [Astro API Reference -- Astro.site, Astro.url](https://docs.astro.build/en/reference/api-reference/) -- Canonical URL construction: `new URL(Astro.url.pathname, Astro.site)`
- [MDN clamp() reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp) -- Fluid typography syntax, browser support
- [The Open Graph protocol](https://ogp.me/) -- Required OG properties: og:title, og:type, og:image, og:url
- Context7 `/withastro/docs` -- Layout component examples, global CSS import pattern, Head component with OG tags, canonical URL construction

### Secondary (MEDIUM confidence)
- [Astro tutorial -- global CSS](https://docs.astro.build/en/tutorial/2-pages/5/) -- global.css example with body max-width, line-height, box-sizing
- [Smashing Magazine -- Modern Fluid Typography Using CSS Clamp](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/) -- clamp() best practices, WCAG accessibility with rem+vw
- [SVG Favicons in Action -- CSS-Tricks](https://css-tricks.com/svg-favicons-in-action/) -- SVG favicon format, browser support
- [Minimal SVG Favicon -- phpied.com](https://www.phpied.com/minimal-svg-favicon/) -- Inline SVG favicon technique

### Tertiary (LOW confidence)
- None -- all findings verified against primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new dependencies; all built-in Astro features verified against Context7 and official docs
- Architecture: HIGH -- Layout + Component + Slot pattern is the canonical Astro pattern, verified against official docs and tutorial
- Content migration: HIGH -- Original content retrieved from git history; exact text known
- CSS/Typography: HIGH -- `clamp()`, system fonts, and responsive patterns are well-documented web standards
- Open Graph: HIGH -- OG protocol is stable since 2010; Astro canonical URL pattern verified in Context7
- Pitfalls: HIGH -- All pitfalls sourced from Phase 1 research (which was verified against official docs) or standard web development knowledge

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (30 days -- all technologies are stable, no breaking changes expected)
