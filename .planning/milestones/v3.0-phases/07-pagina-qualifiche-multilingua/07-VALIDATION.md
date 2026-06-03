---
phase: 7
slug: pagina-qualifiche-multilingua
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-03
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a static Astro content site with **no test framework** (no vitest/jest/playwright). Validation is **build + HTML-output assertions + Lighthouse**, which is the appropriate model for this project. Do NOT install a test framework.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — static site. Validation = `astro build` + built-HTML grep assertions + Lighthouse |
| **Config file** | none — no framework to configure |
| **Quick run command** | `npm run build` (fails on missing i18n keys, broken refs, type errors) |
| **Full suite command** | `npm run build && npm run preview` + Lighthouse audit on both routes (light & dark) |
| **Estimated runtime** | ~10–20 seconds for build; Lighthouse ~30s/route |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (catches missing dictionary keys, bad asset refs, TS errors)
- **After every plan wave:** Run `npm run build` + grep assertions below + `identify public/assets/images/qualifica-*.webp` (confirm dimensions/size)
- **Before `/gsd:verify-work`:** Full `npm run build && npm run preview` green + Lighthouse 100/100/100/100 on BOTH routes in light & dark
- **Max feedback latency:** ~20 seconds (build)

---

## Per-Task Verification Map

| Requirement | Behavior | Test Type | Automated Command | File Exists | Status |
|-------------|----------|-----------|-------------------|-------------|--------|
| QUAL-01 | `/qualifiche` builds & renders | build/smoke | `npm run build && test -f dist/qualifiche/index.html` | ❌ W0 (page) | ⬜ pending |
| QUAL-02 | `/en/qualifications` builds & renders | build/smoke | `test -f dist/en/qualifications/index.html` | ❌ W0 (page) | ⬜ pending |
| QUAL-03 | 3 previews with labels present | grep | `grep -c 'qualifica-' dist/qualifiche/index.html` (≥3 img refs) | ❌ W0 | ⬜ pending |
| QUAL-04 | No original PDF published; redaction burned in | grep + manual | `! find dist public -name '*.pdf'` AND visual confirm redacted WebP | ❌ W0 | ⬜ pending |
| QUAL-05 | Reuses Base/Section + dark mode | build + visual | builds with shared layout; manual dark-mode toggle | ❌ W0 | ⬜ pending |
| QUAL-06 | Descriptive alt-text on each img | grep + manual | `grep -o 'alt="[^"]*"' dist/qualifiche/index.html` non-empty/descriptive | ❌ W0 | ⬜ pending |
| INT-01 | Fitness link reaches page (IT & EN) | grep | `grep 'href="/qualifiche"' dist/index.html` & EN equivalent | ❌ W0 | ⬜ pending |
| INT-02 | All strings from i18n dictionary | build | TS build fails if any key missing in it/en | ✅ (compiler enforces) | ⬜ pending |
| INT-03 | Reciprocal hreflang for new routes | grep assertion | see hreflang reciprocity check below | ❌ W0 | ⬜ pending |
| INT-04 | Lighthouse 100/100/100/100 | audit | Lighthouse on built `/qualifiche` & `/en/qualifications` | ❌ W0 (manual/CLI) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**hreflang reciprocity check (INT-03):**
```bash
# /qualifiche must declare EN alternate = /en/qualifications, and vice-versa
grep 'hreflang="en"' dist/qualifiche/index.html | grep -q 'en/qualifications'
grep 'hreflang="it"' dist/en/qualifications/index.html | grep -q '/qualifiche'
# home pages must STILL point to roots (no regression)
grep 'hreflang="en"' dist/index.html | grep -q 'github.io/en/'
```

---

## Wave 0 Requirements

- [ ] No test framework — do NOT install one (static content site; build + audit is the correct validation model).
- [ ] Establish the grep / `identify` assertion snippets above as the phase verification checklist.
- [ ] (Optional) `@lhci/cli` for automated Lighthouse — only new dependency if chosen; gate behind verification. Default: manual Lighthouse.

*Existing build pipeline covers all phase requirements; only assertion snippets are net-new.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Redaction is irreversible & complete | QUAL-04 / D-01,D-02,D-04 | Visual judgement of opaque rectangles over third-party signatures + N.39740 | Open each redacted WebP; confirm signatures + register number fully covered, "Antonio Castaldi" still visible (D-03) |
| Dark/light visual parity | QUAL-05 | Visual toggle | Toggle theme on both routes; confirm previews + lightbox legible in both |
| Lightbox keyboard a11y | D-07 | Interaction | ESC closes dialog, focus returns to trigger, focus trapped while open |
| Lighthouse 100×4 both routes | INT-04 | Audit runs in browser | Run Lighthouse on `/qualifiche` and `/en/qualifications` in light & dark |

---

## Validation Sign-Off

- [ ] All tasks have a build/grep/manual verification mapped above
- [ ] Sampling continuity: `npm run build` after each task; assertions each wave
- [ ] Wave 0 introduces no test framework (intentional)
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s (build)
- [ ] `nyquist_compliant: true` set in frontmatter once planner maps every task

**Approval:** pending
