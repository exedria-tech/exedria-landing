import { Suspense, lazy, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { Category } from '../data/projects';
import { useT } from '../i18n';
import { ClientOnly } from './ClientOnly';
import { Corners, Label, Reveal, cx } from './ui';

const FormatTrio = lazy(() => import('./FormatTrio'));

const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/**
 * The services, in the order of t.services.items. `slug` is the chapter anchor on /platforma and the
 * ?serviciu= value the contact form understands; `category` filters /lucrari.
 */
export const SERVICES: { slug: string; category: Category }[] = [
  { slug: 'video', category: 'video' },
  { slug: 'web', category: 'web' },
  { slug: 'api', category: 'software' },
];

const PREVIEWS = [VideoPreview, WebPreview, OpsPreview];

/** Home page summary: the grid of live cards, each opening its chapter on /platforma. */
export function Services() {
  const { t } = useT();
  return (
    <section id="services" className="cv-auto relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>{t.services.label}</Label>
            <h2 className="mt-6 max-w-[18ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">
              {t.services.title}
            </h2>
          </div>
          <MoreLink to="/platforma">{t.services.all}</MoreLink>
        </Reveal>

        <div className="mt-14 grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((s, i) => {
            const Preview = PREVIEWS[i];
            return (
              <Reveal key={i} delay={i * 100} className="border-b border-r border-line md:last:col-span-2 lg:last:col-span-1">
                <Link to={`/platforma#${SERVICES[i].slug}`} className="block h-full">
                  <Card>{(state) => <Preview {...state} title={s.title} body={s.body} cta={t.services.quote} />}</Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MoreLink({ to, children, accent }: { to: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <Link
      to={to}
      className={cx(
        'group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors',
        accent ? 'text-magenta hover:text-fg' : 'text-dim hover:text-fg',
      )}
    >
      {children}
      <span className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1">→</span>
    </Link>
  );
}

type PreviewState = { active: boolean; px: number };
type CardContent = { title: string; body: string; cta?: string; bare?: boolean };

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

function CardBody({ title, body, cta }: CardContent) {
  return (
    <div className="relative px-6 pb-7 pt-6 sm:px-8">
      <h3 className="text-[24px] font-medium tracking-[-0.025em] text-fg">{title}</h3>
      <p className="mt-2 text-[15.5px] leading-[1.6] text-dim">{body}</p>
      {cta && (
        <span className="mt-5 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-magenta transition-colors group-hover:text-fg">
          {cta}
          <span className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1">→</span>
        </span>
      )}
    </div>
  );
}

function Stage({ children }: { children: React.ReactNode }) {
  return <div className="subgrid relative h-[260px] overflow-hidden border-b border-line">{children}</div>;
}

/*
 * One payload, three aspect ratios: the same Remotion composition rendered at 9:16, 1:1 and 16:9.
 * Wireframe at rest; on hover every slot fills in.
 */
function VideoPreview({ active, ...c }: PreviewState & CardContent) {
  return (
    <>
      <Stage>
        <ClientOnly>
          <Suspense fallback={null}>
            <FormatTrio active={active} />
          </Suspense>
        </ClientOnly>
      </Stage>
      {!c.bare && <CardBody {...c} />}
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
            <span className="ml-3 font-mono text-[9.5px] text-faint">demo.exedria.tech</span>
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
      {!c.bare && <CardBody {...c} />}
    </>
  );
}

/* Booking grid: slots spring in, one gets picked, confirmation lands. */

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
      {!c.bare && <CardBody {...c} />}
    </>
  );
}

