---
phase: 07-pagina-qualifiche-multilingua
plan: 03
subsystem: ui
tags: [astro, i18n, hreflang, dialog, invoker-commands, accessibility, lighthouse]

requires:
  - phase: 07-01
    provides: Three redacted WebP diploma previews + their exact pixel dimensions
  - phase: 07-02
    provides: Base.astro alternates prop + qualifiche.* i18n keys (IT/EN)
provides:
  - IT qualifiche page at /qualifiche
  - EN qualifications page at /en/qualifications
  - Keyboard-accessible native <dialog> zoom for each preview
  - figure/img/zoom-dialog/::backdrop CSS in global.css (theme-token driven)
affects: []

tech-stack:
  added: []
  patterns:
    - "Native <dialog> + Invoker Commands API (command=show-modal/close) for zero-JS accessible modals"
    - "Per-page hreflang/canonical via Base.astro alternates prop"
    - "Fixed <img width height> from source dimensions to protect CLS / Performance 100"

key-files:
  created:
    - src/pages/qualifiche.astro
    - src/pages/en/qualifications.astro
  modified:
    - src/styles/global.css

key-decisions:
  - "Shipped native <dialog> + Invoker zoom (RESEARCH Pattern 2), NOT the <a href> fallback — browser-native focus trap/ESC/return-focus satisfies D-07 with zero author JS; Lighthouse held 100/100/100/100 so the fallback escape hatch was not needed"
  - "ESC + visible close button only (no backdrop-click JS), per Open Question 1"

patterns-established:
  - "Qualifiche pages mirror index.astro skeleton (Base + Section + useTranslations), EN uses ../../ depth and useTranslations('en')"
  - "New images max-width:100% to stay inside the global 65ch column"

requirements-completed: [QUAL-01, QUAL-02, QUAL-03, QUAL-05, QUAL-06, INT-01, INT-03, INT-04]

duration: 8min
completed: 2026-06-03
---

# Phase 07: Qualifiche Pages (IT + EN) Summary

**Two multilingual qualifiche pages with three vertically-stacked redacted diploma previews, descriptive alt-text, a native `<dialog>` keyboard-accessible zoom, reciprocal hreflang, and back-home links — Lighthouse 100/100/100/100.**

## Performance

- **Duration:** ~8 min (build) + human verification checkpoint
- **Started:** 2026-06-03T12:47Z
- **Completed:** 2026-06-03T12:51Z (user-verified)
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- `/qualifiche` (IT) and `/en/qualifications` (EN) render three diplomas stacked vertically, each with preview + label + body/date and descriptive, locale-specific alt-text (QUAL-01/02/03/06)
- Both pages reuse Base.astro + Section.astro with dark/light support via existing theme tokens (QUAL-05)
- Native `<dialog>` + Invoker Commands zoom — 3 show-modal triggers / 3 close buttons / 3 dialogs, with `::backdrop` overlay and aria-labels (D-07 keyboard accessibility)
- Reciprocal hreflang via the `alternates` prop (IT↔EN, x-default→IT); home-page hreflang unchanged (INT-03)
- Back-home links ("← Torna alla home" → `/`, "← Back to home" → `/en/`) (D-13)
- Fixed `<img width height>` (1000×1414 portrait, 1000×707 landscape) to protect CLS
- Lighthouse 100/100/100/100 confirmed by the user on both routes in light and dark (INT-04)

## Task Commits

1. **Task 1: Build IT qualifiche page** — `e43ab82` (feat)
2. **Task 2: Build EN qualifications page + figure/dialog CSS** — `8193df2` (feat)
3. **Task 3: Human-verify checkpoint** — approved by user (browser + Lighthouse 100×4)

_Merged to master: `1e1df6a`._

## Files Created/Modified
- `src/pages/qualifiche.astro` — IT qualifiche page (Base + Section, 3 figure/dialog previews, back-home link)
- `src/pages/en/qualifications.astro` — EN structural clone (../../ depth, useTranslations('en'), `/en/` back link)
- `src/styles/global.css` — net-new figure/img, button.zoom-trigger, dialog.zoom-dialog, ::backdrop rules (theme-token driven)

## Decisions Made
- **Native `<dialog>` zoom shipped (not the `<a href>` fallback).** It is the research-recommended, zero-author-JS approach giving browser-native focus trap, ESC-close and return-focus. The plan's acceptance floor allowed a Pattern 3 fallback only if Lighthouse dipped below 100 — it did not, so the dialog stayed.

## Deviations from Plan
None — plan executed as written. (The Task-1 automated `grep -c 'qualifica-' … -ge 3` reads as 1 only because Astro minifies HTML to one line; `grep -o … | wc -l` confirms all three images present twice each. Content is correct; the verify command's line-count assumption was the false negative.)

## Issues Encountered
None.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Milestone v3.0 "Qualifiche Fitness" user-facing surface complete: redaction (07-01), i18n/foundation (07-02), pages (07-03) all shipped.
- Nothing pushed/deployed yet — deploy happens on push to the GitHub Pages branch.

---
*Phase: 07-pagina-qualifiche-multilingua*
*Completed: 2026-06-03*
