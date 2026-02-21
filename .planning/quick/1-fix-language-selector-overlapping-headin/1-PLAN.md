---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/styles/global.css
  - src/layouts/Base.astro
autonomous: true
requirements: [FIX-LANG-OVERLAP]

must_haves:
  truths:
    - "Language selector does not overlap the h1 heading on any viewport width"
    - "Language selector and theme toggle are both visible and accessible on mobile"
    - "Language selector remains clickable and properly styled on all viewports"
  artifacts:
    - path: "src/styles/global.css"
      provides: "Repositioned .lang-switch styles"
      contains: ".lang-switch"
    - path: "src/layouts/Base.astro"
      provides: "Grouped toolbar with lang-switch and theme toggle"
  key_links:
    - from: "src/layouts/Base.astro"
      to: "src/styles/global.css"
      via: ".lang-switch and .site-toolbar classes"
      pattern: "lang-switch|site-toolbar"
---

<objective>
Fix language selector overlapping the "Antonio Castaldi" h1 heading on mobile viewport.

Purpose: The `.lang-switch` element is `position: fixed; top: 1rem; left: 1rem` which directly overlaps the page heading on narrow viewports. Moving both controls (language switch and theme toggle) into a shared fixed toolbar in the top-right corner eliminates the overlap cleanly.

Output: Language selector repositioned to top-right area alongside theme toggle, no heading overlap on any viewport.
</objective>

<execution_context>
@/home/toto/.claude/get-shit-done/workflows/execute-plan.md
@/home/toto/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/styles/global.css
@src/layouts/Base.astro
@src/components/ThemeToggle.astro
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create fixed toolbar and reposition language switch to top-right</name>
  <files>src/layouts/Base.astro, src/styles/global.css, src/components/ThemeToggle.astro</files>
  <action>
**In `src/layouts/Base.astro`:**
Wrap the lang-switch `<a>` and `<ThemeToggle />` in a shared container div with class `site-toolbar`:

```html
<div class="site-toolbar">
  <a href={alternateUrl} class="lang-switch" ...>{alternateLabel}</a>
  <ThemeToggle />
</div>
```

Remove the standalone `<a class="lang-switch">` and `<ThemeToggle />` that are currently separate siblings in the `<body>`.

**In `src/styles/global.css`:**
1. Add `.site-toolbar` styles:
   - `position: fixed; top: 1rem; right: 1rem;` (top-right corner)
   - `z-index: 1000;`
   - `display: flex; align-items: center; gap: 0.5rem;`
   - Language switch appears first (left), theme toggle second (right)

2. Update `.lang-switch` styles:
   - REMOVE `position: fixed`, `top: 1rem`, `left: 1rem`, `z-index: 1000` (positioning now handled by parent toolbar)
   - KEEP: `font-size: 0.875rem`, `color: var(--color-text)`, `text-decoration: none`, `padding: 0.25rem 0.5rem`, `border: 1px solid var(--color-border)`, `border-radius: 4px`, `background: var(--color-bg)`, `cursor: pointer`
   - KEEP the `:hover` and `:focus-visible` rules unchanged

3. The `.lang-switch:hover` and `.lang-switch:focus-visible` rules stay exactly as they are.

**In `src/components/ThemeToggle.astro`:**
Update the `<style>` block for the `button` rule:
   - REMOVE `position: fixed`, `top: 1rem`, `right: 1rem`, `z-index: 1000` (positioning now handled by parent toolbar)
   - KEEP all other button styles (`background: none`, `border: none`, `cursor: pointer`, `padding: 0.5rem`, `color: var(--color-text)`, `display: flex`, `align-items: center`)
  </action>
  <verify>
Run `npm run build` to confirm the site builds without errors. Inspect the built HTML at `dist/index.html` and `dist/en/index.html` to verify:
1. Both controls are wrapped in a `div.site-toolbar`
2. The `.lang-switch` CSS no longer has `position: fixed` or `left: 1rem`
3. The `.site-toolbar` CSS has `position: fixed; top: 1rem; right: 1rem;`
4. The theme toggle button CSS no longer has `position: fixed`
  </verify>
  <done>
Language selector and theme toggle are grouped in a fixed top-right toolbar. The h1 heading area on the left side is completely clear of overlapping elements. Both controls remain visible, styled, and clickable on all viewports including mobile. The site builds cleanly.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` succeeds with zero errors
2. Visual check: On a narrow viewport (375px), the h1 "Antonio Castaldi" is fully visible with no overlapping elements
3. Both language switch and theme toggle are accessible in the top-right corner
4. Language switch link navigates to the alternate language page
5. Theme toggle still functions (click toggles dark/light mode)
</verification>

<success_criteria>
- Language selector no longer overlaps heading text on any viewport width
- Both controls (lang switch + theme toggle) are grouped in a fixed top-right toolbar
- No visual regression on desktop viewports
- Site builds without errors
</success_criteria>

<output>
After completion, create `.planning/quick/1-fix-language-selector-overlapping-headin/1-SUMMARY.md`
</output>
