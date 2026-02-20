---
phase: 05-seo-metadata
verified: 2026-02-20T12:00:00Z
status: human_needed
score: 9/10 must-haves verified
re_verification: false
human_verification:
  - test: "Navigate to http://localhost:4321/ and verify 'English' switcher link is visible in top-left. Click it — should navigate to /en/. On /en/ verify 'Italiano' link appears. Click it — should navigate back to /."
    expected: "Language switcher navigates correctly between locales with no redirect bounce"
    why_human: "localStorage redirect behavior and visual positioning cannot be verified programmatically"
  - test: "Enter http://localhost:4321/#imprenditoria in the URL bar. Verify the page scrolls smoothly to the Imprenditoria section and the hash appears in the URL bar. Repeat for #informatica, #fitness, #cnv."
    expected: "Smooth scroll to target section; hash visible in URL"
    why_human: "CSS scroll-behavior is a runtime browser behavior — cannot verify from static analysis"
  - test: "Toggle dark mode with the theme button. Verify the language switcher remains visible and readable in dark theme."
    expected: "Language switcher styled correctly in both light and dark themes"
    why_human: "Visual dark-mode rendering requires browser inspection"
---

# Phase 5: SEO Metadata Verification Report

**Phase Goal:** Both language pages have complete structured data, social sharing previews, navigable section links, cross-language references, and a visible language switcher
**Verified:** 2026-02-20T12:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                        | Status      | Evidence                                                                                                       |
|----|----------------------------------------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------------------------|
| 1  | Viewing page source on both / and /en/ shows three hreflang link tags (it, en, x-default) with absolute URLs | VERIFIED | `dist/index.html` and `dist/en/index.html` both contain `hreflang="it"`, `hreflang="en"`, `hreflang="x-default"` with absolute `https://toto-castaldi.github.io/` URLs |
| 2  | Schema.org Validator confirms valid Person JSON-LD on both locale pages                      | VERIFIED    | `dist/index.html` contains full Person JSON-LD with Italian jobTitle array; `dist/en/index.html` contains English jobTitle array. Structural validity confirmed by code inspection (JSON.stringify, correct @context/@type). Runtime Schema.org validation needs human. |
| 3  | Sharing the page URL shows a rich preview with 1200x630 image, correct title and description in page language | VERIFIED | `og:image` points to absolute URL `https://toto-castaldi.github.io/og-image.png`; `public/og-image.png` confirmed as 1200x630 PNG (file command); og:title and og:description match page language on both locales; twitter:card=summary_large_image present |
| 4  | Clicking /#imprenditoria scrolls smoothly to the entrepreneurship section with hash visible in URL | VERIFIED (partial) | `id="imprenditoria"` confirmed in `dist/index.html` and `dist/en/index.html`; `scroll-behavior: smooth` in css; `prefers-reduced-motion` fallback present. Actual smooth-scroll runtime behavior needs human. |
| 5  | og:locale meta tag shows it_IT on Italian page and en_US on English page                    | VERIFIED    | `dist/index.html`: `og:locale content="it_IT"`; `dist/en/index.html`: `og:locale content="en_US"`. Translation keys `og.locale` confirmed in `src/i18n/ui.ts`. |
| 6  | A language switcher link is visible on every page and navigates between IT and EN versions  | VERIFIED (partial) | `<a href="/en/" class="lang-switch" ... onclick="localStorage.setItem('preferred-lang','en')">English</a>` in IT build; `<a href="/" class="lang-switch" ... onclick="localStorage.setItem('preferred-lang','it')">Italiano</a>` in EN build. Visual appearance needs human. |
| 7  | Clicking 'English' on the Italian page navigates to /en/ and sets localStorage preferred-lang to 'en' | VERIFIED (partial) | onclick handler `localStorage.setItem('preferred-lang','en')` confirmed in `dist/index.html`. href="/en/" confirmed. Runtime behavior needs human. |
| 8  | Clicking 'Italiano' on the English page navigates to / and sets localStorage preferred-lang to 'it' | VERIFIED (partial) | onclick handler `localStorage.setItem('preferred-lang','it')` confirmed in `dist/en/index.html`. href="/" confirmed. Runtime behavior needs human. |
| 9  | The language switcher does not conflict with the existing theme toggle position              | VERIFIED (partial) | CSS confirms `.lang-switch` is `position:fixed; top:1rem; left:1rem` and `ThemeToggle` button is `position:fixed; top:1rem; right:1rem` — opposite corners. No pixel-level overlap possible. Visual rendering needs human. |
| 10 | Both locale pages contain Twitter Card meta tags                                            | VERIFIED    | Both `dist/index.html` and `dist/en/index.html` contain `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image` with absolute og-image.png URL. |

