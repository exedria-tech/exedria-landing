import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useT, type Lang } from '../i18n';
import { NAV } from '../routes';
import { Segmented, cx } from './ui';

export { NAV };

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
  const { pathname, key } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [key]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The lit channel follows the route, including sub-pages like /lucrari/marina-park.
  const idx = NAV.findIndex((n) => pathname === n.to || pathname.startsWith(`${n.to}/`));

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top,0px)] transition-colors duration-300',
        scrolled || open ? 'border-line bg-paper' : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8">
        <Link to="/" className="text-fg transition-transform duration-300 ease-[var(--ease-spring)] active:scale-95" aria-label="Exedria">
          <Logo />
        </Link>

        {/* Switchboard: one channel per destination */}
        <nav className="relative hidden rounded-[3px] border border-line bg-panel/80 p-[3px] lg:block">
          <span
            aria-hidden
            className="absolute bottom-[3px] left-[3px] top-[3px] w-[calc((100%-6px)/3)] rounded-[2px] bg-raised ring-1 ring-line-strong transition-[transform,opacity] duration-500 ease-[var(--ease-spring)]"
            style={{ transform: `translateX(${Math.max(0, idx) * 100}%)`, opacity: idx < 0 ? 0 : 1 }}
          />
          <ul className="relative grid grid-cols-3">
            {NAV.map(({ id, to }, i) => (
              <li key={id}>
                <Link
                  to={to}
                  aria-current={i === idx ? 'page' : undefined}
                  className={cx(
                    'flex w-[118px] items-center justify-center gap-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 active:scale-95',
                    i === idx ? 'text-fg' : 'text-faint hover:text-dim',
                  )}
                >
                  <span className={cx('size-[5px] transition-colors', i === idx ? 'bg-sky' : 'bg-line-strong')} />
                  {t.nav[id]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Segmented<Lang> size="sm" options={['ro', 'en']} value={lang} onChange={setLang} ariaLabel="Language" />
          <Link
            to="/contact"
            className="hidden items-center gap-2 rounded-[3px] bg-fg px-3.5 py-2 text-[13.5px] font-medium text-paper transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.97] sm:inline-flex"
          >
            {t.nav.cta}
            <span className="size-1.5 bg-magenta" />
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t.menu}
            className="grid size-9 place-items-center rounded-[3px] border border-line-strong transition-transform duration-300 ease-[var(--ease-spring)] active:scale-90 lg:hidden"
          >
            <span className="relative block h-[9px] w-4">
              <span className={cx('absolute left-0 top-0 h-[1.5px] w-full bg-fg transition-transform duration-300 ease-[var(--ease-spring)]', open && 'translate-y-[3.75px] rotate-45')} />
              <span className={cx('absolute bottom-0 left-0 h-[1.5px] w-full bg-fg transition-transform duration-300 ease-[var(--ease-spring)]', open && '-translate-y-[3.75px] -rotate-45')} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-nav"
        className={cx(
          'overflow-hidden border-line transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)] lg:hidden',
          open ? 'translate-y-0 border-t opacity-100' : 'pointer-events-none h-0 -translate-y-2 opacity-0',
        )}
      >
        <ul className="mx-auto max-w-[1440px] px-4 py-3 sm:px-8">
          {NAV.map(({ id, to }, i) => (
            <li key={id} className="border-b border-line last:border-b-0">
              <Link
                to={to}
                tabIndex={open ? 0 : -1}
                className={cx('flex items-center justify-between py-3.5 text-[22px] tracking-[-0.02em]', i === idx ? 'text-fg' : 'text-dim')}
              >
                {t.nav[id]}
                <span className={cx('size-[7px] rotate-45', i === idx ? 'bg-sky' : 'bg-line-strong')} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
