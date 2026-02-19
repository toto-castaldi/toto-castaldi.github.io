# Roadmap: toto-castaldi.github.io Tech Rebuild

## Overview

Rebuild tecnologico della landing page personale: si sostituisce Jekyll con Astro, si configura il deploy CI/CD su GitHub Pages tramite GitHub Actions, e si migra contenuto, layout e metadata. La fase 1 porta online un deploy funzionante con placeholder — niente contenuto, ma CI verificata. La fase 2 completa tutto il resto: contenuto, design, SEO/meta.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Scaffold e CI/CD** - Astro inizializzato, Jekyll rimosso, deploy automatico verificato su GitHub Pages
- [ ] **Phase 2: Contenuto, Design e Metadata** - Contenuto migrato, layout responsive, tipografia, SEO/meta completi

## Phase Details

### Phase 1: Scaffold e CI/CD
**Goal**: Il sito Astro si deploya automaticamente su https://toto-castaldi.github.io/ ad ogni push a master, con Jekyll completamente rimosso
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06
**Success Criteria** (what must be TRUE):
  1. Pushing a master triggers a GitHub Actions build that completes without errors
  2. https://toto-castaldi.github.io/ serves an Astro-generated HTML page (not Jekyll output)
  3. No Jekyll files exist in the repo (Gemfile, _layouts/, _includes/, _sass/, jekyll.yml are gone)
  4. package-lock.json is present and committed alongside the workflow file
**Plans:** 1 plan
Plans:
- [ ] 01-01-PLAN.md — Scaffold Astro, remove Jekyll, configure CI/CD deploy workflow

### Phase 2: Contenuto, Design e Metadata
**Goal**: La landing page mostra tutto il contenuto attuale con design minimale migliorato, link funzionanti, e metadata completi per SEO e social sharing
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, DSGN-01, DSGN-02, DSGN-03, DSGN-04, META-01, META-02, META-03, META-04
**Success Criteria** (what must be TRUE):
  1. All four sections (Imprenditoria, Informatica, Fitness, Comunicazione Non Violenta) are visible with content identical to the current index.markdown
  2. The email link opens a mail client pre-addressed to toto.castaldi@gmail.com
  3. External links (Skillbill, GitHub, toto-castaldi.com) open in a new tab without security warnings
  4. The page renders correctly on a mobile viewport and on desktop without horizontal scrolling
  5. Sharing the URL on social media shows a title, description, and Open Graph preview
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffold e CI/CD | 0/1 | Not started | - |
| 2. Contenuto, Design e Metadata | 0/TBD | Not started | - |
