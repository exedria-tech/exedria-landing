import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import App from './App';
import { ssrHead } from './components/ui';

export { ROUTES, pageFile } from './routes';

const tree = (url: string) => (
  <StrictMode>
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  </StrictMode>
);

/**
 * Renders one route to HTML. A first async pass resolves the React.lazy pages; the second, synchronous
 * pass then renders them inline. (Streaming renderers would outline large Suspense boundaries behind
 * inline scripts, which the site's CSP blocks.)
 */
export async function render(url: string) {
  const { prelude } = await prerenderToNodeStream(tree(url));
  for await (const _ of prelude as unknown as AsyncIterable<unknown>) void _;
  ssrHead.title = '';
  const html = renderToString(tree(url));
  return { html, title: ssrHead.title };
}
