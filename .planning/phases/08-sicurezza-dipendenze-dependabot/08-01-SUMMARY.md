---
phase: 08-sicurezza-dipendenze-dependabot
plan: 01
subsystem: infra
tags: [dependabot, npm-audit, astro, supply-chain, security, lockfile]

# Dependency graph
requires:
  - phase: 01-scaffold-ci-cd
    provides: Astro project + GitHub Pages deploy workflow (withastro/action@v5 reinstalls from package-lock.json)
provides:
  - Regenerated package-lock.json (lockfileVersion 3) with 0 high vulnerabilities (down from 7 high)
  - astro resolved to 5.18.2 within the existing ^5.17.1 caret (no Astro 6 major bump)
  - RESIDUAL-ADVISORIES.md documenting accepted moderate astro residuals with static-site non-exploitability rationale
  - .github/dependabot.yml (v2, npm + github-actions, weekly, grouped) for recurrence prevention
affects: [08-02 deploy de-risk, phase-9 governance, future dependency bumps]

# Tech tracking
tech-stack:
  added: [dependabot-v2-config]
  patterns:
    - "Non-major-only vulnerability remediation (npm audit fix without --force + npm update)"
    - "Lockfile committed as supply-chain source of truth (withastro/action reinstalls 1:1)"
    - "Lightweight residual-acceptance record (GHSA ID + static-site rationale), distinct from formal ADR"

key-files:
  created:
    - .github/dependabot.yml
    - .planning/phases/08-sicurezza-dipendenze-dependabot/RESIDUAL-ADVISORIES.md
  modified:
    - package-lock.json

key-decisions:
  - "D-01: Stay on Astro 5.x — astro resolved to 5.18.2 within caret, no Astro 6 bump"
  - "D-03: 7 high + 1 fixable moderate transitive resolved via npm audit fix (no --force) + npm update"
  - "D-04: package.json unchanged — caret preserved, no exact pins, no overrides/resolutions"
  - "D-05: Minimal Dependabot v2 config — npm + github-actions, weekly, grouped, no extra knobs"
  - "D-02/D-06: Two remaining moderate astro advisories accepted as documented residuals (static-site non-exploitable)"

patterns-established:
  - "Pattern: Vulnerability fixes stay non-major (npm audit fix without --force) to protect the GitHub Pages deploy"
  - "Pattern: Accepted residuals recorded in a lightweight RESIDUAL-ADVISORIES.md with GHSA ID + non-exploitability rationale + SEC-01 reference"

requirements-completed: [SEC-01, SEC-02]

# Metrics
duration: ~20min
completed: 2026-06-03
---

# Phase 8 Plan 01: Sicurezza dipendenze (fix + Dependabot) Summary

**Zeroed all 7 high npm-audit vulnerabilities in-place via non-major `npm audit fix` + `npm update` (astro → 5.18.2, no Astro 6 bump), documented the remaining accepted moderate astro residuals, and added a minimal Dependabot v2 governance config.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-06-03
- **Tasks:** 3 (2 auto + 1 checkpoint, all complete)
- **Files modified:** 3 (1 modified, 2 created)

## Accomplishments

- **High vulnerabilities zeroed:** baseline 10 vulns (7 high, 3 moderate) → **0 high**, satisfying SEC-01.
- **No-major remediation:** the 7 high + 1 fixable moderate transitive advisories (defu, devalue, h3, picomatch, postcss, rollup, smol-toml, svgo, vite) were resolved with `npm audit fix` **without `--force`** + `npm update`. `astro` resolved to **5.18.2** within the existing `^5.17.1` caret — no Astro 6 major bump (D-01), de-risking the deploy that the previous bump broke (run 25837277597).
- **package.json untouched:** caret range preserved, `"type": "module"` and 4 scripts intact, **no `overrides`/`resolutions`** added (D-04). Only `package-lock.json` (lockfileVersion 3) was regenerated.
- **Residuals documented:** RESIDUAL-ADVISORIES.md records all three originally-tracked moderate astro advisories with GHSA IDs + static-site non-exploitability rationale + SEC-01 justification.
- **Governance added:** `.github/dependabot.yml` (v2) monitors npm + github-actions weekly with grouped PRs to prevent recurrence (D-05).
- **Supply-chain checkpoint (T-08-SC) passed:** the lockfile diff was reviewed and approved at the blocking human-verify checkpoint before it gates the deploy.

## Audit Counts: Baseline vs Post-fix

