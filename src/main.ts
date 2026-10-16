import { initChapters } from './behaviors/chapters';
import { initCursor } from './behaviors/cursor';
import { afterLoad, initIslands } from './behaviors/islands';
import { initNav, initScrollTop } from './behaviors/nav';
import { initProcess } from './behaviors/process';
import { initReveal } from './behaviors/reveal';
import { initToc } from './behaviors/toc';
import { langOf } from './lang';
import { INTERACTIVE_MARK } from './perf';
import './index.css';

/**
 * The page script. Pages arrive fully rendered (scripts/prerender.mjs), so this only wires up behavior:
 * small plain-DOM scripts for the header, scroll effects and canvases, and React only inside the
 * <Island> widgets, each hydrated on its own when needed. Loaded by the boot loader once the full
 * stylesheet is in, which may still be before the document has finished parsing.
 */
function start() {
  initReveal();
  initNav();
  initScrollTop();
  initCursor();
  initProcess();
  initChapters();
  initToc();
  initIslands(langOf(location.pathname));

  // The hero's WebGL ribbon waits until the page is idle after load.
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const box = document.querySelector<HTMLElement>('[data-hero-box]');
  if (canvas && box) afterLoad(() => import('./behaviors/hero').then((m) => m.initHero(canvas, box)));

  // The footer wordmark loads as it nears the screen.
  const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');
  if (wordmark) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        import('./behaviors/wordmark').then((m) => m.initWordmark(wordmark));
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(wordmark);
  }

  performance.mark(INTERACTIVE_MARK);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
