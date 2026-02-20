# Phase 5: SEO & Metadata - Research

**Researched:** 2026-02-20
**Domain:** SEO structured data, Open Graph social sharing, i18n cross-references, anchor navigation
**Confidence:** HIGH

## Summary

Phase 5 adds six requirements across two domains: internationalization completeness (hreflang tags, language switcher, translated OG metadata) and SEO enhancements (Person JSON-LD, og:image, section anchor links). The project already has a solid foundation: Astro 5 with `i18n` routing configured (`prefixDefaultLocale: false`, locales `['it', 'en']`), a `Base.astro` layout with existing OG tags (title, description, type, url), a translation system (`ui.ts` + `utils.ts`), and section `<section id="...">` elements on both pages. All four section IDs (`imprenditoria`, `informatica`, `fitness`, `cnv`) are already present on both IT and EN pages.

No new npm packages are needed. Astro 5 provides `getAbsoluteLocaleUrl()` from `astro:i18n` for generating locale-aware absolute URLs (used for hreflang and language switcher links). JSON-LD is injected as a `<script type="application/ld+json">` tag in the layout head. The og:image requires a static 1200x630 PNG placed in `public/` (Satori generation explicitly deferred to ENH-02). CSS `scroll-behavior: smooth` handles anchor scrolling with a single line.

