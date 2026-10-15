import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Lab } from '../components/Lab';
import { PayloadSync } from '../components/PayloadSync';
import { MoreLink, SERVICES } from '../components/Services';
import { WebSpeed } from '../components/WebSpeed';
import { Label, PageHeader, Reveal, cx, usePageTitle } from '../components/ui';
import { useT } from '../i18n';

/** /platforma: the three modules as chapters, each with its live demo and one call to action. */
export function ServicesPage() {
  const { t } = useT();
  usePageTitle(t.services.label);
  const active = useActiveChapter();
  const video = t.services.items[0];
  return (
    <>
      <PageHeader label={t.services.label} title={t.services.title} lead={t.services.body} />

      {/* Chapter switcher, sticky under the main nav */}
      <nav className="sticky top-[calc(64px+env(safe-area-inset-top,0px))] z-40 border-y border-line bg-paper">
        <ul className="mx-auto grid max-w-[1440px] grid-cols-3 px-4 sm:px-8">
          {SERVICES.map(({ slug }, i) => (
            <li key={slug} className={cx(i > 0 && 'border-l border-line')}>
              <Link
                to={`#${slug}`}
                aria-current={active === slug ? 'location' : undefined}
                className={cx(
                  'relative flex items-center gap-2.5 px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors sm:px-5',
                  active === slug ? 'text-fg' : 'text-faint hover:text-dim',
                )}
              >
                <span className={cx('absolute inset-x-0 bottom-[-1px] h-[2px] transition-colors', active === slug ? 'bg-sky' : 'bg-transparent')} />
                <span className={cx('transition-colors', active === slug ? 'text-sky-ink' : 'text-line-strong')}>0{i + 1}</span>
                {t.services.chapters[i]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Chapter slug="video" footer={<MoreLink to="/lucrari?categorie=video">{t.services.work}</MoreLink>}>
          <Reveal>
            <Label>{video.title}</Label>
            <h2 className="mt-6 max-w-[22ch] text-[clamp(30px,3.6vw,52px)] font-semibold leading-[1] tracking-[-0.045em]">{t.lab.title}</h2>
            <p className="mt-5 max-w-[58ch] text-[16.5px] leading-[1.6] text-dim">{video.body}</p>
          </Reveal>
          <Reveal delay={100} className="mt-12">
            <Lab embedded />
          </Reveal>
        </Chapter>
        <Chapter slug="web">
          <WebSpeed />
        </Chapter>
        <Chapter slug="api">
          <PayloadSync />
        </Chapter>
      </div>
    </>
  );
}

function Chapter({ slug, children, footer }: { slug: string; children: ReactNode; footer?: ReactNode }) {
  const { t } = useT();
  return (
    <section id={slug} data-chapter={slug} className="scroll-mt-[120px] border-b border-line py-14 last:border-b-0 md:py-20">
      {children}
      <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
        <MoreLink to={`/contact?serviciu=${slug}`} accent>
          {t.services.preview}
        </MoreLink>
        {footer}
      </div>
    </section>
  );
}

/** The chapter crossing the upper third of the viewport. */
function useActiveChapter() {
  const [active, setActive] = useState<string>(SERVICES[0].slug);
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.chapter!);
      },
      { rootMargin: '-30% 0px -65% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}
