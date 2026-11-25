import './admin.css';
import { products } from './products.js';
import { initQuotes } from './quotes.js';
import { getDisclosure } from './disclosure.js';
import QRCode from 'qrcode';
import { publicProducts } from './public-products.js';
import { initSocial } from './social.js';
import { initSandbox } from './sandbox.js';
import { initEmployeeAuth } from './employee-auth.js';
import { initClients } from './clients.js';

const prospects = [
  { company: 'Northline Workspace', contact: 'Maya Chen', email: 'maya@northline.example', market: 'Canada', segment: 'Office dealer', interest: '8413H-GR', stage: 'New', next: 'Draft introduction', insight: 'I noticed your focus on adaptable workspace packages for growing teams.' },
  { company: 'Arden Office Collective', contact: 'Oliver Grant', email: 'oliver@arden.example', market: 'United Kingdom', segment: 'Contract furniture', interest: '9628H', stage: 'Contacted', next: 'Follow up Nov 25', insight: 'Your recent workplace projects suggest a fit for premium executive and collaborative seating.' },
  { company: 'KontorHaus', contact: 'Jonas Weber', email: 'jonas@kontorhaus.example', market: 'Germany', segment: 'Importer', interest: '8412H-BK', stage: 'Replied', next: 'Send specifications', insight: 'You mentioned reviewing mesh-chair suppliers for your next contract collection.' },
  { company: 'Workwell Projects', contact: 'Sofia Martins', email: 'sofia@workwell.example', market: 'Portugal', segment: 'Project dealer', interest: '9628H', stage: 'Qualified', next: 'Prepare quotation', insight: 'Your current project pipeline includes executive workspaces where comfort and finish options matter.' },
  { company: 'Sora Living', contact: 'Ava Nielsen', email: 'ava@soraliving.example', market: 'Denmark', segment: 'Furniture retailer', interest: 'YKX-33016', stage: 'New', next: 'Review account fit', insight: 'Your curved and modular living collections align with our compressed sofa range.' },
  { company: 'Atelier Forma', contact: 'Léo Bernard', email: 'leo@atelierforma.example', market: 'France', segment: 'Design retailer', interest: 'YKX-33090BR', stage: 'Contacted', next: 'Share sofa collection', insight: 'Your modular living edit looks like a strong context for combination-friendly compressed seating.' }
];

const rfqs = [
  { company: 'Workwell Projects', model: '9628H', quantity: '300 pcs', market: 'Portugal', stage: 'Quote follow-up', prospect: 3 },
  { company: 'KontorHaus', model: '8412H-BK', quantity: '200 pcs', market: 'Germany', stage: 'Specification review', prospect: 2 },
  { company: 'Northline Workspace', model: '8413H-GR', quantity: '2 samples', market: 'Canada', stage: 'Sample request', prospect: 0 },
  { company: 'Sora Living', model: 'YKX-33016', quantity: '100 pcs', market: 'Denmark', stage: 'New inquiry', prospect: 4 }
];

const defaultTasks = [
  { id: 'task-1', title: 'Follow up on 9628H quotation', owner: 'Jordan', done: false },
  { id: 'task-2', title: 'Verify document scope before external sharing', owner: 'QA', done: false },
  { id: 'task-3', title: 'Review five first-touch drafts', owner: 'Marketing', done: false },
  { id: 'task-4', title: 'Scan-test printed QR codes on iOS and Android', owner: 'Operations', done: false }
];

const storageKey = 'zj-employee-concept-v1';
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return {
      tasks: Array.isArray(saved?.tasks) ? saved.tasks : structuredClone(defaultTasks),
      drafts: Array.isArray(saved?.drafts) ? saved.drafts : [],
      suppression: Array.isArray(saved?.suppression) ? saved.suppression : [],
      quotes: Array.isArray(saved?.quotes) ? saved.quotes : []
    };
  } catch {
    return { tasks: structuredClone(defaultTasks), drafts: [], suppression: [], quotes: [] };
  }
}
const state = loadState();
function saveState() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
}

