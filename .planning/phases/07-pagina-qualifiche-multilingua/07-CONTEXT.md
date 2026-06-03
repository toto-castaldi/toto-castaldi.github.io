# Phase 7: Pagina Qualifiche Multilingua - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Una pagina dedicata e multilingua (`/qualifiche` IT, `/en/qualifications` EN) che mostra le tre qualifiche fitness di Toto come **anteprime immagine** dei diplomi con i dati personali di terzi oscurati, nello stile della home (dark/light, i18n, SEO), raggiungibile dalla sezione Fitness. Nessun PDF originale scaricabile o pubblicato.

Le tre qualifiche:
1. **Pesistica** — diploma MSP Italia (Sport: Pesistica, Disciplina: Cultura Fisica, Qualifica: Operatore), emesso 05/12/2025, N.39740
2. **Pilates Reformer Liv.1** — Zen Studio Pilates, Milano 16/11/2025
3. **Pilates Cadillac Liv.1** — Zen Studio Pilates, Milano 21/02/2026

La discussione chiarisce COME implementare ciò che è già in scope; non aggiunge nuove capability.

</domain>

<decisions>
## Implementation Decisions

### Redazione / Oscuramento PII
- **D-01:** Oscurare le **firme autografe di terzi** (Alessandra Caligaris e Prof. Gian Francesco Lupattelli sul diploma Pesistica; Cristian Campana sui due diplomi Pilates). I nomi stampati sotto le firme possono restare; va coperto lo scarabocchio della firma.
- **D-02:** Oscurare il **numero di registro N.39740** in basso a destra sul diploma di Pesistica (identificativo univoco del certificato).
- **D-03:** Il **nome "Antonio Castaldi" resta VISIBILE** su tutti e tre i diplomi — è già pubblico su tutto il sito e mostrarlo prova che la qualifica è davvero sua.
- **D-04:** Metodo di oscuramento: **rettangolo pieno opaco** sopra gli elementi da coprire (coerente col tema, irreversibile, nessun rischio che si intraveda). NON blur. La redazione va applicata sull'immagine sorgente prima della pubblicazione (irreversibile a livello di pixel), non solo via CSS.
- **D-05:** Verificato che i diplomi NON contengono codice fiscale, data/luogo di nascita, indirizzo o documenti d'identità — quindi gli unici elementi da redarre sono firme di terzi e numero registro.

### Layout & Zoom
- **D-06:** Le 3 anteprime sono disposte **impilate verticalmente** a larghezza piena (entro i 65ch del sito), in coerenza con le sezioni della home. Niente griglia multi-colonna.
- **D-07:** Ingrandimento via **lightbox CSS-only** (trucco `:target` o checkbox-hack, **zero JS**). VINCOLO: l'implementazione deve preservare Lighthouse 100 e l'accessibilità — gestire chiusura da tastiera (ESC/click fuori), focus management e attributi ARIA appropriati. È il punto più delicato della fase: se il lightbox CSS rischia di degradare Accessibility/Best Practices, il planner deve segnalarlo e proporre fallback (es. immagine a risoluzione piena senza overlay).

