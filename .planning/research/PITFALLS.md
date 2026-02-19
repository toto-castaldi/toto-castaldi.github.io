# Pitfalls Research

**Domain:** Personal landing page — Astro static site on GitHub Pages (migrated from Jekyll)
**Researched:** 2026-02-19
**Confidence:** HIGH (majority verified against official Astro docs and GitHub issues)

---

## Critical Pitfalls

### Pitfall 1: Jekyll Processes Astro's `_astro/` Build Assets — Breaking All JS and CSS

**What goes wrong:**
Astro outputs built assets into a `_astro/` folder inside `dist/`. GitHub Pages runs a Jekyll post-processor on "Deploy from branch" deployments. Jekyll ignores every directory or file that starts with an underscore — so `_astro/` is silently dropped from the deployed site. The HTML pages deploy fine, but all JavaScript and CSS references return 404. The site looks broken or completely unstyled.

**Why it happens:**
Jekyll's original convention treats underscore-prefixed paths as private/internal. GitHub Pages inherited this behavior. When "Deploy from branch" is selected as the Pages source, GitHub silently runs Jekyll on the uploaded files before serving them. Most developers see a green deploy checkmark, assume success, then discover the visual breakage only by loading the live URL.

**How to avoid:**
Use GitHub Actions (not "Deploy from branch") as the Pages deployment source. The `withastro/action` uploads the build artifact directly via `actions/upload-pages-artifact` and `actions/deploy-pages`, bypassing Jekyll entirely. Alternatively, add an empty `.nojekyll` file to `public/` so Astro copies it into `dist/` — this disables Jekyll processing. The GitHub Actions path is strongly preferred because it removes the root cause rather than patching around it.

**Warning signs:**
- Live site has no styling or JavaScript but shows HTML content
- Browser DevTools Network tab shows 404s for `/assets/_astro/*.css` or `/_astro/*.js`
- GitHub Pages repo Settings > Pages shows "Deploy from a branch" as the source (not "GitHub Actions")

**Phase to address:**
Phase 1 (project scaffold and CI setup). The deploy workflow must be configured before any content or styling work begins — discovering this after building the site costs a full rebuild of mental state.

---

### Pitfall 2: GitHub Pages Source Not Switched to "GitHub Actions"

**What goes wrong:**
Even with a correct `withastro/action` workflow file in `.github/workflows/`, deployments silently do nothing or fall back to Jekyll if the GitHub repo's Pages settings still say "Deploy from a branch." The workflow runs, succeeds, uploads an artifact — and then the artifact is never deployed because the Pages source is pointed at the wrong mechanism.

