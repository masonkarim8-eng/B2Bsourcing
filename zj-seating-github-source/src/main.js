import './style.css';
import './nav-menu.js';
import { publicProducts as products } from './public-products.js';
import { getDisclosure, publicDescription, publicSpecs } from './disclosure.js';
import { productCardHtml } from './catalog-card.js';
import { initComparison } from './comparison.js';
import { initRFQ, rfqNotes } from './rfq.js';
import { initI18n, onLanguageChange, t, translateText, translateTree } from './i18n.js';
import { localizedProductName, localizedPublicDescription } from './product-copy.js';
import { captureAttribution } from './sharing.js';
import { saveLocalLead } from './lead-handoff.js';
import { leadStatusMessage, markInquiryOpened, resetInquiryCheck, showInquirySuccess } from './lead-status.js';
import { getLanguage } from './i18n.js';
import { getAuthenticatedClient } from './client-store.js';

initI18n();
captureAttribution();

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');

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

const productGrid = document.querySelector('#product-grid');
const productCount = document.querySelector('#product-count');
const filterButtons = document.querySelectorAll('[data-filter]');
let syncComparisonButtons = () => {};
let syncRFQButtons = () => {};
let activeFilter = 'all';

function renderProducts(filter = 'all') {
  activeFilter = filter;
  let visible = 0;
  productGrid.querySelectorAll('.product-card').forEach((card) => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.hidden = !show;
    if (show) visible += 1;
  });
  productCount.textContent = t('catalog.count', { count: visible });
  syncComparisonButtons();
  syncRFQButtons();
}

// Cards are in the static HTML (written at build time). Render them only if missing, e.g. in dev.
if (!productGrid.querySelector('.product-card')) {
  productGrid.innerHTML = products.map((product) => productCardHtml(product)).join('');
  translateTree(productGrid);
}

