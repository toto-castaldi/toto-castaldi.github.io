# Domain Pitfalls: v2.0 Enhancement & i18n

**Domain:** Adding dark mode, i18n (IT/EN), Schema.org, og:image, Lighthouse optimization to existing Astro 5 static site on GitHub Pages
**Researched:** 2026-02-19
**Confidence:** HIGH (verified against official Astro docs, web.dev, Schema.org specification, and multiple community sources)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken deploys, or fundamentally wrong behavior.

### Pitfall 1: Dark Mode FOUC (Flash of Unstyled Content)

**What goes wrong:**
The page loads with the light theme (white background, dark text) for 50-200ms, then abruptly switches to dark mode. Users see a blinding white flash every page load. This happens because Astro processes `<script>` tags by default -- bundling them into external files that load asynchronously after the HTML renders. The dark mode preference stored in localStorage is read too late.

**Why it happens:**
Astro strips script tags from components during build and bundles them into external JS files loaded with `type="module"` (which is deferred by default). By the time the script runs to check localStorage and apply the dark theme, the browser has already painted the page with the CSS defaults (light mode). The user sees the flash.

**Consequences:**
- Unusable dark mode -- every navigation and page load produces a white flash
- Users with light sensitivity or who prefer dark mode will find the experience worse than no dark mode at all
- Lighthouse Accessibility and CLS scores impacted by layout shift from theme switch

**Prevention:**
Use `is:inline` on a blocking script in the `<head>`, before any stylesheet or body content. This tells Astro to leave the script as a raw inline `<script>` tag (not bundled/deferred). The script must:
1. Read localStorage for saved preference
2. Fall back to `matchMedia('(prefers-color-scheme: dark)')` for system preference
3. Set `data-theme` attribute on `<html>` before the browser paints

```html
<!-- In Base.astro <head>, BEFORE <style> -->
<script is:inline>
(function() {
  const saved = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = saved || system;
})();
</script>
```

The `is:inline` directive is the key. Without it, Astro optimizes the script into an external module and FOUC is guaranteed.

**Detection:**
- White flash visible on page load when browser is set to dark mode
- In DevTools, the `data-theme` attribute appears on `<html>` only after a delay
- Script tag in built HTML is `<script type="module" src="...">` instead of inline `<script>`

**Phase to address:** Dark mode implementation phase. This must be the very first thing built -- the inline script goes into the layout before any dark mode CSS is written.

**Confidence:** HIGH -- verified pattern across multiple Astro dark mode tutorials, official Astro docs on `is:inline`, and community issue reports.

---

### Pitfall 2: Hardcoded Colors Surviving Dark Mode Migration

**What goes wrong:**
After implementing dark mode CSS custom properties, some elements remain light-themed in dark mode because their colors are hardcoded hex values instead of CSS variables. The site looks broken -- dark background with invisible or low-contrast elements.

**Why it happens:**
The current `global.css` has a hardcoded `border-top: 1px solid #e0e0e0` on `<hr>` elements. When dark mode sets `--color-bg` to a dark color, the `#e0e0e0` border becomes nearly invisible against a dark background. This pattern is easy to miss because developers audit `color` and `background-color` but forget borders, box-shadows, outlines, SVG fills, and pseudo-element colors.

**Consequences:**
- `<hr>` dividers invisible in dark mode (light gray on dark background)
- Any future inline SVGs with hardcoded `fill` or `stroke` colors break
- Partial dark mode looks worse than no dark mode -- signals carelessness

**Prevention:**
Before writing any dark mode CSS, audit every color value in `global.css` and scoped component styles. Replace ALL hardcoded colors with CSS custom properties:

Current (broken in dark mode):
```css
hr { border-top: 1px solid #e0e0e0; }
```

Fixed:
```css
:root {
  --color-border: #e0e0e0;
}
:root[data-theme="dark"] {
  --color-border: #3a3a3a;
}
hr { border-top: 1px solid var(--color-border); }
```

Audit checklist for this project:
- [x] `--color-bg: #ffffff` -- already a variable
- [x] `--color-text: #1a1a1a` -- already a variable
- [x] `--color-link: #0056b3` -- already a variable
- [x] `--color-link-hover: #003d80` -- already a variable
- [ ] `hr { border-top: 1px solid #e0e0e0 }` -- HARDCODED, must convert
- [ ] Any future SVG favicon fill colors

