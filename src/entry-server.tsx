import { StrictMode, type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { CursorField } from './components/Overlays';
import { ssrHead } from './components/ui';
import { LangProvider } from './i18n';
import { localize, type Lang } from './lang';
import { CaseStudy } from './pages/CaseStudy';
import { ContactPage } from './pages/ContactPage';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { PortfolioPage } from './pages/Portfolio';
import { Privacy } from './pages/Privacy';
import { ServicesPage } from './pages/ServicesPage';
import { Terms } from './pages/Terms';

export { ROUTES } from './routes';

const PAGES: Record<string, () => ReactNode> = {
  '/': () => <Home />,
  '/servicii': () => <ServicesPage />,
  '/lucrari': () => <PortfolioPage />,
  '/contact': () => <ContactPage />,
  '/termeni': () => <Terms />,
  '/confidentialitate': () => <Privacy />,
};

const page = (route: string | null) =>
  route === null ? <NotFound /> : (PAGES[route]?.() ?? (route.startsWith('/lucrari/') ? <CaseStudy slug={route.slice(9)} /> : <NotFound />));

/** Renders one route (null: the 404 page) in one language to static HTML, plus its <title>. */
export function render(route: string | null, lang: Lang) {
  ssrHead.title = '';
  const html = renderToString(
    <StrictMode>
      <LangProvider lang={lang}>
        <CursorField />
        <Nav pathname={localize(route ?? '/404', lang)} />
        <main className="relative z-[2]">{page(route)}</main>
        <div className="relative z-[2]">
          <Footer />
        </div>
      </LangProvider>
    </StrictMode>,
  );
  return { html, title: ssrHead.title };
}