**Primary recommendation:** Implement all six requirements in the `Base.astro` layout and page templates using only Astro built-ins and standard HTML/CSS -- no additional dependencies required.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| I18N-03 | hreflang tags on all pages (including self-references) | Use `getAbsoluteLocaleUrl()` from `astro:i18n` to generate `<link rel="alternate" hreflang="...">` tags in Base.astro for it, en, and x-default |
| I18N-04 | Language switcher link visible on all pages | Add a simple `<a>` link in the layout (near theme toggle or in header) using `getRelativeLocaleUrl()` to link to the alternate locale page, labeled in the target language |
| I18N-05 | OG metadata (title, description) translated per language | Already working -- Base.astro receives `title` and `description` as props from each page, which passes translated values via `t()`. Verify og:locale tag is added |
| SEO-01 | Schema.org Person JSON-LD structured data in page head | Inject `<script type="application/ld+json">` in Base.astro head with Person schema for Antonio Castaldi, localized per language |
| SEO-02 | og:image (1200x630 static PNG) with absolute URL | Create a 1200x630 PNG, place in `public/og-image.png`, add og:image meta tags with absolute URL via `Astro.site` |
| SEO-03 | Section anchor links (#imprenditoria, #informatica, #fitness, #cnv) | Section IDs already exist. Add `scroll-behavior: smooth` to CSS, optionally add visible anchor links in section headings |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.17.1 | SSG framework, i18n routing, URL helpers | Already installed, provides `astro:i18n` module with `getAbsoluteLocaleUrl` and `getRelativeLocaleUrl` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | - | - | No additional packages needed for this phase |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual hreflang tags | astro-seo package | Overkill for 2 locales; manual tags give full control with ~5 lines |
| Static PNG og:image | Satori (build-time generation) | Explicitly deferred to ENH-02; static PNG is simpler and meets requirement |
| CSS scroll-behavior | JS smooth scroll library | CSS-only is sufficient, zero-JS, universally supported |

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### Recommended Changes to Existing Structure
```
src/
├── layouts/
│   └── Base.astro          # ADD: hreflang, JSON-LD, og:image, og:locale, language switcher
├── components/
│   ├── Section.astro        # MODIFY: optionally add visible anchor link in heading
│   └── ThemeToggle.astro    # NO CHANGE
├── i18n/
│   ├── ui.ts               # ADD: og:locale values ('it_IT', 'en_US')
│   └── utils.ts            # NO CHANGE (or add getAlternateLocale helper)
├── pages/
│   ├── index.astro          # NO CHANGE (already passes translated title/description)
│   └── en/index.astro       # NO CHANGE
├── styles/
│   └── global.css           # ADD: scroll-behavior: smooth, language switcher styles
public/
└── og-image.png             # NEW: 1200x630 static PNG for social sharing
```

### Pattern 1: hreflang Tags in Layout Head
**What:** Generate `<link rel="alternate">` tags for all locales plus x-default in the `<head>`
**When to use:** Every page rendered through Base.astro (which is all pages)
**Example:**
```astro
---
// In Base.astro frontmatter
import { getAbsoluteLocaleUrl } from 'astro:i18n';

const currentPath = Astro.url.pathname;
// For prefixDefaultLocale: false, the path for default locale (it) has no prefix
// getAbsoluteLocaleUrl handles this automatically based on astro.config.mjs
const itUrl = getAbsoluteLocaleUrl('it', '');
const enUrl = getAbsoluteLocaleUrl('en', '');
---
<!-- In <head> -->
<link rel="alternate" hreflang="it" href={itUrl} />
<link rel="alternate" hreflang="en" href={enUrl} />
<link rel="alternate" hreflang="x-default" href={itUrl} />
```
**Source:** Astro official docs -- https://docs.astro.build/en/reference/modules/astro-i18n/

### Pattern 2: Person JSON-LD in Layout Head
**What:** Inject Schema.org Person structured data as JSON-LD script tag
**When to use:** On every page, with language-aware fields
**Example:**
```astro
---
// In Base.astro frontmatter
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Antonio Castaldi",
  "alternateName": "Toto",
  "url": "https://toto-castaldi.github.io",
  "jobTitle": lang === 'it'
    ? ["Imprenditore", "Informatico", "Personal Trainer"]
    : ["Entrepreneur", "Software Engineer", "Personal Trainer"],
  "worksFor": {
    "@type": "Organization",
    "name": "Skillbill srl",
    "url": "https://www.skillbill.it/"
  },
  "knowsLanguage": ["it", "en"],
  "sameAs": [
    "https://github.com/toto-castaldi",
    "https://toto-castaldi.com"
  ]
});
---
<!-- In <head> -->
<script type="application/ld+json" set:html={personJsonLd} />
```
**Source:** Schema.org Person type -- https://schema.org/Person, JSON-LD best practices -- https://jsonld.com/person/

### Pattern 3: og:image with Absolute URL
**What:** Add og:image meta tags pointing to a static 1200x630 PNG
**When to use:** Every page, same image for both locales
**Example:**
```astro
---
// In Base.astro frontmatter
const ogImageURL = new URL('/og-image.png', Astro.site);
---
<!-- In <head>, alongside existing OG tags -->
<meta property="og:image" content={ogImageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:locale" content={lang === 'it' ? 'it_IT' : 'en_US'} />
<meta property="og:locale:alternate" content={lang === 'it' ? 'en_US' : 'it_IT'} />
<!-- Twitter Card tags (uses same image) -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL} />
```
**Source:** Astro docs -- https://docs.astro.build/en/reference/api-reference (Astro.url/Astro.site), Open Graph protocol -- https://ogp.me

### Pattern 4: Language Switcher as Simple Link
**What:** A visible link that switches between IT and EN versions of the page
**When to use:** Every page, positioned near the theme toggle
**Example:**
```astro
---
// In Base.astro frontmatter
import { getRelativeLocaleUrl } from 'astro:i18n';

const alternateLang = lang === 'it' ? 'en' : 'it';
const alternateLabel = lang === 'it' ? 'English' : 'Italiano';
const alternateUrl = getRelativeLocaleUrl(alternateLang, '');
---
<!-- In <body>, near ThemeToggle -->
<a href={alternateUrl} class="lang-switch" aria-label={`Switch to ${alternateLabel}`}>
  {alternateLabel}
</a>
```
**Key design decisions:**
- Label in the target language (not current): "English" on IT page, "Italiano" on EN page
- Simple `<a>` tag, not a dropdown (only 2 locales)
- Position: fixed near the theme toggle (top-right area) for consistency
- Must also update `localStorage.setItem('preferred-lang', ...)` -- this can be handled by the destination page's existing script

### Pattern 5: Smooth Scroll Anchor Links
**What:** CSS-only smooth scrolling when clicking section anchor links
**When to use:** Global CSS, applies to all anchor navigation
**Example:**
```css
/* In global.css */
html {
  scroll-behavior: smooth;
}

/* Respect user preference for reduced motion */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```
**Source:** MDN Web Docs -- https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior

### Anti-Patterns to Avoid
- **Generating og:image at build time with Satori:** Explicitly deferred to ENH-02. Use a static PNG.
- **Using flags for language switcher:** Flags represent countries, not languages. Use language names instead.
- **Forgetting x-default hreflang:** Must include `hreflang="x-default"` pointing to the default locale page for search engines to know which is the fallback.
- **Hardcoding absolute URLs:** Use `Astro.site` and `getAbsoluteLocaleUrl()` so URLs are derived from config, not hardcoded strings.
- **Putting JSON-LD in body:** Place the `<script type="application/ld+json">` in `<head>` for fastest parser pickup (Google accepts both but head is conventional).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale-aware URLs | Manual string concatenation of `/en/` paths | `getAbsoluteLocaleUrl()` / `getRelativeLocaleUrl()` from `astro:i18n` | Handles prefix logic based on `prefixDefaultLocale` setting automatically |
| Smooth scrolling | JavaScript scroll animation library | CSS `scroll-behavior: smooth` | Zero JS, universal browser support (2025+), graceful degradation |
| JSON serialization | Template literal JSON strings | `JSON.stringify()` on a JS object | Avoids quoting/escaping bugs, type-safe |
| Social preview validation | Manual visual testing | Facebook Sharing Debugger, Twitter Card Validator, LinkedIn Post Inspector | These tools show exactly what crawlers see |

**Key insight:** This entire phase requires zero new dependencies. Astro's built-in `astro:i18n` module, standard HTML meta tags, JSON-LD in a script tag, and one CSS property cover everything.

## Common Pitfalls

### Pitfall 1: hreflang Self-Reference Missing
**What goes wrong:** Each page must include a hreflang tag pointing to ITSELF, not just to alternate languages. Missing self-references confuse search engines.
**Why it happens:** Developers think hreflang only declares "alternatives" and skip the current page.
**How to avoid:** Always loop through ALL locales (including current) when generating hreflang tags.
**Warning signs:** Google Search Console shows "no return tag" hreflang errors.

### Pitfall 2: og:image URL Not Absolute
**What goes wrong:** Social platforms cannot fetch the image if the URL is relative (e.g., `/og-image.png`).
**Why it happens:** Forgetting to construct absolute URL with domain.
**How to avoid:** Use `new URL('/og-image.png', Astro.site)` which produces `https://toto-castaldi.github.io/og-image.png`.
**Warning signs:** Social media previews show no image.

### Pitfall 3: JSON-LD Syntax Errors from Template Literals
**What goes wrong:** Hand-writing JSON in template literals leads to missing commas, unescaped quotes, or trailing commas.
**Why it happens:** JSON is strict about syntax; template literal interpolation masks errors.
**How to avoid:** Build a JavaScript object and `JSON.stringify()` it. Use Astro's `set:html` directive to inject safely.
**Warning signs:** Schema.org Validator shows parse errors.

### Pitfall 4: Language Switcher Does Not Update localStorage
**What goes wrong:** User clicks language switcher but the auto-redirect script on the IT page sends them back based on old `preferred-lang` value in localStorage.
**Why it happens:** The language switcher navigates to the other locale page, but if localStorage still says the previous preference, the redirect script on index.astro could bounce them back.
**How to avoid:** The EN page already sets `localStorage.setItem('preferred-lang', 'en')`. The IT page's redirect script checks localStorage first and only redirects if `stored === 'en'`. Clicking the language switcher to go to IT needs to either: (a) add `onclick` to clear/set localStorage before navigation, or (b) add a query param that the IT page recognizes to skip redirect. Simplest: set localStorage in an inline onclick handler or in a tiny `is:inline` script on the switcher link.
**Warning signs:** Clicking "Italiano" from EN page immediately redirects back to EN.

### Pitfall 5: Missing og:locale Tags
**What goes wrong:** Social platforms don't know which language version of OG metadata to use.
**Why it happens:** `og:locale` is often overlooked since `og:title` and `og:description` are the focus.
**How to avoid:** Add `og:locale` (e.g., `it_IT`) and `og:locale:alternate` (e.g., `en_US`) meta tags.
**Warning signs:** Facebook debugger shows wrong language for shared link.

### Pitfall 6: scroll-behavior Ignores prefers-reduced-motion
**What goes wrong:** Users with vestibular disorders experience discomfort from smooth scrolling animations.
**Why it happens:** Developers add `scroll-behavior: smooth` globally without considering accessibility.
**How to avoid:** Add `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`.
**Warning signs:** Lighthouse accessibility audit may flag it; user complaints.

## Code Examples

### Complete hreflang Tags Block
```astro
---
// Base.astro additions
import { getAbsoluteLocaleUrl } from 'astro:i18n';

const itUrl = getAbsoluteLocaleUrl('it', '');
const enUrl = getAbsoluteLocaleUrl('en', '');
---
<!-- hreflang tags -->
<link rel="alternate" hreflang="it" href={itUrl} />
<link rel="alternate" hreflang="en" href={enUrl} />
<link rel="alternate" hreflang="x-default" href={itUrl} />
```

### Complete Person JSON-LD Object
```typescript
// Build the JSON-LD object in Base.astro frontmatter
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Antonio Castaldi",
  "alternateName": "Toto",
  "url": "https://toto-castaldi.github.io",
  "image": new URL('/og-image.png', Astro.site).toString(),
  "jobTitle": lang === 'it'
    ? ["Imprenditore", "Informatico", "Personal Trainer"]
    : ["Entrepreneur", "Software Engineer", "Personal Trainer"],
  "worksFor": {
    "@type": "Organization",
    "name": "Skillbill srl",
    "url": "https://www.skillbill.it/"
  },
  "knowsLanguage": ["it", "en"],
  "sameAs": [
    "https://github.com/toto-castaldi",
    "https://toto-castaldi.com"
  ]
};
```

### Complete OG + Twitter Meta Tags
```astro
---
const ogImageURL = new URL('/og-image.png', Astro.site);
---
<!-- Open Graph (existing tags already in Base.astro, ADD these) -->
<meta property="og:image" content={ogImageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:locale" content={lang === 'it' ? 'it_IT' : 'en_US'} />
<meta property="og:locale:alternate" content={lang === 'it' ? 'en_US' : 'it_IT'} />
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL} />
```

### Language Switcher with localStorage Sync
```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';

const alternateLang = lang === 'it' ? 'en' : 'it';
const alternateLabel = lang === 'it' ? 'English' : 'Italiano';
const alternateUrl = getRelativeLocaleUrl(alternateLang, '');
---
<a
  href={alternateUrl}
  class="lang-switch"
  aria-label={lang === 'it' ? 'Switch to English' : 'Passa a Italiano'}
  onclick={`localStorage.setItem('preferred-lang','${alternateLang}')`}
>
  {alternateLabel}
</a>
```

### Smooth Scroll CSS
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

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual locale URL construction | `astro:i18n` helpers (`getAbsoluteLocaleUrl`) | Astro 4.0+ (2023) | Type-safe, config-driven locale URLs |
| Microdata / RDFa for structured data | JSON-LD (Google recommended) | ~2020 onwards | Cleaner separation, easier to maintain |
| JavaScript smooth scrolling libraries | CSS `scroll-behavior: smooth` | Baseline 2023 (all modern browsers) | Zero JS, native performance |
| `<meta name="twitter:*">` only | Open Graph tags + twitter:card | Twitter adopted OG fallback ~2022 | Can use OG tags as fallback; only `twitter:card` is strictly needed beyond OG |

**Deprecated/outdated:**
- Google Structured Data Testing Tool: Replaced by Rich Results Test and Schema.org Validator
- `twitter:image:src`: Use `twitter:image` instead
- Flag icons for language switchers: Industry consensus is to use language names in target language

## Open Questions

1. **og:image visual design**
   - What we know: Requirement is a static 1200x630 PNG (SEO-02). STATE.md blocker says "og:image visual design must be decided before phase starts."
   - What's unclear: What should the image contain? Name, title, photo? Minimalist text-only matching site design?
   - Recommendation: Create a simple minimalist design with "Antonio Castaldi" name, subtitle roles, and site URL on a white/branded background. One image shared by both locales (name is the same in both languages). The planner should include image creation as a task but allow flexibility on visual design.

2. **Language switcher position and styling**
   - What we know: Must be visible on all pages (I18N-04). Theme toggle is fixed top-right.
   - What's unclear: Should it be next to the theme toggle? In a header bar? In the footer?
   - Recommendation: Place it fixed top-left (mirroring the theme toggle's top-right position) or inline near the page title. For minimal design, a simple text link styled like a navigation element works best. The planner can decide exact positioning.

3. **Section anchor links visibility in UI**
   - What we know: SEO-03 says "Section anchor links (#imprenditoria, #informatica, #fitness, #cnv)." Success criteria says "Clicking a section anchor link scrolls smoothly to the correct section with the link visible in the URL bar."
   - What's unclear: Should anchor links be shown as clickable elements in the UI (e.g., hover-to-reveal # links next to headings), or is it sufficient that manually typing/clicking `/#imprenditoria` in the URL works?
   - Recommendation: The section IDs already exist. The success criteria focuses on the scroll behavior and URL update, not on visible navigation. Add `scroll-behavior: smooth` and verify the existing IDs work. Optionally add visible anchor links (hash symbols) on heading hover for discoverability.

## Sources

### Primary (HIGH confidence)
- Astro official docs (Context7 `/withastro/docs`) -- i18n routing configuration, `getAbsoluteLocaleUrl` / `getRelativeLocaleUrl` API signatures
- Astro official docs (Context7 `/websites/astro_build_en`) -- OG meta tags in head, `Astro.url` and `Astro.site` for URL construction
- Astro i18n API reference -- https://docs.astro.build/en/reference/modules/astro-i18n/
- Schema.org Person type -- https://schema.org/Person
- MDN scroll-behavior -- https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior

### Secondary (MEDIUM confidence)
- JSON-LD Person example patterns -- https://jsonld.com/person/ (verified against Schema.org spec)
- Open Graph protocol requirements -- https://ogp.me
- Schema.org Validator tool -- https://validator.schema.org/

### Tertiary (LOW confidence)
- Language switcher UX best practices -- https://www.smashingmagazine.com/2022/05/designing-better-language-selector/ (design opinion, not technical spec)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new dependencies, all Astro built-ins verified via Context7 and official docs
- Architecture: HIGH -- patterns are straightforward HTML meta tags and JSON-LD injection; project structure is simple
- Pitfalls: HIGH -- well-documented SEO pitfalls (hreflang self-reference, absolute URLs) with clear prevention strategies
- og:image design: MEDIUM -- technical implementation is clear but visual design needs user decision

**Research date:** 2026-02-20
**Valid until:** 2026-04-20 (stable domain; Astro 5 i18n API unlikely to change)
