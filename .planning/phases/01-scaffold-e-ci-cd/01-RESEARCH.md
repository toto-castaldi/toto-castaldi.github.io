# Phase 1: Scaffold e CI/CD - Research

**Researched:** 2026-02-19
**Domain:** Astro 5 project initialization, GitHub Actions CI/CD, GitHub Pages deployment, Jekyll removal
**Confidence:** HIGH

## Summary

Phase 1 replaces the broken Jekyll toolchain with a working Astro 5 static site deployed via GitHub Actions. The repo currently contains Jekyll 4.0.0 with Minima 2.5, a `Gemfile.lock` incompatible with Ruby 3.x, and a `jekyll.yml` workflow that fails on build. The goal is to initialize Astro, configure the deploy pipeline, remove all Jekyll artifacts, and verify a successful deploy of a placeholder page to `https://toto-castaldi.github.io/`.

All technologies involved are well-documented by official sources. The `withastro/action@v5` (released 2026-02-11) provides a turnkey build-and-upload step. The deploy pipeline uses `actions/deploy-pages@v4` which bypasses Jekyll processing entirely (no `.nojekyll` file needed). The critical non-automatable step is manually switching the GitHub Pages source from "Deploy from branch" to "GitHub Actions" in the repo settings UI.

**Primary recommendation:** Initialize Astro with the minimal template in the existing repo, configure `astro.config.mjs` with `site: 'https://toto-castaldi.github.io'` and `output: 'static'`, create the GitHub Actions workflow, delete all Jekyll files, commit `package-lock.json`, and manually switch the Pages source setting before the first push.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Progetto Astro 5.x inizializzato con `output: 'static'` | Standard Stack section: Astro 5.x with `output: 'static'` (default). Code Examples: `astro.config.mjs` pattern. `npm create astro@latest` with `--template minimal` flag. |
| INFRA-02 | GitHub Actions workflow con `withastro/action@v5` per deploy automatico su push a master | Code Examples: complete `deploy.yml` verified against official Astro docs. `withastro/action@v5.2.0` with `actions/deploy-pages@v4`. Trigger on `branches: ["master"]`. |
| INFRA-03 | GitHub Pages source impostato su "GitHub Actions" (non "Deploy from branch") | Common Pitfalls: Pitfall 2. This is a manual step in repo Settings > Pages > Source. Cannot be automated. Must be done before first deploy push. |
| INFRA-04 | `site: 'https://toto-castaldi.github.io'` in `astro.config.mjs` (HTTPS, no `base`) | Code Examples: `astro.config.mjs` pattern. Common Pitfalls: Pitfalls 3, 4, 11. HTTPS required (not HTTP from old Jekyll config). No `base` for user repos. |
| INFRA-05 | Lockfile (`package-lock.json`) committato nel repo | Common Pitfalls: Pitfall 5. `withastro/action` detects package manager from lockfile. Must be committed in first push. Verify `.gitignore` does not exclude it. |
| INFRA-06 | Rimozione completa di Jekyll (`Gemfile`, `Gemfile.lock`, `_layouts/`, `_includes/`, `_sass/`, `jekyll.yml`) | Architecture Patterns: "Files to Remove" list. Common Pitfalls: Pitfall 9. Remove atomically with Astro workflow addition. Full inventory in Current Repo State section. |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x (latest stable: 5.17.3) | Static site generator | Zero-JS output by default; `output: 'static'` is the default mode; first-class GitHub Pages support via official action |
| Node.js | 22 LTS | Build runtime | Current LTS; Astro 5 supports v18.20.8, v20.3.0, v22+; Node 18 is EOL; withastro/action defaults to Node 22 |
| withastro/action | v5 (latest: v5.2.0) | GitHub Actions build step | Official Astro action; auto-detects package manager from lockfile; handles build + artifact upload |
| actions/deploy-pages | v4 | GitHub Pages deployment | Official GitHub action for the new Pages API; bypasses Jekyll processing entirely |
| actions/checkout | v5 or v6 | Repository checkout | v5 is used in official Astro docs; v6 is available (released Jan 2026) and works; either is fine |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | Built-in (ships with Astro) | Type safety for frontmatter and component props | Always; Astro includes TS support; use `strict` tsconfig preset |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `withastro/action@v5` | Manual build workflow (30+ lines) | No advantage; official action is maintained, simpler, auto-detects everything |
| npm | pnpm or yarn | pnpm requires `.npmrc` with `shamefully-hoist=true` for Astro; adds friction at this project size; npm is simplest |
| `actions/checkout@v5` | `actions/checkout@v6` | v6 uses node24 runtime, improved credential security; both work; official Astro docs use v5 |

