import type { Category } from './projects';

/**
 * The services, in the order of t.services.items. `slug` is the chapter anchor on /servicii and the
 * ?serviciu= value the contact form understands; `category` filters /lucrari.
 */
export const SERVICES: { slug: string; category: Category }[] = [
  { slug: 'video', category: 'video' },
  { slug: 'web', category: 'web' },
  { slug: 'api', category: 'software' },
];