function applyFilter(filter, scrollToCatalog = false) {
  const selectedButton = [...filterButtons].find((button) => button.dataset.filter === filter);
  if (!selectedButton) return;
  filterButtons.forEach((button) => button.setAttribute('aria-pressed', String(button === selectedButton)));
  renderProducts(filter);
  if (scrollToCatalog) document.querySelector('#products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

renderProducts();

const productDialog = document.querySelector('#product-dialog');
const quoteDialog = document.querySelector('#quote-dialog');
const quoteModel = document.querySelector('#quote-model');
const quoteNotes = document.querySelector('#quote-notes');
const requestType = document.querySelector('#request-type');
const formStatus = document.querySelector('#form-status');
let activeModel = '';

function showDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function openQuote(model = '', type = 'Request a quote', { notes = '' } = {}) {
  quoteModel.value = model;
  quoteNotes.value = notes;
  const client = getAuthenticatedClient();
  if (client) {
    const form = document.querySelector('#quote-form');
    form.elements.name.value = client.name;
    form.elements.company.value = client.company;
    form.elements.email.value = client.email;
    if (!form.elements.destination.value) form.elements.destination.value = client.address || client.country;
  }
  if ([...requestType.options].some((option) => option.value === type)) requestType.value = type;
  formStatus.hidden = true;
  markInquiryOpened(document.querySelector('#quote-form'));
  showDialog(quoteDialog);
}

const rfq = initRFQ({
  products,
  onSubmit: (items) => openQuote(items.map((item) => item.model).join(', '), 'Request a quote', { notes: rfqNotes(items) })
});
syncRFQButtons = rfq.syncButtons;
document.querySelectorAll('[data-rfq-open]').forEach((button) => button.addEventListener('click', () => { closeNav(); rfq.openReview(); }));
syncRFQButtons();

const comparison = initComparison({
  products,
  getDisclosure,
  publicSpecs,
  openQuote: (models) => rfq.addMany(models.split(', '), { open: true })
});
syncComparisonButtons = comparison.syncCompareButtons;
syncComparisonButtons();

function openProduct(model) {
  const product = products.find((item) => item.model === model);
  if (!product) return;

  activeModel = product.model;
  const image = document.querySelector('#product-dialog-image');
  image.src = product.image;
  image.alt = product.alt;
  const disclosure = getDisclosure(product);
  document.querySelector('#product-dialog-category').textContent = `${product.label} · ${disclosure.badge}`;
  document.querySelector('#product-dialog-title').textContent = localizedProductName(product);
  document.querySelector('#product-dialog-description').textContent = localizedPublicDescription(product);
  document.querySelector('#product-page-link').href = `./product.html?model=${encodeURIComponent(product.model)}`;
  document.querySelector('#product-dialog-note').textContent = disclosure.note;
  
document.querySelectorAll('[data-open-quote]').forEach((button) => {
  button.addEventListener('click', () => {
    closeNav();
    if (button.dataset.requestType) openQuote('', button.dataset.requestType);
    else if (rfq.getItems().length) rfq.openReview();
    else openQuote('');
  });
});

document.querySelectorAll('[data-cert]').forEach((button) => {
  button.addEventListener('click', () => openQuote('', 'Request certificates / test reports', { notes: `Certificate requested: ${button.dataset.cert}\n` }));
});

document.querySelector('#request-model').firstChild.textContent = `${disclosure.request} `;

  const specs = publicSpecs(product).filter(([term]) => disclosure.tier === 'public' || !['Dimensions', 'Minimum order', 'Container loading'].includes(term));
  const specList = document.querySelector('#product-dialog-specs');
  specList.innerHTML = specs.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');
  specList.hidden = specs.length === 0;
  translateTree(productDialog);

  showDialog(productDialog);
}

document.querySelectorAll('[data-open-quote]').forEach((button) => {
  button.addEventListener('click', () => {
    closeNav();
    if (button.dataset.requestType) openQuote('', button.dataset.requestType);
    else if (rfq.getItems().length) rfq.openReview();
    else openQuote('');
  });
});

document.querySelectorAll('[data-cert]').forEach((button) => {
  button.addEventListener('click', () => openQuote('', 'Request certificates / test reports', { notes: `Certificate requested: ${button.dataset.cert}\n` }));
});

document.querySelector('#request-model').addEventListener('click', () => {
  productDialog.close();
  openQuote(activeModel);
});

document.querySelector('#product-dialog-rfq').addEventListener('click', () => {
  productDialog.close();
  rfq.add(activeModel, { open: true });
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});

[productDialog, quoteDialog].forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
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

const assistantPanel = document.querySelector('#assistant-panel');
const assistantClose = document.querySelector('#assistant-close');
const assistantLog = document.querySelector('#assistant-log');
const assistantForm = document.querySelector('#assistant-form');
const assistantInput = document.querySelector('#assistant-input');

function appendMessage(sender, text, actions = []) {
  const message = document.createElement('article');
  message.className = `assistant-message assistant-message-${sender}`;

  if (sender === 'bot') {
    const label = document.createElement('span');
    label.className = 'assistant-sender';
    label.textContent = 'ZJ assistant';
    message.append(label);
  }

  const copy = document.createElement('p');
  copy.textContent = text;
  message.append(copy);

  if (actions.length) {
    const actionList = document.createElement('div');
    actionList.className = 'assistant-actions';
    actions.forEach((action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = action.label;
      button.dataset.assistantAction = action.type;
      button.dataset.value = action.value || '';
      actionList.append(button);
    });
    message.append(actionList);
  }

  assistantLog.append(message);
  translateTree(message);
  assistantLog.scrollTop = assistantLog.scrollHeight;
}

let assistantOpener = null;
function openAssistant(opener) {
  closeNav();
  assistantOpener = opener || null;
  assistantPanel.hidden = false;
  document.querySelectorAll('[data-open-assistant]').forEach((button) => button.setAttribute('aria-expanded', 'true'));
  assistantInput.focus();
}

function closeAssistant(returnFocus = true) {
  if (assistantPanel.hidden) return;
  assistantPanel.hidden = true;
  document.querySelectorAll('[data-open-assistant]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  if (returnFocus) assistantOpener?.focus();
}

function scrollToSection(id) {
  closeAssistant(false);
  document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getAssistantResponse(question) {
  const query = question.toLowerCase();
  const normalizedQuery = query.replace(/[^a-z0-9]/g, '');
  const product = products.find((item) => normalizedQuery.includes(item.model.toLowerCase().replace(/[^a-z0-9]/g, '')));

  if (product) {
    const disclosure = getDisclosure(product);
    const details = disclosure.tier === 'public' ? [
      product.summary,
      product.dimensions ? `Dimensions: ${product.dimensions}.` : '',
      product.moq ? `Published MOQ: ${product.moq}.` : '',
      product.loading ? `Loading: ${product.loading}.` : ''
    ].filter(Boolean).join(' ') : `${product.summary} ${disclosure.note}`;
    return {
      text: `${product.name}. ${details} Confirm current specifications and availability with sales.`,
      actions: [
        { label: 'Quick view', type: 'product', value: product.model },
        { label: 'Add to RFQ', type: 'rfq-add', value: product.model },
        { label: disclosure.request, type: 'quote', value: product.model }
      ]
    };
  }

  if (/sofa|sectional|lounge/.test(query)) {
    return {
      text: 'The compressed sofa edit includes six all-foam designs, from one-seat lounge formats to modular sectionals. Published MOQs are 50 pcs or 50 sets, depending on the model.',
      actions: [{ label: 'Explore compressed sofas', type: 'filter', value: 'sofa' }]
    };
  }

  if (/find a chair|office chair|chair collection/.test(query)) {
    return {
      text: 'Which range are you sourcing? Choose a category to see the matching models and specifications.',
      actions: [
        { label: 'Mesh chairs', type: 'filter', value: 'mesh' },
        { label: 'Executive', type: 'filter', value: 'executive' },
        { label: 'Study', type: 'filter', value: 'study' },
        { label: 'Task', type: 'filter', value: 'task' }
      ]
    };
  }

  const categoryResponses = {
    mesh: 'The mesh collection includes high-back, ergonomic, colorful, and premium nylon-frame designs. Open the filtered catalog to compare the available models.',
    executive: 'The executive collection combines padded and high-back silhouettes, including premium options with adjustable support.',
    visitor: 'The current visitor selection includes coordinated mesh seating with a fixed cantilever frame.',
    study: 'The study collection includes compact mesh chairs with practical footrest, folding-arm, and adjustable-height options.',
    task: 'The task collection includes accessible mid-back seating for everyday office programs.'
  };
  const category = Object.keys(categoryResponses).find((key) => query.includes(key));
  if (category) {
    return {
      text: categoryResponses[category],
      actions: [{ label: `View ${category} seating`, type: 'filter', value: category }]
    };
  }

  if (/moq|minimum order|order quantity/.test(query)) {
    return {
      text: 'Published chair MOQs vary by model: premium and study models are commonly 100 pcs, while several other chairs are 50 pcs. Compressed sofas are 50 pcs or 50 sets. Ask for current confirmation on your selected model.',
      actions: [{ label: 'Browse the catalog', type: 'filter', value: 'all' }, { label: 'Start an RFQ', type: 'quote' }]
    };
  }

  if (/lead time|production time|how long|delivery time|sample time/.test(query)) {
    return {
      text: 'The supplied office-chair sheet lists production at 30–45 days and samples at 7 days. The sofa sheet lists 30–45 working days. Timing depends on the approved specification and order, so confirm current dates with sales.',
      actions: [{ label: 'Discuss timing', type: 'quote' }]
    };
  }

  if (/price|pricing|cost|quote|rfq/.test(query)) {
    return {
      text: 'Pricing depends on the model, specification, quantity, packaging, and destination. Share those details in an RFQ for a current, project-specific quotation.',
      actions: [{ label: 'Start an RFQ', type: 'quote' }]
    };
  }

  if (/factory|company|manufacturer|about zj|production base/.test(query)) {
    return {
      text: 'ZJ Seating was established in 2009 and integrates seating R&D, production, and sales. Its company profile lists three production bases, four R&D departments, and exports to more than 60 countries and regions.',
      actions: [{ label: 'See the factory', type: 'scroll', value: 'factory' }]
    };
  }

  if (/quality|certificate|iso|bifma|en 1335|test report|compliance/.test(query)) {
    return {
      text: 'Company and product materials reference ISO 9001, ISO 14001, ANSI/BIFMA X5.1, and EN 1335. Request current certificates and model-specific reports for your exact product and market.',
      actions: [{ label: 'Review quality section', type: 'scroll', value: 'quality' }, { label: 'Request documents', type: 'documents' }]
    };
  }

  if (/oem|odm|custom|private label|my brand/.test(query)) {
    return {
      text: 'OEM/ODM projects can start from an existing model, a reference, or a new brief. Materials, colors, sampling, packaging, and quality checkpoints can be aligned around your market.',
      actions: [{ label: 'View the process', type: 'scroll', value: 'oem' }, { label: 'Discuss a project', type: 'quote' }]
    };
  }

  if (/contact|email|phone|sales|human|agent/.test(query)) {
    return {
      text: 'You can email info@b2bsourcing.org or call +86 159 6826 2285. For a product-specific response, prepare an RFQ with your model, quantity, and destination.',
      actions: [{ label: 'Prepare an RFQ', type: 'quote' }]
    };
  }

  return {
    text: 'I can help with a specific model, chair or sofa categories, MOQs, lead times, OEM/ODM, quality documents, and contact details. Try a model number such as 8413H-GR.',
    actions: [
      { label: 'Browse all products', type: 'filter', value: 'all' },
      { label: 'Quality documents', type: 'documents' }
    ]
  };
}

const chatHistory = [];
let chatLeadSent = false;
let chatBusy = false;

const CATEGORY_LABELS = { mesh: 'mesh chairs', executive: 'executive chairs', visitor: 'visitor chairs', study: 'study chairs', task: 'task chairs', sofa: 'compressed sofas', all: 'all products' };
const SECTION_LABELS = { products: 'Products', oem: 'OEM / ODM', factory: 'Factory', quality: 'Quality', about: 'About us', contact: 'Contact' };

function chatActionLabel(action) {
  switch (action.type) {
    case 'product': return t('chat.viewModel', { model: action.value });
    case 'rfq-add': return t('chat.addToRfq', { model: action.value });
    case 'quote': return action.value === 'rnd' ? t('chat.contactRnd') : action.value === 'gaming' ? t('chat.quoteGaming') : action.value ? t('chat.quoteModel', { model: action.value }) : t('chat.startRfq');
    case 'filter': return t('chat.show', { category: translateText(CATEGORY_LABELS[action.value] || action.value) });
    case 'scroll': return translateText(SECTION_LABELS[action.value] || action.value);
    case 'documents': return t('chat.documents');
    default: return action.value;
  }
}

function showTyping() {
  const typing = document.createElement('article');
  typing.className = 'assistant-message assistant-message-bot assistant-typing';
  typing.setAttribute('aria-label', t('chat.typing'));
  typing.innerHTML = '<span></span><span></span><span></span>';
  assistantLog.append(typing);
  assistantLog.scrollTop = assistantLog.scrollHeight;
  return typing;
}

async function askAssistant(question) {
  const cleanQuestion = question.trim().slice(0, 800);
  if (!cleanQuestion || chatBusy) return;
  chatBusy = true;
  appendMessage('user', cleanQuestion);
  chatHistory.push({ role: 'user', content: cleanQuestion });
  const typing = showTyping();
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory.slice(-16), language: getLanguage(), page: window.location.pathname, leadSent: chatLeadSent })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || 'chat');
    if (data.leadSent) chatLeadSent = true;
    typing.remove();
    chatHistory.push({ role: 'assistant', content: data.reply });
    appendMessage('bot', data.reply, (data.actions || []).map((action) => ({ ...action, label: chatActionLabel(action) })));
  } catch {
    // AI unavailable or rate-limited: fall back to the built-in catalog answers.
    typing.remove();
    const fallback = getAssistantResponse(cleanQuestion);
    chatHistory.push({ role: 'assistant', content: fallback.text });
    appendMessage('bot', fallback.text, fallback.actions);
  } finally {
    chatBusy = false;
  }
}

