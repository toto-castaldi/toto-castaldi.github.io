# Milestones

## v3.0 Qualifiche Fitness (Shipped: 2026-06-03)

**Phases completed:** 1 phases, 3 plans, 9 tasks

**Key accomplishments:**

- Three optimized WebP diploma previews with third-party signatures (Caligaris, Lupattelli) and the register number N.39740 irreversibly burned out, Antonio Castaldi preserved.
- Two multilingual qualifiche pages with three vertically-stacked redacted diploma previews, descriptive alt-text, a native `<dialog>` keyboard-accessible zoom, reciprocal hreflang, and back-home links — Lighthouse 100/100/100/100.

**Stats:** 10 source files changed (+289/−9, Astro/TS/CSS) + 3 redacted WebP assets; 1 day execution
**Git range:** feat(07-02) → docs(phase-07): complete phase execution (PR #22, deployed live)
**Known deferred items at close:** 1 — stale quick-task flag `1-fix-language-selector-overlapping-headin` (work already complete; see STATE.md Deferred Items)

---

## v1.0 Tech Rebuild (Shipped: 2026-02-19)

**Phases completed:** 2 phases, 2 plans, 5 tasks

**Key accomplishments:**

- Replaced broken Jekyll 4.0 site with Astro 5 static site generator
- GitHub Actions CI/CD pipeline deploys automatically on push to master
- Complete responsive landing page with all four Italian content sections migrated
- Fluid typography design system with clamp(), system fonts, 65ch max-width
- SEO-ready with Open Graph metadata, canonical URL, SVG favicon
- Zero client-side JavaScript — pure CSS, static HTML

**Stats:** 58 files changed, ~180 LOC (Astro/CSS), 1 day execution
**Git range:** feat(01-01) → feat(02-01)

---

## v2.0 Enhancement & i18n (Shipped: 2026-02-20)

**Phases completed:** 4 phases, 6 plans, 12 tasks

**Key accomplishments:**

- Bilingual IT/EN landing page with Astro i18n routing, translation dictionary, and browser language detection
- Dark mode with system preference detection, localStorage persistence, FOUC prevention, and WCAG AA contrast
- Complete SEO metadata: Person JSON-LD, hreflang tags, og:image, Twitter Cards, smooth scroll anchor links
- Language switcher with localStorage sync to prevent redirect bounce
- All CSS colors extracted to custom properties for theming
- Lighthouse 100/100/100/100 across Performance, Accessibility, Best Practices, and SEO

**Stats:** 30 files changed, 3,567 insertions, ~497 LOC (Astro/TS/CSS), 1 day execution
**Git range:** feat(03-01) → docs(06-01)

---
