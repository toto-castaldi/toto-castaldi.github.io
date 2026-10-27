# AGENTS.md

Guida per chi lavora su questo repository.

## Cos'è questo progetto

Sito web personale di **Antonio "Toto" Castaldi** — imprenditore, informatico e personal trainer — pubblicato su GitHub Pages all'indirizzo https://toto-castaldi.github.io (con custom domain via `public/CNAME`).

È un sito statico **bilingue (italiano / inglese)** che presenta le sue attività. Include una pagina con le qualifiche fitness con relative immagini dei certificati.

## Stack

- **Astro 5** (unico runtime dependency) — nessun framework UI aggiuntivo, solo componenti `.astro`
- **TypeScript** (config minimale in `tsconfig.json`)
- **Node 22** (versione pinata in `.nvmrc`)
- Nessun database, nessun backend: solo contenuto statico tradotto in HTML

## Comandi

```bash
npm install        # installa le dipendenze
npm run dev        # server di sviluppo (http://localhost:4321)
npm run build      # build di produzione in dist/
npm run preview    # anteprima locale del build
```

Non esiste una suite di test né un linter configurato. La verifica del lavoro avviene con `npm run build` (che fallisce su errori di tipo/sintassi) e ispezionando `dist/`.

## Struttura

```
astro.config.mjs        # config: site URL + i18n (it default senza prefisso, en con prefisso /en/)
                         # + plugin rehype che apre i link esterni in nuova scheda
content/                # ⭐ CONTENUTO del sito — un file .md per pagina per lingua
  index-it.md           # home italiana: frontmatter SEO + corpo in markdown
  index-en.md            # home inglese
  qualifiche-it.md      # qualifiche: tutti i testi nel frontmatter YAML
  qualifiche-en.md
src/
  content.config.ts      # content collections (glob loader) + schemi zod del frontmatter
  i18n/
    utils.ts             # getLangFromUrl() — helper i18n
  layouts/
    Base.astro           # layout condiviso: head, SEO (canonical, Open Graph, hreflang),
                         # JSON-LD Person, toggle tema chiaro/scuro, link cambio lingua
  components/
    Section.astro        # sezione generica con titolo + id ancora
    ThemeToggle.astro     # switch light/dark (persistito in localStorage)
  pages/                 # template SOTTILI: leggono i testi da content/ e impagano
    index.astro          # home italiana ( gestisce anche il redirect automatico
                         #   in /en/ per browser non-italiani, via localStorage)
    qualifiche.astro     # qualifiche fitness (certificati pesistica e Pilates)
    en/
      index.astro        # home inglese
      qualifications.astro  # qualifiche in inglese
  styles/
    global.css           # unico foglio di stile, variabili CSS per tema chiaro/scuro
public/
  assets/images/        # immagini (certificati, miniature lezioni Pilates)
  og-image.png           # immagine per social/Open Graph
  favicon.svg
  CNAME
.github/workflows/
  deploy.yml             # CI: build+deploy su GitHub Pages a ogni push su master
.github/dependabot.yml   # aggiornamento automatico dipendenze
```

## Convenzioni e regole importanti

### Il contenuto vive in content/ (regola #1)

- **I testi NON vanno mai scritti nei componenti .astro**: tutto il contenuto è in file markdown in `content/`, un file per pagina per lingua (`<pagina>-it.md` / `<pagina>-en.md`). Non esiste più un file di traduzioni.
- **Pagine di puro testo** (home): il corpo della pagina è markdown reso direttamente via `<Content />` di Astro; frontmatter = metadati SEO (`title`, `description`, `og`).
- **Pagine strutturate** (qualifiche): i testi stanno nel frontmatter YAML e il `.astro` è un template che li impaga.
- Il frontmatter è **validato da zod** in `src/content.config.ts` al build: se manca/modifichi una chiave, la build fallisce.
- I link esterni nei `.md` vengono aperti in nuova scheda (`target="_blank" rel="noopener noreferrer"`) dal plugin rehype in `astro.config.mjs` — non serve scriverlo a mano nel markdown.
- L'italiano è la lingua di default e **non ha prefisso URL** (`/`, `/qualifiche/`); l'inglese vive sotto `/en/` (`/en/`, `/en/qualifications/`).
- Le pagine delle due lingue devono rimanere speculari: a ogni file `-it.md` corrisponde un `-en.md`, e i due `.astro` in `src/pages/` puntano alle rispettive entry; collega gli URL alternati tramite la prop `alternates` di `Base.astro` (usata per `hreflang` e per il link di cambio lingua).
- In dev (`npm run dev`) le modifiche ai `.md` vengono ricaricate a caldo.

### Deploy

- Il deploy è automatico tramite GitHub Actions (`.github/workflows/deploy.yml`) a ogni **push su `master`**: attenzione a cosa si pusha, va in produzione subito.
- La build ufficiale usa l'action `withastro/action@v5`.

### Stile

- Tema chiaro/scuro gestito con variabili CSS in `global.css` e `ThemeToggle` (chiave `theme` in localStorage) — non usare colori hardcoded nei componenti.
- Le preferenze di lingua del visitatore sono persistite in `localStorage` con chiave `preferred-lang` (vedi lo script inline in `src/pages/index.astro`).

### Contenuto

- Il sito dichiara esplicitamente "no AI" nel footer della home: mantenere un tono personale e autentico nei testi.
- Email di contatto: toto.castaldi@gmail.com.
- Il README.md contiene istruzioni legacy Jekyll/Docker: **ignorarle**, il sito è stato migrato su Astro; il comando corretto è `npm run dev`.

## Note sul workflow con gli agenti

- Non esistono `.env` né secret locali: tutto è statico e pubblico.
- `dist/`, `node_modules/` e `.astro/` sono ignorati da git — non committarli.
- Dopo ogni modifica, verificare sempre con `npm run build` e, se possibile, controllare le pagine generate in `dist/` in entrambe le lingue.
