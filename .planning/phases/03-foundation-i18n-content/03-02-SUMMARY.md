---
phase: 03-foundation-i18n-content
plan: 02
subsystem: i18n
tags: [astro-i18n, locale-pages, browser-language-detection, localStorage, translations]

# Dependency graph
requires:
  - phase: 03-01
    provides: i18n routing config, translation dictionary (ui.ts), locale helpers (utils.ts), CSS custom properties
provides:
  - Italian landing page at / using translation dictionary with dynamic lang attribute
  - English landing page at /en/ with professional translations
  - Browser language detection redirecting non-Italian visitors to /en/
  - localStorage persistence of locale preference across visits
affects: [04-dark-mode, 05-seo-metadata, locale-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [useTranslations-per-page, set-html-for-rich-content, inline-script-for-detection]

key-files:
  created:
    - src/pages/en/index.astro
  modified:
    - src/layouts/Base.astro
    - src/pages/index.astro

key-decisions:
  - "Browser language detection uses is:inline script to prevent Astro bundling/deferring"
  - "Non-Italian browser default falls back to English (not a separate prompt)"
  - "Section IDs remain Italian on both pages (ENH-03 deferred)"
  - "localStorage key 'preferred-lang' persists visitor preference"

patterns-established:
  - "Locale pages: useTranslations('lang') in frontmatter, t('key') in template"
  - "Rich content: set:html directive for translation strings containing HTML"
  - "Language detection: is:inline script on default locale page only, preference-set script on secondary locale"

requirements-completed: [I18N-01, I18N-02]

# Metrics
duration: 5min
completed: 2026-02-20
---

# Phase 3 Plan 2: Locale Pages & Browser Language Detection Summary

**Italian and English landing pages using translation dictionary with browser language detection, localStorage persistence, and dynamic HTML lang attributes**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-20T09:25:00Z
- **Completed:** 2026-02-20T09:30:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 3

## Accomplishments
- Refactored Base.astro with dynamic `lang={lang}` attribute via getLangFromUrl()
- Refactored Italian index.astro to use useTranslations('it') instead of hardcoded text
- Created English landing page at /en/ with all four sections professionally translated
- Added browser language detection script on Italian page (redirects non-Italian first-time visitors to /en/)
- Added localStorage persistence for locale preference on both pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Refactor Base layout and Italian page to use translations** - `a9a0546` (feat)
2. **Task 2: Create English landing page at /en/** - `1a326aa` (feat)
3. **Task 3: Verify both locale pages** - checkpoint:human-verify (approved)

## Files Created/Modified
- `src/layouts/Base.astro` - Dynamic lang attribute via getLangFromUrl(), no longer hardcoded "it"
- `src/pages/index.astro` - Uses useTranslations('it'), browser language detection script with localStorage
- `src/pages/en/index.astro` - English landing page with useTranslations('en'), localStorage preference script

## Decisions Made
- Browser language detection uses `is:inline` to execute synchronously before page renders (prevents flash)
- `window.location.replace()` used instead of `assign()` to avoid polluting browser history
- Only the Italian page (/) has redirect logic; English page (/en/) only records preference
- Non-Italian, non-English browsers default to English version
- Section IDs remain Italian on both pages (English IDs deferred to ENH-03)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both locale pages are live and verified: Italian at /, English at /en/
- Phase 3 is fully complete: CSS variables (plan 01) + locale pages (plan 02)
- Phase 4 (Dark Mode) can proceed: all CSS colors use custom properties, both pages share Base.astro layout
- Phase 5 (SEO) prerequisites met: hreflang, language switcher, and OG metadata can be added to existing pages

## Self-Check: PASSED

All files verified present: src/layouts/Base.astro, src/pages/index.astro, src/pages/en/index.astro
All commits verified: a9a0546, 1a326aa

---
*Phase: 03-foundation-i18n-content*
*Completed: 2026-02-20*
