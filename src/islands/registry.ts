import type { ComponentType } from 'react';

// Islands take different props (checked where <Island> is used), so the registry erases them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;
type Loader = () => Promise<{ default: AnyComponent }>;
const named = <K extends string>(load: () => Promise<Record<K, unknown>>, key: K): Loader => () =>
  load().then((m) => ({ default: m[key] as AnyComponent }));

/** Every island, by the name its <Island> carries in the HTML. Each loads as its own chunk. */
export const ISLANDS = {
  services: named(() => import('../components/Services'), 'ServiceCards'),
  lab: named(() => import('../components/Lab'), 'Lab'),
  webspeed: named(() => import('../components/WebSpeed'), 'WebSpeedPanel'),
  payload: named(() => import('../components/PayloadSync'), 'PayloadSync'),
  portfolio: named(() => import('../pages/Portfolio'), 'Portfolio'),
  reel: named(() => import('./CaseReel'), 'CaseReel'),
  contact: named(() => import('../components/Contact'), 'ContactForm'),
} satisfies Record<string, Loader>;

export type IslandName = keyof typeof ISLANDS;
