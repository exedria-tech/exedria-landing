/** Playhead for the process steps (components/Process.tsx): follows the scroll through the section. */
export function initProcess() {
  const track = document.querySelector<HTMLElement>('[data-process]');
  if (!track) return;
  const steps = [...track.querySelectorAll<HTMLElement>('[data-step]')];
  let raf = 0;
  const update = () => {
    raf = 0;
    const r = track.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.45)));
    track.style.setProperty('--p', String(p));
    // Each step lights up as the line reaches it.
    steps.forEach((s, i) => s.toggleAttribute('data-on', p >= i / (steps.length - 1) - 0.02));
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
