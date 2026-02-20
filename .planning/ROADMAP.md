# Roadmap: toto-castaldi.github.io

## Milestones

- ✅ **v1.0 Tech Rebuild** -- Phases 1-2 (shipped 2026-02-19)
- 🚧 **v2.0 Enhancement & i18n** -- Phases 3-6 (in progress)

## Phases

<details>
<summary>v1.0 Tech Rebuild (Phases 1-2) -- SHIPPED 2026-02-19</summary>

- [x] **Phase 1: Scaffold e CI/CD** - Astro 5 project setup with GitHub Actions deploy
- [x] **Phase 2: Contenuto, Design e Metadata** - Content migration, fluid typography, OG metadata

</details>

### v2.0 Enhancement & i18n

- [x] **Phase 3: Foundation & i18n Content** - CSS variable refactor, Astro i18n config, EN page with translations
- [x] **Phase 4: Dark Mode** - Theme toggle, system preference, FOUC prevention, accessible contrast (completed 2026-02-20)
- [x] **Phase 5: SEO & Metadata** - Schema.org JSON-LD, og:image, anchor links, hreflang, language switcher, translated meta (completed 2026-02-20)
- [ ] **Phase 6: Lighthouse Audit** - Validate all four Lighthouse scores >= 95 on both locales and both themes

## Phase Details

### Phase 3: Foundation & i18n Content
**Goal**: Both Italian and English versions of the landing page are live with proper routing and all colors use CSS custom properties ready for theming
**Depends on**: Phase 2 (v1.0 complete)
**Requirements**: I18N-01, I18N-02
**Success Criteria** (what must be TRUE):
  1. Visiting / shows the Italian landing page with all four sections
  2. Visiting /en/ shows the English landing page with all four sections translated
  3. Every color value in the stylesheet uses a CSS custom property (no hardcoded hex/rgb)
  4. The site builds and deploys successfully with both locale pages
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — CSS variable refactor, Astro i18n config, translation dictionary and helpers
- [x] 03-02-PLAN.md — Refactor pages to use translations, create EN page, browser language detection

### Phase 4: Dark Mode
**Goal**: Users can switch between light and dark themes with their preference remembered and no flash on load
**Depends on**: Phase 3 (CSS variables in place)
**Requirements**: DARK-01, DARK-02, DARK-03, DARK-04, DARK-05
**Success Criteria** (what must be TRUE):
  1. User can click a toggle button to switch between light and dark themes on any page
  2. A first-time visitor with OS dark mode enabled sees the dark theme without any white flash
  3. User switches to dark mode, closes the browser, reopens the page -- dark mode is still active
  4. All text in dark mode passes WCAG AA contrast ratio (4.5:1 for body text, 3:1 for large text)
**Plans**: 1 plan

Plans:
- [x] 04-01-PLAN.md — Dark CSS variables, FOUC-preventing head script, ThemeToggle component, end-to-end verification

### Phase 5: SEO & Metadata
**Goal**: Both language pages have complete structured data, social sharing previews, navigable section links, cross-language references, and a visible language switcher
**Depends on**: Phase 4 (all page content and interactive elements complete)
**Requirements**: I18N-03, I18N-04, I18N-05, SEO-01, SEO-02, SEO-03
**Success Criteria** (what must be TRUE):
  1. Sharing the page URL on social media shows a rich preview with the 1200x630 image, correct title, and description in the page language
  2. Schema.org Validator confirms valid Person JSON-LD on both locale pages
  3. Clicking a section anchor link (e.g., #imprenditoria) scrolls smoothly to the correct section with the link visible in the URL bar
  4. A language switcher link is visible on every page and navigates between IT and EN versions
  5. Viewing page source shows hreflang tags for both locales including self-references and x-default
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — SEO head metadata: hreflang tags, Person JSON-LD, og:image, og:locale, Twitter Cards, smooth scroll CSS
- [x] 05-02-PLAN.md — Language switcher link with localStorage sync, full phase verification

### Phase 6: Lighthouse Audit
**Goal**: Both locale pages in both themes score 95+ across all four Lighthouse categories
**Depends on**: Phase 5 (all features complete and stable)
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):
  1. Lighthouse Performance score >= 95 on both / and /en/
  2. Lighthouse Accessibility score >= 95 on both / and /en/
  3. Lighthouse Best Practices score >= 95 on both / and /en/
  4. Lighthouse SEO score >= 95 on both / and /en/
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

## Progress

**Execution Order:** Phases 3 -> 4 -> 5 -> 6

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Scaffold e CI/CD | v1.0 | 1/1 | Complete | 2026-02-19 |
| 2. Contenuto, Design e Metadata | v1.0 | 1/1 | Complete | 2026-02-19 |
| 3. Foundation & i18n Content | v2.0 | 2/2 | Complete | 2026-02-20 |
| 4. Dark Mode | v2.0 | 1/1 | Complete | 2026-02-20 |
| 5. SEO & Metadata | v2.0 | 2/2 | Complete | 2026-02-20 |
| 6. Lighthouse Audit | v2.0 | 0/? | Not started | - |
