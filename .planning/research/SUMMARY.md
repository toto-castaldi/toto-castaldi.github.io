# Project Research Summary

**Project:** toto-castaldi.github.io — personal landing page
**Domain:** Static personal landing page — Jekyll to Astro migration, GitHub Pages
**Researched:** 2026-02-19
**Confidence:** HIGH

## Executive Summary

This is a minimal personal landing page (single HTML page, four content sections, one email contact link) currently served by Jekyll/Minima on GitHub Pages. The research is unambiguous: migrate to Astro 5 with `output: 'static'` and deploy via GitHub Actions using `withastro/action@v5`. Astro's zero-JS default makes it the correct choice for a content-only page — no frameworks, no hydration, no runtime JavaScript. The migration is a full replacement of the Jekyll toolchain: delete all Ruby artifacts, write a new Astro project structure in the existing repo, and redeploy.

The recommended approach is a two-phase execution: Phase 1 scaffolds the Astro project and configures the CI/CD pipeline before any content or styling work begins; Phase 2 ports the content, applies the typography refresh, and adds polish features (Open Graph, schema.org, anchor links). This order is dictated by the pitfalls research — five of the twelve identified pitfalls occur at scaffold/CI setup time and will silently break a deployed site if handled after the fact. Getting CI correct first means every subsequent push gives immediate verified feedback.

The primary risk is the Jekyll-to-GitHub-Actions transition, specifically the GitHub Pages source setting (must be manually switched from "Deploy from branch" to "GitHub Actions" in the repo web UI). This is a well-documented, easily recoverable mistake — but it is invisible to the developer during local development, only manifesting after the first deploy. The secondary risk is configuration correctness: `site` must use HTTPS, `base` must be absent for a user repo, and `trailingSlash: 'always'` should be set on day one. All of these are single-line config decisions with no ambiguity.

## Key Findings

### Recommended Stack

Astro 5 (stable, currently at 5.17.3) is the clear choice for this project. It produces zero-JS static HTML by default, has first-class GitHub Pages support via the official `withastro/action`, and handles markdown content natively. The project requires no additional libraries beyond what Astro provides out of the box: TypeScript is bundled, scoped CSS is built-in, and CSS custom properties handle the design token system. Node 22 LTS is the correct runtime — Node 18 is EOL and Node 20 support will be dropped in Astro 6.

See `.planning/research/STACK.md` for full version compatibility tables and the complete `deploy.yml` workflow.

**Core technologies:**
- Astro 5.17.3: Static site framework — zero-JS output by default, GitHub Pages native support via official action
- Node 22 LTS: Build runtime — current LTS, avoids forced Node upgrade when Astro 6 stabilizes
- GitHub Actions + `withastro/action@v5`: CI/CD — official action auto-detects package manager, handles artifact upload, bypasses Jekyll processor
- TypeScript (Astro built-in): Type safety in frontmatter and component props — zero configuration overhead

**What NOT to use:**
- React/Vue/Svelte: No interactive requirements exist; adding any framework ships JS
- `@astrojs/tailwind`: Deprecated for Tailwind v4; project does not need it anyway
- `output: 'server'` or `'hybrid'`: Incompatible with GitHub Pages static hosting
- MDX: Overkill for a zero-JS page with no embeddable components

### Expected Features

All features are LOW complexity — this is a content page, not an application. The feature scope is tightly constrained by the existing `index.markdown` content and the zero-JS, no-analytics constraints from `PROJECT.md`. The full feature matrix is in `.planning/research/FEATURES.md`.

**Must have for launch (v1, table stakes):**
- Single HTML page with exact content from `index.markdown` — the replacement must be content-equivalent
- Semantic structure: h1 (name), h2 per section (Imprenditoria, Informatica, Fitness, CNV)
- Responsive layout — CSS only, Flexbox/grid, readable on mobile and desktop
- Improved typography — font size, line-height, max-width; upgrade over current Minima default
- Favicon (single file, 32x32 or 48x48)
- Page title and meta description in `<head>`
- External links with `rel="noopener noreferrer"` and `target="_blank"`
- Email contact link (`mailto:`)
- GitHub Actions deploy pipeline

**Should have, add after launch validation (v1.x):**
- Open Graph meta tags + static og:image (1200x630) — social sharing preview
- Section anchor links with stable `id` attributes — direct link sharing
- Structured data (schema.org Person) as a single JSON-LD block — SEO signal

**Defer to v2+:**
- Print stylesheet — valid but low priority; no one is printing this now
- CSS-only dark mode via `prefers-color-scheme` — only if design direction changes

**Anti-features (explicitly excluded):**
- Analytics, contact form, dark mode toggle (JS), blog, newsletter, comments, cookie banner, search, multi-language, social icons sidebar — all contradict the zero-JS or no-analytics constraints, or are simply out of scope per PROJECT.md.

### Architecture Approach

