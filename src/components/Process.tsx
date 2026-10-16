import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { Label, Reveal, cx } from './ui';

const STEPS = 4;

/** The four pipeline steps, lit one by one as the visitor scrolls. */
export function Process({ id = 'process' }: { id?: string }) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  // Playhead follows the scroll through the section.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = (vh * 0.8 - r.top) / (vh * 0.45);
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

  // Each step lights up as the line reaches it.
  const reached = (i: number) => p >= i / (STEPS - 1) - 0.02;

  return (
    <section id={id} className="relative scroll-mt-[120px] border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal>
          <Label tone="sky">{t.process.label}</Label>
          <h2 className="mt-6 max-w-[18ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">
            {t.process.title}
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-16">
          {/* the line, filled by scroll */}
          <div className="absolute left-[7px] right-0 top-[6.5px] hidden h-[2px] bg-line md:block">
            <div className="h-full origin-left bg-sky" style={{ transform: `scaleX(${p})` }} />
          </div>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {t.process.steps.map((s, i) => {
              const on = reached(i);
              return (
                <li key={i} className="relative">
                  <span
                    className={cx(
                      'relative block size-[15px] rotate-45 border transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-spring)]',
                      on ? 'scale-110 border-magenta bg-magenta' : 'border-line-strong bg-paper',
                    )}
                  />
                  <div className={cx('mt-7 transition-opacity duration-500', on ? 'opacity-100' : 'opacity-45')}>
                    <span className="font-mono text-[12px] tabular-nums text-faint">0{i + 1}</span>
                    <h3 className="mt-2 text-[24px] font-medium tracking-[-0.025em]">{s.name}</h3>
                    <p className="mt-2 text-[15.5px] leading-[1.55] text-dim">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
