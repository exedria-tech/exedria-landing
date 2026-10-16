export type MultiFormatProps = { product: string; price: string; badge: string; cta: string };

export const MF_FPS = 60;
/** Frames until every element has settled. */
export const MF_FRAMES = 60;

export const MF_SIZES = {
  '9:16': { width: 540, height: 960 },
  '1:1': { width: 720, height: 720 },
  '16:9': { width: 960, height: 540 },
} as const;

const INK = '#0b1220';
const SKY_INK = '#0673b0';
const MAGENTA = '#e0179e';
const LINE = 'rgba(11,18,32,0.18)';

/**
 * Remotion's spring() from 0 to 1 (damping 15, stiffness 140, mass 0.6), in closed form. The card on
 * the home page draws this composition without Remotion, so the library stays off that page.
 */
function spring(frame: number, fps: number) {
  const t = Math.max(0, frame) / fps;
  const zeta = 15 / (2 * Math.sqrt(140 * 0.6));
  const w0 = Math.sqrt(140 / 0.6);
  const w1 = w0 * Math.sqrt(1 - zeta ** 2);
  return 1 - Math.exp(-zeta * w0 * t) * (((zeta * w0) / w1) * Math.sin(w1 * t) + Math.cos(w1 * t));
}

/**
 * One offer, any aspect ratio: the layout is derived from width/height, the content from props.
 * Frame 0 is the bare wireframe (dashed slots); each slot then fills in on a spring, staggered.
 */
export function MultiFormat({ product, price, badge, cta, frame, width: W, height: H }: MultiFormatProps & { frame: number; width: number; height: number }) {
  const u = Math.min(W, H) / 100;
  const portrait = H > W * 1.2;
  const wide = W > H * 1.2;
  const s = (i: number) => spring(frame - i * 5, MF_FPS);

  // A slot: dashed outline always, content revealed left-to-right by its spring.
  const Slot = ({ i, style, fill, children }: { i: number; style: React.CSSProperties; fill?: string; children: React.ReactNode }) => {
    const p = s(i);
    return (
      <div style={{ position: 'relative', outline: `${u * 0.35}px dashed ${LINE}`, outlineOffset: u * 0.6, ...style }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: fill,
            transformOrigin: 'left center',
            transform: `scaleX(${p})`,
          }}
        />
        <div style={{ position: 'relative', opacity: Math.min(1, p * 1.4), whiteSpace: 'nowrap', overflow: 'hidden' }}>{children}</div>
      </div>
    );
  };

  const visual = (
    <Slot i={0} fill="rgba(34,174,245,0.12)" style={{ width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          height: '100%',
          backgroundImage: 'radial-gradient(rgba(34,174,245,0.9) 1.4px, transparent 1.8px)',
          backgroundSize: `${u * 4}px ${u * 4}px`,
        }}
      />
    </Slot>
  );
  const badgeEl = (
    <Slot i={1} fill={MAGENTA} style={{ alignSelf: 'flex-start', padding: `${u * 1.6}px ${u * 3}px` }}>
      <span style={{ color: '#fff', fontSize: u * 4.2, fontWeight: 700, letterSpacing: '0.06em' }}>{badge}</span>
    </Slot>
  );
  const titleEl = (
    <Slot i={2} style={{ alignSelf: 'flex-start', maxWidth: '100%' }}>
      <span style={{ display: 'block', fontSize: u * (wide ? 8 : 7.5), fontWeight: 600, letterSpacing: '-0.035em', color: INK, textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {product}
      </span>
    </Slot>
  );
  const priceEl = (
    <Slot i={3} style={{ alignSelf: 'flex-start' }}>
      <span style={{ display: 'block', fontSize: u * (portrait ? 13 : 12), fontWeight: 700, letterSpacing: '-0.05em', color: SKY_INK, lineHeight: 1 }}>{price}</span>
    </Slot>
  );
  const ctaEl = (
    <Slot i={4} fill={INK} style={{ alignSelf: portrait ? 'stretch' : 'flex-start', padding: `${u * 2.6}px ${u * 4.4}px`, textAlign: 'center' }}>
      <span style={{ color: '#fff', fontSize: u * 4.4, fontWeight: 600 }}>{cta} →</span>
    </Slot>
  );

  const pad = u * 8;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#ffffff',
        backgroundImage: `linear-gradient(to right, rgba(11,18,32,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,18,32,0.05) 1px, transparent 1px)`,
        backgroundSize: `${u * 8}px ${u * 8}px`,
        fontFamily: '"Geist Variable", system-ui, sans-serif',
        padding: pad,
        display: 'flex',
        flexDirection: wide ? 'row' : 'column',
        gap: u * (wide ? 7 : 5),
      }}
    >
      {portrait && (
        <>
          <div style={{ flex: '0 0 34%' }}>{visual}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: u * 4, flex: 1 }}>
            {badgeEl}
            {titleEl}
            {priceEl}
            <div style={{ marginTop: 'auto' }}>{ctaEl}</div>
          </div>
        </>
      )}
      {!portrait && !wide && (
        <>
          <div style={{ display: 'flex', gap: u * 5, flex: '0 0 38%' }}>
            <div style={{ flex: 1 }}>{visual}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>{badgeEl}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: u * 4, flex: 1 }}>
            {titleEl}
            {priceEl}
            <div style={{ marginTop: 'auto' }}>{ctaEl}</div>
          </div>
        </>
      )}
      {wide && (
        <>
          <div style={{ flex: '0 0 36%' }}>{visual}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: u * 4, flex: 1, minWidth: 0 }}>
            {badgeEl}
            {titleEl}
            {priceEl}
            <div style={{ marginTop: 'auto' }}>{ctaEl}</div>
          </div>
        </>
      )}
    </div>
  );
}