**Detection:**
- Visual scan of site in dark mode -- look for elements that "disappear" or have wrong contrast
- Search codebase for `#` followed by hex digits outside of `:root` variable definitions

**Phase to address:** Dark mode CSS phase, before the toggle is wired up. Convert all hardcoded colors to variables first.

**Confidence:** HIGH -- directly verified by reading the current `src/styles/global.css` line 87.

---

### Pitfall 3: i18n Routing Breaks Existing Italian URLs

**What goes wrong:**
After enabling Astro's i18n config, the existing `https://toto-castaldi.github.io/` URL stops serving the Italian page directly. Instead it either 404s, redirects to `/it/`, or serves a meta-refresh redirect page. All existing backlinks, bookmarks, and search engine indexed URLs break.

**Why it happens:**
If `prefixDefaultLocale` is set to `true`, Astro generates all default-locale pages under `/it/` and places a redirect page at `/`. The root `index.html` becomes a `<meta http-equiv="refresh">` tag pointing to `/it/`. This is documented in Astro issue #9300.

Even with `prefixDefaultLocale: false` (the correct setting for this project), careless file reorganization can break things. Moving `src/pages/index.astro` into `src/pages/it/index.astro` without understanding that `prefixDefaultLocale: false` means the default locale stays at root will produce a 404 at `/`.

**Consequences:**
- Google-indexed `https://toto-castaldi.github.io/` returns 404 or redirect loop
- SEO damage: search rankings drop for the primary URL
- All existing backlinks broken
- GitHub Pages does not support server-side redirects -- meta-refresh is the only option, adding latency

**Prevention:**
Configure i18n with Italian as the unprefixed default:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,  // Italian stays at /
    },
  },
});
```

File structure must be:
```
src/pages/
  index.astro          # Italian (default, serves at /)
  en/
    index.astro        # English (serves at /en/)
```

Do NOT move existing Italian pages into a `/it/` subdirectory. The Italian content stays exactly where it is. Only English content goes into `/en/`.

**Detection:**
- After build, check `dist/index.html` -- it should contain the Italian page content, NOT a meta-refresh redirect
- `dist/en/index.html` should exist with English content
- No `dist/it/` directory should exist

**Phase to address:** i18n routing configuration phase. Must be the first i18n step before creating any `/en/` pages.

**Confidence:** HIGH -- verified against Astro i18n docs and GitHub issue #9300, #12897.

---

### Pitfall 4: Missing or Incorrect hreflang Tags

**What goes wrong:**
Search engines cannot determine the relationship between the Italian and English pages. Google may treat `/en/` as duplicate content of `/` and suppress one version. Or Google shows the Italian page to English-speaking users and vice versa.

**Why it happens:**
Astro's i18n routing handles URL generation but does NOT automatically inject hreflang `<link>` tags into the `<head>`. Developers assume enabling i18n config is sufficient for SEO. Three specific mistakes are common:

1. **Missing hreflang entirely** -- no `<link rel="alternate" hreflang="...">` tags in the HTML
2. **Missing self-referencing hreflang** -- the Italian page links to the English version but not to itself. Research shows 96% of hreflang problems correlate with missing self-references
3. **hreflang URL mismatch with canonical** -- the hreflang href uses a different URL format than the canonical tag (e.g., trailing slash mismatch)

**Consequences:**
- Search engines ignore hreflang annotations entirely when self-reference is missing
- Wrong language version shown in search results for different regions
- Duplicate content penalties between `/` and `/en/`

**Prevention:**
Add both self-referencing and alternate hreflang links on every page:

```html
<!-- On Italian page (/) -->
<link rel="alternate" hreflang="it" href="https://toto-castaldi.github.io/" />
<link rel="alternate" hreflang="en" href="https://toto-castaldi.github.io/en/" />
<link rel="alternate" hreflang="x-default" href="https://toto-castaldi.github.io/" />

