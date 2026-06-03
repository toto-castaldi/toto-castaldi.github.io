# Requirements — Milestone v3.0 Qualifiche Fitness

Scope: pagina dedicata e multilingua che mostra le qualifiche di Toto come Personal Trainer e istruttore di Pilates, con anteprime dei diplomi, nello stile della home.

## v3.0 Requirements

### Pagina Qualifiche (QUAL)

- [ ] **QUAL-01**: L'utente può visualizzare una pagina qualifiche dedicata in italiano alla rotta `/qualifiche`
- [ ] **QUAL-02**: L'utente può visualizzare la stessa pagina in inglese alla rotta `/en/qualifications`
- [ ] **QUAL-03**: L'utente vede le tre qualifiche — Pesistica (Personal Trainer), Pilates Reformer 1, Pilates Cadillac 1 — ciascuna con un'anteprima immagine e un titolo/etichetta
- [ ] **QUAL-04**: Le anteprime mostrano i diplomi con i dati personali sensibili oscurati prima della pubblicazione; il PDF originale integrale non è scaricabile né pubblicato
- [ ] **QUAL-05**: La pagina riusa il layout e lo stile della home (`Base.astro`, `Section.astro`, tipografia fluida) e supporta dark/light mode
- [ ] **QUAL-06**: Ogni anteprima ha un alt-text descrittivo (conformità WCAG AA / audit accessibilità)

### Integrazione & Qualità (INT)

- [ ] **INT-01**: L'utente può raggiungere la pagina qualifiche tramite un link dalla sezione Fitness della home (sia IT che EN)
- [ ] **INT-02**: Tutti i testi della nuova pagina sono gestiti via dizionario i18n (`src/i18n/ui.ts`) con versioni IT ed EN
- [ ] **INT-03**: La pagina ha metadati SEO corretti e tag hreflang reciproci tra IT ed EN, coerenti con il resto del sito
- [ ] **INT-04**: Le score Lighthouse restano 100/100/100/100 (Performance, Accessibility, Best Practices, SEO) sulle nuove pagine

## Future Requirements

- Aggiunta di ulteriori qualifiche/certificazioni future man mano che vengono conseguite
- Eventuale link diretto alle credenziali verificabili online (se gli enti le forniscono)

## Out of Scope

- PDF originali scaricabili — esclusi per privacy (solo anteprime con PII oscurati)
- Verifica/validazione automatica delle credenziali — fuori scope
- Sistema di gestione contenuti per le qualifiche — markdown/asset diretti, come il resto del sito
- Animazioni o gallerie complesse — resta minimale, coerente con il design del sito

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| QUAL-01 | — | Pending |
| QUAL-02 | — | Pending |
| QUAL-03 | — | Pending |
| QUAL-04 | — | Pending |
| QUAL-05 | — | Pending |
| QUAL-06 | — | Pending |
| INT-01 | — | Pending |
| INT-02 | — | Pending |
| INT-03 | — | Pending |
| INT-04 | — | Pending |
