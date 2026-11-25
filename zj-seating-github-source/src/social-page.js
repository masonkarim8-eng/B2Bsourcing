import './style.css';
import './nav-menu.js';
import './social-page.css';
import { publicProducts as products } from './public-products.js';
import { initI18n, onLanguageChange, getLanguage, t, translateTree } from './i18n.js';
import { initRFQ, rfqNotes } from './rfq.js';
import { attributedProductUrl, captureAttribution } from './sharing.js';
import { saveLocalLead } from './lead-handoff.js';
import { leadStatusMessage } from './lead-status.js';

initI18n();
captureAttribution();

const channelIcons = {
  linkedin: '<rect x="4" y="9" width="3" height="10"/><path d="M5.5 4.5v.01M11 19v-5c0-2 1.2-3 3-3s3 1 3 3v5M11 9v10"/>',
  facebook: '<path d="M14 8h3V4h-3c-3 0-4 2-4 5v3H7v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'
};
const channelNames = { linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram' };
const product = (model) => products.find((item) => item.model === model);
const posts = [
  { id: 'mesh-8387', channel: 'linkedin', kind: 'Product focus', model: '8387H-RD', title: 'A confident color story for modern office collections.', caption: 'A closer look at 8387H-RD: a compact high-back profile, adjustable support, and a finish that gives private-label collections a confident point of view.', image: product('8387H-RD').image, alt: product('8387H-RD').alt },
  { id: 'curved-sofa', channel: 'instagram', kind: 'Product focus', model: 'YKX-33016', title: 'Curved comfort, made for modern living.', caption: 'YKX-33016 pairs a sculptural silhouette with an all-foam compressed format—a relaxed statement for coordinated lifestyle ranges.', image: product('YKX-33016').image, alt: product('YKX-33016').alt },
  { id: 'factory-process', channel: 'facebook', kind: 'Factory story', destination: 'factory', title: 'See the process behind the product.', caption: 'From product development to export packing, organized checkpoints help turn an approved seating specification into a repeatable order.', image: new URL('../assets/factory-02.jpg', import.meta.url).href, alt: 'ZJ Seating production and quality process' },
  { id: 'executive-preview', channel: 'linkedin', kind: 'Design preview', model: '9628H', title: 'A limited first look at 9628H.', caption: 'Explore the refined high-back silhouette of our next premium executive direction. Detailed design and engineering information remains available through a controlled buyer review.', image: product('9628H').image, alt: product('9628H').alt },
  { id: 'study-color', channel: 'instagram', kind: 'Study collection', model: '8422MJ-BL', title: 'Compact comfort with a practical footrest.', caption: 'A closer look at 8422MJ-BL for coordinated study ranges, with a supportive integrated footrest and a fresh blue finish.', image: product('8422MJ-BL').image, alt: product('8422MJ-BL').alt },
  { id: 'culture-principles', channel: 'facebook', kind: 'Culture story', destination: 'culture', title: 'Better seating starts with shared standards.', caption: 'Quality, innovation, and cooperation shape the way our team approaches product thinking, manufacturing, and everyday collaboration.', image: new URL('../assets/factory-04.jpg', import.meta.url).href, alt: 'ZJ Seating team and manufacturing culture' }
];

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');
const feed = document.querySelector('#social-feed-grid');
const quoteDialog = document.querySelector('#quote-dialog');
const quoteModel = document.querySelector('#quote-model');
const quoteNotes = document.querySelector('#quote-notes');
const requestType = document.querySelector('#request-type');
const formStatus = document.querySelector('#form-status');
let activeFilter = 'all';

function closeNav() {
  primaryNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  translateTree(navToggle);
}
navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  translateTree(navToggle);
});
primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));

function openQuote(models = '', notes = '') {
  quoteModel.value = models;
  quoteNotes.value = notes;
  formStatus.hidden = true;
  if (!quoteDialog.open) quoteDialog.showModal();
}
const rfq = initRFQ({ products, onSubmit: (items) => openQuote(items.map((item) => item.model).join(', '), rfqNotes(items)) });
document.querySelectorAll('[data-open-quote]').forEach((button) => button.addEventListener('click', () => { closeNav(); rfq.openReview(); }));
document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
quoteDialog.addEventListener('click', (event) => { if (event.target === quoteDialog) quoteDialog.close(); });
document.querySelector('#quote-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  try {
    const result = await saveLocalLead(form, getLanguage());
    formStatus.textContent = leadStatusMessage(result, t);
    formStatus.hidden = false;
    translateTree(formStatus);
  } finally {
    submitButton.disabled = false;
  }
});