<!-- On English page (/en/) -->
<link rel="alternate" hreflang="it" href="https://toto-castaldi.github.io/" />
<link rel="alternate" hreflang="en" href="https://toto-castaldi.github.io/en/" />
<link rel="alternate" hreflang="x-default" href="https://toto-castaldi.github.io/" />
```

Rules:
- Every page must include hreflang for ALL language versions including itself
- `x-default` points to the fallback page (Italian, the default locale)
- URLs must be absolute and match the canonical URL format exactly (including trailing slash)
- Both Italian and English pages must have the SAME set of hreflang tags

**Detection:**
- View page source: search for `hreflang` -- must find self-reference on every page
- Google Search Console > International Targeting > hreflang tags section shows errors
- `hreflang` URLs must match `canonical` URLs exactly

**Phase to address:** i18n implementation phase, in the layout template. Build hreflang into the Base.astro layout so it is automatic for every page.

**Confidence:** HIGH -- hreflang self-referencing requirement is well-documented by Google, Semrush, and Screaming Frog.

---

### Pitfall 5: og:image with Relative URL

**What goes wrong:**
Social media platforms (Facebook, Twitter/X, LinkedIn) show no image preview when the page is shared. The link preview displays only text, or a generic placeholder. The og:image tag exists in the HTML but is ignored by crawlers.

**Why it happens:**
The Open Graph protocol requires og:image to be an absolute URL with `https://` protocol. If the `content` attribute uses a relative path like `/og-image.png` or `./og-image.png`, social media crawlers cannot resolve it and silently drop the image. The current Base.astro already has og:title, og:description, og:type, and og:url -- but no og:image. When adding it, developers commonly use `href` or relative paths out of habit.

**Consequences:**
- Zero visual impact when links are shared on social media
- Reduced click-through rates from social shares
- Looks unprofessional -- suggests the site is not properly configured

**Prevention:**
Use `Astro.site` to construct the absolute URL:

```astro
---
const ogImageURL = new URL('/og-image.png', Astro.site);
---
<meta property="og:image" content={ogImageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
```

Additional requirements:
- Image must be exactly 1200x630px (1.91:1 aspect ratio) for best cross-platform display
- File format: PNG or JPEG (NOT WebP -- some platforms still reject it)
- File size: under 5MB (ideally under 300KB)
- Image file goes in `public/` (not `src/`) since it should be served as-is without Astro processing
- Filename must NOT contain spaces, accented characters, or special characters

**Detection:**
- Facebook Sharing Debugger: `https://developers.facebook.com/tools/debug/`
- Twitter Card Validator: share on X and check preview
- View source: og:image content must start with `https://`

**Phase to address:** og:image / metadata phase. Must be implemented after `site` is confirmed correct in astro.config.mjs.

**Confidence:** HIGH -- the Open Graph protocol specification at ogp.me explicitly requires absolute URLs.

---

## Moderate Pitfalls

### Pitfall 6: Missing `color-scheme` CSS Property

**What goes wrong:**
Dark mode custom properties change background and text colors, but browser-native UI elements remain light-themed: scrollbars stay white, form controls (if any are added later) remain light, CSS system colors like `Canvas` and `CanvasText` stay in light mode. The site has a jarring "partially dark" appearance.

**Why it happens:**
The `color-scheme` CSS property tells the browser which color schemes the page supports, allowing the UA to adapt native UI elements. Without it, the browser has no signal that dark mode is active, even though custom properties have changed the visible colors.

**Prevention:**
Add `color-scheme` to both the CSS and a `<meta>` tag:

```css
:root {
  color-scheme: light;
}
:root[data-theme="dark"] {
  color-scheme: dark;
}
```

```html
<!-- In <head>, updated by the inline theme script -->
<meta name="color-scheme" content="light dark" />
```

The meta tag tells the browser early (before CSS loads) that both schemes are supported, preventing a flash of wrong-colored native elements.

**Detection:**
- Scrollbars remain white in dark mode on Windows/Linux
- `<select>`, `<input>`, or `<button>` elements appear light-themed in dark mode
- CSS system colors (like `Canvas`) return light values in computed styles

**Phase to address:** Dark mode CSS phase, alongside the custom properties definition.

**Confidence:** HIGH -- verified against web.dev color-scheme documentation and MDN reference.

---

### Pitfall 7: Schema.org Person Not Eligible for Google Rich Results

**What goes wrong:**
Developer implements Person JSON-LD structured data, validates it with Google's Rich Results Test, and sees "No items detected" or "Not eligible for rich results." They assume the implementation is broken and waste time debugging valid markup.

