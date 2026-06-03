# Phase 8: Sicurezza dipendenze (Dependabot) - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 4 (1 created, 3 modified/regenerated)
**Analogs found:** 1 with code analog / 4 (3 are config/lockfile with no meaningful code analog)

> Note: this is a dependency-security + governance phase, not a feature-code
> phase. Most "files" in scope are package manifests, a machine-generated
> lockfile, and YAML CI config — not application source. Pattern mapping here is
> about matching the project's existing CI/config conventions, not extracting
> controllers/services. The only repository file that serves as a genuine code
> analog is `.github/workflows/deploy.yml` (for the new `.github/dependabot.yml`).

## File Classification

| New/Modified File | Op | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|----|------|-----------|----------------|---------------|
| `.github/dependabot.yml` | create | config (CI / dependency governance) | event-driven (scheduled) | `.github/workflows/deploy.yml` | role-match (both `.github` YAML config) |
| `package.json` | modify | config (package manifest) | — | none (only manifest in repo) | no analog |
| `package-lock.json` | regenerate | config (machine-generated lockfile) | — | none (machine-generated) | no analog |
| `.github/workflows/deploy.yml` | verify-only (D-07) | config (CI workflow) | event-driven (push/dispatch) | itself (already canonical) | exact (no change planned) |

## Pattern Assignments

### `.github/dependabot.yml` (config, scheduled event-driven) — CREATE

