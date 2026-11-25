import './client.css';
import { publicProducts } from './public-products.js';
import { readLocalLeads } from './lead-handoff.js';
import { readQuoteRooms, recordClientQuoteDecision } from './quote-room-store.js';
import {
  DEMO_CLIENT_CREDENTIALS,
  authenticateClient,
  endClientSession,
  getAuthenticatedClient,
  registerClientAccount,
  startClientSession,
  updateClientAccount
} from './client-store.js';

const loginView = document.querySelector('#client-login-view');
const dashboard = document.querySelector('#client-dashboard');
const signInForm = document.querySelector('#client-sign-in-form');
const registerForm = document.querySelector('#client-register-form');
const signInTab = document.querySelector('#client-sign-in-tab');
const registerTab = document.querySelector('#client-register-tab');
const quoteList = document.querySelector('#client-quote-list');
const quoteConfirm = document.querySelector('#client-quote-confirm');
const quoteConfirmForm = document.querySelector('#client-quote-confirm-form');
let activeClient = null;

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const formatDate = (value) => {
  const date = new Date(value || '');
  return Number.isNaN(date.getTime()) ? 'Not recorded' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
};
const formatDateTime = (value) => {
  const date = new Date(value || '');
  return Number.isNaN(date.getTime()) ? 'Not recorded' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' }).format(date);
};
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Number(value) || 0);

function showMessage(element, text = '', error = false) {
  element.textContent = text;
  element.hidden = !text;
  element.classList.toggle('error', error);
}

function switchAuth(mode) {
  const signIn = mode === 'sign-in';
  signInForm.hidden = !signIn;
  registerForm.hidden = signIn;
  signInTab.setAttribute('aria-pressed', String(signIn));
  registerTab.setAttribute('aria-pressed', String(!signIn));
  showMessage(document.querySelector('#client-sign-in-message'));
  showMessage(document.querySelector('#client-register-message'));
  (signIn ? document.querySelector('#client-email') : registerForm.elements.name).focus();
}

signInTab.addEventListener('click', () => switchAuth('sign-in'));
registerTab.addEventListener('click', () => switchAuth('register'));
document.querySelector('#client-demo-fill').addEventListener('click', () => {
  document.querySelector('#client-email').value = DEMO_CLIENT_CREDENTIALS.email;
  document.querySelector('#client-password').value = DEMO_CLIENT_CREDENTIALS.password;
  showMessage(document.querySelector('#client-sign-in-message'));
  signInForm.querySelector('[type="submit"]').focus();
});

