import { useEffect, useRef, useState } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { AD_FPS, AD_FRAMES, OfferAd } from '../compositions/OfferAd';
import { useT } from '../i18n';
import { Label, Reveal, cx, timecode } from './ui';

type Payload = { product: string; price: string; badge: string; stock: number; cta: string };
type Field = 'product' | 'price' | 'badge' | 'stock';

const WARN = 'text-[#c2410c]';
const ALERT = 'text-[#c81e1e]';

/** One payload in React state; the web card and the Remotion ad both render from it. */
export function PayloadSync() {
  const { t, lang } = useT();
  const a = t.apiDemo;
  const [preset, setPreset] = useState(0);
  const [data, setData] = useState<Payload>(a.presets[0].data);

  // Load the preset in the active language (switching language reloads it).
  useEffect(() => setData(a.presets[preset].data), [preset, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: Field, v: string) =>
    setData((d) => ({ ...d, [k]: k === 'stock' ? Math.min(9999, Math.max(0, parseInt(v.replace(/\D/g, '') || '0', 10))) : v }));

  return (
    <>
      <Reveal>
        <Label tone="magenta">{a.label}</Label>
        <h2 className="mt-6 max-w-[24ch] text-[clamp(30px,3.6vw,52px)] font-semibold leading-[1] tracking-[-0.045em]">{a.title}</h2>
        <p className="mt-5 max-w-[62ch] text-[16.5px] leading-[1.6] text-dim">{a.body}</p>
      </Reveal>

      <Reveal delay={100} className="mt-12">
        <div className="border border-line bg-panel">
          {/* Presets */}
          <div role="tablist" className="grid grid-cols-3 border-b border-line">
            {a.presets.map((p, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === preset}
                onClick={() => {
                  setPreset(i);
                  setData(a.presets[i].data);
                }}
                className={cx(
                  'relative px-3 py-3.5 text-left font-mono text-[10.5px] uppercase leading-snug tracking-[0.12em] transition-colors sm:px-5 sm:text-[11px]',
                  i > 0 && 'border-l border-line',
                  i === preset ? 'bg-paper text-fg' : 'text-faint hover:text-dim',
                )}
              >
                <span className={cx('absolute inset-x-0 top-0 h-[2px] transition-colors', i === preset ? 'bg-magenta' : 'bg-transparent')} />
                <span className="hidden text-faint sm:inline">0{i + 1} </span>
                {p.tab}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            {/* Left: the JSON, values editable in place */}
            <div className="flex min-w-0 flex-col border-b border-line lg:border-b-0 lg:border-r">
              <Head>
                <span>{a.payload}</span>
                <span className="normal-case tracking-normal text-faint">application/json</span>
              </Head>
              <Json data={data} onEdit={set} />
              <p className="border-t border-line px-5 py-3.5 font-mono text-[11px] text-faint sm:px-6">↳ {a.editHint}</p>
            </div>

            {/* Right: both outputs read the same state */}
            <div className="min-w-0">
              <Head>
                <span className="flex items-center gap-2">
                  <span className="size-1.5 bg-phosphor blink" />
                  {a.outputs}
                </span>
              </Head>
              <div className="grid sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="flex min-w-0 flex-col border-b border-line sm:border-b-0 sm:border-r">
                  <Sub>{a.web}</Sub>
                  <div className="subgrid flex flex-1 items-center justify-center p-5 sm:p-8">
                    <WebCard data={data} left={a.left(data.stock)} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <Sub>{a.ad}</Sub>
                  <AdPlayer data={data} left={a.left(data.stock)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}

function Head({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-fg sm:px-6">
      {children}
    </div>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-line px-5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">{children}</div>;
}

/* Syntax-highlighted JSON with inputs where the editable values sit. */
function Json({ data, onEdit }: { data: Payload; onEdit: (k: Field, v: string) => void }) {
  const key = (k: string) => <span className="text-sky-ink">"{k}"</span>;
  const punct = 'text-faint';
  const rows: React.ReactNode[] = [
    <span className={punct}>{'{'}</span>,
    ...(['product', 'price', 'badge'] as const).map((k) => (
      <>
        {'  '}
        {key(k)}
        <span className={punct}>: </span>
        <span className="text-magenta">"</span>
        <Inline value={data[k]} onChange={(v) => onEdit(k, v)} className="text-magenta" label={k} />
        <span className="text-magenta">"</span>
        <span className={punct}>,</span>
      </>
    )),
    <>
      {'  '}
      {key('stock')}
      <span className={punct}>: </span>
      <Inline value={String(data.stock)} onChange={(v) => onEdit('stock', v)} className="text-[#b45309]" label="stock" numeric />
      <span className={punct}>,</span>
    </>,
    <>
      {'  '}
      {key('cta')}
      <span className={punct}>: </span>
      <span className="text-magenta">"{data.cta}"</span>
    </>,
    <span className={punct}>{'}'}</span>,
  ];
  return (
    <div className="flex-1 overflow-x-auto bg-paper/60 py-4 font-mono text-[13px] leading-[2.1] sm:py-6 sm:text-[14px]">
      {rows.map((r, i) => (
        <div key={i} className="flex whitespace-pre pr-5">
          <span className="w-10 shrink-0 select-none pr-4 text-right text-[11px] text-line-strong sm:w-12">{i + 1}</span>
          <span>{r}</span>
        </div>
      ))}
    </div>
  );
}

function Inline({
  value,
  onChange,
  className,
  label,
  numeric,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  label: string;
  numeric?: boolean;
}) {
  return (
    <input
      value={value}
      aria-label={label}
      inputMode={numeric ? 'numeric' : undefined}
      maxLength={numeric ? 4 : 40}
      spellCheck={false}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: `calc(${Math.max(1, value.length)}ch + 2px)` }}
      className={cx(
        'rounded-[2px] bg-transparent font-mono outline-none ring-1 ring-transparent transition-[box-shadow,background-color] hover:bg-sky/10 hover:ring-sky/30 focus:bg-sky/10 focus:ring-sky/60',
        className,
      )}
    />
  );
}

/* [A] The product card a Next.js page would render from the same payload. */
function WebCard({ data, left }: { data: Payload; left: string }) {
  const low = data.stock < 10;
  const out = data.stock <= 0;
  const tone = out ? ALERT : low ? WARN : 'text-phosphor';
  return (
    <div className="w-full max-w-[340px] border border-line-strong bg-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="max-w-full truncate bg-magenta px-2 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-paper">
          {data.badge || '—'}
        </span>
      </div>
      <h3 className="mt-4 break-words text-[21px] font-medium leading-[1.15] tracking-[-0.02em]">{data.product || '—'}</h3>
      <div className="mt-3 break-words text-[32px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{data.price || '—'}</div>
      <div className={cx('mt-5 flex items-center gap-2 font-mono text-[11.5px]', tone)}>
        <span className={cx('size-1.5 rounded-full bg-current', low && !out && 'blink')} />
        {left}
      </div>
      <div className="mt-2 h-[3px] bg-line">
        <div
          className={cx('h-full transition-[width] duration-500 ease-[var(--ease-out-expo)]', out ? 'bg-[#c81e1e]' : low ? 'bg-[#ea580c]' : 'bg-sky')}
          style={{ width: `${Math.min(100, data.stock)}%` }}
        />
      </div>
      <button
        type="button"
        disabled={out}
        className="mt-5 flex w-full items-center justify-between bg-fg px-4 py-3 text-[14.5px] font-medium text-paper transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:scale-[0.98] disabled:bg-line-strong disabled:hover:translate-y-0"
      >
        <span className="truncate">{data.cta}</span>
        <span className="size-1.5 shrink-0 bg-magenta" />
      </button>
    </div>
  );
}

/* [B] The Remotion composition, fed the same payload as inputProps. It keeps playing while props change. */
function AdPlayer({ data, left }: { data: Payload; left: string }) {
  const player = useRef<PlayerRef>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const p = player.current;
    const el = wrap.current;
    if (!p || !el) return;
    const onFrame = (e: { detail: { frame: number } }) => {
      const f = e.detail.frame;
      if (bar.current) bar.current.style.transform = `scaleX(${(f + 1) / AD_FRAMES})`;
      if (tc.current) tc.current.textContent = timecode(f, AD_FPS);
    };
    p.addEventListener('frameupdate', onFrame);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? p.play() : p.pause()));
    io.observe(el);
    return () => {
      p.removeEventListener('frameupdate', onFrame);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="flex flex-1 flex-col items-center justify-center bg-paper p-5">
      <div className="w-[min(100%,236px)] border border-line-strong bg-fg sm:w-[216px] xl:w-[236px]">
        <div className="aspect-[9/16] w-full">
          <Player
            ref={player}
            component={OfferAd}
            inputProps={{ ...data, stockLabel: left }}
            durationInFrames={AD_FRAMES}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={AD_FPS}
            autoPlay
            loop
            controls={false}
            clickToPlay={false}
            initiallyMuted
            numberOfSharedAudioTags={0}
            acknowledgeRemotionLicense
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {/* Timeline */}
        <div className="border-t border-white/10 px-2.5 py-2">
          <div className="h-[2px] bg-white/15">
            <div ref={bar} className="h-full origin-left bg-sky" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9.5px] tabular-nums text-white/55">
            <span ref={tc}>00:00:00:00</span>
            <span>{AD_FPS} fps · 1080×1920</span>
          </div>
        </div>
      </div>
    </div>
  );
}
