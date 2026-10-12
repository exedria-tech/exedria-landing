import { Lab } from '../components/Lab';
import { Process } from '../components/Process';
import { Button, PageHeader, Reveal, usePageTitle } from '../components/ui';
import { useT } from '../i18n';

export function Studio() {
  const { t } = useT();
  usePageTitle(t.studio.label);
  return (
    <>
      <PageHeader label={t.studio.label} title={t.studio.title} lead={t.studio.body} />
      <Process />
      <Lab />
      <section className="subgrid border-t border-line py-20 md:py-28">
        <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-8 px-4 sm:px-8">
          <h2 className="max-w-[16ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">{t.homeCta.title}</h2>
          <Button href="/contact">{t.homeCta.button}</Button>
        </Reveal>
      </section>
    </>
  );
}
