# Roadmap: toto-castaldi.github.io

## Milestones

- ✅ **v1.0 Tech Rebuild** — Phases 1-2 (shipped 2026-02-19)
- ✅ **v2.0 Enhancement & i18n** — Phases 3-6 (shipped 2026-02-20)
- ✅ **v3.0 Qualifiche Fitness** — Phase 7 (shipped 2026-06-03)
- 🚧 **v3.1 Manutenzione, Governance & Qualifiche** — Phases 8-11 (planning 2026-06-03)

## Phases

<details>
<summary>✅ v1.0 Tech Rebuild (Phases 1-2) — SHIPPED 2026-02-19</summary>

- [x] Phase 1: Scaffold e CI/CD (1/1 plans) — completed 2026-02-19
- [x] Phase 2: Contenuto, Design e Metadata (1/1 plans) — completed 2026-02-19

</details>

<details>
<summary>✅ v2.0 Enhancement & i18n (Phases 3-6) — SHIPPED 2026-02-20</summary>

- [x] Phase 3: Foundation & i18n Content (2/2 plans) — completed 2026-02-20
- [x] Phase 4: Dark Mode (1/1 plans) — completed 2026-02-20
- [x] Phase 5: SEO & Metadata (2/2 plans) — completed 2026-02-20
- [x] Phase 6: Lighthouse Audit (1/1 plans) — completed 2026-02-20

</details>

<details>
<summary>✅ v3.0 Qualifiche Fitness (Phase 7) — SHIPPED 2026-06-03</summary>

- [x] Phase 7: Pagina Qualifiche Multilingua (3/3 plans) — completed 2026-06-03

