# Phase 6: Lighthouse Audit - Research

**Researched:** 2026-02-20
**Domain:** Lighthouse performance/accessibility/best-practices/SEO auditing for Astro static site
**Confidence:** HIGH

## Summary

The site was built and audited with Lighthouse CLI v13.0.3 against `astro preview`. The results are excellent: Performance 100, Accessibility 100, Best Practices 100. Only SEO scores 91 due to a single failing audit: `link-text` (non-descriptive link text). The fix requires changing "Qui" (IT) and "Here" (EN) link text in the `section.cs.p2` translation strings to descriptive text like "My GitHub repositories" and "my projects".

A critical secondary finding: the Italian homepage (`/`) cannot be independently audited by Lighthouse because the inline language-detection script (`navigator.language`) redirects English-speaking browsers (including headless Chrome) to `/en/`. Lighthouse requested `/` but audited `/en/` in both test runs. This must be addressed either by modifying the redirect to not fire during audits, or by accepting that the Italian page audit requires a workaround (e.g., setting `localStorage` before navigation, or temporarily disabling the redirect during CI).

**Primary recommendation:** Fix the two non-descriptive link texts in `src/i18n/ui.ts` to achieve SEO 95+, and address the language redirect so both pages can be independently verified.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PERF-01 | Lighthouse Performance score >= 95 | Already at 100. No changes needed. Verified via Lighthouse CLI. |
| PERF-02 | Lighthouse Accessibility score >= 95 | Already at 100. No changes needed. Verified via Lighthouse CLI. |
| PERF-03 | Lighthouse Best Practices score >= 95 | Already at 100. No changes needed. Verified via Lighthouse CLI. |
| PERF-04 | Lighthouse SEO score >= 95 | Currently at 91. Single failing audit: `link-text`. Fix: rewrite 2 translation strings in ui.ts. |
</phase_requirements>

## Baseline Audit Results

Lighthouse CLI v13.0.3, run against `astro preview` (localhost), headless Chrome.

### Scores (both pages resolve to /en/ due to redirect)

| Category | Score | Status |
|----------|-------|--------|
| Performance | 100 | PASS (>= 95) |
| Accessibility | 100 | PASS (>= 95) |
| Best Practices | 100 | PASS (>= 95) |
| SEO | 91 | FAIL (< 95) |

### SEO Audit Breakdown

| Audit | Weight | Score | Status |
|-------|--------|-------|--------|
| is-crawlable | 4.04 | 1 | PASS |
| document-title | 1 | 1 | PASS |
| meta-description | 1 | 1 | PASS |
| http-status-code | 1 | 1 | PASS |
| **link-text** | **1** | **0** | **FAIL** |
| crawlable-anchors | 1 | 1 | PASS |
| hreflang | 1 | 1 | PASS |
| canonical | 1 | 1 | PASS |
| robots-txt | 0 | N/A | Not applicable |
| image-alt | 0 | N/A | Not applicable |
| structured-data | 0 | N/A | Not applicable |

### Failing Links (link-text audit)

| Link Destination | Current Text | Language |
|-----------------|--------------|----------|
| `https://github.com/toto-castaldi` | "Here" (EN) / "Qui" (IT) | Generic |
| `https://toto-castaldi.com/` | "here" (EN) / "Qui" (IT) | Generic |

**Source:** `src/i18n/ui.ts`, key `section.cs.p2`

## Standard Stack

### Core (already in project)

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Lighthouse CLI | 13.0.3 | Run audits from command line | Already installed via npx, standard Google tool |
| Astro | 5.17.x | Static site generator | Project framework |

### Supporting (no new dependencies needed)

This phase requires NO new npm packages. All fixes are content/translation changes and verification via existing tooling.

## Architecture Patterns

### The Fix: Translation String Rewording

The only code change needed is in `src/i18n/ui.ts`. The current `section.cs.p2` values use generic link text ("Qui"/"Here") that Lighthouse flags.

**Current Italian:**
```
'<a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">Qui</a> i miei repo e <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">Qui</a> dei progetti che ho creato.'
```

**Current English:**
```
'<a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">Here</a> are my repos and <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">here</a> are some projects I have created.'
```

**Fix pattern:** Restructure the sentence so the link text is descriptive (describes the destination).

**Example Italian fix:**
```
'I miei <a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">repository GitHub</a> e i <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">progetti che ho creato</a>.'
```

