# Project Research Summary

**Project:** toto-castaldi.github.io — v2.0 Enhancement & i18n
**Domain:** Personal landing page — dark mode, i18n (IT/EN), structured data, og:image, Lighthouse optimization on existing Astro 5 static site
**Researched:** 2026-02-19
**Confidence:** HIGH

## Executive Summary

This is a v2.0 enhancement milestone on an existing, working Astro 5 static site deployed to GitHub Pages. The project adds dark mode with a user toggle, Italian/English i18n routing, Schema.org Person structured data, a 1200x630 og:image for social sharing, section anchor deep-links, and Lighthouse optimization. All six features are well-documented, standard patterns for Astro 5 static sites. The research reveals a strong dependency chain: CSS variable refactoring must precede dark mode; Astro i18n config must precede EN page creation; and all features must be complete before Lighthouse is audited. No new framework dependencies are needed — only `satori` and `sharp` for build-time og:image generation, which is a P3 enhancement; a hand-crafted static PNG suffices for v2.0.

The recommended approach is minimal and dependency-free. Astro 5 provides built-in i18n routing (`astro:i18n` module, `getRelativeLocaleUrl()`, `Astro.currentLocale`), eliminating any third-party i18n library. Dark mode requires only an inline vanilla JS `<script is:inline>` in the layout `<head>` plus CSS custom property overrides in `global.css` — no framework island, no library. Schema.org JSON-LD is a single static TypeScript object serialized with `JSON.stringify`. The only justified new packages are `satori` and `sharp`, and only if Satori-based og:image generation is chosen over a hand-crafted PNG.

The primary risk is FOUC (Flash of Unstyled Content) on dark mode page load — well-understood and prevented entirely by Astro's `is:inline` directive on the theme detection script. A secondary risk is i18n routing misconfiguration: setting `prefixDefaultLocale: true` instead of `false` would break the existing root Italian URL and require SEO recovery time. Both risks have clear, deterministic prevention strategies verified against official sources and the Astro issue tracker.

## Key Findings

### Recommended Stack

The existing stack (Astro 5.17.3, Node 22.x LTS, GitHub Actions + withastro/action@v5) is fully validated and must not change. The only additions are two build-time packages for og:image generation if that route is chosen. Everything else uses Astro built-ins and vanilla CSS/JS.

**Core technologies:**

- **Astro 5.17.3 (existing):** Static site framework — built-in i18n (`prefixDefaultLocale: false`), static endpoints, `is:inline` directive; all required features available without upgrading.
- **Astro built-in i18n:** Locale routing and URL helpers — native since Astro 3.5; no third-party library justified for 2 locales and ~20 translation strings.
- **CSS custom properties (existing):** Design tokens for dark mode — `[data-theme="dark"]` selector overrides same `:root` variables; zero new dependencies.
- **Inline `<script is:inline>` (vanilla JS):** FOUC prevention — synchronous execution before first paint; ~30 lines total; the only mandatory client-side JS on the site.
- **satori ^0.12.x + sharp ^0.34.x (new, P3):** Build-time og:image generation — satori renders HTML-like object to SVG; sharp converts to 1200x630 PNG; both are build-time only with zero client-side impact.

**What NOT to add:** `astro-themes`, `astro-i18n`, `astro-i18next`, `paraglide-astro`, `astro-seo-schema`, `tailwindcss`, any UI framework (React/Vue/Svelte), `@astrojs/sitemap`, `@astrojs/compress`.

See full rationale: `.planning/research/STACK.md`

### Expected Features

**Must have (core milestone delivery):**
- Dark mode toggle — system preference respected, localStorage persistence, no FOUC, `aria-label` + `aria-pressed` on button
- i18n IT/EN — Italian stays at `/`, English at `/en/`; correct `lang` attribute; self-referencing hreflang on every page; visible language switcher
- Schema.org Person JSON-LD — valid markup, passes Schema.org Validator (Person is not eligible for Google Rich Results — this is expected behavior, not an error)
- og:image — 1200x630 PNG (static or Satori-generated), absolute URL via `new URL('/og-image.png', Astro.site)`, includes `og:image:width/height/type`
- Section anchor links — visible affordance on hover, smooth scroll CSS, `prefers-reduced-motion` override
- Lighthouse 90+ in all four categories (Performance, Accessibility, Best Practices, SEO)