**Installation:**
```bash
# Option A: Interactive scaffold (recommended for in-place repo migration)
npm create astro@latest . -- --template minimal --skip-houston

# Option B: If Option A fails on non-empty directory, scaffold to temp then move
npm create astro@latest temp-astro -- --template minimal
# Then move files from temp-astro/ into repo root
```

## Current Repo State (Files to Address)

### Jekyll Files to DELETE

These files must be removed completely as part of INFRA-06:

| File/Directory | Type | Notes |
|----------------|------|-------|
| `Gemfile` | File | Jekyll 4.0.0 + Minima 2.5 dependencies |
| `Gemfile.lock` | File | Incompatible with Ruby 3.x; already modified (unstaged change) |
| `_layouts/` | Directory | Contains `default.html`, `home.html`, `page.html`, `post.html` |
| `_includes/` | Directory | Contains `custom-head.html`, `disqus_comments.html`, `footer.html`, `google-analytics.html`, `header.html`, `head.html`, `social.html` |
| `_sass/` | Directory | Contains `minima/` subdirectory with Sass stylesheets |
| `.github/workflows/jekyll.yml` | File | Existing Jekyll deploy workflow; triggers on push to master; will conflict with new Astro workflow |
| `_config.yml` | File | Jekyll config; `url: "http://toto-castaldi.github.io"`; not needed by Astro |
| `404.html` | File | Jekyll 404 page; Astro will generate its own if needed |
| `index.markdown` | File | Jekyll content file; content will be inlined in `src/pages/index.astro` (Phase 2) |

### Files to KEEP

| File | Reason |
|------|--------|
| `CNAME` | Empty file, no custom domain; safe to keep in `public/` for future use |
| `README.md` | Repository documentation |
| `.git/` | Git history |
| `.planning/` | Planning documents |
| `assets/` | Check contents -- may contain static assets to preserve |

### Files to UPDATE

| File | Change |
|------|--------|
| `.gitignore` | Replace Jekyll entries (`_site`, `.sass-cache`, `.jekyll-cache`, `.jekyll-metadata`, `vendor`) with Astro entries (`dist/`, `node_modules/`, `.astro/`) |

## Architecture Patterns

### Project Structure After Phase 1

```
toto-castaldi.github.io/
├── src/
│   └── pages/
│       └── index.astro          # Placeholder page (content in Phase 2)
├── public/
│   └── CNAME                    # Keep empty (no custom domain)
├── .github/
│   └── workflows/
│       └── deploy.yml           # NEW: Astro deploy workflow
├── astro.config.mjs             # site URL, static output
├── tsconfig.json                # TypeScript config (strict preset)
├── package.json                 # Astro dependency
├── package-lock.json            # MUST be committed (INFRA-05)
├── .gitignore                   # Updated for Astro
├── .nvmrc                       # Pin Node 22
├── README.md
└── .planning/                   # Planning docs (unchanged)
```

All Jekyll files (`Gemfile`, `Gemfile.lock`, `_config.yml`, `_layouts/`, `_includes/`, `_sass/`, `404.html`, `index.markdown`, `jekyll.yml`) are deleted.

### Pattern 1: Minimal Placeholder Page

**What:** A bare `index.astro` that proves the build pipeline works without any content or styling complexity.
**When to use:** Phase 1 only -- replaced with real content in Phase 2.
**Why:** Isolates CI/CD verification from content/styling concerns. If deploy fails, you know it is an infrastructure issue, not a content issue.

```astro
---
// src/pages/index.astro
// Phase 1: Placeholder -- proves Astro builds and deploys correctly
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Antonio Castaldi</title>
  </head>
  <body>
    <h1>Antonio Castaldi</h1>
    <p>Sito in aggiornamento.</p>
  </body>
</html>
```

### Pattern 2: GitHub Actions Workflow for Astro + GitHub Pages