function downloadFile(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

const validViews = ['overview', 'sales', 'clients', 'sandbox', 'approvals', 'quotes', 'outreach', 'social', 'nfc', 'resources', 'tasks', 'readiness'];
function currentView() {
  const view = location.hash.replace('#', '');
  return validViews.includes(view) ? view : 'overview';
}
function closeSidebar() {
  document.body.classList.remove('sidebar-open');
  document.querySelector('#admin-menu-toggle').setAttribute('aria-expanded', 'false');
}
function showView(view) {
  if (!validViews.includes(view) || (view === 'approvals' && activeEmployee?.role !== 'Sales Manager')) view = 'overview';
  document.querySelectorAll('[data-view-panel]').forEach((panel) => { panel.hidden = panel.dataset.viewPanel !== view; });
  document.querySelectorAll('.admin-nav [data-view]').forEach((button) => {
    if (button.dataset.view === view) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  const names = { overview: 'Overview', sales: 'Sales & RFQs', clients: 'Client Accounts', sandbox: 'RFQ Sandbox', approvals: 'Document Approvals', quotes: 'Quotes & Negotiation', outreach: 'Outreach Studio', social: 'Social Team', nfc: 'Products & QR Sharing', resources: 'Resources & SOPs', tasks: 'Tasks & Team', readiness: 'Systems & Readiness' };
  document.title = `${names[view]} | ZJ Seating Employee Operations`;
  closeSidebar();
  document.querySelector('#global-search').value = '';
  document.querySelector('#search-results').hidden = true;
  window.scrollTo({ top: 0, behavior: 'instant' });
}
let activeEmployee = null;

function showAuthenticatedWorkspace(user) {
  activeEmployee = user;
  const approvalsNav = document.querySelector('.admin-nav [data-view="approvals"]');
  if (approvalsNav) approvalsNav.hidden = user.role !== 'Sales Manager';
  document.querySelector('#admin-sidebar').hidden = false;
  document.querySelector('.admin-shell').hidden = false;
  document.querySelector('#workspace-skip').hidden = false;
  document.querySelector('#employee-initials').textContent = user.initials;
  document.querySelector('#employee-name').textContent = user.name;
  document.querySelector('#employee-role').textContent = `${user.role} · Demo`;
  document.querySelector('#sidebar-employee-name').textContent = user.name;
  document.querySelector('#sidebar-employee-role').textContent = `${user.role} · Local demo`;
  document.querySelector('#overview-title').textContent = `Welcome, ${user.name.split(' ')[0]}.`;
  document.querySelector('#new-task-owner').placeholder = `Owner · ${user.name}`;
  showView(currentView());
  window.requestAnimationFrame(() => document.querySelector('#admin-content').focus({ preventScroll: true }));
}

function showLoggedOutWorkspace() {
  activeEmployee = null;
  closeSidebar();
  document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
  document.querySelector('#admin-sidebar').hidden = true;
  document.querySelector('.admin-shell').hidden = true;
  document.querySelector('#workspace-skip').hidden = true;
  window.history.replaceState(null, '', `${location.pathname}${location.search}`);
  showView('overview');
}

function navigate(view) {
  if (location.hash === `#${view}`) showView(view);
  else location.hash = view;
}

document.querySelectorAll('.admin-nav [data-view], [data-view-jump]').forEach((button) => {
  button.addEventListener('click', () => navigate(button.dataset.view || button.dataset.viewJump));
});
window.addEventListener('hashchange', () => showView(currentView()));

document.querySelector('#admin-menu-toggle').addEventListener('click', () => {
  const open = document.body.classList.toggle('sidebar-open');
  document.querySelector('#admin-menu-toggle').setAttribute('aria-expanded', String(open));
});
document.querySelector('#sidebar-scrim').addEventListener('click', closeSidebar);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSidebar();
    document.querySelector('#search-results').hidden = true;
  }
});

document.querySelector('#current-date').textContent = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()) + ' · Here is what needs attention across sales and operations.';