document.querySelectorAll('[data-open-assistant]').forEach((button) => {
  button.setAttribute('aria-controls', 'assistant-panel');
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => (assistantPanel.hidden ? openAssistant(button) : closeAssistant()));
});
assistantClose.addEventListener('click', () => closeAssistant());

assistantForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = assistantInput.value;
  assistantInput.value = '';
  askAssistant(question);
  assistantInput.focus();
});

document.querySelectorAll('[data-assistant-prompt]').forEach((button) => {
  button.addEventListener('click', () => askAssistant(button.dataset.assistantPrompt));
});

assistantLog.addEventListener('click', (event) => {
  const button = event.target.closest('[data-assistant-action]');
  if (!button) return;
  const { assistantAction, value } = button.dataset;

  if (assistantAction === 'filter') {
    closeAssistant(false);
    applyFilter(value, true);
  } else if (assistantAction === 'product') {
    closeAssistant(false);
    openProduct(value);
  } else if (assistantAction === 'quote') {
    closeAssistant(false);
    if (value === 'gaming') openQuote('Gaming chairs', 'Request a quote', { notes: t('chat.gamingNotes') });
    else if (value === 'rnd') openQuote('', 'Custom design / R&D request', { notes: `${t('chat.rndNotes')} ` });
    else if (value) openQuote(value);
    else if (rfq.getItems().length) rfq.openReview();
    else openQuote('');
  } else if (assistantAction === 'rfq-add') {
    closeAssistant(false);
    rfq.add(value, { open: true });
  } else if (assistantAction === 'documents') {
    closeAssistant(false);
    openQuote('', 'Request certificates / test reports');
  } else if (assistantAction === 'scroll') {
    scrollToSection(value);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeNav();
  closeAssistant();
});

onLanguageChange(() => {
  renderProducts(activeFilter);
  if (productDialog.open) openProduct(activeModel);
  translateTree(quoteDialog);
});

appendMessage('bot', 'Hello. I can help you find a product, check catalog details, learn about the factory, or prepare an RFQ. What are you sourcing?');