**Why it happens:**
Google's Rich Results Test only validates Schema.org types that are eligible for rich results features (FAQ, Recipe, Product, etc.). The **Person type is NOT eligible for Google rich results**. This does not mean the markup is wrong -- it means Google does not display enhanced search features for Person entities. The markup is still valuable for:
- Knowledge Graph entity association
- Google's understanding of the page's subject
- Other search engines (Bing, DuckDuckGo)
- AI and LLM crawlers parsing structured data

**Prevention:**
- Validate with Schema.org Validator (`https://validator.schema.org/`), NOT Google Rich Results Test
- Set correct expectations: Person JSON-LD improves machine readability and knowledge graph associations, but will NOT produce visual rich results in Google Search
- Keep the JSON-LD simple and accurate -- do not over-stuff properties hoping for rich results

Minimal correct implementation:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Antonio Castaldi",
  "alternateName": "Toto",
  "url": "https://toto-castaldi.github.io",
  "email": "toto.castaldi@gmail.com",
  "jobTitle": ["Imprenditore", "Personal Trainer"],
  "sameAs": [
    "https://github.com/toto-castaldi",
    "https://www.skillbill.it/"
  ]
}
```

**Detection:**
- Google Rich Results Test says "Not eligible" -- this is EXPECTED, not an error
- Schema.org Validator confirms markup is syntactically valid

**Phase to address:** Schema.org implementation phase. Set expectations before implementation to avoid wasted debugging time.

**Confidence:** HIGH -- Google explicitly documents which types produce rich results; Person is not among them.

---

### Pitfall 8: i18n Content Drift Between Languages

**What goes wrong:**
Over time, the Italian and English pages diverge in structure, sections, or information. One language gets updated but the other does not. The English page becomes stale while the Italian page is current (or vice versa). Users switching languages find different content, eroding trust.

**Why it happens:**
With Astro's file-based i18n (separate `index.astro` and `en/index.astro` files), there is no mechanism to enforce content parity. Each file is fully independent. For a single landing page with ~180 LOC this is manageable today, but becomes a maintenance burden as content changes accumulate.

**Prevention:**
Structure content so both pages share the same layout and component structure, differing only in text strings:

Option A (recommended for this project): Create a translation dictionary object and a shared page template that reads from it. Both `/index.astro` and `/en/index.astro` import the same component but pass different locale strings.

Option B: Keep separate pages but establish a "translation checklist" -- any change to one page must be mirrored in the other. Add a comment at the top of each page:
```astro
---
// TRANSLATION SYNC: When editing this file, update /en/index.astro (or /index.astro) too.
// Last synced: 2026-02-19
---
```

**Detection:**
- Diff the two page files periodically -- structural divergence is the warning sign
- "Last synced" comment date is weeks/months old

**Phase to address:** i18n content creation phase. Choose the translation pattern before writing the English page.

**Confidence:** MEDIUM -- this is a project management issue, not a technical bug. Severity depends on how often content changes.

---

### Pitfall 9: Dark Mode Toggle Breaks Lighthouse Accessibility Score

**What goes wrong:**
The dark mode toggle button fails Lighthouse accessibility audits: missing accessible name, insufficient contrast ratio for the toggle icon, or toggle state not communicated to screen readers. Lighthouse Accessibility score drops from 100 to 80-90.

**Why it happens:**
Developers focus on the visual toggle (sun/moon icon, switch UI) and forget the accessibility requirements:
- Icon-only buttons need `aria-label` describing the action
- Toggle state needs `aria-pressed` or equivalent
- Contrast ratios must meet WCAG 4.5:1 for the toggle itself (in BOTH themes)
- Keyboard operability: the toggle must be focusable and activatable with Enter/Space

**Prevention:**
```html
<button
  id="theme-toggle"
  type="button"
  aria-label="Switch to dark mode"
  aria-pressed="false"
>
  <!-- icon here -->
