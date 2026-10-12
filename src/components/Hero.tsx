import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { HERO, HeroField } from '../compositions/HeroField';
import { useT } from '../i18n';
import { Transport } from './Transport';
import { Button, Corners, timecode } from './ui';

const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function usePlayerFrame(ref: React.RefObject<PlayerRef | null>) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const cb = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    p.addEventListener('frameupdate', cb);
    p.addEventListener('seeked', cb);
    return () => {
      p.removeEventListener('frameupdate', cb);
      p.removeEventListener('seeked', cb);
    };
  }, [ref]);
  return frame;
}

export function Hero() {
  const { t } = useT();
  const playerRef = useRef<PlayerRef>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const frame = usePlayerFrame(playerRef);

  // Pause the composition while the hero is off screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const io = new IntersectionObserver(([e]) => {
      const p = playerRef.current;
      if (!p) return;
      if (e.isIntersecting) p.play();
      else p.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="top" ref={sectionRef} className="subgrid relative min-h-[100svh] overflow-hidden pt-16">
      {/* Composition layer, cover-scaled */}
      <div className="absolute inset-x-0 bottom-0 top-16 overflow-hidden opacity-75 md:opacity-100" aria-hidden>
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 'max(100%, calc((100svh - 4rem) * 16 / 9))',
            aspectRatio: '16 / 9',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Player
            ref={playerRef}
            component={HeroField}
            durationInFrames={HERO.durationInFrames}
            compositionWidth={HERO.width}
            compositionHeight={HERO.height}
            fps={HERO.fps}
            autoPlay={!reducedMotion}
            loop
            controls={false}
            clickToPlay={false}
            doubleClickToFullscreen={false}
            spaceKeyToPlayOrPause={false}
            initiallyMuted
            numberOfSharedAudioTags={0}
            acknowledgeRemotionLicense
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {/* readability falloff under the headline */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-paper)_30%,transparent_75%)] md:bg-[linear-gradient(to_top,var(--color-paper)_0%,transparent_38%)]" />
      </div>

      {/* Safe-zone guide */}
      <div className="pointer-events-none absolute inset-x-4 bottom-[132px] top-[84px] hidden border border-dashed border-fg/[0.12] sm:inset-x-8 md:block" aria-hidden>
        <Corners className="text-fg/30" size={12} />
        <span className="absolute -top-[9px] right-6 bg-paper px-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-faint">
          title safe · 90%
        </span>
        <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-fg/15" />
        <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-fg/15" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1440px] flex-col justify-between px-4 pb-6 pt-8 sm:px-8 md:pt-12">
        <div className="flex flex-wrap items-start justify-between gap-4 md:px-6">
          <div className="font-mono text-[11px] uppercase leading-[1.7] tracking-[0.18em] text-dim">
            <div>{t.hero.metaA}</div>
            <div className="text-faint">{t.hero.metaB}</div>
          </div>
          <div className="flex flex-col items-end gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-2 rounded-[2px] border border-line-strong bg-paper/80 px-2.5 py-1.5 text-dim">
              <span className="blink size-1.5 bg-phosphor" />
              {'{ status: '}
              <span className="text-phosphor">"{t.hero.status}"</span>
              {' }'}
            </span>
            <span className="rounded-[2px] bg-paper/80 px-1.5 py-0.5 tabular-nums text-dim">
              [{timecode(frame, HERO.fps)}] · {HERO.width}×{HERO.height}
            </span>
          </div>
        </div>

        <div>
          <div className="grid items-end gap-10 md:px-6 lg:grid-cols-12">
            <h1 className="font-semibold leading-[0.86] tracking-[-0.055em] text-fg lg:col-span-8" style={{ fontSize: 'clamp(56px, 10.4vw, 172px)' }}>
              <span className="line-mask">
                <span style={{ '--d': '80ms' } as CSSProperties}>{t.hero.line1}</span>
              </span>
              <span className="line-mask">
                <span style={{ '--d': '200ms' } as CSSProperties}>
                  {t.hero.line2}
                  <span className="ml-[0.06em] inline-block h-[0.72em] w-[0.08em] translate-y-[0.04em] bg-magenta align-baseline [animation:caret_1.1s_steps(1)_infinite]" />
                </span>
              </span>
            </h1>
            <div className="max-w-[420px] pb-2 lg:col-span-4 lg:justify-self-end">
              <p className="fade-up text-[16.5px] leading-[1.6] text-dim" style={{ '--d': '420ms' } as CSSProperties}>
                {t.hero.lead}
              </p>
              <div className="fade-up mt-7 flex flex-wrap gap-3" style={{ '--d': '520ms' } as CSSProperties}>
                <Button href="#contact">{t.hero.ctaPrimary}</Button>
                <Button href="#work" variant="ghost">
                  {t.hero.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-14">
            <Transport playerRef={playerRef} durationInFrames={HERO.durationInFrames} fps={HERO.fps} markers={[0, 75, 150, 225]} />
            <p className="mt-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
              <span className="text-sky-ink">↔</span> {t.hero.scrubHint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
