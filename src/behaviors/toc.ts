/** Legal pages: the contents list follows the section being read. */
export function initToc() {
  const links = [...document.querySelectorAll<HTMLElement>('[data-toc]')];
  if (!links.length) return;
  const sections = links.map((l) => document.getElementById(l.dataset.toc!));
  let raf = 0;
  const update = () => {
    raf = 0;
    const mid = window.innerHeight * 0.3;
    let cur = 0;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top <= mid) cur = i;
    });
    links.forEach((l, i) => l.toggleAttribute('data-active', i === cur));
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