const outreachProspect = document.querySelector('#outreach-prospect');
const outreachProduct = document.querySelector('#outreach-product');
const outreachGoal = document.querySelector('#outreach-goal');
const outreachTone = document.querySelector('#outreach-tone');
const outreachInsight = document.querySelector('#outreach-insight');
const outreachCta = document.querySelector('#outreach-cta');
let currentDraft = null;

outreachProspect.innerHTML = prospects.map((prospect, index) => `<option value="${index}">${prospect.company} · ${prospect.contact}</option>`).join('');
outreachProduct.innerHTML = products.map((product) => `<option value="${product.model}">${product.model} · ${product.label}</option>`).join('');
outreachProduct.value = prospects[0].interest;

function generateDraft() {
  const prospect = prospects[Number(outreachProspect.value)];
  const product = products.find((item) => item.model === outreachProduct.value);
  const message = document.querySelector('#outreach-message');
  message.classList.remove('error');

  if (state.suppression.includes(prospect.email.toLowerCase())) {
    currentDraft = null;
    document.querySelector('#email-subject').textContent = 'Draft blocked';
    document.querySelector('#email-body').textContent = 'This contact is on the local suppression list. Remove the suppression only after an authorized review.';
    document.querySelector('#open-email').href = 'mailto:';
    message.textContent = 'Do not contact: this address is suppressed.';
    message.classList.add('error');
    return;
  }

  const firstName = prospect.contact.split(' ')[0];
  const goal = outreachGoal.value;
  const tone = outreachTone.value;
  const subjectOptions = {
    Introduction: `${product.model} for ${prospect.company}'s seating range`,
    'Follow-up': `Re: ${product.model} for ${prospect.company}`,
    'Sample offer': `${product.model} sample proposal for ${prospect.company}`,
    'Catalog request': `ZJ Seating specifications for your ${product.label.toLowerCase()} review`
  };
  const openingOptions = {
    Introduction: outreachInsight.value.trim(),
    'Follow-up': `I wanted to follow up on my previous note with something more specific: ${product.model} may be relevant to your ${prospect.segment.toLowerCase()} range. ${outreachInsight.value.trim()}`,
    'Sample offer': `Following your seating requirements, I wanted to suggest a practical sample route for ${product.model}. ${outreachInsight.value.trim()}`,
    'Catalog request': `I wanted to share a focused product option rather than a full catalog: ${product.model}. ${outreachInsight.value.trim()}`
  };
  const toneBridge = {
    Direct: 'The key details:',
    Consultative: 'It may be useful to compare the fit for your range:',
    Warm: 'I thought this one was worth sharing because:'
  };
  const productFacts = [product.summary, product.moq ? `The published MOQ is ${product.moq}` : '', product.loading ? `with ${product.loading} loading` : ''].filter(Boolean).join(' ');
  const body = `Hi ${firstName},\n\n${openingOptions[goal]}\n\n${toneBridge[tone]} ${product.name}. ${productFacts}. Materials, colors, and packaging can be discussed around your market requirements.\n\n${outreachCta.value}\n\nBest regards,\nJordan Lee\nZJ Seating\ninfo@zjseating.com\n\nIf this is not relevant, reply “no thanks” and I will not follow up.`;

  currentDraft = {
    id: `draft-${Date.now()}`,
    prospectIndex: Number(outreachProspect.value),
    productModel: product.model,
    goal,
    tone,
    insight: outreachInsight.value.trim(),
    cta: outreachCta.value,
    subject: subjectOptions[goal],
    body,
    email: prospect.email,
    company: prospect.company,
    savedAt: new Date().toISOString()
  };
  document.querySelector('#email-subject').textContent = currentDraft.subject;
  document.querySelector('#email-body').textContent = body;
  document.querySelector('#open-email').href = `mailto:${prospect.email}?subject=${encodeURIComponent(currentDraft.subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#draft-status').textContent = '';
  message.textContent = 'Draft generated. Review personalization and suppression status before use.';
}

document.querySelector('#outreach-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  generateDraft();
});
outreachProspect.addEventListener('change', () => {
  const prospect = prospects[Number(outreachProspect.value)];
  outreachProduct.value = prospect.interest;
  outreachInsight.value = prospect.insight;
  generateDraft();
});
outreachProduct.addEventListener('change', generateDraft);
outreachGoal.addEventListener('change', generateDraft);
outreachTone.addEventListener('change', generateDraft);
outreachCta.addEventListener('change', generateDraft);

function loadOutreach(index, model = '', goal = 'Introduction') {
  const prospect = prospects[index];
  outreachProspect.value = String(index);
  outreachProduct.value = model || prospect.interest;
  outreachGoal.value = goal;
  outreachInsight.value = goal === 'Follow-up' ? `I am following up on your ${model || prospect.interest} inquiry so we can keep the next step clear.` : prospect.insight;
  generateDraft();
  navigate('outreach');
}

document.querySelectorAll('[data-new-outreach]').forEach((button) => {
  button.addEventListener('click', () => {
    loadOutreach(0);
    setTimeout(() => outreachProspect.focus(), 50);
  });
});

document.querySelector('#copy-subject').addEventListener('click', async () => {
  if (!currentDraft) return;
  const copied = await copyText(currentDraft.subject);
  document.querySelector('#draft-status').textContent = copied ? 'Subject copied.' : 'Copy unavailable. Select the subject text instead.';
});
document.querySelector('#copy-email').addEventListener('click', async () => {
  if (!currentDraft) return;
  const copied = await copyText(`${currentDraft.subject}\n\n${currentDraft.body}`);
  document.querySelector('#draft-status').textContent = copied ? 'Subject and email body copied.' : 'Copy unavailable. Select the draft text instead.';
});
document.querySelector('#open-email').addEventListener('click', (event) => {
  if (!currentDraft) {
    event.preventDefault();
    document.querySelector('#draft-status').textContent = 'Generate an unsuppressed draft before opening the email client.';
  }
});

function renderDrafts() {
  const container = document.querySelector('#saved-drafts');
  if (!state.drafts.length) {
    container.innerHTML = '<p>No saved drafts yet. Generate and save a message to see it here.</p>';
    return;
  }
  container.innerHTML = state.drafts.map((draft) => `<article class="saved-draft"><div><strong>${draft.company} · ${draft.productModel}</strong><small>${draft.subject}</small></div><button type="button" data-load-draft="${draft.id}">Load draft</button></article>`).join('');
}
document.querySelector('#save-draft').addEventListener('click', () => {
  if (!currentDraft) {
    document.querySelector('#draft-status').textContent = 'There is no approved draft to save.';
    return;
  }
  const saved = { ...currentDraft, id: `draft-${Date.now()}`, savedAt: new Date().toISOString() };
  state.drafts = [saved, ...state.drafts.filter((draft) => !(draft.company === saved.company && draft.productModel === saved.productModel && draft.subject === saved.subject))].slice(0, 8);
  saveState();
  renderDrafts();
  document.querySelector('#draft-status').textContent = 'Draft saved in this browser only.';
});
document.querySelector('#saved-drafts').addEventListener('click', (event) => {
  const button = event.target.closest('[data-load-draft]');
  if (!button) return;
  const draft = state.drafts.find((item) => item.id === button.dataset.loadDraft);
  if (!draft) return;
  outreachProspect.value = String(draft.prospectIndex);
  outreachProduct.value = draft.productModel;
  outreachGoal.value = draft.goal;
  outreachTone.value = draft.tone;
  outreachInsight.value = draft.insight;
  outreachCta.value = draft.cta;
  currentDraft = draft;
  document.querySelector('#email-subject').textContent = draft.subject;
  document.querySelector('#email-body').textContent = draft.body;
  document.querySelector('#open-email').href = `mailto:${draft.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  document.querySelector('#draft-status').textContent = 'Saved draft loaded for review.';
});