function showDashboard(account) {
  activeClient = account;
  loginView.hidden = true;
  dashboard.hidden = false;
  document.title = `${account.company} | ZJ Seating Client Account`;
  renderDashboard();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function matchingInquiries() {
  const email = activeClient.email.toLowerCase();
  return readLocalLeads().filter((lead) => String(lead.email || '').trim().toLowerCase() === email);
}

function renderUpdates() {
  const container = document.querySelector('#client-updates');
  if (!activeClient.updates.length) {
    container.innerHTML = '<div class="client-empty"><strong>No product updates</strong><p>Updates connected to previous orders will appear here.</p></div>';
    return;
  }
  container.innerHTML = activeClient.updates.map((update) => {
    const ready = update.status === 'Draft ready';
    return `<article class="client-update"><div class="client-update-top"><h4>${escapeHtml(update.model)}</h4><span class="client-status ${ready ? 'ready' : ''}">${ready ? 'RECOMMENDATION PREPARED' : 'REPLACEMENT REVIEW'}</span></div><p>${escapeHtml(update.recommendation)}</p><small>${ready ? `${escapeHtml(update.preparedBy || 'Your sales representative')} prepared a local outreach draft on ${formatDate(update.preparedAt)}. No external message has been sent.` : 'Your sales team can review this update and prepare a proactive replacement recommendation.'}</small></article>`;
  }).join('');
}

function renderReplacements() {
  const models = [...new Set(activeClient.orders.filter((order) => order.lifecycle === 'discontinued').flatMap((order) => order.replacementModels || []))];
  const replacements = models.map((model) => publicProducts.find((product) => product.model === model)).filter(Boolean);
  const section = document.querySelector('#client-replacement-section');
  section.hidden = replacements.length === 0;
  document.querySelector('#client-replacements').innerHTML = replacements.map((product) => `<article class="client-replacement"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}" width="96" height="96"><div><h4>${escapeHtml(product.model)}</h4><p>${escapeHtml(product.name)}</p><a href="./product.html?model=${encodeURIComponent(product.model)}">Review current product →</a></div></article>`).join('');
}

function quoteStatusClass(status) {
  return { Accepted: 'ready', 'Awaiting client': 'pending', 'Revision requested': 'revision', Superseded: 'superseded' }[status] || 'superseded';
}

function quoteDecisionMarkup(room) {
  if (!room.decision) return '';
  const accepted = room.decision.type === 'accepted';
  return `<section class="client-quote-decision ${accepted ? 'accepted' : 'revision'}"><strong>${accepted ? 'Demo acceptance recorded' : 'Changes requested on this version'}</strong><p>${escapeHtml(room.decision.note || 'No additional note was added.')}</p><small>${escapeHtml(room.decision.by)} · ${formatDateTime(room.decision.at)}</small></section>`;
}

function quoteHistoryMarkup(room) {
  const history = Array.isArray(room.history) ? room.history : [];
  if (!history.length) return '';
  return `<details class="client-quote-history"><summary>View preserved version history</summary><ol>${history.map((entry) => `<li><span>${escapeHtml(entry.text)}</span><small>${escapeHtml(entry.by)} · ${formatDateTime(entry.at)}</small></li>`).join('')}</ol></details>`;
}

function renderQuoteRooms() {
  const rooms = readQuoteRooms(activeClient.id).sort((a, b) => String(b.sharedAt).localeCompare(String(a.sharedAt)));
  document.querySelector('#client-quote-count').textContent = String(rooms.filter((room) => room.status === 'Awaiting client').length);
  showMessage(document.querySelector('#client-quote-message'));
  if (!rooms.length) {
    quoteList.innerHTML = '<div class="client-empty"><strong>No quotations shared yet</strong><p>When your sales representative shares an approved quotation version, its customer-safe details and review actions will appear here.</p></div>';
    return;
  }
  quoteList.innerHTML = rooms.map((room) => {
    const quote = room.quote;
    const awaiting = room.status === 'Awaiting client';
    const actions = awaiting ? `<div class="client-quote-actions" data-client-quote-actions><button class="client-primary" type="button" data-client-quote-accept="${escapeHtml(room.id)}">Accept quotation</button><button class="client-secondary" type="button" data-client-quote-revise="${escapeHtml(room.id)}">Request changes</button></div><form class="client-quote-revision-form" data-client-quote-revision-form data-room-id="${escapeHtml(room.id)}" hidden><label>What should sales change?<textarea rows="4" maxlength="2000" required placeholder="Describe the quantity, configuration, pricing, packaging, destination, or other terms to revisit"></textarea></label><div class="client-quote-actions"><button class="client-primary" type="submit">Send change request to local sales record</button><button class="client-secondary" type="button" data-client-quote-revision-cancel>Cancel</button></div><p class="client-form-message" data-revision-message role="alert" hidden></p></form>` : '';
    return `<article class="client-quote-card" data-quote-room="${escapeHtml(room.id)}">
      <header class="client-quote-head"><div><code>${escapeHtml(room.quoteId)} · VERSION ${escapeHtml(room.version)}</code><h3>${escapeHtml(quote.productModel)} <span>${escapeHtml(quote.productName)}</span></h3></div><span class="client-status ${quoteStatusClass(room.status)}">${escapeHtml(room.status.toUpperCase())}</span></header>
      <div class="client-quote-main">
        <img class="client-quote-image" src="${escapeHtml(quote.productImage)}" alt="${escapeHtml(quote.productAlt)}" width="220" height="190" loading="lazy">
        <dl class="client-quote-commercial"><div><dt>Quantity</dt><dd>${escapeHtml(quote.quantity)} ${escapeHtml(quote.unit)}</dd></div><div><dt>Configuration</dt><dd>${escapeHtml(quote.configuration)}</dd></div><div><dt>Packaging</dt><dd>${escapeHtml(quote.packaging)}</dd></div><div><dt>Incoterm</dt><dd>${escapeHtml(quote.incoterm)}</dd></div><div><dt>Destination</dt><dd>${escapeHtml(quote.destination || 'Not specified')}</dd></div><div><dt>Valid until</dt><dd>${formatDate(quote.validUntil)}</dd></div></dl>
      </div>
      ${quote.belowMoq ? `<p class="client-quote-moq"><strong>Below-MOQ review:</strong> This quotation is for ${escapeHtml(quote.quantity)} ${escapeHtml(quote.unit)}, below the ${escapeHtml(quote.moq)}-${escapeHtml(quote.unit)} MOQ. Sales acceptance and final terms still require confirmation.</p>` : ''}
      <dl class="client-quote-pricing"><div><dt>Unit price</dt><dd>${money(quote.finalUnit)}</dd></div><div><dt>Product subtotal</dt><dd>${money(quote.productSubtotal)}</dd></div><div><dt>One-time charges</dt><dd>${money(quote.oneTimeCharges)}</dd></div><div><dt>Freight / services</dt><dd>${money(quote.freight)}</dd></div><div class="client-quote-total"><dt>Illustrative total · ${escapeHtml(quote.currency || 'USD')}</dt><dd>${money(quote.total)}</dd></div></dl>
      ${quote.notes ? `<div class="client-quote-notes"><strong>Commercial notes</strong><p>${escapeHtml(quote.notes)}</p></div>` : ''}
      <p class="client-quote-shared">Shared by ${escapeHtml(room.sharedBy)} · ${formatDateTime(room.sharedAt)}</p>
      ${quoteDecisionMarkup(room)}
      ${quoteHistoryMarkup(room)}
      ${actions}
    </article>`;
  }).join('');
}

function openQuoteAcceptance(roomId) {
  const room = readQuoteRooms(activeClient?.id).find((item) => item.id === roomId && item.status === 'Awaiting client');
  if (!room) {
    renderQuoteRooms();
    showMessage(document.querySelector('#client-quote-message'), 'This quotation version is no longer awaiting a decision. Review its preserved status instead.', true);
    return;
  }
  quoteConfirm.dataset.roomId = room.id;
  quoteConfirmForm.reset();
  showMessage(document.querySelector('#client-quote-confirm-message'));
  document.querySelector('#client-quote-confirm-summary').textContent = `${room.quoteId} · Version ${room.version} · ${room.quote.productModel} · ${room.quote.quantity} ${room.quote.unit} · ${money(room.quote.total)}`;
  quoteConfirm.showModal();
}

quoteList.addEventListener('click', (event) => {
  const accept = event.target.closest('[data-client-quote-accept]');
  const revise = event.target.closest('[data-client-quote-revise]');
  const cancel = event.target.closest('[data-client-quote-revision-cancel]');
  if (accept) {
    openQuoteAcceptance(accept.dataset.clientQuoteAccept);
    return;
  }
  if (revise) {
    const card = revise.closest('[data-quote-room]');
    card.querySelector('[data-client-quote-actions]').hidden = true;
    const form = card.querySelector('[data-client-quote-revision-form]');
    form.hidden = false;
    form.querySelector('textarea').focus();
    return;
  }
  if (cancel) {
    const card = cancel.closest('[data-quote-room]');
    const form = card.querySelector('[data-client-quote-revision-form]');
    form.reset();
    form.hidden = true;
    card.querySelector('[data-client-quote-actions]').hidden = false;
    card.querySelector('[data-client-quote-revise]').focus();
  }
});

quoteList.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-client-quote-revision-form]');
  if (!form) return;
  event.preventDefault();
  if (!form.reportValidity() || !activeClient) return;
  const note = form.querySelector('textarea').value;
  const result = recordClientQuoteDecision(form.dataset.roomId, 'revision', note, activeClient);
  if (!result?.id) {
    const messages = { note: 'Describe the changes you need before sending the request.', locked: 'This version is no longer awaiting a decision. Reload the quote room to review its current status.' };
    showMessage(form.querySelector('[data-revision-message]'), messages[result?.error] || 'The change request could not be saved. Check browser storage permissions.', true);
    return;
  }
  renderQuoteRooms();
  showMessage(document.querySelector('#client-quote-message'), `${result.quoteId} V${result.version}: your change request is saved in this browser for sales review. No external message was sent.`);
});

quoteConfirmForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!quoteConfirmForm.reportValidity() || !activeClient) return;
  const result = recordClientQuoteDecision(quoteConfirm.dataset.roomId, 'accepted', document.querySelector('#client-quote-confirm-note').value, activeClient);
  if (!result?.id) {
    showMessage(document.querySelector('#client-quote-confirm-message'), result?.error === 'locked' ? 'This version is no longer awaiting a decision. Close this dialog and review its current status.' : 'The demo acceptance could not be saved. Check browser storage permissions.', true);
    return;
  }
  quoteConfirm.close();
  renderQuoteRooms();
  showMessage(document.querySelector('#client-quote-message'), `${result.quoteId} V${result.version}: demo acceptance recorded locally. This is not a binding order, and no external notification was sent.`);
});
document.querySelector('#client-quote-confirm-close').addEventListener('click', () => quoteConfirm.close());
document.querySelector('#client-quote-confirm-cancel').addEventListener('click', () => quoteConfirm.close());
quoteConfirm.addEventListener('click', (event) => { if (event.target === quoteConfirm) quoteConfirm.close(); });

function renderOrders() {
  const container = document.querySelector('#client-order-list');
  if (!activeClient.orders.length) {
    container.innerHTML = '<div class="client-empty"><strong>No order records yet</strong><p>New local accounts begin without order history. A production account would import verified orders from the ERP or CRM.</p></div>';
    return;
  }
  container.innerHTML = activeClient.orders.map((order) => `<article class="client-order"><div class="client-order-head"><code>${escapeHtml(order.id)}</code><span class="client-status ${order.lifecycle === 'discontinued' ? '' : 'ready'}">${order.lifecycle === 'discontinued' ? 'PRODUCT UPDATE AVAILABLE' : escapeHtml(order.status.toUpperCase())}</span></div><div class="client-order-body"><div><h3>${escapeHtml(order.model)}</h3><p>${escapeHtml(order.note)}</p></div><dl><div><dt>Quantity</dt><dd>${escapeHtml(order.quantity)} units</dd></div><div><dt>Ordered</dt><dd>${formatDate(order.orderedAt)}</dd></div><div><dt>Delivered</dt><dd>${formatDate(order.deliveredAt)}</dd></div><div><dt>Destination</dt><dd>${escapeHtml(order.destination)}</dd></div></dl></div></article>`).join('');
}