### Dettagli card
- **D-08:** Ogni qualifica mostra **Titolo + ente + data** (testo accanto/sotto l'anteprima).
- **D-09:** Etichetta del diploma di Pesistica: **"Personal Trainer"** (IT) / **"Certified Fitness Trainer"** (EN) — il ruolo professionale riconoscibile, NON il testo letterale "Operatore di Pesistica" del diploma.
- **D-10:** Etichette Pilates: **"Pilates Reformer Liv.1"** e **"Pilates Cadillac Liv.1"** (uguali IT/EN o adattate: "Pilates Reformer Level 1" / "Pilates Cadillac Level 1" in EN).
- **D-11:** Ente da mostrare: MSP Italia (ente di promozione sportiva riconosciuto CONI) per la Pesistica; Zen Studio Pilates per le due Pilates. Date: 05/12/2025, 16/11/2025, 21/02/2026.

### Testi & Navigazione
- **D-12:** Il link alla pagina qualifiche si inserisce **trasformando in link parte del testo esistente** della sezione Fitness (`section.fitness.p2` — es. "Personal Trainer e ... istruttore di Pilates"), non aggiungendo una frase nuova dedicata. Vale sia IT che EN.
- **D-13:** Ritorno alla home tramite **link testuale "← Torna alla home" (IT) / "← Back to home" (EN)** sulla pagina qualifiche (in cima e/o in fondo). Niente header/logo cliccabile nuovo.
- **D-14:** Intro della pagina = **H1 + una singola frase**. Es. H1 "Qualifiche" / "Qualifications" + frase "Le mie certificazioni come Personal Trainer e istruttore di Pilates." / "My certifications as a Personal Trainer and Pilates instructor."
- **D-15:** Tutti i testi nuovi (titolo pagina, frase intro, etichette, link, alt-text) passano dal dizionario i18n `src/i18n/ui.ts` con versioni IT ed EN (INT-02).

### Claude's Discretion
- Pipeline di conversione PDF→immagine e formato/ottimizzazione delle immagini (sono disponibili `pdftoppm`, `convert`/ImageMagick, `gs`/ghostscript). Scegliere formato e dimensioni che mantengano Performance 100 (es. PNG/WebP ottimizzato, dimensioni contenute, `width`/`height` espliciti, `loading="lazy"`).
- Come rendere path-aware hreflang/canonical (parametrizzare `Base.astro` vs gestire gli `alternate` a livello di pagina) — vedi nota roadmap; scelta tecnica del planner, purché INT-03 (hreflang reciproci IT↔EN per le nuove rotte) sia soddisfatto.
- Alt-text descrittivo esatto per ogni immagine (QUAL-06 / WCAG AA), redatto in IT/EN coerente con D-09/D-10.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisiti & Roadmap di fase
- `.planning/REQUIREMENTS.md` — QUAL-01..06 e INT-01..04, requisiti v3.0 (locked)
- `.planning/ROADMAP.md` §"Phase 7: Pagina Qualifiche Multilingua" — Goal, Success Criteria e Implementation notes (posizione PDF sorgente, problema hreflang di `Base.astro`, vincolo immagini/Performance)
- `.planning/PROJECT.md` — milestone v3.0, vincoli (GitHub Pages, JS minimo, design minimale) e Key Decisions storiche

### Codice esistente da riusare/estendere
- `src/layouts/Base.astro` — layout base; hreflang/canonical attualmente hardcoded verso la root (da rendere path-aware), Person JSON-LD, toolbar lang-switch + ThemeToggle
- `src/components/Section.astro` — wrapper sezione (`<section><h2>`+slot) da riusare per le card
- `src/i18n/ui.ts` — dizionario IT/EN (aggiungere chiavi `qualifiche.*`); `src/i18n/utils.ts` — `getLangFromUrl`, `useTranslations`
- `src/pages/index.astro` e `src/pages/en/index.astro` — pattern pagina + sezione Fitness dove inserire il link
- `astro.config.mjs` — config i18n (`defaultLocale: it`, `locales: [it, en]`, `prefixDefaultLocale: false`)

### Asset sorgente (FUORI dal repo — convertire in immagini redatte sotto `public/` durante l'esecuzione)
- `~/Documents/pt/diploma-pesistica-toto.pdf` — Pesistica (MSP Italia)
- `~/Documents/pilates/diploma-toto-pilates-reformer-1.pdf` — Pilates Reformer Liv.1 (Zen Studio Pilates)
- `~/Documents/pilates/diploma-toto-pilates-cadillac-1.pdf` — Pilates Cadillac Liv.1 (Zen Studio Pilates)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`Base.astro`**: avvolge ogni pagina con head SEO completo, dark-mode FOUC script, toolbar (lang-switch + ThemeToggle). La nuova pagina lo userà; va estesa per hreflang/canonical path-aware (vedi D-Discretion e nota roadmap).
- **`Section.astro`**: `<section id><h2>` + slot — adatto a fare da contenitore per ogni card qualifica.
- **`src/i18n/ui.ts` + `utils.ts`**: pattern i18n a dizionario (no librerie runtime). Le nuove pagine `index.astro`/`en/index.astro` chiamano `useTranslations('it'|'en')`.
- **`public/assets/images/`**: già usata per PNG statici (miniature lezioni) → collocazione naturale per le immagini diploma redatte.

### Established Patterns
- Routing i18n Astro: pagina IT in `src/pages/qualifiche.astro`, EN in `src/pages/en/qualifications.astro` (coerente con `index.astro` / `en/index.astro`).
- Zero/minimo JS: lo `is:inline` per la lingua è in `index.astro`; nuove pagine devono restare CSS-only per il lightbox (D-07).
- Link descrittivi (decisione storica per Lighthouse SEO): il link alla pagina e il "torna alla home" usano testo descrittivo, non "clicca qui".

### Integration Points
- Sezione Fitness (`section.fitness.p2` in `ui.ts`) → punto in cui inserire il link (D-12), sia IT che EN.
- `Base.astro` head → hreflang reciproci per le nuove rotte (INT-03) e canonical corretto.
- Lighthouse: tutte le nuove pagine devono mantenere 100/100/100/100 (INT-04) — peso immagini e lightbox CSS sono i rischi principali.

</code_context>

<specifics>
## Specific Ideas

- L'utente ha esplicitamente verificato il contenuto dei diplomi insieme a Claude: la redazione è mirata e minima (solo firme di terzi + N.39740), non un oscuramento massiccio.
- Preferenza per il ruolo professionale ("Personal Trainer") rispetto alla dicitura burocratica del diploma ("Operatore") → la pagina comunica il ruolo, l'immagine prova la certificazione.
- Stile coerente con la home: minimale, testuale, 65ch, impilato verticale.

</specifics>

<deferred>
## Deferred Ideas

- Aggiunta di ulteriori qualifiche/certificazioni future (già in REQUIREMENTS.md §Future Requirements) — la struttura della pagina dovrebbe essere facilmente estendibile, ma l'aggiunta di nuovi diplomi è fuori dallo scope di questa fase.
- Link diretto a credenziali verificabili online (se gli enti li forniranno) — Future Requirements.

None oltre a quanto sopra — la discussione è rimasta nello scope della fase.

</deferred>

---

*Phase: 7-Pagina Qualifiche Multilingua*
*Context gathered: 2026-06-03*
