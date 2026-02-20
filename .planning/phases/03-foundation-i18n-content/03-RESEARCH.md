# Phase 3: Foundation & i18n Content - Research

**Researched:** 2026-02-20
**Domain:** Astro i18n routing + CSS custom properties refactor
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### EN translation content
- Claude drafts English translations from the Italian source, user reviews before committing
- Professional tone matching the Italian version — no shift to informal
- Section titles use natural English equivalents, not literal translations (e.g., adapt to what sounds best in English)
- Name stays "Toto Castaldi" in both languages — consistent personal branding

#### CSS variable strategy
- Semantic naming convention: --color-text, --color-bg, --color-accent, etc. (named by purpose)
- Keep current color palette exactly — extract existing hex values into variables with zero visual change
- Variable definition location and whether to include non-color properties (spacing, etc.) left to Claude's discretion

#### Default locale behavior
- Browser language detection via small JS snippet (navigator.language check + redirect)
- Locale preference remembered in localStorage — once chosen, persists across visits
- Fallback for non-IT/EN browsers: English (as the more international option)
- / serves Italian content by default (before any JS detection runs)

#### Content adaptation
- Same four sections in both languages: Entrepreneurship, Computer Science, Fitness, CNV
- CNV translated as-is — no extra context added for international audience
- External links kept as original URLs (no swapping to English equivalents)
- Identical layout and visual structure between IT and EN — only text changes

### Claude's Discretion
- CSS variable definition location (:root in global CSS vs separate file)
- Whether to extract non-color properties (spacing, fonts) into variables
- Exact English equivalents for section titles

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| I18N-01 | English translation of all content available at /en/ path | Astro built-in i18n routing with `prefixDefaultLocale: false` creates `/en/` route from `src/pages/en/index.astro`. File-based routing, no runtime library needed. |
| I18N-02 | Italian content remains at root / (default locale, no prefix) | Astro i18n config with `defaultLocale: "it"` and `prefixDefaultLocale: false` serves Italian at `/` with no prefix. Verified in Astro 5 docs. |
</phase_requirements>

## Summary

This phase has two distinct workstreams that are largely independent: (1) extracting all hardcoded CSS colors into custom properties, and (2) setting up Astro's built-in i18n routing with Italian as the default locale at `/` and English at `/en/`.

The CSS refactor is straightforward — the current `global.css` already uses CSS custom properties for most colors. Only one hardcoded value remains (`#e0e0e0` on the `hr` border-top). The refactor involves adding a `--color-border` variable and replacing that one hardcoded value. The existing variables (`--color-bg`, `--color-text`, `--color-text-secondary`, `--color-link`, `--color-link-hover`) already follow semantic naming conventions that align with the user's decision.

The i18n setup uses Astro 5's built-in `i18n` configuration in `astro.config.mjs` — no third-party library needed. With `prefixDefaultLocale: false`, Italian pages stay at `/` and English pages live under `/en/`. The project currently has a single `src/pages/index.astro` that needs to be refactored into a shared layout/content pattern so both locales render identical structure with translated text. A small inline `<script>` handles browser language detection and localStorage persistence.

**Primary recommendation:** Use Astro's built-in i18n routing with a simple content dictionary pattern (`src/i18n/ui.ts` + `src/i18n/utils.ts`). Keep CSS variables in the existing `:root` block in `global.css` — no separate file needed for this small a project.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 5.17.x (installed: 5.17.3) | SSG framework with built-in i18n routing | Already in use; i18n is a first-class feature since Astro 3.5, mature in v5 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `astro:i18n` | built-in module | `getRelativeLocaleUrl()` and locale helpers | Generating locale-aware URLs in components |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro built-in i18n | astro-i18n (community) | Community lib adds features but is overkill for 2 locales on a static page; out of scope per REQUIREMENTS.md |
| Manual JSON translation files | i18next | Explicitly excluded in REQUIREMENTS.md out-of-scope ("Runtime i18n library incompatible con Astro 5, overkill per contenuto statico") |