Pagina dedicata IT/EN (`/qualifiche`, `/en/qualifications`) con anteprime redatte dei 3 diplomi (PII oscurati a livello pixel), zoom accessibile via `<dialog>`, hreflang reciproci, link dalla sezione Fitness, SEO e Lighthouse 100 mantenuti. Verificata 10/10 e deployata live (PR #22). Full detail: `milestones/v3.0-ROADMAP.md`.

</details>

### 🚧 v3.1 Manutenzione, Governance & Qualifiche (Phases 8-11)

- [ ] **Phase 8: Sicurezza dipendenze (Dependabot)** — Azzerare/ridurre le vuln Dependabot e bump controllato di Astro/dipendenze mantenendo build, deploy e Lighthouse 100×4.
- [ ] **Phase 9: Igiene tracciabilità planning** — Riconciliare checkbox↔verifica, sistemare il falso positivo "stale artifact" v2.0 e introdurre un gate di coerenza pre-chiusura.
- [ ] **Phase 10: ADR / decisione redazione diplomi PII** — Formalizzare in un ADR i criteri di redazione PII dei diplomi e registrare le modifiche ad-hoc del 2026-06-03.
- [ ] **Phase 11: Estendere pattern qualifiche / nuovi diplomi** — Fattorizzare anteprime+zoom in un componente data-driven e documentare la procedura per aggiungere un diploma.

## Phase Details

### Phase 8: Sicurezza dipendenze (Dependabot)
**Goal**: Azzerare (o motivare e mitigare) le vulnerabilità Dependabot e aggiornare Astro e le altre dipendenze a versioni supportate, mantenendo invariati build, deploy GitHub Pages e Lighthouse 100×4.
**Depends on**: Nothing (prima fase v3.1 — la sicurezza viene per prima)
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04
**Success Criteria** (what must be TRUE):
  1. Le 22 vulnerabilità Dependabot (8 high, 10 moderate, 4 low) sono azzerate per high/moderate; eventuali residui irrisolvibili sono elencati con motivazione e mitigazione.
  2. `npm audit` è pulito (o i residui sono giustificati esplicitamente) e Astro + dipendenze sono su versioni supportate senza vuln note.
  3. Dopo gli aggiornamenti il sito builda in locale e il workflow GitHub Pages completa il deploy con successo (superando il precedente fallimento del bump astro, run 25837277597).
  4. Lighthouse riporta 100/100/100/100 su home (IT/EN) e qualifiche dopo gli aggiornamenti.
**Plans**: 2 plans
  - [ ] 08-01-PLAN.md — Fix fixable vulns (npm audit fix + npm update), document 3 accepted astro moderate residuals, add minimal Dependabot config
  - [ ] 08-02-PLAN.md — De-risk deploy: clean npm ci + build, Lighthouse 100×4, confirm GitHub Pages deploy success

### Phase 9: Igiene tracciabilità planning
**Goal**: Riconciliare lo stato meccanico dei checkbox con lo stato verificato, chiarire e documentare il falso positivo "stale artifact" del quick task v2.0, e stabilire un controllo di coerenza riproducibile prima della chiusura milestone. (Sola pianificazione/docs — nessun codice applicativo.)
**Depends on**: Nothing (indipendente)
**Requirements**: GOV-01, GOV-02, GOV-03
**Success Criteria** (what must be TRUE):
  1. I checkbox dei requisiti completati (es. Phase 7) coincidono con lo stato in VERIFICATION — nessuna divergenza tra stato verificato e stato meccanico.
  2. Il falso positivo "stale artifact" sul quick task v2.0 (`1-fix-language-selector-overlapping-headin`) è riconciliato e la sua spiegazione è documentata in modo permanente.
  3. Esiste un gate di chiusura documentato che, prima di `complete-milestone`, conferma la coerenza verifica↔checkbox↔artefatti.
  4. Eseguire il gate sullo stato corrente del planning produce zero divergenze residue (baseline pulita).
**Plans**: TBD

### Phase 10: ADR / decisione redazione diplomi PII
**Goal**: Formalizzare in un ADR i criteri di redazione PII dei diplomi e registrare retroattivamente le scelte e le modifiche grafiche ad-hoc già applicate, così che la policy sia un riferimento riusabile e non conoscenza implicita.
**Depends on**: Nothing (indipendente)
**Requirements**: DOC-01, DOC-02, DOC-03
**Success Criteria** (what must be TRUE):
  1. Esiste un ADR che documenta cosa si redige (firme di terzi, numeri di registro) e cosa si rivela nei diplomi.
  2. L'ADR registra la scelta di rivelare il docente del Reformer senza firma e le modifiche grafiche ad-hoc del 2026-06-03 (commit `f01d1a8`, `cf8ff08`).
  3. Il pattern "redazione PII pixel-burned, nessun PDF sorgente nel repo" è descritto come riferimento riusabile per i diplomi futuri.
  4. L'ADR è linkato/registrato nel decision log del progetto così da essere scopribile durante il planning successivo.
**Plans**: TBD

### Phase 11: Estendere pattern qualifiche / nuovi diplomi
**Goal**: Fattorizzare le anteprime e lo zoom dei diplomi in un componente riusabile e data-driven, così che aggiungere una qualifica sia una voce di dati, e documentare la procedura end-to-end per aggiungere un nuovo diploma mantenendo Lighthouse 100×4 e hreflang reciproci.
**Depends on**: Phase 10 (i criteri di redazione formalizzati nell'ADR sono prerequisito della procedura "aggiungi diploma")
**Requirements**: QUAL-01, QUAL-02
**Success Criteria** (what must be TRUE):
  1. Anteprime + zoom `<dialog>` dei diplomi sono fattorizzate in un singolo componente riusabile guidato da dati; le 3 qualifiche esistenti sono renderizzate da voci dati senza regressioni visive.
  2. Aggiungere una qualifica si riduce a una voce di dati (immagine WebP redatta + metadati IT/EN), senza duplicare markup.
  3. Esiste una procedura documentata e ripetibile per aggiungere un nuovo diploma (redazione PII → WebP → voce dati), conforme all'ADR di Phase 10.
  4. Le pagine qualifiche mantengono Lighthouse 100×4 e hreflang reciproci IT/EN dopo il refactor.
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Scaffold e CI/CD | v1.0 | 1/1 | Complete | 2026-02-19 |
| 2. Contenuto, Design e Metadata | v1.0 | 1/1 | Complete | 2026-02-19 |
| 3. Foundation & i18n Content | v2.0 | 2/2 | Complete | 2026-02-20 |
| 4. Dark Mode | v2.0 | 1/1 | Complete | 2026-02-20 |
| 5. SEO & Metadata | v2.0 | 2/2 | Complete | 2026-02-20 |
| 6. Lighthouse Audit | v2.0 | 1/1 | Complete | 2026-02-20 |
| 7. Pagina Qualifiche Multilingua | v3.0 | 3/3 | Complete | 2026-06-03 |
| 8. Sicurezza dipendenze (Dependabot) | v3.1 | 0/2 | Planned | - |
| 9. Igiene tracciabilità planning | v3.1 | 0/? | Not started | - |
| 10. ADR / redazione diplomi PII | v3.1 | 0/? | Not started | - |
| 11. Estendere pattern qualifiche | v3.1 | 0/? | Not started | - |