function renderInquiries() {
  const inquiries = matchingInquiries();
  document.querySelector('#client-inquiry-count').textContent = String(inquiries.length);
  document.querySelector('#client-inquiry-email').textContent = activeClient.email;
  const container = document.querySelector('#client-inquiry-list');
  if (!inquiries.length) {
    container.innerHTML = '<div class="client-empty"><strong>No matching local inquiries</strong><p>Submit the website RFQ form using this account email, then return here to review the shared record.</p></div>';
    return;
  }
  container.innerHTML = inquiries.map((lead) => `<article class="client-inquiry"><div class="client-inquiry-top"><code>${escapeHtml(lead.reference)}</code><span class="client-status ready">${escapeHtml(lead.stage.toUpperCase())}</span></div><h3>${escapeHtml(lead.models?.join(', ') || 'General seating inquiry')}</h3><p>${escapeHtml(lead.requestType)} · ${escapeHtml(lead.quantity || 'Quantity not specified')} units · ${escapeHtml(lead.destination || 'Destination not specified')}</p><p>Submitted ${formatDate(lead.createdAt)} · Sales owner: ${escapeHtml(lead.owner || 'Unassigned')}</p></article>`).join('');
}

function fillProfile() {
  document.querySelector('#client-profile-name').value = activeClient.name;
  document.querySelector('#client-profile-company').value = activeClient.company;
  document.querySelector('#client-profile-email').value = activeClient.email;
  document.querySelector('#client-profile-phone').value = activeClient.phone;
  document.querySelector('#client-profile-country').value = activeClient.country;
  document.querySelector('#client-profile-owner').value = activeClient.owner;
  document.querySelector('#client-profile-address').value = activeClient.address;
  document.querySelector('#client-pref-products').checked = activeClient.preferences.productUpdates;
  document.querySelector('#client-pref-orders').checked = activeClient.preferences.orderUpdates;
}

