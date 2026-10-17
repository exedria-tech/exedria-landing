import type { AnchorHTMLAttributes } from 'react';
import { useT } from '../i18n';
import { localize } from '../lang';

/** A link to a page of the site, in the current page's language. Every page is its own HTML file. */
export function A({ to, ...rest }: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }) {
  const { lang } = useT();
  return <a href={localize(to, lang)} {...rest} />;
}