**Installation:**
```bash
# No new packages needed — Astro's built-in i18n module covers everything
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── i18n/
│   ├── ui.ts             # Translation strings dictionary (IT + EN)
│   └── utils.ts          # getLangFromUrl(), useTranslations() helpers
├── components/
│   └── Section.astro     # Existing — unchanged
├── layouts/
│   └── Base.astro        # Modified: dynamic lang attr, accepts locale param
├── pages/
│   ├── index.astro       # Italian landing page (default locale, no prefix)
│   └── en/
│       └── index.astro   # English landing page
└── styles/
    └── global.css        # CSS custom properties in :root (refactored)
```

### Pattern 1: Astro i18n Config
**What:** Configure Astro's built-in i18n routing in `astro.config.mjs`
**When to use:** Any multi-locale Astro site
**Example:**
```typescript
// astro.config.mjs
// Source: https://docs.astro.build/en/guides/internationalization/
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```
**Key behavior:**
- `prefixDefaultLocale: false` means Italian pages at `/` have no prefix
- English pages must live in `src/pages/en/` and will be served at `/en/`
- `Astro.currentLocale` returns `'it'` for `/` and `'en'` for `/en/`

### Pattern 2: Translation Dictionary
**What:** Simple key-value translation strings in a TypeScript file
**When to use:** Static sites with a small, fixed set of translatable strings
**Example:**
```typescript
// src/i18n/ui.ts
// Source: https://docs.astro.build/en/recipes/i18n/
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
    'intro.sections': 'Ecco qualche parte di me :',
    // ... all section content
  },
  en: {
    'site.title': 'Antonio Castaldi',
    'site.description': 'Personal page of Antonio Castaldi — Entrepreneur, software engineer, personal trainer.',
    'intro.greeting': 'My name is Antonio Castaldi but everyone calls me Toto — feel free to do the same :)',
    'intro.sections': 'Here are some parts of me:',
    // ... all section content
  },
} as const;
```

### Pattern 3: Utility Functions
**What:** Helper functions to extract locale from URL and look up translations
**When to use:** In every component that needs locale-aware behavior
**Example:**
```typescript
// src/i18n/utils.ts
// Source: https://docs.astro.build/en/recipes/i18n/
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

### Pattern 4: Dynamic lang Attribute on Base Layout
**What:** Set `<html lang="...">` dynamically based on current locale
**When to use:** Base layout wrapping all pages
**Example:**
```astro
---
// src/layouts/Base.astro
// Source: https://docs.astro.build/en/recipes/i18n/
import { getLangFromUrl } from '../i18n/utils';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const lang = getLangFromUrl(Astro.url);
const { title, description } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<html lang={lang}>
  <!-- ... -->
</html>
```
**Key point:** Currently the layout hardcodes `lang="it"`. This must become dynamic.

### Pattern 5: Browser Language Detection Script
**What:** Small inline `<script>` that checks `navigator.language`, consults localStorage, and redirects if needed
**When to use:** On the Italian root page (`/`) to redirect English-preferring visitors to `/en/`
**Example:**
```html
<script is:inline>
  (function() {
    var STORAGE_KEY = 'preferred-lang';
    var stored = localStorage.getItem(STORAGE_KEY);

    // If user has a stored preference, respect it
    if (stored) {
      if (stored === 'en' && window.location.pathname === '/') {
        window.location.replace('/en/');
      }
      return;
    }

    // First visit: check browser language
    var browserLang = navigator.language || navigator.userLanguage || '';
    var isItalian = browserLang.startsWith('it');

    if (!isItalian && window.location.pathname === '/') {
      // Non-Italian browser on Italian page → redirect to English
      localStorage.setItem(STORAGE_KEY, 'en');
      window.location.replace('/en/');
    } else {
      // Store current preference
      localStorage.setItem(STORAGE_KEY, isItalian ? 'it' : 'en');
    }
  })();
</script>
```
**Key points:**
- Uses `is:inline` to prevent Astro from bundling/deferring it (must run immediately)
- `window.location.replace()` instead of `.href` to avoid polluting browser history
- Only runs on `/` (Italian page) — English page visitors already chose English
- localStorage check comes first so returning visitors are not re-detected
- Fallback for non-IT/non-EN browsers: English (per user decision)

### Pattern 6: Shared Page Template
**What:** Both locale pages (`index.astro` and `en/index.astro`) use the same structure but pull translations from the dictionary
**When to use:** When locale pages have identical layout with different text
**Example:**
```astro
---
// src/pages/en/index.astro
import Base from '../../layouts/Base.astro';
import Section from '../../components/Section.astro';
import { useTranslations } from '../../i18n/utils';