function renderDashboard() {
  document.querySelector('#client-company-title').textContent = activeClient.company;
  document.querySelector('#client-welcome').textContent = `${activeClient.name} · ${activeClient.country || 'Market not specified'} · ${activeClient.email}`;
  document.querySelector('#client-order-count').textContent = String(activeClient.orders.length);
  document.querySelector('#client-update-count').textContent = String(activeClient.updates.length);
  document.querySelector('#client-owner-name').textContent = activeClient.owner;
  renderUpdates();
  renderReplacements();
  renderQuoteRooms();
  renderOrders();
  renderInquiries();
  fillProfile();
}

signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!signInForm.reportValidity()) return;
  const button = signInForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const account = await authenticateClient(signInForm.elements.email.value, signInForm.elements.password.value);
    if (!account) {
      showMessage(document.querySelector('#client-sign-in-message'), 'Those details do not match a local client account. Try the fictional demo buyer or create a local account.', true);
      return;
    }
    startClientSession(account);
    signInForm.reset();
    showMessage(document.querySelector('#client-sign-in-message'));
    showDashboard(account);
  } finally {
    button.disabled = false;
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!registerForm.reportValidity()) return;
  const button = registerForm.querySelector('[type="submit"]');
  button.disabled = true;
  const data = new FormData(registerForm);
  try {
    const result = await registerClientAccount(Object.fromEntries(data.entries()));
    if (result.error) {
      const messages = { exists: 'A local account already uses this email. Sign in instead.', invalid: 'Complete the required fields and use a demo password of at least 8 characters.', storage: 'This browser could not save the account. Check storage permissions and try again.' };
      showMessage(document.querySelector('#client-register-message'), messages[result.error] || messages.invalid, true);
      return;
    }
    startClientSession(result.account);
    registerForm.reset();
    showMessage(document.querySelector('#client-register-message'));
    showDashboard(result.account);
  } finally {
    button.disabled = false;
  }
});

document.querySelector('#client-profile-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity() || !activeClient) return;
  const updated = updateClientAccount(activeClient.id, () => ({
    name: document.querySelector('#client-profile-name').value,
    company: document.querySelector('#client-profile-company').value,
    phone: document.querySelector('#client-profile-phone').value,
    country: document.querySelector('#client-profile-country').value,
    address: document.querySelector('#client-profile-address').value,
    preferences: { productUpdates: document.querySelector('#client-pref-products').checked, orderUpdates: document.querySelector('#client-pref-orders').checked }
  }));
  const message = document.querySelector('#client-profile-message');
  if (!updated) {
    showMessage(message, 'The profile could not be saved. Check browser storage permissions.', true);
    return;
  }
  activeClient = updated;
  renderDashboard();
  showMessage(message, 'Business profile saved in this browser. Sales can review it from the client workspace.');
});

document.querySelector('#client-sign-out').addEventListener('click', () => {
  endClientSession();
  activeClient = null;
  if (quoteConfirm.open) quoteConfirm.close();
  dashboard.hidden = true;
  loginView.hidden = false;
  document.title = 'Client Account | ZJ Seating';
  switchAuth('sign-in');
  window.scrollTo({ top: 0, behavior: 'instant' });
});

const existing = getAuthenticatedClient();
if (existing) showDashboard(existing);
else switchAuth('sign-in');
