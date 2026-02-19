# Feature Research

**Domain:** Personal landing page (single-page static site)
**Researched:** 2026-02-19
**Confidence:** HIGH — project scope is tightly constrained by PROJECT.md; personal page feature landscape is well-understood

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist. Missing these = page feels broken or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Responsive layout (mobile + desktop) | Mobile traffic dominates; unreadable on phone = instant exit | LOW | CSS only, no JS. Flexbox or simple CSS grid. |
| Readable typography | Content-first page — if text is hard to read, there's nothing else | LOW | Font size, line-height, measure (max-width on text). Single font family is fine. |
| Semantic HTML headings | Screen readers, SEO crawlers, accessibility baseline | LOW | h1 for name, h2 for each section (Imprenditoria, Informatica, Fitness, CNV) |
| Clickable email contact | Users expect to reach the person; missing = page feels dead | LOW | `mailto:` link. Already in content. |
| External links open correctly | GitHub, Skillbill, toto-castaldi.com are linked — they must work | LOW | `target="_blank"` with `rel="noopener noreferrer"` |
| Page title + browser tab label | Missing = tab shows blank or URL; basic professionalism signal | LOW | `<title>Antonio Castaldi</title>` in `<head>` |
| Favicon | Missing favicon = broken feel in bookmarks and browser tabs | LOW | Single 32x32 or 48x48 ICO/PNG. No elaborate multi-size set needed. |
| Meta viewport tag | Without it, mobile layout breaks completely | LOW | Already standard; part of any framework's base template |
| HTTPS | GitHub Pages provides this automatically — expected by all browsers | LOW | Automatic via GitHub Pages; no action needed |
| Fast load time | Static page with no client JS — users expect near-instant load | LOW | Astro zero-JS default delivers this automatically |

### Differentiators (Competitive Advantage)

This is a personal page, not a product. "Competitive advantage" means: makes a good impression, reflects Toto's personality, is memorable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Typographic polish (improved spacing, font sizing, line-height) | Signals craft and care; current Jekyll/Minima default looks unpolished | LOW | CSS variables for spacing scale. System font stack or single web font (e.g. Inter or similar). |
| Open Graph meta tags (og:title, og:description, og:image) | When shared on LinkedIn/WhatsApp/Telegram, the preview looks professional instead of blank | LOW | Static og:image is fine — a simple 1200x630 text-on-white image. No dynamic generation needed. |
| Structured data (schema.org Person) | Signals to Google who this page is about; improves knowledge panel appearance | LOW | One `<script type="application/ld+json">` block with Person schema. No library needed. |
| "Written without AI" signal | Already present in the page — authentic personal touch, distinctive | LOW | Keep this verbatim from the existing content |
| Section anchor links | Allows sharing direct links to e.g. #fitness or #informatica | LOW | Native HTML `id` attributes on section headings. Zero JS. |
| Clean print stylesheet | Someone printing a CV or saving as PDF gets a clean result | LOW | `@media print` CSS block. Rarely done, noticeable. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good for a personal page but contradict the project constraints or add complexity with no payoff.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Blog / posts section | "I could share thoughts" | Out of scope per PROJECT.md; adds routing, templating, content management complexity | Keep content in markdown sections on the single page |
| Dark mode toggle (JS) | Modern UX trend | Requires client JS (violates zero-JS constraint) and adds CSS complexity; the site's brand is "minimal white" | Use `@media (prefers-color-scheme: dark)` in CSS only if desired — or skip; white is the design language |
| Contact form | More convenient than email link | Requires backend or third-party service (Formspree etc.); adds dependencies; a mailto link is sufficient for this use case | Keep `mailto:` link |
| Newsletter signup | Growing an audience | Not a content creator page; no content to subscribe to; adds third-party JS | Not applicable — omit entirely |
| Analytics (Google Analytics, Plinio, etc.) | "See who visits" | Explicitly out of scope in PROJECT.md; adds JS and GDPR complexity | None — the page exists to be a reference, not to be measured |
| Social media icons/links sidebar | Common on personal pages | Current content has no social profiles listed; adding them adds noise; the identity is in the text | Keep contact as single email link only |
| Comments section | Community engagement | No blog = no comments; requires JS + backend (Disqus etc.) | Not applicable |
| Search | Discoverability within the page | Single page with four short sections; search is absurd at this scale | Browser Cmd+F is sufficient |
| Cookie banner | Legal compliance | No tracking, no analytics, no cookies — banner is legally unnecessary and clutters a minimal design | No cookies = no banner needed |
| Loading animations / page transitions | Modern feel | Require JS; contradict zero-JS constraint and minimal aesthetic | Fast load time (Astro static) eliminates the need for perceived performance tricks |
| Multi-language support (EN/IT) | International audience | Content is personal, in Italian — the audience is Italian speakers who know Toto; adds complexity with no benefit | Content stays in Italian |
| Image gallery for fitness/projects | Visual richness | No images in current content; adds weight; minimal design philosophy avoids it | Text links to external resources (GitHub, other sites) |

## Feature Dependencies