const t = useTranslations('en');
---
<Base title={t('site.title')} description={t('site.description')}>
  <main>
    <h1>{t('site.title')}</h1>
    <!-- ... sections using t() for all text ... -->
  </main>
</Base>
```

### Anti-Patterns to Avoid
- **Duplicating content without a shared source:** Never copy-paste Italian text into the English page and translate inline. All strings must live in `ui.ts` so they stay in sync.
- **Using `prefixDefaultLocale: true`:** This would put Italian at `/it/` which breaks the requirement that `/` serves Italian. Would also break all existing bookmarks/links.
- **Runtime i18n libraries (i18next, etc.):** Explicitly excluded in REQUIREMENTS.md. Astro's built-in + simple dictionary is sufficient.
- **Putting the detection script in `<body>`:** The language redirect script must be in `<head>` (or very early in body) and must use `is:inline` to execute before any content renders. Otherwise users see a flash of the wrong language.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale-aware URL generation | Manual string concatenation for `/en/` paths | `getRelativeLocaleUrl()` from `astro:i18n` | Handles edge cases with trailing slashes, base paths |
| i18n routing config | Custom middleware or redirect rules | Astro `i18n` config in `astro.config.mjs` | Built-in, well-tested, handles `Astro.currentLocale` automatically |
| Translation key type safety | Plain objects without `as const` | `as const` assertion on `ui` object | TypeScript catches missing/mistyped keys at compile time |

**Key insight:** Astro 5 has mature built-in i18n support. The entire routing layer is configured in ~8 lines of config. The only custom code needed is the translation dictionary and a small detection script.

## Common Pitfalls

### Pitfall 1: Forgetting the `is:inline` Directive on the Detection Script
**What goes wrong:** Astro bundles and defers the script, so it runs after the page renders. Users see Italian content flash before being redirected to English.
**Why it happens:** Astro processes `<script>` tags for optimization by default (bundling, deferred loading).
**How to avoid:** Always use `<script is:inline>` for the language detection snippet. This tells Astro to leave it as-is in the HTML.
**Warning signs:** Flash of wrong-language content on first visit.

### Pitfall 2: Hardcoded `lang="it"` in Base Layout
**What goes wrong:** The English page at `/en/` still has `<html lang="it">`, which is incorrect for accessibility and SEO.
**Why it happens:** The current `Base.astro` hardcodes `lang="it"`.
**How to avoid:** Use `getLangFromUrl(Astro.url)` or `Astro.currentLocale` to set it dynamically.
**Warning signs:** Lighthouse accessibility warning about language mismatch.

### Pitfall 3: Missing Trailing Slash Consistency
**What goes wrong:** `/en` and `/en/` behave differently; one may 404 or not match locale detection.
**Why it happens:** GitHub Pages and Astro have different trailing slash defaults.
**How to avoid:** Astro's `trailingSlash` config defaults to `'ignore'` which is fine. The `i18n` config handles this. Just be consistent in links (always use `/en/`).
**Warning signs:** 404 on `/en` without trailing slash.

### Pitfall 4: Redirect Loop on Language Detection
**What goes wrong:** The detection script on `/en/` also tries to redirect, creating infinite loops.
**Why it happens:** Putting the detection script on all pages without checking the current path.
**How to avoid:** Only include the detection/redirect script on the root Italian page (`/`). On `/en/`, the user has explicitly chosen English. Alternatively, check `window.location.pathname` before redirecting.
**Warning signs:** Browser "too many redirects" error.

### Pitfall 5: Not Updating localStorage When User Manually Navigates
**What goes wrong:** User navigates to `/en/` manually but localStorage still says `'it'`, so next visit redirects back to Italian.
**Why it happens:** localStorage is only set by the detection script, not by manual navigation.
**How to avoid:** On the English page, set `localStorage.setItem('preferred-lang', 'en')` unconditionally. On the Italian page, set `'it'`. This way any visit updates the preference.
**Warning signs:** User keeps getting redirected away from their chosen language.

### Pitfall 6: Leaving Hardcoded Colors in Component `<style>` Blocks
**What goes wrong:** The success criterion requires "every color value uses a CSS custom property." Scoped component styles may still have hardcoded colors.
**Why it happens:** Only checking `global.css` and missing the `Section.astro` scoped `<style>`.
**How to avoid:** Audit ALL `.astro` files for color values (hex, rgb, hsl, named colors). The current `Section.astro` uses only spacing — no colors — so it is clean. But verify after any changes.
**Warning signs:** `grep -rn '#[0-9a-fA-F]' src/` finds hits outside of `:root` variable definitions.

## Code Examples

### Complete astro.config.mjs with i18n
```typescript
// Source: Astro 5 docs — https://docs.astro.build/en/guides/internationalization/
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

