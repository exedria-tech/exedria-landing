import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { CursorField } from './components/Overlays';
import { LangProvider } from './i18n';
import { CaseStudy } from './pages/CaseStudy';
import { ContactPage } from './pages/ContactPage';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Portfolio } from './pages/Portfolio';
import { Privacy } from './pages/Privacy';
import { ServicesPage } from './pages/ServicesPage';
import { Studio } from './pages/Studio';
import { Terms } from './pages/Terms';

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
      const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
      return () => cancelAnimationFrame(raf);
    }
    // Back/forward keeps the browser's own scroll restoration.
    if (changed && type !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, key, type]);
  return null;
}

export default function App() {
  return (
    <LangProvider>
      <ScrollManager />
      <CursorField />
      <Nav />
      <main className="relative z-[2]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicii" element={<ServicesPage />} />
          <Route path="/lucrari" element={<Portfolio />} />
          <Route path="/lucrari/:slug" element={<CaseStudy />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/termeni" element={<Terms />} />
          <Route path="/confidentialitate" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <div className="relative z-[2]">
        <Footer />
      </div>
    </LangProvider>
  );
}