function renderSuppression() {
  const container = document.querySelector('#suppression-list');
  if (!state.suppression.length) {
    container.innerHTML = '<p>No local suppression entries. Connect the production list before sending.</p>';
    return;
  }
  container.innerHTML = state.suppression.map((email) => `<div><code>${email}</code><button type="button" data-remove-suppression="${email}" aria-label="Remove ${email} from suppression">Remove</button></div>`).join('');
}
document.querySelector('#suppression-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#suppression-email');
  if (!input.reportValidity()) return;
  const email = input.value.trim().toLowerCase();
  if (!state.suppression.includes(email)) state.suppression.push(email);
  saveState();
  renderSuppression();
  generateDraft();
  input.value = '';
});
document.querySelector('#suppression-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-suppression]');
  if (!button) return;
  state.suppression = state.suppression.filter((email) => email !== button.dataset.removeSuppression);
  saveState();
  renderSuppression();
  generateDraft();
});

const loadQuote = initQuotes({ products, prospects, state, saveState, downloadFile, copyText, escapeHtml, navigate, getEmployee: () => activeEmployee });
initSocial({ products: publicProducts, downloadFile, copyText, escapeHtml });
initClients({ escapeHtml, navigate, getEmployee: () => activeEmployee, copyText });
initSandbox({ escapeHtml, downloadFile, copyText, navigate, getQuotes: () => state.quotes, prospects, getEmployee: () => activeEmployee });