</button>
```

The `aria-label` must update when toggled ("Switch to light mode" / "Switch to dark mode"). The `aria-pressed` must reflect current state. The button must have visible focus indicators in both light and dark themes.

**Detection:**
- Lighthouse Accessibility audit flags "Buttons do not have an accessible name"
- Screen reader test: navigate to toggle, verify it announces purpose and state
- Check contrast of toggle icon against background in both themes

**Phase to address:** Dark mode toggle implementation phase. Build accessibility into the toggle from the start, not as a Lighthouse fix later.

**Confidence:** HIGH -- Lighthouse accessibility audits for buttons are well-documented and deterministic.

---

### Pitfall 10: Inline Theme Script Impacts Lighthouse Performance

**What goes wrong:**
The `is:inline` theme detection script is render-blocking by design (this is intentional to prevent FOUC). However, if the script grows beyond the minimal theme detection (e.g., adds analytics, feature detection, or other initialization logic), it delays First Contentful Paint and Lighthouse flags "Eliminate render-blocking resources."

**Why it happens:**
Developers start with a minimal 3-line inline script, then gradually add more logic to it because "it's already inline and runs early." The script balloons from 200 bytes to 2KB+, adding measurable render delay.

**Prevention:**
The inline script must do EXACTLY three things and nothing more:
1. Read localStorage for saved theme
2. Check `matchMedia('(prefers-color-scheme: dark)')` for system preference
3. Set `document.documentElement.dataset.theme`

All other dark mode logic (toggle handler, event listeners, system preference change monitoring) goes in a normal Astro `<script>` tag (which gets bundled and deferred). Keep the inline script under 200 bytes.

**Detection:**
- The inline `<script>` in built HTML is longer than 5 lines
- Lighthouse Performance flags render-blocking script
- Compare FCP with and without the inline script -- delta should be <10ms

**Phase to address:** Dark mode implementation phase. Write the inline script first, then the deferred script separately.

**Confidence:** HIGH -- the tradeoff between FOUC prevention and render blocking is well-understood.

---

### Pitfall 11: og:image Caching on Social Platforms

**What goes wrong:**
After deploying the site with og:image, you update the image (new design, different text). When sharing the URL on Facebook or LinkedIn, the OLD image still appears. Clearing browser cache does not help. The stale image persists for days or weeks.

**Why it happens:**
Facebook, LinkedIn, and Twitter/X aggressively cache og:image after the first scrape. Once cached, they do not re-fetch the image on subsequent shares. The cache duration varies:
- Facebook: cached until manually purged via Sharing Debugger
- Twitter/X: cached for ~7 days
- LinkedIn: cached indefinitely in some cases

**Prevention:**
- Get the og:image right before the first public share
- If the image must change, use a different filename (cache-busting): `og-image-v2.png` instead of `og-image.png`
- After updating, purge Facebook cache: `https://developers.facebook.com/tools/debug/`
- For LinkedIn, use the Post Inspector: `https://www.linkedin.com/post-inspector/`

**Detection:**
- Share URL in a private message to yourself on each platform -- check the preview
- Use platform-specific debug tools to verify the current cached version

**Phase to address:** og:image implementation phase. Test with debug tools BEFORE publicly sharing the URL for the first time.

**Confidence:** HIGH -- well-documented behavior across all major social platforms.

---

## Minor Pitfalls

### Pitfall 12: JSON-LD Syntax Errors Break Structured Data Silently

**What goes wrong:**
The Schema.org JSON-LD block has a trailing comma, unescaped quote, or mismatched bracket. Search engines silently ignore the entire block. There is no visible error on the page.

**Prevention:**
- Use a Zod/TypeScript schema or JSON template literal to generate the JSON-LD -- never hand-write JSON strings
- Validate with `https://validator.schema.org/` after every change
- In Astro, use `JSON.stringify()` on an object rather than writing JSON manually:

```astro
<script type="application/ld+json" set:html={JSON.stringify(personSchema)} />
```

**Phase to address:** Schema.org implementation phase.

**Confidence:** HIGH.

---

### Pitfall 13: English Page Missing Translated Meta Description and OG Tags

**What goes wrong:**
The English page at `/en/` inherits the Italian meta description and OG tags from the shared layout because the layout defaults are in Italian. Social sharing and search results for the English page show Italian text.

**Prevention:**
Make the Base.astro layout accept language-specific metadata as props:

```astro
---
const { title, description, lang = 'it' } = Astro.props;
---
<html lang={lang}>
```

Each page must pass its own translated `description`. Do not rely on layout defaults for the English page.

**Detection:**
- View source of `/en/index.html` -- check that `<meta name="description">`, `og:description`, and `<html lang>` are in English
- `<html lang="it">` on the English page is a clear bug

**Phase to address:** i18n page creation phase. Verify every meta tag is translated, not just the visible content.

**Confidence:** HIGH -- directly follows from examining the current Base.astro default props.

---

### Pitfall 14: Section Anchor Links Break with i18n