**Should have (polish within v2.0):**
- ProfilePage wrapping Person in JSON-LD (stronger Google identity signal)
- `sameAs` array with GitHub, Skillbill, toto-castaldi.com
- Dark mode CSS color transition (`transition: background-color 0.3s`)
- `prefers-reduced-motion` media query disabling smooth scroll

**Defer (beyond v2.0):**
- Satori-generated og:image (future-proofing; static PNG is sufficient for now)
- Print stylesheet
- Additional languages beyond IT/EN

See full prioritization matrix: `.planning/research/FEATURES.md`

### Architecture Approach

The architecture adds 3 new components (`ThemeToggle.astro`, `LanguagePicker.astro`, `JsonLd.astro`), 2 new source files (`src/i18n/ui.ts`, `src/i18n/utils.ts`), 1 new page (`src/pages/en/index.astro`), 1 new asset (`public/og-image.png`), and modifies 5 existing files. `Base.astro` receives the heaviest changes: dynamic `lang` prop, og:image meta tags, hreflang links, JSON-LD script injection, and the dark mode FOUC prevention inline script. The key architectural constraint is that both locale pages share identical component structure — only the `lang` variable and `t()` translation output differ. This prevents content drift between languages and keeps structural changes in one place.

**Major components:**
1. `src/layouts/Base.astro` (MODIFY) — HTML shell; receives `lang` prop; injects og:image meta, hreflang links, JSON-LD, dark mode inline script
2. `src/components/ThemeToggle.astro` (NEW) — toggle button with `<script>` for localStorage/system preference; no framework island required
3. `src/components/LanguagePicker.astro` (NEW) — links to alternate locale using `getRelativeLocaleUrl()`
4. `src/components/JsonLd.astro` (NEW) — renders `<script type="application/ld+json">` from a data prop via `JSON.stringify` + `set:html`
5. `src/i18n/ui.ts` + `src/i18n/utils.ts` (NEW) — TypeScript translation dictionary and `getLangFromUrl()`/`useTranslations()` helpers
6. `src/pages/en/index.astro` (NEW) — EN mirror of `index.astro`; same component structure, different `t()` calls
7. `src/styles/global.css` (MODIFY) — adds `[data-theme="dark"]` variable block, `@media (prefers-color-scheme: dark)` no-JS fallback, `scroll-behavior: smooth`, `color-scheme` property
8. `public/og-image.png` (NEW) — static 1200x630 social card image

**Build order (dependency-driven):** global.css dark tokens → astro.config.mjs i18n → i18n ui.ts + utils.ts → Base.astro → JsonLd.astro + ThemeToggle.astro + LanguagePicker.astro → Section.astro anchor → index.astro refactor → en/index.astro → og-image.png. Steps 1, 2, 5, and 8 are parallelizable.

See full patterns and anti-patterns: `.planning/research/ARCHITECTURE.md`

### Critical Pitfalls

1. **Dark mode FOUC** — Use `is:inline` on a `<script>` in `<head>`, before any stylesheet. Without `is:inline`, Astro bundles the script as a deferred external module and the theme applies 50-200ms after first paint. Every page load shows a white flash. This is the most-reported Astro dark mode bug.

2. **Hardcoded colors surviving dark mode migration** — `global.css` has `hr { border-top: 1px solid #e0e0e0 }` hardcoded. This line must be converted to `var(--color-border)` before dark mode CSS is written, or `<hr>` dividers become invisible in dark mode. Audit all hex values in `global.css` first.

3. **i18n routing breaks existing Italian URL** — Using `prefixDefaultLocale: true` moves Italian content from `/` to `/it/` and places a meta-refresh redirect at root. This breaks all bookmarks, backlinks, and indexed URLs. Prevention: always `prefixDefaultLocale: false`; keep `src/pages/index.astro` at root; never create `src/pages/it/`.

