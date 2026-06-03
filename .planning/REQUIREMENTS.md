# Requirements — Milestone v3.1 Manutenzione, Governance & Qualifiche

**Defined:** 2026-06-03
**Goal:** Mettere in sicurezza le dipendenze, formalizzare le decisioni di redazione dei diplomi, ripulire la tracciabilità di pianificazione, ed estendere il pattern qualifiche a nuovi contenuti — mantenendo Lighthouse 100×4 e lo stack statico zero-deps.

## v3.1 Requirements

### Sicurezza dipendenze (SEC)

- [x] **SEC-01**: Le vulnerabilità Dependabot note sono azzerate (high/moderate) o, se irrisolvibili, documentate con motivazione e mitigazione.
- [x] **SEC-02**: Astro e le dipendenze sono aggiornate a versioni supportate e prive di vulnerabilità note, con `npm audit` pulito (o residui giustificati).
- [x] **SEC-03**: Dopo gli aggiornamenti il sito builda e il deploy GitHub Pages va a buon fine.
- [x] **SEC-04**: Lighthouse 100/100/100/100 è mantenuto dopo gli aggiornamenti delle dipendenze.

### Igiene tracciabilità planning (GOV)

- [ ] **GOV-01**: I checkbox dei requisiti completati (es. Phase 7) riflettono lo stato verificato — nessuna divergenza tra VERIFICATION e stato meccanico.
- [ ] **GOV-02**: Il falso positivo "stale artifact" sul quick task v2.0 è riconciliato e documentato.
- [ ] **GOV-03**: Esiste un controllo di chiusura che conferma la coerenza verifica↔checkbox↔artefatti prima di `complete-milestone`.

### ADR / decisione redazione diplomi (DOC)

- [ ] **DOC-01**: Esiste un ADR/decisione che documenta i criteri di redazione PII dei diplomi (cosa si redige: firme di terzi, numeri di registro; cosa si rivela).
- [ ] **DOC-02**: L'ADR registra la scelta di rivelare il docente del Reformer senza firma e le modifiche grafiche ad-hoc del 2026-06-03 (commit `f01d1a8`, `cf8ff08`).
- [ ] **DOC-03**: Il pattern "redazione PII pixel-burned, nessun PDF sorgente nel repo" è documentato come riferimento riusabile.

### Estensione pattern qualifiche (QUAL)

- [ ] **QUAL-01**: Le anteprime/zoom dei diplomi sono fattorizzate in un componente riusabile e data-driven, così che aggiungere una qualifica sia una voce di dati.
- [ ] **QUAL-02**: Aggiungere un nuovo diploma/qualifica è documentato come procedura ripetibile (redazione → WebP → voce dati) mantenendo Lighthouse 100×4 e hreflang reciproci.

## Future Requirements (deferred)

- Aggiunta di diplomi/qualifiche concreti nuovi (oltre i 3 attuali) — quando disponibili i certificati.
- Automazione della pipeline di redazione (script riproducibile) — solo se il volume cresce.

## Out of Scope

- Pubblicazione di PDF scaricabili dei diplomi — confermato escluso (redazione irreversibile, nessun sorgente nel repo).
- Riscrittura del design o nuove sezioni della landing — resta minimale.
- Custom domain, analytics, CMS — invariati rispetto ai vincoli di progetto.
- Migrazioni di stack maggiori (oltre il bump di sicurezza) — fuori scope per una minor.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 | Phase 8 | Complete (08-01) |
| SEC-02 | Phase 8 | Complete (08-01) |
| SEC-03 | Phase 8 | Complete (08-02) |
| SEC-04 | Phase 8 | Complete (08-02) |
| GOV-01 | Phase 9 | Pending |
| GOV-02 | Phase 9 | Pending |
| GOV-03 | Phase 9 | Pending |
| DOC-01 | Phase 10 | Pending |
| DOC-02 | Phase 10 | Pending |
| DOC-03 | Phase 10 | Pending |
| QUAL-01 | Phase 11 | Pending |
| QUAL-02 | Phase 11 | Pending |

**Coverage:** 12/12 v3.1 REQ-IDs mapped (SEC×4, GOV×3, DOC×3, QUAL×2) — no orphans, no duplicates.
