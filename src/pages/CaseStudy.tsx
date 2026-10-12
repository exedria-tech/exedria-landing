import { Link, useParams } from 'react-router';
import { MoreLink, SERVICES } from '../components/Services';
import { Work } from '../components/Work';
import { Button, Label, PageHeader, Reveal, usePageTitle } from '../components/ui';
import { PROJECTS, findProject, type Project } from '../data/projects';
import { useT } from '../i18n';
import { NotFound } from './NotFound';

export function CaseStudy() {
  const { slug } = useParams();
  const p = findProject(slug);
  if (!p) return <NotFound />;
  return <CaseStudyPage p={p} />;
}

function CaseStudyPage({ p }: { p: Project }) {
  const { t, lang } = useT();
  usePageTitle(p.client);

  const details = <Details p={p} />;
  const serviceIdx = SERVICES.findIndex((s) => s.category === p.category);
  const i = PROJECTS.indexOf(p);
  const next = PROJECTS.length > 1 ? PROJECTS[(i + 1) % PROJECTS.length] : null;

  return (
    <>
      <PageHeader label={`${p.client} · ${p.place[lang]}`} title={p.title[lang]} lead={p.summary[lang]}>
        <Link
          to="/lucrari"
          className="group mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-dim hover:text-fg"
        >
          <span className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-translate-x-1">←</span>
          {t.caseStudy.back}
        </Link>
      </PageHeader>

      {/* Marina Park has the interactive scene player; other projects get a plain player. */}
      {p.slug === 'marina-park' ? (
        <Work id="reel" intro={details} />
      ) : (
        <section className="border-t border-line py-24 md:py-32">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              {p.video ? (
                <video src={p.video} poster={p.poster} controls playsInline className="w-full rounded-[3px] border border-line bg-panel" />
              ) : (
                <img src={p.poster} alt="" className="w-full rounded-[3px] border border-line" />
              )}
            </Reveal>
            <Reveal delay={120}>{details}</Reveal>
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

/** Facts table plus the short write-up. */
function Details({ p }: { p: Project }) {
  const { lang } = useT();
  return (
    <div>
      <dl className="grid grid-cols-2 border-t border-line">
        {p.facts.map((f) => (
          <div key={f.k.ro} className="border-b border-line py-3 pr-4">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{f.k[lang]}</dt>
            <dd className="mt-1 text-[15px] text-fg">{f.v[lang]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 space-y-8">
        {p.sections.map((s) => (
          <div key={s.title.ro}>
            <Label>{s.title[lang]}</Label>
            <p className="mt-3 max-w-[52ch] text-[16.5px] leading-[1.6] text-dim">{s.body[lang]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