4. **Missing self-referencing hreflang** — Research confirms 96% of hreflang errors correlate with missing self-references. Every page must include hreflang for ALL language versions including itself, plus `hreflang="x-default"` pointing to the Italian page.

5. **Relative URL in og:image meta** — Social media crawlers reject relative paths. The content attribute must be an absolute HTTPS URL. Use `new URL('/og-image.png', Astro.site).href` — `Astro.site` is already set correctly in `astro.config.mjs`.

See full pitfall list with detection, recovery, and verification checklist: `.planning/research/PITFALLS.md`

## Implications for Roadmap

Based on the build-order dependency graph and feature groupings, three implementation phases plus one validation phase are recommended.

### Phase 1: Foundation — CSS Variables + i18n Config + Translation Content

**Rationale:** Two P0 prerequisites that everything else depends on. Dark mode cannot be built without CSS variables; i18n components and EN page cannot be built without the Astro config and translation dictionary. These steps have no dependencies of their own and produce no visible UI output — they are pure infrastructure. Critically, the EN translation content must be authored here, as it is likely the human bottleneck for the entire milestone.

**Delivers:** Refactored `global.css` with CSS custom properties for all colors (including converting hardcoded `#e0e0e0` on `hr`); `astro.config.mjs` with i18n block (`prefixDefaultLocale: false`); `src/i18n/ui.ts` translation dictionary with IT + EN strings for all 4 sections and footer; `src/i18n/utils.ts` helpers.

**Addresses (from FEATURES.md):** CSS variable refactor (P0), Astro i18n config (P0), EN content translations (P1 — content bottleneck).

**Avoids (from PITFALLS.md):** Pitfall 2 (hardcoded colors), Pitfall 3 (i18n routing with `prefixDefaultLocale`), Pitfall 8 (content drift — shared dictionary pattern established from the start).

**Research flag:** SKIP — well-documented, established patterns. Official Astro docs provide exact config. Translation content is a writing task, not a research task.

---

### Phase 2: Dark Mode — FOUC Prevention + Toggle + Accessibility

**Rationale:** Dark mode depends on Phase 1 (CSS variables) and is the most technically nuanced feature due to the FOUC risk. It should be implemented as a self-contained unit — FOUC prevention script, toggle component, and accessibility attributes together — before adding i18n page complexity. Testing dark mode on the single-locale Italian page is far easier than debugging it across two locale pages with a language switcher.

**Delivers:** Inline `<script is:inline>` in `Base.astro` `<head>` for FOUC prevention; `ThemeToggle.astro` component with `aria-label`, `aria-pressed`, keyboard support; `[data-theme="dark"]` CSS block with dark color tokens; `@media (prefers-color-scheme: dark)` no-JS fallback; `color-scheme` CSS property; `<meta name="color-scheme">` tag; CSS color transition for smooth theme switch.

**Addresses (from FEATURES.md):** Dark mode system preference (P1), dark mode toggle with persistence (P1), FOUC prevention (P1), dark mode CSS transition (P2).

**Avoids (from PITFALLS.md):** Pitfall 1 (FOUC — `is:inline` directive), Pitfall 6 (missing `color-scheme`), Pitfall 9 (toggle accessibility), Pitfall 10 (inline script must stay under 200 bytes and do only 3 things), Integration 3 (dark mode performance impact on Lighthouse).

**Research flag:** SKIP — implementation patterns are fully specified in ARCHITECTURE.md with exact code snippets. The `is:inline` directive is the only non-obvious decision; its rationale and effect are documented.

---

### Phase 3: i18n Pages + Metadata + Schema.org + og:image + Anchors

**Rationale:** With the foundation in place (Phase 1) and dark mode working (Phase 2), all remaining features can be built around the i18n page structure. Creating the EN page, language switcher, hreflang tags, JSON-LD, og:image meta tags, and section anchors are logically grouped — they all touch `Base.astro` and the page templates. Building them together avoids multiple rounds of layout changes and lets the Lighthouse audit in Phase 4 assess a stable, complete implementation.

