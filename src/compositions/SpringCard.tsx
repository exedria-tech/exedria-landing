import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type SpringCardProps = {
  damping: number;
  mass: number;
  stiffness: number;
  business: string;
  offer: string;
  kicker: string;
};

export { FORMATS, LAB_SECONDS, type Format } from './labFormats';

/** One composition, any aspect ratio: layout derives from width/height. */
export function SpringCard({ damping, mass, stiffness, business, offer, kicker }: SpringCardProps) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H, durationInFrames } = useVideoConfig();
  const config = { damping, mass, stiffness };
  const s = spring({ frame, fps, config });
  const s2 = spring({ frame: frame - Math.round(fps * 0.18), fps, config });

  const u = Math.min(W, H) / 100;
  const portrait = H > W * 1.2;
  const wide = W > H * 1.2;

  // Card area vs graph area
  const graph = wide
    ? { x: W * 0.58, y: H * 0.18, w: W * 0.36, h: H * 0.64 }
    : { x: W * 0.08, y: H * (portrait ? 0.66 : 0.64), w: W * 0.84, h: H * (portrait ? 0.24 : 0.28) };
  const cardCx = wide ? W * 0.3 : W / 2;
  const cardCy = wide ? H / 2 : H * (portrait ? 0.34 : 0.32);
  const cardW = wide ? W * 0.42 : W * 0.84;

  // Sample the whole curve once per frame of the composition.
  const samples = Array.from({ length: durationInFrames }, (_, f) => spring({ frame: f, fps, config }));
  const maxV = Math.max(1.15, ...samples);
  const gx = (f: number) => graph.x + (f / (durationInFrames - 1)) * graph.w;
  const gy = (v: number) => graph.y + graph.h - (v / maxV) * graph.h;
  const path = samples.map((v, f) => `${f === 0 ? 'M' : 'L'}${gx(f).toFixed(1)},${gy(v).toFixed(1)}`).join(' ');

  return (
    <AbsoluteFill
      style={{
        background: '#ffffff',
        backgroundImage:
          'linear-gradient(to right, rgba(11,18,32,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,18,32,0.05) 1px, transparent 1px)',
        backgroundSize: `${u * 8}px ${u * 8}px`,
        fontFamily: '"Geist Variable", system-ui, sans-serif',
        color: '#0b1220',
      }}
    >

      {/* Card */}
      <div
        style={{
          position: 'absolute',
          left: cardCx - cardW / 2,
          top: cardCy,
          width: cardW,
          transform: `translateY(calc(-50% + ${(1 - s) * H * 0.35}px)) scale(${interpolate(s, [0, 1], [0.86, 1])})`,
          opacity: Math.min(1, Math.max(0, s * 1.6)),
          background: '#f5f7fa',
          border: '1px solid #dce3eb',
          borderRadius: u * 0.5,
          padding: u * 5,
        }}
      >
        <div
          style={{
            fontFamily: '"Geist Mono Variable", monospace',
            fontSize: u * 2.6,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#0673b0',
          }}
        >
          ◆ {kicker}
        </div>
        <div
          style={{
            marginTop: u * 2.2,
            fontSize: u * (wide ? 8 : 9),
            fontWeight: 600,
            letterSpacing: '-0.045em',
            lineHeight: 0.95,
            overflowWrap: 'anywhere',
          }}
        >
          {business || '—'}
        </div>
        <div
          style={{
            marginTop: u * 3.5,
            display: 'inline-block',
            background: '#e0179e',
            color: '#ffffff',
            fontSize: u * 4,
            fontWeight: 600,
            padding: `${u * 1.2}px ${u * 2.4}px`,
            borderRadius: u * 0.4,
            transform: `translateX(${(1 - s2) * -u * 30}px)`,
            opacity: Math.min(1, Math.max(0, s2 * 1.6)),
          }}
        >
          {offer || '—'}
        </div>
      </div>

      {/* Curve */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={graph.x} x2={graph.x + graph.w} y1={gy(1)} y2={gy(1)} stroke="#8a95a3" strokeDasharray="4 6" />
        <line x1={graph.x} x2={graph.x + graph.w} y1={gy(0)} y2={gy(0)} stroke="#b8c3d0" />
        <path d={path} fill="none" stroke="#22aef5" strokeWidth={Math.max(1.5, u * 0.3)} />
        {samples.map((v, f) => (
          <rect
            key={f}
            x={gx(f) - u * 0.35}
            y={gy(v) - u * 0.35}
            width={u * 0.7}
            height={u * 0.7}
            fill={f <= frame ? '#22aef5' : '#d4dbe4'}
          />
        ))}
        <line x1={gx(frame)} x2={gx(frame)} y1={graph.y} y2={graph.y + graph.h} stroke="#e0179e" strokeWidth={1} />
        <rect x={gx(frame) - u * 0.9} y={gy(samples[frame] ?? 1) - u * 0.9} width={u * 1.8} height={u * 1.8} fill="#e0179e" />
      </svg>
    </AbsoluteFill>
  );
}