| Metric | Baseline (pre-fix) | Post-fix (verified) |
|--------|--------------------|---------------------|
| Total `npm audit` vulnerabilities | 10 | 2 |
| High | 7 | **0** |
| Moderate | 3 | 2 (astro, accepted) |
| Low | 0 | 0 |

**astro resolved version:** 5.18.2 (in `package-lock.json`, within `^5.17.1` caret).
**package.json changed:** No — caret preserved, no pins, no `overrides`/`resolutions`.

## Task Commits

1. **Task 1: Fix fixable vulnerabilities + regenerate lockfile** — `3b5eae7` (fix)
2. **Task 2: Document residuals + add Dependabot config** — `41f621f` (docs)
3. **Task 3: Supply-chain checkpoint (T-08-SC)** — checkpoint, **approved** (no commit; verified `npm audit`, package.json no-diff, lockfile transitive bumps, dependabot.yml minimal, RESIDUAL-ADVISORIES.md complete)

**Plan metadata:** (this commit)

## Files Created/Modified

- `package-lock.json` (modified) — regenerated at lockfileVersion 3; transitive bumps resolving 7 high + 1 moderate; astro resolved to 5.18.2. No new top-level packages introduced.
- `.github/dependabot.yml` (created) — Dependabot v2, npm + github-actions ecosystems, weekly, grouped (`patterns: ["*"]`), minimal (no extra knobs).
- `.planning/phases/08-sicurezza-dipendenze-dependabot/RESIDUAL-ADVISORIES.md` (created) — accepted residual record with 3 GHSA IDs + static-site rationale + SEC-01 justification + supply-chain posture note.

## Decisions Made

- Followed plan decisions D-01 through D-06 as specified.
- Resolved everything fixable **without** `overrides`/`resolutions` — `npm audit fix` (no `--force`) + `npm update` was sufficient, so package.json stayed byte-identical.

## Deviations from Plan

### Beneficial deviation: GHSA-g735 resolved better than expected

**1. [Beneficial outcome] One of the 3 expected moderate residuals was eliminated by the 5.18.2 patch**
- **Found during:** Task 1 (post-fix `npm audit`)
- **Expected:** 3 moderate astro residuals remaining (GHSA-g735-7g2w-hh3f, GHSA-j687-52p2-xcff, GHSA-xr5h-phrj-8vxv).
- **Actual:** Only **2** moderate residuals remain. **GHSA-g735-7g2w-hh3f** (remote allowlist bypass on `matchPathname`) was **resolved within Astro 5.x** by the non-major bump to 5.18.2 — it is no longer reported by `npm audit`.
- **Impact:** Strictly better security posture than planned; no scope change. RESIDUAL-ADVISORIES.md records GHSA-g735 with status **RESOLVED** (retained for baseline traceability) and accepts only the two remaining (GHSA-j687-52p2-xcff, GHSA-xr5h-phrj-8vxv), both fixable solely by Astro 6 (out of scope, D-01) and non-exploitable on this `output: static` site.
- **Verification:** `npm audit` shows 1 moderate-vulnerable package (astro) with exactly 2 underlying advisories; `npm audit` reports 0 high. Orchestrator independently confirmed GHSA-g735 resolution.

---

**Total deviations:** 1 (beneficial outcome, no scope change).
**Impact on plan:** Positive — one fewer accepted residual than planned. All acceptance criteria met or exceeded.

## Issues Encountered

None. The previous deploy-breaking concern (Astro major bump, run 25837277597) was explicitly avoided by the non-major approach; deploy re-verification is the responsibility of plan 08-02.

## User Setup Required

None — no external service configuration required. (`.github/dependabot.yml` activates automatically once on the default branch.)

## Next Phase Readiness

- Lockfile (0 high, 2 accepted moderate residuals) is committed and ready to gate the GitHub Pages deploy.
- **Plan 08-02** is the de-risk step: clean `npm ci` + build, Lighthouse 100×4, and confirmation that the GitHub Pages workflow completes (superseding the prior failed bump).
- No blockers.

## Self-Check: PASSED

- Files verified: package-lock.json, .github/dependabot.yml, RESIDUAL-ADVISORIES.md, 08-01-SUMMARY.md — all FOUND.
- Commits verified: 3b5eae7 (Task 1 fix), 41f621f (Task 2 docs) — all FOUND.

---
*Phase: 08-sicurezza-dipendenze-dependabot*
*Completed: 2026-06-03*
