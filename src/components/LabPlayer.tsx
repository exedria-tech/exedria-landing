import type { RefObject } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { SpringCard, type SpringCardProps } from '../compositions/SpringCard';

/** The motion lab's player, lazy-loaded so Remotion stays off the page's critical path. */
export default function LabPlayer({
  playerRef,
  inputProps,
  durationInFrames,
  width,
  height,
  fps,
  autoPlay,
}: {
  playerRef: RefObject<PlayerRef | null>;
  inputProps: SpringCardProps;
  durationInFrames: number;
  width: number;
  height: number;
  fps: number;
  autoPlay: boolean;
}) {
  return (
    <Player
      ref={playerRef}
      component={SpringCard}
      inputProps={inputProps}
      durationInFrames={durationInFrames}
      compositionWidth={width}
      compositionHeight={height}
      fps={fps}
      autoPlay={autoPlay}
      loop
      controls={false}
      clickToPlay={false}
      initiallyMuted
      numberOfSharedAudioTags={0}
      acknowledgeRemotionLicense
      style={{ width: '100%', height: '100%' }}
    />
  );
}
