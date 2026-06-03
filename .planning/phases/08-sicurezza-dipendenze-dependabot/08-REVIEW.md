---
phase: 08-sicurezza-dipendenze-dependabot
reviewed: 2026-06-03T00:00:00Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - .github/dependabot.yml
findings:
  critical: 0
  warning: 2
  info: 4
  total: 6
status: issues_found
---

# Phase 8: Code Review Report

**Reviewed:** 2026-06-03
**Depth:** standard
**Files Reviewed:** 1
**Status:** issues_found

## Summary

Reviewed the new `.github/dependabot.yml` (Dependabot v2 config) for schema correctness, security/governance soundness, and project-convention consistency.

The file is schema-valid: `version: 2` is correct, both `updates` entries declare valid `package-ecosystem` (`npm`, `github-actions`), `directory: "/"`, a valid `schedule.interval`, and well-formed `groups` blocks. It follows the project's deploy.yml conventions (2-space indent, lowercase keys, double-quoted strings). Dependabot defaults to the repository default branch (`master`) when `target-branch` is omitted, so the absence of `target-branch` is correct, not a defect.

No critical issues. The findings are governance/robustness concerns: grouping all updates (including security-sensitive GitHub Actions and npm major version bumps) under a single `"*"` pattern reduces per-PR review scrutiny and batches breaking changes with benign ones. Several hardening fields recommended for a security-focused phase are absent (`open-pull-requests-limit`, separation of major bumps, reviewers/labels). These are warnings/info rather than blockers because the config will function correctly as written.

## Warnings

### WR-01: Catch-all `"*"` group batches major (breaking) version bumps with patch/minor updates

**File:** `.github/dependabot.yml:7-10` (npm) and `:15-18` (github-actions)
**Issue:** Both groups use `patterns: ["*"]` with no `update-types` filter. This means a major version bump (e.g., `astro` 5.x to 6.x, or `actions/checkout@v5` to `@v6`) is merged into the same PR as routine patch/minor updates. For a phase whose explicit goal is dependency *security and governance*, this defeats reviewability: a breaking or potentially malicious major upgrade is hidden inside an otherwise-green "bump dependencies" PR, lowering the scrutiny applied to exactly the change that warrants the most review. It also makes a single CI failure block all unrelated updates in the group.
**Fix:** Restrict each catch-all group to non-breaking update types and let majors arrive as individual, clearly-titled PRs:
```yaml
    groups:
      npm-dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
```
Apply the same `update-types` filter to the `github-actions` group.

### WR-02: No `open-pull-requests-limit` set; relies on implicit default

**File:** `.github/dependabot.yml:3-18`
**Issue:** Neither ecosystem sets `open-pull-requests-limit`, so each silently inherits the Dependabot default of 5 concurrent PRs. With grouping enabled the practical PR count is low today, but relying on an undocumented default is fragile for a governance config and offers no explicit cap if grouping is later relaxed. Making the intended limit explicit is part of "governance soundness."
**Fix:** Add an explicit limit to each `updates` entry, e.g.:
```yaml
  - package-ecosystem: "npm"
    directory: "/"
    open-pull-requests-limit: 5
    schedule:
      interval: "weekly"
```

## Info

### IN-01: Grouped npm updates span both dependencies and devDependencies without scope control

**File:** `.github/dependabot.yml:7-10`
**Issue:** The `"*"` pattern groups every npm dependency regardless of scope. The project currently has a single runtime dependency (`astro`) and no devDependencies, so impact is nil today, but as devDependencies are added they will be merged into the same group/PR as runtime deps, mixing risk profiles.
**Fix:** Optional — if dev/runtime separation becomes desirable, use `dependency-type` within groups (`development` / `production`) to split them.

### IN-02: No `labels` applied to Dependabot PRs

**File:** `.github/dependabot.yml:3-18`
**Issue:** Neither ecosystem defines `labels`. For a governance-oriented setup, labels (e.g., `dependencies`, `security`) improve triage and let downstream automation/filters act on Dependabot PRs.
**Fix:** Add `labels: ["dependencies"]` (and an ecosystem-specific label such as `github-actions`) to each `updates` entry.

### IN-03: No `reviewers`/`assignees` for governance ownership

**File:** `.github/dependabot.yml:3-18`
**Issue:** No reviewer or assignee is configured, so grouped dependency PRs have no designated owner. For a single-maintainer repo this is acceptable, but explicit ownership is a governance best practice and makes intent clear.
**Fix:** Optionally add `reviewers: ["toto-castaldi"]` (or use repo branch-protection / CODEOWNERS instead).

### IN-04: No `commit-message` convention specified

**File:** `.github/dependabot.yml:3-18`
**Issue:** Dependabot will generate default commit messages. The repo uses Conventional Commits (e.g., `docs(state):`, `chore:` in recent history). Without a `commit-message` block, Dependabot's defaults may not match that convention.
**Fix:** Optionally pin the prefix to match repo style:
```yaml
    commit-message:
      prefix: "chore"
      include: "scope"
```

---

_Reviewed: 2026-06-03_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
