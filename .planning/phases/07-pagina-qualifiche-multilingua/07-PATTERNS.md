# Phase 7: Pagina Qualifiche Multilingua - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 8 (2 new pages, 3 new images, 3 modified source files) + 1 optional new component
**Analogs found:** 8 / 8 (all new/modified files have a direct in-repo analog)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/pages/qualifiche.astro` (NEW) | page (route) | request-response (SSG render) | `src/pages/index.astro` | exact |
| `src/pages/en/qualifications.astro` (NEW) | page (route) | request-response (SSG render) | `src/pages/en/index.astro` | exact |
| `src/layouts/Base.astro` (MODIFIED) | layout | request-response (head/SEO) | itself (lines 1-24, 85-103) | self-extend |
| `src/i18n/ui.ts` (MODIFIED) | config (dictionary) | transform (build-time lookup) | existing `it`/`en` blocks | exact |
| `src/pages/index.astro` (MODIFIED) | page (route) | request-response | itself line 31/35/41 (`set:html`) | self-extend |
| `src/pages/en/index.astro` (MODIFIED) | page (route) | request-response | itself line 15/19/23 (`set:html`) | self-extend |
| `public/assets/images/qualifica-*.webp` (NEW ×3) | asset | file-I/O (build-time pipeline) | `public/assets/images/miniatura-lezione-*.png` | role-match (PNG→WebP) |
| `src/components/Qualification.astro` (OPTIONAL NEW) | component | request-response | `src/components/Section.astro` | role-match |

**Notes on analog quality:**
- The two new pages are near-clones of the home pages: same imports, same `useTranslations` call, same `<Base>` wrap, same `<Section>` usage. Highest-confidence copy targets in the repo.
- `Base.astro` and the two `index.astro` files are "self-extend": the analog IS the file being modified — the planner copies the *adjacent existing pattern within the same file* and extends it.
- Images: only PNG analogs exist (no prior WebP). The location convention (`public/assets/images/`) is exact; the format (WebP) is new per RESEARCH Claude's-Discretion. Marked role-match because no redacted-scan analog exists.

## Pattern Assignments

### `src/pages/qualifiche.astro` (page, request-response) — NEW

**Analog:** `src/pages/index.astro` (read in full, 61 lines)
**read_first:** `src/pages/index.astro` (whole file), `src/components/Section.astro`, `src/i18n/utils.ts`

**Frontmatter + import pattern** (copy from `index.astro` lines 1-7):
```astro
---
import Base from '../layouts/Base.astro';
import Section from '../components/Section.astro';
import { useTranslations } from '../i18n/utils';

const t = useTranslations('it');
---
```
- IT page lives at repo root of `src/pages/` → relative import depth `../layouts/`, `../components/`, `../i18n/` (same as `index.astro`). EN page at `src/pages/en/` uses `../../` (see `en/index.astro` lines 2-4).
- `useTranslations('it')` is hardcoded per file (NOT derived from URL) — this is the established convention; `index.astro` line 6 passes `'it'`, `en/index.astro` line 6 passes `'en'`.

**Base wrap + body skeleton pattern** (from `index.astro` lines 8, 29-61):
```astro
<Base title={t('site.title')} description={t('site.description')}>
  <main>
    <h1>{t('site.title')}</h1>
    <p set:html={t('intro.text')} />
    ...
    <Section title={t('section.fitness.title')} id="fitness">
      <p>{t('section.fitness.p1')}</p>
    </Section>
  </main>
