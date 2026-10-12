import { ContactForm } from '../components/Contact';
import { PageHeader, Reveal, usePageTitle } from '../components/ui';
import { EMAIL } from '../data/company';
import { useT } from '../i18n';

export function ContactPage() {
  const { t } = useT();
  usePageTitle(t.contact.label);
  return (
    <>
      <PageHeader label={t.contact.label} tone="magenta" title={t.contact.title} lead={t.contact.body} />
      <section className="border-t border-line py-16 md:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-4 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">{t.contact.direct}</div>
              <a href={`mailto:${EMAIL}`} className="group mt-2 inline-flex text-[22px] tracking-[-0.02em] text-fg">
                <span className="relative">
                  {EMAIL}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-sky transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
                </span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
