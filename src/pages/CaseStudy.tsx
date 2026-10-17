import { A } from '../components/A';
import { MoreLink } from '../components/Services';
import { Button, PageHeader, Reveal, usePageTitle } from '../components/ui';
import { PROJECTS, findProject, type Project } from '../data/projects';
import { SERVICES } from '../data/services';
import { useT } from '../i18n';
import { CaseReel, Details } from '../islands/CaseReel';
import { Island } from '../islands/Island';
import { NotFound } from './NotFound';

export function CaseStudy({ slug }: { slug: string }) {
  const p = findProject(slug);
  if (!p) return <NotFound />;
  return <CaseStudyPage p={p} />;
}

function CaseStudyPage({ p }: { p: Project }) {
  const { t, lang } = useT();
  usePageTitle(p.client);

  const serviceIdx = SERVICES.findIndex((s) => s.category === p.category);
  const i = PROJECTS.indexOf(p);
  const next = PROJECTS.length > 1 ? PROJECTS[(i + 1) % PROJECTS.length] : null;

  return (
    <>
      <PageHeader label={`${p.client} · ${p.place[lang]}`} title={p.title[lang]} lead={p.summary[lang]}>
        <A
          to="/lucrari"
          className="group mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-dim hover:text-fg"
        >
          <span className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-translate-x-1">←</span>
          {t.caseStudy.back}
        </A>
      </PageHeader>

      {p.video ? (
        <Island name="reel" component={CaseReel} props={{ slug: p.slug }} />
      ) : (
        <section className="border-t border-line py-24 md:py-32">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <img src={p.poster} alt="" className="mx-auto w-full max-w-[400px] rounded-[3px] border border-line" />
            </Reveal>
            <Reveal delay={120}>
              <Details p={p} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="subgrid border-t border-line py-20 md:py-28">
        <Reveal className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h2 className="max-w-[16ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">{t.caseStudy.ask}</h2>
            <Button href={serviceIdx >= 0 ? `/contact?serviciu=${SERVICES[serviceIdx].slug}` : '/contact'}>{t.caseStudy.cta}</Button>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
            {serviceIdx >= 0 && (
              <MoreLink to={`/servicii#${SERVICES[serviceIdx].slug}`}>
                {t.caseStudy.service}: {t.services.items[serviceIdx].title}
              </MoreLink>
            )}
            {next && (
              <MoreLink to={`/lucrari/${next.slug}`}>
                {t.caseStudy.next}: {next.client}
              </MoreLink>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
