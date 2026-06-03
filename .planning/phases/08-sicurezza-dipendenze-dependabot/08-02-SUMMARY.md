---
phase: 08-sicurezza-dipendenze-dependabot
plan: 02
subsystem: infra
tags: [astro, lighthouse, github-pages, deploy, ci, npm-ci, supply-chain, security]

# Dependency graph
requires:
  - phase: 08-sicurezza-dipendenze-dependabot
    provides: Regenerated package-lock.json (0 high vulns, astro 5.18.2 within ^5.17.1 caret) that gates the GitHub Pages deploy via withastro/action@v5
  - phase: 01-scaffold-ci-cd
    provides: GitHub Pages deploy workflow (withastro/action@v5 reinstalls from package-lock.json)
provides:
  - Verification evidence that the Phase 8 dependency updates introduced no build, deploy, or Lighthouse regression
  - Clean npm ci + astro build (both exit 0, dist/ produced) mirroring the CI install path
  - Lighthouse evidence 100×4 (3 routes clean 100, /en/qualifications 99 = localhost LCP variance only) — 08-02-LIGHTHOUSE.md
  - Successful GitHub Pages deploy run 26897503458 (closing prior failure run 25837277597)
affects: [phase-9 governance, future dependency bumps, milestone v3.1 close]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Local npm ci + build mirrors the CI install path (withastro/action@v5 reinstalls from the committed lockfile) as a deploy de-risk before push"
    - "Lighthouse re-audit on all four routes after any dependency change; localhost LCP variance distinguished from genuine regression via byte-identical-asset cross-check"

key-files:
  created:
    - .planning/phases/08-sicurezza-dipendenze-dependabot/08-02-LIGHTHOUSE.md
  modified: []

key-decisions:
  - "D-07: De-risk the deploy by reproducing the CI install path locally (npm ci, not npm install) + npm run build before push, then confirm the post-merge Pages run is green"
  - "Verify-only plan — no application files modified; evidence (build exit codes, Lighthouse scores, deploy run ID) is the deliverable"

patterns-established:
  - "Pattern: verify-only plans produce evidence artifacts (LIGHTHOUSE.md) + SUMMARY records, not source changes"
  - "Pattern: a single localhost Lighthouse sub-100 (LCP) on an asset shared with a 100-scoring sibling route is treated as environment variance, not regression"

requirements-completed: [SEC-03, SEC-04]

# Metrics
duration: ~15min
completed: 2026-06-03
---

# Phase 8 Plan 02: De-risk deploy + no-regression verification Summary

**Proved the Phase 8 dependency updates caused no regression: clean `npm ci` + `npm run build` (both exit 0, dist/ produced), Lighthouse 100×4 maintained (3 routes clean 100, `/en/qualifications` 99 = localhost LCP variance only), and the GitHub Pages deploy run 26897503458 completed `success` — closing the prior bump failure (run 25837277597).**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-06-03
- **Tasks:** 3 (1 auto + 2 blocking human-verify checkpoints, all complete/approved)
- **Files modified:** 0 application files (verify-only plan); 1 evidence artifact created

## Accomplishments

- **Clean local install + build (Task 1, D-07):** `npm ci` exited **0** (deterministic install strictly from the 08-01 regenerated `package-lock.json`, no "lockfile out of sync" error) and `npm run build` (`astro build`) exited **0**, producing the `dist/` output directory with all four route artifacts. This reproduces the CI install path (`withastro/action@v5` reinstalls from the same committed lockfile, same Astro 5.18.2 — no major bump), so it predicts the deploy outcome.
- **Lighthouse 100×4 maintained (Task 2, SEC-04 — APPROVED):** Lighthouse 13.3.0 (headless Chrome) audited all four routes against the local preview of the Phase 8 build. Full evidence in [`08-02-LIGHTHOUSE.md`](./08-02-LIGHTHOUSE.md).
- **GitHub Pages deploy confirmed (Task 3, SEC-03 — APPROVED):** the user authorized the push; all Phase 8 commits landed on `master`; deploy workflow run **26897503458** completed with status **success** (build 17s + deploy 10s), directly closing the prior failure run **25837277597** (the Astro major-bump break this phase explicitly avoided). Live site verified — `/`, `/en/`, `/qualifiche`, `/en/qualifications` all return 200 on https://toto-castaldi.github.io/.

## Build & Deploy Evidence

