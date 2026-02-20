# toto-castaldi.github.io — Personal Landing Page

## What This Is

Landing page personale bilingue (IT/EN) di Antonio Castaldi (Toto), costruita con Astro 5 e deployata automaticamente su GitHub Pages tramite GitHub Actions. Design minimale con dark mode, tipografia fluida, structured data SEO, e Lighthouse 100/100/100/100.

## Core Value

La pagina personale di Toto deve essere visibile e aggiornata su https://toto-castaldi.github.io/ con un stack moderno e manutenibile.

## Requirements

### Validated

- ✓ Sito costruito con Astro (v5.x, output statico) — v1.0
- ✓ Deploy automatico su GitHub Pages tramite GitHub Actions — v1.0
- ✓ Singola landing page con le sezioni: Imprenditoria, Informatica, Fitness, CNV — v1.0
- ✓ Design minimale bianco con tipografia e spacing migliorati — v1.0
- ✓ Sito visibile su https://toto-castaldi.github.io/ — v1.0
- ✓ Rimozione completa di Jekyll e dipendenze Ruby — v1.0
- ✓ HTML semantico, responsive CSS-only, zero JS — v1.0
- ✓ Open Graph metadata e SVG favicon — v1.0
- ✓ Dark mode con toggle e rispetto della preferenza di sistema — v2.0
- ✓ Supporto bilingue IT/EN con pagine separate (/en/) — v2.0
- ✓ Schema.org Person JSON-LD — v2.0
- ✓ Section anchor links (#imprenditoria, #informatica, ecc.) — v2.0
- ✓ og:image per social sharing preview — v2.0
- ✓ hreflang tags su tutte le pagine — v2.0
- ✓ Language switcher link visibile — v2.0
- ✓ OG metadata tradotti per lingua — v2.0
- ✓ Lighthouse Performance >= 95 — v2.0 (achieved 100)
- ✓ Lighthouse Accessibility >= 95 — v2.0 (achieved 100)
- ✓ Lighthouse Best Practices >= 95 — v2.0 (achieved 100)
- ✓ Lighthouse SEO >= 95 — v2.0 (achieved 100)

### Active

(None — planning next milestone)

### Out of Scope

- Blog o pagine aggiuntive — solo landing page
- CMS o gestione contenuti avanzata — markdown diretto
- Custom domain — resta su github.io
- Analytics o tracking — non richiesto
- Design complesso o animazioni — resta minimale
- Contact form — mailto sufficiente
- Runtime i18n library (i18next) — incompatibile con Astro 5, overkill per contenuto statico
- Google Rich Results per Person — Person JSON-LD non produce rich results su Google

## Context

Shipped v2.0 with ~497 LOC (Astro, TypeScript, CSS).
Tech stack: Astro 5, GitHub Actions (withastro/action@v5), GitHub Pages.
System font stack, fluid typography with clamp(), 65ch max-width.
Bilingual IT (/) and EN (/en/) with browser language detection and localStorage persistence.
Dark mode with FOUC prevention, system preference detection, and WCAG AA contrast.
Complete SEO: Person JSON-LD, hreflang, og:image, Twitter Cards, smooth scroll anchors.
Lighthouse scores: 100/100/100/100 on all categories.

## Constraints

- **Hosting**: GitHub Pages — deploy tramite GitHub Actions, siti statici
- **URL**: deve servire su https://toto-castaldi.github.io/
- **Branch**: master (branch di default)
- **Design**: bianco/scuro, minimale
- **JS**: minimo — dark mode toggle, language detection, lang switcher onclick

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro come SSG | Moderno, zero JS default, ottimo DX, supporto markdown nativo | ✓ Good |
| Rimuovere Jekyll completamente | Dipendenze obsolete e incompatibili, non vale aggiornare | ✓ Good |
| Solo landing, no blog | Semplicità, scope ridotto, velocità di delivery | ✓ Good |
| System font stack | Zero network requests, native appearance on all OS | ✓ Good |
| SVG favicon | Resolution-independent, single file, trivial to modify | ✓ Good |
| ESM import for CSS | Enables Astro CSS processing (minification, hashing) | ✓ Good |
| withastro/action@v5 | Auto-detects package manager from lockfile, no config needed | ✓ Good |
| Pagine separate per i18n | SEO-friendly hreflang, Astro built-in support, no JS per content | ✓ Good |
| Toggle JS per dark mode | Relaxa vincolo zero-JS, ma minimo e funzionale | ✓ Good |
| is:inline per FOUC script | Synchronous execution prevents flash, no Astro bundling delay | ✓ Good |
| Static PNG per og:image | Simple Python PIL generation, Satori deferred to future | ✓ Good |
| localStorage per lang preference | Prevents auto-redirect bounce, simple key-value persistence | ✓ Good |
| Descriptive link text over generic | Lighthouse SEO link-text audit compliance, better accessibility | ✓ Good |

---
*Last updated: 2026-02-20 after v2.0 milestone*
