import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { MOUNT_MARK } from '../perf';
import { Label, Reveal, cx } from './ui';

type Timings = { ttfb: number; dcl: number; mount: number | null };

/** Navigation Timing for the document this visitor actually loaded; null until DOMContentLoaded has fired. */
function readTimings(): Timings | null {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!nav || !nav.domContentLoadedEventStart) return null;
  // Prerendered pages count from activation, as web-vitals does.
  const start = (nav as PerformanceNavigationTiming & { activationStart?: number }).activationStart ?? 0;
  const mount = performance.getEntriesByName(MOUNT_MARK)[0]?.startTime;
  return {
    ttfb: Math.max(0, nav.responseStart - start),
    dcl: Math.max(0, nav.domContentLoadedEventStart - start),
    mount: mount == null ? null : Math.max(0, mount - start),
  };
}

const FPS_SAMPLES = 40;

/** Frames counted per 500 ms window, while the panel is on screen. */
function useLiveFps(target: React.RefObject<HTMLElement | null>) {
  const [samples, setSamples] = useState<number[]>([]);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let raf = 0;
    let frames = 0;
    let since = 0;
    const tick = (now: number) => {
      if (!since) since = now;
      frames++;
      if (now - since >= 500) {
        const fps = Math.round((frames * 1000) / (now - since));
        setSamples((s) => [...s.slice(-(FPS_SAMPLES - 1)), fps]);
        frames = 0;
        since = now;
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        frames = 0;
        since = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);
  return samples;
}

export function WebSpeed() {
  const { t } = useT();
  const w = t.webDemo;
  const panel = useRef<HTMLDivElement>(null);
  const [timings, setTimings] = useState<Timings | null>(() => readTimings());
  const fps = useLiveFps(panel);

  // DOMContentLoaded can land before React's first commit, so poll until both are known.
  useEffect(() => {
    if (timings && timings.mount != null) return;
    const id = setInterval(() => {
      const v = readTimings();
      if (v) setTimings(v);
    }, 200);
    return () => clearInterval(id);
  }, [timings]);

  const ms = (v: number | null | undefined) => (v == null ? null : Math.round(v));
  const current = fps.at(-1);
  const tiles: { key: keyof typeof w.metrics; value: number | null | undefined; unit: string }[] = [
    { key: 'ttfb', value: ms(timings?.ttfb), unit: 'ms' },
    { key: 'dcl', value: ms(timings?.dcl), unit: 'ms' },
    { key: 'mount', value: ms(timings?.mount), unit: 'ms' },
    { key: 'fps', value: current, unit: 'FPS' },
  ];

  return (
    <>
      <Reveal>
        <Label>{w.label}</Label>
        <h2 className="mt-6 max-w-[22ch] text-[clamp(30px,3.6vw,52px)] font-semibold leading-[1] tracking-[-0.045em]">{w.title}</h2>
        <p className="mt-5 max-w-[58ch] text-[16.5px] leading-[1.6] text-dim">{w.body}</p>
      </Reveal>

      <Reveal delay={100} className="mt-12">
        <div ref={panel} className="grid border border-line bg-panel lg:grid-cols-2">
          {/* Left: what this browser measured for this page */}
          <div className="flex min-w-0 flex-col border-b border-line lg:border-b-0 lg:border-r">
            <PanelHead>
              <span className="size-1.5 bg-phosphor blink" />
              {w.telemetry}
            </PanelHead>
            <div className="grid flex-1 grid-cols-2">
              {tiles.map(({ key, value, unit }, i) => {
                const [name, source] = w.metrics[key];
                return (
                  <div key={key} className={cx('flex min-w-0 flex-col justify-between gap-6 p-5 sm:p-6', i % 2 === 0 && 'border-r border-line', i < 2 && 'border-b border-line')}>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{name}</div>
                      <div className="mt-1 font-mono text-[10.5px] text-faint">{source}</div>
                    </div>
                    <div>
                      {value == null ? (
                        <div className="font-mono text-[13px] text-faint">{w.pending}…</div>
                      ) : (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[clamp(34px,4vw,48px)] font-semibold leading-none tracking-[-0.04em] tabular-nums">{value}</span>
                          <span className="font-mono text-[12px] text-dim">{unit}</span>
                        </div>
                      )}
                      {key === 'fps' && <Spark values={fps} />}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="flex items-center gap-2 border-t border-line px-5 py-3.5 font-mono text-[11px] text-dim sm:px-6">
              <span className="size-1.5 shrink-0 rounded-full bg-phosphor" />
              {w.note}
            </p>
          </div>

          {/* Right: the three layers we ship */}
          <Layers />
        </div>
      </Reveal>
    </>
  );
}

function PanelHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-fg sm:px-6">
      {children}
    </div>
  );
}

/** Frame-rate history, one bar per 500 ms window. */
function Spark({ values }: { values: number[] }) {
  const max = Math.max(60, ...values);
  return (
    <div className="mt-3 flex h-5 items-end gap-[2px]" aria-hidden>
      {Array.from({ length: FPS_SAMPLES }, (_, i) => {
        const v = values[i - (FPS_SAMPLES - values.length)];
        return (
          <span
            key={i}
            className={cx('flex-1', v == null ? 'bg-line' : v < 50 ? 'bg-magenta' : 'bg-sky')}
            style={{ height: v == null ? 2 : `${Math.max(8, (v / max) * 100)}%` }}
          />
        );
      })}
    </div>
  );
}

/* An exploded stack of the three layers; hover or tap one to inspect it. Cycles on its own until touched. */
function Layers() {
  const { t } = useT();
  const w = t.webDemo;
  const [active, setActive] = useState(0);
  const touched = useRef(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (!touched.current) setActive((a) => (a + 1) % 3);
    }, 3600);
    return () => clearInterval(id);
  }, []);
  const pick = (i: number) => {
    touched.current = true;
    setActive(i);
  };

  // Isometric plates, bottom (01) to top (03).
  const plate = (y: number) => `M150 ${y} L270 ${y + 40} L150 ${y + 80} L30 ${y + 40} Z`;
  const ys = [130, 74, 18];

  return (
    <div className="flex min-w-0 flex-col">
      <PanelHead>
        <span className="size-1.5 rotate-45 bg-magenta" />
        {w.architecture}
      </PanelHead>
      <div className="grid flex-1 sm:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="subgrid flex items-center justify-center border-b border-line p-5 sm:border-b-0 sm:border-r lg:border-b lg:border-r-0 xl:border-b-0 xl:border-r">
          <svg viewBox="0 0 300 220" className="h-auto w-full max-w-[260px]" role="img" aria-label={w.architecture}>
            {ys.map((y, i) => {
              const on = i === active;
              return (
                <g
                  key={i}
                  onPointerEnter={() => pick(i)}
                  onClick={() => pick(i)}
                  className="cursor-pointer transition-transform duration-500 ease-[var(--ease-spring)]"
                  style={{ transform: on ? 'translateY(-10px)' : 'none' }}
                >
                  <path
                    d={plate(y)}
                    className="transition-[fill,stroke] duration-300"
                    fill={on ? 'rgb(34 174 245 / 0.16)' : 'rgb(255 255 255 / 0.92)'}
                    stroke={on ? 'var(--color-sky-ink)' : 'var(--color-line-strong)'}
                    strokeWidth="1"
                  />
                  <text x="150" y={y + 44} textAnchor="middle" className="font-mono" fontSize="11" fill={on ? 'var(--color-sky-ink)' : 'var(--color-faint)'}>
                    {String(i + 1).padStart(2, '0')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <ol className="flex flex-col">
          {w.layers.map((l, i) => {
            const on = i === active;
            return (
              <li key={i} className="border-b border-line last:border-b-0">
                <button
                  onPointerEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                  aria-expanded={on}
                  className="relative block w-full px-5 py-4 text-left sm:px-6"
                >
                  <span className={cx('absolute bottom-0 left-0 top-0 w-[2px] transition-colors', on ? 'bg-sky' : 'bg-transparent')} />
                  <span className="flex items-baseline gap-3">
                    <span className={cx('font-mono text-[11px] transition-colors', on ? 'text-sky-ink' : 'text-faint')}>[{String(i + 1).padStart(2, '0')}]</span>
                    <span className={cx('text-[16px] font-medium tracking-[-0.01em] transition-colors', on ? 'text-fg' : 'text-dim')}>{l.title}</span>
                  </span>
                  <span
                    className="grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)]"
                    style={{ gridTemplateRows: on ? '1fr' : '0fr', opacity: on ? 1 : 0 }}
                  >
                    <span className="overflow-hidden">
                      <span className="block pl-[38px] pt-2 text-[14.5px] leading-[1.55] text-dim">{l.body}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