**What goes wrong:**
The Italian page has anchors like `#imprenditoria`, `#informatica`, `#fitness`, `#cnv`. The English page reuses the same section IDs but the English section titles differ. Shared anchor links (e.g., someone bookmarks `#imprenditoria` on the English page) work but are semantically confusing, or worse, the IDs are translated to English equivalents breaking any cross-language links.

**Prevention:**
Keep section `id` attributes language-neutral or consistent across both languages. The anchor `#imprenditoria` can stay the same on both pages (it is a URL fragment, not displayed content). Or use semantic English IDs (`#entrepreneurship`) on both pages for URL cleanliness. The key rule: pick one set of IDs and use them on ALL language versions.

**Detection:**
- Click anchor links on both language versions -- they should scroll to the correct section
- External links pointing to anchors should work on both language pages

**Phase to address:** i18n content creation phase. Decide on anchor ID convention before creating the English page.

**Confidence:** MEDIUM -- impact is low for a single-page site but becomes important if content grows.

---

### Pitfall 15: Lighthouse Best Practices Score Drops from Missing og:image Dimensions

**What goes wrong:**
Lighthouse "Best Practices" audit flags that og:image meta tag lacks `og:image:width` and `og:image:height` properties. Score drops by 5-10 points.

**Prevention:**
Always include width and height alongside og:image:
```html
<meta property="og:image" content="https://toto-castaldi.github.io/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
```

**Phase to address:** og:image implementation phase.

**Confidence:** MEDIUM -- Lighthouse scoring weights change between versions, but this is a common flag.

---

## Integration Pitfalls

Mistakes that arise from combining multiple v2.0 features together.

### Integration 1: Dark Mode + og:image Mismatch

**What goes wrong:**
The og:image is designed for light mode (white background, dark text). When the site is in dark mode, the og:image still shows a light-themed preview. This is not a bug per se, but a missed opportunity -- and looks inconsistent if the user sharing the link sees dark mode on the site but light mode in the preview.

**Prevention:**
Design the og:image with a neutral or brand-specific color scheme that looks good regardless of site theme. Do NOT try to serve different og:images based on user theme (social crawlers do not execute JavaScript and will always see the static HTML).

**Phase to address:** og:image design phase.

---

### Integration 2: i18n + Schema.org Language Mismatch

**What goes wrong:**
The Person JSON-LD includes Italian job titles (`"Imprenditore"`, `"Personal Trainer"`) but the `@language` or `inLanguage` is not specified. On the English page, the same Italian JSON-LD is served because it is hardcoded in the shared layout.

**Prevention:**
Either serve language-appropriate JSON-LD per page (with `"inLanguage": "it"` or `"en"`) or use a language-neutral version with both translations. For a personal landing page, the simplest approach: keep JSON-LD language-neutral (name, email, sameAs links are the same in both languages) and use the page's `<html lang>` to signal context.

**Phase to address:** Schema.org implementation phase, coordinated with i18n layout.

---

### Integration 3: Dark Mode + Lighthouse Score Interaction

**What goes wrong:**
Adding dark mode introduces client-side JavaScript to a previously zero-JS site. Lighthouse Performance score may drop slightly due to:
- Inline blocking script (intentional, for FOUC prevention)
- Toggle button event listener JS
- Potential CLS if theme application causes layout reflow

**Prevention:**
- Keep inline script minimal (<200 bytes)
- Defer toggle JS to a normal `<script>` tag (Astro bundles and defers automatically)
- Avoid layout changes between themes -- only change colors, never sizes/spacing
- Test Lighthouse in both light and dark mode (some contrast issues only appear in one theme)

**Phase to address:** Dark mode implementation phase, with Lighthouse verification at the end.

---

### Integration 4: i18n + Canonical URL Confusion

**What goes wrong:**
The Italian page at `/` has `<link rel="canonical" href="https://toto-castaldi.github.io/" />`. The English page at `/en/` must have `<link rel="canonical" href="https://toto-castaldi.github.io/en/" />`. If both pages share the same layout and the canonical is computed from `Astro.url`, this works. But if the canonical is hardcoded or defaulted, both pages end up with the same canonical URL, which tells search engines that `/en/` is a duplicate of `/`.

**Prevention:**
The current `canonicalURL` computation in Base.astro is correct:
```astro
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
```
This will produce the right canonical for both `/` and `/en/`. Do not change this logic when adding i18n. Do not hardcode the canonical URL.

