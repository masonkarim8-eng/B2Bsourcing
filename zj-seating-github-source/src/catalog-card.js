// Catalog card markup, shared by the browser and the build step that writes the
// cards into index.html as static HTML (see vite.config.js).
import { getDisclosure } from './disclosure.js';

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);

export function cardData(product) {
  const tier = getDisclosure(product).tier;
  if (tier !== 'public') return 'Specifications on request';
  return [product.moq && `MOQ ${product.moq}`, product.loading].filter(Boolean).join(' · ') || 'Specifications on request';
}

export function cardTag(product) {
  const tier = getDisclosure(product).tier;
  if (tier !== 'public') return 'Dealer Spec';
  if (product.category === 'sofa') return 'Compressed Pack';
  return '';
}

export function productCardHtml(product, imageUrl = product.image) {
  const url = `./product.html?model=${encodeURIComponent(product.model)}`;
  const tier = getDisclosure(product).tier;
  const tag = cardTag(product);
  return `<article class="product-card" data-category="${product.category}" data-disclosure="${tier}" data-model="${escapeHtml(product.model)}">
  <a class="card-link" href="${url}">
    <span class="card-mat"><img src="${imageUrl}" alt="${escapeHtml(product.alt)}" loading="lazy" width="600" height="600"></span>
    <span class="card-head"><span class="card-model">${escapeHtml(product.model)}</span>${tag ? `<span class="card-tag">${tag}</span>` : ''}</span>
    <span class="card-name">${escapeHtml(product.label)}</span>
    <span class="card-data">${escapeHtml(cardData(product))}</span>
  </a>
  <div class="card-actions"><button class="card-action rfq-add" type="button" data-rfq-add="${escapeHtml(product.model)}" aria-pressed="false">+ RFQ</button><button class="card-action compare-toggle" type="button" data-compare-model="${escapeHtml(product.model)}" aria-pressed="false">Compare</button></div>
</article>`;
}
