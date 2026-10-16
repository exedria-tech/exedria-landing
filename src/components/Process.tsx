import { useT } from '../i18n';
import { Label, Reveal } from './ui';

/**
 * The four pipeline steps, lit one by one as the visitor scrolls: src/behaviors/process.ts sets --p
 * (0 → 1) on the track and data-on on each step the line has reached.
 */
export function Process({ id = 'process' }: { id?: string }) {
  const { t } = useT();
  return (
    <section id={id} className="relative scroll-mt-[120px] border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal>
          <Label tone="sky">{t.process.label}</Label>
          <h2 className="mt-6 max-w-[18ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">
            {t.process.title}
          </h2>
        </Reveal>

        <div data-process className="relative mt-16">
          {/* the line, filled by scroll */}
          <div className="absolute left-[7px] right-0 top-[6.5px] hidden h-[2px] bg-line md:block">
            <div className="h-full origin-left bg-sky" style={{ transform: 'scaleX(var(--p, 0))' }} />
          </div>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {t.process.steps.map((s, i) => (
              <li key={i} data-step={i} data-on={i === 0 ? '' : undefined} className="group/step relative">
                <span className="relative block size-[15px] rotate-45 border border-line-strong bg-paper transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-spring)] group-data-[on]/step:scale-110 group-data-[on]/step:border-magenta group-data-[on]/step:bg-magenta" />
                <div className="mt-7 opacity-45 transition-opacity duration-500 group-data-[on]/step:opacity-100">
                  <span className="font-mono text-[12px] tabular-nums text-faint">0{i + 1}</span>
                  <h3 className="mt-2 text-[24px] font-medium tracking-[-0.025em]">{s.name}</h3>
                  <p className="mt-2 text-[15.5px] leading-[1.55] text-dim">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
