---
phase: quick
plan: 1
subsystem: ui
tags: [css, layout, fixed-positioning, toolbar, astro]

# Dependency graph
requires: []
provides:
  - ".site-toolbar fixed top-right container for lang-switch and theme toggle"
  - "Overlap-free heading area on all viewports"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared fixed toolbar for top-right controls (.site-toolbar)"

key-files:
  created: []
  modified:
    - src/layouts/Base.astro
    - src/styles/global.css
    - src/components/ThemeToggle.astro

key-decisions:
  - "Grouped lang-switch and theme-toggle into a shared .site-toolbar div instead of repositioning individually"

patterns-established:
  - "Site toolbar pattern: all fixed-position UI controls share a single .site-toolbar container in top-right corner"

requirements-completed: [FIX-LANG-OVERLAP]

# Metrics
duration: 1min
completed: 2026-02-21
---

# Quick Task 1: Fix Language Selector Overlapping Heading Summary

**Repositioned language selector from fixed top-left (overlapping h1) to shared top-right toolbar alongside theme toggle**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-21T08:17:34Z
- **Completed:** 2026-02-21T08:18:38Z
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments
- Language selector no longer overlaps the "Antonio Castaldi" h1 heading on any viewport
- Both controls (lang-switch + theme toggle) grouped in a fixed top-right `.site-toolbar` container
- Removed redundant `position: fixed` from both `.lang-switch` and ThemeToggle button (positioning now handled by parent)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create fixed toolbar and reposition language switch to top-right** - `a7e1036` (fix)

## Files Created/Modified
- `src/layouts/Base.astro` - Wrapped lang-switch `<a>` and `<ThemeToggle />` in shared `<div class="site-toolbar">`
- `src/styles/global.css` - Added `.site-toolbar` fixed top-right styles; removed positioning from `.lang-switch`
- `src/components/ThemeToggle.astro` - Removed `position: fixed`, `top`, `right`, `z-index` from button styles

## Decisions Made
- Grouped both controls into a shared `.site-toolbar` container rather than simply moving `.lang-switch` to the right side independently. This is cleaner and avoids potential z-index/overlap conflicts between the two controls.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Fix is complete and self-contained
- No follow-up work needed

## Self-Check: PASSED

- All 3 modified files exist on disk
- SUMMARY.md created at expected path
- Task commit `a7e1036` found in git log
- `npm run build` succeeded with zero errors
- Built HTML verified: `.site-toolbar` present, `.lang-switch` has no `position:fixed`, theme toggle button has no `position:fixed`

---
*Quick Task: 1-fix-language-selector-overlapping-headin*
*Completed: 2026-02-21*