function renderRfqs() {
  document.querySelector('#rfq-grid').innerHTML = rfqs.map((rfq) => `<article class="rfq-card"><span>${rfq.stage.toUpperCase()}</span><h3>${rfq.model}</h3><p>${rfq.company}</p><dl><div><dt>Quantity</dt><dd>${rfq.quantity}</dd></div><div><dt>Market</dt><dd>${rfq.market}</dd></div></dl><div class="rfq-actions"><button type="button" data-rfq-quote="${rfq.prospect}" data-model="${rfq.model}" data-quantity="${Number.parseInt(rfq.quantity, 10) || 1}">Prepare quote</button><button type="button" data-rfq-followup="${rfq.prospect}" data-model="${rfq.model}">Create follow-up</button></div></article>`).join('');
}
document.querySelector('#rfq-grid').addEventListener('click', (event) => {
  const quoteButton = event.target.closest('[data-rfq-quote]');
  if (quoteButton) {
    loadQuote(Number(quoteButton.dataset.rfqQuote), quoteButton.dataset.model, Number(quoteButton.dataset.quantity));
    return;
  }
  const button = event.target.closest('[data-rfq-followup]');
  if (button) loadOutreach(Number(button.dataset.rfqFollowup), button.dataset.model, 'Follow-up');
});

function renderProspects() {
  const query = document.querySelector('#prospect-search').value.trim().toLowerCase();
  const stage = document.querySelector('#prospect-filter').value;
  const filtered = prospects.map((prospect, index) => ({ ...prospect, index })).filter((prospect) => {
    const matchesQuery = `${prospect.company} ${prospect.contact} ${prospect.market} ${prospect.segment}`.toLowerCase().includes(query);
    return matchesQuery && (stage === 'all' || prospect.stage === stage);
  });
  document.querySelector('#prospect-table').innerHTML = filtered.length ? filtered.map((prospect) => `<tr><td><strong>${prospect.company}</strong><small>${prospect.segment}</small></td><td><strong>${prospect.contact}</strong><small>${prospect.email}</small></td><td>${prospect.market}</td><td>${prospect.interest}</td><td><span class="stage-pill ${prospect.stage.toLowerCase()}">${prospect.stage}</span></td><td>${prospect.next}</td><td><button type="button" data-prospect-draft="${prospect.index}">Draft</button></td></tr>`).join('') : '<tr><td colspan="7" class="empty-row">No sample accounts match this search.</td></tr>';
  document.querySelector('#prospect-count').textContent = `${filtered.length} of ${prospects.length} sample accounts`;
}
document.querySelector('#prospect-search').addEventListener('input', renderProspects);
document.querySelector('#prospect-filter').addEventListener('change', renderProspects);
document.querySelector('#prospect-table').addEventListener('click', (event) => {
  const button = event.target.closest('[data-prospect-draft]');
  if (button) loadOutreach(Number(button.dataset.prospectDraft));
});