The architecture is minimal by design: one page, one layout, one reusable section component, one global CSS file. The build-time rendering flow goes `src/pages/index.astro` → imports `Base.astro` (HTML shell) and `Section.astro` (×4 sections) → Astro compiler → `dist/index.html` + hashed CSS. Zero JavaScript is shipped. Content is inlined directly in `index.astro` rather than using a content collection — the single page does not justify the content collection abstraction.

See `.planning/research/ARCHITECTURE.md` for full component examples, the project directory structure, and anti-pattern documentation.

**Major components:**
1. `src/pages/index.astro` — single route entry point; assembles all sections and injects content
2. `src/layouts/Base.astro` — HTML shell (`<html>`, `<head>`, `<body>`); receives `title` prop; imports global CSS; renders `<slot />`
3. `src/components/Section.astro` — reusable section wrapper with typed `title` prop and `<slot />` for body; enforces visual consistency across all four content sections
4. `src/styles/global.css` — global reset, typography tokens (CSS custom properties), spacing scale
5. `.github/workflows/deploy.yml` — replaces `jekyll.yml`; triggers on push to `master`; uses `withastro/action@v5`

**Build order (dictated by component dependencies):**
1. `astro.config.mjs` — must exist before any build
2. `src/styles/global.css` — typography base before any visual component
3. `src/layouts/Base.astro` — HTML shell depends on global.css
4. `src/components/Section.astro` — depends on layout context
5. `src/pages/index.astro` — final integration point
6. `.github/workflows/deploy.yml` — can be written in parallel; executes on push

### Critical Pitfalls

The pitfalls research identified 12 pitfalls (5 critical, 4 moderate, 3 minor). Nine of the twelve are directly related to the Jekyll-to-Astro-on-GitHub-Pages migration path. All are preventable with one-time configuration decisions. Full documentation in `.planning/research/PITFALLS.md`.

1. **Jekyll processes `_astro/` build assets and silently drops them** — Use GitHub Actions deploy (not "Deploy from branch") so the Jekyll post-processor is bypassed entirely. The site will show HTML with no CSS/JS if this is missed.

2. **GitHub Pages source not switched to "GitHub Actions"** — Manual step in repo Settings > Pages > Build and deployment. A correct workflow file does nothing if the source is still pointing at a branch. Must be done before first deploy attempt.

3. **Missing `site` in `astro.config.mjs` / HTTP instead of HTTPS** — Set `site: 'https://toto-castaldi.github.io'` on day one. The old Jekyll `_config.yml` uses `http://` — do not copy it verbatim. Canonical URLs and OG tags are silently broken without this.

4. **Setting `base` on a user repo** — `base` is only for project repos (`username.github.io/repo-name`). Omit it entirely for `toto-castaldi.github.io`. Adding it causes every route except the homepage to 404.

5. **Lockfile not committed** — `withastro/action` detects the package manager from the lockfile. Missing `package-lock.json` from git causes CI failures. Must be in the first commit alongside the workflow file.

**Checklist of "looks done but isn't" items:** See PITFALLS.md for the 10-item verification checklist to run after first deploy.

## Implications for Roadmap

Based on the combined research, two phases are sufficient. The architecture is simple enough that splitting further would create artificial milestones without meaningful deliverables.

### Phase 1: Scaffold, CI/CD, and Deploy Infrastructure

**Rationale:** Nine of the twelve pitfalls must be addressed before content work begins. CI configuration errors are only discovered at deploy time — getting deployment correct first means every subsequent content push is immediately validated in production. This is the single highest-risk phase despite being configuration-only.

**Delivers:**
- New Astro project initialized in the repo (`npm create astro@latest --template minimal`)
- `astro.config.mjs` with correct `site: 'https://toto-castaldi.github.io'`, `output: 'static'`, `trailingSlash: 'always'` — no `base`
- `.github/workflows/deploy.yml` using `withastro/action@v5` + `actions/deploy-pages@v4`
- Old Jekyll artifacts removed: `Gemfile`, `Gemfile.lock`, `_layouts/`, `_includes/`, `_sass/`, `jekyll.yml`
- GitHub Pages source manually set to "GitHub Actions" in repo settings
- `package-lock.json` committed in first push
- Node 22 pinned in `.nvmrc` and optionally in `package.json` engines
- Empty placeholder page successfully deploys to production URL

**Avoids:** Pitfalls 1, 2, 3, 4, 5, 6, 9, 11, 12

**Research flag:** Standard patterns — `withastro/action@v5` is well-documented with the official deploy guide. No additional research needed during planning.

---

### Phase 2: Content Migration, Layout, Typography, and Polish

**Rationale:** Content work can only begin once CI is verified working. This phase ports all existing content, applies the typography refresh, and adds the v1.x polish features (OG tags, anchor links, schema.org). These belong in one phase because they are all CSS/HTML work with no infrastructure dependencies on each other.

