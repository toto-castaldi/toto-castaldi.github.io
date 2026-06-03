# Roadmap: toto-castaldi.github.io

## Milestones

- ✅ **v1.0 Tech Rebuild** — Phases 1-2 (shipped 2026-02-19)
- ✅ **v2.0 Enhancement & i18n** — Phases 3-6 (shipped 2026-02-20)
- 🚧 **v3.0 Qualifiche Fitness** — Phase 7 (in progress)

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

### v3.0 Qualifiche Fitness

- [ ] **Phase 7: Pagina Qualifiche Multilingua** - Pagina dedicata IT/EN con anteprime redatte dei 3 diplomi, linkata dalla sezione Fitness, SEO e Lighthouse 100 mantenuti

## Phase Details

### Phase 7: Pagina Qualifiche Multilingua

**Goal**: L'utente può visitare una pagina dedicata, nello stile della home, che mostra le tre qualifiche fitness di Toto come anteprime immagine con i dati personali oscurati, in italiano e in inglese, raggiungibile dalla sezione Fitness.
**Depends on**: Phase 6 (build i18n, dark mode, SEO già consolidati)
**Requirements**: QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06, INT-01, INT-02, INT-03, INT-04
**Success Criteria** (what must be TRUE):

  1. L'utente visita `/qualifiche` (IT) e `/en/qualifications` (EN) e vede le tre qualifiche — Pesistica (Personal Trainer), Pilates Reformer 1, Pilates Cadillac 1 — ciascuna con anteprima immagine, titolo/etichetta e alt-text descrittivo.
  2. Le anteprime mostrano i diplomi con i dati personali sensibili oscurati; nessun PDF originale è scaricabile o pubblicato sul sito.
  3. La pagina riusa `Base.astro` e `Section.astro`, supporta dark/light mode e usa tutti i testi dal dizionario i18n (`src/i18n/ui.ts`) con versioni IT ed EN.
  4. Dalla sezione Fitness della home (IT ed EN) l'utente può cliccare un link che porta alla rispettiva pagina qualifiche nella stessa lingua.
  5. Le due pagine hanno metadati SEO corretti e tag hreflang reciproci IT↔EN, e mantengono Lighthouse 100/100/100/100.

**Plans**: 3 plans

Plans:
**Wave 1**

- [ ] 07-01-PLAN.md — Pipeline di redazione PDF→WebP: anteprime dei 3 diplomi con PII di terzi oscurati a livello di pixel (QUAL-04)
- [ ] 07-02-PLAN.md — Fondamenta condivise: Base.astro path-aware (hreflang), chiavi i18n qualifiche.*, link nella sezione Fitness (INT-01/02/03)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 07-03-PLAN.md — Le due pagine /qualifiche e /en/qualifications: anteprime, zoom accessibile, hreflang reciproci, Lighthouse 100 (QUAL-01/02/03/05/06, INT-04)

**UI hint**: yes

**Implementation notes** (per plan-phase):

- I PDF sorgente vivono FUORI dal repo: `~/Documents/pt/diploma-pesistica-toto.pdf`, `~/Documents/pilates/diploma-toto-pilates-reformer-1.pdf`, `~/Documents/pilates/diploma-toto-pilates-cadillac-1.pdf`. Vanno convertiti in immagini redatte (PII oscurati) e collocati sotto `public/` durante l'esecuzione.
- `Base.astro` attualmente hardcoda hreflang verso la root (`getAbsoluteLocaleUrl('it','')`) e il Person JSON-LD: hreflang e canonical devono diventare consapevoli del path per la nuova pagina (altrimenti INT-03 fallisce). Valutare se parametrizzare `Base.astro` o gestire gli alternate a livello di pagina.
- Mantenere zero/minimo JS e ottimizzare le immagini (peso/dimensioni) per non degradare il punteggio Performance.

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Scaffold e CI/CD | v1.0 | 1/1 | Complete | 2026-02-19 |
| 2. Contenuto, Design e Metadata | v1.0 | 1/1 | Complete | 2026-02-19 |
| 3. Foundation & i18n Content | v2.0 | 2/2 | Complete | 2026-02-20 |
| 4. Dark Mode | v2.0 | 1/1 | Complete | 2026-02-20 |
| 5. SEO & Metadata | v2.0 | 2/2 | Complete | 2026-02-20 |
| 6. Lighthouse Audit | v2.0 | 1/1 | Complete | 2026-02-20 |
| 7. Pagina Qualifiche Multilingua | v3.0 | 0/3 | Not started | - |
