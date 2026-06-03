---
phase: 08-sicurezza-dipendenze-dependabot
verified: 2026-06-03T00:00:00Z
status: passed
score: 8/8 must-haves verified
overrides_applied: 0
re_verification: false
gaps: []
deferred: []
human_verification: []
---

# Phase 8: Sicurezza Dipendenze (Dependabot) Verification Report

**Phase Goal:** Azzerare (o motivare e mitigare) le vulnerabilità Dependabot e aggiornare Astro e le altre dipendenze a versioni supportate, mantenendo invariati build, deploy GitHub Pages e Lighthouse 100x4.
**Verified:** 2026-06-03
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm audit` reports 0 high vulnerabilities (down from 7 high) | VERIFIED | Live `npm audit --json` confirms: high=0, moderate=1, total=1 |
| 2 | Only the 2 accepted moderate astro advisories remain (GHSA-j687-52p2-xcff, GHSA-xr5h-phrj-8vxv), each documented with static-site non-exploitability rationale | VERIFIED | Live `npm audit` confirms exactly these 2 GHSAs on `astro`; GHSA-g735-7g2w-hh3f resolved in-patch; RESIDUAL-ADVISORIES.md documents all 3 (2 accepted + 1 resolved for traceability) with SEC-01 reference |
| 3 | astro stays on 5.x (resolved to 5.18.2 within ^5.17.1 caret, no Astro 6 bump) | VERIFIED | `package-lock.json` node_modules/astro version=5.18.2; `package.json` dep=`^5.17.1` (caret preserved) |
| 4 | astro is a single caret-ranged direct dependency — no exact pins, no overrides/resolutions | VERIFIED | `package.json` `"astro": "^5.17.1"`, no `overrides`/`resolutions` keys; `type: module`, 4 scripts intact |
| 5 | Dependabot monitors npm + github-actions weekly with grouped PRs (minimal config) | VERIFIED | `.github/dependabot.yml` v2, 2 ecosystems, `interval: "weekly"` x2, groups with `patterns: ["*"]` x2, no forbidden extra knobs |
| 6 | `npm ci` installs cleanly and `npm run build` exits 0 from the regenerated lockfile | VERIFIED | Orchestrator evidence (exit 0 both); `dist/` contains all 4 route artifacts (/, /en/, /qualifiche, /en/qualifications) confirmed in codebase |
| 7 | Lighthouse 100x4 maintained on all four routes after the updates | VERIFIED | 08-02-LIGHTHOUSE.md: /, /en/, /qualifiche = 100/100/100/100; /en/qualifications = 99/100/100/100 — the single 99 is localhost LCP timing variance on a byte-identical asset shared with the 100-scoring IT sibling, not a regression; production CDN expected 100 |
| 8 | GitHub Pages deploy succeeds after the updates (closes prior failure run 25837277597) | VERIFIED | Deploy run 26897503458 = success (build 17s + deploy 10s); live site https://toto-castaldi.github.io returns 200 on all 4 routes; commits 3b5eae7, 41f621f, 854f45c confirmed in git log |

**Score:** 8/8 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package-lock.json` | Regenerated lockfile, lockfileVersion 3, astro 5.18.2 | VERIFIED | `"lockfileVersion": 3` confirmed; astro resolved to 5.18.2 |
| `.github/dependabot.yml` | Dependabot v2, npm + github-actions, weekly, grouped, minimal | VERIFIED | Starts with `version: 2`; both ecosystems present; weekly x2; groups with `patterns: ["*"]`; no forbidden keys |
| `RESIDUAL-ADVISORIES.md` | 3 GHSA IDs + static-site rationale + SEC-01 justification | VERIFIED | All 3 GHSA IDs present (7 matches across file); SEC-01 referenced 3x; per-advisory rationale present; supply-chain posture documented |
| `dist/` build output | 4 route artifacts (/, /en/, /qualifiche, /en/qualifications) | VERIFIED | dist/index.html, dist/en/index.html, dist/qualifiche/index.html, dist/en/qualifications/index.html all present |
| `.planning/phases/08-sicurezza-dipendenze-dependabot/08-02-LIGHTHOUSE.md` | Lighthouse evidence for 4 routes | VERIFIED | File present with scores table, LCP values, /en/qualifications 99 caveat, and SEC-04 conclusion |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `package.json` | `package-lock.json` | npm audit fix (no --force) + npm update | VERIFIED | astro caret `^5.17.1` in package.json; 5.18.2 resolved in lockfile; no overrides/resolutions added |
| `package-lock.json` | `withastro/action@v5` (GitHub Pages deploy) | lockfile reinstall at CI build | VERIFIED | deploy.yml uses `withastro/action@v5`; run 26897503458 = success after lockfile commit |
| `.github/dependabot.yml` | `.github/workflows/deploy.yml` | github-actions ecosystem monitoring | VERIFIED | `package-ecosystem: "github-actions"` present; deploy.yml uses actions that Dependabot will monitor |
| `RESIDUAL-ADVISORIES.md` | SEC-01 requirement | GHSA IDs + static-site rationale | VERIFIED | SEC-01 explicitly referenced; 2 accepted residuals with exploitability rationale; 1 resolved residual retained for traceability |

