import { useEffect, useRef, useState } from 'react';
import { A } from './A';
import { SERVICES } from '../data/services';
import { EMAIL } from '../data/company';
import { ro, useT } from '../i18n';
import { cx } from './ui';
import { useTurnstile } from '../turnstile';

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
  const [needs, setNeeds] = useState<number[]>([0]);
  // ?serviciu=web (from the service pages) pre-ticks that module; the modules map 1:1 onto the options.
  // Read after hydration, since the prerendered HTML has no query string.
  useEffect(() => {
    const preset = SERVICES.findIndex((s) => s.slug === new URLSearchParams(location.search).get('serviciu'));
    if (preset > 0) setNeeds([preset]);
  }, []);
  const [message, setMessage] = useState('');
  const [deadline, setDeadline] = useState('');
  const [phase, setPhase] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle');
  const [frame, setFrame] = useState(0);
  const [error, setError] = useState('');
  // Spam guards checked by api/contact.ts: a honeypot only bots fill, time since the form appeared, and Turnstile.
  const [website, setWebsite] = useState('');
  const openedAt = useRef(Date.now());
  const turnstile = useTurnstile(lang);

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
      mesaj: message,
      ...(deadline.trim() ? { termen: deadline.trim() } : {}),
      website,
      elapsed: Date.now() - openedAt.current,
      turnstile: turnstile.token,
    }).then((r) => {
      result = r;
      turnstile.reset();
    });

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
        setDeadline('');
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
          {t.contact.needOptions.map((o, i) => (
            <Chip key={o} on={needs.includes(i)} onClick={() => toggleNeed(i)}>
              {o}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label={t.contact.deadline} className="mt-5">
        <input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder={t.contact.deadlinePh} maxLength={120} className={field} />
      </Field>


      {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} name="website" />
        </label>
      </div>

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

      {turnstile.enabled && <div ref={turnstile.ref} className="mt-5 empty:hidden" />}

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
        <A to="/confidentialitate" className="text-dim underline decoration-line-strong underline-offset-2 hover:text-fg">
          {t.contactPage.privacyLink}
        </A>
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

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cx(
        'flex items-center gap-2 rounded-[3px] border px-3 py-2 font-mono text-[12px] transition-[transform,colors] duration-300 ease-[var(--ease-spring)] active:scale-95',
        on ? 'border-sky/60 bg-sky/10 text-fg' : 'border-line-strong text-dim hover:text-fg',
      )}
    >
      <span className={cx('size-2 border', on ? 'border-sky bg-sky' : 'border-line-strong')} />
      {children}
    </button>
  );
}
