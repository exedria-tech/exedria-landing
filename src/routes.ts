import { PROJECTS } from './data/projects';

/**
 * Every page that gets its own static HTML, with the module that renders it. The router (App.tsx),
 * the prerender (scripts/prerender.mjs) and the menu all read from here.
 */
const PAGE_FILES: Record<string, string> = {
  '/servicii': 'src/pages/ServicesPage.tsx',
  '/lucrari': 'src/pages/Portfolio.tsx',
  '/contact': 'src/pages/ContactPage.tsx',
  '/termeni': 'src/pages/Terms.tsx',
  '/confidentialitate': 'src/pages/Privacy.tsx',
};

export const ROUTES = ['/', ...Object.keys(PAGE_FILES), ...PROJECTS.map((p) => `/lucrari/${p.slug}`)];

/** Source module of a prerendered route's lazy page chunk (null for the home page, which is in the main bundle). */
export const pageFile = (route: string) => PAGE_FILES[route] ?? (route.startsWith('/lucrari/') ? 'src/pages/CaseStudy.tsx' : null);

/** Top-level pages, in menu order (also the footer's page list). */
export const NAV = [
  { id: 'work', to: '/lucrari' },
  { id: 'services', to: '/servicii' },
  { id: 'contact', to: '/contact' },
] as const;
