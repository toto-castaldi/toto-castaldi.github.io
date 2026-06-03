---
phase: 07-pagina-qualifiche-multilingua
plan: 01
subsystem: assets
tags: [webp, imagemagick, pdftoppm, redaction, pii, privacy]

requires: []
provides:
  - Three irreversibly-redacted WebP diploma previews under public/assets/images/
  - Final pixel dimensions for each preview (consumed by Plan 03 <img> tags)
affects: [07-03, qualifiche-pages]

tech-stack:
  added: []
  patterns:
    - "Burn opaque #1a1a1a rectangles into source pixels via `convert -draw` (irreversible redaction, NOT blur, NOT CSS overlay)"
    - "Export optimized WebP with `-resize 1000x -strip -quality 80 -define webp:method=6` (metadata stripped, <150KB budget)"
    - "Source PDFs read in place from ~/Documents — never copied into the repo"

key-files:
  created:
    - public/assets/images/qualifica-pesistica.webp
    - public/assets/images/qualifica-pilates-reformer.webp
    - public/assets/images/qualifica-pilates-cadillac.webp
  modified: []

key-decisions:
  - "Pesistica: redacted BOTH signatures (Caligaris, Lupattelli) + register number N.39740 bottom-right"
  - "Reformer: redacted the single handwritten Cristian Campana autograph"
  - "Cadillac: NO redaction — the Campana name is printed/typeset (no handwritten autograph); per D-01 printed names may remain, and the user chose to reveal it"
  - "All three keep 'Antonio Castaldi' visible (D-03); printed role labels and dates left legible"

patterns-established:
  - "Redaction coordinates derived per-diploma by rasterizing (pdftoppm 200 DPI) and reading pixel coords from the raster, not pre-computed"
  - "Human-verify checkpoint gates PII redaction before publish"

requirements-completed: [QUAL-04]

duration: 12min
completed: 2026-06-03
---

# Phase 07: Diploma Redaction → WebP Previews Summary

**Three optimized WebP diploma previews with third-party signatures (Caligaris, Lupattelli) and the register number N.39740 irreversibly burned out, Antonio Castaldi preserved.**

## Performance

- **Duration:** ~12 min (incl. human-verify checkpoint + Cadillac re-export)
- **Started:** 2026-06-03T12:22Z
- **Completed:** 2026-06-03T12:40Z
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files modified:** 3 (all created)

## Accomplishments
- Rasterized three source PDFs (~/Documents, never copied into repo) at 200 DPI and derived per-diploma redaction coordinates from the raster
- Burned opaque `#1a1a1a` rectangles over third-party PII (irreversible, in-pixel — not blur, not CSS)
- Exported metadata-stripped WebP previews, each well under the ~150KB budget
- Human-verified the redaction is irreversible and complete; no original PDF anywhere in the repo

## Final image dimensions (for Plan 03 `<img>` width/height — prevents CLS)

| File | Dimensions | Size |
|------|-----------|------|
| qualifica-pesistica.webp | 1000 × 1414 | ~47 KB |
| qualifica-pilates-reformer.webp | 1000 × 707 | ~60 KB |
| qualifica-pilates-cadillac.webp | 1000 × 707 | ~73 KB |

## Task Commits

1. **Task 1: Rasterize PDFs + identify redaction coordinates** — no repo files (raw PNGs in /tmp, coords recorded)
2. **Task 2: Burn redactions + export optimized WebP** — `38690e8` (feat)
3. **Cadillac re-export (post-checkpoint, per user decision)** — `2bd3ac2` (feat)
4. **Task 3: Human-verify checkpoint** — approved by user

## Files Created/Modified
- `public/assets/images/qualifica-pesistica.webp` — Redacted Pesistica preview (portrait); 2 signatures + N.39740 covered
- `public/assets/images/qualifica-pilates-reformer.webp` — Redacted Pilates Reformer Liv.1 preview (landscape); Campana autograph covered
- `public/assets/images/qualifica-pilates-cadillac.webp` — Pilates Cadillac Liv.1 preview (landscape); printed Campana name revealed (no autograph present)

## Decisions Made
- **Cadillac has no handwritten autograph** — only a printed/typeset "Cristian Campana" name. The plan assumed a signature to redact. Surfaced at the human-verify checkpoint; per D-01 ("printed names may remain") the user chose to reveal it, so the Cadillac ships with no redaction.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Under-redaction surfaced for human decision] Cadillac signature region**
- **Found during:** Task 1/2 (coordinate identification)
- **Issue:** Plan expected a Cristian Campana signature to redact on the Cadillac, but the document carries only a printed name, not a handwritten autograph
- **Fix:** Initially covered conservatively, then re-exported with no rectangle after user chose to reveal the printed name at the checkpoint (D-01 allows printed names)
- **Files modified:** public/assets/images/qualifica-pilates-cadillac.webp
- **Verification:** Visual confirmation — printed name visible, Antonio Castaldi visible, no autograph present
- **Committed in:** 2bd3ac2

---

**Total deviations:** 1 (surfaced at human checkpoint, resolved by user decision)
**Impact on plan:** None negative — outcome is MORE faithful to D-01. No third-party autograph was ever exposed.

## Issues Encountered
- During redaction, three faint ink leaks were caught and re-burned at high zoom: the Caligaris descender hook, the Lupattelli bottom strokes, and the Reformer autograph's diagonal tail.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Three previews ready for Plan 03's qualifiche pages. Use the exact dimensions above in `<img width height>` to protect the Performance score.
- No PDF in repo/dist/public (QUAL-04 satisfied).

---
*Phase: 07-pagina-qualifiche-multilingua*
*Completed: 2026-06-03*
