import type { ReactNode } from 'react';
import { A } from '../components/A';
import { Lab } from '../components/Lab';
import { PayloadSync } from '../components/PayloadSync';
import { MoreLink } from '../components/Services';
import { WebSpeed } from '../components/WebSpeed';
import { Label, PageHeader, Reveal, cx, usePageTitle } from '../components/ui';
import { SERVICES } from '../data/services';
import { useT } from '../i18n';
import { Island } from '../islands/Island';

/**
 * /servicii: the three services as chapters, each with its live demo and one call to action.
 * The motion lab lives only here, in the Video chapter.
 */
export function ServicesPage() {
  const { t } = useT();
  usePageTitle(t.nav.services);
  const video = t.services.items[0];
  return (
    <>
      <PageHeader label={t.nav.services} title={t.services.title} lead={t.services.body} />

      {/* Chapter switcher, sticky under the main nav; src/behaviors/chapters.ts marks the chapter in view */}
      <nav className="sticky top-[calc(64px+env(safe-area-inset-top,0px))] z-40 border-y border-line bg-paper">
        <ul className="mx-auto grid max-w-[1440px] grid-cols-3 px-4 sm:px-8">
          {SERVICES.map(({ slug }, i) => (
            <li key={slug} className={cx(i > 0 && 'border-l border-line')}>
              <A
                to={`#${slug}`}
                data-chapter-link={slug}
                data-active={i === 0 ? '' : undefined}
                aria-current={i === 0 ? 'location' : undefined}
                className="group/ch relative flex items-center gap-2.5 px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-dim data-[active]:text-fg data-[active]:hover:text-fg sm:px-5"
              >
                <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-transparent transition-colors group-data-[active]/ch:bg-sky" />
                <span className="text-line-strong transition-colors group-data-[active]/ch:text-sky-ink">0{i + 1}</span>
                {t.services.chapters[i]}
              </A>
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
            <Island name="lab" component={Lab} />
          </Reveal>
        </Chapter>
        <Chapter slug="web">
          <WebSpeed />
        </Chapter>
        <Chapter slug="api">
          <Island name="payload" component={PayloadSync} />
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
