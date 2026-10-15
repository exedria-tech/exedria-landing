import { Hero } from '../components/Hero';
import { MoreLink, Services } from '../components/Services';
import { Button, Label, Reveal, usePageTitle } from '../components/ui';
import { EMAIL } from '../data/company';
import { useT } from '../i18n';

export function Home() {
  usePageTitle('');
  return (
    <>
      <Hero />
      <Services />
      <StudioTeaser />
      <HomeCta />
    </>
  );
}

/** One line pointing to /studio, where the process and the motion lab live. */
function StudioTeaser() {
  const { t } = useT();
  return (
    <section className="border-t border-line py-16 md:py-20">
      <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
        <div>
          <Label>{t.studio.label}</Label>
          <h2 className="mt-5 max-w-[22ch] text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.studio.teaserTitle}</h2>
        </div>
        <MoreLink to="/studio">{t.studio.teaserLink}</MoreLink>
      </Reveal>
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
