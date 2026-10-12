import { useEffect, useRef, useState, type RefObject } from 'react';
import type { PlayerRef } from '@remotion/player';
import { cx, timecode } from './ui';

/**
 * Editor-style transport for a Remotion <Player>: play/pause, timecode,
 * and a ruler you can scrub. The playhead moves with transform only.
 */
export function Transport({
  playerRef,
  durationInFrames,
  fps,
  markers = [],
  className,
  showFrameCount = true,
}: {
  playerRef: RefObject<PlayerRef | null>;
  durationInFrames: number;
  fps: number;
  markers?: number[];
  className?: string;
  showFrameCount?: boolean;
}) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);
  const wasPlaying = useRef(false);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    p.addEventListener('frameupdate', onFrame);
    p.addEventListener('seeked', onFrame);
    p.addEventListener('play', onPlay);
    p.addEventListener('pause', onPause);
    setPlaying(p.isPlaying());
    return () => {
      p.removeEventListener('frameupdate', onFrame);
      p.removeEventListener('seeked', onFrame);
      p.removeEventListener('play', onPlay);
      p.removeEventListener('pause', onPause);
    };
  }, [playerRef, durationInFrames, fps]);

  const frameAt = (clientX: number) => {
    const r = rulerRef.current!.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    return Math.round(p * (durationInFrames - 1));
  };

  const onDown = (e: React.PointerEvent) => {
    const p = playerRef.current;
    if (!p) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    wasPlaying.current = p.isPlaying();
    p.pause();
    setScrubbing(true);
    const f = frameAt(e.clientX);
    p.seekTo(f);
    setFrame(f);
  };
  const onMove = (e: React.PointerEvent) => {
    const f = frameAt(e.clientX);
    setHover(f);
    if (scrubbing) {
      playerRef.current?.seekTo(f);
      setFrame(f);
    }
  };
  const onUp = () => {
    if (!scrubbing) return;
    setScrubbing(false);
    if (wasPlaying.current) playerRef.current?.play();
  };

  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isPlaying()) p.pause();
    else p.play();
  };

  const seconds = Math.ceil(durationInFrames / fps);
  const progress = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;

  return (
    <div className={cx('flex items-stretch gap-3 font-mono text-[11px] text-dim', className)}>
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Play'}
        className="grid w-10 shrink-0 place-items-center rounded-[3px] border border-line-strong bg-panel text-fg transition-transform duration-300 ease-[var(--ease-spring)] hover:border-sky/60 active:scale-90"
      >
        {playing ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <rect x="0" y="0" width="3" height="12" />
            <rect x="7" y="0" width="3" height="12" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <path d="M0 0 L10 6 L0 12 Z" />
          </svg>
        )}
      </button>

      <div className="hidden w-[104px] shrink-0 flex-col justify-center sm:flex">
        <span className="tabular-nums text-fg">{timecode(frame, fps)}</span>
        {showFrameCount && (
          <span className="tabular-nums text-faint">
            f {String(frame).padStart(4, '0')} / {String(durationInFrames).padStart(4, '0')}
          </span>
        )}
      </div>

      <div
        ref={rulerRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={() => setHover(null)}
        className="relative h-11 flex-1 cursor-ew-resize touch-none select-none rounded-[3px] border border-line bg-panel/80"
        role="slider"
        aria-label="Timeline"
        aria-valuemin={0}
        aria-valuemax={durationInFrames - 1}
        aria-valuenow={frame}
      >
        {/* ticks */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox={`0 0 ${durationInFrames} 44`}>
          {Array.from({ length: Math.floor(durationInFrames / (fps / 2)) + 1 }, (_, i) => {
            const x = i * (fps / 2);
            const major = i % 2 === 0;
            return (
              <line
                key={i}
                x1={x}
                x2={x}
                y1={0}
                y2={major ? 12 : 6}
                stroke={major ? '#9aa6b4' : '#cdd5df'}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {/* filled progress, scaled not resized */}
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-sky/70" style={{ transform: `scaleX(${progress})` }} />
        {Array.from({ length: seconds + 1 }, (_, s) =>
          s % (seconds > 12 ? 5 : 1) === 0 && s * fps < durationInFrames ? (
            <span
              key={s}
              className="pointer-events-none absolute top-3 -translate-x-1/2 text-[9.5px] text-faint first:translate-x-0"
              style={{ left: `${((s * fps) / (durationInFrames - 1)) * 100}%`, marginLeft: s === 0 ? 4 : 0 }}
            >
              {s}s
            </span>
          ) : null,
        )}
        {markers.map((m) => (
          <span
            key={m}
            className="pointer-events-none absolute bottom-[7px] size-[7px] -translate-x-1/2 rotate-45 border border-magenta bg-paper"
            style={{ left: `${(m / (durationInFrames - 1)) * 100}%` }}
          />
        ))}
        {hover !== null && !scrubbing && (
          <div className="pointer-events-none absolute inset-0" style={{ transform: `translateX(${(hover / (durationInFrames - 1)) * 100}%)` }}>
            <span className="absolute inset-y-0 left-0 w-px bg-fg/25" />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translateX(${progress * 100}%)` }}
        >
          <span className="absolute -top-px left-0 h-[calc(100%+2px)] w-px bg-sky" />
          <span className="absolute -top-[5px] left-0 h-[9px] w-[9px] -translate-x-1/2 bg-sky [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]" />
        </div>
      </div>

    </div>
  );
}
