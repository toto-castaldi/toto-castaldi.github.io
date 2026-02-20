---
phase: 03-foundation-i18n-content
plan: 01
subsystem: i18n
tags: [css-custom-properties, astro-i18n, typescript, i18n, dark-mode-prep]

# Dependency graph
requires:
  - phase: 02-contenuto-design-e-metadata
    provides: global.css with design tokens, index.astro with Italian content
provides:
  - CSS custom properties with no hardcoded colors outside :root (dark-mode ready)
  - Astro i18n routing config (IT default at /, EN at /en/)
  - Translation dictionary (ui.ts) with all content strings for IT and EN
  - Locale helpers (utils.ts) with getLangFromUrl() and useTranslations()
affects: [03-02, 04-dark-mode, locale-pages]

# Tech tracking
tech-stack:
  added: [astro-i18n-routing]
  patterns: [css-custom-properties-only, dot-separated-translation-keys, as-const-type-safety]

key-files:
  created:
    - src/i18n/ui.ts
    - src/i18n/utils.ts
  modified:
    - src/styles/global.css
    - astro.config.mjs

key-decisions:
  - "English translations drafted with professional tone matching Italian original"
  - "Translation keys use dot-separated hierarchy (site.title, section.cs.p1)"
  - "HTML preserved inline in translation strings (links, emphasis)"

patterns-established:
  - "CSS colors: all hex values in :root only, usage via var(--color-*)"
  - "i18n keys: dot-separated hierarchy matching page structure"
  - "Translation lookup: useTranslations(lang) returns t(key) function"

requirements-completed: [I18N-01, I18N-02]

# Metrics
duration: 2min
completed: 2026-02-20
---

# Phase 3 Plan 1: Foundation i18n & CSS Variables Summary

**CSS custom properties with --color-border (dark-mode ready), Astro i18n routing (IT default, EN at /en/), and full IT/EN translation dictionary with helper utilities**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-20T09:22:33Z
- **Completed:** 2026-02-20T09:24:13Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Extracted last hardcoded CSS color (#e0e0e0) into --color-border custom property; all hex values now in :root only
- Configured Astro i18n routing: Italian at / (no prefix), English at /en/
- Created complete translation dictionary with all page content strings for both IT and EN locales
- Created getLangFromUrl() and useTranslations() helper functions for locale-aware pages

## Task Commits

Each task was committed atomically:

1. **Task 1: CSS variable refactor and Astro i18n config** - `b2e0699` (feat)
2. **Task 2: Create i18n translation dictionary and utility helpers** - `4deddce` (feat)

## Files Created/Modified
- `src/styles/global.css` - Added --color-border, replaced hardcoded hex in hr rule, updated comment
- `astro.config.mjs` - Added i18n config block with IT default locale and EN secondary
- `src/i18n/ui.ts` - Translation dictionary with languages, defaultLang, and ui object (as const)
- `src/i18n/utils.ts` - getLangFromUrl() and useTranslations() helper functions

## Decisions Made
- English translations use professional tone matching the Italian original (no informal shift)
- Translation keys follow dot-separated hierarchy matching page structure (e.g., section.cs.p1)
- HTML tags (links, emphasis) preserved inline in translation strings rather than using interpolation
- CNV section translated as "Nonviolent Communication" (standard English term)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- i18n infrastructure complete: routing config, translation dictionary, helper utilities
- CSS variables fully abstracted: ready for dark mode override in Phase 4
- Plan 03-02 can now create locale-specific pages using the translation system
- All content strings available in both IT and EN for page generation

## Self-Check: PASSED

All files verified present: src/styles/global.css, astro.config.mjs, src/i18n/ui.ts, src/i18n/utils.ts
All commits verified: b2e0699, 4deddce

---
*Phase: 03-foundation-i18n-content*
*Completed: 2026-02-20*
