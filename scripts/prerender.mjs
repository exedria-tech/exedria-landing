// Writes one static HTML file per route and language from the SSR build (dist/servicii.html,
// dist/en/servicii.html, plus 404.html), so every page arrives complete; the browser script only wires up
// behavior and hydrates the islands. Also: a non-blocking entry loader, the page's own critical CSS
// inlined, preloaded fonts. Vercel serves /servicii from servicii.html (cleanUrls).
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Beasties from 'beasties';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const { render, ROUTES } = await import(join(root, 'dist-ssr/entry-server.js'));
const SITE = 'https://exedria.tech';

let template = await readFile(join(dist, 'index.html'), 'utf8');

// Each page inlines only the CSS rules its own HTML uses, so the first response stays small. The full
// stylesheet is preloaded; the loader (below) applies it and only then imports the page script, so
// anything the scripts change (open menu, reveal states, island widgets) has every rule it needs.
// A dynamic import never holds back DOMContentLoaded in any browser (Safari waits for async scripts);
// the modulepreload starts the bundle download right away. The HTML already holds the page.
const entryMatch = template.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
if (!entryMatch) throw new Error('entry script not found in index.html');
const cssMatch = template.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if (!cssMatch) throw new Error('stylesheet not found in index.html');
const fullCss = await readFile(join(dist, cssMatch[1]), 'utf8');
// @font-face rules are kept whole in their own <style>: beasties cannot tell that `var(--font-sans)` uses them.
const fontFaces = fullCss.match(/@font-face\{[^}]*\}/g)?.join('') ?? '';
if (!fontFaces) throw new Error('no @font-face rules in the stylesheet');
const css = fullCss.replace(/@font-face\{[^}]*\}/g, '');
// A visitor who picked a language with the RO/EN switch (localStorage, see src/lang.ts) is sent to that
// version of the page before anything else loads. Prerendered pages (speculation rules) check on
// activation. Vite's dynamic-import helper finds the stylesheet <link> and does not add it a second time.
const loader = `function go() {
  let saved = null;
  try { saved = localStorage.getItem('exedria-lang'); } catch {}
  const path = location.pathname;
  const en = path === '/en' || path.startsWith('/en/');
  if ((saved === 'en' && !en) || (saved === 'ro' && en)) {
    const base = en ? path.slice(3) || '/' : path;
    location.replace((en ? base : base === '/' ? '/en' : '/en' + base) + location.search + location.hash);
    return;
  }
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = ${JSON.stringify(cssMatch[1])};
  l.onload = l.onerror = () => import(${JSON.stringify(entryMatch[1])});
  document.head.append(l);
}
if (document.prerendering) document.addEventListener('prerenderingchange', go, { once: true });
else go();
`;
const loaderFile = `assets/boot-${createHash('sha256').update(loader).digest('hex').slice(0, 8)}.js`;
await writeFile(join(dist, loaderFile), loader);
template = template.replace(
  entryMatch[0],
  () => `<link rel="modulepreload" crossorigin href="${entryMatch[1]}"><script type="module" crossorigin src="/${loaderFile}"></script>`,
);
template = template.replace(cssMatch[0], () => `<style>${css}</style><link rel="preload" as="style" href="${cssMatch[1]}">`);
// Prunes the inline <style> to the selectors present in each page. Selectors with :where() (Tailwind's
// space-y-*, group-hover) and all @keyframes (Tailwind names them through var()) are kept whole.
const beasties = new Beasties({ path: dist, publicPath: '/', external: false, fonts: false, allowRules: [/:where\(/], keyframes: 'all', logLevel: 'warn' });

// Preload the font files every page uses: Latin and the Romanian letters, for Geist and Geist Mono.
const assets = await readdir(join(dist, 'assets'));
const fonts = assets.filter((f) => /^geist(-mono)?-(latin|ro)-.*\.woff2$/.test(f));
if (fonts.length !== 4) throw new Error(`expected 4 font files, found ${fonts.length}`);
const preload = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`).join('');
template = template.replace('</title>', `</title>${preload}`);

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const href = (route, lang) => SITE + (lang === 'en' ? (route === '/' ? '/en' : `/en${route}`) : route);

async function write(file, route, lang) {
  const { html, title } = render(route, lang);
  let page = template.replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);
  page = page.replace('<html lang="ro">', () => `<html lang="${lang}">`);
  if (title) page = page.replace(/<title>[^<]*<\/title>/, () => `<title>${escape(title)}</title>`);
  if (route) {
    const alt = ['ro', 'en'].map((l) => `<link rel="alternate" hreflang="${l}" href="${href(route, l)}">`).join('');
    page = page.replace('</head>', () => `${alt}<link rel="alternate" hreflang="x-default" href="${href(route, 'ro')}"></head>`);
  }
  if (/<script>|<template/.test(html)) throw new Error(`${file}: prerender left a pending Suspense boundary`);
  page = (await beasties.process(page)).replace('<style>', () => `<style>${fontFaces}</style><style>`);
  await mkdir(dirname(join(dist, file)), { recursive: true });
  await writeFile(join(dist, file), page);
  console.log(`prerendered ${file} (${(page.length / 1024).toFixed(1)} KB)`);
}

for (const lang of ['ro', 'en']) {
  for (const route of ROUTES) {
    const path = lang === 'en' ? (route === '/' ? '/en' : `/en${route}`) : route;
    await write(path === '/' ? 'index.html' : `${path.slice(1)}.html`, route, lang);
  }
}
// Vercel serves 404.html (with a 404 status) for any path without a file.
await write('404.html', null, 'ro');

await rm(join(root, 'dist-ssr'), { recursive: true, force: true });
await rm(join(dist, '.vite'), { recursive: true, force: true });
