export const MARINA = {
  src: '/media/marina-park-v3.mp4',
  poster: '/media/marina-park-v3-poster.jpg',
  strip: '/media/marina-park-v3-strip.jpg',
  stripFrames: 40, // one thumbnail per second
  duration: 40,
  fps: 30,
};

/** On-screen type layers (kept in the original Romanian). */
export const TEXT_LAYERS: { from: number; to: number; text: string; display?: boolean }[] = [
  { from: 1, to: 3.4, text: 'MARINA PARK', display: true },
  { from: 7.5, to: 11, text: 'stil dobrogean' },
  { from: 15.5, to: 18, text: 'bungalouri' },
  { from: 19, to: 21.3, text: 'cafea, umbră' },
  { from: 21.5, to: 22.3, text: 'sub stuf…' },
  { from: 22.6, to: 23.8, text: '…la soare' },
  { from: 24, to: 25.2, text: 'STAI.', display: true },
  { from: 25.4, to: 27, text: 'RESPIRĂ.', display: true },
  { from: 28.6, to: 31, text: 'CALD. LIBER.', display: true },
  { from: 31.2, to: 34.8, text: 'VAMA.', display: true },
  { from: 35.8, to: 40, text: 'Vama Veche' },
];