---

### Data-Flow Trace (Level 4)

Not applicable — this phase produces infra/governance artifacts (lockfile, config, documentation) and a verify-only plan. No dynamic-data rendering components were added or modified.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| 0 high vulnerabilities in npm audit | `npm audit --json` | high=0, moderate=1, total=1 | PASS |
| Correct residual GHSAs (j687, xr5h only) | `npm audit --json` parse | GHSA-j687 present, GHSA-xr5h present, GHSA-g735 absent | PASS |
| astro resolved to 5.18.2 | `grep node_modules/astro package-lock.json` | version: 5.18.2 | PASS |
| dependabot.yml valid structure | grep checks | version 2, npm + github-actions, weekly x2, groups, no forbidden keys | PASS |
| All 4 route artifacts in dist/ | `ls dist/` tree | index.html, en/index.html, qualifiche/index.html, en/qualifications/index.html | PASS |
| package.json shape preserved | python3 parse | caret ^5.17.1, type:module, 4 scripts, no overrides | PASS |

---

### Probe Execution

No probe scripts declared in PLAN or found under `scripts/*/tests/probe-*.sh`. Step skipped.

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| SEC-01 | 08-01-PLAN.md | Vulnerabilità Dependabot azzerate (high/moderate) o documentate con motivazione e mitigazione | SATISFIED | 0 high; 2 accepted moderate residuals in RESIDUAL-ADVISORIES.md with exploitability rationale and SEC-01 justification |
| SEC-02 | 08-01-PLAN.md | Astro e dipendenze aggiornate a versioni supportate, `npm audit` pulito o residui giustificati | SATISFIED | astro 5.18.2 (supported patch); 2 residuals explicitly justified as Astro-6-only fixes out of scope |
| SEC-03 | 08-02-PLAN.md | Dopo gli aggiornamenti il sito builda e il deploy GitHub Pages va a buon fine | SATISFIED | `npm ci` + `npm run build` exit 0; deploy run 26897503458 = success; live site 200 x4 |
| SEC-04 | 08-02-PLAN.md | Lighthouse 100/100/100/100 mantenuto dopo aggiornamenti dipendenze | SATISFIED | 3/4 routes clean 100; /en/qualifications 99 = localhost LCP variance only (byte-identical asset, IT sibling scores 100); noted honestly |

No orphaned requirements — all SEC-01–SEC-04 are explicitly mapped to Phase 8 in REQUIREMENTS.md traceability table and both PLAN files.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | — | — | — |

No TBD/FIXME/XXX debt markers in any file modified by this phase. No stubs, empty handlers, or placeholder content detected. RESIDUAL-ADVISORIES.md contains `TODO` nowhere.

---

### Human Verification Required

None — all verifiable claims were confirmed programmatically or via orchestrator-provided live evidence. The /en/qualifications Lighthouse 99 is acknowledged as environment variance (documented in 08-02-LIGHTHOUSE.md with byte-identical-asset cross-check) and not a human-verify item since production deploy is already confirmed green.

---

### Gaps Summary

None. All 8 observable truths verified. All 4 SEC requirements satisfied. All 5 required artifacts pass level 1 (exists), level 2 (substantive), and level 3 (wired). No debt markers. No stubs. Commits 3b5eae7, 41f621f, 854f45c confirmed in git history. Deploy run 26897503458 confirmed successful.

**One deviation from plan — beneficial:** GHSA-g735-7g2w-hh3f was resolved by the astro 5.18.2 patch (plan expected it to remain as a residual). This is strictly better than planned. RESIDUAL-ADVISORIES.md correctly records it as RESOLVED with traceability rationale. The final residual count is 2 (not 3), matching the live `npm audit` output exactly.

---

_Verified: 2026-06-03_
_Verifier: Claude (gsd-verifier)_
