import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
