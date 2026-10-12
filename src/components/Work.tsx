import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { MARINA, SCENES } from '../data/marina';
import { useT } from '../i18n';
import { Label, Reveal, cx } from './ui';

const D = MARINA.duration;
const pct = (s: number) => `${(s / D) * 100}%`;

function useVideoClock(ref: React.RefObject<HTMLVideoElement | null>) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      setTime(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(raf);
      setTime(v.currentTime);
    };
    const onSeek = () => setTime(v.currentTime);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('seeked', onSeek);
    v.addEventListener('timeupdate', onSeek);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('seeked', onSeek);
      v.removeEventListener('timeupdate', onSeek);
    };
  }, [ref]);
  return { time, playing };
}

/**
 * The Marina Park reel: player with scene scrub bar plus the scene thumbnails.
 * On the home page it carries its own heading; the case study page passes `intro` instead.
 */
export function Work({ intro, id = 'work' }: { intro?: ReactNode; id?: string }) {
  const { t } = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { time, playing } = useVideoClock(videoRef);
  const [muted, setMuted] = useState(true);
  const [hoverT, setHoverT] = useState<number | null>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Autoplay muted while visible.
  useEffect(() => {
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const seek = (s: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(D - 0.05, Math.max(0, s));
  };
  const timeAt = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * D;
  };

  const currentScene = SCENES.findIndex((s) => time >= s.from && time < s.to);
  const progress = time / D;

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <section id={id} className="relative border-t border-line py-24 md:py-32">
      <div ref={wrapRef} className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16">
          {/* Viewer */}
          <Reveal>
            <div className="relative mx-auto max-w-[400px]">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[3px] border border-line bg-panel">
                <video
                  ref={videoRef}
                  src={MARINA.src}
                  poster={MARINA.poster}
                  muted={muted}
                  playsInline
                  loop
                  preload="metadata"
                  onClick={toggle}
                  className="h-full w-full cursor-pointer object-cover"
                />
                {!playing && (
                  <button
                    onClick={toggle}
                    className="absolute inset-0 grid place-items-center"
                    aria-label="Play"
                  >
                    <span className="grid size-16 place-items-center rounded-[3px] bg-magenta text-paper transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-110 active:scale-95">
                      <svg width="16" height="18" viewBox="0 0 10 12" fill="currentColor">
                        <path d="M0 0 L10 6 L0 12 Z" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>

              {/* Scrub bar with scene segments and hover thumbnail */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={toggle}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="grid size-9 shrink-0 place-items-center rounded-[3px] border border-line-strong text-fg transition-transform duration-300 ease-[var(--ease-spring)] active:scale-90"
                >
                  {playing ? (
                    <svg width="9" height="11" viewBox="0 0 10 12" fill="currentColor">
                      <rect width="3" height="12" />
                      <rect x="7" width="3" height="12" />
                    </svg>
                  ) : (
                    <svg width="9" height="11" viewBox="0 0 10 12" fill="currentColor">
                      <path d="M0 0 L10 6 L0 12 Z" />
                    </svg>
                  )}
                </button>
                <div
                  ref={scrubRef}
                  className="relative h-9 flex-1 cursor-ew-resize touch-none select-none"
                  onPointerDown={(e) => {
                    dragging.current = true;
                    (e.target as Element).setPointerCapture(e.pointerId);
                    seek(timeAt(e.clientX, scrubRef.current!));
                  }}
                  onPointerMove={(e) => {
                    const s = timeAt(e.clientX, scrubRef.current!);
                    setHoverT(s);
                    if (dragging.current) seek(s);
                  }}
                  onPointerUp={() => (dragging.current = false)}
                  onPointerLeave={() => setHoverT(null)}
                >
                  <div className="absolute inset-x-0 top-1/2 flex h-[6px] -translate-y-1/2 gap-[2px]">
                    {SCENES.map((s, i) => (
                      <span
                        key={i}
                        className={cx('h-full rounded-[1px] transition-colors', i === currentScene ? 'bg-line-strong' : 'bg-line')}
                        style={{ width: pct(s.to - s.from) }}
                      />
                    ))}
                  </div>
                  <div
                    className="absolute inset-x-0 top-1/2 h-[6px] origin-left bg-sky/80 mix-blend-screen"
                    style={{ transform: `translateY(-50%) scaleX(${progress})` }}
                  />
                  {hoverT !== null && (
                    <div
                      className="pointer-events-none absolute bottom-full left-0 mb-3 w-full"
                      style={{ transform: `translateX(${(hoverT / D) * 100}%)` }}
                    >
                      <div className="w-[92px] -translate-x-1/2 overflow-hidden rounded-[2px] border border-line-strong bg-paper shadow-[0_12px_32px_rgb(11_18_32/0.18)]">
                        <div className="relative h-[160px] w-[90px] overflow-hidden">
                          <img
                            src={MARINA.strip}
                            alt=""
                            className="absolute left-0 top-0 h-[160px] max-w-none"
                            style={{
                              width: 90 * MARINA.stripFrames,
                              transform: `translateX(${-Math.min(MARINA.stripFrames - 1, Math.floor(hoverT)) * 90}px)`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setMuted((m) => !m)}
                  className={cx(
                    'h-9 shrink-0 rounded-[3px] border px-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-transform duration-300 ease-[var(--ease-spring)] active:scale-90',
                    muted ? 'border-line-strong text-faint' : 'border-sky/60 text-sky-ink',
                  )}
                >
                  {muted ? 'mute' : 'sound'}
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex min-w-0 flex-col justify-center">
            {intro ?? (
              <>
                <Label>{t.work.label}</Label>
                <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.16em] text-sky-ink">{t.work.client}</p>
                <h2 className="mt-3 max-w-[16ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">
                  {t.work.title}
                </h2>
                <p className="mt-5 max-w-[44ch] text-[16.5px] leading-[1.6] text-dim">{t.work.body}</p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] uppercase tracking-[0.14em]">
                  <Link to="/lucrari/marina-park" className="group inline-flex items-center gap-2 text-fg hover:text-sky-ink">
                    {t.portfolio.open}
                    <span className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1">→</span>
                  </Link>
                  <Link to="/lucrari" className="group inline-flex items-center gap-2 text-dim hover:text-fg">
                    {t.portfolio.all}
                    <span className="transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </>
            )}

            {/* Scenes: one thumbnail each, the playing one lifts */}
            <div className="mt-10 grid grid-cols-8 gap-1.5 sm:gap-2.5">
              {SCENES.map((sc, i) => {
                const on = i === currentScene;
                const k = Math.min(MARINA.stripFrames - 1, Math.floor(sc.from) + 1);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      seek(sc.from + 0.02);
                      videoRef.current?.play().catch(() => {});
                    }}
                    aria-label={t.scenes[i].name}
                    className={cx(
                      'relative aspect-[9/16] overflow-hidden rounded-[2px] border transition-[transform,border-color] duration-500 ease-[var(--ease-spring)] hover:-translate-y-1',
                      on ? '-translate-y-2 border-sky' : 'border-line-strong',
                    )}
                    style={{
                      backgroundImage: `url(${MARINA.strip})`,
                      backgroundSize: `${MARINA.stripFrames * 100}% 100%`,
                      backgroundPosition: `${(k / (MARINA.stripFrames - 1)) * 100}% 0`,
                    }}
                  >
                    <span
                      className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-sky"
                      style={{ transform: `scaleX(${on ? Math.min(1, (time - sc.from) / (sc.to - sc.from)) : 0})` }}
                    />
                  </button>
                );
              })}
            </div>
            <p key={currentScene} className="fade-up mt-4 text-[15px] text-dim">
              <span className="font-medium text-fg">{t.scenes[Math.max(0, currentScene)].name}</span>
            </p>
          </Reveal>
      </div>
    </section>
  );
}
