# Requirements: toto-castaldi.github.io v2.0

**Defined:** 2026-02-19
**Core Value:** La pagina personale di Toto deve essere visibile e aggiornata su https://toto-castaldi.github.io/ con un stack moderno e manutenibile.

## v2 Requirements

### Dark Mode

- [ ] **DARK-01**: Toggle button switches between light and dark themes
- [ ] **DARK-02**: Dark mode respects prefers-color-scheme system preference as default
- [ ] **DARK-03**: Theme preference persists across page loads via localStorage
- [ ] **DARK-04**: No flash of unstyled content (FOUC) on page load
- [ ] **DARK-05**: Dark theme meets WCAG AA contrast ratios

### Internationalization

- [ ] **I18N-01**: English translation of all content available at /en/ path
- [ ] **I18N-02**: Italian content remains at root / (default locale, no prefix)
- [ ] **I18N-03**: hreflang tags on all pages (including self-references)
- [ ] **I18N-04**: Language switcher link visible on all pages
- [ ] **I18N-05**: OG metadata (title, description) translated per language

### SEO & Metadata

- [ ] **SEO-01**: Schema.org Person JSON-LD structured data in page head
- [ ] **SEO-02**: og:image (1200x630 static PNG) with absolute URL
- [ ] **SEO-03**: Section anchor links (#imprenditoria, #informatica, #fitness, #cnv)

### Performance

- [ ] **PERF-01**: Lighthouse Performance score >= 95
- [ ] **PERF-02**: Lighthouse Accessibility score >= 95
- [ ] **PERF-03**: Lighthouse Best Practices score >= 95
- [ ] **PERF-04**: Lighthouse SEO score >= 95

## Future Requirements

### Enhancements

- **ENH-01**: Print stylesheet (@media print)
- **ENH-02**: Build-time og:image generation with Satori
- **ENH-03**: English anchor IDs on EN page (#entrepreneurship, etc.)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog o pagine aggiuntive | Solo landing page per scope del progetto |
| Contact form | Richiede backend o servizio terzo; mailto sufficiente |
| Newsletter signup | Non applicabile, nessun contenuto a cui iscriversi |
| Analytics / tracking | Esplicitamente escluso da PROJECT.md |
| CMS | Markdown diretto, nessuna gestione contenuti avanzata |
| Custom domain | Resta su github.io |
| Runtime i18n library (i18next) | Incompatible con Astro 5, overkill per contenuto statico |
| Google Rich Results per Person | Person JSON-LD non produce rich results su Google |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DARK-01 | Phase 4 | Pending |
| DARK-02 | Phase 4 | Pending |
| DARK-03 | Phase 4 | Pending |
| DARK-04 | Phase 4 | Pending |
| DARK-05 | Phase 4 | Pending |
| I18N-01 | Phase 3 | Pending |
| I18N-02 | Phase 3 | Pending |
| I18N-03 | Phase 5 | Pending |
| I18N-04 | Phase 5 | Pending |
| I18N-05 | Phase 5 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| PERF-01 | Phase 6 | Pending |
| PERF-02 | Phase 6 | Pending |
| PERF-03 | Phase 6 | Pending |
| PERF-04 | Phase 6 | Pending |

**Coverage:**
- v2 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---
*Requirements defined: 2026-02-19*
*Last updated: 2026-02-19 after roadmap creation*
