import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { Chip, Label, Reveal, cx } from './ui';

const WEEKS = 10;
// [start, end] in weeks; the last one keeps running.
const SPANS: [number, number][] = [
  [0, 1],
  [1, 3],
  [2.5, 8],
  [8, 10],
];
const TONES = ['sky', 'sky', 'magenta', 'magenta'] as const;
const FILL = { sky: 'bg-sky', magenta: 'bg-magenta', phosphor: 'bg-phosphor' };

export function Process() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  // Playhead follows the scroll through the section.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = (vh * 0.85 - r.top) / (vh * 0.85 + r.height * 0.2);
      setP(Math.min(1, Math.max(0, v)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const week = p * WEEKS;
  let under = 0;
  SPANS.forEach(([a], i) => {
    if (week >= a) under = i;
  });
  const sel = picked ?? under;
  const step = t.process.steps[sel];

  return (
    <section id="process" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Label tone="sky">{t.process.label}</Label>
            <h2 className="mt-6 max-w-[16ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">
              {t.process.title}
            </h2>
          </Reveal>
          <Reveal delay={120} className="flex items-end lg:col-span-5">
            <p className="text-[16.5px] leading-[1.6] text-dim">{t.process.body}</p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-14 overflow-x-auto rounded-[3px] border border-line bg-panel">
          <div className="relative min-w-[720px]">
            <div className="grid grid-cols-[180px_minmax(0,1fr)]">
              {/* ruler */}
              <div className="flex items-center border-b border-r border-line px-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                {t.process.weeks}
              </div>
              <div className="relative h-9 border-b border-line">
                {Array.from({ length: WEEKS }, (_, w) => (
                  <span
                    key={w}
                    className="absolute inset-y-0 border-l border-line pl-1.5 pt-2.5 font-mono text-[10px] text-faint"
                    style={{ left: `${(w / WEEKS) * 100}%` }}
                  >
                    {w + 1}
                  </span>
                ))}
              </div>

              {t.process.steps.map((s, i) => {
                const [a, b] = SPANS[i];
                const lit = week >= a;
                const isSel = i === sel;
                const tone = TONES[i];
                return (
                  <div key={i} className="contents">
                    <button
                      onClick={() => setPicked(i)}
                      className={cx(
                        'flex items-center gap-3 border-b border-r border-line px-4 py-4 text-left transition-colors',
                        isSel ? 'bg-raised' : 'hover:bg-panel-hover',
                      )}
                    >
                      <span className="font-mono text-[11px] tabular-nums text-faint">0{i + 1}</span>
                      <span className={cx('text-[14.5px] font-medium', isSel ? 'text-fg' : 'text-dim')}>{s.name}</span>
                    </button>
                    <div className="relative border-b border-line">
                      {/* week grid */}
                      {Array.from({ length: WEEKS }, (_, w) => (
                        <span key={w} className="absolute inset-y-0 border-l border-line/60" style={{ left: `${(w / WEEKS) * 100}%` }} />
                      ))}
                      <button
                        onClick={() => setPicked(i)}
                        aria-label={s.name}
                        className={cx(
                          'group absolute inset-y-3 overflow-hidden rounded-[2px] border text-left transition-transform duration-300 ease-[var(--ease-spring)] active:scale-y-90',
                          isSel ? 'border-fg/60' : 'border-line-strong hover:border-fg/30',
                        )}
                        style={{ left: `${(a / WEEKS) * 100}%`, width: `${((b - a) / WEEKS) * 100}%` }}
                      >
                        <span
                          className={cx('absolute inset-0 origin-left transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)]', FILL[tone])}
                          style={{ transform: `scaleX(${lit ? 1 : 0})`, opacity: isSel ? 0.9 : 0.35 }}
                        />
                        <span className={cx('relative flex h-full items-center justify-between px-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em]', 'text-fg')}>
                          <span className="truncate">{s.name}</span>
                          {i === SPANS.length - 1 && <span className="shrink-0">{t.process.ongoing} →</span>}
                        </span>
                        {/* keyframes at clip edges */}
                        <span className="absolute left-0 top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-fg" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* scroll-linked playhead */}
            <div className="pointer-events-none absolute bottom-0 left-[180px] right-0 top-0">
              <div className="absolute inset-0" style={{ transform: `translateX(${p * 100}%)` }}>
                <span className="absolute inset-y-0 left-0 w-px bg-sky shadow-[0_0_10px_rgb(34_174_245/0.6)]" />
                <span className="absolute left-0 top-0 h-[9px] w-[9px] -translate-x-1/2 bg-sky [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]" />
              </div>
            </div>
          </div>
        </div>

        <div key={sel} className="fade-up mt-4 grid gap-6 rounded-[3px] border border-line bg-panel p-6 md:grid-cols-[200px_minmax(0,1fr)_auto] md:items-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            0{sel + 1} · {t.process.weeks} {Math.floor(SPANS[sel][0]) + 1}
            {sel === SPANS.length - 1 ? ` → ${t.process.ongoing}` : `–${Math.ceil(SPANS[sel][1])}`}
          </div>
          <div>
            <h3 className="text-[22px] font-medium tracking-[-0.02em]">{step.name}</h3>
            <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-[1.6] text-dim">{step.body}</p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {step.out.map((o) => (
              <Chip key={o} tone={TONES[sel]}>
                {o}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
