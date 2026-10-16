import { Link } from 'react-router';
import { Hero } from '../components/Hero';
import { Process } from '../components/Process';
import { Services } from '../components/Services';
import { Button, Label, Reveal, usePageTitle } from '../components/ui';
import { EMAIL } from '../data/company';
import { useT } from '../i18n';

export function Home() {
  usePageTitle('');
  return (
    <>
      <Hero />
      <WorkDoor />
      <Services />
      <Process id="cum-lucram" />
      <Audience />
      <HomeCta />
    </>
  );
}

/** Right under the hero: one large door to the case studies. */
function WorkDoor() {
  const { t } = useT();
  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto max-w-[1440px]">
        <Link to="/lucrari" className="group relative block overflow-hidden px-4 py-14 sm:px-8 md:py-20">
          {/* fills from the left on hover */}
          <span
            aria-hidden
            className="absolute inset-0 origin-left scale-x-0 bg-magenta/10 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
          />
          <span className="relative block">
            <Label tone="magenta">{t.workDoor.label}</Label>
            <span className="mt-6 flex items-end justify-between gap-6">
              <span className="block max-w-[20ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">{t.workDoor.title}</span>
              <span
                aria-hidden
                className="grid size-14 shrink-0 place-items-center rounded-[3px] border border-line-strong text-[22px] transition-[transform,background-color,color,border-color] duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1 group-hover:border-magenta group-hover:bg-magenta group-hover:text-paper"
              >
                →
              </span>
            </span>
            <span className="mt-4 block max-w-[44ch] text-[16.5px] leading-[1.6] text-dim">{t.workDoor.body}</span>
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

/** Who the studio works for: three kinds of clients, one line each. */
function Audience() {
  const { t } = useT();
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal>
          <Label>{t.audience.label}</Label>
          <h2 className="mt-6 max-w-[18ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">{t.audience.title}</h2>
        </Reveal>
        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {t.audience.items.map((a, i) => (
            <Reveal as="li" key={a.title} delay={i * 100} className="border-t border-line pt-6">
              <h3 className="text-[24px] font-medium tracking-[-0.025em]">{a.title}</h3>
              <p className="mt-2 max-w-[36ch] text-[15.5px] leading-[1.55] text-dim">{a.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Closing call to action; the form itself lives on /contact. */
function HomeCta() {
  const { t } = useT();
  return (
    <section className="subgrid relative border-t border-line py-24 md:py-32">
      <Reveal className="mx-auto grid max-w-[1440px] items-end gap-10 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Label tone="magenta">{t.contact.label}</Label>
          <h2 className="mt-6 text-[clamp(44px,6.4vw,104px)] font-semibold leading-[0.9] tracking-[-0.055em]">{t.homeCta.title}</h2>
          <p className="mt-6 max-w-[40ch] text-[16.5px] leading-[1.6] text-dim">{t.homeCta.body}</p>
        </div>
        <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:items-end">
          <Button href="/contact">{t.homeCta.button}</Button>
          <a href={`mailto:${EMAIL}`} className="font-mono text-[13px] text-dim hover:text-fg">
            {EMAIL}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