function postDestination(post) {
  const language = getLanguage();
  if (post.model) return attributedProductUrl(post.model, { source: post.channel, campaign: 'customer-social-hub', content: post.id, language });
  const url = new URL('./index.html', window.location.href);
  url.search = '';
  url.searchParams.set('utm_source', post.channel);
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', 'customer-social-hub');
  url.searchParams.set('utm_content', post.id);
  if (language !== 'en') url.searchParams.set('lang', language);
  url.hash = post.destination;
  return url.href;
}

function shareDestination(post, source) {
  const url = new URL('./social.html', window.location.href);
  url.search = '';
  if (getLanguage() !== 'en') url.searchParams.set('lang', getLanguage());
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', 'customer-social-share');
  url.searchParams.set('utm_content', post.id);
  url.hash = `post-${post.id}`;
  return url.href;
}

function shareLinks(post) {
  const linkedin = shareDestination(post, 'linkedin');
  const facebook = shareDestination(post, 'facebook');
  const whatsapp = shareDestination(post, 'whatsapp');
  return [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedin)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebook)}` },
    { label: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title}\n${whatsapp}`)}` }
  ];
}

function postCard(post, index) {
  const destinationLabel = post.model ? 'View model' : post.destination === 'factory' ? 'View factory' : 'View culture';
  return `<article class="social-post ${index === 0 ? 'social-post-featured' : ''}" id="post-${post.id}" data-channel="${post.channel}">
    <a class="social-post-image" href="${postDestination(post)}" aria-label="${destinationLabel}: ${post.model || post.title}"><img src="${post.image}" alt="${post.alt}" loading="lazy" width="720" height="540"><span class="social-channel"><svg viewBox="0 0 24 24" aria-hidden="true">${channelIcons[post.channel]}</svg>${channelNames[post.channel]}</span></a>
    <div class="social-post-content"><p class="social-post-kind">${post.kind}</p><h3>${post.title}</h3><p class="social-post-caption">${post.caption}</p><div class="social-post-actions"><a class="text-link" href="${postDestination(post)}">${post.model ? `${post.model} · ` : ''}${destinationLabel} <span aria-hidden="true">→</span></a><button class="social-share-toggle" type="button" data-share-toggle="${post.id}" aria-expanded="false" aria-controls="share-${post.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.5-3.6m-7.5 6 7.5 3.6"/></svg>Share post</button></div>
    <div class="social-post-share" id="share-${post.id}" hidden><span>Share this post</span><div>${shareLinks(post).map((link) => `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('')}<button type="button" data-copy-post="${post.id}">Copy post link</button></div></div><p class="social-post-status" id="status-${post.id}" role="status"></p></div>
  </article>`;
}

function renderPosts() {
  const visible = posts.filter((post) => activeFilter === 'all' || post.channel === activeFilter);
  feed.innerHTML = visible.map(postCard).join('');
  document.querySelector('#social-result-count').textContent = t('social.count', { count: visible.length });
  translateTree(feed);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return true; } catch {}
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  return copied;
}

document.querySelectorAll('[data-social-filter]').forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.socialFilter;
  document.querySelectorAll('[data-social-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  renderPosts();
}));

feed.addEventListener('click', async (event) => {
  const toggle = event.target.closest('[data-share-toggle]');
  if (toggle) {
    const panel = document.querySelector(`#share-${toggle.dataset.shareToggle}`);
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    return;
  }
  const copy = event.target.closest('[data-copy-post]');
  if (copy) {
    const post = posts.find((item) => item.id === copy.dataset.copyPost);
    const copied = await copyText(shareDestination(post, 'share'));
    const status = document.querySelector(`#status-${post.id}`);
    status.textContent = copied ? 'Post link copied.' : 'Copy unavailable. Use the page URL instead.';
    translateTree(status);
  }
});

onLanguageChange(() => { renderPosts(); translateTree(quoteDialog); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNav(); });
renderPosts();
if (window.location.hash.startsWith('#post-')) {
  requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'center' }));
}