**What:** Two-job workflow: build (with `withastro/action`) then deploy (with `actions/deploy-pages`).
**When to use:** Always for Astro + GitHub Pages with "GitHub Actions" source.

```yaml
# Source: https://docs.astro.build/en/guides/deploy/github/
name: Deploy to GitHub Pages
on:
  push:
    branches: ["master"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5
      - name: Install, build, and upload site
        uses: withastro/action@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Critical notes:**
- Branch is `master` (not `main`) -- matches this repo's default branch
- Three permissions are ALL required: `contents: read`, `pages: write`, `id-token: write`
- No `node-version` override needed -- `withastro/action` defaults to Node 22
- No `.nojekyll` file needed -- `actions/deploy-pages` bypasses Jekyll processing entirely

### Anti-Patterns to Avoid

- **Keeping `jekyll.yml` as a "backup":** Both workflows trigger on push to master. The Jekyll build will fail (Ruby 3.x incompatibility) and generate confusing error notifications. Delete it -- git history preserves it.
- **Setting `base` in `astro.config.mjs`:** This is a user repo (`toto-castaldi.github.io`), NOT a project repo. Setting `base` causes all asset paths to get a double prefix and 404s on every page.
- **Using "Deploy from branch" as Pages source:** Even with a correct workflow file, the old source setting causes the artifact to be ignored. The deploy step succeeds but nothing gets published.
- **Running `npm create astro` in a subdirectory then deploying from there:** The `withastro/action` expects the Astro project at the repo root (configurable via `path` input, but root is simplest).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Astro build + artifact upload in CI | Custom `npm run build` + manual artifact upload steps | `withastro/action@v5` | Official action handles package manager detection, caching, Node version, build command, artifact upload in one step |
| GitHub Pages deployment | Custom deploy scripts or `gh-pages` npm package | `actions/deploy-pages@v4` | Official GitHub action for the new Pages API; handles permissions, environment URLs, bypass of Jekyll processing |
| Project scaffolding | Manual file creation | `npm create astro@latest -- --template minimal` | Creates correct tsconfig, package.json, astro.config.mjs structure with proper defaults |

**Key insight:** The entire Phase 1 build-and-deploy pipeline is ~20 lines of YAML using official actions. Hand-rolling any of it adds complexity with zero benefit.

## Common Pitfalls

### Pitfall 1: GitHub Pages Source Not Switched to "GitHub Actions"

**What goes wrong:** The workflow runs, succeeds, uploads an artifact -- but the site still shows old Jekyll content (or nothing). The Pages source is still set to "Deploy from branch" from the Jekyll era.
**Why it happens:** Pushing a new workflow file does NOT automatically change the Pages source setting. It is a manual step in the GitHub web UI.
**How to avoid:** Before the first push with the new workflow: go to GitHub repo > Settings > Pages > Build and deployment > Source, select "GitHub Actions."
**Warning signs:** Workflow shows green checkmarks but live site unchanged. Deployments tab shows old branch deploy, not Actions deploy.

### Pitfall 2: Missing `package-lock.json` in Git

**What goes wrong:** `withastro/action` cannot detect npm as the package manager. Falls back to default behavior or fails CI.
**Why it happens:** Developer runs `npm create astro` but forgets to commit the lockfile. Or `.gitignore` excludes it.
**How to avoid:** After project init, verify `package-lock.json` exists and is NOT in `.gitignore`. Commit it in the same commit as the workflow file.
**Warning signs:** CI log shows "No lockfile found" warning. Action uses unexpected package manager.

### Pitfall 3: Setting `base` on a User Repo

**What goes wrong:** All asset paths get prefixed with `/toto-castaldi.github.io/`, causing 404s on CSS, JS, and every page except root.
**Why it happens:** Tutorials for project repos (`username.github.io/my-project`) include `base: '/my-project'`. Developers copy this for user repos where `base` must be omitted.
**How to avoid:** Rule: if repo name is `<username>.github.io`, do NOT set `base`. Omit it entirely. Verify by checking build output: asset paths should start with `/_astro/` not `/<reponame>/_astro/`.
**Warning signs:** HTML source shows `href="/toto-castaldi.github.io/..."` paths.

### Pitfall 4: `site` URL Uses HTTP Instead of HTTPS

**What goes wrong:** Canonical URLs and OG tags generated by Astro use `http://` while GitHub Pages serves over `https://`. SEO mismatch.
**Why it happens:** The existing Jekyll `_config.yml` has `url: "http://toto-castaldi.github.io"`. Direct copy-paste.
**How to avoid:** Set `site: 'https://toto-castaldi.github.io'` -- note HTTPS.
**Warning signs:** `<link rel="canonical">` in page source shows `http://`.

