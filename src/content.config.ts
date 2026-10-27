import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Metadati comuni a ogni pagina (SEO / Open Graph).
const pageMeta = z.object({
  title: z.string(),
  description: z.string(),
  og: z.object({
    locale: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const certificate = z.object({
  label: z.string(),
  body: z.string(),
  alt: z.string(),
  zoom: z.string(),
});

// Home: corpo della pagina scritto in markdown nel file .md.
const home = defineCollection({
  loader: glob({ base: './content', pattern: 'index-*.md' }),
  schema: pageMeta,
});

// Qualifiche: pagine a galleria, i testi vivono nel frontmatter.
const qualifiche = defineCollection({
  loader: glob({ base: './content', pattern: 'qualifiche-*.md' }),
  schema: pageMeta.extend({
    intro: z.string(),
    back: z.string(),
    close: z.string(),
    certificates: z.object({
      pesistica: certificate,
      reformer: certificate,
      cadillac: certificate,
    }),
  }),
});

export const collections = { home, qualifiche };