import { useRef, useState } from 'react';
import { MARINA } from '../data/marina';
import { useT } from '../i18n';
import { Corners, Label, Reveal, cx } from './ui';

const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export function Services() {
  const { t } = useT();
  const previews = [VideoPreview, WebPreview, BookingPreview, OpsPreview];
  return (
    <section id="services" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal>
          <Label>{t.services.label}</Label>
          <h2 className="mt-6 max-w-[18ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">
            {t.services.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid border-l border-t border-line md:grid-cols-2">
          {t.services.items.map((s, i) => {
            const Preview = previews[i];
            return (
              <Reveal key={i} delay={(i % 2) * 100} className="border-b border-r border-line">
                <Card>{(state) => <Preview {...state} title={s.title} body={s.body} />}</Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type PreviewState = { active: boolean; px: number };
type CardContent = { title: string; body: string };

function Card({ children }: { children: (s: PreviewState) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PreviewState>({ active: false, px: 0.5 });
  return (
    <div
      ref={ref}
      className="group relative h-full overflow-hidden"
      onPointerEnter={() => setState((s) => ({ ...s, active: true }))}
      onPointerLeave={() => setState({ active: false, px: 0.5 })}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (spot.current) spot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        setState({ active: true, px: Math.min(1, Math.max(0, x / r.width)) });
      }}
    >
      <div
        ref={spot}
        aria-hidden
        className="pointer-events-none absolute -left-[260px] -top-[260px] size-[520px] rounded-full bg-[radial-gradient(circle,rgb(34_174_245/0.13),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <Corners className="text-sky-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100" size={10} />
      {children(state)}
    </div>
  );
}

function CardBody({ title, body }: CardContent) {
  return (
    <div className="relative px-6 pb-7 pt-6 sm:px-8">
      <h3 className="text-[24px] font-medium tracking-[-0.025em] text-fg">{title}</h3>
      <p className="mt-2 text-[15.5px] leading-[1.6] text-dim">{body}</p>
    </div>
  );
}

function Stage({ children }: { children: React.ReactNode }) {
  return <div className="subgrid relative h-[260px] overflow-hidden border-b border-line">{children}</div>;
}

/* Hover-scrub through the Marina Park cut, tied to cursor X. */
function VideoPreview({ active, px, ...c }: PreviewState & CardContent) {
  const N = MARINA.stripFrames;
  const idx = active ? Math.min(N - 1, Math.floor(px * N)) : 29;
  const W = 117; // 9:16 at 208px tall
  return (
    <>
      <Stage>
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          {/* neighbour frames, dimmed, like an onion-skin */}
          {[-1, 0, 1].map((o) => {
            const k = Math.min(N - 1, Math.max(0, idx + o));
            return (
              <div
                key={o}
                className={cx(
                  'relative h-[208px] overflow-hidden rounded-[2px] border transition-[opacity,transform] duration-500',
                  o === 0 ? 'border-fg/40' : 'hidden border-line opacity-30 sm:block',
                )}
                style={{ width: W, transform: o === 0 && active ? 'scale(1.04)' : 'none', transitionTimingFunction: spring }}
              >
                <img
                  src={MARINA.strip}
                  alt=""
                  draggable={false}
                  className="absolute left-0 top-0 h-[208px] max-w-none select-none"
                  style={{ width: W * N, transform: `translateX(${-k * W}px)` }}
                />
              </div>
            );
          })}
        </div>
      </Stage>
      <CardBody {...c} />
    </>
  );
}

/* Wireframe that fills in on hover. */
function WebPreview({ active, ...c }: PreviewState & CardContent) {
  const block = (cls: string, i: number, fill = 'bg-fg/10') => (
    <div className={cx('relative rounded-[2px] border border-dashed border-fg/15', cls)}>
      <div
        className={cx('absolute inset-0 origin-left rounded-[1px] transition-transform duration-700', fill)}
        style={{ transform: active ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: `${active ? i * 55 : 0}ms`, transitionTimingFunction: spring }}
      />
    </div>
  );
  return (
    <>
      <Stage>
        <div className="absolute inset-x-6 bottom-0 top-6 rounded-t-[3px] border border-b-0 border-line-strong bg-paper/70 sm:inset-x-12">
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <span className="size-1.5 bg-line-strong" />
            <span className="size-1.5 bg-line-strong" />
            <span className="size-1.5 bg-line-strong" />
            <span className="ml-3 font-mono text-[9.5px] text-faint">pensiunea-dor.ro</span>
          </div>
          <div className="space-y-3 p-4">
            <div className="flex justify-between gap-3">
              {block('h-3 w-16', 0)}
              <div className="flex gap-2">
                {block('h-3 w-8', 1)}
                {block('h-3 w-8', 2)}
                {block('h-3 w-10', 3, 'bg-magenta')}
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3 space-y-2 pt-2">
                {block('h-5 w-[90%]', 4, 'bg-fg/70')}
                {block('h-5 w-[70%]', 5, 'bg-fg/70')}
                {block('h-2 w-[80%]', 6)}
                {block('h-2 w-[60%]', 7)}
                {block('mt-3 h-5 w-20', 8, 'bg-sky')}
              </div>
              <div className="col-span-2">{block('h-[92px] w-full', 9, 'bg-magenta/40')}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {block('h-12', 10)}
              {block('h-12', 11)}
              {block('h-12', 12)}
            </div>
          </div>
        </div>
      </Stage>
      <CardBody {...c} />
    </>
  );
}

/* Booking grid: slots spring in, one gets picked, confirmation lands. */
function BookingPreview({ active, ...c }: PreviewState & CardContent) {
  const { lang } = useT();
  const days = lang === 'ro' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const booked = new Set([1, 3, 8, 9, 12, 16, 17, 22, 26]);
  const pick = 19;
  return (
    <>
      <Stage>
        <div className="absolute inset-x-6 top-6 sm:inset-x-12">
          <div className="grid grid-cols-7 gap-1.5 font-mono text-[9.5px] text-faint">
            {days.map((d, i) => (
              <span key={i} className="text-center">
                {d}
              </span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 28 }, (_, i) => {
              const isPick = i === pick;
              const isBooked = booked.has(i);
              return (
                <div key={i} className="relative h-7 rounded-[2px] border border-line">
                  <div
                    className={cx(
                      'absolute inset-0 rounded-[1px] transition-[transform,opacity] duration-500',
                      isPick ? 'bg-magenta' : isBooked ? 'bg-fg/15' : 'bg-sky/15',
                    )}
                    style={{
                      transform: active ? 'scale(1)' : 'scale(0.2)',
                      opacity: active ? 1 : 0,
                      transitionDelay: `${active ? (isPick ? 520 : ((i % 7) + Math.floor(i / 7)) * 28) : 0}ms`,
                      transitionTimingFunction: spring,
                    }}
                  />
                  {isPick && (
                    <span
                      className="absolute inset-0 grid place-items-center font-mono text-[9px] font-medium text-paper transition-opacity duration-300"
                      style={{ opacity: active ? 1 : 0, transitionDelay: active ? '640ms' : '0ms' }}
                    >
                      14:30
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="absolute bottom-4 left-1/2 flex items-center gap-2 rounded-[2px] border border-phosphor/40 bg-paper px-3 py-1.5 font-mono text-[10.5px] text-phosphor transition-[transform,opacity] duration-500"
          style={{
            transform: `translate(-50%, ${active ? 0 : 16}px)`,
            opacity: active ? 1 : 0,
            transitionDelay: active ? '780ms' : '0ms',
            transitionTimingFunction: spring,
          }}
        >
          ✓ 14:30 · OK
        </div>
      </Stage>
      <CardBody {...c} />
    </>
  );
}

/* Deploy log and a support ticket closing. */
function OpsPreview({ active, ...c }: PreviewState & CardContent) {
  const lines: [string, string][] = [
    ['text-fg', '$ exedria deploy --env=prod'],
    ['text-phosphor', '  health ........... 200 OK'],
    ['text-magenta', '  #482 → resolved'],
  ];
  return (
    <>
      <Stage>
        <div className="absolute inset-x-6 bottom-6 top-6 rounded-[3px] border border-line-strong bg-paper/80 p-4 font-mono text-[11.5px] leading-[1.9] sm:inset-x-12">
          {lines.map(([cls, l], i) => (
            <div
              key={i}
              className={cx('whitespace-pre transition-[transform,opacity] duration-500', cls)}
              style={{
                opacity: active || i === 0 ? 1 : 0,
                transform: active || i === 0 ? 'none' : 'translateX(-8px)',
                transitionDelay: `${active ? i * 110 : 0}ms`,
                transitionTimingFunction: spring,
              }}
            >
              {l}
            </div>
          ))}
          {!active && <span className="inline-block h-3.5 w-[7px] translate-y-0.5 bg-fg [animation:caret_1s_steps(1)_infinite]" />}
        </div>
      </Stage>
      <CardBody {...c} />
    </>
  );
}

