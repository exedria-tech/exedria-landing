import type { Lang } from '../lang';

/** Runs `f` once the page has loaded and the main thread is free. */
export function afterLoad(f: () => void) {
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(f, { timeout: 1500 }) : setTimeout(f, 200));
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
}

/**
 * Hydrates each <Island> (src/islands/Island.tsx) when its data-when says: right away, after load, or
 * as it nears the viewport. React and the island's code are only downloaded at that point.
 */
export function initIslands(lang: Lang) {
  const islands = [...document.querySelectorAll<HTMLElement>('[data-island]')];
  if (!islands.length) return;
  const hydrate = (el: HTMLElement) => import('../islands/hydrate').then((m) => m.hydrate(el, lang));
  // The wrapper is display: contents (no box of its own), so watch its first child.
  const owner = new Map<Element, HTMLElement>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        hydrate(owner.get(e.target)!);
      }
    },
    { rootMargin: '400px 0px' },
  );
  for (const el of islands) {
    const when = el.dataset.when;
    if (when === 'load') hydrate(el);
    else if (when === 'idle') afterLoad(() => hydrate(el));
    else {
      const target = el.firstElementChild ?? el;
      owner.set(target, el);
      io.observe(target);
    }
  }
}