**Detection:**
- View source of `/en/index.html` -- canonical must be `https://toto-castaldi.github.io/en/`
- If canonical on both pages is identical, the English page will be treated as duplicate content

**Phase to address:** i18n layout verification. The current canonical logic is correct but must be verified after i18n config is added.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Severity | Mitigation |
|-------------|---------------|----------|------------|
| Dark mode CSS | Hardcoded `#e0e0e0` on `<hr>` survives migration (Pitfall 2) | Critical | Audit all hex values in global.css before writing dark variables |
| Dark mode JS | FOUC from deferred script (Pitfall 1) | Critical | Use `is:inline` in `<head>`, test on first implementation |
| Dark mode toggle | Missing aria-label/aria-pressed (Pitfall 9) | Moderate | Build accessibility from start, not as afterthought |
| i18n config | `prefixDefaultLocale: true` breaks root URL (Pitfall 3) | Critical | Set `false`, keep Italian at root, English in `/en/` |
| i18n SEO | Missing self-referencing hreflang (Pitfall 4) | Critical | Include hreflang for both languages on every page |
| i18n content | English page inherits Italian meta (Pitfall 13) | Moderate | Pass translated description and lang to layout |
| i18n maintenance | Content drift between languages (Pitfall 8) | Moderate | Use shared template with translation dictionary |
| Schema.org | Expecting Google rich results (Pitfall 7) | Moderate | Validate with Schema.org Validator, not Rich Results Test |
| Schema.org | JSON syntax error in hand-written JSON-LD (Pitfall 12) | Minor | Use `JSON.stringify()` on object, validate after changes |
| og:image | Relative URL in meta tag (Pitfall 5) | Critical | Use `new URL('/og-image.png', Astro.site)` |
| og:image | Platform caching stale image (Pitfall 11) | Moderate | Test with debug tools before first public share |
| Lighthouse | Inline script growing beyond theme detection (Pitfall 10) | Moderate | Cap inline script at 200 bytes, 3 operations only |
| Lighthouse | Contrast ratio failures in dark theme (Integration 3) | Moderate | Test Lighthouse in both themes separately |

---

## "Looks Done But Isn't" Checklist for v2.0

### Dark Mode
- [ ] No white flash on page load with system dark preference enabled
- [ ] `<hr>` dividers visible in both themes (no hardcoded colors remaining)
- [ ] Scrollbars adapt to dark theme (requires `color-scheme` CSS property)
- [ ] Toggle button has `aria-label` and `aria-pressed`
- [ ] Toggle button keyboard-operable (Tab, Enter, Space)
- [ ] Saved theme persists across page reloads (localStorage working)
- [ ] System preference change updates theme in real-time

### i18n
- [ ] Root URL `/` serves Italian content (not a redirect page)
- [ ] `/en/` serves English content
- [ ] No `/it/` directory exists in build output
- [ ] `<html lang="it">` on Italian page, `<html lang="en">` on English page
- [ ] Self-referencing hreflang on both pages
- [ ] `x-default` hreflang points to Italian page
- [ ] `<meta name="description">` is translated on English page
- [ ] All `og:*` meta tags are translated on English page
- [ ] Language switcher links to correct alternate page
- [ ] Canonical URLs are correct on both pages

### Schema.org
- [ ] JSON-LD validates at `https://validator.schema.org/`
- [ ] No trailing commas or syntax errors in JSON-LD
- [ ] `@context` is `"https://schema.org"` (HTTPS, not HTTP)
- [ ] JSON-LD is in a `<script type="application/ld+json">` tag
- [ ] Person schema uses correct `sameAs` URLs

### og:image
- [ ] `og:image` content is an absolute URL starting with `https://`
- [ ] Image is exactly 1200x630px
- [ ] Image format is PNG or JPEG (not WebP)
- [ ] `og:image:width` and `og:image:height` are specified
- [ ] Image filename has no spaces or special characters
- [ ] Facebook Sharing Debugger shows correct preview
- [ ] Image file is in `public/` directory (not `src/`)

