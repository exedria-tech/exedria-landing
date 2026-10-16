import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { LangProvider } from '../i18n';
import type { Lang } from '../lang';
import { ISLANDS, type IslandName } from './registry';

/** Loads one island's code and hydrates its prerendered HTML. React itself loads with the first island. */
export async function hydrate(el: HTMLElement, lang: Lang) {
  const load = ISLANDS[el.dataset.island as IslandName];
  if (!load) return;
  const { default: C } = await load();
  const props = el.dataset.props ? JSON.parse(el.dataset.props) : {};
  hydrateRoot(
    el,
    <StrictMode>
      <LangProvider lang={lang}>
        <C {...props} />
      </LangProvider>
    </StrictMode>,
  );
}
