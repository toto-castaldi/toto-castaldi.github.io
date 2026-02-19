# toto-castaldi.github.io — Tech Rebuild

## What This Is

Rebuild tecnologico della landing page personale di Antonio Castaldi (Toto), attualmente basata su Jekyll 4.0 con dipendenze obsolete e incompatibili. Il sito viene ricostruito con Astro, mantenendo lo stesso contenuto in markdown e un design minimale bianco con leggero refresh di tipografia e spacing. Il sito viene servito su GitHub Pages tramite GitHub Actions.

## Core Value

La pagina personale di Toto deve essere visibile e aggiornata su https://toto-castaldi.github.io/ con un stack moderno e manutenibile.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Sito costruito con Astro (ultima versione stabile)
- [ ] Deploy automatico su GitHub Pages tramite GitHub Actions
- [ ] Contenuto scritto in markdown, renderizzato da Astro
- [ ] Singola landing page con le sezioni attuali: Imprenditoria, Informatica, Fitness, Comunicazione Non Violenta
- [ ] Design minimale bianco con leggero refresh (tipografia e spacing migliorati)
- [ ] Sito visibile su https://toto-castaldi.github.io/
- [ ] Rimozione completa di Jekyll e dipendenze Ruby

### Out of Scope

- Blog o pagine aggiuntive — solo landing page
- Framework JS client-side (React, Vue, etc.) — zero JS di default
- CMS o gestione contenuti avanzata — markdown diretto
- Custom domain — resta su github.io
- Analytics o tracking — non richiesto
- Design complesso o animazioni — resta minimale

## Context

- Repository esistente: toto-castaldi/toto-castaldi.github.io (branch master)
- Attualmente Jekyll 4.0.0 con tema Minima 2.5, Gemfile.lock incompatibile con Ruby 3.x
- GitHub Pages configurato con GitHub Actions (workflow appena aggiunto ma build fallito per incompatibilità Ruby)
- Contenuto attuale in `index.markdown` con front matter Jekyll
- Layout custom in `_layouts/`, includes in `_includes/`, stili in `_sass/`
- File CNAME vuoto (nessun dominio custom)

## Constraints

- **Hosting**: GitHub Pages — deploy tramite GitHub Actions, siti statici
- **URL**: deve servire su https://toto-castaldi.github.io/
- **Branch**: master (branch di default)
- **Contenuto**: identico all'attuale index.markdown
- **Design**: bianco, minimale, leggero miglioramento tipografico

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro come SSG | Moderno, zero JS default, ottimo DX, supporto markdown nativo | — Pending |
| Rimuovere Jekyll completamente | Dipendenze obsolete e incompatibili, non vale aggiornare | — Pending |
| Contenuto in markdown | Continuità con workflow attuale, facile da editare | — Pending |
| Solo landing, no blog | Semplicità, scope ridotto, velocità di delivery | — Pending |

---
*Last updated: 2026-02-19 after initialization*