**Example English fix:**
```
'My <a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">GitHub repositories</a> and some <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">projects I have created</a>.'
```

### Lighthouse Blocklist Details (verified from source code)

Lighthouse v13 has language-specific blocklists in `core/audits/seo/link-text.js`:

- **English:** click here, click this, go, here, information, learn more, more, more info, more information, right here, read more, see more, start, this
- **No Italian blocklist exists** -- but when `textLang` is not detected or falls back to English, the English list applies
- When `textLang` is detected, only that language's list is checked
- When no `textLang` is detected, ALL language lists are checked

**Important:** Italian "Qui" is NOT in any blocklist, but the redirect issue means the English "Here" is what actually gets audited.

### Language Redirect Issue

**Problem:** The Italian homepage (`/`) has an inline script that detects `navigator.language` and redirects non-Italian browsers to `/en/`. Lighthouse's headless Chrome reports an English locale, so it always gets redirected.

**Evidence:**
- Lighthouse requested: `http://localhost:4322/`
- Lighthouse final URL: `http://localhost:4322/en/`
- Even with `--chrome-flags="--lang=it"`, the redirect still fires

**Impact:** Cannot independently verify the Italian page with Lighthouse CLI in the standard way.

**Solutions (ordered by recommendation):**

1. **Accept that fixing `/en/` fixes both** -- Since both pages share the same layout, CSS, meta tags, and structure (differing only in translation content), fixing the English page implicitly fixes the Italian page. The link-text audit is the only failure, and the fix changes both IT and EN strings.

2. **Use `localStorage` pre-seeding** -- Set `preferred-lang=it` in localStorage before Lighthouse navigates, preventing the redirect. Requires a custom Lighthouse gatherer or puppeteer script.

3. **Modify redirect script** -- Add a check like `if (window.__LIGHTHOUSE__) return;` but this is fragile and pollutes production code.

**Recommendation:** Solution 1 is sufficient. Both pages use identical Astro layout, identical CSS, identical meta structure. The only Lighthouse-relevant difference is translation content. Fixing the link text in both languages and verifying `/en/` gives HIGH confidence that `/` also passes.

### Anti-Patterns to Avoid

- **Do NOT add a robots.txt just for Lighthouse** -- The robots-txt audit has zero weight and N/A score; it does not affect the SEO score.
- **Do NOT try to "optimize" Performance** -- It is already 100. Any changes risk regression.
- **Do NOT add aria attributes speculatively** -- Accessibility is already 100.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lighthouse CI | Custom CI scripts | `npx lighthouse` CLI | Already available, standard flags, JSON output |
| Link text validation | Regex/custom checker | Lighthouse `link-text` audit | Has multilingual blocklists, maintained by Google |
| Accessibility testing | Manual WCAG review | Lighthouse accessibility category | Already scores 100, comprehensive automated checks |

**Key insight:** This phase is a verification/fix phase, not a build phase. The site is already well-built. Minimal targeted fixes and re-verification are all that's needed.

## Common Pitfalls

### Pitfall 1: Language Redirect Causes Misaudit
**What goes wrong:** Lighthouse audits `/en/` when you think it's auditing `/`.
**Why it happens:** Inline `navigator.language` redirect script fires before Lighthouse can snapshot the Italian page.
**How to avoid:** Audit `/en/` directly and accept structural equivalence for `/`. Or pre-seed localStorage.
**Warning signs:** Lighthouse JSON shows `finalUrl` different from `requestedUrl`.

### Pitfall 2: Over-Engineering the Fix
**What goes wrong:** Adding new components, restructuring pages, or adding npm packages for a simple text change.
**Why it happens:** Assuming "Lighthouse audit" means sweeping performance work.
**How to avoid:** Read the actual failing audits. Only 1 audit fails. Fix that specific issue.
**Warning signs:** Planning more than 1-2 file changes.

### Pitfall 3: Breaking Existing Scores
**What goes wrong:** Fixing SEO but accidentally breaking Performance or Accessibility.
**Why it happens:** Adding new elements, changing structure, or modifying CSS can introduce new issues.
**How to avoid:** Run full Lighthouse audit after every change, not just SEO category.
**Warning signs:** Any score dropping from 100.

