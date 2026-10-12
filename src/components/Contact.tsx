import { useEffect, useState } from 'react';
import { useT } from '../i18n';
import { Corners, Label, Reveal, Segmented, cx } from './ui';

export const EMAIL = 'hello@exedria.ro';
const RENDER_FRAMES = 48;

export function Contact() {
  const { t } = useT();
  const [name, setName] = useState('');
  const [reach, setReach] = useState('');
  const [needs, setNeeds] = useState<number[]>([0]);
  const [timeline, setTimeline] = useState(t.contact.timelineOptions[2]);
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<'idle' | 'rendering' | 'done'>('idle');
  const [frame, setFrame] = useState(0);

  // keep segmented value valid when the language flips
  useEffect(() => {
    if (!t.contact.timelineOptions.includes(timeline)) setTimeline(t.contact.timelineOptions[2]);
  }, [t, timeline]);

  const toggleNeed = (i: number) => setNeeds((n) => (n.includes(i) ? n.filter((x) => x !== i) : [...n, i]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === 'rendering') return;
    setPhase('rendering');
    setFrame(0);
    const start = performance.now();
    const tick = (now: number) => {
      const f = Math.min(RENDER_FRAMES, Math.floor(((now - start) / 1400) * RENDER_FRAMES));
      setFrame(f);
      if (f < RENDER_FRAMES) requestAnimationFrame(tick);
      else {
        setPhase('done');
        const body = [
          `${t.contact.name}: ${name}`,
          `${t.contact.email}: ${reach}`,
          `${t.contact.needs}: ${needs.map((i) => t.contact.needOptions[i]).join(', ')}`,
          `${t.contact.timeline}: ${timeline}`,
          '',
          message,
        ].join('\n');
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Exedria · ${name || 'proiect nou'}`)}&body=${encodeURIComponent(body)}`;
      }
    };
    requestAnimationFrame(tick);
  };

  const field =
    'w-full rounded-[3px] border border-line bg-paper px-3.5 py-3 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:border-sky/60';

  return (
    <section id="contact" className="subgrid relative border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-4 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Label tone="magenta">{t.contact.label}</Label>
          <h2 className="mt-6 text-[clamp(44px,6.4vw,104px)] font-semibold leading-[0.9] tracking-[-0.055em]">{t.contact.title}</h2>
          <p className="mt-6 max-w-[40ch] text-[16.5px] leading-[1.6] text-dim">{t.contact.body}</p>
          <div className="mt-10 border-t border-line pt-5">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">{t.contact.direct}</div>
            <a href={`mailto:${EMAIL}`} className="group mt-2 inline-flex items-center gap-2 text-[22px] tracking-[-0.02em] text-fg">
              <span className="relative">
                {EMAIL}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-sky transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <form onSubmit={submit} className="relative rounded-[3px] border border-line bg-panel p-5 sm:p-7">
            <Corners className="text-fg/30" size={10} />
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4 font-mono text-[11px] text-faint">
              <span className="uppercase tracking-[0.16em]">render-settings.json</span>
              <span>
                {'{ '}
                <span className="text-dim">format</span>: <span className="text-sky-ink">"brief"</span>
                {' }'}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.contact.name}>
                <input required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
              </Field>
              <Field label={t.contact.email}>
                <input required value={reach} onChange={(e) => setReach(e.target.value)} className={field} autoComplete="email" />
              </Field>
            </div>

            <Field label={t.contact.needs} className="mt-5">
              <div className="flex flex-wrap gap-2">
                {t.contact.needOptions.map((o, i) => {
                  const on = needs.includes(i);
                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => toggleNeed(i)}
                      aria-pressed={on}
                      className={cx(
                        'flex items-center gap-2 rounded-[3px] border px-3 py-2 font-mono text-[12px] transition-[transform,colors] duration-300 ease-[var(--ease-spring)] active:scale-95',
                        on ? 'border-sky/60 bg-sky/10 text-fg' : 'border-line-strong text-dim hover:text-fg',
                      )}
                    >
                      <span className={cx('size-2 border', on ? 'border-sky bg-sky' : 'border-line-strong')} />
                      {o}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label={t.contact.timeline} className="mt-5">
              <Segmented options={t.contact.timelineOptions} value={timeline} onChange={setTimeline} ariaLabel={t.contact.timeline} />
            </Field>

            <Field label={t.contact.message} className="mt-5">
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contact.messagePh}
                className={cx(field, 'resize-none')}
              />
            </Field>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="group relative h-12 min-w-[240px] overflow-hidden rounded-[3px] bg-magenta px-5 text-left text-[15px] font-medium text-paper transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.97]"
              >
                <span
                  className="absolute inset-0 origin-left bg-fg transition-transform duration-100"
                  style={{ transform: `scaleX(${phase === 'idle' ? 0 : frame / RENDER_FRAMES})` }}
                />
                <span className="relative flex items-center justify-between gap-6">
                  <span>{phase === 'rendering' ? `${t.contact.sending}…` : t.contact.submit}</span>
                  <span className="font-mono text-[11.5px] tabular-nums">
                    {phase === 'idle' ? '→' : `${String(frame).padStart(2, '0')}/${RENDER_FRAMES}`}
                  </span>
                </span>
              </button>
              {phase === 'done' && (
                <span className="fade-up font-mono text-[11.5px] text-phosphor">
                  ✓ {'{ status: "queued" }'} <span className="text-dim">{t.contact.done}</span> <span className="select-all text-fg">{EMAIL}</span>
                </span>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{label}</div>
      {children}
    </div>
  );
}
