// Plain constants, kept apart from the composition so importing them doesn't pull in Remotion.
export const FORMATS = {
  '16:9': { width: 1280, height: 720 },
  '9:16': { width: 720, height: 1280 },
  '1:1': { width: 1000, height: 1000 },
} as const;
export type Format = keyof typeof FORMATS;

export const LAB_SECONDS = 3;