</Base>
```
- For the qualifiche page the planner adapts: `<Base title={t('qualifiche.title')} description={t('qualifiche.description')} alternates={{ it: '/qualifiche', en: '/en/qualifications' }}>` — note the NEW `alternates` prop (see Base.astro section below).
- `<h1>{t('qualifiche.title')}</h1>` + single intro `<p>{t('qualifiche.intro')}</p>` (D-14).
- One `<Section>` per diploma (D-06 vertical stack), each containing the `<figure>`/zoom markup.
- Back-home link (D-13): plain `<a href="/">{t('qualifiche.back')}</a>` — descriptive-link convention (CONTEXT D-13).

**`set:html` for embedded markup** (the load-bearing convention — `index.astro` line 31 vs line 32):
```astro
<p set:html={t('intro.text')} />   <!-- when string contains <em>/<a> -->
<p>{t('intro.sections')}</p>       <!-- plain text -->
```
- RULE: any dictionary string containing inline HTML (`<a>`, `<em>`) MUST be rendered with `set:html`, otherwise Astro escapes it. This governs the linkify edits below and any rich intro.

**Image/zoom markup:** No in-repo analog (no existing `<figure>`/`<img>`/`<dialog>` in any `.astro` file — verified: `grep` finds zero `img`/`figure`/`dialog` in `src/`). Planner uses RESEARCH.md Pattern 2 (native `<dialog>` + Invoker Commands) or Pattern 3 (`<a href>` fallback). See "No Analog Found".

---

### `src/pages/en/qualifications.astro` (page, request-response) — NEW

**Analog:** `src/pages/en/index.astro` (read in full, 44 lines)
**read_first:** `src/pages/en/index.astro` (whole file), `src/pages/qualifiche.astro` (its IT sibling, once written)

**Import-depth pattern** (from `en/index.astro` lines 1-6):
```astro
---
import Base from '../../layouts/Base.astro';
import Section from '../../components/Section.astro';
import { useTranslations } from '../../i18n/utils';

const t = useTranslations('en');
---
```
- Structurally identical to the IT page; only difference is `../../` import depth and `useTranslations('en')`.
- `alternates` prop reversed is NOT needed — same object `{ it: '/qualifiche', en: '/en/qualifications' }` works on both pages (Base computes both hreflang links from it). Confirm against Base.astro logic below.
- Back-home link target = `/en/` with `{t('qualifiche.back')}` ("← Back to home").

---

### `src/layouts/Base.astro` (layout, request-response) — MODIFIED (path-aware hreflang/canonical, INT-03)

**Analog:** itself. Current relevant code already in context.

**Current Props interface** (lines 2-6 — extend this):
```astro
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Pagina personale di Antonio Castaldi — Imprenditore, informatico, personal trainer.' } = Astro.props;
```
Planner adds optional `alternates?: { it: string; en: string }` and destructures it (RESEARCH Pattern 1, lines 174-184).

**Current hreflang derivation** (lines 16-17, 22-24 — the code to make path-aware):
```astro
const itUrl = getAbsoluteLocaleUrl('it', '');
const enUrl = getAbsoluteLocaleUrl('en', '');
...
const alternateLang = lang === 'it' ? 'en' : 'it';
const alternateLabel = lang === 'it' ? 'English' : 'Italiano';
const alternateUrl = getRelativeLocaleUrl(alternateLang, '');
```
- `itUrl`/`enUrl` currently always resolve to locale ROOTS → wrong for `/qualifiche` (Pitfall 3). Planner replaces with `new URL(alternates?.it ?? '/', Astro.site)` / `new URL(alternates?.en ?? '/en/', Astro.site)` so existing callers (home pages, no prop) keep identical output (Assumption A1 — verify emitted HTML byte-identical).
- `alternateUrl` (line 24, the body language-switcher) ALSO points to root. Open Question 2 / RESEARCH note: planner should drive it from the same `alternates` prop so EN↔IT switching stays on the qualifiche page. The switcher anchor is at lines 94-101.

**Current hreflang `<link>` emission** (lines 85-88 — unchanged structurally, now path-aware via the vars):
```astro
<!-- hreflang -->
<link rel="alternate" hreflang="it" href={itUrl} />
<link rel="alternate" hreflang="en" href={enUrl} />
<link rel="alternate" hreflang="x-default" href={itUrl} />
```
- `x-default` follows `itUrl` → becomes path-aware automatically (RESEARCH line 188).

**Canonical (line 7) — DO NOT TOUCH:**
```astro
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
```
- Already per-page correct (uses `Astro.url.pathname`). No change needed (RESEARCH line 189).

**Constraint:** Home pages call `<Base>` with NO `alternates` → defaults must reproduce today's exact `getAbsoluteLocaleUrl` output. This is the only regression risk; gate with the hreflang reciprocity grep checks (RESEARCH lines 442-448).

---

### `src/i18n/ui.ts` (config/dictionary, transform) — MODIFIED (add `qualifiche.*`, linkify `section.fitness.p2`)

**Analog:** existing dictionary entries in the same file.

**Dictionary shape** (lines 8-71): a single `export const ui = { it: {...}, en: {...} } as const;` object of flat dot-keyed strings. Keys MUST exist in BOTH `it` and `en` (utils.ts line 10 types `t` off `keyof (typeof ui)['it']` → TS build fails on any asymmetry — this is the INT-02 guardrail).

**Embedded-link string pattern** (line 18, 25 — copy this exact anchor style for the linkified Fitness text and any rich qualifiche string):
```ts
'section.cs.p2':
  'I miei <a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">repository GitHub</a> e i <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">progetti che ho creato</a>.',
