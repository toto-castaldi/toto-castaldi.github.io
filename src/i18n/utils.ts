export const defaultLang = 'it';

export type Lang = 'it' | 'en';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  return lang === 'en' ? 'en' : defaultLang;
}