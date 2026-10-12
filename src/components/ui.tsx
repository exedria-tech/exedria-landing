import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** HH:MM:SS:FF timecode */
export function timecode(frame: number, fps: number) {
  const f = Math.max(0, Math.floor(frame));
  const ff = f % fps;
  const s = Math.floor(f / fps);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
}

/** Crosshair corner ticks, drawn inside the nearest positioned parent. */
export function Corners({ className, size = 8 }: { className?: string; size?: number }) {
  const s = { width: size, height: size } as CSSProperties;
  const base = 'pointer-events-none absolute border-current';
  return (
    <span aria-hidden className={cx('text-line-strong', className)}>
      <span style={s} className={cx(base, '-left-px -top-px border-l border-t')} />
      <span style={s} className={cx(base, '-right-px -top-px border-r border-t')} />
      <span style={s} className={cx(base, '-bottom-px -left-px border-b border-l')} />
      <span style={s} className={cx(base, '-bottom-px -right-px border-b border-r')} />
    </span>
  );
}

export function Chip({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'sky' | 'magenta' | 'phosphor' }) {
  const tones = {
    default: 'border-line-strong text-dim',
    sky: 'border-sky/40 text-sky-ink',
    magenta: 'border-magenta/40 text-magenta',
    phosphor: 'border-phosphor/40 text-phosphor',
  };
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-[3px] font-mono text-[10.5px] uppercase leading-none tracking-[0.12em]',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Section label: a square keyframe marker + mono caption. */
export function Label({ children, tone = 'sky' }: { children: ReactNode; tone?: 'sky' | 'magenta' | 'phosphor' }) {
  const c = { sky: 'bg-sky', magenta: 'bg-magenta', phosphor: 'bg-phosphor' }[tone];
  return (
    <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
      <span className={cx('size-[7px] rotate-45', c)} />
      {children}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  href?: string;
  children: ReactNode;
};

export function Button({ variant = 'primary', href, children, className, ...rest }: BtnProps) {
  const cls = cx(
    'group relative inline-flex select-none items-center gap-3 rounded-[3px] px-5 py-3 text-[15px] font-medium',
    'transition-transform duration-300 ease-[var(--ease-spring)] active:translate-y-[1px] active:scale-[0.97]',
    variant === 'primary'
      ? 'bg-magenta text-paper hover:-translate-y-0.5'
      : 'border border-line-strong text-fg hover:-translate-y-0.5',
    className,
  );
  const inner = (
    <>
      {variant === 'ghost' && <Corners className="text-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100" size={6} />}
      <span>{children}</span>
      <span className="relative inline-block overflow-hidden" aria-hidden>
        <span className="block transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-[140%]">→</span>
        <span className="absolute inset-0 -translate-x-[140%] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-0">
          →
        </span>
      </span>
    </>
  );
  if (href)
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}

/** Segmented toggle that slides an indicator with a spring curve. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  render,
  size = 'md',
  ariaLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  render?: (v: T) => ReactNode;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}) {
  const idx = Math.max(0, options.indexOf(value));
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="relative inline-grid rounded-[3px] border border-line bg-panel p-[3px]"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="absolute bottom-[3px] left-[3px] top-[3px] rounded-[2px] bg-raised ring-1 ring-line-strong transition-transform duration-500 ease-[var(--ease-spring)]"
        style={{
          width: `calc((100% - 6px) / ${options.length})`,
          transform: `translateX(${idx * 100}%)`,
        }}
      />
      {options.map((o) => (
        <button
          key={o}
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={cx(
            'relative z-10 whitespace-nowrap font-mono uppercase tracking-[0.1em] transition-colors duration-200 active:scale-95',
            size === 'sm' ? 'px-2.5 py-1 text-[10.5px]' : 'px-3.5 py-1.5 text-[11.5px]',
            o === value ? 'text-fg' : 'text-faint hover:text-dim',
          )}
        >
          {render ? render(o) : o}
        </button>
      ))}
    </div>
  );
}

export function useInView<T extends Element>(opts: IntersectionObserverInit = { threshold: 0.15 }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, opts);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView] as const;
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'p';
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      data-in={inView}
      className={cx('reveal', className)}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