### CSS Custom Property Extraction (Complete `:root` Block)
```css
/* src/styles/global.css — :root section after refactor */
:root {
  /* Typography */
  --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --font-h1: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  --font-h2: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --line-height: 1.6;

  /* Colors (semantic names — ready for dark mode override) */
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #555555;
  --color-link: #0056b3;
  --color-link-hover: #003d80;
  --color-border: #e0e0e0;

  /* Spacing */
  --content-max-width: 65ch;
  --content-padding: clamp(1rem, 5vw, 3rem);
}

/* ... then in the hr rule: */
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin-block: 2.5rem;
}
```

### Translation Dictionary Structure
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
    'intro.text': 'Mi chiamo Antonio Castaldi ma tutti mi chiamano <em>Toto</em>, fallo anche tu :)',
    'intro.sections': 'Ecco qualche parte di me :',
    'section.entrepreneurship.title': 'Imprenditoria',
    'section.entrepreneurship.p1': 'Prima da Freelance, poi in una società a nome collettivo ed infine da quasi vent\'anni fondatore e manager di <a href="https://www.skillbill.it/" target="_blank" rel="noopener noreferrer">Skillbill srl</a>.',
    'section.entrepreneurship.p2': 'Credo di poter co-creare ambienti di lavoro dove le persone vogliono stare. Collaborazione, trasparenza e attenzione sono i miei valori principali.',
    'section.cs.title': 'Informatica',
    'section.cs.p1': 'Mi piace tenermi aggiornato su algoritimi, linguaggi, architetture e soluzioni. Lo faccio sia per passione che per lavoro.',
    'section.cs.p2': '<a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">Qui</a> i miei repo e <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">Qui</a> dei progetti che ho creato.',
    'section.fitness.title': 'Fitness',
    'section.fitness.p1': 'Mi alleno con costanza e impegno da molti anni. Mi fa stare bene, è uno dei motivi per cui mi sveglio ogni giorno.',
    'section.fitness.p2': 'Lavoro come Personal Trainer e come istruttore di Pilates in due palestre dell\'interland milanese.',
    'section.cnv.title': 'Comunicazione Non Violenta',
    'section.cnv.p1': 'La Comunicazione Nonviolenta di Marshall Rosenberg mette al centro emozioni e bisogni. L\'ho studiata a più riprese e trovo che sia uno strumento eccezionale per connettermi a me stesso e agli altri. La uso quotidianamente.',
    'footer.contact': 'Mi puoi contattare scrivendomi alla mail',
    'footer.noai': 'scritto senza AI',
  },
  en: {
    'site.title': 'Antonio Castaldi',
    'site.description': 'Personal page of Antonio Castaldi — Entrepreneur, software engineer, personal trainer.',
    'intro.text': 'My name is Antonio Castaldi but everyone calls me <em>Toto</em> — feel free to do the same :)',
    'intro.sections': 'Here are some parts of me:',
    'section.entrepreneurship.title': 'Entrepreneurship',
    // ... Claude drafts, user reviews
    'section.cs.title': 'Computer Science',
    'section.fitness.title': 'Fitness',
    'section.cnv.title': 'Nonviolent Communication',
    'footer.contact': 'You can reach me at',
    'footer.noai': 'written without AI',
  },
} as const;
```

**Note on HTML in translation strings:** The content contains inline `<a>` and `<em>` tags. These should be kept in the translation strings and rendered with `set:html` in Astro components. This is the simplest approach for this volume of content.

### Rendering HTML Translations in Astro
```astro
---
// Usage in a page template
import { useTranslations } from '../i18n/utils';
const t = useTranslations('it');
---
<p set:html={t('section.entrepreneurship.p1')} />
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `astro-i18n` community package | Astro built-in `i18n` config | Astro 3.5 (Oct 2023), stable in 4.x/5.x | No third-party dependency needed |
| Manual locale folders without config | `i18n` config in `astro.config.mjs` with `Astro.currentLocale` | Astro 4.0 (Dec 2023) | Framework handles locale detection and URL helpers |
| Hardcoded colors with find-replace for dark mode | CSS custom properties in `:root` with media/attribute overrides | Mainstream since ~2020 | Industry standard; only viable approach for theme switching |

