# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-19)

**Core value:** La pagina personale di Toto deve essere visibile e aggiornata su https://toto-castaldi.github.io/ con un stack moderno e manutenibile.
**Current focus:** v2.0 Enhancement & i18n -- Phase 4: Dark Mode (complete)

## Current Position

Phase: 4 of 6 (Dark Mode)
Plan: 1 of 1 in current phase (complete)
Status: Phase 4 complete, ready for phase 5
Last activity: 2026-02-20 -- Completed 04-01 (dark mode toggle, system preference, persistence, FOUC prevention)

Progress: [████████████████░░░░] 80% (v1.0 complete; phases 3-4 complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 5 (2 v1.0 + 3 v2.0)
- Average duration: ~8min
- Total execution time: ~0.7 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-scaffold-e-ci-cd | 1/1 | ~25min | ~25min |
| 02-contenuto-design-e-metadata | 1/1 | ~2min | ~2min |
| 03-foundation-i18n-content | 2/2 | ~7min | ~3.5min |
| 04-dark-mode | 1/1 | ~5min | ~5min |

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- v2.0: Separate pages for i18n (SEO-friendly hreflang, no JS)
- v2.0: Toggle JS for dark mode (relaxes zero-JS constraint, minimal and functional)
- v2.0: Static PNG for og:image (Satori deferred to future enhancement)
- 03-01: English translations use professional tone matching Italian original
- 03-01: Translation keys use dot-separated hierarchy (site.title, section.cs.p1)
- 03-01: HTML preserved inline in translation strings (links, emphasis)
- 03-02: Browser language detection uses is:inline script (synchronous, no Astro bundling)
- 03-02: localStorage key 'preferred-lang' persists visitor locale preference
- 03-02: Section IDs remain Italian on both pages (ENH-03 deferred)
- 04-01: Fixed-position toggle button (top-right, z-index 1000) for consistent page access
- 04-01: is:inline directive on head script and toggle handler for synchronous execution
- 04-01: No CSS transitions on theme change (instant swap avoids page-load flash artifacts)

### Pending Todos

None.

### Blockers/Concerns

- Phase 5: og:image visual design must be decided before phase starts

## Session Continuity

Last session: 2026-02-20
Stopped at: Completed 04-01-PLAN.md (Phase 4 complete)
Resume file: .planning/phases/04-dark-mode/04-01-SUMMARY.md
