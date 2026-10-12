import { useEffect, useRef } from 'react';
import { useT } from '../i18n';
import { EMAIL } from './Contact';
import { Logo, SECTIONS } from './Nav';

export function Footer() {
  const { t } = useT();
  return (
    <footer className="relative border-t border-line pt-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="text-fg" />
          <p className="mt-4 max-w-[36ch] text-[15px] leading-[1.6] text-dim">{t.hero.lead.split('.')[0]}.</p>
        </div>
        <nav className="md:col-span-3">
          <ul className="space-y-2.5">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="group inline-flex items-center gap-2 text-[15px] text-dim transition-colors hover:text-fg">
                  <span className="h-px w-3 origin-left scale-x-0 bg-sky transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-x-100" />
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <a href={`mailto:${EMAIL}`} className="text-[15px] text-fg hover:text-sky-ink">
            {EMAIL}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1440px] px-4 sm:px-8">
        <DotWordmark text="exedria" />
      </div>

      <div className="mx-auto mt-4 flex max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint sm:px-8">
        <span>© 2026 {t.footer.rights}</span>
        <a href="#top" className="group inline-flex items-center gap-2 text-dim transition-colors hover:text-fg">
          <span className="inline-block transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-x-1">⏮</span>
          {t.footer.top}
        </a>
      </div>
    </footer>
  );
}

/**
 * Wordmark sampled into a dot matrix. Dots near the cursor grow and heat up;
 * a slow wave keeps the rest breathing. Only runs while on screen.
 */
function DotWordmark({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    const canvas = cvs.current!;
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

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (reduced) draw(performance.now());
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    const ro = new ResizeObserver(() => build());
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [text]);

  return (
    <div ref={wrap} className="relative" aria-label={text} role="img">
      <canvas ref={cvs} className="block w-full" />
    </div>
  );
}
