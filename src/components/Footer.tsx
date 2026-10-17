import { EMAIL } from '../data/company';
import { useT } from '../i18n';
import { A } from './A';
import { Logo, NAV } from './Nav';

const LEGAL = [
  { key: 'terms', to: '/termeni' },
  { key: 'privacy', to: '/confidentialitate' },
] as const;

const linkCls = 'group relative inline-flex items-center text-[15px] text-dim transition-colors hover:text-fg';
const tick = <span className="absolute -left-5 top-1/2 h-px w-3 origin-left scale-x-0 bg-sky transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-x-100" />;

export function Footer() {
  const { t } = useT();
  return (
    <footer className="relative border-t border-line pt-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="text-fg" />
          <p className="mt-4 max-w-[36ch] text-[15px] leading-[1.6] text-dim">{t.footer.tagline}</p>
          <a href={`mailto:${EMAIL}`} className="mt-6 inline-block text-[15px] text-fg hover:text-sky-ink">
            {EMAIL}
          </a>
        </div>
        <nav className="md:col-span-3" aria-label={t.footer.pages}>
          <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">{t.footer.pages}</div>
          <ul className="space-y-2.5">
            {NAV.map(({ id, to }) => (
              <li key={id}>
                <A to={to} className={linkCls}>
                  {tick}
                  {t.nav[id]}
                </A>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="md:col-span-4" aria-label={t.footer.legal}>
          <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">{t.footer.legal}</div>
          <ul className="space-y-2.5">
            {LEGAL.map(({ key, to }) => (
              <li key={key}>
                <A to={to} className={linkCls}>
                  {tick}
                  {t.legal[key]}
                </A>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-12 max-w-[1440px] px-4 sm:px-8">
        <DotWordmark text="exedria" />
      </div>

      <div className="mx-auto mt-4 flex max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint sm:px-8">
        <span>
          © 2026 Exedria
        </span>
        <button
          data-scroll-top
          className="group inline-flex items-center gap-2 uppercase text-dim transition-colors hover:text-fg"
        >
          <span className="inline-block transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-x-1">⏮</span>
          {t.footer.top}
        </button>
      </div>
    </footer>
  );
}

/** Wordmark sampled into a dot matrix; drawn by src/behaviors/wordmark.ts once it nears the viewport. */
function DotWordmark({ text }: { text: string }) {
  return (
    <div data-wordmark={text} className="relative" aria-label={text} role="img">
      <canvas className="block w-full" />
    </div>
  );
}