**Delivers:** `src/pages/en/index.astro` (EN mirror with translated meta); `LanguagePicker.astro` component; hreflang + `x-default` links in `Base.astro`; `JsonLd.astro` component with ProfilePage + Person schema; `og:image` and `twitter:image` meta tags with absolute URL and dimensions; `public/og-image.png` static 1200x630 social card; section anchor links with `scroll-margin-top` and always-visible affordance on mobile.

**Addresses (from FEATURES.md):** hreflang tags (P1), language switcher (P1), og:image asset + meta tags (P1), Schema.org Person JSON-LD (P1), section anchor visible affordance + smooth scroll (P1), ProfilePage wrapper (P2), `sameAs` array (P2).

**Avoids (from PITFALLS.md):** Pitfall 4 (self-referencing hreflang on both pages), Pitfall 5 (relative og:image URL), Pitfall 7 (Schema.org Validator vs Rich Results Test — expectation management), Pitfall 11 (og:image social cache — test with Facebook Sharing Debugger before first public share), Pitfall 12 (JSON-LD syntax — use `JSON.stringify` on object), Pitfall 13 (English page inherits Italian meta — pass translated props to layout), Pitfall 14 (anchor ID consistency across languages), Pitfall 15 (og:image dimensions in meta), Integration 2 (JSON-LD language mismatch), Integration 4 (canonical URL per locale).

**Research flag:** REVIEW RECOMMENDED for og:image design only. The visual content and design of the social card (Figma/Canva/SVG) must be decided before this phase completes — it is a design task, not a code task, and is the likely non-code bottleneck. All code patterns (hreflang, JSON-LD, anchor links, language switcher) are fully specified with exact code in ARCHITECTURE.md.

---

### Phase 4: Lighthouse Audit + Fixes

**Rationale:** Lighthouse is a validation gate, not a buildable feature. It must run after all other features are complete. Performance score reflects all page weight; Accessibility score reflects all interactive elements; SEO score reflects all meta tags. Running it earlier would catch only partial results.

**Delivers:** Lighthouse 90+ in all four categories on both locale pages and in both themes; `<meta name="theme-color">` for light and dark; verified contrast ratios in both themes; confirmed skip-link and focus indicators; any accessibility gaps in toggle or anchor links resolved.

**Addresses (from FEATURES.md):** Lighthouse audit + fixes (P2).

**Avoids (from PITFALLS.md):** Integration 3 (dark mode contrast in both themes — must run Lighthouse with dark mode active separately); any toggle `aria` gaps missed in Phase 2; og:image dimension flags (Pitfall 15).

**Research flag:** SKIP — Lighthouse audits are deterministic. Run PageSpeed Insights or Chrome DevTools Lighthouse panel. Fix what it reports. No research needed.

---

### Phase Ordering Rationale

- **Dependency-first:** Phase 1 unblocks everything else. CSS variables are required for dark mode; i18n config is required for the EN page and language switcher.
- **Risk-early:** Phase 2 isolates the FOUC risk before adding i18n complexity. If dark mode FOUC is broken, it is caught on a single simple Italian page rather than across two locale pages with a language switcher.
- **Group by integration surface:** Phase 3 groups all features that touch `Base.astro` and the page templates together, minimizing redundant layout edits and keeping the component changes in one cohesive review.
- **Validate last:** Phase 4 (Lighthouse) is only meaningful after the entire feature set is stable.

### Research Flags

Phases needing attention during planning (not additional research, but decisions):
- **Phase 3:** The og:image visual design must be decided before the phase starts. Options: Figma export, Canva template, or a simple SVG-to-PNG. This is a design decision, not a research gap. Also decide: static PNG (recommended for v2.0) vs Satori-generated (P3).

