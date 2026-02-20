---
phase: 05-seo-metadata
plan: 01
subsystem: seo
tags: [hreflang, json-ld, schema-org, open-graph, twitter-card, og-image, smooth-scroll]

# Dependency graph
requires:
  - phase: 03-foundation-i18n-content
    provides: "i18n infrastructure (ui.ts, utils.ts, getLangFromUrl, useTranslations)"
  - phase: 04-dark-mode
    provides: "Base.astro layout with theme toggle and color-scheme meta"
provides:
  - "hreflang cross-references (it, en, x-default) with absolute URLs"
  - "Person JSON-LD structured data with localized jobTitle"
  - "og:image 1200x630 PNG for social sharing"
  - "og:locale per language (it_IT, en_US)"
  - "Twitter Card summary_large_image meta tags"
  - "Smooth scroll CSS with prefers-reduced-motion override"
affects: [05-seo-metadata]

# Tech tracking
tech-stack:
  added: [astro:i18n getAbsoluteLocaleUrl]
  patterns: [JSON-LD via JSON.stringify with set:html, og:locale from i18n translation keys]

key-files:
  created: [public/og-image.png]
  modified: [src/layouts/Base.astro, src/styles/global.css, src/i18n/ui.ts]

key-decisions:
  - "Static PNG og:image generated with Python PIL (minimalist white bg, dark text branding)"
  - "og:locale values stored as i18n translation keys for consistency with existing pattern"

patterns-established:
  - "SEO meta tags grouped by category (Open Graph, Twitter Card, hreflang, JSON-LD) in Base.astro head"
  - "JSON-LD built via JSON.stringify in frontmatter, injected with set:html directive"

requirements-completed: [I18N-03, I18N-05, SEO-01, SEO-02, SEO-03]

# Metrics
duration: 2min
completed: 2026-02-20
---

# Phase 5 Plan 1: SEO Metadata Summary

**Hreflang cross-references, Person JSON-LD, og:image social previews, og:locale per language, Twitter Cards, and smooth-scroll CSS with accessibility override**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-20T10:18:07Z
- **Completed:** 2026-02-20T10:20:14Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Both locale pages have complete hreflang tags (it, en, x-default) with absolute URLs for search engine language indexing
- Person JSON-LD structured data validates with localized jobTitle arrays per language
- og:image points to 1200x630 minimalist PNG with site branding, og:locale shows correct locale per page
- Twitter Card summary_large_image tags enable rich social previews on both pages
- Smooth scroll CSS with prefers-reduced-motion accessibility override

## Task Commits

Each task was committed atomically:

1. **Task 1: Create og:image PNG and add smooth scroll CSS** - `b32d24c` (feat)
2. **Task 2: Add hreflang, JSON-LD, og:image, og:locale, and Twitter Card tags** - `d610e70` (feat)

## Files Created/Modified
- `public/og-image.png` - 1200x630 minimalist PNG with "Antonio Castaldi" branding for social sharing
- `src/layouts/Base.astro` - Complete SEO head section: hreflang, JSON-LD, og:image, og:locale, Twitter Card tags
- `src/styles/global.css` - scroll-behavior: smooth with prefers-reduced-motion: reduce override
- `src/i18n/ui.ts` - Added og.locale translation keys (it_IT, en_US)

## Decisions Made
- Used Python PIL to generate static og:image PNG (ImageMagick also available but PIL offered better text rendering control)
- og:locale values stored as i18n translation keys in ui.ts for consistency with existing translation pattern
- JSON-LD Person schema built with JSON.stringify in Astro frontmatter and injected via set:html (avoids template literal escaping issues)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- SEO metadata complete for both locale pages
- Ready for 05-02 (sitemap, robots.txt, or remaining SEO tasks)
- Build passes cleanly with all new meta tags rendered correctly

## Self-Check: PASSED

All files verified present. All commits verified in git log.

---
*Phase: 05-seo-metadata*
*Completed: 2026-02-20*