### Pitfall 5: Old Jekyll Workflow Conflicts with New Astro Workflow

**What goes wrong:** Both `jekyll.yml` and `deploy.yml` trigger on push to master. Jekyll build fails (Ruby 3.x + old Gemfile.lock), generating misleading error notifications.
**Why it happens:** Developer adds new workflow but leaves old one "for safety."
**How to avoid:** Delete `jekyll.yml` in the same commit that adds the Astro workflow. Git history preserves it for rollback if needed.
**Warning signs:** Two workflow runs in Actions tab on every push. Red X from Jekyll alongside green from Astro.

### Pitfall 6: Scaffolding in Non-Empty Directory

**What goes wrong:** `npm create astro@latest .` may refuse to run or overwrite existing files in the non-empty repo root.
**Why it happens:** The create-astro CLI checks for non-empty directories to prevent accidental overwrites.
**How to avoid:** Two strategies: (A) Use `npm create astro@latest .` and accept prompts to overwrite, or (B) scaffold to a temporary directory and move files. Strategy B is safer for preserving `.git/`, `.planning/`, `README.md`. The key files to move are: `package.json`, `astro.config.mjs`, `tsconfig.json`, and `src/` directory.
**Warning signs:** CLI exits with "directory not empty" error.

## Code Examples

Verified patterns from official sources:

### astro.config.mjs (Phase 1 Configuration)

```javascript
// Source: https://docs.astro.build/en/reference/configuration-reference/
// Source: https://docs.astro.build/en/guides/deploy/github/
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  // output: 'static' is the DEFAULT -- explicit for clarity
  // No `base` -- this is a user repo (username.github.io), serves at root
  // trailingSlash: 'always' -- optional, prevents 301 redirects on GitHub Pages
});
```

### .gitignore (Astro Project)

```
# Astro build output
dist/

# Dependencies
node_modules/

# Astro cache
.astro/

# Environment variables
.env
.env.*

# Editor
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### .nvmrc

```
22
```

### deploy.yml (Complete Workflow)

```yaml
# Source: https://docs.astro.build/en/guides/deploy/github/
# Adapted for this repo: branch is "master" (not "main")
name: Deploy to GitHub Pages