const nfcProduct = document.querySelector('#nfc-product');
nfcProduct.innerHTML = products.map((product) => `<option value="${product.model}">${product.model} · ${product.name.replace(`${product.model} `, '')}</option>`).join('');
nfcProduct.value = '8413H-GR';
document.querySelector('#nfc-base-url').value = 'https://www.zjseating.com';

function nfcUrl(productModel, includeBatch = true) {
  const base = document.querySelector('#nfc-base-url').value.trim().replace(/\/+$/, '');
  const batch = document.querySelector('#nfc-batch').value.trim();
  const params = new URLSearchParams({ model: productModel });
  if (includeBatch && batch) params.set('batch', batch);
  return `${base}/product.html?${params.toString()}`;
}
let qrGeneration = 0;
async function updateNfc() {
  const generation = ++qrGeneration;
  const product = products.find((item) => item.model === nfcProduct.value);
  const disclosure = getDisclosure(product);
  const url = nfcUrl(product.model);
  document.querySelector('#nfc-image').src = product.image;
  document.querySelector('#nfc-image').alt = product.alt;
  document.querySelector('#nfc-label').textContent = `${product.label} · ${disclosure.badge}`;
  document.querySelector('#nfc-model').textContent = product.model;
  document.querySelector('#nfc-summary').textContent = product.summary;
  document.querySelector('#nfc-url').textContent = url;
  document.querySelector('#nfc-disclosure').textContent = `${disclosure.badge}: ${disclosure.note}`;
  document.querySelector('#open-nfc-product').href = `./product.html?${new URLSearchParams({ model: product.model }).toString()}`;
  document.querySelector('#nfc-status').textContent = '';
  try {
    const qr = await QRCode.toDataURL(url, { width: 640, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#142536', light: '#f8faf9' } });
    if (generation !== qrGeneration) return false;
    document.querySelector('#nfc-qr-image').src = qr;
    const download = document.querySelector('#download-nfc-qr');
    download.href = qr;
    download.download = `zj-${product.model.toLowerCase()}-qr.png`;
    download.hidden = false;
    return true;
  } catch {
    if (generation === qrGeneration) {
      document.querySelector('#download-nfc-qr').hidden = true;
      document.querySelector('#nfc-status').textContent = 'QR generation is unavailable. Copy the URL and try again.';
    }
    return false;
  }
}
document.querySelector('#nfc-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const updated = await updateNfc();
  if (updated) document.querySelector('#nfc-status').textContent = 'QR updated. Test the printed code before production use.';
});
nfcProduct.addEventListener('change', updateNfc);
document.querySelector('#copy-nfc-url').addEventListener('click', async () => {
  const copied = await copyText(document.querySelector('#nfc-url').textContent);
  document.querySelector('#nfc-status').textContent = copied ? 'Product destination copied for QR or optional NFC use.' : 'Copy unavailable. Select the URL instead.';
});
document.querySelector('#export-nfc').addEventListener('click', () => {
  const batch = document.querySelector('#nfc-batch').value.trim();
  const rows = [['Model', 'Disclosure tier', 'Product URL', 'Batch reference'], ...products.map((product) => [product.model, getDisclosure(product).tier, nfcUrl(product.model), batch])];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
  downloadFile('zj-seating-qr-product-urls.csv', csv, 'text/csv;charset=utf-8');
  document.querySelector('#nfc-status').textContent = 'CSV prepared for all 24 product models, including disclosure tiers.';
});

let taskFilter = 'all';
function renderTasks() {
  const visible = state.tasks.filter((task) => taskFilter === 'all' || (taskFilter === 'done' ? task.done : !task.done));
  const container = document.querySelector('#task-list');
  container.innerHTML = visible.length ? visible.map((task) => {
    const id = escapeHtml(task.id);
    const title = escapeHtml(task.title);
    const owner = escapeHtml(task.owner);
    return `<article class="task-item ${task.done ? 'done' : ''}"><input type="checkbox" id="${id}" data-task-check="${id}" ${task.done ? 'checked' : ''}><div><label for="${id}"><strong>${title}</strong></label><small>${owner} · ${task.done ? 'Completed' : 'Open'}</small></div><button type="button" data-task-delete="${id}" aria-label="Delete task ${title}">×</button></article>`;
  }).join('') : '<p>No tasks in this view.</p>';
  const openCount = state.tasks.filter((task) => !task.done).length;
  document.querySelector('#task-nav-count').textContent = String(openCount);
}
document.querySelectorAll('[data-task-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    taskFilter = button.dataset.taskFilter;
    document.querySelectorAll('[data-task-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderTasks();
  });
});
document.querySelector('#task-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.querySelector('#new-task');
  const owner = document.querySelector('#new-task-owner');
  if (!event.currentTarget.reportValidity()) return;
  state.tasks.push({ id: `task-${Date.now()}`, title: title.value.trim(), owner: owner.value.trim(), done: false });
  title.value = '';
  owner.value = '';
  saveState();
  renderTasks();
});
document.querySelector('#task-list').addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-task-check]');
  if (!checkbox) return;
  const task = state.tasks.find((item) => item.id === checkbox.dataset.taskCheck);
  if (task) task.done = checkbox.checked;
  saveState();
  renderTasks();
});
document.querySelector('#task-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-task-delete]');
  if (!button) return;
  state.tasks = state.tasks.filter((task) => task.id !== button.dataset.taskDelete);
  saveState();
  renderTasks();
});

