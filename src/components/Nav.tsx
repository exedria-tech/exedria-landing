import { useEffect, useState } from 'react';
import { useT, type Lang } from '../i18n';
import { Segmented, cx } from './ui';

export const SECTIONS = ['work', 'services', 'lab', 'process', 'contact'] as const;
type Section = (typeof SECTIONS)[number];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <rect x="1" y="2" width="2.5" height="18" fill="currentColor" />
        <rect x="1" y="2" width="15" height="2.5" fill="currentColor" />
        <rect x="1" y="9.75" width="10" height="2.5" fill="currentColor" />
        <rect x="1" y="17.5" width="15" height="2.5" fill="currentColor" />
        <rect x="18.5" y="6" width="2.5" height="10" fill="#e0179e" />
      </svg>
      <span className="text-[19px] font-semibold tracking-[-0.03em]">exedria</span>
    </span>
  );
}

export function Nav() {
  const { t, lang, setLang } = useT();
  const [active, setActive] = useState<Section | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const mid = window.innerHeight * 0.4;
      let cur: Section | null = null;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const idx = active ? SECTIONS.indexOf(active) : -1;

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top,0px)] transition-colors duration-300',
        scrolled ? 'border-line bg-paper/95' : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8">
        <a href="#top" className="text-fg transition-transform duration-300 ease-[var(--ease-spring)] active:scale-95" aria-label="Exedria">
          <Logo />
        </a>

        {/* Switchboard: one channel per section, the lit one follows the scroll */}
        <nav className="relative hidden rounded-[3px] border border-line bg-panel/80 p-[3px] lg:block">
          <span
            aria-hidden
            className="absolute bottom-[3px] left-[3px] top-[3px] w-[calc((100%-6px)/5)] rounded-[2px] bg-raised ring-1 ring-line-strong transition-[transform,opacity] duration-500 ease-[var(--ease-spring)]"
            style={{ transform: `translateX(${Math.max(0, idx) * 100}%)`, opacity: idx < 0 ? 0 : 1 }}
          />
          <ul className="relative grid grid-cols-5">
            {SECTIONS.map((id, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={cx(
                    'flex w-[118px] items-center justify-center gap-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 active:scale-95',
                    i === idx ? 'text-fg' : 'text-faint hover:text-dim',
                  )}
                >
                  <span className={cx('size-[5px] transition-colors', i === idx ? 'bg-sky' : 'bg-line-strong')} />
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Segmented<Lang> size="sm" options={['ro', 'en']} value={lang} onChange={setLang} ariaLabel="Language" />
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-[3px] bg-fg px-3.5 py-2 text-[13.5px] font-medium text-paper transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.97] sm:inline-flex"
          >
            {t.nav.cta}
            <span className="size-1.5 bg-magenta" />
          </a>
        </div>
      </div>
    </header>
  );
}
