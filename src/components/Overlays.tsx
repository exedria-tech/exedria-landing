import { useEffect, useState } from 'react';
import { useT } from '../i18n';
import { timecode } from './ui';

/**
 * A dot grid that only shows around the cursor (src/behaviors/cursor.ts moves it). The window moves
 * with the pointer while the grid inside counter-moves, so the dots stay pinned to the page.
 */
export function CursorField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div
        data-cursor-window
        className="absolute left-0 top-0 size-[320px] overflow-hidden opacity-40 [mask-image:radial-gradient(circle,#000_0%,transparent_68%)]"
        style={{ transform: 'translate3d(-999px,-999px,0)' }}
      >
        <div data-cursor-grid className="dotgrid absolute left-0 top-0 h-screen w-screen" />
      </div>
    </div>
  );
}

/** Scroll position read out as a timecode, one frame per 12px at 60 FPS. */
export function ScrollHUD() {
  const { t } = useT();
  const [y, setY] = useState(0);
  const [max, setMax] = useState(1);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setY(window.scrollY);
        setMax(Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  const p = y / max;
  const show = y > 240 && p < 0.96;
  return (
    <div
      style={{ opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(8px)' }}
      className="pointer-events-none fixed bottom-4 right-4 z-40 hidden items-center transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] gap-3 rounded-[3px] border border-line bg-paper/90 px-3 py-2 font-mono text-[10.5px] text-dim md:flex"
    >
      <span className="uppercase tracking-[0.14em] text-faint">{t.hud}</span>
      <span className="tabular-nums text-fg">{timecode(y / 12, 60)}</span>
      <span className="relative h-px w-16 bg-line-strong">
        <span className="absolute inset-0 origin-left bg-sky" style={{ transform: `scaleX(${p})` }} />
      </span>
      <span>60 FPS</span>
    </div>
  );
}
