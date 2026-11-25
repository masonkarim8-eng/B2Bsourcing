const ATTRIBUTION_KEY = 'zj-attribution-v1';
const allowedFields = ['source', 'medium', 'campaign', 'content', 'term'];

function clean(value, maxLength = 160) {
  return String(value || '').trim().slice(0, maxLength);
}

export function captureAttribution(search = window.location.search) {
  const params = new URLSearchParams(search);
  const incoming = {
    source: clean(params.get('utm_source'), 80),
    medium: clean(params.get('utm_medium'), 80),
    campaign: clean(params.get('utm_campaign'), 120),
    content: clean(params.get('utm_content'), 120),
    term: clean(params.get('utm_term'), 120)
  };
  if (!Object.values(incoming).some(Boolean)) return getAttribution();
  const attribution = {
    ...incoming,
    capturedAt: new Date().toISOString(),
    landingPage: clean(window.location.href.split('#')[0], 500)
  };
  try { window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution)); } catch {}
  return attribution;
}

export function getAttribution() {
  try {
    const value = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY));
    if (!value || typeof value !== 'object') return null;
    const attribution = {};
    allowedFields.forEach((field) => { attribution[field] = clean(value[field], field === 'source' || field === 'medium' ? 80 : 120); });
    attribution.capturedAt = clean(value.capturedAt, 40);
    attribution.landingPage = clean(value.landingPage, 500);
    return attribution;
  } catch {
    return null;
  }
}

export function attributedProductUrl(model, { source, campaign, content = model, language = 'en', baseUrl = window.location.href } = {}) {
  const url = new URL('./product.html', baseUrl);
  url.search = '';
  url.hash = '';
  url.searchParams.set('model', model);
  if (language && language !== 'en') url.searchParams.set('lang', language);
  if (source) url.searchParams.set('utm_source', clean(source, 80));
  url.searchParams.set('utm_medium', 'social');
  if (campaign) url.searchParams.set('utm_campaign', clean(campaign, 120));
  url.searchParams.set('utm_content', clean(content, 120));
  return url.href;
}

export function productShareLinks(product, language = 'en') {
  const url = attributedProductUrl(product.model, {
    source: 'share',
    campaign: 'product-share',
    language
  });
  const makeUrl = (source) => {
    const shareUrl = new URL(url);
    shareUrl.searchParams.set('utm_source', source);
    return shareUrl.href;
  };
  const linkedinUrl = makeUrl('linkedin');
  const facebookUrl = makeUrl('facebook');
  const whatsappUrl = makeUrl('whatsapp');
  return [
    { id: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedinUrl)}` },
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookUrl)}` },
    { id: 'whatsapp', label: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${product.name}\n${whatsappUrl}`)}` }
  ];
}