function exportWorkspace() {
  downloadFile('zj-employee-concept-workspace.json', JSON.stringify({ exportedAt: new Date().toISOString(), conceptOnly: true, tasks: state.tasks, drafts: state.drafts, suppression: state.suppression, quotes: state.quotes }, null, 2), 'application/json');
}
document.querySelector('#export-workspace').addEventListener('click', exportWorkspace);
document.querySelector('#download-workspace').addEventListener('click', exportWorkspace);

document.querySelectorAll('[data-reset-demo]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!window.confirm('Reset locally saved drafts, tasks, quotation versions, and suppression entries to the original demo state?')) return;
    localStorage.removeItem(storageKey);
    location.reload();
  });
});

const globalSearch = document.querySelector('#global-search');
const searchResults = document.querySelector('#search-results');
globalSearch.addEventListener('input', () => {
  const query = globalSearch.value.trim().toLowerCase();
  if (query.length < 2) {
    searchResults.hidden = true;
    return;
  }
  const accountResults = prospects.map((prospect, index) => ({ type: 'account', index, title: prospect.company, subtitle: `${prospect.contact} · ${prospect.market}` })).filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(query));
  const productResults = products.filter((product) => `${product.model} ${product.name} ${product.label}`.toLowerCase().includes(query)).map((product) => ({ type: 'product', model: product.model, title: product.model, subtitle: product.name }));
  const results = [...accountResults, ...productResults].slice(0, 7);
  searchResults.innerHTML = results.length ? results.map((item) => `<button type="button" data-search-type="${item.type}" data-search-value="${item.type === 'account' ? item.index : item.model}"><div><strong>${item.title}</strong><small>${item.subtitle}</small></div><span>${item.type === 'account' ? 'OUTREACH' : 'QR LINK'}</span></button>`).join('') : '<p>No prospects or products found.</p>';
  searchResults.hidden = false;
});
searchResults.addEventListener('click', (event) => {
  const button = event.target.closest('[data-search-type]');
  if (!button) return;
  if (button.dataset.searchType === 'account') loadOutreach(Number(button.dataset.searchValue));
  else {
    nfcProduct.value = button.dataset.searchValue;
    updateNfc();
    navigate('nfc');
  }
  searchResults.hidden = true;
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.search-wrap')) searchResults.hidden = true;
});

renderRfqs();
renderProspects();
renderDrafts();
renderSuppression();
renderTasks();
updateNfc();
generateDraft();
showView(currentView());
initEmployeeAuth({ onAuthenticated: showAuthenticatedWorkspace, onLoggedOut: showLoggedOutWorkspace });
