# Roadmap: toto-castaldi.github.io

## Milestones

- ✅ **v1.0 Tech Rebuild** — Phases 1-2 (shipped 2026-02-19)
- ✅ **v2.0 Enhancement & i18n** — Phases 3-6 (shipped 2026-02-20)
- ✅ **v3.0 Qualifiche Fitness** — Phase 7 (shipped 2026-06-03)

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

## Backlog

*Unsequenced ideas captured for the next milestone. Promote with `/gsd:review-backlog`.*

### Phase 999.1: Risolvere vulnerabilità Dependabot e bump dipendenze (BACKLOG)

**Goal:** [Captured for future planning] — Azzerare/ridurre le 22 vulnerabilità Dependabot (8 high, 10 moderate, 4 low) segnalate a ogni push.
**Requirements:** TBD
**Plans:** 0 plans

Context:
- 22 vulnerabilità Dependabot riportate dal remote a ogni push (8 high, 10 moderate, 4 low).
- La retrospettiva v2.0 segnala un aggiornamento Dependabot di **astro fallito** (run `25837277597`).
- Azione: `npm audit` + bump controllato di Astro e dipendenze, verificando che build e Lighthouse 100×4 reggano.

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)

### Phase 999.2: ADR/decisione redazione diplomi (PII pixel-burned) (BACKLOG)

**Goal:** [Captured for future planning] — Formalizzare come ADR le decisioni di redazione sui diplomi fatte ad-hoc il 2026-06-03.
**Requirements:** TBD
**Plans:** 0 plans

Context:
- Modifiche ad-hoc non tracciate (2026-06-03):
  - **Reformer** (`qualifica-pilates-reformer.webp`): mostra il blocco docente "Cristian Campana / DOCENTE" **senza firma** — collage dal diploma Cadillac, riquadro nero rimosso (commit `f01d1a8`).
  - **Pesistica** (`qualifica-pesistica.webp`): due rettangoli neri firme resi **identici**, coprono solo le firme lasciando visibili i nomi (Alessandra Caligaris, Prof. Gian Francesco Lupattelli); numero diploma N.39740 resta redatto (commit `cf8ff08`).
- Da coerenziare col pattern v3.0 "redazione PII pixel-burned, nessun PDF sorgente nel repo".
- Decidere/documentare i criteri: cosa si redige (firme, numeri registro) vs cosa si rivela (docente senza firma).

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)

### Phase 999.3: Igiene tracciabilità requirements/artifact (BACKLOG)

**Goal:** [Captured for future planning] — Riconciliare divergenze tra verifica e stato meccanico prima della prossima `complete-milestone`.
**Requirements:** TBD
**Plans:** 0 plans

Context:
- I 10 checkbox di REQUIREMENTS.md (Phase 7) rimasti `[ ]` nonostante VERIFICATION.md 10/10.
- Falso positivo "stale artifact" su un quick task v2.0 nell'audit di chiusura milestone.
- Obiettivo: evitare rumore/riconciliazione manuale alla prossima chiusura.

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)

### Phase 999.4: Estendere pattern qualifiche a nuovi contenuti/diplomi (BACKLOG)

**Goal:** [Captured for future planning] — Riusare il pattern multilingua/SEO + `<dialog>` zoom + redazione per nuovi contenuti.
**Requirements:** TBD
**Plans:** 0 plans

Context:
- v3.0 ha stabilito: pagine IT/EN path-aware (`alternates` prop), anteprime WebP redatte, zoom `<dialog>` zero-JS, hreflang reciproci, Lighthouse 100×4.
- Estendere a nuove qualifiche/diplomi (es. nuovi diplomi Pilates) riusando il template.

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)
