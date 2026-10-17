// Language plumbing shared by the prerender, the islands and the plain browser script (main.ts), so it
// must not import React. Romanian pages live at /x, their English copies at /en/x.

export type Lang = 'ro' | 'en';

const KEY = 'exedria-lang';

/** The language the visitor picked with the RO/EN switch, or null if they never did. */
export function savedLang(): Lang | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'ro' || v === 'en') return v;
  } catch {
    /* storage unavailable */
  }
  return null;
}

export function saveLang(l: Lang) {
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* storage unavailable */
  }
}

/** Language of a page, from its path. */
export const langOf = (pathname: string): Lang => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ro');

/** A site path ("/servicii#video", "/contact?serviciu=web") in the given language; other links pass through. */
export function localize(to: string, lang: Lang) {
  if (lang === 'ro' || !to.startsWith('/') || to.startsWith('/api/') || to.startsWith('/media/')) return to;
  const [, path, rest] = to.match(/^([^?#]*)(.*)$/)!;
  return (path === '/' ? '/en' : `/en${path}`) + rest;
}

/** The same page in the other language. */
export function counterpart(pathname: string, target: Lang) {
  const base = langOf(pathname) === 'en' ? pathname.slice(3) || '/' : pathname;
  return localize(base, target);
}
