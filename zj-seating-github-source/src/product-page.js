import './style.css';
import './nav-menu.js';
import { publicProducts as products } from './public-products.js';
import { getDisclosure, publicDescription, publicSpecs } from './disclosure.js';
import QRCode from 'qrcode';
import { initRFQ, rfqNotes } from './rfq.js';
import { initI18n, onLanguageChange, translateTree } from './i18n.js';
import { localizedProductName, localizedPublicDescription } from './product-copy.js';
import { captureAttribution, productShareLinks } from './sharing.js';
import { saveLocalLead } from './lead-handoff.js';
import { leadStatusMessage, resetInquiryCheck, showInquirySuccess } from './lead-status.js';
import { getLanguage, t } from './i18n.js';

initI18n();
captureAttribution();

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');
const requestedModel = new URLSearchParams(window.location.search).get('model') || '';
const product = products.find((item) => item.model.toLowerCase() === requestedModel.toLowerCase());
const quoteDialog = document.querySelector('#quote-dialog');
const quoteModel = document.querySelector('#quote-model');
const quoteNotes = document.querySelector('#quote-notes');
const requestType = document.querySelector('#request-type');
const formStatus = document.querySelector('#form-status');

function closeNav() {
  primaryNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  translateTree(navToggle);
}

function openQuote(model = '', type = 'Request a quote', notes = '') {
  quoteModel.value = model;
  quoteNotes.value = notes;
  if ([...requestType.options].some((option) => option.value === type)) requestType.value = type;
  formStatus.hidden = true;
  if (!quoteDialog.open) quoteDialog.showModal();
}

const rfq = initRFQ({
  products,
  onSubmit: (items) => openQuote(items.map((item) => item.model).join(', '), 'Request a quote', rfqNotes(items))
});

function productUrl(model) {
  return `./product.html?model=${encodeURIComponent(model)}`;
}

function relatedCard(item) {
  return `
    <article class="related-card">
      <a class="related-image" href="${productUrl(item.model)}" aria-label="View ${item.name}"><img src="${item.image}" alt="${item.alt}" loading="lazy" width="500" height="500"></a>
      <div><span>${item.label}</span><h3>${item.model}</h3><div class="related-card-actions"><a class="text-link" href="${productUrl(item.model)}">View product <span aria-hidden="true">→</span></a><button class="rfq-add" type="button" data-rfq-add="${item.model}" aria-pressed="false">Add to RFQ</button></div></div>
    </article>`;
}

function renderProductShare() {
  if (!product) return;
  const icons = {
    linkedin: '<rect x="4" y="9" width="3" height="10"/><path d="M5.5 4.5v.01M11 19v-5c0-2 1.2-3 3-3s3 1 3 3v5M11 9v10"/>',
    facebook: '<path d="M14 8h3V4h-3c-3 0-4 2-4 5v3H7v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z"/>',
    whatsapp: '<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.5 3 2 4.5 5 5l1-1 2 1c-.5 2-2 2.5-4 2-3.5-.8-6.2-3.5-7-7-.5-2 0-3.5 2-4l1 2-1 1Z"/>'
  };
  const container = document.querySelector('#product-share-links');
  container.innerHTML = productShareLinks(product, getLanguage()).map((link) => `<a href="${link.href}" target="_blank" rel="noopener noreferrer" aria-label="${t('share.aria', { model: product.model, channel: link.label })}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[link.id]}</svg>${link.label}</a>`).join('');
  document.querySelector('#product-share').hidden = false;
}

