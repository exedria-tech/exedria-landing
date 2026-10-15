import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App, { preloadPage } from './App';
import { readLang } from './i18n';
import { boot } from './perf';
import './index.css';

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

/**
 * Pages are prerendered in Romanian, without query strings (scripts/prerender.mjs). Hydrate when the
 * HTML matches what this visitor will see; otherwise (English, a filter in the URL, an unknown path
 * served the fallback page) render from scratch.
 */
function start() {
  const root = document.getElementById('root')!;
  const matches = root.dataset.path === location.pathname && !location.search && readLang() === 'ro';
  if (matches) {
    boot.hydrated = true;
    // The page chunk is already modulepreloaded; waiting for it lets hydration finish in one pass.
    preloadPage(location.pathname).then(
      () => hydrateRoot(root, app),
      () => hydrateRoot(root, app),
    );
  } else {
    createRoot(root).render(app);
  }
}

// The entry script loads async, so it can run before the document has finished parsing.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
