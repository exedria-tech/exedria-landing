/**
 * Footer wordmark sampled into a dot matrix. Dots near the cursor grow and heat up; a slow wave keeps
 * the rest breathing. Only runs while on screen.
 */
export function initWordmark(el: HTMLElement) {
  const text = el.dataset.wordmark ?? '';
  const canvas = el.querySelector('canvas')!;
  const ctx = canvas.getContext('2d')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pts: { x: number; y: number; inside: boolean }[] = [];
  let W = 0;
  let H = 0;
  let step = 10;
  let raf = 0;
  let visible = false;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

  const build = async () => {
    try {
      await document.fonts.load('600 200px "Geist Variable"');
    } catch {
      /* fall back to system font */
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = el.clientWidth;
    if (!W) return;
    step = W < 640 ? 6 : W < 1100 ? 8 : 10;
    // size the type so it spans the full width
    const probe = document.createElement('canvas').getContext('2d')!;
    probe.font = '600 100px "Geist Variable", system-ui, sans-serif';
    probe.letterSpacing = '-4px';
    const m = probe.measureText(text);
    const size = (W / m.width) * 100 * 0.97;
    H = Math.round(size * 0.82);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const o = off.getContext('2d')!;
    o.font = `600 ${size}px "Geist Variable", system-ui, sans-serif`;
    o.letterSpacing = `${-size * 0.04}px`;
    o.textBaseline = 'alphabetic';
    o.fillStyle = '#fff';
    const mw = o.measureText(text).width;
    o.fillText(text, (W - mw) / 2, H * 0.8);
    const data = o.getImageData(0, 0, W, H).data;
    pts = [];
    for (let y = step / 2; y < H; y += step)
      for (let x = step / 2; x < W; x += step) {
        const a = data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3];
        pts.push({ x, y, inside: a > 128 });
      }
    draw(performance.now());
  };

  const draw = (now: number) => {
    mouse.x += (mouse.tx - mouse.x) * 0.18;
    mouse.y += (mouse.ty - mouse.y) * 0.18;
    const tt = reduced ? 0 : now / 1000;
    ctx.clearRect(0, 0, W, H);
    const R = Math.max(120, W * 0.11);
    for (const p of pts) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / R);
      if (p.inside) {
        const wave = 0.5 + 0.5 * Math.sin(p.x * 0.006 - tt * 0.9 + Math.sin(p.y * 0.01 + tt * 0.4));
        const k = 0.28 + wave * 0.5 + near * 0.5;
        const s = step * Math.min(0.92, 0.3 + k * 0.6);
        ctx.fillStyle =
          near > 0.55 ? `rgba(224,23,158,${Math.min(1, k)})` : near > 0.05 ? `rgba(34,174,245,${Math.min(1, k)})` : `rgba(11,18,32,${0.16 + wave * 0.6})`;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      } else if (near > 0) {
        const s = 1 + near * 2.5;
        ctx.fillStyle = `rgba(34,174,245,${near * 0.35})`;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      } else {
        ctx.fillStyle = 'rgba(11,18,32,0.08)';
        ctx.fillRect(p.x - 0.5, p.y - 0.5, 1, 1);
      }
    }
  };

  const loop = (now: number) => {
    draw(now);
    raf = visible && !reduced ? requestAnimationFrame(loop) : 0;
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  });
  io.observe(el);

  el.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - r.left;
    mouse.ty = e.clientY - r.top;
    if (reduced) draw(performance.now());
  });
  el.addEventListener('pointerleave', () => {
    mouse.tx = -9999;
    mouse.ty = -9999;
  });
  new ResizeObserver(() => build()).observe(el);
}
