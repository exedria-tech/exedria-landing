import { useEffect, useState, type ReactNode } from 'react';
import { LEGAL_UPDATED } from '../data/company';
import { useT } from '../i18n';
import { PageHeader, cx, usePageTitle } from './ui';

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * Layout for the legal pages: sticky contents on the left that follows the
 * scroll, the text on the right. The text itself is Romanian only.
 */
export function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  const { t } = useT();
  usePageTitle(title);
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.3;
      let cur = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) cur = s.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  return (
    <>
      <PageHeader label="Legal" title={title} lead={`${t.legal.updated}: ${LEGAL_UPDATED}`}>
        {t.legal.onlyRo && <p className="mt-3 font-mono text-[12px] text-faint">{t.legal.onlyRo}</p>}
      </PageHeader>
      <section className="border-t border-line py-16 md:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-12">
          <nav className="hidden lg:col-span-3 lg:block" aria-label={t.legal.contents}>
            <div className="sticky top-24">
              <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">{t.legal.contents}</div>
              <ol className="relative space-y-1 border-l border-line">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={cx(
                        '-ml-px flex gap-3 border-l py-1.5 pl-4 text-[14px] leading-[1.4] transition-colors duration-200',
                        active === s.id ? 'border-sky text-fg' : 'border-transparent text-faint hover:text-dim',
                      )}
                    >
                      <span className="font-mono text-[11px] tabular-nums leading-[1.75]">{i + 1}.</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <article className="legal max-w-[68ch] lg:col-span-7" lang="ro">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 border-b border-line pb-10 pt-10 first:pt-0 last:border-b-0">
                <h2 className="flex gap-3 text-[24px] font-medium tracking-[-0.025em]">
                  <span className="pt-[7px] font-mono text-[12px] tabular-nums text-faint">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="mt-4">{s.body}</div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
