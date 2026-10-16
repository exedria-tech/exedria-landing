/**
 * Markup for the hero's dot ribbon: the box the 16:9 composition is cover-scaled into, and the canvas
 * src/behaviors/hero.ts draws it on (WebGL).
 */
export function HeroCanvas() {
  return (
    <>
      <div
        data-hero-box
        className="absolute left-1/2 top-1/2"
        style={{ width: 'max(100%, calc((100svh - 4rem) * 16 / 9))', aspectRatio: '16 / 9', transform: 'translate(-50%, -50%)' }}
      />
      <canvas data-hero-canvas className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" />
    </>
  );
}
