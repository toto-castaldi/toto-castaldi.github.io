# toto-castaldi.github.io — Tech Rebuild

## What This Is

Landing page personale di Antonio Castaldi (Toto), ricostruita con Astro 5 e deployata automaticamente su GitHub Pages tramite GitHub Actions. Design minimale bianco, responsive, con tipografia fluida e zero JavaScript.

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

### Active

(None — start next milestone to define)

### Out of Scope

- Blog o pagine aggiuntive — solo landing page
- Framework JS client-side (React, Vue, etc.) — zero JS di default
- CMS o gestione contenuti avanzata — markdown diretto
- Custom domain — resta su github.io
- Analytics o tracking — non richiesto
- Design complesso o animazioni — resta minimale

## Context

Shipped v1.0 with ~180 LOC (Astro, CSS, config).
Tech stack: Astro 5, GitHub Actions (withastro/action@v5), GitHub Pages.
System font stack, fluid typography with clamp(), 65ch max-width.
All 18 v1 requirements satisfied across 2 phases.

## Constraints

- **Hosting**: GitHub Pages — deploy tramite GitHub Actions, siti statici
- **URL**: deve servire su https://toto-castaldi.github.io/
- **Branch**: master (branch di default)
- **Design**: bianco, minimale, zero JS

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro come SSG | Moderno, zero JS default, ottimo DX, supporto markdown nativo | ✓ Good |
| Rimuovere Jekyll completamente | Dipendenze obsolete e incompatibili, non vale aggiornare | ✓ Good |
| Solo landing, no blog | Semplicità, scope ridotto, velocità di delivery | ✓ Good |
| System font stack | Zero network requests, native appearance on all OS | ✓ Good |
| SVG favicon | Resolution-independent, single file, trivial to modify | ✓ Good |
| ESM import for CSS | Enables Astro CSS processing (minification, hashing) | ✓ Good |
| Omit og:image | v2 enhancement ENH-03, social previews still show text | — Pending |
| withastro/action@v5 | Auto-detects package manager from lockfile, no config needed | ✓ Good |

---
*Last updated: 2026-02-19 after v1.0 milestone*
