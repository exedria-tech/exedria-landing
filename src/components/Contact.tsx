import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { SERVICES } from './Services';
import { EMAIL } from '../data/company';
import { ro, useT } from '../i18n';
import { cx } from './ui';

const RENDER_FRAMES = 48;

type ContactResult = { success: true; id: string } | { success: false; error: string };

async function postBrief(payload: Record<string, unknown>): Promise<ContactResult> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as ContactResult;
  } catch {
    return { success: false, error: '' };
  }
}

/** The access request form. Posts to api/contact.ts, which emails it through Resend. */
export function ContactForm() {
  const { t, lang } = useT();
  const [name, setName] = useState('');
  const [reach, setReach] = useState('');
  // ?serviciu=site-uri (from the platform pages) pre-ticks that module; the four modules map 1:1 onto the options,
  // and pick the closest product (video, leads and API have their own; the web module defaults to the first).
  const [params] = useSearchParams();
  const preset = SERVICES.findIndex((s) => s.slug === params.get('serviciu'));
  const [needs, setNeeds] = useState<number[]>([Math.max(0, preset)]);
  const [product, setProduct] = useState([0, 0, 1, 2][Math.max(0, preset)]);
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle');
  const [frame, setFrame] = useState(0);
  const [error, setError] = useState('');

  const toggleNeed = (i: number) => setNeeds((n) => (n.includes(i) ? n.filter((x) => x !== i) : [...n, i]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === 'rendering') return;
    if (needs.length === 0) {
      setPhase('error');
      setError(t.contact.pickNeed);
      return;
    }
    setPhase('rendering');
    setError('');
    setFrame(0);

    // The server always receives the Romanian option labels, whatever language the page is in.
    let result: ContactResult | null = null;
    postBrief({
      nume: name,
      contact: reach,
      module: needs.map((i) => ro.contact.needOptions[i]),
      produs: ro.contact.timelineOptions[product],
      mesaj: message,
    }).then((r) => (result = r));

    // Progress runs on its own clock but holds just short of 100% until the server answers.
    const start = performance.now();
    const tick = (now: number) => {
      const cap = result ? RENDER_FRAMES : RENDER_FRAMES - 4;
      const f = Math.min(cap, Math.floor(((now - start) / 1400) * RENDER_FRAMES));
      setFrame(f);
      if (f < RENDER_FRAMES) {
        requestAnimationFrame(tick);
        return;
      }
      const r = result as ContactResult | null;
      if (r?.success) {
        setPhase('done');
        setName('');
        setReach('');
        setMessage('');
      } else {
        setPhase('error');
        setError(r && r.error && lang === 'ro' ? r.error : t.contact.failed);
      }
    };
    requestAnimationFrame(tick);
  };

  const field =
    'w-full rounded-[3px] border border-line bg-paper px-3.5 py-3 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:border-sky/60';

  return (
    <form onSubmit={submit} className="relative rounded-[3px] border border-line bg-panel p-5 sm:p-7">
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
        <div role="radiogroup" className="grid grid-cols-2 rounded-[3px] border border-line-strong p-0.5 sm:inline-flex">
          {t.contact.timelineOptions.map((o, i) => {
            const on = product === i;
            return (
              <button
                type="button"
                role="radio"
                key={o}
                onClick={() => setProduct(i)}
                aria-checked={on}
                className={cx(
                  'whitespace-nowrap rounded-[2px] px-3.5 py-1.5 font-mono text-[12px] transition-[transform,colors] duration-300 ease-[var(--ease-spring)] active:scale-95',
                  on ? 'bg-fg text-paper' : 'text-dim hover:text-fg',
                )}
              >
                {o}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label={t.contact.message} className="mt-5">
        <textarea
          required
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
          disabled={phase === 'rendering'}
          className="group relative h-12 min-w-[240px] overflow-hidden rounded-[3px] bg-magenta px-5 text-left text-[15px] font-medium text-paper transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.97]"
        >
          <span
            className="absolute inset-0 origin-left bg-fg transition-transform duration-100"
            style={{ transform: `scaleX(${phase === 'rendering' || phase === 'done' ? frame / RENDER_FRAMES : 0})` }}
          />
          <span className="relative flex items-center justify-between gap-6">
            <span>{phase === 'rendering' ? `${t.contact.sending}…` : t.contact.submit}</span>
            <span className="font-mono text-[11.5px] tabular-nums">
              {phase === 'rendering' || phase === 'done' ? `${Math.round((frame / RENDER_FRAMES) * 100)}%` : '→'}
            </span>
          </span>
        </button>
        {phase === 'done' && (
          <span role="status" className="fade-up font-mono text-[11.5px] text-phosphor">
            ✓ <span className="text-dim">{t.contact.done}</span>
          </span>
        )}
        {phase === 'error' && (
          <span role="alert" className="fade-up font-mono text-[11.5px] text-magenta">
            × <span className="text-dim">{error}</span>{' '}
            <a href={`mailto:${EMAIL}`} className="text-fg underline decoration-line-strong underline-offset-2">
              {EMAIL}
            </a>
          </span>
        )}
      </div>
      <p className="mt-5 text-[13px] leading-[1.55] text-faint">
        {t.contactPage.privacy}{' '}
        <Link to="/confidentialitate" className="text-dim underline decoration-line-strong underline-offset-2 hover:text-fg">
          {t.contactPage.privacyLink}
        </Link>
        .
      </p>
    </form>
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
