# toto-castaldi.github.io — Personal Landing Page

## What This Is

Landing page personale bilingue (IT/EN) di Antonio Castaldi (Toto), costruita con Astro 5 e deployata automaticamente su GitHub Pages tramite GitHub Actions. Design minimale con dark mode, tipografia fluida, structured data SEO, e Lighthouse 100/100/100/100.

## Core Value

La pagina personale di Toto deve essere visibile e aggiornata su https://toto-castaldi.github.io/ con un stack moderno e manutenibile.

## Current Milestone: v3.0 Qualifiche Fitness

**Goal:** Aggiungere una pagina dedicata e multilingua che mostra le qualifiche di Toto come Personal Trainer e istruttore di Pilates, con anteprime dei diplomi, nello stesso stile della home.

**Target features:**
- Pagina dedicata `/qualifiche` (IT) e `/en/qualifications` (EN), linkata dalla sezione Fitness
- 3 qualifiche mostrate come anteprime immagine: Pesistica (Personal Trainer), Pilates Reformer 1, Pilates Cadillac 1
- Conversione PDF → immagine con revisione/oscuramento dei dati personali prima della pubblicazione (nessun PDF scaricabile)
- Stesso layout/stile della home, dark/light mode, i18n IT/EN, hreflang + SEO coerenti (mantenere Lighthouse 100)

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
- ✓ Pagina qualifiche dedicata multilingua (IT/EN) nello stile della home — v3.0 (Phase 7)
- ✓ Anteprime immagine dei 3 diplomi con PII oscurati, nessun PDF scaricabile — v3.0 (Phase 7)
- ✓ Link alla pagina qualifiche dalla sezione Fitness — v3.0 (Phase 7)
- ✓ Lighthouse 100/100/100/100 mantenuto sulle nuove pagine — v3.0 (Phase 7)

### Active

_(none — v3.0 Qualifiche Fitness delivered; awaiting next milestone)_

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
v3.0 adds a dedicated multilingual qualifiche page (/qualifiche, /en/qualifications) with three irreversibly-redacted diploma previews (WebP), a native-<dialog> accessible zoom, reciprocal hreflang, and a link from the Fitness section — Lighthouse 100×4 maintained.

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
| Redazione PII bruciata nei pixel (convert -draw, no blur/CSS) | Oscuramento irreversibile delle firme di terzi + N.39740; nessun PDF pubblicato | ✓ Good — v3.0 |
| Zoom diploma via <dialog> + Invoker Commands (no JS author) | A11y nativa (focus trap, ESC, return-focus) a zero JS; degrada con grazia su browser pre-2025 | ✓ Good — v3.0 |
| alternates prop su Base.astro per hreflang path-aware | Pagine non-home dichiarano hreflang reciproco senza far regredire le home | ✓ Good — v3.0 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-03 — Phase 7 complete; v3.0 Qualifiche Fitness delivered*