function renderProductContent() {
  if (!product) return;
  const disclosure = getDisclosure(product);
  document.title = `${product.model} | ${product.name.replace(`${product.model} `, '')} | ZJ Seating`;
  document.querySelector('meta[name="description"]').content = `${product.name}: ${disclosure.tier === 'public' ? 'published specifications' : 'controlled product preview'}, OEM/ODM options, and sourcing details from ZJ Seating.`;
  document.querySelector('#breadcrumb-model').textContent = product.model;
  document.querySelector('#visual-model').textContent = product.model;
  document.querySelector('.product-landing-visual').dataset.category = product.category;
  document.querySelector('.product-landing-visual').dataset.disclosure = disclosure.tier;
  document.querySelector('#product-label').textContent = product.label;
  document.querySelector('#product-name').textContent = localizedProductName(product);
  document.querySelector('#product-description').textContent = localizedPublicDescription(product);
  document.querySelector('#product-disclosure-badge').textContent = disclosure.badge;
  document.querySelector('#product-disclosure-note').textContent = disclosure.note;

  const request = document.querySelector('#product-request');
  request.dataset.rfqAdd = product.model;
  request.dataset.rfqOpen = 'true';
  request.setAttribute('aria-pressed', 'false');

  const image = document.querySelector('#product-image');
  image.src = product.image;
  image.alt = disclosure.tier === 'teaser' ? `${product.alt}; limited flagship preview` : product.alt;
  document.querySelector('#product-specs').innerHTML = publicSpecs(product).map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');

  const related = [
    ...products.filter((item) => item.category === product.category && item.model !== product.model),
    ...products.filter((item) => item.category !== product.category)
  ].slice(0, 3);
  document.querySelector('#related-grid').innerHTML = related.map(relatedCard).join('');
  renderProductShare();
  translateTree(document.querySelector('#product-main'));
  rfq.syncButtons();
}

async function updateProductQR() {
  if (!product) return;
  const pageUrl = window.location.href.split('#')[0];
  document.querySelector('#product-url').textContent = pageUrl;
  try {
    const qr = await QRCode.toDataURL(pageUrl, { width: 512, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#142536', light: '#f8faf9' } });
    document.querySelector('#product-qr').src = qr;
    const download = document.querySelector('#download-product-qr');
    download.href = qr;
    download.download = `zj-${product.model.toLowerCase()}-qr.png`;
  } catch {
    document.querySelector('#copy-status').textContent = 'QR generation is unavailable. The product URL remains available to copy.';
    document.querySelector('#download-product-qr').hidden = true;
    translateTree(document.querySelector('#copy-status'));
  }
}

function showNotFound() {
  document.title = 'Product Not Found | ZJ Seating';
  document.querySelector('#product-main').innerHTML = `
    <section class="section product-not-found">
      <div class="shell">
        <p class="overline">PRODUCT LOOKUP</p>
        <h1>We couldn’t find that model.</h1>
        <p>The QR or NFC link may be incomplete, or the model may no longer be in this catalog.</p>
        <a class="button" href="./index.html#products">Browse all products <span aria-hidden="true">→</span></a>
      </div>
    </section>`;
  translateTree(document.querySelector('#product-main'));
}

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  translateTree(navToggle);
});
primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNav();
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-open-quote]');
  if (!button) return;
  closeNav();
  rfq.openReview();
});

document.querySelector('#copy-product-link')?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  const pageUrl = window.location.href.split('#')[0];
  try {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(pageUrl);
        copied = true;
      } catch {}
    }
    if (!copied) {
      const field = document.createElement('textarea');
      field.value = pageUrl;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      copied = document.execCommand('copy');
      field.remove();
    }
    if (!copied) throw new Error('Copy unavailable');
    status.textContent = 'Product URL copied. Use the published HTTPS URL for QR printing or optional NFC encoding.';
  } catch {
    status.textContent = 'Copy is unavailable in this browser. Select the product URL shown below instead.';
  }
  translateTree(status);
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});
quoteDialog.addEventListener('click', (event) => {
  if (event.target === quoteDialog) quoteDialog.close();
});
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
    if (result.sent) {
      const email = form.elements.email.value;
      form.reset();
      formStatus.hidden = true;
      form.closest('dialog')?.close();
      showInquirySuccess(result.reference, email);
    }
    resetInquiryCheck();
  } finally {
    submitButton.disabled = false;
  }
});

onLanguageChange(() => {
  if (product) {
    renderProductContent();
    updateProductQR();
  } else showNotFound();
  translateTree(quoteDialog);
});

if (product) {
  renderProductContent();
  updateProductQR();
} else showNotFound();
