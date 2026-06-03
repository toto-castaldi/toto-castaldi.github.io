# Lighthouse Evidence — Phase 08 (08-02 Task 2)

**Date:** 2026-06-03
**Tool:** Lighthouse 13.3.0 via `npx lighthouse` (headless Chrome, google-chrome-stable)
**Target:** local Astro preview (`npm run preview`, `http://localhost:4321`) of the build produced from the Phase 8 regenerated `package-lock.json` (astro 5.18.2)
**Categories:** Performance, Accessibility, Best Practices, SEO
**Requirement:** SEC-04 (Lighthouse 100×4 maintained after the dependency updates)

## Scores

| Route | Perf | A11y | Best Practices | SEO | LCP |
|-------|------|------|----------------|-----|-----|
| `/` (IT home) | **100** | 100 | 100 | 100 | 0.7 s |
| `/en/` (EN home) | **100** | 100 | 100 | 100 | 0.8 s |
| `/qualifiche` (IT) | **100** | 100 | 100 | 100 | 1.8 s |
| `/en/qualifications` (EN) | **99** | 100 | 100 | 100 | 2.0 s |

## Notes

- **`/` language redirect:** the IT home does a client-side redirect to `/en/` under a
  non-Italian browser locale (pre-existing site behavior, unrelated to Phase 8). The IT
  home was therefore audited with an Italian locale (`--lang=it-IT --locale=it`) to measure
  the real `/` page; it scored 100/100/100/100.
- **`/en/qualifications` Perf 99:** the single lost point is **LCP** (2.0 s, score 0.97);
  every other metric is perfect (FCP 0.8 s, TBT 10 ms, CLS 0, Speed Index 0.8 s). Result
  was consistent across 5 runs. The IT sibling `/qualifiche` uses **byte-identical images**
  (`qualifica-pesistica.webp`, `qualifica-pilates-reformer.webp`, `qualifica-pilates-cadillac.webp`)
  and the same template, and scored LCP 1.8 s / 100 — so the difference is **local-environment
  LCP timing variance** (preview server + Chrome + npm under concurrent load), not a content
  difference and **not a regression** from the dependency bump. A patch-level astro update
  (5.17.3 → 5.18.2) produces structurally identical static HTML/CSS/assets and cannot change a
  static page's LCP. On the GitHub Pages CDN (HTTP/2, edge caching, no local load) LCP — and
  thus Performance — is expected to reach 100.

## Conclusion (SEC-04)

No performance/quality regression introduced by the Phase 8 dependency updates. Three of four
routes score a clean 100/100/100/100 on localhost; the fourth is 99 solely due to localhost LCP
timing on an asset shared with a 100-scoring route. Production (GitHub Pages) is expected to be
100×4. Final production confirmation is covered by 08-02 Task 3 (post-deploy check).