**Analog:** `.github/workflows/deploy.yml` — the only other `.github` YAML in the
repo. It establishes the project's CI-config conventions the new file should
mirror: 2-space indent, lowercase keys, `@vN` major-pinned action versions, and
a deliberately minimal surface (no extra knobs beyond what's needed).

**Conventions to copy from `deploy.yml`:**

`.github/workflows/deploy.yml` (lines 1-21) — formatting + version-pinning style:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["master"]   # repo default branch is "master", not "main"
  workflow_dispatch:

# ...
      - name: Checkout repository
        uses: actions/checkout@v5      # major-pinned: @v5
      - name: Install, build, and upload site
        uses: withastro/action@v5      # major-pinned: @v5
```

**Concrete conventions the new `dependabot.yml` must follow:**
- **2-space YAML indentation**, `lf` line endings, lowercase top-level keys
  (matches `deploy.yml`).
- **Target branch `master`** for any `target-branch` setting — the repo default
  branch is `master` (see `deploy.yml` line 5 `branches: ["master"]`), NOT `main`.
  Dependabot defaults to the repo default branch, so usually no override is needed.
- **Minimal surface:** `deploy.yml` is 32 lines with zero optional knobs. Keep
  `dependabot.yml` equally minimal per D-05 ("dependabot.yml minimale").

**Required structure (Dependabot v2 schema, per D-05):**
```yaml
version: 2
updates:
  # npm ecosystem — root manifest (package.json / package-lock.json)
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"     # D-05: cadenza settimanale
    groups:                  # D-05: update raggruppati per ridurre rumore PR
      npm-dependencies:
        patterns:
          - "*"
  # github-actions ecosystem — monitors .github/workflows/
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      github-actions:
        patterns:
          - "*"
```

**D-05 / Claude's Discretion notes for planner:**
- Two ecosystems required: `npm` (root) + `github-actions` (`.github/workflows/`).
- `interval: "weekly"` is locked (D-05).
- Grouping is required (D-05 "update raggruppati"); single "all" group vs
  per-ecosystem group is at planner discretion (CONTEXT Claude's Discretion).
  The structure above uses one group per ecosystem (recommended: groups cannot
  span ecosystems anyway, so one block-level group each).
- `directory: "/"` for `github-actions` is correct — Dependabot scans
  `.github/workflows/` automatically when directory is root.

---

### `package.json` (config, package manifest) — MODIFY (minimal)

**Analog:** none — this is the only package manifest in the repo; there is no
sibling file to copy a pattern from. Structure is defined by npm itself.

**Current state** (full file, 14 lines):
```json
{
  "name": "toto-castaldi.github.io",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^5.17.1"
  }
}
```

**Pattern to preserve (D-04):**
- **Single direct dependency** `astro` with **caret range** — keep the caret,
  no exact pin. After the in-place fix the range stays `^5.x` (D-01: latest
  patch ≥ 5.18.2; the caret already permits this, so the `^5.17.1` line may not
  even change — only the lockfile resolves higher).
- **Do NOT** add `overrides`/`resolutions` unless `npm audit fix` (no `--force`)
  cannot resolve a transitive without them. D-03 expects plain
  `npm audit fix` + `npm update` to suffice; transitive safety is enforced by the
  lockfile, not by manifest pins (D-04).
- Keep `"type": "module"` and the 4 `scripts` untouched.

---

### `package-lock.json` (config, machine-generated lockfile) — REGENERATE

**Analog:** NONE — explicitly. `package-lock.json` is **machine-generated** by
npm; it must never be hand-edited and has no human-authored pattern to copy.

**Pattern (mechanical, D-03/D-04):**
- `lockfileVersion: 3` must be preserved (current header confirms v3).
- Regenerated via `npm audit fix` (NO `--force`) + `npm update`, then committed
  as-is. It is the single source of truth for transitive versions (D-04) and is
  consumed 1:1 by `withastro/action@v5` at deploy (D-07 / Integration Points).
- Note: lockfile root `"name": "tmp-astro-scaffold"` is a scaffold artifact;
  out of scope to "fix" here — do not touch unless regeneration changes it
  naturally.

---

### `.github/workflows/deploy.yml` (config, CI workflow) — VERIFY-ONLY

**Analog:** itself — it is the canonical CI pattern and is **not modified** in
this phase. Listed because D-07 requires confirming the deploy run succeeds
post-merge.

**Pattern (unchanged, for planner awareness):**
```yaml
jobs:
  build:
    steps:
      - uses: actions/checkout@v5
      - uses: withastro/action@v5   # reinstalls from committed lockfile
  deploy:
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```
- `withastro/action@v5` reinstalls dependencies **from the committed
  `package-lock.json`** — so the regenerated lockfile is what gates the deploy
  (D-07). No workflow edits needed; only post-merge run confirmation.
- This file is itself a `github-actions` target that the new `dependabot.yml`
  will monitor (so `actions/checkout`, `withastro/action`, `actions/deploy-pages`
  pins become Dependabot-managed going forward).

---

## Shared Patterns

### `.github` YAML config conventions
**Source:** `.github/workflows/deploy.yml`
**Apply to:** `.github/dependabot.yml`
- 2-space indentation, `lf` endings, lowercase keys, double-quoted string values
  where the action does (`branches: ["master"]`).
- Major-version pinning style (`@v5`) — relevant context for what Dependabot
  will bump.
- Default/target branch is **`master`** (repo convention), not `main`.

### Lockfile-as-source-of-truth
**Source:** D-04 + Integration Points + `deploy.yml` (`withastro/action@v5`)
**Apply to:** `package.json` + `package-lock.json`
- Direct deps stay caret-ranged in `package.json`; exact transitive versions
  live in `package-lock.json`; the deploy action installs from the lockfile.
  Therefore the security fix lands in the lockfile, and the manifest stays
  minimal.

### Minimal-config principle
**Source:** `.github/workflows/deploy.yml` (32 lines, zero optional knobs) + D-05
("dependabot.yml minimale")
**Apply to:** `.github/dependabot.yml`
- Add only what's required (2 ecosystems, weekly, grouped). No extra
  `open-pull-requests-limit`, `reviewers`, `labels`, `commit-message` unless the
  planner has a concrete reason.

## No Analog Found

| File | Role | Reason |
|------|------|--------|
| `package.json` | package manifest | Only manifest in repo; structure dictated by npm, not by a sibling pattern. Pattern = preserve current minimal caret-dep shape (D-04). |
| `package-lock.json` | lockfile | Machine-generated; never hand-authored. No code pattern exists or should exist. Regenerate via `npm audit fix` (no `--force`) + `npm update`. |

> For `.github/dependabot.yml` there is no Dependabot precedent in this repo, but
> a real config analog (`deploy.yml`) supplies the YAML conventions; the schema
> itself comes from the Dependabot v2 spec, not from RESEARCH.md (research was
> skipped this phase).

## Metadata

**Analog search scope:** `.github/` (workflows + config), repo root (`package.json`, `package-lock.json`)
**Files scanned:** 4 (`.github/workflows/deploy.yml`, `package.json`, `package-lock.json` header, `.github/` dir listing)
**Skills directories:** none found (`.claude/skills/`, `.agents/skills/` absent)
**CLAUDE.md:** none found
**Pattern extraction date:** 2026-06-03