```
- External links use `target="_blank" rel="noopener noreferrer"`. INTERNAL links (to `/qualifiche`, `/en/qualifications`) should OMIT `target="_blank"` (same-site navigation) — follow the back-home descriptive-link spirit.

**Current `section.fitness.p2` to linkify** (D-12, INT-01):
```ts
// IT (line 29-30, current — plain text):
'section.fitness.p2':
  'Lavoro come Personal Trainer e come istruttore di Pilates in due palestre dell\'interland milanese.',
// EN (line 60-61, current):
'section.fitness.p2':
  'I work as a Personal Trainer and Pilates instructor at two gyms in the Milan metropolitan area.',
```
- Planner wraps the role phrase in an internal `<a href="/qualifiche">` (IT) / `<a href="/en/qualifications">` (EN). See RESEARCH lines 327-331 for the exact target shape.
- CONSEQUENCE: `section.fitness.p2` now contains HTML → the home pages MUST switch its render to `set:html` (see the two index.astro edits below).

**New keys to add** (shape from RESEARCH lines 338-354): `qualifiche.title`, `.description`, `.intro`, `.back`, `.pesistica.label`/`.body`, `.reformer.label`/`.body`, `.cadillac.label`/`.body`, `.alt.{pesistica,reformer,cadillac}`, plus `.zoom.*`/`.close` if using the dialog. Add identically-keyed entries under both `it:` and `en:`.

---

### `src/pages/index.astro` & `src/pages/en/index.astro` (page) — MODIFIED (render linkified Fitness p2)

**Analog:** the `set:html` lines already in the same files.

**IT — current (line 45-46, inside the fitness `<Section>`):**
```astro
<p>{t('section.fitness.p1')}</p>
<p>{t('section.fitness.p2')}</p>
```
**Change to** (mirror line 31/35/41 which already use `set:html`):
```astro
<p>{t('section.fitness.p1')}</p>
<p set:html={t('section.fitness.p2')} />
```
**EN — identical change at `en/index.astro` lines 28-29.**
- This is the single required edit on each home page: `p2` only, because it now embeds an `<a>`. `p1` stays plain. Confirmed pattern: `index.astro` already does `<p set:html={t('section.cs.p2')} />` (line 41) and `entrepreneurship.p1` (line 35).

---

### `public/assets/images/qualifica-{pesistica,pilates-reformer,pilates-cadillac}.webp` (asset, file-I/O) — NEW

**Analog:** `public/assets/images/miniatura-lezione-003.png` … `-010.png` (8 existing PNGs, 2.4 KB–69 KB).
**read_first:** none (binary). Pipeline in RESEARCH.md "Code Examples" lines 287-321.

**Location convention (exact match):** `public/assets/images/` — same dir as the lesson thumbnails. Served directly by Astro/GitHub Pages from `/assets/images/<name>` (no import, no asset hashing; referenced by absolute path in `<img src="/assets/images/...">`).
**Naming convention:** existing files use kebab-case descriptive names (`miniatura-lezione-NNN.png`). New files follow `qualifica-<slug>.webp`.
**Size budget:** existing thumbnails are 2–69 KB; RESEARCH Pitfall 2 caps each diploma WebP at ~150 KB. Format diverges (PNG→WebP) per Claude's-Discretion (RESEARCH line 35, 93).
**Constraint (QUAL-04/D-04):** redaction burned into pixels via the `pdftoppm`→`convert -draw`→WebP pipeline; source PDFs (in `~/Documents/...`, OUTSIDE repo) must NOT be committed. Verify `! find dist public -name '*.pdf'`.

---

### `src/components/Qualification.astro` (component) — OPTIONAL NEW

**Analog:** `src/components/Section.astro` (read in full, 21 lines).
**Only if** the planner extracts the per-diploma card to reduce ×3 repetition (RESEARCH line 154 marks it OPTIONAL).

**Component shape** (copy from `Section.astro` lines 1-11):
```astro
---
interface Props {
  title: string;
  id?: string;
}
const { title, id } = Astro.props;
---
<section id={id}>
  <h2>{title}</h2>
  <slot />
