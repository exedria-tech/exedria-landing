import { Suspense, lazy, useEffect, useLayoutEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { CursorField } from './components/Overlays';
import { LangProvider } from './i18n';
import { Home } from './pages/Home';
import { MOUNT_MARK } from './perf';

// Inner pages are split out of the main bundle; they are prefetched once the browser is idle.
const pages = {
  platform: () => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
  portfolio: () => import('./pages/Portfolio').then((m) => ({ default: m.Portfolio })),
  caseStudy: () => import('./pages/CaseStudy').then((m) => ({ default: m.CaseStudy })),
  studio: () => import('./pages/Studio').then((m) => ({ default: m.Studio })),
  contact: () => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
  terms: () => import('./pages/Terms').then((m) => ({ default: m.Terms })),
  privacy: () => import('./pages/Privacy').then((m) => ({ default: m.Privacy })),
  notFound: () => import('./pages/NotFound').then((m) => ({ default: m.NotFound })),
};
const ServicesPage = lazy(pages.platform);
const Portfolio = lazy(pages.portfolio);
const CaseStudy = lazy(pages.caseStudy);
const Studio = lazy(pages.studio);
const ContactPage = lazy(pages.contact);
const Terms = lazy(pages.terms);
const Privacy = lazy(pages.privacy);
const NotFound = lazy(pages.notFound);

/**
 * New pages start at the top; links with a hash scroll to that section once it is rendered.
 * Query-only changes (the portfolio filter) keep the scroll position.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const type = useNavigationType();
  const prev = useRef(pathname);
  useEffect(() => {
    const changed = prev.current !== pathname;
    prev.current = pathname;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Pages load lazily, so wait (up to ~2 s) for the target to exist.
      let raf = 0;
      let tries = 120;
      const go = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else if (tries-- > 0) raf = requestAnimationFrame(go);
      };
      raf = requestAnimationFrame(go);
      return () => cancelAnimationFrame(raf);
    }
    // Back/forward keeps the browser's own scroll restoration.
    if (changed && type !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, key, type]);
  return null;
}

/** /servicii moved to /platforma; old anchors map onto the new chapter ids. */
function LegacyServices() {
  const { hash } = useLocation();
  const old: Record<string, string> = { '#site-uri': '#web', '#software': '#api' };
  return <Navigate to={`/platforma${old[hash] ?? hash}`} replace />;
}

export default function App() {
  useLayoutEffect(() => {
    if (!performance.getEntriesByName(MOUNT_MARK).length) performance.mark(MOUNT_MARK);
  }, []);
  useEffect(() => {
    const prefetch = () => Object.values(pages).forEach((load) => load().catch(() => {}));
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(prefetch, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 2500);
    return () => clearTimeout(id);
  }, []);
  return (
    <LangProvider>
      <ScrollManager />
      <CursorField />
      <Nav />
      <main className="relative z-[2]">
        {/* min-h keeps the footer from jumping up while a page chunk loads */}
        <Suspense fallback={<div className="min-h-[100svh]" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/platforma" element={<ServicesPage />} />
          <Route path="/servicii" element={<LegacyServices />} />
          <Route path="/lucrari" element={<Portfolio />} />
          <Route path="/lucrari/:slug" element={<CaseStudy />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/termeni" element={<Terms />} />
          <Route path="/confidentialitate" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <div className="relative z-[2]">
        <Footer />
      </div>
    </LangProvider>
  );
}
