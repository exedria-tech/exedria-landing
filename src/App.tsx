import { Suspense, lazy, useEffect, useLayoutEffect, useRef, type ComponentType } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { CursorField } from './components/Overlays';
import { LangProvider } from './i18n';
import { Home } from './pages/Home';
import { MOUNT_MARK } from './perf';

/**
 * A code-split page that renders synchronously once its chunk has loaded. React.lazy alone would
 * suspend on first render even when the module is already there, which delays hydration.
 */
function page<P extends object>(load: () => Promise<ComponentType<P>>) {
  let Loaded: ComponentType<P> | null = null;
  let pending: Promise<void> | null = null;
  const preload = () => (pending ??= load().then((c) => void (Loaded = c)));
  const Lazy = lazy(() => preload().then(() => ({ default: Loaded! })));
  const Page = (props: P) => (Loaded ? <Loaded {...props} /> : <Lazy {...props} />);
  return Object.assign(Page, { preload });
}

// Inner pages are split out of the main bundle; they are prefetched once the browser is idle.
const ServicesPage = page(() => import('./pages/ServicesPage').then((m) => m.ServicesPage));
const Portfolio = page(() => import('./pages/Portfolio').then((m) => m.Portfolio));
const CaseStudy = page(() => import('./pages/CaseStudy').then((m) => m.CaseStudy));
const ContactPage = page(() => import('./pages/ContactPage').then((m) => m.ContactPage));
const Terms = page(() => import('./pages/Terms').then((m) => m.Terms));
const Privacy = page(() => import('./pages/Privacy').then((m) => m.Privacy));
const NotFound = page(() => import('./pages/NotFound').then((m) => m.NotFound));
const PAGES = [ServicesPage, Portfolio, CaseStudy, ContactPage, Terms, Privacy, NotFound];

/** Loads the page chunk for a prerendered path, so hydration can run without suspending. */
export function preloadPage(pathname: string): Promise<void> {
  const byPath: Record<string, { preload: () => Promise<void> }> = {
    '/servicii': ServicesPage,
    '/lucrari': Portfolio,
    '/contact': ContactPage,
    '/termeni': Terms,
    '/confidentialitate': Privacy,
  };
  const p = byPath[pathname] ?? (pathname.startsWith('/lucrari/') ? CaseStudy : null);
  return p ? p.preload() : Promise.resolve();
}

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

/** Commits together with the routed page (same Suspense boundary), so it marks when the page is live. */
function MountMark() {
  useLayoutEffect(() => {
    if (!performance.getEntriesByName(MOUNT_MARK).length) performance.mark(MOUNT_MARK);
  }, []);
  return null;
}

/** /platforma became /servicii again; old anchors map onto the chapter ids. */
function LegacyServices() {
  const { hash } = useLocation();
  const old: Record<string, string> = { '#site-uri': '#web', '#software': '#api' };
  return <Navigate to={`/servicii${old[hash] ?? hash}`} replace />;
}

export default function App() {
  useEffect(() => {
    const prefetch = () => PAGES.forEach((p) => p.preload().catch(() => {}));
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
          <Route path="/servicii" element={<ServicesPage />} />
          <Route path="/platforma" element={<LegacyServices />} />
          <Route path="/lucrari" element={<Portfolio />} />
          <Route path="/lucrari/:slug" element={<CaseStudy />} />
          {/* The old Motor Grafic page: its pipeline now lives on /servicii, the lab in the Video chapter. */}
          <Route path="/studio" element={<Navigate to="/servicii#cum-lucram" replace />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/termeni" element={<Terms />} />
          <Route path="/confidentialitate" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MountMark />
        </Suspense>
      </main>
      <div className="relative z-[2]">
        <Footer />
      </div>
    </LangProvider>
  );
}
