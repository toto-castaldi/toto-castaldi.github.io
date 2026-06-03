---
phase: 07-pagina-qualifiche-multilingua
plan: 02
subsystem: i18n-layout-foundation
tags: [astro, i18n, hreflang, seo, set:html]
requires:
  - "Base.astro Props + hreflang derivation (existing)"
  - "i18n dictionary ui.ts (existing, symmetric it/en)"
provides:
  - "Base.astro optional alternates?: { it: string; en: string } prop driving path-aware hreflang/canonical + language switcher"
  - "qualifiche.* dictionary keys (IT + EN) consumed by Plan 03"
  - "Internal /qualifiche and /en/qualifications links live from the Fitness section (INT-01)"
affects:
  - "src/pages/qualifiche.astro (Plan 03 — consumes alternates prop + qualifiche.* keys)"
  - "src/pages/en/qualifications.astro (Plan 03)"
tech-stack:
  added: []
  patterns:
    - "Path-aware hreflang via optional alternates prop, defaulting to locale roots (no home regression)"
    - "Internal-link embedding inside i18n strings rendered with set:html (no target=_blank for same-site nav)"
key-files:
  created: []
  modified:
    - src/layouts/Base.astro
    - src/i18n/ui.ts
    - src/pages/index.astro
    - src/pages/en/index.astro
decisions:
  - "alternates defaults '/' and '/en/' reproduce getAbsoluteLocaleUrl('it'|'en','') output exactly (prefixDefaultLocale:false, no base) — home pages stay byte-identical"
  - "Language switcher reads alternates when present (points to the counterpart page), else keeps getRelativeLocaleUrl root behavior"
metrics:
  duration: ~3 min
  completed: 2026-06-03
---

# Phase 07 Plan 02: i18n + Layout Foundation Summary

Made `Base.astro` path-aware for hreflang/canonical via an optional `alternates` prop (defaulting to locale roots so the home pages do not regress), added all `qualifiche.*` i18n keys in both IT and EN, and linkified the Fitness paragraph so both home pages link into the qualifiche page via `set:html`.

## What Was Built

### Task 1 — Base.astro path-aware via optional `alternates` prop (commit 7817d0e)
- Extended `Props` with `alternates?: { it: string; en: string }` and destructured it from `Astro.props`.
- Replaced hardcoded `getAbsoluteLocaleUrl('it'|'en','')` with `new URL(alternates?.it ?? '/', Astro.site).toString()` and `new URL(alternates?.en ?? '/en/', Astro.site).toString()`. Defaults reproduce the prior locale-root output exactly (config has `prefixDefaultLocale: false` and no `base`).
- Language switcher `alternateUrl` now points to the counterpart page when `alternates` is set (`alternateLang === 'en' ? alternates.en : alternates.it`); falls back to `getRelativeLocaleUrl(alternateLang, '')` when absent.
- `x-default` follows `itUrl` (path-aware automatically). Canonical line untouched (already per-page correct via `Astro.url.pathname`).
- Removed the now-unused `getAbsoluteLocaleUrl` import; kept `getRelativeLocaleUrl` (still used for the no-alternates fallback).
- Verified: home-page `dist/index.html` hreflang still `https://toto-castaldi.github.io/` (it/x-default) and `.../en/` (en) — no regression (T-07-05 mitigated).

### Task 2 — qualifiche.* dictionary keys + linkified Fitness paragraph (commit 9999ba9)
- Added all `qualifiche.*` keys to BOTH `it` and `en` blocks (build-time TS symmetry guardrail satisfied — INT-02).
- Linkified `section.fitness.p2` with an internal anchor (no `target="_blank"`): IT `<a href="/qualifiche">…</a>`, EN `<a href="/en/qualifications">…</a>`.

### Task 3 — Render Fitness p2 via set:html on both home pages (commit 4e82a89)
- Changed `<p>{t('section.fitness.p2')}</p>` → `<p set:html={t('section.fitness.p2')} />` in `src/pages/index.astro` and `src/pages/en/index.astro` (mirrors existing `set:html` on entrepreneurship.p1 / cs.p2). `section.fitness.p1` left as plain text.
- Verified: `dist/index.html` contains `href="/qualifiche"` and `dist/en/index.html` contains `href="/en/qualifications"` (INT-01 link live).

## Interface Contract for Plan 03

### `alternates` prop shape (Base.astro)
```ts
alternates?: { it: string; en: string }
```
Plan 03 should pass absolute-path strings, e.g. `<Base ... alternates={{ it: '/qualifiche/', en: '/en/qualifications/' }}>`. Each value is fed to `new URL(value, Astro.site)`, so leading-slash absolute paths are expected.

### Final list of qualifiche.* keys (present in both it and en)
- `qualifiche.title` — IT "Qualifiche" / EN "Qualifications"
- `qualifiche.description` — SEO meta description per locale
- `qualifiche.intro` — D-14 intro line
- `qualifiche.back` — IT "← Torna alla home" / EN "← Back to home" (D-13)
- `qualifiche.pesistica.label` — IT "Personal Trainer" / EN "Certified Fitness Trainer" (D-09)
- `qualifiche.pesistica.body` — "MSP Italia — 05/12/2025" (D-11)
- `qualifiche.reformer.label` — IT "Pilates Reformer Liv.1" / EN "Pilates Reformer Level 1" (D-10)
- `qualifiche.reformer.body` — "Zen Studio Pilates — 16/11/2025"
- `qualifiche.cadillac.label` — IT "Pilates Cadillac Liv.1" / EN "Pilates Cadillac Level 1"
- `qualifiche.cadillac.body` — "Zen Studio Pilates — 21/02/2026"
- `qualifiche.alt.pesistica` / `qualifiche.alt.reformer` / `qualifiche.alt.cadillac` — descriptive WCAG-AA alt text (QUAL-06)
- `qualifiche.zoom.pesistica` / `qualifiche.zoom.reformer` / `qualifiche.zoom.cadillac` — IT "Ingrandisci il diploma …" / EN "Enlarge the … diploma"
- `qualifiche.close` — IT "Chiudi" / EN "Close"

## Deviations from Plan

None — plan executed exactly as written.

## Authentication Gates

None.

## Known Stubs

None. The `qualifiche.zoom.*` and `qualifiche.close` keys are intentionally added ahead of use — Plan 03 wires them into the diploma zoom dialog (documented as a forward dependency, not a stub).

## Requirements Satisfied

- INT-01 — Fitness-section link into the qualifiche page (live in both built home pages).
- INT-02 — All new strings via the dictionary, IT/EN symmetric (TS build guardrail green).
- INT-03 — Path-aware hreflang foundation ready for the new routes; home-page hreflang unchanged (no regression).

## Self-Check: PASSED
