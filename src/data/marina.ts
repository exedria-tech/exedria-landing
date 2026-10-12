export const MARINA = {
  src: 'media/marina-park.mp4',
  poster: 'media/marina-park-poster.jpg',
  strip: 'media/marina-park-strip.jpg',
  stripFrames: 40, // one thumbnail per second
  duration: 40,
  fps: 30,
};

/** Scene cuts in seconds, read off the delivered cut. */
export const SCENES: { from: number; to: number; component: string }[] = [
  { from: 0, to: 3.5, component: 'Logo' },
  { from: 3.5, to: 7, component: 'Casa' },
  { from: 7, to: 11, component: 'Casute' },
  { from: 11, to: 15, component: 'Foisor' },
  { from: 15, to: 18.5, component: 'Soare' },
  { from: 18.5, to: 27, component: 'RuloteCorturi' },
  { from: 27, to: 35, component: 'Marea' },
  { from: 35, to: 40, component: 'Final' },
];

/** On-screen type layers (kept in the original Romanian). */
export const TEXT_LAYERS: { from: number; to: number; text: string; display?: boolean }[] = [
  { from: 1, to: 3.4, text: 'MARINA PARK', display: true },
  { from: 4.4, to: 7, text: 'stil dobrogean' },
  { from: 8, to: 11, text: 'bungalouri' },
  { from: 12.8, to: 14.9, text: 'cafea, umbră' },
  { from: 15, to: 15.9, text: 'sub stuf…' },
  { from: 16.4, to: 18.4, text: '…la soare' },
  { from: 23.4, to: 24.4, text: 'STAI.', display: true },
  { from: 24.5, to: 26.8, text: 'RESPIRĂ.', display: true },
  { from: 28.6, to: 31, text: 'CALD. LIBER.', display: true },
  { from: 31.2, to: 34.8, text: 'VAMA.', display: true },
  { from: 35.8, to: 40, text: 'Vama Veche' },
];
