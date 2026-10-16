/**
 * Fades sections in as they scroll into view (.reveal in index.css, rendered by <Reveal>). Content that
 * is on screen when the page loads stays put; the rest is hidden (data-armed) until it arrives.
 */
export function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) {
          el.dataset.in = 'true';
          io.unobserve(el);
        } else el.dataset.armed = '';
      }
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
