import { getDisclosure } from './disclosure.js';
import { getLanguage, translateText } from './i18n.js';

export function localizedProductName(product) {
  if (getLanguage() === 'en') return product.name;
  return `${product.model} · ${translateText(product.label)}`;
}

export function localizedPublicDescription(product) {
  const tier = getDisclosure(product).tier;
  if (tier === 'public') return translateText(product.description);
  if (tier === 'dealer') return `${translateText(product.summary)} ${translateText('Detailed specifications and commercial documents are available to qualified buyers through sales.')}`;
  return translateText('A first look at ZJ Seating’s next premium executive direction, with a refined high-back silhouette and a coordinated finish story. Detailed design and engineering information remains available through a controlled buyer review.');
}