### Lighthouse
- [ ] Performance score 95+ (both themes)
- [ ] Accessibility score 100 (both themes, both languages)
- [ ] Best Practices score 100
- [ ] SEO score 100 (both languages)
- [ ] No CLS from theme application
- [ ] No render-blocking resources flagged (inline script is intentional, should be small)

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| FOUC (Pitfall 1) | LOW | Add `is:inline` to existing script, move to `<head>`, redeploy |
| Hardcoded colors (Pitfall 2) | LOW | Find/replace hex values with CSS variables, test both themes |
| Broken root URL from i18n (Pitfall 3) | MEDIUM | Change `prefixDefaultLocale` to `false`, move pages back to root, redeploy. SEO recovery takes 1-4 weeks if Google re-indexed the redirect |
| Missing hreflang (Pitfall 4) | LOW | Add hreflang links to layout, redeploy. Google re-processes within days |
| Relative og:image URL (Pitfall 5) | LOW | Fix URL to absolute, purge social platform caches, reshare |
| Missing color-scheme (Pitfall 6) | LOW | Add CSS property and meta tag, redeploy |
| Wrong Schema.org expectations (Pitfall 7) | ZERO | No code change needed -- only expectation adjustment |
| Content drift (Pitfall 8) | MEDIUM | Audit both pages, sync content, adopt translation dictionary pattern |
| Toggle accessibility (Pitfall 9) | LOW | Add aria attributes to button, redeploy |
| Bloated inline script (Pitfall 10) | LOW | Refactor: keep only theme detection inline, move rest to deferred script |
| Stale og:image cache (Pitfall 11) | LOW | Use cache-busting filename, purge platform caches |
| JSON-LD syntax error (Pitfall 12) | LOW | Fix JSON, validate, redeploy |
| Untranslated English meta (Pitfall 13) | LOW | Pass correct props to layout from English page |
| Anchor ID inconsistency (Pitfall 14) | LOW | Standardize IDs across languages, update any shared links |
| Missing og:image dimensions (Pitfall 15) | LOW | Add width/height meta tags |

---

## Sources

### Dark Mode & FOUC
- Astro Tips dark mode recipe (CSS custom properties approach): https://astro-tips.dev/recipes/dark-mode/
- Preventing dark mode flicker in Astro: https://axellarsson.com/blog/astrojs-prevent-dark-mode-flicker/
- Pyronaur dark mode toggle (inline script pattern): https://pyronaur.com/dark-mode
- web.dev color-scheme CSS property: https://web.dev/articles/color-scheme

### i18n
- Astro official i18n routing docs: https://docs.astro.build/en/guides/internationalization/
- Astro i18n API reference (getRelativeLocaleUrl, getAbsoluteLocaleUrl): https://docs.astro.build/en/reference/modules/astro-i18n/
- Astro issue #9300 (prefixDefaultLocale redirect problem): https://github.com/withastro/astro/issues/9300
- Astro issue #12750 (404 page with i18n): https://github.com/withastro/astro/issues/12750
- Astro issue #12897 (unexpected i18n paths in Astro 5): https://github.com/withastro/astro/issues/12897

### hreflang
- SEO Clarity guide to self-referencing hreflang: https://www.seoclarity.net/blog/self-referencing-hreflang
- Semrush hreflang common mistakes infographic: https://www.semrush.com/blog/the-most-common-hreflang-mistakes-infographic/
- Search Engine Journal 6 hreflang mistakes: https://www.searchenginejournal.com/common-hreflang-tag-mistakes/455073/

### Schema.org
- Schema.org Person type specification: https://schema.org/Person
- JSON-LD Person example: https://jsonld.com/person/
- Schema.org Validator: https://validator.schema.org/
- Schema markup best practices 2026: https://geneo.app/blog/schema-markup-best-practices-2026-json-ld-audit/

### og:image
- Open Graph protocol specification: https://ogp.me/
- OG image sizes complete guide: https://www.krumzi.com/blog/open-graph-image-sizes-for-social-media-the-complete-2025-guide
- Veonr relative vs absolute og:image URLs: https://veonr.com/blog/relative-vs-absolute-og-image-video-urls
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/

### Lighthouse
- Astro performance optimization guide (Lighthouse 100): https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/
- Chrome DevTools render-blocking resources: https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources
- Lighthouse accessibility scoring: https://developer.chrome.com/docs/lighthouse/accessibility/scoring

---
*Pitfalls research for: v2.0 Enhancement & i18n (dark mode, i18n IT/EN, Schema.org, og:image, Lighthouse)*
*Researched: 2026-02-19*
