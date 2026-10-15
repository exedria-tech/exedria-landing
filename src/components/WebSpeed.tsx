import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { MOUNT_MARK, boot } from '../perf';
import { Label, Reveal, cx } from './ui';

type Timings = { ttfb: number; dcl: number; mount: number | null; hydrated: boolean };

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
    hydrated: boot.hydrated,
  };
}

/** Reads Navigation Timing once the page has loaded: no polling, nothing on the main thread meanwhile. */
function useTimings() {
  const [timings, setTimings] = useState<Timings | null>(null);
  useEffect(() => {
    let raf = 0;
    const read = () => (raf = requestAnimationFrame(() => setTimings(readTimings())));
    if (document.readyState === 'complete') read();
    else window.addEventListener('load', read, { once: true });
    return () => {
      window.removeEventListener('load', read);
      cancelAnimationFrame(raf);
    };
  }, []);
  return timings;
}

export function WebSpeed() {
  const { t } = useT();
  const w = t.webDemo;
  return (
    <>
      <Reveal>
        <Label>{w.label}</Label>
        <h2 className="mt-6 max-w-[22ch] text-[clamp(30px,3.6vw,52px)] font-semibold leading-[1] tracking-[-0.045em]">{w.title}</h2>
        <p className="mt-5 max-w-[58ch] text-[16.5px] leading-[1.6] text-dim">{w.body}</p>
      </Reveal>

      <Reveal delay={100} className="mt-12">
        <div className="grid border border-line bg-panel lg:grid-cols-2">
          <Telemetry />
          <Layers />
        </div>
      </Reveal>
    </>
  );
}

/* Instrument cluster: dark, mono readouts, neon status. Only the FPS readout changes after load, via refs. */
function Telemetry() {
  const { t } = useT();
  const w = t.webDemo;
  const timings = useTimings();
  const ms = (v: number | null | undefined) => (v == null ? null : Math.round(v));
  const ttfb = ms(timings?.ttfb);
  const tiles = [
    { key: 'ttfb', value: ttfb, badge: ttfb != null && ttfb < 100 },
    { key: 'dcl', value: ms(timings?.dcl) },
    // Hydration when main.tsx hydrated prerendered HTML, a plain client render otherwise.
    { key: timings && !timings.hydrated ? 'render' : 'mount', value: ms(timings?.mount) },
  ] as const;

  return (
    <div className="flex min-w-0 flex-col bg-fg text-paper">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.18em] sm:px-7">
        <span className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-neon opacity-75 motion-safe:animate-ping" />
          <span className="relative size-2 rounded-full bg-neon shadow-[0_0_10px_var(--color-neon)]" />
        </span>
        <span>{w.telemetry}</span>
      </div>

      <div className="grid flex-1 grid-cols-2">
        {tiles.map(({ key, value, ...rest }, i) => (
          <Readout key={key} name={w.metrics[key][0]} source={w.metrics[key][1]} className={cx(i % 2 === 0 && 'border-r', 'border-b')}>
            {value == null ? (
              <span className="self-end text-[13px] text-white/40">{w.pending}…</span>
            ) : (
              <>
                <Num>{value}</Num>
                <Unit>ms</Unit>
                {'badge' in rest && rest.badge && (
                  <span className="ml-auto self-center rounded-[2px] border border-neon/40 bg-neon/10 px-1.5 py-[3px] text-[9.5px] uppercase leading-none tracking-[0.14em] text-neon">
                    {w.excellent}
                  </span>
                )}
              </>
            )}
          </Readout>
        ))}
        <FpsReadout name={w.metrics.fps[0]} source={w.metrics.fps[1]} />
      </div>

      <p className="px-5 py-4 font-mono text-[11px] leading-[1.6] text-white/55 sm:px-7">{w.note}</p>
    </div>
  );
}

function Readout({ name, source, className, children }: { name: string; source: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cx('flex min-w-0 flex-col justify-between gap-7 border-white/10 px-5 py-6 sm:px-7', className)}>
      <div className="font-mono">
        <div className="text-[11px] uppercase tracking-[0.16em] text-white/70">{name}</div>
        <div className="mt-1 text-[10.5px] text-white/35">{source}</div>
      </div>
      <div className="flex min-h-[clamp(36px,4.2vw,54px)] min-w-0 items-baseline gap-1.5 font-mono">{children}</div>
    </div>
  );
}

const Num = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[clamp(36px,4.2vw,54px)] font-medium leading-none tracking-[-0.05em] tabular-nums">{children}</span>
);
const Unit = ({ children }: { children: React.ReactNode }) => <span className="text-[12px] text-white/50">{children}</span>;

/**
 * Frames counted per 500 ms with requestAnimationFrame. Results are written straight to the DOM
 * (textContent and a transform on a composited bar), so the counter never re-renders React or
 * triggers layout. Paused while off screen or in a background tab.
 */
function FpsReadout({ name, source }: { name: string; source: string }) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    let frames = 0;
    let since = 0;
    let visible = false;
    const tick = (now: number) => {
      if (!since) since = now;
      frames++;
      const span = now - since;
      if (span >= 500) {
        const fps = Math.round((frames * 1000) / span);
        if (num.current) num.current.textContent = String(fps);
        if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, fps / 60)})`;
        frames = 0;
        since = now;
      }
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      frames = 0;
      since = 0;
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className="flex min-w-0 flex-col justify-between gap-7 border-b border-white/10 px-5 py-6 sm:px-7">
      <div className="font-mono">
        <div className="text-[11px] uppercase tracking-[0.16em] text-white/70">{name}</div>
        <div className="mt-1 text-[10.5px] text-white/35">{source}</div>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5 font-mono">
          <Num>
            <span ref={num}>--</span>
          </Num>
          <Unit>FPS</Unit>
        </div>
        <div className="mt-3 h-[3px] overflow-hidden bg-white/10">
          <div
            ref={bar}
            className="h-full origin-left bg-neon shadow-[0_0_8px_var(--color-neon)] transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  );
}

function PanelHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-line px-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-fg sm:px-6">
      {children}
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
