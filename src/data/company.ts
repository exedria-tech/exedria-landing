/**
 * Company details shown in the footer, on /contact and in the legal pages.
 * Values in [brackets] are placeholders: fill them in before going live.
 */
export const COMPANY = {
  brand: 'Exedria',
  legalName: '[Denumire firmă SRL]',
  cui: '[CUI]',
  regCom: '[J00/0000/2026]',
  address: '[Adresa sediului social]',
  email: 'hello@exedria.tech',
  domain: 'exedria.tech',
};

export const EMAIL = COMPANY.email;

/** Date shown as "last updated" on the legal pages. */
export const LEGAL_UPDATED = '12.10.2026';

export const isPlaceholder = (v: string) => v.startsWith('[');
