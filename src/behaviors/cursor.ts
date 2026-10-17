/** Moves the cursor dot field (components/Overlays.tsx): two transforms per frame, no repaint. */
export function initCursor() {
  const outer = document.querySelector<HTMLElement>('[data-cursor-window]');
  const inner = document.querySelector<HTMLElement>('[data-cursor-grid]');
  if (!outer || !inner || window.matchMedia('(pointer: coarse)').matches) return;
  const target = { x: -500, y: -500 };
  const pos = { x: -500, y: -500 };
  let raf = 0;
  const R = 160;
  const tick = () => {
    pos.x += (target.x - pos.x) * 0.2;
    pos.y += (target.y - pos.y) * 0.2;
    const x = pos.x - R;
    const y = pos.y - R;
    outer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    inner.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
    raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3 ? requestAnimationFrame(tick) : 0;
  };
  window.addEventListener(
    'pointermove',
    (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { passive: true },
  );
}
