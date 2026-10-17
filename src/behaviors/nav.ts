import { saveLang, type Lang } from '../lang';

/** Header (components/Nav.tsx): background once scrolled, the mobile menu, and the RO/EN switch. */
export function initNav() {
  const header = document.querySelector<HTMLElement>('[data-nav]');
  if (!header) return;
  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.getElementById('mobile-nav');
  const setOpen = (open: boolean) => {
    header.toggleAttribute('data-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    if (menu) menu.inert = !open;
  };
  toggle?.addEventListener('click', () => setOpen(!header.hasAttribute('data-open')));
  menu?.addEventListener('click', (e) => (e.target as Element).closest('a') && setOpen(false));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
  // Coming back with the back button restores the page as it was left; close the menu.
  window.addEventListener('pageshow', (e) => e.persisted && setOpen(false));

  // The switch links to the same page in the other language; remember the choice and keep ?query and #hash.
  document.querySelectorAll<HTMLAnchorElement>('a[data-lang]').forEach((a) =>
    a.addEventListener('click', () => {
      saveLang(a.dataset.lang as Lang);
      a.href = a.pathname + location.search + location.hash;
    }),
  );
}

/** The footer's "back to top" button. */
export function initScrollTop() {
  document.querySelector('[data-scroll-top]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
