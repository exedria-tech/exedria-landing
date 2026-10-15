import { useEffect, useRef } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { HERO, HeroField } from '../compositions/HeroField';

const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The hero composition; plays only while on screen. Lazy-loaded so Remotion stays out of the main bundle. */
export default function HeroPlayer() {
  const playerRef = useRef<PlayerRef>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
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
    <div ref={wrap} className="h-full w-full">
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
  );
}
