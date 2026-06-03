# Phase 7: Pagina Qualifiche Multilingua - Research

**Researched:** 2026-06-03
**Domain:** Astro 5 static-site i18n page + CSS/HTML accessible image zoom + PDF→image redaction pipeline
**Confidence:** HIGH (codebase verified directly; the one MEDIUM area — zero-JS lightbox — has a clearly-recommended path)

## Summary

This phase adds two new static pages (`/qualifiche` IT, `/en/qualifications` EN) to an already-mature Astro 5 site. The bulk of the work — routing, i18n dictionary, `Base.astro`/`Section.astro` reuse, dark mode — is well-established in the repo and low-risk. Three areas are genuinely delicate and are the focus of this research: (1) the zero-JS accessible image zoom (D-07), (2) making hreflang/canonical path-aware in `Base.astro` (INT-03), and (3) the PDF→redacted-image pipeline (QUAL-04).

The single most important finding: **the pure-CSS `:target`/checkbox lightbox cannot satisfy WCAG/Lighthouse accessibility** (no focus trap, no native ESC, no dialog semantics) [VERIFIED: WebAIM + code-accessible.com + CSS-Tricks]. However, a **native `<dialog>` opened declaratively via the Invoker Commands API** (`<button command="show-modal" commandfor="...">`) reaches the same zero-author-JS goal as the CSS hack while getting browser-native focus trap, ESC-to-close, and ARIA semantics for free. The Invoker Commands API became **Baseline (all major browsers) as of December 2025** [CITED: developer.mozilla.org/Invoker_Commands_API; InfoQ 2026-01]. This is the recommended primary approach and it resolves D-07's stated risk. A pure-HTML fallback (each preview is an `<a href>` to the full-resolution redacted image) is the zero-risk option if Baseline support is judged too new.

