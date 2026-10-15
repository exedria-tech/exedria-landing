import { useSyncExternalStore, type ReactNode } from 'react';

const noop = () => () => {};

/**
 * False on the server and while hydrating prerendered HTML, true afterwards (and on fresh client
 * renders). Lets browser-only widgets (Remotion players, canvases) mount after hydration.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return useHydrated() ? children : fallback;
}
