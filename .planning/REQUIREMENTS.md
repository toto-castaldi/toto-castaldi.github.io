# Requirements: toto-castaldi.github.io Tech Rebuild

**Defined:** 2026-02-19
**Core Value:** La pagina personale di Toto deve essere visibile e aggiornata su https://toto-castaldi.github.io/ con un stack moderno e manutenibile.

## v1 Requirements

### Infrastructure

- [x] **INFRA-01**: Progetto Astro 5.x inizializzato con `output: 'static'`
- [x] **INFRA-02**: GitHub Actions workflow con `withastro/action@v5` per deploy automatico su push a master
- [x] **INFRA-03**: GitHub Pages source impostato su "GitHub Actions" (non "Deploy from branch")
- [x] **INFRA-04**: `site: 'https://toto-castaldi.github.io'` in `astro.config.mjs` (HTTPS, no `base`)
- [x] **INFRA-05**: Lockfile (`package-lock.json`) committato nel repo
- [x] **INFRA-06**: Rimozione completa di Jekyll (`Gemfile`, `Gemfile.lock`, `_layouts/`, `_includes/`, `_sass/`, `jekyll.yml`)

### Content

- [ ] **CONT-01**: Contenuto markdown delle 4 sezioni (Imprenditoria, Informatica, Fitness, CNV) renderizzato identico all'attuale
- [ ] **CONT-02**: Link email di contatto funzionante (`mailto:toto.castaldi@gmail.com`)
- [ ] **CONT-03**: Link esterni funzionanti (Skillbill, GitHub, toto-castaldi.com) con `target="_blank" rel="noopener noreferrer"`
- [ ] **CONT-04**: Nota "scritto senza AI" mantenuta

### Design

- [ ] **DSGN-01**: Layout responsive (mobile + desktop) con CSS, zero JS
- [ ] **DSGN-02**: Tipografia migliorata (font sizing, line-height, spacing) rispetto a Minima default
- [ ] **DSGN-03**: Design minimale bianco
- [ ] **DSGN-04**: HTML semantico (h1 per nome, h2 per sezioni, section tags)

### SEO/Meta

- [ ] **META-01**: `<title>Antonio Castaldi</title>` e `<meta charset="utf-8">` nel `<head>`
- [ ] **META-02**: Meta viewport per mobile (`<meta name="viewport" content="width=device-width, initial-scale=1">`)
- [ ] **META-03**: Open Graph tags (og:title, og:description, og:type)
- [ ] **META-04**: Favicon (semplice, 32x32 o 48x48)

## v2 Requirements

### Enhancements

- **ENH-01**: Schema.org Person structured data (`<script type="application/ld+json">`)
- **ENH-02**: Section anchor links (`#imprenditoria`, `#informatica`, etc.)
- **ENH-03**: Open Graph og:image (1200x630 static PNG)
- **ENH-04**: Print stylesheet (`@media print`)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog / pagine aggiuntive | Solo landing page per scope del progetto |
| Dark mode toggle | Richiede JS, viola vincolo zero-JS; design = bianco |
| Contact form | Richiede backend o servizio terzo; mailto sufficiente |
| Newsletter signup | Non applicabile, nessun contenuto a cui iscriversi |
| Analytics / tracking | Esplicitamente escluso da PROJECT.md |
| Social media icons | Nessun profilo social nel contenuto attuale |
| Cookie banner | Nessun cookie, nessun tracking = non necessario |
| Multi-language | Contenuto personale in italiano per audience italiana |
| CMS | Markdown diretto, nessuna gestione contenuti avanzata |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| INFRA-05 | Phase 1 | Complete |
| INFRA-06 | Phase 1 | Complete |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| DSGN-01 | Phase 2 | Pending |
| DSGN-02 | Phase 2 | Pending |
| DSGN-03 | Phase 2 | Pending |
| DSGN-04 | Phase 2 | Pending |
| META-01 | Phase 2 | Pending |
| META-02 | Phase 2 | Pending |
| META-03 | Phase 2 | Pending |
| META-04 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-02-19*
*Last updated: 2026-02-19 after Phase 1 completion (INFRA-01 through INFRA-06 complete)*