</section>

<style>
  section { margin-block: 2.5rem; }
  h2 { margin-block-end: 0.75rem; }
</style>
```
- Pattern to copy: typed `interface Props`, destructure from `Astro.props`, single `<slot />`, scoped `<style>` block. A `Qualification.astro` would take `imgSrc`, `width`, `height`, `alt`, `label`, `body`, `zoomLabel` props and render the `<figure>`+`<dialog>` markup once.

---

## Shared Patterns

### i18n string resolution
**Source:** `src/i18n/utils.ts` (lines 9-13) + `src/i18n/ui.ts`
**Apply to:** both new pages, both modified pages, all new strings
```ts
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
```
- Per-page hardcoded lang (`useTranslations('it')` / `('en')`), NOT URL-derived in pages. Keys typed off the `it` block → asymmetric keys break the build (INT-02 guardrail). No runtime i18n library.

### Layout / container width
**Source:** `src/styles/global.css` (lines 33, 64-69)
**Apply to:** new pages (no per-page width CSS needed)
```css
:root { --content-max-width: 65ch; }
body { max-width: var(--content-max-width); margin-inline: auto; padding-inline: var(--content-padding); padding-block: 2rem; }
```
- The 65ch column (D-06 "entro i 65ch") is enforced globally on `<body>`. New pages inherit it; diploma `<figure>`/`<img>` should be `max-width: 100%` to stay inside. Any new figure/img/dialog CSS goes in `global.css` (RESEARCH line 158) — there are currently ZERO img/figure/dialog rules (verified), so these are net-new additions, not edits to existing selectors.

### SEO head / hreflang / JSON-LD
**Source:** `src/layouts/Base.astro` (lines 7, 16-24, 65-90)
**Apply to:** all pages (automatically, via `<Base>` wrap)
- Single source of truth for `<title>`, `description`, canonical, Open Graph, Twitter, hreflang, Person JSON-LD, dark-mode FOUC `is:inline` script, and the toolbar (lang-switch + ThemeToggle). New pages get all of it for free by wrapping in `<Base>`. The ONLY extension this phase needs is the path-aware `alternates` prop.

### Descriptive links (Lighthouse SEO convention)
**Source:** CONTEXT D-13/D-89, established repo decision
**Apply to:** Fitness-section link, back-home link, zoom trigger `aria-label`
- Link text describes the destination ("Personal Trainer e ... istruttore di Pilates", "← Torna alla home"), never "clicca qui"/"click here".

## No Analog Found

| File / Concern | Role | Data Flow | Reason |
|----------------|------|-----------|--------|
| `<figure>`/`<img>` markup in pages | page fragment | request-response | No existing `.astro` file contains any `<img>`/`<figure>` (verified: zero matches for img/figure in `src/`). No in-repo HTML image pattern to copy. |
| `<dialog>` + Invoker zoom markup | component/page fragment | client interaction | No `<dialog>` anywhere in repo; native `<dialog>`+Invoker (RESEARCH Pattern 2) or `<a href>` fallback (Pattern 3) is new ground. Planner uses RESEARCH.md, not a codebase analog. |
| `figure`/`img`/`dialog`/`::backdrop` CSS | styles | — | `global.css` has no such rules (verified). New rules added there per RESEARCH line 158. |
| PDF→WebP redaction pipeline | build tooling | file-I/O / batch | One-off local CLI run; no prior conversion script in repo. RESEARCH "Code Examples" lines 287-321 is the reference. |

**For all four:** the planner should reference RESEARCH.md (Patterns 2/3, Code Examples, Pitfalls 2/4) rather than a codebase analog, while matching the repo's `set:html`/i18n/descriptive-link/65ch conventions documented above.

## Metadata

**Analog search scope:** `src/pages/`, `src/pages/en/`, `src/layouts/`, `src/components/`, `src/i18n/`, `src/styles/`, `public/assets/images/`, `astro.config.mjs`
**Files scanned (read or grepped):** `index.astro`, `en/index.astro`, `Base.astro`, `Section.astro`, `ui.ts`, `utils.ts`, `astro.config.mjs`, `global.css`, image dir listing
**Skills checked:** `.claude/skills/` and `.agents/skills/` absent; no root `CLAUDE.md` — no project-skill constraints to apply
**Pattern extraction date:** 2026-06-03
