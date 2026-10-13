import { useEffect, useRef, type CSSProperties } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { HERO, HeroField } from '../compositions/HeroField';
import { useT } from '../i18n';
import { Button } from './ui';

const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Hero() {
  const { t } = useT();
  const playerRef = useRef<PlayerRef>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1440px] flex-col justify-between px-4 pb-14 pt-8 md:pb-20 sm:px-8 md:pt-12">
        <span />
        <div>
          <div className="grid items-end gap-10 md:px-6 lg:grid-cols-12">
            <h1 className="font-semibold leading-[0.86] tracking-[-0.055em] text-fg lg:col-span-8" style={{ fontSize: 'clamp(56px, 9.2vw, 140px)' }}>
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
                <Button href="/contact">{t.hero.ctaPrimary}</Button>
                <Button href="#work" variant="ghost">
                  {t.hero.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