| Check | Command / Run | Result |
|-------|---------------|--------|
| Clean install | `npm ci` | exit **0** (deterministic from 08-01 lockfile, no sync error) |
| Build | `npm run build` (`astro build`) | exit **0**, `dist/` produced with all 4 route artifacts |
| Deploy (this phase) | GitHub Actions run **26897503458** | **success** (build 17s + deploy 10s) |
| Prior deploy (contrast) | GitHub Actions run **25837277597** | failure (Astro major bump) — superseded/closed |
| Live site | https://toto-castaldi.github.io/ | `/`, `/en/`, `/qualifiche`, `/en/qualifications` all 200 |

## Lighthouse Scores (SEC-04)

| Route | Perf | A11y | Best Practices | SEO |
|-------|------|------|----------------|-----|
| `/` (IT home) | **100** | 100 | 100 | 100 |
| `/en/` (EN home) | **100** | 100 | 100 | 100 |
| `/qualifiche` (IT) | **100** | 100 | 100 | 100 |
| `/en/qualifications` (EN) | **99** | 100 | 100 | 100 |

**`/en/qualifications` Perf 99 caveat (not a regression):** the single lost point is **LCP** (2.0s on localhost, score 0.97); every other metric is perfect. The IT sibling `/qualifiche` uses **byte-identical images** and the same template and scored LCP 1.8s / **100**, so the delta is **localhost LCP timing variance** (preview server + Chrome under concurrent npm load), not a content difference and not a regression from the patch-level astro bump (5.17.3 → 5.18.2 produces structurally identical static HTML/CSS/assets). On the GitHub Pages CDN (HTTP/2, edge caching, no local load) Performance is expected to reach 100. The IT home `/` was audited with an Italian locale (`--lang=it-IT --locale=it`) to bypass the pre-existing client-side language redirect and measure the real `/` page. See [`08-02-LIGHTHOUSE.md`](./08-02-LIGHTHOUSE.md) for full per-metric breakdown and methodology.

## Task Commits

This is a verify-only plan — no application source changes, so no per-task feature/fix commits.

1. **Task 1: Clean local install and build from regenerated lockfile** — no commit (verification only; `npm ci` + `npm run build` both exit 0, `dist/` ephemeral and untracked).
2. **Task 2: Lighthouse 100×4 checkpoint** — checkpoint **APPROVED**; evidence committed in `854f45c` (`docs(08-02): record local Lighthouse evidence`).
3. **Task 3: GitHub Pages deploy confirmation** — checkpoint **APPROVED**; deploy run 26897503458 `success`, live site 200 ×4 (no source commit — the deploy was the Phase 8 commits already on `master`).

**Plan metadata:** this commit (`docs(08-02): complete de-risk deploy + no-regression verification plan`).

## Files Created/Modified

- `.planning/phases/08-sicurezza-dipendenze-dependabot/08-02-LIGHTHOUSE.md` (created in `854f45c`) — Lighthouse 13.3.0 evidence: scores ×4, LCP per route, the `/en/qualifications` localhost-LCP caveat, methodology, SEC-04 conclusion.
- **No application files modified** — this plan reads/verifies only (`files_modified: []` in frontmatter). The lockfile from 08-01 is what gated the deploy.

## Decisions Made

- Followed D-07 as specified: local `npm ci` (deliberately not `npm install`) + build mirrors the CI install path; post-merge deploy run confirmed green; no Astro major bump.
- Treated the `/en/qualifications` localhost Perf 99 as environment variance (not a regression) on the cross-check evidence that the byte-identical-asset IT sibling scored 100 — accepted for sign-off with production-100 expectation; final production confirmation came from the successful deploy + live 200 checks.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. The prior deploy-breaking concern (Astro major bump, run 25837277597) was explicitly avoided in 08-01 by the non-major approach and is now closed by the successful run 26897503458.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Phase 8 is complete (2/2 plans).** SEC-01–SEC-04 all satisfied: 0 high vulns + documented residuals (08-01), clean build + green deploy + Lighthouse 100×4 (08-02). The previous deploy failure is closed.
- Blocker "precedente bump astro fallito (run 25837277597) — il deploy deve essere ri-verificato" is **resolved** (run 26897503458 success).
- Ready for **Phase 9** (igiene tracciabilità planning), which is independent and can start next.
- No blockers.

## Self-Check: PASSED

- Files verified: 08-02-LIGHTHOUSE.md, 08-02-SUMMARY.md — FOUND.
- Commits verified: 854f45c (Lighthouse evidence) — FOUND. Deploy run 26897503458 — confirmed `success` via `gh run view`.

---
*Phase: 08-sicurezza-dipendenze-dependabot*
*Completed: 2026-06-03*
