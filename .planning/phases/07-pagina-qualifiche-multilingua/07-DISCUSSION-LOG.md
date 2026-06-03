# Phase 7: Pagina Qualifiche Multilingua - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 7-Pagina Qualifiche Multilingua
**Areas discussed:** Cosa oscurare, Layout & zoom, Dettagli card, Testi & ritorno

---

## Cosa oscurare

Premessa: Claude ha letto i 3 PDF sorgente. Nessun codice fiscale / data di nascita / indirizzo presente — solo nome (già pubblico), firme di terzi e numero registro.

| Opzione (multiSelect) | Descrizione | Selezionata |
|--------|-------------|----------|
| Firme di terzi | Firme autografe dei dirigenti MSP e del docente (Caligaris, Lupattelli, Campana) | ✓ |
| Numero registro | N.39740 sul diploma di Pesistica | ✓ |
| Il tuo nome | Coprire anche "Antonio Castaldi" | (no — resta visibile) |

**User's choice:** Firme di terzi + Numero registro. Nome visibile.

### Metodo di oscuramento
| Opzione | Descrizione | Selezionata |
|--------|-------------|----------|
| Rettangolo pieno | Barra/rettangolo opaco, irreversibile | ✓ |
| Sfocatura (blur) | Effetto blur sulle aree sensibili | |
| Decidi tu | Metodo più sicuro in esecuzione | |

**User's choice:** Rettangolo pieno.
**Notes:** Scelta motivata da sicurezza (no rischio di intravedere) e coerenza minimale.

---

## Layout & zoom

| Opzione (disposizione) | Descrizione | Selezionata |
|--------|-------------|----------|
| Impilate verticali | Una sotto l'altra, larghezza piena (65ch) | ✓ |
| Griglia responsive | Multi-colonna su desktop | |
| Decidi tu | — | |

**User's choice:** Impilate verticali.

### Comportamento zoom
| Opzione | Descrizione | Selezionata |
|--------|-------------|----------|
| Solo statiche | Nessun ingrandimento, zero JS | |
| Click → nuova scheda | Immagine come link a versione grande | |
| Lightbox CSS | Overlay con trucco CSS-only, no JS | ✓ |

**User's choice:** Lightbox CSS-only.
**Notes:** Claude ha segnalato il rischio accessibilità/Lighthouse — da gestire con cura (chiusura tastiera, focus, ARIA).

---

## Dettagli card

| Opzione | Descrizione | Selezionata |
|--------|-------------|----------|
| Titolo + ente + data | Etichetta + ente emittente + data | ✓ |
| Solo titolo | Solo l'etichetta della qualifica | |
| Titolo + ente + data + descrizione | Con frase descrittiva per qualifica | |

**User's choice:** Titolo + ente + data.

### Etichetta diploma Pesistica
| Opzione | Descrizione | Selezionata |
|--------|-------------|----------|
| Pesistica — Operatore | Sport + qualifica | |
| Operatore di Pesistica | Forma discorsiva | |
| Operatore Cultura Fisica | Usa la disciplina | |
| Decidi tu | — | |

**User's choice:** (Other / free-text) **"Personal Trainer / Certified Fitness Trainer"** — ruolo professionale invece del testo letterale del diploma.

---

## Testi & ritorno

### Link dalla sezione Fitness
| Opzione | Descrizione | Selezionata |
|--------|-------------|----------|
| Frase + link inline | Nuova frase "Guarda le mie qualifiche" con link | |
| Link su testo esistente | Trasformare in link parte del testo Fitness già presente | ✓ |
| Decidi tu | — | |

**User's choice:** Link su testo esistente.

### Ritorno alla home
| Opzione | Descrizione | Selezionata |
|--------|-------------|----------|
| Link "torna alla home" | Link testuale in cima/fondo | ✓ |
| Nome/logo cliccabile | Titolo sito come link (richiede header) | |
| Entrambi | — | |

**User's choice:** Link "← Torna alla home" / "← Back to home".

### Testo introduttivo pagina
| Opzione | Descrizione | Selezionata |
|--------|-------------|----------|
| Titolo + 1 frase | H1 + una frase di intro | ✓ |
| Solo titolo | Solo H1 | |
| Titolo + paragrafo | Intro estesa | |

**User's choice:** Titolo + 1 frase.

---

## Claude's Discretion

- Pipeline PDF→immagine e formato/ottimizzazione immagini (pdftoppm/convert/gs disponibili).
- Strategia tecnica hreflang/canonical path-aware (parametrizzare Base.astro vs alternate a livello pagina), purché INT-03 sia soddisfatto.
- Wording esatto degli alt-text descrittivi (IT/EN).

## Deferred Ideas

- Aggiunta di future qualifiche/certificazioni (già in REQUIREMENTS.md Future Requirements).
- Link a credenziali verificabili online (Future Requirements).
