# Feature Research

**Domain:** Enhancement features for personal landing page (dark mode, i18n, structured data, og:image, Lighthouse)
**Researched:** 2026-02-19
**Confidence:** HIGH -- all features are well-documented patterns for static sites; Astro's i18n is the only area with moderate complexity

## Feature Landscape

### Table Stakes (Users Expect These)

For a v2.0 enhancement milestone, "table stakes" means: if the feature is listed in the milestone scope, it must work correctly. A broken dark mode or half-translated page is worse than not having the feature at all.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Dark mode respects system preference | Users with OS dark mode enabled expect every site to respect `prefers-color-scheme`. A toggle that ignores system pref feels broken. | LOW | CSS `@media (prefers-color-scheme: dark)` as baseline. Toggle JS only adds override capability on top. |
| Dark mode has no flash (FOUC) | White flash on page load when dark mode is active is the #1 reported annoyance. Users perceive it as a bug. | MEDIUM | Requires inline `<script>` in `<head>` using Astro's `is:inline` directive. Must run before first paint. localStorage check + system preference fallback. |
| Dark mode toggle persists across reloads | If user picks dark mode, refreshing the page must not reset to light. localStorage is the expected persistence mechanism. | LOW | `localStorage.setItem('theme', 'dark')` on toggle, read on load. Standard pattern. |
| i18n: correct `lang` attribute on `<html>` | Screen readers, search engines, and browser translation all depend on `<html lang="it">` vs `<html lang="en">`. Wrong lang = broken accessibility. | LOW | Astro's i18n routing makes `Astro.currentLocale` available. Set it dynamically in Base.astro. |
| i18n: hreflang link tags | Google uses `<link rel="alternate" hreflang="en">` to connect IT and EN versions. Missing hreflang = Google may index only one language or show wrong version. | LOW | Two `<link>` tags in `<head>`: one for IT, one for EN. Compute URLs with `getRelativeLocaleUrl()`. |
| i18n: content parity between languages | EN page missing a section that IT has = confusing. All 4 sections must exist in both languages. | MEDIUM | Translation effort, not technical. Need complete EN translations for all content. |
| og:image present and correct size | Social sharing without og:image shows blank preview or random page grab. The OG tags already exist but `og:image` is missing. | LOW | Static 1200x630 PNG. Can be hand-crafted or Satori-generated at build time. Must be absolute URL. |
| Schema.org Person JSON-LD is valid | Invalid structured data is worse than none -- Google may penalize or show errors in Search Console. Must validate. | LOW | Use Google Rich Results Test or Schema.org Validator to confirm. Single `<script type="application/ld+json">` block. |
| Section anchor links work with IDs | Sections already have `id` attributes. Anchor links (#imprenditoria) must actually scroll to the section. | LOW | Already works natively with existing `id` props on Section component. Just need visible link/affordance. |
| Lighthouse scores stay high after changes | Adding JS (dark mode toggle), extra pages (i18n), and assets (og:image) must not regress existing near-perfect scores. | MEDIUM | Astro's static output is already optimal. Main risks: unoptimized og:image PNG size, render-blocking inline script, missing accessibility attributes on toggle. |

### Differentiators (Competitive Advantage)

Features that go beyond the basic requirement and make the site stand out among personal landing pages.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Dark mode toggle with smooth transition | Most personal pages either have no dark mode or only CSS-only (no toggle). An accessible toggle with `transition: background-color 0.3s` feels polished. | LOW | CSS transition on `background-color` and `color`. Add `transition` property to `html` or `body`. |
| ProfilePage + Person nested schema | Google recommends ProfilePage as the page type with Person as `mainEntity`. Most personal pages only use Person. Nesting both increases chance of knowledge panel and "About this result" card. | LOW | Wrap Person inside ProfilePage JSON-LD. Single script block, ~30 lines. |
| `sameAs` array with all known URLs | Connecting GitHub, Skillbill, toto-castaldi.com in the `sameAs` array tells Google these are all the same person. Strengthens identity signals across the web. | LOW | Array of URLs in JSON-LD. All URLs already exist in the page content. |
| Language switcher with context preservation | A visible IT/EN toggle that keeps user on the same section (e.g., switching from `/it/#fitness` to `/en/#fitness`) is rare on simple sites. | MEDIUM | LanguagePicker component linking to alternate locale page. Preserve hash fragment in URL. |
| Smooth scroll with `scroll-behavior: smooth` | Native CSS smooth scrolling when clicking anchor links. 95.5% browser support. No JS needed. Respects `prefers-reduced-motion`. | LOW | One line CSS: `html { scroll-behavior: smooth; }`. Add `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` for accessibility. |
| Build-time og:image with Satori | Instead of a hand-crafted static PNG, generate og:image at build time from a template. Automatically includes the name and description. Future-proof if content changes. | MEDIUM | Satori + sharp. Create `pages/og.png.ts` endpoint. Outputs 1200x630 PNG. Astro pre-renders at build time. |
| Lighthouse 100/100 across all four categories | Astro static sites can realistically hit 95-100. With explicit attention to accessibility (aria labels, contrast ratios, focus styles) and best practices (meta tags, HTTPS, CSP), a perfect score is achievable. | MEDIUM | Requires testing after each feature addition. Main areas: Performance (no large assets), Accessibility (toggle button ARIA), Best Practices (meta tags), SEO (hreflang, structured data). |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| CSS-only dark mode (no toggle, only `prefers-color-scheme`) | Simpler, zero JS | PROJECT.md explicitly requires a toggle. CSS-only means users with light OS preference can never see dark mode. | JS toggle that defaults to system preference but allows override. |
| Runtime i18n library (i18next, Paraglide) | Familiar patterns from app development | i18next is incompatible with Astro 5 per community reports. Paraglide adds a runtime dependency. For 4 sections of static text, a simple JSON dictionary is sufficient. | Manual translation dictionary in `src/i18n/ui.ts` using Astro's recipe pattern. Zero dependencies. |
| Cookie-based theme persistence | Alternative to localStorage | Cookies require server reading or document.cookie parsing. localStorage is simpler, has no size concerns for a single key, and works perfectly for static sites. | localStorage only. |
| Client-side language detection + redirect | Auto-redirect based on `Accept-Language` header | Static site has no server to read headers. Client-side redirect causes flash. Users who share a link get redirected away from the shared language. Annoying and confusing. | Default to IT (existing audience). EN available via language switcher. No auto-redirect. |
| Multiple og:image sizes for different platforms | Twitter wants 1200x600, Facebook 1200x630, LinkedIn 1200x627 | Marginal visual difference. 1200x630 works well everywhere. Extra images = extra build complexity + asset weight. | Single 1200x630 PNG. All platforms handle it. |
| Dark mode with per-section color themes | Each section gets its own dark palette | Massively increases CSS complexity. 4 sections x 2 modes = 8 color contexts. The page is simple text -- uniform dark palette is appropriate. | Single dark mode palette for the whole page. |
| i18n with more than 2 languages | "Why not add Spanish, French..." | Content is personal. Author speaks Italian and English. Adding languages the author cannot verify = quality risk. Each language doubles content maintenance. | IT + EN only. Add languages only if author can verify. |
| Animated theme transition (complex) | Fancy circle-wipe or slide transitions | Requires significant JS, potentially `View Transitions API` (experimental). Adds complexity for a cosmetic effect on a minimal page. | Simple CSS `transition` on color properties. Smooth, tasteful, zero-complexity. |
| SEO-focused JSON-LD bloat (Organization, WebSite, BreadcrumbList) | "Add all the structured data" | This is a personal page, not an organization. BreadcrumbList is meaningless for a single page. WebSite schema adds nothing Google cannot infer. Over-markup can trigger spam signals. | Person inside ProfilePage only. Clean, accurate, minimal. |

## Feature Dependencies

```
[Dark mode CSS custom properties]
    +--requires--> [Refactor global.css to use CSS variables for ALL colors]
    |                  (currently hardcoded: #ffffff, #1a1a1a, #555555, #0056b3, #003d80, #e0e0e0)
    +--requires--> [Dark palette definition in :root or [data-theme="dark"]]
    +--requires--> [Inline script in <head> for FOUC prevention]
    +--requires--> [Toggle button component with aria-label]

[i18n routing]
    +--requires--> [Astro i18n config in astro.config.mjs]
    +--requires--> [Translation dictionary (src/i18n/ui.ts)]
    +--requires--> [EN content translations for all 4 sections + footer]
    +--requires--> [Dynamic lang attribute on <html>]
    +--requires--> [hreflang <link> tags in <head>]
    +--enables---> [Language switcher component]

[og:image]
    +--requires--> [Image asset (static PNG or Satori-generated)]
    +--requires--> [og:image meta tag in Base.astro <head>]
    +--requires--> [twitter:image meta tag (same image)]
    +--enhances--> [Existing og:title and og:description tags]

[Schema.org Person JSON-LD]
    +--enhances--> [Existing <title> and meta description]
    +--uses------> [sameAs URLs already present as <a> hrefs in content]

[Section anchor links]
    +--requires--> [Existing id attributes on sections] (ALREADY DONE)
    +--enhances--> [scroll-behavior: smooth on html]
    +--enhances--> [Visual anchor link affordance (hover icon or permalink)]

[Lighthouse optimization]
    +--depends-on-> [All other features being implemented correctly]
    +--requires---> [Accessibility audit of toggle button]
    +--requires---> [og:image file size optimization (<200KB)]
    +--requires---> [Correct meta tags (description, viewport, charset)]
```

### Dependency Notes

- **Dark mode requires CSS variable refactor FIRST:** The current `global.css` uses hardcoded hex colors (`#ffffff`, `#1a1a1a`, etc.). These must become CSS custom properties consumed via `var()` before dark mode can swap them. This is a prerequisite, not an optional step.
- **i18n requires config + content before UI:** The language switcher component is useless without translation content and Astro's i18n routing configured. Content translation is the bottleneck -- it requires human review.
- **og:image blocks on asset creation:** Whether static PNG or Satori-generated, the image must exist before the meta tag can reference it. For Satori, this means installing `satori` + `sharp` dependencies.
- **Lighthouse is a validation step, not a buildable feature:** It depends on all other features being implemented. It should be the last thing addressed in the milestone.
- **Section anchor links are nearly free:** The `id` attributes already exist. Only the visual affordance (click target) and smooth scroll CSS are needed.

## MVP Definition

### Must Have (Core Milestone Delivery)

These features define the v2.0 milestone. Missing any one means the milestone is incomplete.

- [ ] Dark mode toggle -- system preference respected, localStorage persistence, no FOUC, accessible button with aria-label
- [ ] i18n IT/EN -- separate `/en/` pages, correct lang attribute, hreflang tags, language switcher visible on page
- [ ] Schema.org Person JSON-LD -- valid markup, passes Google Rich Results Test
- [ ] og:image -- 1200x630 PNG, referenced in og:image and twitter:image meta tags, absolute URL
- [ ] Section anchor links -- visible affordance, smooth scroll behavior
- [ ] Lighthouse 90+ in all four categories -- Performance, Accessibility, Best Practices, SEO

### Should Have (Polish)

Features that improve quality but are not blocking for milestone completion.

- [ ] ProfilePage wrapping Person in JSON-LD -- stronger structured data signal
- [ ] `sameAs` array with GitHub, Skillbill, toto-castaldi.com URLs
- [ ] `prefers-reduced-motion` media query disabling smooth scroll
- [ ] Dark mode CSS transition for smooth color change
- [ ] Satori-generated og:image instead of static PNG -- future-proof, automated

### Defer (Beyond v2.0)

- [ ] Print stylesheet -- low priority, does not contribute to milestone goals
- [ ] Additional languages beyond IT/EN -- no current need
- [ ] Dark mode per-page color schemes -- unnecessary for a single landing page

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Depends On |
|---------|------------|---------------------|----------|------------|
| CSS variable refactor for colors | LOW (invisible to user) | LOW | P0 (prerequisite) | Nothing |
| Dark mode system preference | HIGH | LOW | P1 | CSS variables |
| Dark mode toggle with persistence | HIGH | MEDIUM | P1 | CSS variables + inline script |
| FOUC prevention | HIGH | LOW | P1 | Inline script pattern |
| Astro i18n config | LOW (invisible) | LOW | P0 (prerequisite) | Nothing |
| EN content translations | HIGH | MEDIUM | P1 | Human translation effort |
| hreflang link tags | MEDIUM | LOW | P1 | i18n config |
| Language switcher component | HIGH | LOW | P1 | i18n config + content |
| og:image asset (static PNG) | MEDIUM | LOW | P1 | Design decision |
| og:image meta tags | MEDIUM | LOW | P1 | og:image asset |
| Schema.org Person JSON-LD | MEDIUM | LOW | P1 | Content knowledge |
| Section anchor visible affordance | LOW | LOW | P1 | Existing section IDs |
| Smooth scroll CSS | LOW | LOW | P1 | Nothing |
| Lighthouse audit + fixes | HIGH | MEDIUM | P2 | All other features |
| ProfilePage wrapper | LOW | LOW | P2 | Person JSON-LD |
| Satori og:image generation | LOW | MEDIUM | P3 | satori + sharp deps |

**Priority key:**
- P0: Prerequisite -- must be done before dependent features
- P1: Core milestone delivery
- P2: Polish -- do if time allows
- P3: Future enhancement

## Implementation Patterns

### Dark Mode Toggle

**Expected behavior:**
1. Page loads: check localStorage for `theme` key
2. If `theme` found: apply it (dark or light)
3. If no `theme`: check `window.matchMedia('(prefers-color-scheme: dark)')` -- apply system preference
4. User clicks toggle: flip theme, save to localStorage, update `data-theme` attribute on `<html>`
5. Page reloads: step 1 picks up saved preference -- no flash

**CSS pattern:**
```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  /* ... all colors as variables ... */
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #e8e8e8;
  /* ... dark overrides ... */
}
```

**FOUC prevention (inline in `<head>`):**
```html
<script is:inline>
  const theme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
</script>
```

### i18n Structure

**Astro config:**
```js
i18n: {
  defaultLocale: 'it',
  locales: ['it', 'en'],
  routing: { prefixDefaultLocale: false }
}
```

**File structure:**
```
src/pages/
  index.astro        (IT - serves at /)
  en/
    index.astro      (EN - serves at /en/)
src/i18n/
  ui.ts              (translation dictionary)
  utils.ts           (getLangFromUrl, useTranslations helpers)
```

**Routing result:** IT at `/`, EN at `/en/`. No prefix for default locale.

### Schema.org Person + ProfilePage

**Expected JSON-LD structure:**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Antonio Castaldi",
    "alternateName": "Toto",
    "url": "https://toto-castaldi.github.io",
    "jobTitle": ["Imprenditore", "Personal Trainer", "Istruttore Pilates"],
    "worksFor": {
      "@type": "Organization",
      "name": "Skillbill srl",
      "url": "https://www.skillbill.it/"
    },
    "sameAs": [
      "https://github.com/toto-castaldi",
      "https://toto-castaldi.com",
      "https://www.skillbill.it/"
    ],
    "email": "toto.castaldi@gmail.com",
    "knowsAbout": ["Informatica", "Fitness", "Comunicazione Non Violenta"]
  }
}
```

### og:image

**Two viable approaches:**

1. **Static PNG (simplest):** Design a 1200x630 image with name + description. Place in `public/og.png`. Reference as `https://toto-castaldi.github.io/og.png`.

