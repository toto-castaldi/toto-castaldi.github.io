# Phase 8: Sicurezza dipendenze (Dependabot) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 8-sicurezza-dipendenze-dependabot
**Areas discussed:** Astro 5 vs 6, Vuln transitive, Dependabot config, Residui & deploy

---

> **Nota:** l'utente ha delegato esplicitamente tutte le decisioni
> ("su questi task mi fido di te, scegli tu"). Tutte le scelte sono state prese
> da Claude e motivate; le alternative considerate sono registrate sotto.

## Astro 5 vs 6

| Option | Description | Selected |
|--------|-------------|----------|
| Restare su Astro 5.x + accettare i 3 moderate | Bump a 5.18.2; i 3 advisory astro riguardano SSR/server-islands/define:vars, non usati dal sito statico → non sfruttabili, documentati come residui | ✓ |
| Upgrade ad Astro 6.4.3 | Elimina i 3 moderate ma è un major breaking; rischio deploy/Lighthouse | |

**User's choice:** Delegata a Claude → Restare su Astro 5.x.
**Notes:** Vincolo decisivo già presente in `REQUIREMENTS.md` → Out of Scope: "Migrazioni di stack maggiori oltre il bump di sicurezza — fuori scope per una minor". L'upgrade ad Astro 6 è quindi escluso a monte.

---

## Vuln transitive

| Option | Description | Selected |
|--------|-------------|----------|
| `npm audit fix` senza `--force` + `npm update` | Risolve i 7 high transitivi rigenerando il lockfile, nessun major bump | ✓ |
| `npm update` aggressivo completo | Più ampio, più rischio di regressioni | |
| Pin esatti delle versioni | Maggiore controllo ma manutenzione più rigida | |

**User's choice:** Delegata a Claude → `npm audit fix` (no `--force`) + `npm update`, nessun pin esatto (resta caret su astro, lockfile come fonte di verità).
**Notes:** Tutte le transitive hanno `fixAvailable` non-major.

---

## Dependabot config

| Option | Description | Selected |
|--------|-------------|----------|
| Aggiungere `.github/dependabot.yml` minimale | npm + github-actions, settimanale, raggruppato — governance preventiva | ✓ |
| Solo risolvere gli alert correnti | Nessuna automazione futura | |

**User's choice:** Delegata a Claude → Aggiungere `dependabot.yml` minimale.
**Notes:** On-theme col milestone "Manutenzione & Governance"; operativizza il nome della fase; basso costo.

---

## Residui & deploy

| Option | Description | Selected |
|--------|-------------|----------|
| Documentare residui in artefatti di fase + verifica locale build/Lighthouse | Leggero, GHSA ID + motivazione static-site; ADR rimandato a Phase 10 | ✓ |
| ADR formale dei residui ora | Più pesante, sovrappone alla Phase 10 | |

**User's choice:** Delegata a Claude → Documentazione leggera + de-risk deploy con verifica locale.
**Notes:** Niente major bump riduce il rischio del fallimento precedente (run 25837277597); confermare comunque il run Pages dopo merge.

---

## Claude's Discretion

- Ordine esatto dei comandi di fix e eventuale `npm install` intermedio.
- Sintassi e raggruppamenti del `dependabot.yml` (un gruppo "all" vs per ecosistema).
- Strumento/processo esatto per la run Lighthouse locale (riuso di quello v2.0/v3.0).

## Deferred Ideas

- Upgrade ad Astro 6 — fuori scope per questa minor; valutabile in una major dedicata.
- Automazione della pipeline di redazione diplomi — non pertinente a questa fase.