**Why it happens:**
GitHub Pages remembers whatever source setting was there before (in this repo it's already set to the Jekyll workflow). Pushing a new workflow file does not automatically change the Pages source setting in the repo's web UI. It is a manual step that is easy to forget.

**How to avoid:**
After creating the Astro workflow file: go to GitHub repo > Settings > Pages > Build and deployment > Source, and select "GitHub Actions." Verify by checking the Deployments tab in the repo sidebar — the first successful Astro deploy must appear there, not under the old gh-pages or master branch entry.

**Warning signs:**
- Workflow run shows green checkmarks in Actions tab but the live site still shows the old Jekyll content
- Pages Settings still shows "Deploy from a branch" and a branch name
- Deployment log shows `actions/upload-pages-artifact` succeeded but no `actions/deploy-pages` run appears

**Phase to address:**
Phase 1 (CI/deploy setup). This is a one-time manual setting change that must be done before any deploy attempt.

---

### Pitfall 3: Missing or Wrong `site` in `astro.config.mjs` Breaks Canonical URLs

**What goes wrong:**
Astro uses the `site` config property to generate canonical `<link>` tags, sitemap URLs, `Astro.site`, and Open Graph `og:url` values. If `site` is absent, set to `localhost`, or set to the wrong URL (e.g., includes a repo subpath for a user site), all canonical and sitemap URLs are either missing or incorrect in production.

**Why it happens:**
Astro defaults `site` to `undefined`, which silently makes `Astro.site` return `undefined` without throwing an error. Developers copy config snippets from tutorials targeting project repos (`username.github.io/repo-name`) rather than user/org repos (`username.github.io`). The old Jekyll `_config.yml` used `url: "http://toto-castaldi.github.io"` — note HTTP not HTTPS, which also needs updating.

**How to avoid:**
For this specific repo (`toto-castaldi.github.io`), set:
```js
// astro.config.mjs
export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  // No `base` property — user repos sit at root, base is not needed
})
```
Use HTTPS, not HTTP. Do NOT set `base` for a user site repo — `base` is only for project repos like `username.github.io/my-project`.

**Warning signs:**
- `<link rel="canonical">` in page source points to `http://` instead of `https://`
- Canonical URL is `undefined` or missing from page `<head>`
- Sitemap entries include double-slash or wrong hostname

**Phase to address:**
Phase 1 (scaffold). Set `site` on day one before writing any layout. Cannot be retrofitted without audit of all canonical/OG tags.

---

### Pitfall 4: Setting `base` on a User Repo (`username.github.io`)

**What goes wrong:**
Adding a `base` property in `astro.config.mjs` when the repository IS named `toto-castaldi.github.io` causes all internal links, asset paths, and canonical URLs to include a double prefix (e.g., `/toto-castaldi.github.io/` prepended to every path). The site 404s on every page except the root.

**Why it happens:**
`base` is required for project repos (`username.github.io/my-project`) so that Astro knows the site root is not `/`. Tutorials for project repos and user repos look identical, and developers copy the `base` line without checking which repo type they have. This is one of the most frequently filed Astro + GitHub Pages issues in the official tracker.

**How to avoid:**
Rule: if the repository name exactly matches `<username>.github.io`, omit `base` entirely. If deploying a project repo, set `base: '/repo-name'` (with leading slash, no trailing slash). Verify by checking the build output — `dist/index.html` asset paths should start with `/_astro/` not `/<username>.github.io/_astro/`.

**Warning signs:**
- All page routes return 404 except the homepage
- HTML source shows href="/toto-castaldi.github.io/..." paths
- astro.config.mjs contains `base: 'toto-castaldi.github.io'`

**Phase to address:**
Phase 1 (scaffold). Set once, verify with `astro build` output inspection before first deploy.

---

### Pitfall 5: Lockfile Not Committed — `withastro/action` Cannot Detect Package Manager

**What goes wrong:**
The `withastro/action` detects the package manager (npm/yarn/pnpm/bun) by scanning for a lockfile (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`). If the lockfile is absent from the repository or listed in `.gitignore`, the action fails or falls back to an incorrect package manager, causing dependency install failures in CI.

**Why it happens:**
Some developers add `*-lock.json` or `*.lock` to `.gitignore` based on old advice ("lockfiles cause merge conflicts"). Others forget to run the install command before their first commit. Since the current project has no `package-lock.json` yet (it's a new Astro init), this is a likely first-commit mistake.

**How to avoid:**
After `npm create astro@latest`, immediately run `npm install` (or chosen package manager) to generate the lockfile, then commit it. Verify `.gitignore` does NOT exclude lockfiles. The `withastro/action` defaults to Node 22 and npm when no lockfile is found — but that silent fallback may not match the intended setup.

**Warning signs:**
- CI log shows "No lockfile found" warning
- Action uses a different package manager than intended
- `npm install` errors in CI where local `npm ci` works fine

**Phase to address:**
Phase 1 (scaffold). The lockfile must be in the first commit alongside the workflow file.

---

## Moderate Pitfalls

### Pitfall 6: Trailing Slash Mismatch — GitHub Pages Causes Redirect Tax

**What goes wrong:**
GitHub Pages always redirects URLs without trailing slashes to URLs with them (e.g., `/about` → 301 → `/about/`). If Astro generates internal links without trailing slashes (the default `trailingSlash: 'ignore'` behavior), every internal navigation triggers an extra HTTP round-trip. On a single-page site this matters less, but if any routes are added later it degrades performance measurably (documented at 20-60% slower load under test conditions).

**Why it happens:**
Astro's `trailingSlash` config controls dev-mode routing matching but does NOT control GitHub Pages' server behavior. GitHub Pages' web server is hardcoded to serve directories via `index.html` and redirect bare paths.

**How to avoid:**
Set `trailingSlash: 'always'` in `astro.config.mjs`. This makes Astro generate all internal `<a href>` values with trailing slashes, eliminating redirects proactively. For a single-page site the impact is minimal today but costs nothing to configure correctly from day one.

**Warning signs:**
- Browser DevTools Network tab shows 301 redirects on internal navigation
- Lighthouse performance score flags redirect chains

**Phase to address:**
Phase 1 (scaffold config). One config line with no downside.

---

### Pitfall 7: Content Cache Stale After Schema Changes

**What goes wrong:**
During development, Astro caches content collection metadata in the `.astro/` directory. If a content schema changes but the cache is not cleared, Astro serves stale type information — the TypeScript compiler may not catch frontmatter errors that would fail at runtime, or vice versa (flagging errors that no longer exist).

**Why it happens:**
Astro's incremental build cache intentionally avoids reprocessing unchanged content. Schema changes in `src/content/config.ts` are not always detected as a cache-invalidating event in all Astro versions.

**How to avoid:**
After any schema change, delete `.astro/` before the next dev server start or build. Add `.astro/` to `.gitignore` (it should be excluded already from the Astro default template). For this project the risk is low (single markdown file, minimal schema) but worth noting for any collection additions.

**Warning signs:**
- TypeScript errors that disappear after restarting the dev server
- Frontmatter values not reflecting recent schema changes in hot-reload

**Phase to address:**
Phase 2 (content migration). Clear cache after defining the content collection schema.

---

### Pitfall 8: Jekyll Frontmatter Fields That Astro Ignores or Rejects

**What goes wrong:**
Jekyll's `layout: home` frontmatter key is meaningless to Astro and will be passed through as an untyped prop. If Astro content collection schemas are defined with strict validation (Zod), any unrecognized Jekyll-specific frontmatter keys (`layout`, `permalink`, Jekyll-specific categories, etc.) cause build failures with a `MarkdownContentSchemaValidationError`.

**Why it happens:**
Astro's content collection schema validation via Zod is strict by default — extra frontmatter keys not listed in the schema are rejected. Jekyll sites often accumulate undocumented frontmatter over time that Jekyll silently ignores.

**How to avoid:**
For this project the source is a single `index.markdown` file with minimal frontmatter (`layout: home`, `title: Toto`). Migration plan: strip Jekyll-specific keys (`layout`) from the source file, keep only `title`. If using content collections, define the Zod schema explicitly with `.passthrough()` during initial migration to avoid validation failures, then tighten the schema once the content is clean.

**Warning signs:**
- Build fails with `MarkdownContentSchemaValidationError`
- Error message references a frontmatter key by name
- Error only appears during `astro build`, not `astro dev`

**Phase to address:**
Phase 2 (content migration). Audit frontmatter before first build.

---

### Pitfall 9: Old Jekyll Workflow Conflicts With New Astro Workflow

**What goes wrong:**
The existing `jekyll.yml` workflow is still in `.github/workflows/`. If the new Astro workflow is added without removing the old one, both workflows trigger on push to `master`. The Jekyll build will fail (Ruby 3.x + Jekyll 4.0.0 + old Gemfile.lock incompatibility is documented in the project context), but the failure notification is misleading — developers investigate Jekyll errors when the real question is whether the Astro workflow succeeded.

**Why it happens:**
Developers add the new workflow file but leave the old one for "safety" or forget it exists. GitHub Actions runs all workflow files in `.github/workflows/` that match the trigger conditions.

**How to avoid:**
Delete `jekyll.yml` when adding the Astro workflow. If a rollback capability is needed, the old file is in git history — it does not need to stay on the branch. The Pages source must also be switched from the Jekyll workflow's deploy step to GitHub Actions, which makes the Jekyll workflow's deploy logic dead code anyway.

**Warning signs:**
- Two workflow runs appear in the Actions tab on every push
- CI email notifications reference Jekyll build failures
- Repo Actions tab shows a red X from `jekyll.yml` alongside a green checkmark from the Astro workflow

**Phase to address:**
Phase 1 (CI setup). Remove `jekyll.yml` atomically with adding the Astro workflow.

---

## Minor Pitfalls

### Pitfall 10: `charset` Meta Tag Missing When Using Custom Layouts

**What goes wrong:**
When Astro markdown files reference a layout via the `layout` frontmatter property, Astro no longer automatically injects `<meta charset="utf-8">` into the page. If the layout does not include this tag, Italian language characters (accented letters like `à`, `è`, `ì`, `ò`, `ù`) in the page content will render incorrectly.

**Why it happens:**
Jekyll's Minima theme handles charset automatically. Developers porting Jekyll layouts to Astro focus on visual fidelity but overlook foundational `<head>` requirements that were previously invisible.

**How to avoid:**
Every Astro layout must include `<meta charset="utf-8" />` as the first tag inside `<head>`. This project's content is in Italian, making this non-optional.

**Warning signs:**
- Accented characters show as question marks or garbled symbols in browser
- Source code shows correct UTF-8 but rendered output is wrong

**Phase to address:**
Phase 2 (layout creation). Add charset as the very first `<head>` element.

---

### Pitfall 11: `site` URL Uses HTTP Instead of HTTPS

**What goes wrong:**
The existing Jekyll `_config.yml` uses `url: "http://toto-castaldi.github.io"`. If this is copied verbatim into the Astro `site` config, all generated canonical links and sitemaps will use HTTP. GitHub Pages serves over HTTPS by default, so canonical URLs will mismatch the actual protocol, causing subtle SEO issues.

**Why it happens:**
Direct copy-paste from the Jekyll config without inspecting the protocol. The old config predates GitHub Pages' HTTPS enforcement.

**How to avoid:**
Set `site: 'https://toto-castaldi.github.io'` — note HTTPS, not HTTP.

**Warning signs:**
- `<link rel="canonical">` in page source shows `http://`
- Search Console reports canonical mismatch

**Phase to address:**
Phase 1 (scaffold). One character change, but easy to miss when copying the old config.

---

### Pitfall 12: Node.js Version Mismatch Between Local Dev and CI

**What goes wrong:**
`withastro/action` defaults to Node 22. If local development uses Node 18 or 20, subtle differences in dependency resolution or build output can cause CI failures that do not reproduce locally, or vice versa.

**Why it happens:**
Astro 5.x requires Node `>=18.17.1 || >=20.3.0 || >=22`. The action's default of Node 22 may be newer than what a developer has locally after migrating from a Ruby-centric Jekyll workflow (no Node tooling was in use before).

**How to avoid:**
Add a `.nvmrc` or `engines` field in `package.json` specifying the Node version. Pin the `node-version` in the workflow explicitly:
```yaml
- uses: withastro/action@v3
  with:
    node-version: 22
```

**Warning signs:**
- Local `astro build` succeeds but CI fails with obscure dependency errors
- `npm WARN EBADENGINE` messages in CI logs

**Phase to address:**
Phase 1 (scaffold). Pin Node version before first CI run.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip content collection schema | Faster initial scaffold | Frontmatter errors surface at runtime, not build time | Never — schema is one file, costs 10 minutes |
| Inline styles instead of CSS classes | Quick visual iteration | Harder to apply design-wide updates | Never for a "minimal design refresh" goal |
| Copy Jekyll layout HTML directly | Faster port | Jekyll Liquid syntax breaks Astro parser; charset/viewport tags likely missing | Never — rewrite layout from Astro template |
| Keep `jekyll.yml` workflow alongside Astro workflow | Feels like a safety net | Noisy CI, misleading failure alerts, Jekyll build will fail due to Ruby 3.x incompatibility | Never |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages | Select "Deploy from branch" (keeps Jekyll processor active) | Select "GitHub Actions" in repo Settings > Pages |
| `withastro/action` | Omit lockfile from git, causing package manager detection failure | Commit `package-lock.json` (or chosen manager's lockfile) in first commit |
| GitHub Actions permissions | Omit `pages: write` or `id-token: write` from workflow permissions block | Include all three: `contents: read`, `pages: write`, `id-token: write` |
| Markdown content | Use Jekyll `layout:` frontmatter expecting Astro to honor it | Remove `layout:` from frontmatter; apply layouts via Astro routing conventions |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Trailing slash redirects | 301 redirects on every internal link; extra network round-trip | Set `trailingSlash: 'always'` in config | Every page load (GitHub Pages always redirects) |
| Images in `src/` vs `public/` | Dev works fine; production URL paths differ | Static images not processed by Astro go in `public/`; processed images via `<Image>` go in `src/` | First production deploy |
| Large unoptimized images | Slow LCP even on minimal site | Use Astro's `<Image>` component for any photos; WebP preferred | When images > 200KB are referenced |

---

## "Looks Done But Isn't" Checklist

- [ ] **GitHub Pages source:** Verify Settings > Pages shows "GitHub Actions" not "Deploy from branch"
- [ ] **Workflow file:** Confirm `jekyll.yml` has been removed from `.github/workflows/`
- [ ] **`site` config:** Verify `https://` (not `http://`) in `astro.config.mjs`
- [ ] **`base` config:** Confirm `base` is absent (user repo at root, not a project repo)
- [ ] **Lockfile committed:** `package-lock.json` (or equivalent) present in repo root
- [ ] **Charset tag:** `<meta charset="utf-8" />` in layout `<head>`
- [ ] **`.nojekyll` not needed:** Covered by using GitHub Actions deploy, but verify `_astro/` assets load in live site after first deploy
- [ ] **Italian content renders correctly:** Check accented characters `à è ì ò ù` in browser
- [ ] **Trailing slash config:** `trailingSlash: 'always'` set in config
- [ ] **Old frontmatter stripped:** `layout: home` removed from `index.markdown` before migration

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| `_astro/` assets missing (wrong deploy source) | LOW | Change Pages source to "GitHub Actions" in repo settings; redeploy |
| Wrong `base` set for user repo | LOW | Remove `base` from config; rebuild and redeploy |
| Wrong `site` URL (http vs https) | LOW | Fix URL; rebuild and redeploy; wait for search engine re-crawl |
| Lockfile missing from CI | LOW | Add lockfile to git; push; CI detects it on next run |
| Old Jekyll workflow conflicts | LOW | Delete `jekyll.yml`; push |
| Frontmatter validation failures | MEDIUM | Audit all markdown frontmatter; remove or schema-match all fields; rebuild |
| Charset encoding broken (Italian text) | LOW | Add `<meta charset="utf-8" />` to layout; deploy |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `_astro/` Jekyll processing (Pitfall 1) | Phase 1 — CI setup | `_astro/*.css` loads on live URL after first deploy |
| Pages source not switched to GitHub Actions (Pitfall 2) | Phase 1 — CI setup | Deployments tab shows Astro deploy, not branch deploy |
| Missing/wrong `site` config (Pitfall 3) | Phase 1 — scaffold | `<link rel="canonical">` in `view-source:` is `https://toto-castaldi.github.io/` |
| Incorrect `base` for user repo (Pitfall 4) | Phase 1 — scaffold | All asset paths in HTML start with `/_astro/` not `/toto-castaldi.github.io/` |
| Lockfile not committed (Pitfall 5) | Phase 1 — CI setup | First CI run shows correct package manager in logs |
| Trailing slash redirects (Pitfall 6) | Phase 1 — scaffold config | No 301s in Network tab on live site |
| Content cache stale (Pitfall 7) | Phase 2 — content migration | Build passes cleanly after schema defined |
| Jekyll frontmatter in Astro (Pitfall 8) | Phase 2 — content migration | `astro build` completes without `MarkdownContentSchemaValidationError` |
| Old Jekyll workflow conflicts (Pitfall 9) | Phase 1 — CI setup | Only one workflow visible in Actions tab |
| Missing charset (Pitfall 10) | Phase 2 — layout | Italian accented chars render correctly |
| HTTP vs HTTPS site URL (Pitfall 11) | Phase 1 — scaffold | `canonical` href starts with `https://` |
| Node version mismatch (Pitfall 12) | Phase 1 — CI setup | CI build uses same Node major as `.nvmrc` |

---

## Sources

- Astro official deploy to GitHub Pages docs: https://docs.astro.build/en/guides/deploy/github/
- Astro official Jekyll migration guide: https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/
- `withastro/action` repository (lockfile detection, Node defaults): https://github.com/withastro/action
- GitHub issue — `_astro` folder ignored by GitHub Pages: https://github.com/withastro/astro/issues/14247
- GitHub issue — base config wrong path: https://github.com/withastro/astro/issues/4229
- Trailing slash tax on GitHub Pages analysis: https://justoffbyone.com/posts/trailing-slash-tax/
- Jekyll vs Astro comparison (migration experiences): https://www.jamiewallace.co.uk/blog/migrating-from-jekyll-to-astro/
- Astro configuration reference (site, base, trailingSlash): https://docs.astro.build/en/reference/configuration-reference/
- Astro content collection schema validation error reference: https://docs.astro.build/en/reference/errors/markdown-content-schema-validation-error/
- GitHub Pages for Astro — Deploy from branch vs GitHub Actions: https://medium.com/vlead-tech/github-pages-for-astro-project-deploying-from-branch-vs-using-github-actions-af1f909322ee

---
*Pitfalls research for: Astro + GitHub Pages personal landing page (Jekyll migration)*
*Researched: 2026-02-19*
