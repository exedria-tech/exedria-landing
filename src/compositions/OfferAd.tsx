import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type OfferAdProps = {
  product: string;
  price: string;
  badge: string;
  stock: number;
  stockLabel: string;
  cta: string;
};

export const AD_FPS = 60;
export const AD_FRAMES = AD_FPS * 6;

const INK = '#0b1220';
const SKY = '#22aef5';
const MAGENTA = '#e0179e';
const WARN = '#ff7a1a';

/** Fit a line of text: shrink the font as the string grows past `fits` characters. */
const fit = (text: string, base: number, fits: number, min: number) =>
  Math.max(min, Math.min(base, (base * fits) / Math.max(1, text.length)));

/**
 * A 9:16 offer ad whose text comes straight from props. Ambient motion is periodic over the
 * composition, so the loop is seamless; text springs in at the start of each loop and fades
 * out at the end. Changing props mid-loop updates the frame without restarting playback.
 */
export function OfferAd({ product, price, badge, stock, stockLabel, cta }: OfferAdProps) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H, durationInFrames: L } = useVideoConfig();
  const phase = (frame / L) * Math.PI * 2;

  const enter = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120, mass: 0.7 } });
  const out = interpolate(frame, [L - 22, L - 2], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rise = (s: number, px = 80) => `translateY(${(1 - s) * px}px)`;

  const sBadge = enter(4);
  const sName = enter(12);
  const sPrice = enter(22);
  const sStock = enter(34);
  const sCta = enter(44);

  const low = stock < 10;
  const stockColor = low ? WARN : 'rgba(255,255,255,0.72)';
  const fill = Math.min(1, Math.max(0, stock) / 100) * interpolate(sStock, [0, 1], [0, 1]);
  const pulse = (frame % fps) / fps; // one CTA ring per second

  return (
    <AbsoluteFill style={{ background: INK, overflow: 'hidden', fontFamily: '"Geist Variable", system-ui, sans-serif', color: '#fff' }}>
      {/* Drifting grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 2px, transparent 2px), linear-gradient(to bottom, rgba(255,255,255,0.06) 2px, transparent 2px)',
          backgroundSize: '120px 120px',
          backgroundPosition: `0px ${(frame / L) * 240}px`,
        }}
      />
      {/* Two light sources orbiting the price */}
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          left: W / 2 - 550 + Math.sin(phase) * 260,
          top: H * 0.42 - 550 + Math.cos(phase) * 180,
          background: `radial-gradient(circle, ${MAGENTA}66, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          left: W / 2 - 500 - Math.sin(phase) * 300,
          top: H * 0.6 - 500 - Math.cos(phase) * 160,
          background: `radial-gradient(circle, ${SKY}55, transparent 62%)`,
        }}
      />
      {/* Rotating dashed ring behind the price */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <circle
          cx={W / 2}
          cy={H * 0.5}
          r={400}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={3}
          strokeDasharray="6 22"
          transform={`rotate(${(frame / L) * 360} ${W / 2} ${H * 0.5})`}
        />
        <circle
          cx={W / 2}
          cy={H * 0.5}
          r={460}
          fill="none"
          stroke={SKY}
          strokeOpacity={0.5}
          strokeWidth={4}
          strokeDasharray={`${2 * Math.PI * 460 * 0.18} ${2 * Math.PI * 460}`}
          transform={`rotate(${-(frame / L) * 720} ${W / 2} ${H * 0.5})`}
        />
      </svg>

      <AbsoluteFill style={{ opacity: out, alignItems: 'center', padding: '0 90px' }}>
        {/* Badge */}
        <div
          style={{
            marginTop: H * 0.17,
            padding: '22px 40px',
            background: MAGENTA,
            fontSize: fit(badge, 50, 16, 30),
            fontWeight: 700,
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            maxWidth: W - 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            opacity: sBadge,
            transform: `scale(${(0.6 + 0.4 * sBadge) * (1 + 0.03 * Math.sin(phase * 6))})`,
          }}
        >
          {badge}
        </div>

        {/* Product */}
        <div
          style={{
            marginTop: 70,
            textAlign: 'center',
            fontSize: fit(product, 112, 14, 64),
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            maxWidth: W - 160,
            overflowWrap: 'anywhere',
            opacity: sName,
            transform: rise(sName),
          }}
        >
          {product}
        </div>

        {/* Price */}
        <div
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            fontSize: fit(price, 210, 7, 96),
            fontWeight: 700,
            letterSpacing: '-0.05em',
            color: SKY,
            whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums',
            opacity: sPrice,
            transform: `${rise(sPrice, 120)} translateY(${Math.sin(phase * 2) * 12}px)`,
          }}
        >
          {price}
        </div>

        {/* Stock */}
        <div style={{ width: W - 180, opacity: sStock, transform: rise(sStock, 40) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 44, fontWeight: 500, color: stockColor }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: low ? WARN : '#2fd18b',
                opacity: 0.55 + 0.45 * Math.abs(Math.cos(phase * 3)),
              }}
            />
            {stockLabel}
          </div>
          <div style={{ marginTop: 22, height: 10, background: 'rgba(255,255,255,0.14)' }}>
            <div style={{ height: '100%', width: `${fill * 100}%`, background: low ? WARN : SKY }} />
          </div>
        </div>

        {/* CTA */}
        <div style={{ position: 'relative', marginTop: 90, marginBottom: H * 0.1, opacity: sCta, transform: `scale(${0.7 + 0.3 * sCta})` }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: `4px solid ${SKY}`,
              opacity: 1 - pulse,
              transform: `scale(${1 + pulse * 0.35}, ${1 + pulse * 0.9})`,
            }}
          />
          <div
            style={{
              position: 'relative',
              padding: '36px 84px',
              background: '#fff',
              color: INK,
              fontSize: fit(cta, 56, 14, 36),
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {cta} →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
