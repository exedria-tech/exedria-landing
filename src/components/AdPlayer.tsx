import { useEffect, useRef } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { AD_FPS, AD_FRAMES, OfferAd } from '../compositions/OfferAd';
import type { Payload } from './PayloadSync';
import { timecode } from './ui';

/* [B] The Remotion composition, fed the same payload as inputProps. It keeps playing while props change. */
export default function AdPlayer({ data, left }: { data: Payload; left: string }) {
  const player = useRef<PlayerRef>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const p = player.current;
    const el = wrap.current;
    if (!p || !el) return;
    const onFrame = (e: { detail: { frame: number } }) => {
      const f = e.detail.frame;
      if (bar.current) bar.current.style.transform = `scaleX(${(f + 1) / AD_FRAMES})`;
      if (tc.current) tc.current.textContent = timecode(f, AD_FPS);
    };
    p.addEventListener('frameupdate', onFrame);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? p.play() : p.pause()));
    io.observe(el);
    return () => {
      p.removeEventListener('frameupdate', onFrame);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="flex flex-1 flex-col items-center justify-center bg-paper p-5">
      <div className="w-[min(100%,236px)] border border-line-strong bg-fg sm:w-[216px] xl:w-[236px]">
        <div className="aspect-[9/16] w-full">
          <Player
            ref={player}
            component={OfferAd}
            inputProps={{ ...data, stockLabel: left }}
            durationInFrames={AD_FRAMES}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={AD_FPS}
            autoPlay
            loop
            controls={false}
            clickToPlay={false}
            initiallyMuted
            numberOfSharedAudioTags={0}
            acknowledgeRemotionLicense
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {/* Timeline */}
        <div className="border-t border-white/10 px-2.5 py-2">
          <div className="h-[2px] bg-white/15">
            <div ref={bar} className="h-full origin-left bg-sky" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9.5px] tabular-nums text-white/55">
            <span ref={tc}>00:00:00:00</span>
            <span>{AD_FPS} fps · 1080×1920</span>
          </div>
        </div>
      </div>
    </div>
  );
}
