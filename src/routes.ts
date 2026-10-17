import { PROJECTS } from './data/projects';

/**
 * Every page that gets its own static HTML, in Romanian at /x and in English at /en/x. The prerender
 * (scripts/prerender.mjs) and the server entry read from here; a new page also needs its entry in
 * src/entry-server.tsx.
 */
export const ROUTES = [
  '/',
  '/servicii',
  '/lucrari',
  '/contact',
  '/termeni',
  '/confidentialitate',
  ...PROJECTS.map((p) => `/lucrari/${p.slug}`),
];

/** Top-level pages, in menu order (also the footer's page list). */
export const NAV = [
  { id: 'work', to: '/lucrari' },
  { id: 'services', to: '/servicii' },
  { id: 'contact', to: '/contact' },
] as const;