on:
  push:
    branches: ["master"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5
      - name: Install, build, and upload site
        uses: withastro/action@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Placeholder index.astro

```astro
---
// src/pages/index.astro
// Phase 1 placeholder: proves build + deploy pipeline works
// Will be replaced with full content layout in Phase 2
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Antonio Castaldi</title>
  </head>
  <body>
    <h1>Antonio Castaldi</h1>
    <p>Sito in aggiornamento.</p>
  </body>
</html>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `output: 'hybrid'` mode | `output: 'static'` or `output: 'server'` (hybrid removed) | Astro 5.x | `hybrid` is no longer a valid output value; use `static` for this project |
| `actions/checkout@v4` | `actions/checkout@v5` (v6 also available) | Late 2025 / Jan 2026 | Official Astro docs use v5; v6 works but is newer |
| Manual `.nojekyll` file needed | Not needed with GitHub Actions deploy source | When Pages added "GitHub Actions" source option | `actions/deploy-pages` bypasses Jekyll entirely |
| `Astro.glob()` for content | `getCollection()` from content collections | Astro 5 (deprecated in 5, removed in 6) | Not relevant for Phase 1 (no content collections) |

**Deprecated/outdated:**
- `output: 'hybrid'`: Removed; use `static` with per-page opt-out if needed
- `@astrojs/tailwind` integration: Deprecated for Tailwind v4; not used in this project
- `Astro.glob()`: Deprecated in Astro 5; not used in this project

## Migration Strategy: Jekyll to Astro In-Place

The repo is an existing git repository. The migration must happen in-place without losing git history. Recommended approach:

### Step-by-Step

1. **Scaffold Astro to a temporary directory:**
   ```bash
   npm create astro@latest /tmp/astro-scaffold -- --template minimal --skip-houston -y
   ```

2. **Copy Astro scaffold files into repo root:**
   - `package.json`
   - `astro.config.mjs`
   - `tsconfig.json`
   - `src/` directory (with placeholder `src/pages/index.astro`)

3. **Run `npm install` in repo root** to generate `node_modules/` and `package-lock.json`

4. **Update `.gitignore`** from Jekyll entries to Astro entries

5. **Create `.github/workflows/deploy.yml`** (new Astro workflow)

6. **Delete Jekyll files:** `Gemfile`, `Gemfile.lock`, `_config.yml`, `_layouts/`, `_includes/`, `_sass/`, `404.html`, `index.markdown`, `.github/workflows/jekyll.yml`

7. **Move `CNAME` to `public/CNAME`** (Astro copies `public/` contents verbatim to `dist/`)

8. **Create `.nvmrc`** with `22`

9. **Edit `astro.config.mjs`** to set `site: 'https://toto-castaldi.github.io'`

10. **Verify locally:** `npm run build` should produce `dist/index.html`

11. **Commit everything** (including `package-lock.json`)

12. **MANUAL STEP:** Go to GitHub repo > Settings > Pages > Source > select "GitHub Actions"

13. **Push to master** -- workflow should trigger, build, and deploy

### Why Not `npm create astro` Directly in Repo Root

The repo root is non-empty (contains `.git/`, `.planning/`, `README.md`, and all Jekyll files). The `create-astro` CLI may refuse to run in a non-empty directory or may overwrite files unexpectedly. Scaffolding to a temp directory and copying the necessary files is safer and more predictable.

## Open Questions

1. **`assets/` directory contents**
   - What we know: The repo has an `assets/` directory (Jekyll convention for static assets)
   - What's unclear: Whether it contains files needed for the site (images, CSS, etc.) or only Jekyll-generated assets
   - Recommendation: Inspect `assets/` contents during implementation. If it contains user-uploaded static files, move them to `public/assets/`. If it contains only Jekyll build artifacts, delete it.

2. **`trailingSlash: 'always'` configuration**
   - What we know: GitHub Pages redirects URLs without trailing slashes to URLs with them (301 redirect). Setting `trailingSlash: 'always'` prevents this redirect tax.
   - What's unclear: Whether this setting should be applied in Phase 1 or Phase 2
   - Recommendation: Set it in Phase 1 in `astro.config.mjs` -- costs nothing, prevents a pitfall, and avoids needing to change config later.

## Sources

### Primary (HIGH confidence)
- [Astro Deploy to GitHub Pages -- Official Docs](https://docs.astro.build/en/guides/deploy/github/) -- Complete workflow YAML, Pages source instructions, lockfile requirements
- [withastro/action GitHub Repository](https://github.com/withastro/action) -- v5.2.0 release (2026-02-11), input parameters, Node 22 default, package manager detection
- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/) -- `site`, `base`, `output`, `trailingSlash` options with types and defaults
- [Astro Install and Setup](https://docs.astro.build/en/install-and-setup/) -- Node version requirements (v18.20.8, v20.3.0, v22+), project creation, TS setup
- [Astro Jekyll Migration Guide](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/) -- Migration approach, frontmatter handling
- [GitHub Issue #14247 -- _astro folder ignored by GitHub Pages](https://github.com/withastro/astro/issues/14247) -- Confirmed: "Deploy from branch" causes issue, GitHub Actions deploy bypasses it

### Secondary (MEDIUM confidence)
- [actions/checkout v6 release](https://github.com/actions/checkout/releases) -- v6.0.2 available, node24 runtime, backward compatible
- [create-astro CLI README](https://github.com/withastro/astro/blob/main/packages/create-astro/README.md) -- CLI flags: `--template`, `--yes`, `--skip-houston`, `--no-install`

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All versions verified against official Astro docs, GitHub releases, and withastro/action repository (2026-02-19)
- Architecture: HIGH -- Project structure derived from official Astro project structure docs; workflow YAML from official deploy guide
- Pitfalls: HIGH -- All pitfalls verified against official docs, GitHub issues, and official deploy guide; pitfall-to-phase mapping confirmed

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (30 days -- stack is stable, no breaking changes expected)