2. **Satori build-time generation (recommended for future-proofing):** Create `src/pages/og.png.ts` endpoint. Uses `satori` to render HTML template to SVG, then `sharp` to convert SVG to PNG. Output is static at build time.

For v2.0, a static PNG is sufficient. Satori is a P3 enhancement.

## Competitor Feature Analysis

| Feature | Typical developer personal page | Polished personal page (e.g. cassidoo.co, joshwcomeau.com) | Our approach (v2.0) |
|---------|-------------------------------|---------------------------------------------|---------------------|
| Dark mode | Rare or CSS-only | Toggle with smooth transition, system pref respected | Toggle + system pref + localStorage |
| i18n | Almost never | Rarely (content is usually English-only) | IT default + EN, exceeds most personal pages |
| Structured data | Rare | Sometimes Person schema | ProfilePage + Person, above average |
| og:image | Often missing | Dynamic Satori-generated | Static PNG (upgrade to Satori later) |
| Anchor links | Sometimes (blogs) | Yes, with smooth scroll | Yes, with smooth scroll + reduced motion |
| Lighthouse | Varies (70-95) | Usually 90+ | Target 95-100 |

## Sources

- [Astro i18n routing guide](https://docs.astro.build/en/guides/internationalization/) -- HIGH confidence (official docs)
- [Astro i18n recipe](https://docs.astro.build/en/recipes/i18n/) -- HIGH confidence (official docs)
- [Astro dark mode tutorial](https://docs.astro.build/en/tutorial/6-islands/2/) -- HIGH confidence (official docs)
- [Schema.org Person type](https://schema.org/Person) -- HIGH confidence (official spec)
- [JSON-LD Person example](https://jsonld.com/person/) -- MEDIUM confidence (community reference)
- [Google ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page) -- HIGH confidence (official Google docs)
- [Complete dark mode toggle guide](https://ryanfeigenbaum.com/dark-mode/) -- MEDIUM confidence (detailed tutorial, verified patterns)
- [Smashing Magazine: color scheme persistence](https://www.smashingmagazine.com/2024/03/setting-persisting-color-scheme-preferences-css-javascript/) -- MEDIUM confidence
- [Dark mode FOUC in Astro](https://www.simonporter.co.uk/posts/what-the-fouc-astro-transitions-and-tailwind/) -- MEDIUM confidence (community)
- [Satori og:image in Astro](https://arne.me/blog/static-og-images-in-astro/) -- MEDIUM confidence (community)
- [Dynamic og:image with Satori](https://knaap.dev/posts/dynamic-og-images-with-any-static-site-generator/) -- MEDIUM confidence (community)
- [Open Graph protocol spec](https://ogp.me/) -- HIGH confidence (official spec)
- [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme) -- HIGH confidence (MDN)
- [Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) -- HIGH confidence (official Google)
- [CSS-Tricks dark mode guide](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/) -- MEDIUM confidence
- [web.dev prefers-color-scheme](https://web.dev/articles/prefers-color-scheme) -- HIGH confidence (Google)

---
*Feature research for: v2.0 Enhancement & i18n milestone (dark mode, i18n, Schema.org, og:image, Lighthouse)*
*Researched: 2026-02-19*