**Deprecated/outdated:**
- `astro-i18n` community package: unnecessary for simple static i18n since Astro 3.5+
- `i18next` runtime: explicitly out of scope per REQUIREMENTS.md
- `@astrojs/i18n` (does not exist as a separate package): everything is built into core `astro`

## Open Questions

1. **Translation string granularity for HTML-heavy content**
   - What we know: The Italian content has inline HTML (`<a>`, `<em>` tags). Strings with HTML must use `set:html` in Astro.
   - What's unclear: Whether to split paragraphs into separate keys (more granular, harder to maintain) or keep full paragraphs as single keys (simpler, but large strings).
   - Recommendation: Keep full paragraphs as single keys. The content is small (~15 strings per locale) and unlikely to have shared sub-phrases. Simpler is better here. Use `set:html` for rendering.

2. **Language detection script placement**
   - What we know: The script must be `is:inline` and run early to avoid FOUC of wrong language.
   - What's unclear: Whether to include it on all pages or only the Italian root page.
   - Recommendation: Include on Italian root page only (`src/pages/index.astro`). On `/en/`, just set localStorage to `'en'` without redirect logic. This avoids complexity and redirect loops.

3. **Section anchor IDs for English page**
   - What we know: Italian page has `#imprenditoria`, `#informatica`, `#fitness`, `#cnv`. SEO-03 (Phase 5) will add anchor links.
   - What's unclear: Whether English page should use English IDs (`#entrepreneurship`) or keep Italian IDs for consistency.
   - Recommendation: Keep Italian IDs on both pages for now. English anchor IDs are listed as a future enhancement (ENH-03) and are explicitly out of Phase 3 scope.

## Sources

### Primary (HIGH confidence)
- `/withastro/docs` (Context7) — Astro i18n routing configuration, `getRelativeLocaleUrl`, `Astro.currentLocale`, locale folder structure
- https://docs.astro.build/en/guides/internationalization/ — Official Astro i18n guide
- https://docs.astro.build/en/recipes/i18n/ — Official Astro i18n recipe with `ui.ts` + `utils.ts` pattern
- https://docs.astro.build/en/reference/modules/astro-i18n/ — `astro:i18n` API reference

### Secondary (MEDIUM confidence)
- https://medium.com/@paul.pietzko/internationalization-i18n-in-astro-5-78281827d4b4 — Astro 5 i18n walkthrough (verified against official docs)
- https://eastondev.com/blog/en/posts/dev/20251202-astro-i18n-guide/ — Astro i18n configuration guide with language switcher

### Tertiary (LOW confidence)
- None — all findings verified against official Astro documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Astro built-in i18n verified in Context7 and official docs; no new packages needed
- Architecture: HIGH — File-based routing pattern and `ui.ts`/`utils.ts` pattern directly from Astro official recipe
- CSS refactor: HIGH — Only one hardcoded color found (`#e0e0e0`); existing variables already follow semantic naming
- Pitfalls: HIGH — Common issues verified against multiple sources and Astro GitHub issues
- Language detection: MEDIUM — Client-side `navigator.language` pattern is well-established but the exact script needs testing for edge cases (incognito mode, disabled localStorage)

**Research date:** 2026-02-20
**Valid until:** 2026-04-20 (Astro i18n is stable; unlikely to change)
