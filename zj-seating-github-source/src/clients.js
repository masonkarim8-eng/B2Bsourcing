import './clients.css';
import { readClientAccounts, updateClientAccount } from './client-store.js';
import { readLocalLeads } from './lead-handoff.js';
import { readQuoteRooms } from './quote-room-store.js';

const formatDate = (value) => {
  const date = new Date(value || '');
  return Number.isNaN(date.getTime()) ? 'Not recorded' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
};

export function initClients({ escapeHtml, navigate, getEmployee = () => null, copyText }) {
  const salesButton = document.querySelector('.admin-nav [data-view="sales"]');
  const navButton = document.createElement('button');
  navButton.type = 'button';
  navButton.dataset.view = 'clients';
  navButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-15h5v14h-5M18 10h3m-3 4h3"/></svg>Client accounts<span class="nav-count" id="client-nav-count">0</span>';
  salesButton.insertAdjacentElement('afterend', navButton);
  navButton.addEventListener('click', () => navigate('clients'));

  document.querySelector('#view-quotes').insertAdjacentHTML('beforebegin', `
    <section class="admin-view" id="view-clients" data-view-panel="clients" aria-labelledby="clients-title" hidden>
      <div class="view-heading"><div><p class="overline">SAVED PROFILES · ORDER HISTORY · LIFECYCLE</p><h1 id="clients-title">Client accounts</h1><p>Review what returning buyers saved, what they previously ordered, and where a product change creates a proactive sales opportunity.</p></div><span class="connection-badge">BROWSER-LOCAL CRM CONCEPT</span></div>
      <div class="sandbox-notice"><strong>Shared same-browser demo</strong><span>Client profiles and website RFQs use local storage. No production account, CRM, ERP, or external notification service is connected.</span></div>
      <div class="metric-grid client-metrics"><article class="metric-card"><span>CLIENT ACCOUNTS</span><strong id="client-account-total">0</strong><small>Demo + locally registered buyers</small></article><article class="metric-card"><span>ORDER RECORDS</span><strong id="client-order-total">0</strong><small>Across saved client histories</small></article><article class="metric-card"><span>UPDATES TO PREPARE</span><strong id="client-update-total">0</strong><small>Replacement outreach opportunities</small></article><article class="metric-card"><span>MATCHING RFQS</span><strong id="client-rfq-total">0</strong><small>Matched by account email</small></article></div>
      <section class="panel"><div class="panel-heading"><div><p class="overline">RETURNING BUYERS</p><h2>Account directory</h2><p>Open a client to inspect their saved details, orders, inquiries, and lifecycle draft.</p></div><span class="sample-tag">NO EXTERNAL DELIVERY</span></div><div class="table-toolbar client-directory-tools"><label>Search clients<input id="client-directory-search" type="search" placeholder="Company, contact, email, market, or owner"></label><label>Account filter<select id="client-directory-filter"><option value="all">All client accounts</option><option value="updates">Updates to prepare</option><option value="repeat">Clients with order history</option><option value="new">New accounts without orders</option></select></label></div><p class="table-status" id="client-directory-count" role="status"></p><div class="client-account-grid" id="client-account-grid"></div><p class="form-message" id="clients-status" role="status"></p></section>
    </section>`);
  document.body.insertAdjacentHTML('beforeend', '<dialog class="client-record-dialog" id="client-record-dialog" aria-labelledby="client-record-title"><button class="client-record-close" id="client-record-close" type="button" aria-label="Close client account">×</button><div id="client-record-content"></div></dialog>');

  const grid = document.querySelector('#client-account-grid');
  const search = document.querySelector('#client-directory-search');
  const filter = document.querySelector('#client-directory-filter');
  const dialog = document.querySelector('#client-record-dialog');
  const content = document.querySelector('#client-record-content');
  const leadsFor = (account) => readLocalLeads().filter((lead) => String(lead.email || '').trim().toLowerCase() === account.email.toLowerCase());
  const pendingUpdates = (account) => account.updates.filter((update) => update.status !== 'Draft ready');
  const quoteMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);

  function quoteRoomMarkup(account) {
    const rooms = readQuoteRooms(account.id).sort((a, b) => String(b.sharedAt).localeCompare(String(a.sharedAt)));
    const awaiting = rooms.filter((room) => room.status === 'Awaiting client').length;
    const revisions = rooms.filter((room) => room.status === 'Revision requested').length;
    return `<section class="client-record-section client-record-quotes"><div class="client-record-section-heading"><h3>Client quote room</h3><span>${awaiting} awaiting · ${revisions} revision${revisions === 1 ? '' : 's'} requested</span></div>${rooms.length ? `<div class="client-record-quote-list">${rooms.map((room) => {
      const badgeClass = room.status === 'Accepted' ? '' : room.status === 'Superseded' ? 'superseded' : 'due';
      const revisionAction = room.status === 'Revision requested' ? `<button class="admin-secondary" type="button" data-client-quote-revise="${escapeHtml(room.id)}" data-quote-snapshot="${escapeHtml(room.quoteSnapshotId)}">Load original V${escapeHtml(room.version)} for revision</button>` : '';
      const decision = room.decision ? `<div class="client-record-quote-decision"><strong>${room.decision.type === 'accepted' ? 'Client accepted this demo version' : 'Client change request'}</strong><p>${escapeHtml(room.decision.note || 'No additional note was added.')}</p><small>${escapeHtml(room.decision.by)} · ${formatDate(room.decision.at)}</small></div>` : '';
      return `<article class="client-record-quote"><div class="client-record-quote-top"><code>${escapeHtml(room.quoteId)} · V${escapeHtml(room.version)}</code><span class="client-lifecycle-badge ${badgeClass}">${escapeHtml(room.status.toUpperCase())}</span></div><strong>${escapeHtml(room.quote.productModel)} · ${escapeHtml(room.quote.productName)}</strong><p>${escapeHtml(room.quote.quantity)} ${escapeHtml(room.quote.unit)} · ${quoteMoney(room.quote.total)}</p><small>Shared by ${escapeHtml(room.sharedBy)} · ${formatDate(room.sharedAt)}</small>${decision}${revisionAction}</article>`;
    }).join('')}</div>` : '<p class="client-record-empty">No approved quotation version has been shared with this client yet.</p>'}</section>`;
  }

  function renderDirectory() {
    const accounts = readClientAccounts();
    const query = search.value.trim().toLowerCase();
    const visible = accounts.filter((account) => {
      const haystack = `${account.company} ${account.name} ${account.email} ${account.country} ${account.owner}`.toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filter.value === 'updates' && !pendingUpdates(account).length) return false;
      if (filter.value === 'repeat' && !account.orders.length) return false;
      if (filter.value === 'new' && account.orders.length) return false;
      return true;
    });
    const allLeads = readLocalLeads();
    document.querySelector('#client-account-total').textContent = String(accounts.length);
    document.querySelector('#client-order-total').textContent = String(accounts.reduce((sum, account) => sum + account.orders.length, 0));
    document.querySelector('#client-update-total').textContent = String(accounts.reduce((sum, account) => sum + pendingUpdates(account).length, 0));
    document.querySelector('#client-rfq-total').textContent = String(accounts.reduce((sum, account) => sum + leadsFor(account).length, 0));
    document.querySelector('#client-nav-count').textContent = String(accounts.reduce((sum, account) => sum + pendingUpdates(account).length, 0));
    document.querySelector('#client-directory-count').textContent = `${visible.length} of ${accounts.length} client accounts · ${allLeads.length} total local RFQs`;
    if (!visible.length) {
      grid.innerHTML = '<div class="client-directory-empty"><strong>No client accounts match</strong><p>Clear the search or choose another account filter.</p></div>';
      return;
    }
    grid.innerHTML = visible.map((account) => {
      const due = pendingUpdates(account).length;
      const inquiries = leadsFor(account).length;
      return `<article class="client-account-card"><div class="client-account-card-top"><span class="client-account-avatar" aria-hidden="true">${escapeHtml(account.company.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase())}</span><div><span class="client-account-kind">${account.demo ? 'FICTIONAL DEMO BUYER' : 'LOCAL CLIENT PROFILE'}</span><h3>${escapeHtml(account.company)}</h3></div></div><p>${escapeHtml(account.name)} · ${escapeHtml(account.country || 'Market not saved')}</p><a href="mailto:${escapeHtml(account.email)}">${escapeHtml(account.email)}</a><dl><div><dt>Sales owner</dt><dd>${escapeHtml(account.owner)}</dd></div><div><dt>Orders</dt><dd>${account.orders.length}</dd></div><div><dt>Local RFQs</dt><dd>${inquiries}</dd></div><div><dt>Profile saved</dt><dd>${formatDate(account.updatedAt)}</dd></div></dl><div class="client-account-card-footer"><span class="client-lifecycle-badge ${due ? 'due' : ''}">${due ? `${due} UPDATE${due > 1 ? 'S' : ''} TO PREPARE` : 'NO PENDING UPDATES'}</span><button class="admin-secondary" type="button" data-client-open="${escapeHtml(account.id)}">Open client <span aria-hidden="true">→</span></button></div></article>`;
    }).join('');
  }

  function updateDraft(account, update) {
    const order = account.orders.find((item) => item.id === update.orderId);
    const employee = getEmployee();
    const preparedBy = employee?.name || 'Sales demo user';
    const subject = `Product succession review for ${update.model}`;
    const body = `Hello ${account.name},\n\nOur records show that your previous order ${update.orderId} included ${update.model}${order?.quantity ? ` (${order.quantity} units)` : ''}. We would like to review current successors before your next seating program.\n\n${update.recommendation}\n\nThis is a browser-local simulated draft only. Confirm genuine product availability, specifications, pricing, and customer consent before any external outreach.\n\nBest regards,\n${preparedBy}\nZJ Seating`;
    return { subject, body, preparedBy, preparedAt: new Date().toISOString() };
  }

  function openClient(id) {
    const account = readClientAccounts().find((item) => item.id === id);
    if (!account) return;
    const inquiries = leadsFor(account);
    content.innerHTML = `<p class="overline">CLIENT 360 · LOCAL RECORD</p><h2 id="client-record-title">${escapeHtml(account.company)}</h2><p class="client-record-subtitle">${escapeHtml(account.name)} · ${escapeHtml(account.email)} · ${escapeHtml(account.country || 'Market not saved')}</p><div class="client-record-grid"><section><h3>Saved business profile</h3><dl><div><dt>Contact</dt><dd>${escapeHtml(account.name)}</dd></div><div><dt>Phone</dt><dd>${escapeHtml(account.phone || 'Not saved')}</dd></div><div><dt>Business address / region</dt><dd>${escapeHtml(account.address || 'Not saved')}</dd></div><div><dt>Sales owner</dt><dd>${escapeHtml(account.owner)}</dd></div><div><dt>Product updates</dt><dd>${account.preferences.productUpdates ? 'Opted in' : 'Opted out'}</dd></div><div><dt>Order updates</dt><dd>${account.preferences.orderUpdates ? 'Opted in' : 'Opted out'}</dd></div></dl></section><section><h3>Order history</h3>${account.orders.length ? `<div class="client-record-orders">${account.orders.map((order) => `<article><div><code>${escapeHtml(order.id)}</code><span class="client-lifecycle-badge ${order.lifecycle === 'discontinued' ? 'due' : ''}">${order.lifecycle === 'discontinued' ? 'LIFECYCLE UPDATE' : escapeHtml(order.status.toUpperCase())}</span></div><h4>${escapeHtml(order.model)}</h4><p>${escapeHtml(order.quantity)} units · ${escapeHtml(order.destination)}</p><small>Ordered ${formatDate(order.orderedAt)} · Delivered ${formatDate(order.deliveredAt)}</small></article>`).join('')}</div>` : '<p class="client-record-empty">No verified order history in this local account.</p>'}</section></div><section class="client-record-section"><div class="client-record-section-heading"><h3>Product lifecycle actions</h3><span>Draft only · nothing sends automatically</span></div>${account.updates.length ? account.updates.map((update) => `<article class="client-record-update"><div><code>${escapeHtml(update.orderId)}</code><h4>${escapeHtml(update.model)}</h4><p>${escapeHtml(update.recommendation)}</p><span class="client-lifecycle-badge ${update.status === 'Draft ready' ? '' : 'due'}">${update.status === 'Draft ready' ? 'DRAFT READY' : 'UPDATE TO PREPARE'}</span></div><div class="client-record-update-action">${update.draft ? `<pre>${escapeHtml(`Subject: ${update.draft.subject}\n\n${update.draft.body}`)}</pre><small>Prepared by ${escapeHtml(update.preparedBy)} on ${formatDate(update.preparedAt)}. No external message sent.</small><button class="admin-secondary" type="button" data-client-copy="${escapeHtml(account.id)}" data-update-id="${escapeHtml(update.id)}">Copy prepared draft</button>` : `<p>Prepare a relevant, human-reviewed successor message for this returning buyer.</p><button class="admin-primary" type="button" data-client-prepare="${escapeHtml(account.id)}" data-update-id="${escapeHtml(update.id)}">Prepare replacement update</button>`}</div></article>`).join('') : '<p class="client-record-empty">No lifecycle updates attached to this account.</p>'}</section>${quoteRoomMarkup(account)}<section class="client-record-section"><div class="client-record-section-heading"><h3>Matching website inquiries</h3><span>${inquiries.length} record${inquiries.length === 1 ? '' : 's'} matched by email</span></div>${inquiries.length ? `<div class="client-record-rfqs">${inquiries.map((lead) => `<article><code>${escapeHtml(lead.reference)}</code><strong>${escapeHtml(lead.models?.join(', ') || 'General inquiry')}</strong><p>${escapeHtml(lead.requestType)} · ${escapeHtml(lead.stage)} · ${escapeHtml(lead.owner)}</p><small>${formatDate(lead.createdAt)}</small></article>`).join('')}</div>` : '<p class="client-record-empty">No website RFQ currently matches this account email.</p>'}</section>`;
    if (!dialog.open) dialog.showModal();
  }

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-client-open]');
    if (button) openClient(button.dataset.clientOpen);
  });
  content.addEventListener('click', async (event) => {
    const revise = event.target.closest('[data-client-quote-revise]');
    const prepare = event.target.closest('[data-client-prepare]');
    const copy = event.target.closest('[data-client-copy]');
    if (revise) {
      const snapshotId = revise.dataset.quoteSnapshot;
      dialog.close();
      navigate('quotes');
      window.setTimeout(() => {
        const loadButton = [...document.querySelectorAll('[data-load-quote]')].find((button) => button.dataset.loadQuote === snapshotId);
        if (loadButton) loadButton.click();
        else document.querySelector('#quote-save-status').textContent = 'The original quotation snapshot could not be found. No version was changed.';
      }, 0);
      return;
    }
    if (prepare) {
      const account = readClientAccounts().find((item) => item.id === prepare.dataset.clientPrepare);
      const update = account?.updates.find((item) => item.id === prepare.dataset.updateId);
      if (!account || !update) return;
      const draft = updateDraft(account, update);
      const updated = updateClientAccount(account.id, (current) => ({ updates: current.updates.map((item) => item.id === update.id ? { ...item, status: 'Draft ready', preparedAt: draft.preparedAt, preparedBy: draft.preparedBy, draft: { subject: draft.subject, body: draft.body } } : item) }));
      if (updated) {
        document.querySelector('#clients-status').textContent = `Local replacement draft prepared for ${updated.company}. Nothing was sent externally.`;
        renderDirectory();
        openClient(account.id);
      }
    }
    if (copy) {
      const account = readClientAccounts().find((item) => item.id === copy.dataset.clientCopy);
      const update = account?.updates.find((item) => item.id === copy.dataset.updateId);
      if (!update?.draft) return;
      const copied = await copyText(`Subject: ${update.draft.subject}\n\n${update.draft.body}`);
      copy.textContent = copied ? 'Draft copied' : 'Copy unavailable';
      window.setTimeout(() => { if (document.body.contains(copy)) copy.textContent = 'Copy prepared draft'; }, 1800);
    }
  });
  document.querySelector('#client-record-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  search.addEventListener('input', renderDirectory);
  filter.addEventListener('change', renderDirectory);
  renderDirectory();
}
