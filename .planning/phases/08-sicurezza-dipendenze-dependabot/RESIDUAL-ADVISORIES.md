# Residual Advisories — Phase 08 (Sicurezza dipendenze)

**Date:** 2026-06-03
**Scope:** SEC-01 (vulnerabilities zeroed or documented + mitigated), SEC-02 (dependencies on supported versions).
**Nature:** Lightweight acceptance record per D-06 — this is **not** a formal ADR (ADRs are the domain of Phase 10).

## Summary

| Metric | Baseline (pre-fix) | Post-fix |
|--------|--------------------|----------|
| Total `npm audit` vulnerabilities | 10 | 2 |
| High | 7 | **0** |
| Moderate | 3 | 2 (astro, accepted) |
| Low | 0 | 0 |

The 7 high + 1 fixable moderate transitive advisories were resolved in-place via
`npm audit fix` (WITHOUT `--force`) + `npm update`, regenerating
`package-lock.json` (lockfileVersion 3). No Astro 6 major bump (D-01), no exact
pins, no `overrides`/`resolutions` (D-04). `astro` resolved to **5.18.2** within
the existing `^5.17.1` caret — `package.json` was not modified.

## Accepted Residual Advisories (astro, moderate)

All three originally-tracked moderate `astro` advisories are listed below with
their GHSA IDs, advisory URLs, and **static-site non-exploitability rationale**.
Note the per-advisory **status** after the 5.18.2 patch: one was remediated
within Astro 5.x, two remain (fixable only by Astro 6, which is out of scope per
D-01) and are **accepted as documented residuals** satisfying SEC-01.

### 1. GHSA-g735-7g2w-hh3f — Astro remote allowlist bypass on `matchPathname`

- **URL:** https://github.com/advisories/GHSA-g735-7g2w-hh3f
- **Status:** **RESOLVED** in astro 5.18.2 — no longer reported by `npm audit`
  after this phase's non-major fix. Recorded here for traceability against the
  phase baseline.
- **Static-site rationale (why it never affected this deployment):** the bypass
  requires SSR routing / middleware that consults `matchPathname` at runtime.
  This site is `output: static`, zero-JS, with no runtime allowlist — the code
  path is never executed in the deployed artifact.

### 2. GHSA-j687-52p2-xcff — Astro XSS in `define:vars` (incomplete `</script>` sanitization)

- **URL:** https://github.com/advisories/GHSA-j687-52p2-xcff
- **Status:** **ACCEPTED RESIDUAL** — fixed only by Astro 6 (out of scope, D-01).
- **Static-site rationale (not exploitable):** the XSS requires `define:vars`
  populated with dynamic / untrusted input rendered into a `<script>` context.
  This site uses **no `define:vars` with dynamic or untrusted input**; all
  content is authored statically at build time. There is no attacker-controlled
  data path into a script block.

### 3. GHSA-xr5h-phrj-8vxv — Astro server-island encrypted-param replay

- **URL:** https://github.com/advisories/GHSA-xr5h-phrj-8vxv
- **Status:** **ACCEPTED RESIDUAL** — fixed only by Astro 6 (out of scope, D-01).
- **Static-site rationale (not exploitable):** the replay attack targets
  server-island encrypted parameters. This site uses **no server islands**
  (`output: static`, zero runtime server components) — the vulnerable feature
  is never instantiated.

## Acceptance & SEC-01 Justification

Per **SEC-01** (residuals must be motivated + mitigated): the two remaining
moderate `astro` advisories (GHSA-j687-52p2-xcff, GHSA-xr5h-phrj-8vxv) are
**accepted residuals**. They are fixed only by the Astro 6 major upgrade, which
is explicitly **out of scope** for this minor milestone (D-01; `REQUIREMENTS.md`
→ Out of Scope: "no migrazioni di stack maggiori oltre il bump di sicurezza").
Their mitigation is structural: the site's `output: static`, zero-JS, no-SSR,
no-server-islands architecture means none of the vulnerable Astro features are
exercised in the deployed artifact. The architectural premise is documented in
`08-CONTEXT.md` (D-02) and must be preserved.

## Supply-Chain Posture of the Fix

Per the **T-08-SC** trust boundary (npm registry → `package-lock.json` →
GitHub Pages build):

- Fix performed with `npm audit fix` **without `--force`** (no major bumps) +
  `npm update`. No breaking changes introduced.
- **No new direct dependencies** added — `astro` remains the single direct dep,
  caret-ranged (`^5.17.1`), with transitive safety enforced by the lockfile.
- `package-lock.json` (lockfileVersion 3) is committed as the **single source of
  truth**; `withastro/action@v5` reinstalls from it 1:1 at deploy time.
- The lockfile diff is reviewed at a **blocking human-verify checkpoint**
  (Task 3) before it gates the deploy.
- Going forward, `.github/dependabot.yml` monitors `npm` + `github-actions`
  weekly (grouped) to prevent recurrence (D-05, SEC governance).
