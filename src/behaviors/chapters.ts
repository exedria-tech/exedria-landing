/** /servicii: lights the chapter tab (Video / Web / API) for the chapter being read. */
export function initChapters() {
  const links = [...document.querySelectorAll<HTMLElement>('[data-chapter-link]')];
  if (!links.length) return;
  // Old /platforma anchors (that page redirects here).
  const old: Record<string, string> = { '#site-uri': '#web', '#software': '#api' };
  if (old[location.hash]) location.replace(old[location.hash]);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const slug = (e.target as HTMLElement).dataset.chapter;
        for (const l of links) {
          const on = l.dataset.chapterLink === slug;
          l.toggleAttribute('data-active', on);
          if (on) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: '-30% 0px -65% 0px' },
  );
  document.querySelectorAll('[data-chapter]').forEach((el) => io.observe(el));
}