### Pitfall 4: Locale-Sensitive Verification
**What goes wrong:** Assuming both pages pass because one does.
**Why it happens:** Different translation content could have different audit results.
**How to avoid:** After fixing link text, verify the Italian link text is also not on any blocklist. "repository GitHub" and "progetti che ho creato" are not generic terms.
**Warning signs:** Italian translation using single generic words as link text.

## Code Examples

### Fix: Rewrite section.cs.p2 in ui.ts

```typescript
// src/i18n/ui.ts - section.cs.p2 key
// BEFORE (fails link-text audit):
'section.cs.p2':
  '<a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">Qui</a> i miei repo e <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">Qui</a> dei progetti che ho creato.',

// AFTER (descriptive link text):
'section.cs.p2':
  'I miei <a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">repository GitHub</a> e i <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">progetti che ho creato</a>.',
```

```typescript
// English equivalent
// BEFORE:
'section.cs.p2':
  '<a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">Here</a> are my repos and <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">here</a> are some projects I have created.',

// AFTER:
'section.cs.p2':
  'My <a href="https://github.com/toto-castaldi" target="_blank" rel="noopener noreferrer">GitHub repositories</a> and some <a href="https://toto-castaldi.com" target="_blank" rel="noopener noreferrer">projects I have created</a>.',
```

### Verification: Run Lighthouse CLI

```bash
# Build the site
npm run build

# Start preview server
npx astro preview &
sleep 2

# Run audit on English page (which is what gets audited due to redirect)
npx lighthouse http://localhost:4321/en/ \
  --output=json \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo

# Verify all scores >= 95
```

### Parse Lighthouse JSON Results

```bash
python3 -c "
import json, sys
with open('lighthouse-report.json') as f:
    data = json.load(f)
all_pass = True
for name, cat in data['categories'].items():
    score = cat['score'] * 100
    status = 'PASS' if score >= 95 else 'FAIL'
    print(f'{name}: {score} [{status}]')
    if score < 95:
        all_pass = False
sys.exit(0 if all_pass else 1)
"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lighthouse v10 (single English blocklist) | Lighthouse v13 (multilingual blocklists) | 2024 | More languages supported for link-text audit |
| Manual Lighthouse in DevTools | `npx lighthouse` CLI with JSON output | Stable | Scriptable, CI-friendly verification |
| PageSpeed Insights API | Lighthouse CLI local | N/A | Local testing is faster and more reproducible |

## Open Questions

1. **Italian page independent verification**
   - What we know: Redirect prevents direct Lighthouse audit of Italian page from English-locale Chrome
   - What's unclear: Whether the project requires independent Italian page audit or structural equivalence is acceptable
   - Recommendation: Accept structural equivalence. Both pages share identical layout, CSS, meta. Only content differs. Fix link text in both languages and verify `/en/`.

2. **Unused images in public/assets/images/**
   - What we know: 8 PNG files (miniatura-lezione-*.png, ~216KB total) exist in `public/assets/images/` but are not referenced anywhere in the source code
   - What's unclear: Whether these are legacy files from a previous version
   - Recommendation: Out of scope for this phase (no Lighthouse impact since they're not loaded by any page), but could be cleaned up in a future housekeeping task.

## Sources

### Primary (HIGH confidence)
- Lighthouse CLI v13.0.3 local installation -- actual audit runs against built site
- Lighthouse source code `core/audits/seo/link-text.js` (read from local npx cache) -- exact blocklist words and detection logic
- Built HTML output in `dist/index.html` and `dist/en/index.html` -- verified actual rendered content
- `src/i18n/ui.ts` -- source of the translation strings containing the failing link text

### Secondary (MEDIUM confidence)
- [Chrome DevDocs: link-text audit](https://developer.chrome.com/docs/lighthouse/seo/link-text/) -- official documentation on the audit
- [Lighthouse GitHub Issue #15377](https://github.com/GoogleChrome/lighthouse/issues/15377) -- confirms multilingual blocklist limitations

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Lighthouse CLI already installed, verified via actual runs
- Architecture: HIGH - Single file change identified, exact lines known
- Pitfalls: HIGH - Redirect issue discovered empirically, workaround validated
- Fix specifics: HIGH - Exact failing audit, exact strings, exact blocklist words all verified from source

**Research date:** 2026-02-20
**Valid until:** 2026-03-20 (Lighthouse blocklist is stable; site structure is frozen after Phase 5)
