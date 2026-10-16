import type { ComponentType } from 'react';
import type { IslandName } from './registry';

/** When an island hydrates: right away, once the browser is idle, or as it nears the viewport. */
export type When = 'load' | 'idle' | 'visible';

/**
 * A component that is prerendered like the rest of the page and then hydrated on its own in the
 * browser (src/islands/hydrate.tsx). Everything outside islands stays static HTML and ships no JS.
 * Props travel as JSON. The wrapper is display: contents, so it does not affect layout.
 */
export function Island<P extends object>({
  name,
  component: C,
  props,
  when = 'visible',
}: {
  name: IslandName;
  component: ComponentType<P>;
  props?: P;
  when?: When;
}) {
  return (
    <div data-island={name} data-when={when} data-props={props ? JSON.stringify(props) : undefined} className="contents">
      <C {...(props ?? ({} as P))} />
    </div>
  );
}
