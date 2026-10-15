// Writes one static HTML file per route (dist/<route>.html) from the SSR build, so every page
// arrives with its content and the client hydrates it. Also: a non-blocking entry loader, inlined CSS,
// preloaded fonts. Vercel serves /platforma from platforma.html (cleanUrls).
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const { render, ROUTES } = await import(join(root, 'dist-ssr/entry-server.js'));

let template = await readFile(join(dist, 'index.html'), 'utf8');

// The entry script is replaced by a tiny loader that import()s the app bundle. A dynamic import never
// holds back DOMContentLoaded in any browser (Safari waits for async scripts); the modulepreload starts
// the bundle download right away. The HTML already holds the page, so nothing waits on the bundle.
const entryMatch = template.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
if (!entryMatch) throw new Error('entry script not found in index.html');
const loader = `import(${JSON.stringify(entryMatch[1])});\n`;
const loaderFile = `assets/boot-${createHash('sha256').update(loader).digest('hex').slice(0, 8)}.js`;
await writeFile(join(dist, loaderFile), loader);
template = template.replace(
  entryMatch[0],
  () => `<link rel="modulepreload" crossorigin href="${entryMatch[1]}"><script type="module" crossorigin src="/${loaderFile}"></script>`,
);

// Inline the stylesheet: one less render-blocking request.
const cssMatch = template.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if (cssMatch) {
  const css = await readFile(join(dist, cssMatch[1]), 'utf8');
  // The disabled link is never fetched; it only tells Vite's dynamic-import helper the sheet is already present.
  template = template.replace(cssMatch[0], () => `<style>${css}</style><link rel="stylesheet" href="${cssMatch[1]}" disabled>`);
}

// Preload the two Latin font files every page uses.
const assets = await readdir(join(dist, 'assets'));
const fonts = assets.filter((f) => /^geist(-mono)?-latin-wght-normal-.*\.woff2$/.test(f));
const preload = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`).join('');
template = template.replace('</title>', `</title>${preload}`);

// Each route's lazy page chunk (plus its static imports), preloaded so hydration doesn't wait on a second round trip.
const manifest = JSON.parse(await readFile(join(dist, '.vite/manifest.json'), 'utf8'));
const PAGE_SRC = {
  '/platforma': 'src/pages/ServicesPage.tsx',
  '/lucrari': 'src/pages/Portfolio.tsx',
  '/studio': 'src/pages/Studio.tsx',
  '/contact': 'src/pages/ContactPage.tsx',
  '/termeni': 'src/pages/Terms.tsx',
  '/confidentialitate': 'src/pages/Privacy.tsx',
};
const pageSrc = (route) => PAGE_SRC[route] ?? (route.startsWith('/lucrari/') ? 'src/pages/CaseStudy.tsx' : null);
const entry = Object.values(manifest).find((c) => c.isEntry);
function chunkFiles(key, seen = new Set()) {
  const c = manifest[key];
  if (!c || seen.has(c.file) || c.file === entry.file) return seen;
  seen.add(c.file);
  for (const i of c.imports ?? []) chunkFiles(i, seen);
  return seen;
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

for (const route of ROUTES) {
  const { html, title } = await render(route);
  let page = template.replace('<div id="root"></div>', () => `<div id="root" data-path="${route}">${html}</div>`);
  const src = pageSrc(route);
  if (src) {
    if (!manifest[src]) throw new Error(`${route}: ${src} missing from the Vite manifest`);
    const links = [...chunkFiles(src)].map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`).join('');
    page = page.replace('</head>', `${links}</head>`);
  }
  if (title) page = page.replace(/<title>[^<]*<\/title>/, () => `<title>${escape(title)}</title>`);
  if (/<script>|<template/.test(html)) throw new Error(`${route}: prerender left a pending Suspense boundary`);
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  await mkdir(dirname(join(dist, file)), { recursive: true });
  await writeFile(join(dist, file), page);
  console.log(`prerendered ${route} → ${file} (${(page.length / 1024).toFixed(1)} KB)`);
}

await rm(join(root, 'dist-ssr'), { recursive: true, force: true });
await rm(join(dist, '.vite'), { recursive: true, force: true });