```
[Semantic HTML headings]
    └──enables──> [Section anchor links]
                       └──enables──> [Direct section sharing via URL]

[Open Graph meta tags]
    └──requires──> [Static og:image asset]

[Responsive layout]
    └──requires──> [Meta viewport tag] (table stakes, already assumed)

[Structured data (Person schema)]
    └──enhances──> [Page title + browser tab label] (same identity information)
```

### Dependency Notes

- **Section anchor links require semantic headings:** Anchor links (`#imprenditoria`) only work if headings have stable `id` attributes. Set these deliberately rather than relying on auto-generated ones.
- **OG meta tags require a static og:image:** Even a simple white-on-black PNG with "Antonio Castaldi" text is better than no image. Must exist before OG tags are meaningful.
- **No dark mode JS means CSS-only dark mode is the only option:** If dark mode is wanted later, it must be implemented via `@media (prefers-color-scheme: dark)` — not a toggle button.

## MVP Definition

### Launch With (v1)

Minimum to replace the Jekyll site and feel complete.

- [ ] Single HTML page rendered from markdown content — exactly matching current `index.markdown`
- [ ] Semantic structure: h1 (name), h2 per section (Imprenditoria, Informatica, Fitness, CNV)
- [ ] Responsive layout — readable on mobile and desktop
- [ ] Readable typography — improved over current Minima default (font size, line-height, max-width)
- [ ] Favicon — basic, single file
- [ ] Page title and meta description in `<head>`
- [ ] External links with `rel="noopener noreferrer"`
- [ ] Email contact link (`mailto:`)
- [ ] Deploy to GitHub Pages via GitHub Actions

### Add After Validation (v1.x)

Nice polish once the site is live and working.

- [ ] Open Graph meta tags + static og:image — add after confirming site loads correctly at production URL
- [ ] Section anchor links — add `id` attributes to section headings; zero risk
- [ ] Structured data (schema.org Person) — add as a single JSON-LD block; low effort, good SEO signal

### Future Consideration (v2+)

Not in scope now; revisit only with a new milestone.

- [ ] Print stylesheet — low priority; nobody is printing this page in the short term
- [ ] CSS-only dark mode — if design direction changes; zero JS but adds CSS complexity to a minimal design

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Markdown content rendering | HIGH | LOW | P1 |
| Responsive layout | HIGH | LOW | P1 |
| Readable typography | HIGH | LOW | P1 |
| Favicon | MEDIUM | LOW | P1 |
| Page title + meta description | MEDIUM | LOW | P1 |
| External link safety (`rel`) | LOW | LOW | P1 (zero cost) |
| GitHub Actions deploy | HIGH | LOW | P1 |
| Open Graph meta + og:image | MEDIUM | LOW | P2 |
| Section anchor links | LOW | LOW | P2 |
| Structured data (Person schema) | LOW | LOW | P2 |
| Print stylesheet | LOW | LOW | P3 |
| CSS-only dark mode | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

"Competitors" here are other minimal personal pages / developer landing pages. The reference points are typical personal pages from Italian tech founders/freelancers.

| Feature | Typical personal page | Overbuilt personal page | Our approach |
|---------|----------------------|------------------------|--------------|
| Navigation | Full header nav with links | Mega menu, hamburger, sticky | No nav — single page, scroll |
| Content | Paragraphs, some links | Blog, portfolio grid, skills bars, testimonials | Four sections + contact, verbatim from existing content |
| Visuals | Photo, icons | Animated hero, background video | No images (existing site has none in main content) |
| Contact | Email + social icons | Contact form, calendly embed | Single mailto link |
| Typography | System fonts or one web font | Multiple fonts, variable weights | One clean font, improved spacing |
| JS | Some analytics, maybe a framework | Heavy SPA, scroll animations | Zero JS |

## Sources

- Existing site content: `/home/toto/scm-projects/toto-castaldi.github.io/index.markdown`
- Project requirements: `/home/toto/scm-projects/toto-castaldi.github.io/.planning/PROJECT.md`
- [Astro SEO complete guide (2025)](https://eastondev.com/blog/en/posts/dev/20251202-astro-seo-complete-guide/) — MEDIUM confidence (blog post)
- [Robots.txt and SEO 2026 — Search Engine Land](https://searchengineland.com/robots-txt-seo-453779) — MEDIUM confidence
- [Google: Define Website Favicon for Search Results](https://developers.google.com/search/docs/appearance/favicon-in-search) — HIGH confidence (official docs)
- [WCAG color contrast requirements — BOIA](https://www.boia.org/blog/offering-a-dark-mode-doesnt-satisfy-wcag-color-contrast-requirements) — HIGH confidence
- [Dark Mode users & issues — Nielsen Norman Group](https://www.nngroup.com/articles/dark-mode-users-issues/) — HIGH confidence
- [Web.dev color and contrast accessibility](https://web.dev/articles/color-and-contrast-accessibility) — HIGH confidence (Google official)
- Landing page design trends 2026: [Zoho LandingPage](https://www.zoho.com/landingpage/landing-page-design-trends.html), [involve.me](https://www.involve.me/blog/landing-page-design-trends) — LOW confidence (marketing-oriented)

---
*Feature research for: personal landing page (Astro rebuild of toto-castaldi.github.io)*
*Researched: 2026-02-19*
