import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { MF_FPS, MF_FRAMES, MF_SIZES, MultiFormat } from '../compositions/MultiFormat';
import { useT } from '../i18n';
import { cx } from './ui';

/** Plays 0 → MF_FRAMES while hovered and rewinds (twice as fast) when the cursor leaves. */
function useHoverFrame(active: boolean) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const step = (now: number) => {
      const dt = last ? (now - last) / (1000 / MF_FPS) : 1;
      last = now;
      let done = false;
      setFrame((f) => {
        const next = active ? Math.min(MF_FRAMES, f + dt) : Math.max(0, f - dt * 2);
        done = next === (active ? MF_FRAMES : 0);
        return next;
      });
      if (!done) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return Math.round(frame);
}

/** Draws a width × height composition scaled down to fit its box, hidden until the scale is known. */
function Fit({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current!;
    const fit = () => setK(Math.min(el.clientWidth / width, el.clientHeight / height));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);
  return (
    <div ref={ref} className="relative size-full overflow-hidden">
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: `scale(${k})`, visibility: k ? undefined : 'hidden' }}
      >
        {children}
      </div>
    </div>
  );
}

/** The same composition at three aspect ratios, drawn without Remotion so the library stays off the home page. */
export function FormatTrio({ active }: { active: boolean }) {
  const { t } = useT();
  const { product, price, badge, cta } = t.apiDemo.presets[0].data;
  const frame = useHoverFrame(active);
  const formats = [
    { f: '9:16', w: 20, main: false },
    { f: '1:1', w: 33, main: true },
    { f: '16:9', w: 34, main: false },
  ] as const;
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-[3.5cqw] px-[3cqw] pb-7 [container-type:inline-size]">
      {formats.map(({ f, w, main }) => {
        const { width, height } = MF_SIZES[f];
        return (
          <div key={f} className="flex flex-col items-center gap-2.5" style={{ width: `${w}cqw` }}>
            <div
              className={cx(
                'w-full overflow-hidden rounded-[2px] border bg-panel transition-[box-shadow,border-color,transform] duration-500 ease-[var(--ease-spring)]',
                main ? 'border-sky shadow-[0_0_0_3px_rgb(34_174_245/0.16),0_10px_30px_-12px_rgb(34_174_245/0.55)]' : 'border-line-strong',
                main && active && 'scale-[1.05]',
              )}
              style={{ aspectRatio: `${width} / ${height}` }}
            >
              <Fit width={width} height={height}>
                <MultiFormat product={product} price={price} badge={badge} cta={cta} frame={frame} width={width} height={height} />
              </Fit>
            </div>
            <span className={cx('font-mono text-[10.5px] tracking-[0.08em]', main ? 'text-sky-ink' : 'text-faint')}>{f}</span>
          </div>
        );
      })}
    </div>
  );
}