**Primary recommendation:** Build two pages reusing `Base.astro`+`Section.astro`; add all strings to `src/i18n/ui.ts`; parametrize `Base.astro` with an optional `alternates` prop pair for path-aware hreflang/canonical; redact the 3 PDFs irreversibly with `pdftoppm` → ImageMagick `convert` opaque rectangles → optimized WebP at explicit dimensions; use a native `<dialog>` + Invoker Commands for zoom, with an `<a href>`-to-image fallback documented.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Redact third-party autograph signatures (Alessandra Caligaris & Prof. Gian Francesco Lupattelli on Pesistica; Cristian Campana on both Pilates). Printed names under the signatures may remain; cover only the signature scribble.
- **D-02:** Redact the register number **N.39740** (bottom-right, Pesistica diploma — unique certificate identifier).
- **D-03:** "Antonio Castaldi" stays **VISIBLE** on all three diplomas (already public; proves ownership).
- **D-04:** Redaction method = **opaque filled rectangle** over the elements. NOT blur. Applied to the source image **before publication (irreversible at pixel level)**, not via CSS.
- **D-05:** Verified the diplomas contain NO fiscal code, birth date/place, address, or ID documents — only third-party signatures + register number need redaction.
- **D-06:** The 3 previews are **stacked vertically** at full width (within the site's 65ch), consistent with home sections. No multi-column grid.
- **D-07:** Zoom via **CSS-only lightbox (zero JS)** — `:target` or checkbox hack. CONSTRAINT: must preserve Lighthouse 100 and accessibility (keyboard ESC/click-outside close, focus management, ARIA). If the CSS lightbox risks degrading Accessibility/Best-Practices, planner must flag it and propose a fallback (e.g. full-resolution image without overlay). **(See "Highest-Risk Decision" below — this research recommends a zero-author-JS native `<dialog>` instead of the CSS hack, which satisfies the same constraint better. Planner must reconcile with the literal D-07 wording.)**
- **D-08:** Each qualification shows **Title + body + date** (text beside/under the preview).
- **D-09:** Pesistica label = **"Personal Trainer"** (IT) / **"Certified Fitness Trainer"** (EN) — the recognizable professional role, NOT the literal "Operatore di Pesistica".
- **D-10:** Pilates labels = **"Pilates Reformer Liv.1"** & **"Pilates Cadillac Liv.1"** (IT); EN may adapt to "Pilates Reformer Level 1" / "Pilates Cadillac Level 1".
- **D-11:** Bodies to show: MSP Italia (CONI-recognized) for Pesistica; Zen Studio Pilates for both Pilates. Dates: 05/12/2025, 16/11/2025, 21/02/2026.
- **D-12:** The link to the qualifiche page is inserted by **turning part of the existing Fitness text into a link** (`section.fitness.p2` — e.g. "Personal Trainer ... istruttore di Pilates"), NOT a new dedicated sentence. Both IT & EN.
- **D-13:** Return-to-home via **text link "← Torna alla home" (IT) / "← Back to home" (EN)** on the qualifiche page (top and/or bottom). No new clickable header/logo.
- **D-14:** Page intro = **H1 + a single sentence**. E.g. H1 "Qualifiche"/"Qualifications" + sentence "Le mie certificazioni come Personal Trainer e istruttore di Pilates." / "My certifications as a Personal Trainer and Pilates instructor."
- **D-15:** All new strings (page title, intro sentence, labels, links, alt-text) go through `src/i18n/ui.ts` with IT & EN versions (INT-02).

### Claude's Discretion
- PDF→image conversion pipeline and image format/optimization (`pdftoppm`, `convert`/ImageMagick, `gs` available). Choose format/dimensions that keep Performance 100 (optimized PNG/WebP, contained size, explicit `width`/`height`, `loading="lazy"`).
- How to make hreflang/canonical path-aware (parametrize `Base.astro` vs page-level alternates) — planner's technical choice, as long as INT-03 (reciprocal IT↔EN hreflang for the new routes) is satisfied.
- Exact descriptive alt-text per image (QUAL-06 / WCAG AA), in IT/EN consistent with D-09/D-10.

### Deferred Ideas (OUT OF SCOPE)
- Adding further qualifications/certifications in the future (structure should be easily extensible, but adding new diplomas is out of scope for this phase).
- Direct link to online-verifiable credentials (if bodies provide them) — Future Requirements.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| QUAL-01 | View dedicated IT qualifiche page at `/qualifiche` | Astro page at `src/pages/qualifiche.astro` (mirrors `index.astro`) |
| QUAL-02 | Same page in EN at `/en/qualifications` | Astro page at `src/pages/en/qualifications.astro` (mirrors `en/index.astro`) |
| QUAL-03 | Three qualifications, each with preview image + title/label | Vertical-stacked `Section.astro` per qualification; images under `public/assets/images/` |
| QUAL-04 | Previews show diplomas with sensitive data redacted before publication; no downloadable/published original PDF | PDF→image redaction pipeline (irreversible opaque rectangles); PDFs never copied into repo |
| QUAL-05 | Reuse home layout/style (`Base.astro`, `Section.astro`, fluid typography) + dark/light | Direct reuse of existing layout & CSS tokens; no new global CSS needed except image/dialog rules |
| QUAL-06 | Each preview has descriptive alt-text (WCAG AA) | Alt-text via i18n dictionary keys; descriptive, not "diploma" |
| INT-01 | Reach page via link in Fitness section (IT & EN) | Inline `<a>` inside `section.fitness.p2` dictionary string |
| INT-02 | All new text managed via i18n dictionary IT/EN | New `qualifiche.*` keys in `src/i18n/ui.ts` |
| INT-03 | Correct SEO metadata + reciprocal IT↔EN hreflang, consistent with site | Path-aware `Base.astro` (parametrized alternates prop) |
| INT-04 | Lighthouse stays 100/100/100/100 on new pages | WebP at explicit dimensions + `loading="lazy"`; accessible zoom; descriptive links; no render-blocking JS |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page rendering (IT/EN routes) | Static / SSG (Astro build) | — | Astro `output: static`; pages compiled to HTML at build, served by GitHub Pages |
| i18n string resolution | Static / SSG | — | Dictionary lookup happens at build time via `useTranslations`; no runtime i18n |
| hreflang / canonical / JSON-LD | Static / SSG (`Base.astro` head) | — | Computed per-page at build from `Astro.url` + props |
| Image redaction & optimization | Build-time tooling (local CLI, one-off) | — | Run once during execution; redacted WebPs committed to `public/`. NOT a runtime/CI step |
| Image zoom (lightbox) | Browser / Client | — | Native `<dialog>` + Invoker Commands = browser-native; zero author JS |
| Theme (dark/light) | Browser / Client (existing `is:inline`) | Static (CSS tokens) | Already established; reused unchanged |
| Asset serving | CDN / Static (GitHub Pages) | — | `public/` assets served directly |

## Standard Stack

### Core
| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Astro | 5.17.1 (repo) | SSG, routing, i18n config | Already the project's stack [VERIFIED: package.json] |
| Astro i18n routing | built-in | `/` IT, `/en/` EN, `getRelative/AbsoluteLocaleUrl` | Already configured (`prefixDefaultLocale: false`) [VERIFIED: astro.config.mjs] |
| Native `<dialog>` + Invoker Commands API | Baseline since Dec 2025 | Zero-JS accessible image zoom modal | Browser-native focus trap, ESC, ARIA; declarative open via `command`/`commandfor` [CITED: MDN; InfoQ] |
| poppler `pdftoppm` | 24.02.0 (verified) | PDF → high-DPI raster | Renders A4 page to PNG/PPM cleanly at chosen DPI [VERIFIED: `pdftoppm -v`] |
| ImageMagick `convert` | 6.9.12-98 Q16, libwebp 1.3.2 (verified) | Draw opaque rectangles + export optimized WebP | WebP delegate present; `-draw rectangle` flattens redaction into pixels [VERIFIED: `convert -list format`] |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| poppler `pdfinfo` | 24.02.0 | Confirm page dimensions/orientation before rendering | Already used here (see orientation note) [VERIFIED] |
| ghostscript `gs` | 10.02.1 | Alternative PDF rasterizer | Only if `pdftoppm` output is unsatisfactory; `pdftoppm` is preferred for fidelity |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `<dialog>`+Invoker | Pure-CSS `:target`/checkbox lightbox (literal D-07) | Zero JS, but FAILS focus trap + native ESC + dialog semantics → a11y/Best-Practices risk. Do not use for the modal. |
| Native `<dialog>`+Invoker | Plain `<a href="full.webp">` link to image (no modal) | Zero JS, zero a11y risk, simplest. Loses overlay UX but fully WCAG-compliant. **Recommended fallback.** |
| Native `<dialog>`+Invoker | `<dialog>` + tiny `is:inline` JS (`showModal()` on click) | Works on older browsers too; adds a few lines of JS (project already permits minimal JS for theme/lang) |
| WebP | Optimized PNG (PNG8/24) | WebP ~25-35% smaller at equal quality; PNG is the existing convention in `public/assets/images/`. Either keeps Performance 100; WebP preferred for diploma scans. |
| ImageMagick `convert` | `gs` + manual overlay | `convert -draw` is the most direct way to burn opaque rectangles into pixels |

**Installation:** None. All tooling already present on the dev machine; no npm packages added.
```bash
# verified present: pdftoppm 24.02.0, convert (ImageMagick 6.9.12, libwebp 1.3.2), gs 10.02.1, pdfinfo 24.02.0
# NOT present: magick (use `convert`), cwebp (not needed — convert exports WebP)
```

## Package Legitimacy Audit

**Not applicable.** This phase installs **zero** new npm packages and zero new system packages. All image tooling (`pdftoppm`, `convert`, `gs`, `pdfinfo`) is pre-installed and verified on the dev machine. The native `<dialog>` + Invoker Commands API is a browser platform feature, not a dependency. No `package.json` dependency changes are expected. If the planner introduces any package, run the Package Legitimacy Gate at that point.

## Architecture Patterns

### System Architecture Diagram

```
[ Source PDFs (OUTSIDE repo, ~/Documents/...) ]
              │  (one-off, local, during execution)
              ▼
   pdftoppm -png -r <DPI>   ──►  raw PNG (full A4 scan)
              │
              ▼
   convert raw.png -fill black \
     -draw "rectangle x1,y1 x2,y2" (×N regions)   ──►  redacted PNG (pixels burned)
              │
              ▼
   convert redacted.png -resize <W> -quality 80 out.webp  ──►  optimized WebP
              │  (commit to repo)
              ▼
   public/assets/images/qualifica-*.webp
              │
              ▼  (Astro build, static)
┌─────────────────────────────────────────────────────────────┐
│ src/pages/qualifiche.astro      src/pages/en/qualifications.astro│
│        │  useTranslations('it')          │ useTranslations('en') │
│        └──────────────┬──────────────────┘                       │
│                       ▼                                           │
│            Base.astro (head: canonical + hreflang from props)     │
│                       ▼                                           │
│   <main> H1 + intro + 3× Section{ <img> + <dialog> + Invoker btn }│
│                       │  link back home (D-13)                    │
└───────────────────────┼──────────────────────────────────────────┘
                        ▼  astro build → static HTML
              GitHub Pages (CDN) ──► Browser
                                       │ click preview → command="show-modal"
                                       ▼ native <dialog> modal (focus trap + ESC, zero author JS)
```

### Recommended Project Structure
```
src/
├── pages/
│   ├── qualifiche.astro              # NEW — IT page (mirrors index.astro)
│   └── en/
│       └── qualifications.astro      # NEW — EN page (mirrors en/index.astro)
├── layouts/
│   └── Base.astro                    # EDIT — add optional `alternates` prop for path-aware hreflang/canonical
├── components/
│   ├── Section.astro                 # REUSE unchanged
│   └── Qualification.astro           # OPTIONAL NEW — card: img + dialog + label (reduces repetition ×3)
├── i18n/
│   └── ui.ts                         # EDIT — add qualifiche.* keys (IT+EN) + linkify section.fitness.p2
└── styles/
    └── global.css                    # EDIT (small) — figure/img + dialog/::backdrop rules

public/assets/images/
├── qualifica-pesistica.webp          # NEW (redacted)
├── qualifica-pilates-reformer.webp   # NEW (redacted)
└── qualifica-pilates-cadillac.webp   # NEW (redacted)
```

### Pattern 1: Path-aware hreflang/canonical via Base.astro prop (INT-03 — RECOMMENDED)
**What:** `Base.astro` currently hardcodes `itUrl = getAbsoluteLocaleUrl('it','')` and `enUrl = getAbsoluteLocaleUrl('en','')` — i.e. both hreflang alternates always point to the site root. The home pages happen to be at the locale roots, so this is correct for them but WRONG for the new routes. The lowest-risk fix is to add an optional `alternates` prop with sensible defaults so existing callers are untouched.
**When to use:** Any non-root localized page. Home pages keep working with zero changes because the default keeps the current root behavior.
**Why this over page-level alternates:** Page-level alternates would require duplicating the `<link rel="alternate">` block and removing/overriding the ones already emitted by `Base.astro` — risk of double or conflicting tags. Centralizing in `Base.astro` keeps one source of truth and is consistent with the existing canonical logic.

**Proposed prop shape (concrete):**
```typescript
// Source: derived from current Base.astro (lines 1-24) — [VERIFIED: src/layouts/Base.astro]
interface Props {
  title: string;
  description?: string;
  // NEW: localized path pair for hreflang/canonical. Default = locale root (current behavior).
  alternates?: { it: string; en: string }; // e.g. { it: '/qualifiche', en: '/en/qualifications' }
}
const { title, description = '…', alternates } = Astro.props;

// itUrl/enUrl become path-aware; canonical already uses Astro.url.pathname (no change needed there)
const itUrl = new URL(alternates?.it ?? '/', Astro.site).toString();
const enUrl = new URL(alternates?.en ?? '/en/', Astro.site).toString();
```
- Home pages call `<Base ...>` unchanged → defaults reproduce today's `getAbsoluteLocaleUrl('it','')`/`('en','')` output (root). [Verify the default strings match the existing absolute URLs during implementation — `getAbsoluteLocaleUrl('it','')` resolves to `https://toto-castaldi.github.io/` and `('en','')` to `https://toto-castaldi.github.io/en/`.]
- Qualifiche pages pass `alternates={{ it: '/qualifiche', en: '/en/qualifications' }}`.
- `x-default` should point to the IT URL of the SAME page (currently points to `itUrl`), so it becomes path-aware automatically.
- `canonical` on line 7 already uses `Astro.url.pathname` → already correct per-page; no change required.

**Note for planner:** The language-switcher link in the body (`alternateUrl = getRelativeLocaleUrl(alternateLang, '')`, line 24) ALSO points to the locale root. On the qualifiche page, the switcher should ideally point to the OTHER language's qualifiche page, not the home. Decide whether to extend the prop to also drive the switcher (recommended for UX consistency) or accept switching to home. This is an INT-03-adjacent UX detail worth an explicit task.

### Pattern 2: Zero-author-JS accessible zoom via native `<dialog>` + Invoker Commands (D-07 — RECOMMENDED)
**What:** A trigger `<button>` with `command="show-modal" commandfor="dlg-x"` opens a native `<dialog id="dlg-x">` as a modal. The browser provides focus trap, `Escape` to close, and proper dialog ARIA semantics automatically — no author JavaScript.
**When to use:** The zoom interaction for each diploma preview.
**Example:**
```html
<!-- Source: developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API [CITED] -->
<figure>
  <!-- thumbnail is itself the trigger -->
  <button class="zoom-trigger" command="show-modal" commandfor="dlg-pesistica"
          aria-label={t('qualifiche.zoom.pesistica')}>
    <img src="/assets/images/qualifica-pesistica.webp"
         width="900" height="1273" loading="lazy" decoding="async"
         alt={t('qualifiche.alt.pesistica')} />
  </button>
  <figcaption>…label + body + date (D-08/D-11)…</figcaption>

  <dialog id="dlg-pesistica" class="zoom-dialog">
    <button class="zoom-close" command="close" commandfor="dlg-pesistica"
            aria-label={t('qualifiche.close')}>×</button>
    <img src="/assets/images/qualifica-pesistica.webp"
         width="900" height="1273"
         alt={t('qualifiche.alt.pesistica')} />
  </dialog>
</figure>
```
- `command="show-modal"` triggers the equivalent of `dialog.showModal()` → native focus trap + ESC close [VERIFIED: behavior of `showModal()` per MDN `<dialog>`].
- `command="close"` closes it. A visible close button satisfies "click to close".
- **Backdrop-click-to-close is NOT automatic.** Options: (a) accept ESC + close-button only (fully accessible, simplest); (b) add the smallest `is:inline` JS listener (`dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); })`) — the project already permits minimal JS for theme/lang, so this is in keeping with conventions. Recommend (a) for the strict zero-JS goal, document (b) as the UX upgrade.
- `::backdrop` pseudo-element styles the dim overlay with pure CSS.
- Baseline (all major browsers) since **December 2025** [CITED: MDN Invoker_Commands_API; InfoQ 2026-01 — Safari 26.2, Chrome 135, Firefox 144].

**Tradeoff vs literal D-07 wording:** D-07 specifies the CSS `:target`/checkbox hack. That hack cannot pass the a11y bar D-07 itself requires. This pattern reaches the same "zero author JS" intent with native a11y. Planner must surface this substitution explicitly (it is exactly the "flag it and propose a fallback" escape hatch D-07 anticipates).

### Pattern 3: Pure-HTML fallback — link to full-resolution image (D-07 fallback, zero-risk)
**What:** Make each preview a standard `<a href="/assets/images/qualifica-x.webp">` wrapping the `<img>`. Clicking opens the full image in the browser's native viewer, which has full zoom/pan and zero a11y concerns.
**When to use:** If Invoker Commands Baseline (Dec 2025) is judged too new for the audience, or to guarantee Lighthouse 100 with no platform-feature dependency. Use descriptive link text/`aria-label` (project's existing "descriptive links" decision).
**Example:**
```html
<a href="/assets/images/qualifica-pesistica.webp" aria-label={t('qualifiche.view.pesistica')}>
  <img src="/assets/images/qualifica-pesistica.webp" width="900" height="1273"
       loading="lazy" decoding="async" alt={t('qualifiche.alt.pesistica')} />
</a>
```
- Combined with the viewport meta already in `Base.astro` (no `user-scalable=no`, no `maximum-scale` → zoom allowed) [VERIFIED: Base.astro line 52], this is the most accessible possible zoom [CITED: unlighthouse.dev viewport guidance].

### Anti-Patterns to Avoid
- **Pure-CSS `:target`/checkbox lightbox for a modal:** no focus trap, no native ESC, no dialog semantics → fails WCAG keyboard/focus requirements and risks the Accessibility/Best-Practices score [VERIFIED: WebAIM keyboard; code-accessible.com; CSS-Tricks focus management]. The CSS hack is fine for trivial non-modal toggles, not for an image modal that must be accessible.
- **CSS-only "blur" or `filter: blur()` redaction:** reversible, and forbidden by D-04. Redaction MUST be burned into source pixels.
- **Copying the source PDFs into `public/` or `src/`:** violates QUAL-04 (no published/downloadable original). Only redacted rasters enter the repo.
- **`<img>` without explicit `width`/`height`:** causes CLS, threatens Performance 100. Always set intrinsic dimensions.
- **Eager-loading all three diploma images:** use `loading="lazy"` on previews to protect LCP/Performance.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal focus trap / ESC / ARIA | Custom JS or CSS `:target` modal | Native `<dialog>` + Invoker Commands | Browser handles focus trap, ESC, `aria-modal`, return-focus natively [CITED: MDN dialog] |
| hreflang reciprocity | Hand-written `<link>` per page duplicating logic | Parametrized `Base.astro` (single source of truth) | Avoids conflicting/duplicate alternate tags |
| Locale URL construction | String concatenation of `/en/...` | `new URL(path, Astro.site)` / `getRelativeLocaleUrl` | Correct base/trailing-slash handling |
| PDF rasterization | Custom render | `pdftoppm` | Battle-tested poppler renderer |
| Burning redaction into pixels | Manual byte editing | ImageMagick `convert -draw rectangle` | Flattens into raster irreversibly |
| WebP encoding | Separate `cwebp` (absent) | `convert ... out.webp` | ImageMagick has libwebp 1.3.2 delegate [VERIFIED] |

**Key insight:** Every "interactive modal" pitfall in this domain has already been solved by the browser. The temptation to satisfy the literal "CSS-only" wording with the `:target` hack trades away exactly the accessibility the requirement demands. The native dialog + declarative invoker is both simpler and more correct.

## Common Pitfalls

### Pitfall 1: CSS `:target` lightbox silently degrades accessibility score
**What goes wrong:** The page looks fine, but keyboard users can't escape the "modal", focus leaks to the page behind it, and screen readers don't announce a dialog. Lighthouse (axe-core) and manual audits flag it; Best-Practices/Accessibility drops below 100.
**Why it happens:** `:target`/checkbox toggles visibility only — no focus management or semantics exist in CSS.
**How to avoid:** Use native `<dialog>` (Pattern 2) or the `<a href>` fallback (Pattern 3).
**Warning signs:** Tab moves behind the overlay; ESC does nothing; no `role="dialog"`/`aria-modal` in the accessibility tree.

### Pitfall 2: Image weight / missing dimensions tanks Performance 100
**What goes wrong:** High-DPI A4 scans are huge; without resizing/compression and explicit `width`/`height`, LCP and CLS regress.
**Why it happens:** `pdftoppm` at 300 DPI produces ~2480×3508 px multi-MB PNGs.
**How to avoid:** Render at moderate DPI, resize the published preview to a sensible max width (~900–1100 px), export WebP at quality ~78–82, set explicit `width`/`height`, `loading="lazy"`, `decoding="async"`. Optionally serve a smaller thumbnail and a larger image inside the dialog.
**Warning signs:** Any single image > ~150 KB; Lighthouse "Properly size images" / "Serve images in next-gen formats" / CLS warnings.

### Pitfall 3: hreflang now points to the wrong page
**What goes wrong:** Because `Base.astro` hardcodes alternates to the locale root, the new pages would declare the home pages as their IT/EN alternates → INT-03 fails, confuses search engines.
**Why it happens:** Existing alternates were written when only home pages existed.
**How to avoid:** Pattern 1 (path-aware prop). Verify with the hreflang reciprocity check in Validation.
**Warning signs:** `/qualifiche` emits `<link rel="alternate" hreflang="en" href=".../en/">` instead of `.../en/qualifications`.

### Pitfall 4: Redaction visible-but-not-burned, or wrong coordinates
**What goes wrong:** Rectangles drawn in the wrong place, or applied only via CSS overlay (reversible) → PII leaks; violates D-01/D-02/D-04.
**Why it happens:** Coordinates differ per diploma; orientation differs (Pesistica portrait, Pilates landscape — see below); CSS overlay is reversible.
**How to avoid:** Render each image first, open it, read pixel coordinates of each signature + N.39740, then draw opaque rectangles into the source raster with `convert -draw`. Re-open the OUTPUT to visually confirm the original is gone. Never ship a CSS-only cover.
**Warning signs:** Signature faintly visible at edges of rectangle; opening the published file in an editor reveals underlying pixels (it must not).

## Code Examples

### PDF → redacted, optimized WebP pipeline (per diploma)
```bash
# Source: poppler/ImageMagick man pages + verified tool availability [VERIFIED: tools present]
# NOTE ORIENTATION (verified via pdfinfo):
#   diploma-pesistica-toto.pdf            595 x 841 pts  → A4 PORTRAIT
#   diploma-toto-pilates-reformer-1.pdf   841 x 595 pts  → A4 LANDSCAPE
#   diploma-toto-pilates-cadillac-1.pdf   841 x 595 pts  → A4 LANDSCAPE

# 1) Rasterize at moderate DPI (200 DPI → ~1654x2339 portrait / 2339x1654 landscape). -png, single page.
pdftoppm -png -r 200 -singlefile \
  ~/Documents/pt/diploma-pesistica-toto.pdf /tmp/pesistica-raw
# produces /tmp/pesistica-raw.png

# 2) Inspect to find redaction coordinates (open the PNG, note pixel x1,y1 x2,y2 of each region).
identify /tmp/pesistica-raw.png   # confirm exact px dimensions before computing coords

# 3) Burn OPAQUE rectangles into pixels (D-04). One -draw per region. Use a theme-coherent fill.
#    Coordinates below are PLACEHOLDERS — determine real ones from step 2.
convert /tmp/pesistica-raw.png \
  -fill '#1a1a1a' \
  -draw "rectangle X1,Y1 X2,Y2" \   # signature: Alessandra Caligaris
  -draw "rectangle X3,Y3 X4,Y4" \   # signature: Prof. Gian Francesco Lupattelli
  -draw "rectangle X5,Y5 X6,Y6" \   # register number N.39740 (bottom-right)
  /tmp/pesistica-redacted.png

# 4) Resize + export optimized WebP at contained width (protects Performance 100).
convert /tmp/pesistica-redacted.png \
  -resize 1000x \
  -strip -quality 80 -define webp:method=6 \
  public/assets/images/qualifica-pesistica.webp

# 5) VERIFY irreversibility: re-open the OUTPUT and confirm the redacted areas are flat fill.
identify -verbose public/assets/images/qualifica-pesistica.webp | head -20
```
- Pilates diplomas: same flow, single-signature (Cristian Campana) on each, no register number. Landscape → resize `1000x` width is fine; record the resulting `height` for the `<img>` tag.
- Choose the published `width`/`height` from the FINAL WebP (`identify`) and hardcode them in the `<img>`.

### i18n: linkify the Fitness paragraph (D-12, INT-01)
```typescript
// Source: src/i18n/ui.ts existing pattern (set:html paragraphs) [VERIFIED]
// IT — turn "Personal Trainer" / "istruttore di Pilates" into a link to /qualifiche
'section.fitness.p2':
  'Lavoro come <a href="/qualifiche">Personal Trainer e come istruttore di Pilates</a> in due palestre dell\'interland milanese.',
// EN — link to /en/qualifications
'section.fitness.p2':
  'I work as a <a href="/en/qualifications">Personal Trainer and Pilates instructor</a> at two gyms in the Milan metropolitan area.',
```
- The home pages already render `section.fitness.p2` with `<p>{t(...)}</p>` (IT index.astro line 46) and `<p>{t(...)}</p>` (EN). To render the embedded `<a>`, switch those to `<p set:html={t('section.fitness.p2')} />` (the pattern already used for `entrepreneurship.p1`/`cs.p2`). Small but required edit to both `index.astro` and `en/index.astro`.

### New i18n keys to add (shape)
```typescript
// add under it: {...} and en: {...}
'qualifiche.title': 'Qualifiche' / 'Qualifications',
'qualifiche.description': '<SEO meta description IT/EN>',
'qualifiche.intro': 'Le mie certificazioni come Personal Trainer e istruttore di Pilates.' / 'My certifications as a Personal Trainer and Pilates instructor.',
'qualifiche.back': '← Torna alla home' / '← Back to home',
'qualifiche.pesistica.label': 'Personal Trainer' / 'Certified Fitness Trainer',     // D-09
'qualifiche.pesistica.body': 'MSP Italia — 05/12/2025',
'qualifiche.reformer.label': 'Pilates Reformer Liv.1' / 'Pilates Reformer Level 1', // D-10
'qualifiche.reformer.body': 'Zen Studio Pilates — 16/11/2025',
'qualifiche.cadillac.label': 'Pilates Cadillac Liv.1' / 'Pilates Cadillac Level 1',
'qualifiche.cadillac.body': 'Zen Studio Pilates — 21/02/2026',
'qualifiche.alt.pesistica': '<descriptive WCAG-AA alt IT/EN>',   // QUAL-06
'qualifiche.alt.reformer': '…',
'qualifiche.alt.cadillac': '…',
// if using native dialog (Pattern 2):
'qualifiche.zoom.pesistica': 'Ingrandisci il diploma …' / 'Enlarge the … diploma',
'qualifiche.close': 'Chiudi' / 'Close',
```
- `useTranslations` typing keys off `keyof (typeof ui)['it']` [VERIFIED: utils.ts] — keys MUST exist in BOTH `it` and `en` blocks or TypeScript build fails. Good guardrail.

## Runtime State Inventory

This is a greenfield additive phase (new pages + new assets), not a rename/refactor. The Runtime State Inventory categories do not apply. Verified by inspection: no datastores, no live external service config, no OS-registered state, no env/secret renames, no build-artifact renames are involved. The only "state" added is static files committed to the repo (`public/assets/images/*.webp`, new pages, ui.ts keys) plus a one-time local image-conversion run whose only persisted output is the committed WebPs.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS `:target`/checkbox lightbox for zero-JS modals | Native `<dialog>` + Invoker Commands (`command`/`commandfor`) | Baseline Dec 2025 (Chrome 135 / Firefox 144 / Safari 26.2) | Zero author JS AND native a11y — makes the old hack obsolete for modals |
| `cwebp` separate binary | `convert ... out.webp` (libwebp delegate) | Long-standing in ImageMagick builds | One tool for redaction + encode; `cwebp` not needed (absent here) |

**Deprecated/outdated:**
- Author-JS focus-trap libraries for simple image modals: unnecessary given native `<dialog>`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `getAbsoluteLocaleUrl('it','')` currently resolves to `https://toto-castaldi.github.io/` (and `('en','')` to `.../en/`), so the default `alternates` of `'/'` and `'/en/'` reproduce today's output exactly | Pattern 1 | If trailing-slash differs, home-page hreflang could change subtly — verify emitted HTML for `/` and `/en/` is byte-identical before/after the refactor |
| A2 | 200 DPI gives a legible diploma scan at ~1000 px published width while keeping each WebP under ~150 KB | Code Examples / Pitfall 2 | Too low → unreadable text; too high → Performance risk. Tune DPI/quality during execution and re-check Lighthouse |
| A3 | Invoker Commands Baseline (Dec 2025) is acceptable for this site's audience | Pattern 2 | If audience has very old browsers, the dialog won't open. Mitigation: Pattern 3 fallback (`<a href>` to image) works everywhere |
| A4 | The diplomas' redaction regions are simple rectangles coverable without obscuring "Antonio Castaldi" (D-03) or the body/date text | Code Examples | If a signature overlaps the visible name, redaction geometry needs care — inspect at step 2 |

**Note:** D-01/D-02/D-04/D-05 (what to redact) are user-locked decisions, NOT assumptions — they were verified with the user. The assumptions above concern only technical execution parameters.

## Open Questions

1. **Backdrop-click-to-close on the dialog**
   - What we know: native `<dialog>` gives ESC + focus trap for free; backdrop click does NOT close by default.
   - What's unclear: whether the strict zero-JS goal forbids the 1-line `is:inline` listener that adds backdrop-close.
   - Recommendation: ship ESC + visible close-button only (fully accessible, zero JS); treat backdrop-close as an optional UX nicety the planner can add as minimal `is:inline` JS (consistent with the project's existing minimal-JS allowance).

2. **Language switcher target on the qualifiche page**
   - What we know: `Base.astro`'s switcher links to the locale root, not the current page's counterpart.
   - What's unclear: whether to extend the `alternates` prop to also drive the switcher.
   - Recommendation: drive the switcher from the same prop so EN↔IT switching stays on the qualifiche pages (better UX, satisfies the spirit of INT-03).

3. **Single image vs thumbnail+large pair**
   - What we know: one WebP can serve both preview and dialog.
   - What's unclear: whether a separate smaller thumbnail is worth it for Performance.
   - Recommendation: start with one ~1000 px WebP per diploma for both; only split if Lighthouse Performance dips.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `pdftoppm` (poppler) | PDF rasterization | ✓ | 24.02.0 | `gs` |
| `convert` (ImageMagick) | Redaction + WebP export | ✓ | 6.9.12-98 Q16 (libwebp 1.3.2) | `gs` + manual |
| `pdfinfo` (poppler) | Confirm page dims/orientation | ✓ | 24.02.0 | open PDF manually |
| `gs` (ghostscript) | Alt rasterizer | ✓ | 10.02.1 | — |
| Node | Astro build | ✓ | 22.20.0 | — |
| Source PDFs | Redaction inputs | ✓ | all 3 present (~/Documents/pt, ~/Documents/pilates) | — |
| `magick` | (not needed) | ✗ | — | use `convert` |
| `cwebp` | (not needed) | ✗ | — | `convert` exports WebP |

**Missing dependencies with no fallback:** None — every required tool is present.
**Missing dependencies with fallback:** `magick`/`cwebp` absent but unnecessary (`convert` covers both).

## Validation Architecture

> nyquist_validation is enabled (key absent in config → treated as enabled). The repo has NO automated test framework (no vitest/jest/playwright, no test dir) — validation here is build + audit based, which is appropriate for a static content site. Wave 0 introduces no test framework; instead it relies on `astro build`, grep-based HTML assertions, and Lighthouse.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed (static site). Validation = `astro build` + output HTML assertions + Lighthouse |
| Config file | none — see Wave 0 |
| Quick run command | `npm run build` (fails on missing i18n keys / broken refs) |
| Full suite command | `npm run build && npm run preview` + Lighthouse audit on both routes |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| QUAL-01 | `/qualifiche` builds & renders | build/smoke | `npm run build && test -f dist/qualifiche/index.html` | ❌ Wave 0 (page) |
| QUAL-02 | `/en/qualifications` builds & renders | build/smoke | `test -f dist/en/qualifications/index.html` | ❌ Wave 0 (page) |
| QUAL-03 | 3 previews with labels present | grep | `grep -c 'qualifica-' dist/qualifiche/index.html` (≥3 img refs) | ❌ Wave 0 |
| QUAL-04 | No original PDF published; redaction burned | manual + grep | `! find dist public -name '*.pdf'` AND visual confirm redacted WebP | ❌ Wave 0 |
| QUAL-05 | Reuses Base/Section + dark mode | build + visual | builds with shared layout; manual dark-mode toggle | ❌ Wave 0 |
| QUAL-06 | Descriptive alt-text on each img | grep + manual | `grep -o 'alt="[^"]*"' dist/qualifiche/index.html` non-empty/descriptive | ❌ Wave 0 |
| INT-01 | Fitness link reaches page (IT&EN) | grep | `grep 'href="/qualifiche"' dist/index.html` & EN equivalent | ❌ Wave 0 |
| INT-02 | All strings from dictionary | build | TS build fails if any key missing in it/en | ✓ (compiler enforces) |
| INT-03 | Reciprocal hreflang for new routes | grep assertion | see hreflang reciprocity check below | ❌ Wave 0 |
| INT-04 | Lighthouse 100/100/100/100 | audit | Lighthouse on built `/qualifiche` & `/en/qualifications` | ❌ Wave 0 (manual/CLI) |

**hreflang reciprocity check (INT-03):**
```bash
# /qualifiche must declare EN alternate = /en/qualifications, and vice-versa
grep 'hreflang="en"' dist/qualifiche/index.html | grep -q 'en/qualifications'
grep 'hreflang="it"' dist/en/qualifications/index.html | grep -q '/qualifiche'
# home pages must STILL point to roots (no regression)
grep 'hreflang="en"' dist/index.html | grep -q 'github.io/en/'
```

### Sampling Rate
- **Per task commit:** `npm run build` (catches missing keys, bad refs, type errors).
- **Per wave merge:** `npm run build` + grep assertions above + `identify public/assets/images/qualifica-*.webp` (confirm size/dims).
- **Phase gate:** full `npm run build && npm run preview` green + Lighthouse 100/100/100/100 on BOTH routes (light & dark) before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] No test framework needed — do NOT install one (static content site; build+audit is the right validation). If the planner wants automated Lighthouse, `@lhci/cli` could be added, but it is optional and would be the only new dependency (gate behind verification).
- [ ] Establish the grep/identify assertion snippets above as the verification checklist.

## Security Domain

> `security_enforcement` not set in config → treated as enabled. This is a static, no-backend, no-auth, no-input site. Most ASVS categories are N/A; the live concern is privacy/PII redaction (a data-exposure issue, addressed by QUAL-04/D-01..D-05).

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — (no auth) |
| V3 Session Management | no | — (no sessions) |
| V4 Access Control | no | — (fully public static site) |
| V5 Input Validation | no | — (no user input/forms) |
| V6 Cryptography | no | — (no secrets handled) |
| Data protection / PII | **yes** | Irreversible pixel-level redaction of third-party PII before publication; source PDFs never committed (QUAL-04, D-04) |

### Known Threat Patterns for this stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Reversible redaction (CSS overlay / blur) leaks PII | Information Disclosure | Burn opaque rectangles into source raster; re-verify output; never CSS-only (D-04) |
| Original PDF accidentally committed/published | Information Disclosure | Keep PDFs outside repo; `find dist public -name '*.pdf'` must return nothing (QUAL-04) |
| EXIF/metadata in exported image leaking source info | Information Disclosure | `convert -strip` removes metadata (already in pipeline) |
| XSS via `set:html` dictionary strings | Tampering | Strings are author-controlled (no user input) — low risk, but keep `set:html` content authored-only |

## Sources

### Primary (HIGH confidence)
- Repo files (read directly): `src/layouts/Base.astro`, `src/components/Section.astro`, `src/i18n/ui.ts`, `src/i18n/utils.ts`, `src/pages/index.astro`, `src/pages/en/index.astro`, `astro.config.mjs`, `src/styles/global.css`, `.github/workflows/deploy.yml`, `package.json`
- Tool/PDF verification: `pdftoppm -v` (24.02.0), `convert -version`/`-list format` (ImageMagick 6.9.12, libwebp 1.3.2), `gs --version` (10.02.1), `pdfinfo` on all 3 PDFs (orientation confirmed), `identify` on existing thumbnails
- MDN — Invoker Commands API (`command`/`commandfor`, `show-modal`/`close`), Baseline Dec 2025: https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
- MDN — `<dialog>` element (`showModal()` native focus trap + ESC, `::backdrop`): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog

### Secondary (MEDIUM confidence)
- InfoQ — "HTML Invoker Commands Achieve Baseline Support" (Safari 26.2 / Chrome 135 / Firefox 144), 2026-01: https://www.infoq.com/news/2026/01/html-invoker-commands/
- WebAIM Keyboard Accessibility (why CSS-only modals fail): https://webaim.org/techniques/keyboard/
- Code: Accessible — Lightbox pattern: https://codeaccessible.com/codepatterns/lightbox/
- CSS-Tricks — Focus management and inert: https://css-tricks.com/focus-management-and-inert/
- unlighthouse — accessibility/viewport (zoom allowed = accessible image): https://unlighthouse.dev/learn-lighthouse/accessibility

### Tertiary (LOW confidence)
- DEV.to / W3Tweaks dialog guides (corroborating, not authoritative)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tooling and versions verified on-machine; Astro/i18n verified from repo
- Architecture (pages, i18n, path-aware hreflang): HIGH — derived directly from existing code patterns
- Zoom approach: MEDIUM-HIGH — native dialog + invoker is correct and Baseline, but Baseline is recent (Dec 2025); fallback documented
- Redaction pipeline: HIGH on commands/format; coordinates intentionally deferred to execution (per phase note)
- Pitfalls: HIGH — cross-verified across authoritative a11y sources

**Research date:** 2026-06-03
**Valid until:** 2026-07-03 (stable static stack; re-check Invoker Commands browser support if audience skews to old browsers)