**Delivers:**
- `src/layouts/Base.astro` with full `<head>`: charset (UTF-8), viewport, title, meta description, canonical
- `src/components/Section.astro` with typed props and scoped styles
- `src/styles/global.css` with typography scale (CSS custom properties: font-size, line-height, max-width, spacing)
- `src/pages/index.astro` with all four sections (Imprenditoria, Informatica, Fitness, CNV) — content verbatim from `index.markdown` minus Jekyll frontmatter
- Favicon asset in `public/`
- External links with `rel="noopener noreferrer"`
- Responsive layout (CSS flexbox/grid, no JS)
- Open Graph meta tags + static og:image in `public/`
- Section `id` attributes for anchor links
- schema.org Person JSON-LD block in `<head>`

**Avoids:** Pitfalls 7 (content cache), 8 (Jekyll frontmatter), 10 (missing charset)

**Research flag:** Standard patterns — Astro layout/component/CSS patterns are fully documented in official docs. No additional research needed. However, verify Italian accented character rendering after first deploy (pitfall 10 checklist item).

---

### Phase Ordering Rationale

- **CI first, content second:** The pitfalls research shows nine of twelve failure modes cluster at the infrastructure layer. Discovering a Jekyll-processor issue after building a polished layout wastes effort. A verified empty deploy costs nothing and provides a safety net.
- **All content and polish in one phase:** The architecture is so simple (one page, four sections) that there is no meaningful dependency between typography setup and content porting. Splitting them would create an artificial milestone with no user-visible deliverable until both are done anyway.
- **v1.x polish included in Phase 2:** OG tags, anchor links, and schema.org are all LOW complexity, LOW risk, and have no dependencies beyond the content existing. Deferring them to a Phase 3 would be unnecessary process overhead for 30-minute additions.

### Research Flags

Phases needing deeper research during planning: **None.** Both phases use well-documented Astro and GitHub Pages patterns with official guides, official actions, and high-confidence sources.

Phases with standard patterns (no research-phase needed):
- **Phase 1:** `withastro/action@v5` deploy is covered entirely by the official Astro deploy guide
- **Phase 2:** Astro layout/component/CSS patterns are covered entirely by official Astro docs

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations verified against official Astro docs, GitHub releases, and official action repository. Version numbers confirmed as of 2026-02-19. |
| Features | HIGH | Feature scope is tightly constrained by existing content and explicit PROJECT.md constraints. No ambiguity about what to include or exclude. |
| Architecture | HIGH | All component patterns verified against official Astro docs. Build order derived from Astro's own component model. No inference required. |
| Pitfalls | HIGH | Majority of pitfalls verified against official Astro docs, GitHub issue tracker, and official deploy guide. Migration-specific pitfalls corroborated by documented migration experiences. |

**Overall confidence:** HIGH

### Gaps to Address

No significant gaps identified. The research is unusually high confidence because:
- The technology (Astro 5 on GitHub Pages) is well-documented with official guides
- The project scope is narrow (one page, no interactivity, no backend)
- The migration path (Jekyll to Astro) has official documentation and community case studies

**One item to validate during execution:** The GitHub Pages source setting switch (Pitfall 2) must be confirmed manually in the repo UI — it cannot be automated or tested locally. This is a deployment verification step, not a research gap.

## Sources

### Primary (HIGH confidence)

- https://docs.astro.build/en/guides/deploy/github/ — Official Astro deploy to GitHub Pages guide; `withastro/action@v5` workflow
- https://github.com/withastro/action — Official action repository; v5.2.0 release date (2026-02-11); lockfile detection behavior
- https://docs.astro.build/en/install-and-setup/ — Node version requirements; project creation command
- https://docs.astro.build/en/basics/project-structure/ — Project structure patterns
- https://docs.astro.build/en/basics/astro-components/ — Component props and slot patterns
- https://docs.astro.build/en/guides/styling/ — Scoped styles, CSS custom properties, global styles
- https://docs.astro.build/en/guides/markdown-content/ — Markdown support, frontmatter, content collections
- https://docs.astro.build/en/basics/rendering-modes/ — Static output mode, zero-JS default
- https://docs.astro.build/en/reference/configuration-reference/ — `site`, `base`, `trailingSlash` config options
- https://docs.astro.build/en/concepts/islands/ — Island architecture; why no client-side JS for this project
- https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/ — Official Jekyll migration guide
- https://developers.google.com/search/docs/appearance/favicon-in-search — Favicon requirements
- GitHub releases (withastro/astro) — Astro 5.17.3 confirmed latest stable; 6.0.0-beta.14 latest beta

### Secondary (MEDIUM confidence)

- https://eastondev.com/blog/en/posts/dev/20251202-astro-seo-complete-guide/ — Astro SEO patterns including OG tags and schema.org
- https://justoffbyone.com/posts/trailing-slash-tax/ — Trailing slash redirect performance impact on GitHub Pages
- https://medium.com/vlead-tech/github-pages-for-astro-project-deploying-from-branch-vs-using-github-actions-af1f909322ee — "Deploy from branch" vs GitHub Actions comparison

### Tertiary (LOW confidence)

- Landing page design trends 2026 (Zoho LandingPage, involve.me) — Not used for specific decisions; confirmed the minimal/no-nav direction is appropriate for personal pages

---
*Research completed: 2026-02-19*
*Ready for roadmap: yes*
