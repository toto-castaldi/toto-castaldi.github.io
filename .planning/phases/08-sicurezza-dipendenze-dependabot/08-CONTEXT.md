# Phase 8: Sicurezza dipendenze (Dependabot) - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Azzerare (o motivare e mitigare) le vulnerabilità delle dipendenze e portare le
dipendenze a versioni supportate **senza** migrazioni di stack maggiori,
mantenendo invariati build, deploy GitHub Pages e Lighthouse 100×4.

Lo scope è la messa in sicurezza in-place: bump controllato entro Astro 5.x +
fix delle dipendenze transitive + governance Dependabot. **Non** include
l'upgrade ad Astro 6 (major) — esplicitamente fuori scope per questa minor
(`REQUIREMENTS.md` → Out of Scope: "Migrazioni di stack maggiori oltre il bump
di sicurezza").

</domain>

<decisions>
## Implementation Decisions

> L'utente ha delegato esplicitamente tutte le decisioni di questa fase
> ("su questi task mi fido di te, scegli tu"). Le scelte sotto sono motivate e
> bloccate per il planning; restano modificabili a discrezione dell'utente.

### Versione Astro (5 vs 6)
- **D-01:** Restare su **Astro 5.x**, aggiornando alla latest patch (≥ 5.18.2).
  L'upgrade ad Astro 6 (`6.4.3`, `isSemVerMajor: true`) è **fuori scope** —
  vincolo già fissato in `REQUIREMENTS.md` (no migrazioni di stack maggiori).
- **D-02:** I **3 advisory moderate su `astro`** (GHSA-g735-7g2w-hh3f remote
  allowlist bypass su `matchPathname`, GHSA-j687-52p2-xcff XSS in `define:vars`,
  GHSA-xr5h-phrj-8vxv server-island replay) si risolvono **solo** con Astro 6.
  Si **accettano come residui documentati**: tutti e tre riguardano
  SSR / server-islands / `define:vars` con input dinamico — feature che questo
  sito **statico, output `static`, zero-JS** non usa → **non sfruttabili** in
  questo deployment. Questo soddisfa SEC-01 (residui motivati + mitigati).

### Dipendenze transitive (i 7 high + moderate fixabili)
- **D-03:** Risolvere `defu`, `devalue`, `h3`, `picomatch`, `postcss`,
  `rollup`, `smol-toml`, `svgo`, `vite` con **`npm audit fix` SENZA `--force`**
  (niente major bump) + `npm update`, rigenerando `package-lock.json`. Tutte
  hanno `fixAvailable` non-major → azzerano i 7 high senza toccare la major di
  Astro.
- **D-04:** **Nessun pin esatto** in `package.json`: resta l'unica dipendenza
  diretta `astro: ^5.x` (caret). Le risoluzioni transitive sicure vengono
  bloccate dal `package-lock.json` committato (lockfileVersion 3).

### Governance Dependabot
- **D-05:** Aggiungere un **`.github/dependabot.yml` minimale** (ecosistemi
  `npm` e `github-actions`, cadenza settimanale, update raggruppati per ridurre
  il rumore di PR). Operativizza il nome stesso della fase, è on-theme con il
  milestone "Manutenzione & Governance" e previene il ripetersi della
  situazione. Basso costo, nessun impatto su build/Lighthouse.

### Residui & de-risk del deploy
- **D-06:** Documentare i 3 residui accettati (D-02) con **GHSA ID + motivazione
  static-site** negli artefatti di fase (VERIFICATION / SUMMARY). Tenerlo
  leggero — **non** un ADR formale (gli ADR sono il dominio della Phase 10).
- **D-07:** **De-risk del deploy** dato il fallimento precedente del bump astro
  (run `25837277597`): poiché NON si fa il major bump, il rischio è ridotto.
  Verificare comunque in **locale** prima del push: `npm ci && npm run build`
  pulito, poi **Lighthouse 100×4** su home IT (`/`), home EN (`/en/`) e
  qualifiche (`/qualifiche`, `/en/qualifications`). Dopo il merge, **confermare
  che il run GitHub Pages completi con successo** (il deploy usa
  `withastro/action@v5`, che reinstalla dal lockfile committato — quindi è il
  `package-lock.json` aggiornato a contare).

### Claude's Discretion
- Ordine esatto dei comandi di fix e se serve un `npm install` intermedio →
  planner/executor.
- Sintassi precisa e raggruppamenti del `dependabot.yml` (es. un solo gruppo
  "all" vs gruppi per ecosistema) → planner, purché minimale e settimanale.
- Strumento/processo esatto per la run Lighthouse locale (riusare quello già in
  uso nelle fasi v2.0/v3.0) → planner.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisiti & scope
- `.planning/REQUIREMENTS.md` §"Sicurezza dipendenze (SEC)" — SEC-01..SEC-04
  (definizione dei requisiti e criteri di accettazione residui).
- `.planning/REQUIREMENTS.md` §"Out of Scope" — vincolo "no migrazioni di stack
  maggiori oltre il bump di sicurezza" (blinda D-01).
- `.planning/ROADMAP.md` §"Phase 8" — Goal e 4 Success Criteria.

### Stato corrente delle dipendenze (al 2026-06-03)
- `package.json` — unica dep diretta: `astro: ^5.17.1`.
- `package-lock.json` (lockfileVersion 3) — astro risolto a `5.17.3`; va
  rigenerato dopo il fix.
- `.github/workflows/deploy.yml` — pipeline Pages (`withastro/action@v5`,
  `actions/checkout@v5`, `actions/deploy-pages@v4`); reinstalla dal lockfile.
- `.github/dependabot.yml` — **non esiste ancora** (da creare, D-05).

### Advisory residui accettati (D-02) — da citare nella documentazione
- https://github.com/advisories/GHSA-g735-7g2w-hh3f — Astro remote allowlist bypass (`matchPathname`).
- https://github.com/advisories/GHSA-j687-52p2-xcff — Astro XSS in `define:vars`.
- https://github.com/advisories/GHSA-xr5h-phrj-8vxv — Astro server-island encrypted-param replay.

### Landmine storica
- GitHub Actions run **`25837277597`** — deploy fallito su un precedente bump
  astro. De-risk in D-07.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Processo Lighthouse delle fasi v2.0 (Phase 6) / v3.0 (Phase 7): riusare lo
  stesso flusso di audit per verificare 100×4 dopo gli aggiornamenti (D-07).
- `withastro/action@v5` nel deploy: auto-rileva il package manager dal lockfile,
  nessuna config aggiuntiva necessaria per il bump.

### Established Patterns
- Stack **statico, output `static`, zero/minimo-JS**: è la premessa che rende
  non-sfruttabili i 3 advisory astro moderate (D-02). Da preservare.
- Dipendenza diretta unica (`astro`) con caret + lockfile committato come fonte
  di verità delle versioni transitive (D-04).

### Integration Points
- `package-lock.json` rigenerato → consumato 1:1 dal workflow Pages al deploy.
- `.github/dependabot.yml` → nuovo file, monitora `npm` (root) + `github-actions`
  (`.github/workflows/`).

</code_context>

<specifics>
## Specific Ideas

- Stato `npm audit` di riferimento al 2026-06-03: **10 vuln (7 high, 3 moderate,
  0 low)**. Il conteggio "22" della ROADMAP è la metrica per-alert di GitHub
  Dependabot; `npm audit` deduplica per pacchetto. Esito atteso post-fix:
  **0 high, 3 moderate residue (solo astro, accettate e documentate)**.
- Ambiente locale verificato: Node v22.20.0, npm 11.6.2.

</specifics>

<deferred>
## Deferred Ideas

- **Upgrade ad Astro 6** (elimina anche i 3 moderate astro) — fuori scope per
  questa minor; valutabile in una milestone major dedicata, con re-verifica
  build + Lighthouse + deploy.
- **Automazione della pipeline di redazione diplomi** — non pertinente a questa
  fase (vedi `REQUIREMENTS.md` → Future Requirements).

</deferred>

---

*Phase: 8-sicurezza-dipendenze-dependabot*
*Context gathered: 2026-06-03*
