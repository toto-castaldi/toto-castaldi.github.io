# Phase 3: Foundation & i18n Content - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

CSS variable refactor (extract all hardcoded colors to custom properties for dark mode prep) and Astro i18n setup with Italian (/) and English (/en/) landing pages. Both locales live and deployed, identical structure.

</domain>

<decisions>
## Implementation Decisions

### EN translation content
- Claude drafts English translations from the Italian source, user reviews before committing
- Professional tone matching the Italian version — no shift to informal
- Section titles use natural English equivalents, not literal translations (e.g., adapt to what sounds best in English)
- Name stays "Toto Castaldi" in both languages — consistent personal branding

### CSS variable strategy
- Semantic naming convention: --color-text, --color-bg, --color-accent, etc. (named by purpose)
- Keep current color palette exactly — extract existing hex values into variables with zero visual change
- Variable definition location and whether to include non-color properties (spacing, etc.) left to Claude's discretion

### Default locale behavior
- Browser language detection via small JS snippet (navigator.language check + redirect)
- Locale preference remembered in localStorage — once chosen, persists across visits
- Fallback for non-IT/EN browsers: English (as the more international option)
- / serves Italian content by default (before any JS detection runs)

### Content adaptation
- Same four sections in both languages: Entrepreneurship, Computer Science, Fitness, CNV
- CNV translated as-is — no extra context added for international audience
- External links kept as original URLs (no swapping to English equivalents)
- Identical layout and visual structure between IT and EN — only text changes

### Claude's Discretion
- CSS variable definition location (:root in global CSS vs separate file)
- Whether to extract non-color properties (spacing, fonts) into variables
- Exact English equivalents for section titles

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for Astro i18n routing and CSS variable organization.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-foundation-i18n-content*
*Context gathered: 2026-02-20*