Phases with standard patterns (skip research-phase):
- **Phase 1:** i18n config is one code block. CSS variable refactor is a find-replace task. Both are fully documented in official Astro docs.
- **Phase 2:** Dark mode pattern is fully specified with exact code in ARCHITECTURE.md. The `is:inline` directive is the only non-obvious step.
- **Phase 3:** All code patterns are specified. Only the og:image asset requires non-code work.
- **Phase 4:** Lighthouse is a run-and-fix loop with deterministic output.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official Astro 5 docs. Exact package versions confirmed (`satori ^0.12.x`, `sharp ^0.34.x`). All rejected alternatives documented with specific rationale. |
| Features | HIGH | All features are standard patterns for personal landing pages. Astro's own tutorial covers dark mode. Google documents hreflang and ProfilePage JSON-LD officially. |
| Architecture | HIGH | Verified against official Astro docs and current codebase. Component responsibilities and build order are deterministic from the dependency graph. |
| Pitfalls | HIGH | 5 of 15 pitfalls verified against official sources (Google, MDN, Astro issue tracker #9300, #12897). FOUC and hreflang self-reference are well-documented failure modes with deterministic prevention. |

**Overall confidence:** HIGH

### Gaps to Address

- **og:image visual design:** Research fully covers the technical implementation (absolute URL, 1200x630 PNG, `og:image:width/height`, placement in `public/`). The visual content and design of the card must be authored separately — this is a design task and likely the only non-automated step in the milestone.

- **EN translation content:** `src/i18n/ui.ts` structure is fully specified. The actual English translations for all 4 section content blocks (Imprenditoria → Entrepreneurship, Informatica → Computer Science, Fitness, CNV → Nonviolent Communication) must be written. This is a content task and the likely human-time bottleneck for Phase 1.

- **Satori vs static PNG decision:** Research recommends a hand-crafted static PNG for v2.0 (simpler, looks better for a single personal page) with Satori marked as P3. Confirm this decision before starting Phase 3 — if Satori is chosen, `npm install satori sharp` becomes a Phase 3 prerequisite.

## Sources

### Primary (HIGH confidence)
- https://docs.astro.build/en/guides/internationalization/ — Astro i18n routing, `prefixDefaultLocale`, `Astro.currentLocale`
- https://docs.astro.build/en/recipes/i18n/ — Translation dictionary pattern, `getLangFromUrl()`, `useTranslations()`
- https://docs.astro.build/en/reference/modules/astro-i18n/ — `getRelativeLocaleUrl()`, `getAbsoluteLocaleUrl()`
- https://docs.astro.build/en/tutorial/6-islands/2/ — Official dark mode tutorial, `is:inline` directive
- https://schema.org/Person — Person type specification
- https://developers.google.com/search/docs/appearance/structured-data/profile-page — Google ProfilePage structured data
- https://ogp.me/ — Open Graph protocol; absolute URL requirement
- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring — Lighthouse scoring
- https://developer.chrome.com/docs/lighthouse/accessibility/scoring — Lighthouse accessibility
- https://web.dev/articles/color-scheme — `color-scheme` CSS property and meta tag
- https://www.npmjs.com/package/satori — satori ^0.12.x current stable
- https://www.npmjs.com/package/sharp — sharp ^0.34.5 current stable
- https://github.com/withastro/astro/issues/9300 — `prefixDefaultLocale` redirect problem (verified failure mode)
- https://www.seoclarity.net/blog/self-referencing-hreflang — Self-referencing hreflang requirement

### Secondary (MEDIUM confidence)
- https://astro-tips.dev/recipes/dark-mode/ — FOUC prevention with `data-theme`, `color-scheme` CSS property
- https://arne.me/blog/static-og-images-in-astro/ — satori + sharp build-time OG image in Astro static endpoint
- https://axellarsson.com/blog/astrojs-prevent-dark-mode-flicker/ — Dark mode FOUC prevention, `is:inline` pattern
- https://ryanfeigenbaum.com/dark-mode/ — Complete dark mode toggle guide with localStorage + system preference
- https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/ — Lighthouse optimization for Astro static sites
- https://www.smashingmagazine.com/2024/03/setting-persisting-color-scheme-preferences-css-javascript/ — Color scheme persistence patterns
- https://www.semrush.com/blog/the-most-common-hreflang-mistakes-infographic/ — hreflang common mistakes, self-reference requirement
- https://knaap.dev/posts/dynamic-og-images-with-any-static-site-generator/ — Dynamic og:image with Satori

### Tertiary (LOW confidence)
- https://libraries.io/npm/astro-seo-schema — Version history verification for rejected `astro-seo-schema` package

---
*Research completed: 2026-02-19*
*Ready for roadmap: yes*
