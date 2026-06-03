# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v3.0 — Qualifiche Fitness

**Shipped:** 2026-06-03
**Phases:** 1 (Phase 7) | **Plans:** 3 | **Sessions:** 1

### What Was Built
- Three irreversibly-redacted WebP diploma previews (third-party signatures + register number N.39740 burned into pixels; no source PDF published).
- Path-aware `Base.astro` via an optional `alternates` prop (per-page hreflang/canonical) + full `qualifiche.*` i18n dictionary (IT/EN) + linkified Fitness paragraph.
- Two multilingual qualifiche pages (`/qualifiche`, `/en/qualifications`) with vertically-stacked previews, descriptive alt-text, a native `<dialog>` keyboard-accessible zoom, reciprocal hreflang, and back-home links. Lighthouse 100/100/100/100. Shipped via PR #22 and deployed live.

### What Worked
- **Wave-based parallel worktree execution:** Wave 1 (07-01 redaction + 07-02 foundation) ran as independent worktree agents with no file overlap, merged cleanly.
- **Human-verify checkpoints caught domain reality:** the 07-01 checkpoint surfaced that the Cadillac diploma had *no handwritten autograph* (only a printed name) — a fact no amount of static analysis would have found. The user's decision (reveal per D-01) made the output more faithful to intent.
- **Code review found a real SEO defect:** WR-02 (canonical `/qualifiche/` vs self-hreflang `/qualifiche`) was a genuine inconsistency on the exact deliverable of the phase; fixed before ship.
- **Native `<dialog>` + Invoker zoom:** zero author JS, browser-native a11y; held Lighthouse 100×4.

### What Was Inefficient
- **Checkpoint continuation lacked `SendMessage`:** the runtime couldn't resume the paused executor agent, so post-checkpoint finalization (Cadillac re-export + SUMMARY) was done inline by the orchestrator instead of a continuation agent. Worked, but off the standard path.
- **Requirements weren't auto-marked complete:** `phase.complete` left all 10 REQUIREMENTS.md checkboxes `[ ]`/Pending despite the verifier confirming 10/10; had to mark them manually before archive.
- **Stale artifact flag at milestone close:** a v2.0-era quick task showed `status: missing` in the open-artifact audit though it was actually complete (SUMMARY + commit existed) — a false positive that needed manual reconciliation.

### Patterns Established
- **Pixel-burned PII redaction** (`convert -draw`, opaque fill) — irreversible, not blur/CSS; source files never enter the repo.
- **`alternates` prop on the shared layout** for path-aware hreflang/canonical without regressing existing pages.
- **Native `<dialog>` + Invoker Commands** as the accessible zoom/modal pattern (graceful degradation accepted).

### Key Lessons
1. **Human-verify checkpoints earn their cost on PII/visual work** — they surfaced the Cadillac discovery and gated irreversible redaction; keep them blocking for privacy-sensitive assets.
2. **Run code review on the surface the phase is about** — reviewing the new pages caught a canonical↔hreflang drift that build + Lighthouse both passed over.
3. **Verify checkbox/traceability hygiene at close** — verification truth (VERIFICATION.md 10/10) and mechanical checkboxes can diverge; reconcile before archiving.

### Cost Observations
- Model mix: executors + reviewer on opus, verifier on sonnet (~mostly opus).
- Sessions: 1 (execute → ship → complete-milestone in one continuous flow).
- Notable: parallel worktrees for the one independent wave; the rest serialized on human checkpoints, so wall-clock was gated by review/approval, not compute.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 Tech Rebuild | ~1 | 2 | Jekyll → Astro; CI/CD established |
| v2.0 Enhancement & i18n | ~1 | 4 | Bilingual IT/EN, dark mode, SEO, Lighthouse 100 |
| v3.0 Qualifiche Fitness | 1 | 1 | Wave-based worktree execution + human-gated PII redaction |

### Cumulative Quality

| Milestone | Lighthouse | Zero-Dep Additions |
|-----------|-----------|--------------------|
| v1.0 | SEO-ready | zero-JS static |
| v2.0 | 100/100/100/100 | dark mode toggle (minimal JS) |
| v3.0 | 100/100/100/100 maintained | native `<dialog>` zoom (zero author JS) |

### Top Lessons (Verified Across Milestones)

1. **Lighthouse 100×4 is a sustainable bar** for this static site — held across v2.0 and v3.0 by preferring native HTML/CSS over JS.
2. **Minimal-JS / native-platform features** (dialog, Invoker, theme tokens) keep accessibility and performance high without dependencies.
