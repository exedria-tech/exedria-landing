import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { A } from '../components/A';
import { Corners, PageHeader, Segmented, cx, timecode, usePageTitle } from '../components/ui';
import { CATEGORIES, OPEN_SLOTS, PROJECTS, type Category, type Project } from '../data/projects';
import { useT } from '../i18n';
import { Island } from '../islands/Island';

type Filter = 'all' | Category;

/** /lucrari: the filter and the cards hover-scrub, so the whole page body is one island. */
export function PortfolioPage() {
  const { t } = useT();
  usePageTitle(t.portfolio.label);
  return <Island name="portfolio" component={Portfolio} when="idle" />;
}

export function Portfolio() {
  const { t } = useT();
  // ?categorie=web arrives from the service pages; read after hydration (the HTML shows all work).
  const [fromUrl, setFromUrl] = useState<Category | undefined>();
  useEffect(() => setFromUrl(CATEGORIES.find((c) => c === new URLSearchParams(location.search).get('categorie'))), []);
  const filter: Filter = fromUrl ?? 'all';
  const setFilter = (f: Filter) => {
    setFromUrl(f === 'all' ? undefined : f);
    const url = new URL(location.href);
    if (f === 'all') url.searchParams.delete('categorie');
    else url.searchParams.set('categorie', f);
    history.replaceState(null, '', url);
  };

  // The filter shows once there is real work in more than one category, or when a link picked one,
  // so a filtered list always has a visible way back to all work.
  const hasWork = (c: Category) => PROJECTS.some((p) => p.category === c);
  const used = fromUrl ? CATEGORIES : CATEGORIES.filter(hasWork);
  const showFilter = used.length > 1;
  const match = (c: Category) => filter === 'all' || filter === c;
  // A filtered view keeps an open slot in its own category, so it never ends on a lone card.
  const slots = filter === 'all' ? OPEN_SLOTS : [filter];

  return (
    <>
      <PageHeader label={t.portfolio.label} title={t.portfolio.title} lead={t.portfolio.body}>
        {showFilter && (
          <div className="fade-up mt-10" style={{ '--d': '240ms' } as CSSProperties}>
            <Segmented<Filter>
              options={['all', ...used]}
              value={filter}
              onChange={setFilter}
              render={(f) => t.portfolio.filters[f]}
              ariaLabel={t.portfolio.label}
            />
          </div>
        )}
      </PageHeader>

      <section className="border-t border-line py-16 md:py-24">
        <div key={filter} className="mx-auto grid max-w-[1440px] gap-x-6 gap-y-14 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
          {PROJECTS.filter((p) => match(p.category)).map((p, i) => (
            <div key={p.slug} className="fade-up" style={{ '--d': `${i * 80}ms` } as CSSProperties}>
              <ProjectCard p={p} />
            </div>
          ))}
          {slots.map((c, i) => (
            <div key={c} className="fade-up" style={{ '--d': `${(PROJECTS.length + i) * 80}ms` } as CSSProperties}>
              <SlotCard category={c} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/** 4:5 canvas with crosshair corners and a frame ruler along the bottom. */
function Canvas({ children, playhead, className }: { children: ReactNode; playhead?: number | null; className?: string }) {
  return (
    <div className={cx('subgrid relative aspect-[4/5] overflow-hidden rounded-[3px] border border-line bg-panel', className)}>
      <Corners className="text-line-strong" size={10} />
      <div className="absolute inset-x-0 bottom-7 top-0 grid place-items-center p-6 sm:p-8">{children}</div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-7 border-t border-line bg-paper/80"
        style={{ backgroundImage: 'repeating-linear-gradient(to right, var(--color-line-strong) 0 1px, transparent 1px 12px)', backgroundSize: '100% 6px', backgroundRepeat: 'no-repeat' }}
      >
        {playhead != null && (
          <span className="absolute -top-px bottom-0 w-px bg-magenta" style={{ left: `${playhead * 100}%` }}>
            <span className="absolute -left-[3px] top-0 size-[7px] bg-magenta" />
          </span>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const { t, lang } = useT();
  const [x, setX] = useState<number | null>(null);
  const frame = p.strip && x !== null ? Math.min(p.strip.frames - 1, Math.floor(x * p.strip.frames)) : null;

  return (
    <A
      to={`/lucrari/${p.slug}`}
      className="group block"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setX(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      }}
      onPointerLeave={() => setX(null)}
    >
      <Canvas playhead={x} className="transition-colors duration-300 group-hover:border-sky/60">
        <div
          className={cx(
            'relative overflow-hidden rounded-[2px] shadow-[0_18px_40px_rgb(11_18_32/0.16)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-[1.03] group-active:scale-[0.99]',
            p.aspect < 1 ? 'h-full' : 'w-full',
          )}
          style={{ aspectRatio: p.aspect }}
        >
          <img src={p.poster} alt="" className="h-full w-full object-cover" loading="lazy" />
          {p.strip && frame !== null && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${p.strip.src})`,
                backgroundSize: `${p.strip.frames * 100}% 100%`,
                backgroundPosition: `${(frame / (p.strip.frames - 1)) * 100}% 0`,
              }}
            />
          )}
        </div>
        <span className="absolute left-3 top-3 z-10 rounded-[2px] bg-paper/90 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-dim">
          {x !== null ? `[${timecode(x * p.duration * p.fps, p.fps)}]` : p.format}
        </span>
      </Canvas>
      <p className="mt-5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-sky-ink">
        {p.client} · {p.place[lang]}
      </p>
      <h2 className="mt-2 max-w-[24ch] text-[22px] font-medium leading-[1.2] tracking-[-0.025em]">{p.title[lang]}</h2>
      <span className="mt-3 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-dim transition-colors group-hover:text-fg">
        {t.portfolio.open}
        <span className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1">→</span>
      </span>
    </A>
  );
}

/** A reserved frame for a future project; it doubles as a call to action. */
function SlotCard({ category }: { category: Category }) {
  const { t } = useT();
  const portrait = category === 'video';
  return (
    <A to="/contact" className="group block">
      <Canvas>
        <div
          className={cx(
            'relative grid place-items-center rounded-[2px] border border-dashed border-line-strong bg-paper/60 transition-[transform,border-color] duration-500 ease-[var(--ease-spring)] group-hover:scale-[1.03] group-hover:border-magenta/60',
            portrait ? 'h-full' : 'w-full',
          )}
          style={{ aspectRatio: portrait ? 9 / 16 : 16 / 10 }}
        >
          {/* title-safe guide and centre crosshair */}
          <span aria-hidden className="absolute inset-[10%] border border-dashed border-line" />
          <span aria-hidden className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-line-strong" />
          <span aria-hidden className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-line-strong" />
          <span className="absolute bottom-[12%] font-mono text-[11px] text-faint transition-colors group-hover:text-magenta">
            {'{ status: "open" }'}
          </span>
        </div>
      </Canvas>
      <p className="mt-5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-faint">
        {t.portfolio.slot} · {t.portfolio.filters[category]}
      </p>
      <h2 className="mt-2 text-[22px] font-medium leading-[1.2] tracking-[-0.025em] text-dim">{t.portfolio.slotBody}</h2>
      <span className="mt-3 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-dim transition-colors group-hover:text-magenta">
        {t.portfolio.slotCta}
        <span className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1">→</span>
      </span>
    </A>
  );
}
