---
phase: 07-pagina-qualifiche-multilingua
reviewed: 2026-06-03T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - src/i18n/ui.ts
  - src/layouts/Base.astro
  - src/pages/index.astro
  - src/pages/en/index.astro
  - src/pages/qualifiche.astro
  - src/pages/en/qualifications.astro
  - src/styles/global.css
findings:
  critical: 0
  warning: 3
  info: 4
  total: 7
status: issues_found
---

# Phase 7: Code Review Report

**Reviewed:** 2026-06-03
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Reviewed the Phase 07 multilingual qualifiche work: two new pages (`qualifiche.astro`, `en/qualifications.astro`), the path-aware `alternates` prop in `Base.astro`, new `qualifiche.*` i18n keys (IT + EN), the linkified Fitness paragraph rendered via `set:html`, and the figure/dialog/zoom CSS in `global.css`.

No critical security or correctness defects were found. As noted in scope, `set:html` is applied only to author-controlled dictionary strings with no user input, so the XSS surface is not a concern here. All three referenced image assets exist in `public/assets/images/`.

The substantive concerns are functional and SEO-related: the zoom interaction relies entirely on the very new Invoker Commands API (`command`/`commandfor`) with no JavaScript fallback, leaving a dead interactive control on older browsers; and the canonical URL (derived from `Astro.url.pathname`) and the hardcoded hreflang/alternate URLs use inconsistent trailing-slash forms.

## Warnings

### WR-01: Zoom dialog depends on Invoker Commands API with no fallback — dead control on older browsers

**File:** `src/pages/qualifiche.astro:42-68`, `src/pages/en/qualifications.astro:42-68`
**Issue:** The zoom open/close uses the Invoker Commands API attributes `command="show-modal"` / `command="close"` with `commandfor`. This API only reached baseline browser support in mid-2025 (Chrome 135+, Safari 18.4+, Firefox 140+). On any browser without it, the `<button class="zoom-trigger">` performs no action — the `<dialog>` is never opened, and `.zoom-close` cannot close it. The preview image itself still renders inside the `<figure>`, so content is not lost, but the button advertises `aria-label="Enlarge…"` / `cursor: zoom-in` and then does nothing, which is a broken affordance. There is no `<script>` providing a `showModal()`/`close()` fallback.
**Fix:** Add a tiny progressive-enhancement script that wires the same behaviour for browsers lacking Invoker Commands, e.g.:
```html
<script>
  if (!('command' in HTMLButtonElement.prototype)) {
    document.querySelectorAll('.zoom-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.getElementById(btn.getAttribute('commandfor'))?.showModal();
      });
    });
    document.querySelectorAll('.zoom-close').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.getElementById(btn.getAttribute('commandfor'))?.close();
      });
    });
  }
</script>
```
Alternatively, document an explicit decision to require the modern API and accept the no-zoom degradation.

### WR-02: Canonical URL and hreflang/alternate URLs use inconsistent trailing-slash forms

**File:** `src/layouts/Base.astro:8,17-18,25-27`
**Issue:** `canonicalURL` is built from `Astro.url.pathname`, while `itUrl`/`enUrl` (hreflang) and `alternateUrl` (lang switcher) are built from the hardcoded `alternates` values `/qualifiche` and `/en/qualifications` (no trailing slash). Astro's static build (default `trailingSlash: 'ignore'`) emits these routes as directories, and `Astro.url.pathname` commonly carries a trailing slash (e.g. `/qualifiche/`). The result is that the same page can advertise `canonical = …/qualifiche/` but `hreflang it = …/qualifiche`, i.e. two different URL strings for one page. Search engines treat trailing-slash variants as distinct URLs, which dilutes the canonical/hreflang signal this phase intends to establish.
**Fix:** Normalise both sides to one form. Either give the `alternates` values trailing slashes to match the emitted routes (`it: '/qualifiche/'`, `en: '/en/qualifications/'`) and likewise the back/intro links, or strip the trailing slash from `canonicalURL`. Verify against the actual `dist/` output after `astro build` and pick the form Astro emits so canonical and hreflang are byte-identical.

### WR-03: `defaultLang` fallback in `useTranslations` can silently emit the wrong language

**File:** `src/i18n/utils.ts:10-12`
**Issue:** `t` returns `ui[lang][key] || ui[defaultLang][key]`. The `||` fallback means any missing or empty-string EN value silently renders the Italian string instead of failing or warning. With the new `qualifiche.*` keys this is a real risk: a future edit that removes or empties an EN key will render Italian text on the English page with no error at build time. (Today both dictionaries are complete, so no current mis-render — hence WARNING, not BLOCKER.)
**Fix:** Drop the cross-language fallback for present-but-empty values, or make the fallback explicit and logged. Minimal version:
```ts
return function t(key: keyof (typeof ui)[typeof defaultLang]) {
  const value = ui[lang][key];
  return value !== undefined ? value : ui[defaultLang][key];
};
```
Better long-term: add a build-time check that every key exists (non-empty) in every locale.

## Info

### IN-01: Three image `src` paths duplicated per qualifica between preview and dialog

**File:** `src/pages/qualifiche.astro:50,70`, `src/pages/en/qualifications.astro:50,70`
**Issue:** Each qualifica renders the identical `src`/`width`/`height`/`alt` `<img>` twice (preview button + dialog). The path-building literal `/assets/images/${q.file}` and the alt key are repeated. Low risk, but a path or attribute change must be made in two places.
**Fix:** Compute `const imgSrc = \`/assets/images/${q.file}\`` once per item, or factor a small `<QualificaImage>` component, so preview and dialog stay in sync.

### IN-02: Entire qualifiche page body is duplicated across IT and EN files

**File:** `src/pages/qualifiche.astro` vs `src/pages/en/qualifications.astro`
**Issue:** The two page files are byte-identical except for the `useTranslations('it'|'en')` argument and the back-link `href` (`/` vs `/en/`). The `qualifiche` data array (slugs, filenames, dimensions) is copy-pasted. A future change (new qualifica, changed dimensions) must be applied to both files, and drift between them would not be caught.
**Fix:** Extract the shared markup + data array into a component or shared module that both route files import, parameterised by `lang` and home href.

### IN-03: Magic image dimensions inline in the data array

**File:** `src/pages/qualifiche.astro:8-27`, `src/pages/en/qualifications.astro:8-27`
**Issue:** `width`/`height` are hardcoded per item with no source-of-truth link to the actual `.webp` files. If an asset is re-exported at a different size, the layout-shift-prevention `width`/`height` become wrong silently.
**Fix:** Acceptable for a static site, but consider deriving dimensions from the asset (Astro's `<Image>`/`getImage` or `astro:assets`) so they cannot drift from the real files.

### IN-04: `getLangFromUrl`/`useTranslations` are unused in the qualifiche route files

**File:** `src/pages/qualifiche.astro:6`, `src/pages/en/qualifications.astro:6`
**Issue:** The pages hardcode `useTranslations('it')` / `useTranslations('en')` rather than deriving the language from the URL via `getLangFromUrl(Astro.url)` (as `Base.astro` does). This is consistent with the existing `index.astro` pattern, so it is not a defect, but the two language-detection strategies coexist in the codebase (URL-derived in the layout, hardcoded in pages), which is a minor inconsistency a maintainer should be aware of.
**Fix:** None required. Optionally standardise on one approach for clarity.

---

_Reviewed: 2026-06-03_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