**Score:** 9/10 truths verified programmatically (3 require human confirmation for runtime/visual behavior)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/layouts/Base.astro` | hreflang, JSON-LD, og:image, og:locale, Twitter cards, smooth scroll integration, lang-switch element | VERIFIED | All tags confirmed present and wired; both getAbsoluteLocaleUrl and getRelativeLocaleUrl imported and used; lang-switch element present in body |
| `src/styles/global.css` | scroll-behavior: smooth with prefers-reduced-motion override; .lang-switch styles | VERIFIED | `scroll-behavior: smooth` on `html` rule (line 55); `@media (prefers-reduced-motion: reduce)` override (lines 58-62); `.lang-switch` styles lines 102-122 with hover/focus-visible states |
| `src/i18n/ui.ts` | og.locale values for each language | VERIFIED | `'og.locale': 'it_IT'` in `it` object (line 36); `'og.locale': 'en_US'` in `en` object (line 65) |
| `public/og-image.png` | 1200x630 static PNG for social sharing | VERIFIED | File exists (19506 bytes); `file` command confirms: "PNG image data, 1200 x 630, 8-bit/color RGB, non-interlaced" |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/layouts/Base.astro` | `astro:i18n` | `getAbsoluteLocaleUrl` import for hreflang URLs | WIRED | `import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n'` (line 11); used as `itUrl`/`enUrl` in hreflang tags |
| `src/layouts/Base.astro` | `public/og-image.png` | `new URL('/og-image.png', Astro.site)` for og:image absolute URL | WIRED | `const ogImageURL = new URL('/og-image.png', Astro.site)` (line 18); resolves to `https://toto-castaldi.github.io/og-image.png` confirmed in dist |
| `src/layouts/Base.astro` | JSON-LD script tag | `JSON.stringify` of Person schema with `set:html` | WIRED | `<script type="application/ld+json" set:html={personJsonLd} />` (line 88); JSON.stringify in frontmatter lines 24-44 |
| `src/layouts/Base.astro` | `astro:i18n` | `getRelativeLocaleUrl` for language switcher href | WIRED | `getRelativeLocaleUrl(alternateLang, '')` (line 22); used in `<a href={alternateUrl}>` |
| `src/layouts/Base.astro` lang-switch onclick | `localStorage preferred-lang` | Inline onclick sets preferred-lang before navigation | WIRED | `onclick={\`localStorage.setItem('preferred-lang','${alternateLang}')\`}` (line 95); rendered correctly in both built pages |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| I18N-03 | 05-01 | hreflang tags on all pages (including self-references) | SATISFIED | 3 hreflang tags (it, en, x-default) with absolute URLs confirmed in both `dist/index.html` and `dist/en/index.html` |
| I18N-04 | 05-02 | Language switcher link visible on all pages | SATISFIED | `<a class="lang-switch">` present in both built pages; labeled "English" on IT, "Italiano" on EN |
| I18N-05 | 05-01 | OG metadata (title, description) translated per language | SATISFIED | `og:title`, `og:description`, and `og:locale` all vary by locale; confirmed in both dist pages |
| SEO-01 | 05-01 | Schema.org Person JSON-LD structured data in page head | SATISFIED | Full Person JSON-LD with localized `jobTitle` arrays present in `<head>` of both locale pages |
| SEO-02 | 05-01 | og:image (1200x630 static PNG) with absolute URL | SATISFIED | `og:image content="https://toto-castaldi.github.io/og-image.png"` confirmed; PNG is 1200x630 |
| SEO-03 | 05-01 | Section anchor links (#imprenditoria, #informatica, #fitness, #cnv) | SATISFIED | All four `id` attributes confirmed in both built pages; `scroll-behavior: smooth` enables navigation |

No orphaned requirements found. All 6 Phase 5 requirement IDs (I18N-03, I18N-04, I18N-05, SEO-01, SEO-02, SEO-03) are claimed by plans and verified in codebase.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/pages/en/index.astro` | 17, 21, 25, 29 | Section IDs use Italian slugs on English page (`id="imprenditoria"`, `id="informatica"`) | INFO | Anchor links like `/en/#imprenditoria` work, but English-language anchor IDs (#entrepreneurship, etc.) are absent. Listed as future enhancement ENH-03 in REQUIREMENTS.md — not a gap for this phase. |

No TODO/FIXME/placeholder comments found. No empty implementations. No stub return values.

### Human Verification Required

#### 1. Language Switcher Navigation

**Test:** Run `npm run dev`, open http://localhost:4321/. Verify "English" link is visible in the top-left corner. Click it — should navigate to /en/ without being redirected back. On /en/, verify "Italiano" link appears. Click it — should navigate back to /.
**Expected:** Smooth navigation between locales; localStorage prevents the auto-redirect on the Italian page from bouncing non-Italian users back to /en/.
**Why human:** The localStorage + redirect-prevention interaction requires a real browser to verify the sequence works without a redirect loop.

#### 2. Smooth Scroll Anchor Navigation

**Test:** Open http://localhost:4321/ in a browser. Type `/#imprenditoria` in the URL bar and press Enter. Then test `/#informatica`, `/#fitness`, `/#cnv`.
**Expected:** Page scrolls smoothly to each target section; URL hash updates and persists.
**Why human:** CSS `scroll-behavior: smooth` is a runtime browser behavior that cannot be verified from static HTML/CSS analysis.

#### 3. Dark Mode Compatibility of Language Switcher

**Test:** Open either page, click the theme toggle (top-right) to switch to dark mode. Inspect the language switcher (top-left) for readability.
**Expected:** Switcher text and border are visible in dark theme, using CSS custom properties (`--color-text`, `--color-border`, `--color-bg`).
**Why human:** Dark theme rendering requires visual browser inspection.

#### 4. Social Preview (Optional)

**Test:** Paste `https://toto-castaldi.github.io/` into a social card debugger (e.g., https://cards-dev.twitter.com/validator or https://www.opengraph.xyz/).
**Expected:** Rich preview shows og:image (1200x630 PNG with "Antonio Castaldi" branding), correct title, and Italian description.
**Why human:** Social card rendering depends on external scraping services.

### Gaps Summary

No gaps found. All artifacts exist, are substantive, and are correctly wired. All 6 phase requirements are satisfied. The 3 human verification items are runtime/visual behaviors that cannot be confirmed from static analysis — they are not blockers to declaring the implementation complete.

The only notable observation is that English page sections use Italian anchor IDs (`#imprenditoria`, `#informatica`), which is explicitly listed as future enhancement ENH-03 in REQUIREMENTS.md and is out of scope for Phase 5.

---

_Verified: 2026-02-20T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
