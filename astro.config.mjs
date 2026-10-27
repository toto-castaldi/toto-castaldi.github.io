import { defineConfig } from 'astro/config';

// I .md non possono esprimere target/rel sui link: questo plugin riapre
// i link esterni (http/https) in una nuova scheda, come nel markup precedente.
// I link interni (/qualifiche) e mailto: non vengono toccati.
function rehypeExternalLinks() {
  return function (tree) {
    (function visit(node) {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && /^https?:\/\//.test(href)) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        }
      }
      for (const child of node.children ?? []) visit(child);
    })(tree);
  };
}

export default defineConfig({
  site: 'https://toto-castaldi.github.io',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    rehypePlugins: [rehypeExternalLinks],
  },
});