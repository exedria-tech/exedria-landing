import { useEffect, useRef, useState } from 'react';
import wave from '../data/marina-wave.json';
import { MARINA, SCENES, TEXT_LAYERS } from '../data/marina';
import { useT } from '../i18n';
import { Corners, Label, Reveal, cx, timecode } from './ui';

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

export function Work() {
  const { t } = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { time, playing } = useVideoClock(videoRef);
  const [muted, setMuted] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
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
  const shownScene = selected ?? currentScene;
  const progress = time / D;
  const frame = Math.round(time * MARINA.fps);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <section id="work" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Label>{t.work.label}</Label>
            <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.16em] text-sky-ink">{t.work.client}</p>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">
              {t.work.title}
            </h2>
          </Reveal>
          <Reveal delay={120} className="flex flex-col justify-end gap-8 lg:col-span-5">
            <p className="text-[16.5px] leading-[1.6] text-dim">{t.work.body}</p>
            <dl className="grid gap-4 border-t border-line pt-4 font-mono text-[11px] sm:grid-cols-3">
              {t.work.meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="uppercase tracking-[0.14em] text-faint">{k}</dt>
                  <dd className="mt-1.5 text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div ref={wrapRef} className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8">
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
                {/* safe zone + overlays */}
                <div className="pointer-events-none absolute inset-[6%] border border-dashed border-white/25" />
                <div className="pointer-events-none absolute left-3 top-3 rounded-[2px] bg-paper/85 px-2 py-1 font-mono text-[10.5px] tabular-nums text-fg">
                  {timecode(frame, MARINA.fps)}
                </div>
                <div className="pointer-events-none absolute right-3 top-3 rounded-[2px] bg-paper/85 px-2 py-1 font-mono text-[10.5px] text-dim">
                  9:16
                </div>
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
              <Corners className="text-fg/40" size={10} />

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
                        <div className="px-1.5 py-1 text-center font-mono text-[9.5px] tabular-nums text-dim">
                          {timecode(hoverT * MARINA.fps, MARINA.fps)}
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

          {/* Track view */}
          <Reveal delay={120} className="min-w-0">
            <div className="relative rounded-[3px] border border-line bg-panel">
              <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[11px]">
                <span className="uppercase tracking-[0.16em] text-dim">{t.work.tracks} · marina-park.tsx</span>
                <span className="tabular-nums text-fg">{timecode(frame, MARINA.fps)}</span>
              </div>

              <div className="grid grid-cols-[64px_minmax(0,1fr)] sm:grid-cols-[84px_minmax(0,1fr)]">
                {/* ruler */}
                <div className="border-b border-r border-line" />
                <div
                  className="relative h-8 cursor-ew-resize border-b border-line"
                  onPointerDown={(e) => seek(timeAt(e.clientX, e.currentTarget))}
                >
                  {Array.from({ length: D + 1 }, (_, s) => (
                    <span
                      key={s}
                      className={cx('absolute bottom-0 w-px', s % 5 === 0 ? 'h-3 bg-line-strong' : 'h-1.5 bg-line')}
                      style={{ left: pct(s) }}
                    />
                  ))}
                  {Array.from({ length: D / 5 }, (_, i) => (
                    <span key={i} className="absolute top-1.5 ml-1 font-mono text-[9.5px] text-faint" style={{ left: pct(i * 5) }}>
                      {i * 5}s
                    </span>
                  ))}
                </div>

                {/* V1 scenes */}
                <TrackLabel name="V1" sub={t.work.scenes} />
                <div className="relative h-[76px] border-b border-line">
                  {SCENES.map((s, i) => {
                    const active = i === shownScene;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelected(i);
                          seek(s.from + 0.02);
                        }}
                        className={cx(
                          'group absolute inset-y-2 overflow-hidden rounded-[2px] border text-left transition-transform duration-300 ease-[var(--ease-spring)] active:scale-y-90',
                          active ? 'border-sky bg-sky/10' : 'border-line-strong bg-raised hover:border-sky/50',
                        )}
                        style={{ left: `calc(${pct(s.from)} + 1px)`, width: `calc(${pct(s.to - s.from)} - 2px)` }}
                      >
                        {/* filmstrip: thumbnails from the sprite */}
                        <span className="absolute inset-0 flex opacity-40 transition-opacity duration-300 group-hover:opacity-70">
                          {Array.from({ length: Math.max(1, Math.round(s.to - s.from)) }, (_, k) => (
                            <span key={k} className="relative h-full min-w-0 flex-1 overflow-hidden">
                              <img
                                src={MARINA.strip}
                                alt=""
                                className="absolute top-1/2 h-[120px] max-w-none -translate-y-1/2"
                                style={{ width: 67.5 * MARINA.stripFrames, left: -Math.min(39, Math.floor(s.from) + k) * 67.5 }}
                              />
                            </span>
                          ))}
                        </span>
                        <span className="relative block truncate bg-paper/70 px-1.5 py-1 font-mono text-[10px] text-fg">
                          {t.scenes[i].name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* T1 text layers */}
                <TrackLabel name="T1" sub={t.work.text} />
                <div className="relative h-11 border-b border-line">
                  {TEXT_LAYERS.map((l, i) => {
                    const on = time >= l.from && time < l.to;
                    return (
                      <span
                        key={i}
                        className={cx(
                          'absolute inset-y-2.5 flex items-center overflow-hidden rounded-[2px] border px-1 font-mono text-[9px] transition-colors duration-200',
                          on ? 'border-fg bg-fg/15 text-fg' : l.display ? 'border-fg/40 text-dim' : 'border-line-strong text-faint',
                        )}
                        style={{ left: pct(l.from), width: pct(l.to - l.from) }}
                        title={l.text}
                      >
                        <span className="truncate">{l.text}</span>
                      </span>
                    );
                  })}
                </div>

                {/* A1 waveform */}
                <TrackLabel name="A1" sub={t.work.audio} />
                <div className="relative flex h-14 items-center gap-px px-px">
                  {(wave as number[]).map((v, i) => {
                    const passed = i / wave.length < progress;
                    return (
                      <span
                        key={i}
                        className={cx('min-w-0 flex-1 rounded-[1px]', passed ? 'bg-magenta/90' : 'bg-magenta/30')}
                        style={{ height: `${Math.max(6, v * 92)}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* shared playhead across tracks */}
              <div className="pointer-events-none absolute bottom-0 left-[64px] right-0 top-[45px] sm:left-[84px]">
                <div className="absolute inset-0" style={{ transform: `translateX(${progress * 100}%)` }}>
                  <span className="absolute inset-y-0 left-0 w-px bg-sky shadow-[0_0_10px_rgb(34_174_245/0.6)]" />
                  <span className="absolute -top-px left-0 size-[9px] -translate-x-1/2 bg-sky [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]" />
                </div>
              </div>
            </div>

            {/* Scene detail */}
            {shownScene >= 0 && (
              <div key={shownScene} className="fade-up mt-4 grid gap-4 rounded-[3px] border border-line bg-panel p-5 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                    {timecode(SCENES[shownScene].from * MARINA.fps, MARINA.fps)} → {timecode(SCENES[shownScene].to * MARINA.fps, MARINA.fps)}
                  </div>
                  <h3 className="mt-2 text-[22px] font-medium tracking-[-0.02em]">{t.scenes[shownScene].name}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.55] text-dim">{t.scenes[shownScene].note}</p>
                </div>
                <pre className="self-end overflow-x-auto rounded-[2px] border border-line bg-paper px-4 py-3 font-mono text-[12px] leading-[1.6] text-dim">
                  <span className="text-sky-ink">{'<Sequence'}</span> <span className="text-fg">from</span>={'{'}
                  <span className="text-magenta">{Math.round(SCENES[shownScene].from * MARINA.fps)}</span>
                  {'}'} <span className="text-fg">durationInFrames</span>={'{'}
                  <span className="text-magenta">{Math.round((SCENES[shownScene].to - SCENES[shownScene].from) * MARINA.fps)}</span>
                  {'}'}
                  <span className="text-sky-ink">{'>'}</span>
                  {'\n  '}
                  <span className="text-fg">{`<${SCENES[shownScene].component} />`}</span>
                  {'\n'}
                  <span className="text-sky-ink">{'</Sequence>'}</span>
                </pre>
              </div>
            )}
            <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{t.work.hintTrack}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TrackLabel({ name, sub }: { name: string; sub: string }) {
  return (
    <div className="flex flex-col justify-center border-b border-r border-line px-2.5 font-mono sm:px-3">
      <span className="text-[11px] text-fg">{name}</span>
      <span className="truncate text-[9.5px] uppercase tracking-[0.12em] text-faint">{sub}</span>
    </div>
  );
}
