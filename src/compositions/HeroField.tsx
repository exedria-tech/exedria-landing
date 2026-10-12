import { useEffect, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const HERO = { width: 1600, height: 900, fps: 30, durationInFrames: 300 };

const STEP = 12;
const LEVELS = 6;

/**
 * A dot-matrix ribbon rendered purely from the frame number.
 * Same frame in, same pixels out: scrubbing, looping and server rendering all agree.
 */
export function HeroField() {
  const frame = useCurrentFrame();
  const { width: W, height: H, durationInFrames } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    const t = (frame / durationInFrames) * Math.PI * 2; // loops seamlessly
    const scanX = ((frame / durationInFrames) * 1.3 - 0.15) * W;

    ctx.clearRect(0, 0, W, H);

    // Buckets so each colour/size is one fill call.
    const sky: Path2D[] = Array.from({ length: LEVELS }, () => new Path2D());
    const hot: Path2D[] = Array.from({ length: LEVELS }, () => new Path2D());
    const base = new Path2D();

    for (let x = STEP / 2; x < W; x += STEP) {
      const u = x / W;
      // Ribbon rises from bottom-left to top-right and breathes with t.
      const center =
        H * 0.98 -
        u * H * 0.95 +
        Math.sin(u * 5.2 + t) * 70 +
        Math.sin(u * 11.0 - t * 2) * 22;
      const width = 70 + 55 * Math.sin(u * 3.1 + t) ** 2 + u * 40;
      const twist = Math.cos(u * 7.0 - t) * 0.5 + 0.5;
      const centerB = center - 120 - 60 * Math.sin(u * 4 - t);

      for (let y = STEP / 2; y < H; y += STEP) {
        const d = (y - center) / width;
        const dB = (y - centerB) / (width * 0.55);
        let v = Math.exp(-d * d) * (0.55 + 0.45 * twist) + Math.exp(-dB * dB) * 0.35 * (1 - twist);
        // fade the ribbon in from the left so the headline stays readable
        v *= Math.min(1, Math.max(0, (u - 0.08) * 2.4));
        if (v < 0.06) {
          base.rect(x - 0.75, y - 0.75, 1.5, 1.5);
          continue;
        }
        const lvl = Math.min(LEVELS - 1, Math.floor(v * LEVELS));
        const size = 2 + (lvl / (LEVELS - 1)) * (STEP - 4);
        const nearScan = Math.abs(x - scanX) < 26;
        (nearScan ? hot : sky)[lvl].rect(x - size / 2, y - size / 2, size, size);
      }
    }

    ctx.fillStyle = 'rgba(11,18,32,0.12)';
    ctx.fill(base);
    for (let i = 0; i < LEVELS; i++) {
      const a = 0.34 + (i / (LEVELS - 1)) * 0.66;
      ctx.fillStyle = `rgba(34,174,245,${a})`;
      ctx.fill(sky[i]);
      ctx.fillStyle = `rgba(224,23,158,${Math.min(1, a + 0.15)})`;
      ctx.fill(hot[i]);
    }

    // render scan column
    ctx.fillStyle = 'rgba(224,23,158,0.6)';
    ctx.fillRect(Math.round(scanX), 0, 1, H);
  }, [frame, W, H, durationInFrames]);

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      <canvas ref={ref} width={W} height={H} style={{ width: '100%', height: '100%' }} />
    </AbsoluteFill>
  );
}
