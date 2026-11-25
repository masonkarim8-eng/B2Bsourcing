import './sandbox.css';
import {
  LEAD_INBOX_KEY,
  SANDBOX_EMAIL_KEY,
  SANDBOX_STAGES,
  readLocalLeads,
  readSandboxEmails,
  createSandboxLead,
  updateLocalLead,
  updateSandboxEmail,
  clearSandboxData
} from './lead-handoff.js';
import { downloadPOFile, getPOFile } from './po-files.js';
import { defaultPOValues, formatPODraft, formattedPOHTML, valuesFromQuote } from './po-format.js';
import { COMMERCIAL_DOCUMENTS, commercialDocumentHTML, createDocumentPack, documentReference, reviseDocumentPack } from './commercial-docs.js';

const OWNERS = ['Daniel Zhou', 'Mia Chen', 'Leo Wang', 'Grace Liu', 'Unassigned'];
const samples = [
  { name: 'Alex Morgan', company: 'Example Workspace Co.', email: 'buyer@example.test', requestType: 'Request a quote', models: ['8387H-RD'], quantity: '250', destination: 'Hamburg, Germany', notes: 'Mesh chair program for a local RFQ workflow test.' },
  { name: 'Taylor Kim', company: 'Example Contract Projects', email: 'quality.buyer@example.test', requestType: 'Request certificates / test reports', models: ['9628H'], quantity: '100', destination: 'Toronto, Canada', notes: 'Request for example documentation. No real certificate is implied.' },
  { name: 'Morgan Chen', company: 'Example Living Retail', email: 'samples@example.test', requestType: 'Order a sample', models: ['YKX-33016'], quantity: '2', destination: 'Copenhagen, Denmark', notes: 'Two sample units for a simulated showroom review.' }
];
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);

export function initSandbox({ escapeHtml, downloadFile, copyText, navigate, getQuotes = () => [], prospects = [], getEmployee = () => null }) {
  const salesButton = document.querySelector('.admin-nav [data-view="sales"]');
  const navButton = document.createElement('button');
  navButton.type = 'button';
  navButton.dataset.view = 'sandbox';
  navButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4V5Zm0 2 8 6 8-6M7 16h4"/></svg>RFQ sandbox<span class="nav-count" id="sandbox-nav-count">0</span>';
  salesButton.insertAdjacentElement('afterend', navButton);
  navButton.addEventListener('click', () => navigate('sandbox'));

  const approvalNavButton = document.createElement('button');
  approvalNavButton.type = 'button';
  approvalNavButton.dataset.view = 'approvals';
  approvalNavButton.hidden = true;
  approvalNavButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18H6V3Zm3 5h6m-6 4h6m-6 4h3"/></svg>Approvals<span class="nav-count" id="approval-nav-count">0</span>';
  navButton.insertAdjacentElement('afterend', approvalNavButton);
  approvalNavButton.addEventListener('click', () => navigate('approvals'));

  document.querySelector('#view-quotes').insertAdjacentHTML('beforebegin', `
    <section class="admin-view" id="view-sandbox" data-view-panel="sandbox" aria-labelledby="sandbox-title" hidden>
      <div class="view-heading"><div><p class="overline">LOCAL RFQ · TEST MAIL · MOCK CRM</p><h1 id="sandbox-title">RFQ sandbox</h1><p>Test the complete inquiry handoff without company credentials, external email, or a live CRM.</p></div><span class="connection-badge">NO EXTERNAL DELIVERY</span></div>
      <div class="sandbox-notice"><strong>Browser-local test environment</strong><span>Buyer details, PO templates, formatted drafts, RFQ records, and test emails stay in this browser. Nothing is sent externally.</span></div>
      <div class="metric-grid sandbox-metrics">
        <article class="metric-card"><span>LOCAL RFQS</span><strong id="sandbox-lead-total">0</strong><small>Public forms + sample records</small></article>
        <article class="metric-card"><span>OPEN OPPORTUNITIES</span><strong id="sandbox-open-total">0</strong><small>Excludes Won and Lost</small></article>
        <article class="metric-card"><span>TEST EMAILS</span><strong id="sandbox-email-total">0</strong><small><b id="sandbox-unread-total">0</b> unread simulations</small></article>
        <article class="metric-card"><span>FOLLOW-UPS DUE</span><strong id="sandbox-due-total">0</strong><small>Based on local follow-up dates</small></article>
      </div>
      <div class="sandbox-toolbar"><button class="admin-primary" type="button" id="sandbox-add-sample">Create sample RFQ <span aria-hidden="true">＋</span></button><button class="admin-secondary" type="button" id="sandbox-export">Export sandbox JSON</button><button class="danger-button" type="button" id="sandbox-clear">Clear local RFQs</button><p id="sandbox-status" role="status"></p></div>
      <section class="panel sandbox-pipeline-panel"><div class="panel-heading"><div><p class="overline">EDITABLE MOCK CRM</p><h2>Sales pipeline</h2><p>Open a record to change its stage, owner, follow-up date, internal notes, or PO draft.</p></div><span class="sample-tag">FICTIONAL OWNERS</span></div><div class="sandbox-board" id="sandbox-board"></div></section>
      <section class="panel sandbox-inbox-panel" id="sandbox-inbox"><div class="panel-heading"><div><p class="overline">SIMULATED EMAIL</p><h2>Test inboxes</h2><p>Each RFQ creates a buyer confirmation and a department notification. Neither leaves this browser.</p></div><span class="sample-tag">NOT SENT</span></div>
        <div class="task-filters sandbox-mail-filters" role="group" aria-label="Filter test emails"><button type="button" data-mail-filter="all" aria-pressed="true">All test mail</button><button type="button" data-mail-filter="buyer" aria-pressed="false">Buyer confirmations</button><button type="button" data-mail-filter="department" aria-pressed="false">Department notices</button><button type="button" data-mail-filter="unread" aria-pressed="false">Unread</button></div>
        <div class="sandbox-mail-layout"><div class="sandbox-mail-list" id="sandbox-mail-list"></div><article class="sandbox-mail-preview" id="sandbox-mail-preview"><div class="sandbox-empty"><strong>No test email selected</strong><p>Create a sample RFQ or submit a public inquiry, then select a simulated message.</p></div></article></div>
      </section>
    </section>
    <dialog class="sandbox-dialog" id="sandbox-lead-dialog" aria-labelledby="sandbox-dialog-title"><button class="sandbox-dialog-close" id="sandbox-dialog-close" type="button" aria-label="Close RFQ details">×</button><p class="overline">LOCAL SANDBOX RFQ</p><h2 id="sandbox-dialog-title"></h2><p class="sandbox-dialog-meta" id="sandbox-dialog-meta"></p><div class="sandbox-lead-summary" id="sandbox-lead-summary"></div><form id="sandbox-lead-form"><input type="hidden" id="sandbox-lead-id"><div class="field-row"><label>Pipeline stage<select id="sandbox-lead-stage">${SANDBOX_STAGES.map((stage) => `<option>${stage}</option>`).join('')}</select></label><label>Owner<select id="sandbox-lead-owner">${OWNERS.map((owner) => `<option>${owner}</option>`).join('')}</select></label></div><div class="field-row"><label>Routed department<input id="sandbox-lead-department" type="text" readonly></label><label>Follow-up date<input id="sandbox-lead-followup" type="date"></label></div><label>Internal notes<textarea id="sandbox-lead-notes" rows="4" maxlength="1500" placeholder="Qualification, sample status, next action…"></textarea></label><div class="sandbox-dialog-actions"><button class="admin-primary" type="submit">Save pipeline changes</button><button class="admin-secondary" type="button" id="sandbox-related-mail">View related test mail</button></div><p class="form-message" id="sandbox-save-status" role="status"></p></form><section class="sandbox-po-tools"><div class="sandbox-po-heading"><div><p class="overline">PO WORKFLOW</p><h3>Client template & quote formatter</h3></div><span class="sample-tag">LOCAL AI-STYLE DEMO</span></div><p id="sandbox-po-attachment"></p><div class="sandbox-dialog-actions"><button class="admin-secondary" type="button" id="sandbox-download-po">Download original template</button><button class="admin-primary" type="button" id="sandbox-format-po">Format with quotation</button></div><p class="form-message" id="sandbox-po-status" role="status"></p></section><section class="sandbox-history"><h3>Activity history</h3><ol id="sandbox-history-list"></ol></section></dialog>
      <dialog class="sandbox-dialog sandbox-po-dialog" id="sandbox-po-dialog" aria-labelledby="sandbox-po-title"><button class="sandbox-dialog-close" id="sandbox-po-close" type="button" aria-label="Close PO formatter">×</button><p class="overline">LOCAL SIMULATION · NO EXTERNAL AI</p><h2 id="sandbox-po-title">Format PO with quotation</h2><p class="sandbox-dialog-meta" id="sandbox-po-meta"></p><div class="sandbox-po-disclaimer"><strong>Human review required.</strong> This rule-based demo organizes template notes and quotation fields; it does not understand or validate a legal PO. TXT and CSV text can be imported. PDF, Word, and Excel files are preserved for download, but their contents are not extracted.</div><form id="sandbox-po-form"><label>Saved demo quotation<select id="sandbox-po-quote"><option value="">Manual quotation details</option></select><small>Confirm that any selected quotation belongs to this buyer and RFQ.</small></label><div class="field-row"><label>Quotation reference<input id="sandbox-po-quote-ref" type="text" required maxlength="120"></label><label>Model / product<input id="sandbox-po-model" type="text" required maxlength="300"></label></div><div class="field-row"><label>Quantity<input id="sandbox-po-quantity" type="number" min="1" step="1" required></label><label>Unit price USD<input id="sandbox-po-unit-price" type="number" min="0.01" step="0.01" required></label></div><div class="field-row"><label>Order total USD<input id="sandbox-po-total" type="number" min="0" step="0.01" placeholder="Calculated if blank"></label><label>Incoterm<input id="sandbox-po-incoterm" type="text" maxlength="40"></label></div><div class="field-row"><label>Destination<input id="sandbox-po-destination" type="text" maxlength="240"></label><label>Quotation valid until<input id="sandbox-po-valid-until" type="date"></label></div><label>Lead time<input id="sandbox-po-lead-time" type="text" maxlength="300"></label><label>Payment terms<input id="sandbox-po-payment" type="text" maxlength="300"></label><label>Client template text / sales notes<textarea id="sandbox-po-template-text" rows="6" maxlength="6000" placeholder="Add buyer headings, required fields, or template instructions…"></textarea><small>Editable and included in the local draft. Never paste passwords or sensitive credentials.</small></label><div class="sandbox-po-output-wrap" id="sandbox-po-output-wrap" hidden><h3>Source PO draft</h3><pre class="sandbox-po-output" id="sandbox-po-output"></pre></div><div class="sandbox-dialog-actions"><button class="admin-primary" type="submit" id="sandbox-po-format">Format & save local draft</button><button class="admin-secondary" type="button" id="sandbox-po-download" disabled>Download source HTML</button><button class="admin-secondary" type="button" id="sandbox-po-copy" disabled>Copy source text</button><button class="admin-secondary" type="button" id="sandbox-po-back">Back to RFQ</button></div><p class="form-message" id="sandbox-po-save-status" role="status"></p></form>
      <section class="sandbox-document-suite" id="sandbox-document-suite" aria-labelledby="sandbox-document-title" hidden><div class="sandbox-po-heading"><div><p class="overline">COMMERCIAL DOCUMENT PACK</p><h3 id="sandbox-document-title">Matching order documents</h3></div><span class="document-status" id="sandbox-document-status"></span></div><p class="sandbox-document-intro">All three documents use the same saved values and version. Open a print preview to use the browser’s “Save as PDF” option, or download the standalone HTML file.</p><div class="sandbox-document-grid">${COMMERCIAL_DOCUMENTS.map((document) => `<article><span class="document-code">${document.code}</span><h4>${document.title}</h4><p>${document.short}</p><code data-document-reference="${document.type}"></code><div class="sandbox-document-actions"><button class="admin-secondary" type="button" data-document-print="${document.type}">Print preview</button><button class="admin-secondary" type="button" data-document-download="${document.type}">Download HTML</button></div></article>`).join('')}</div><form id="sandbox-approval-form"><div class="field-row"><label>Manager / approver<input id="sandbox-approver" type="text" maxlength="120" autocomplete="off" placeholder="Required to approve and lock"></label><label>Approval note<input id="sandbox-approval-note" type="text" maxlength="500" placeholder="Optional review note"></label></div><p id="sandbox-approval-summary"></p><div class="sandbox-dialog-actions"><button class="admin-primary" type="submit" id="sandbox-submit-approval">Submit for manager review</button><button class="admin-secondary" type="button" id="sandbox-approve-documents" disabled>Approve & lock documents</button><button class="admin-secondary" type="button" id="sandbox-revise-documents" hidden>Start new revision</button></div><p class="form-message" id="sandbox-approval-status" role="status"></p></form></section></dialog>
    <section class="admin-view" id="view-approvals" data-view-panel="approvals" aria-labelledby="approvals-title" hidden>
      <div class="view-heading"><div><p class="overline">SALES MANAGER · DOCUMENT CONTROL</p><h1 id="approvals-title">Document approvals</h1><p>Review every submitted commercial pack from one queue. Oldest submissions appear first.</p></div><span class="connection-badge">MANAGER ACCESS ONLY</span></div>
      <section class="panel approval-queue-panel"><div class="panel-heading"><div><p class="overline">PENDING REVIEW</p><h2>Waiting for your approval</h2><p>Each pack contains a matching purchase order, proforma invoice, and order confirmation at the same version.</p></div><span class="sample-tag" id="approval-queue-count">0 PENDING</span></div><div class="approval-queue" id="approval-queue"></div></section>
      <aside class="approval-queue-note"><strong>Approval locks the exact submitted version.</strong><p>Check the buyer, product, quantity, pricing, destination, validity, payment terms, and all three documents before locking. Starting a revision returns the pack to the editable sales workflow while preserving the approved snapshot.</p></aside>
    </section>`);

  const board = document.querySelector('#sandbox-board');
  const mailList = document.querySelector('#sandbox-mail-list');
  const mailPreview = document.querySelector('#sandbox-mail-preview');
  const dialog = document.querySelector('#sandbox-lead-dialog');
  const poDialog = document.querySelector('#sandbox-po-dialog');
  const poForm = document.querySelector('#sandbox-po-form');
  let mailFilter = 'all';
  let selectedEmailId = null;
  let activeLead = null;
  let currentDraft = null;
  let currentPack = null;

  function formatDate(value) {
    if (!value) return 'No date';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'No date' : date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatBytes(value) {
    const bytes = Number(value) || 0;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function renderBoard(leads) {
    board.innerHTML = SANDBOX_STAGES.map((stage) => {
      const stageLeads = leads.filter((lead) => lead.stage === stage);
      return `<section class="sandbox-column" data-stage="${stage}"><div class="sandbox-column-heading"><h3>${stage}</h3><span>${stageLeads.length}</span></div><div class="sandbox-column-body">${stageLeads.length ? stageLeads.map((lead) => `<article class="sandbox-card"><div class="sandbox-card-top"><code>${escapeHtml(lead.reference)}</code><span>${escapeHtml(lead.department)}</span></div><h4>${escapeHtml(lead.name || 'Unnamed buyer')}</h4><p>${escapeHtml(lead.models?.join(', ') || 'General inquiry')}</p>${lead.poAttachment ? '<span class="sandbox-po-badge">PO TEMPLATE</span>' : ''}${lead.poDraft ? '<span class="sandbox-po-badge draft">PO DRAFT READY</span>' : ''}${lead.documentPack?.status === 'approved' ? `<span class="sandbox-po-badge approved">DOCS APPROVED V${lead.documentPack.version}</span>` : ''}<dl><div><dt>Owner</dt><dd>${escapeHtml(lead.owner)}</dd></div><div><dt>Follow-up</dt><dd>${escapeHtml(formatDate(lead.followUpDate))}</dd></div></dl><button type="button" data-sandbox-lead="${escapeHtml(lead.id)}">Open RFQ <span aria-hidden="true">→</span></button></article>`).join('') : '<p class="sandbox-column-empty">No local RFQs</p>'}</div></section>`;
    }).join('');
  }

  function visibleEmails(emails) {
    return emails.filter((email) => mailFilter === 'all' || (mailFilter === 'unread' ? !email.read : email.mailbox === mailFilter));
  }

  function renderMail(emails) {
    const visible = visibleEmails(emails);
    if (selectedEmailId && !visible.some((email) => email.id === selectedEmailId)) selectedEmailId = null;
    mailList.innerHTML = visible.length ? visible.map((email) => `<button type="button" class="sandbox-mail-item ${email.read ? '' : 'unread'} ${email.id === selectedEmailId ? 'selected' : ''}" data-sandbox-email="${escapeHtml(email.id)}"><span class="sandbox-mail-kind">${email.mailbox === 'buyer' ? 'BUYER' : 'DEPARTMENT'}${email.read ? '' : ' · UNREAD'}</span><strong>${escapeHtml(email.subject)}</strong><span>To: ${escapeHtml(email.to)}</span><small>${escapeHtml(formatDate(email.createdAt))}</small></button>`).join('') : '<div class="sandbox-empty"><strong>No simulated messages</strong><p>Create an RFQ to populate the test inboxes.</p></div>';
    const selected = emails.find((email) => email.id === selectedEmailId);
    if (!selected) {
      mailPreview.innerHTML = '<div class="sandbox-empty"><strong>No test email selected</strong><p>Select a simulated message to review its headers and body.</p></div>';
      return;
    }
    mailPreview.innerHTML = `<div class="sandbox-mail-preview-head"><span>SIMULATED · NOT SENT EXTERNALLY</span><h3>${escapeHtml(selected.subject)}</h3><dl><div><dt>From</dt><dd>${escapeHtml(selected.from)}</dd></div><div><dt>To</dt><dd>${escapeHtml(selected.to)}</dd></div><div><dt>Reference</dt><dd><button type="button" data-mail-lead="${escapeHtml(selected.leadId)}">${escapeHtml(selected.reference)}</button></dd></div></dl></div><pre>${escapeHtml(selected.body)}</pre>`;
  }

  function waitingLabel(value) {
    const submittedAt = Date.parse(value || '');
    if (!Number.isFinite(submittedAt)) return 'Submission time unavailable';
    const minutes = Math.max(0, Math.floor((Date.now() - submittedAt) / 60000));
    if (minutes < 1) return 'Just submitted';
    if (minutes < 60) return `Waiting ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 48) return `Waiting ${hours} hr`;
    return `Waiting ${Math.floor(hours / 24)} days`;
  }

  function renderApprovals(leads) {
    const pending = leads.filter((lead) => lead.documentPack?.status === 'pending').sort((a, b) => {
      const aTime = Date.parse(a.documentPack.submittedAt || '') || Number.MAX_SAFE_INTEGER;
      const bTime = Date.parse(b.documentPack.submittedAt || '') || Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
    document.querySelector('#approval-nav-count').textContent = String(pending.length);
    document.querySelector('#approval-queue-count').textContent = `${pending.length} PENDING`;
    const queue = document.querySelector('#approval-queue');
    if (!pending.length) {
      queue.innerHTML = '<div class="sandbox-empty"><strong>No packs waiting for approval</strong><p>When a Sales User submits a document pack, it will appear here for manager review.</p></div>';
      return;
    }
    queue.innerHTML = pending.map((lead) => {
      const pack = lead.documentPack;
      const reference = lead.reference || 'Local RFQ';
      return `<article class="approval-queue-item"><div class="approval-queue-main"><div class="approval-queue-ref"><code>${escapeHtml(reference)}</code><span class="document-status pending">AWAITING · V${escapeHtml(pack.version)}</span></div><h3>${escapeHtml(lead.company || lead.name || 'Unnamed buyer')}</h3><p>${escapeHtml(lead.models?.join(', ') || 'General seating inquiry')}</p><span class="approval-waiting">${escapeHtml(waitingLabel(pack.submittedAt))}</span></div><dl><div><dt>Submitted by</dt><dd>${escapeHtml(pack.submittedBy || lead.owner || 'Unassigned')}</dd></div><div><dt>Submitted</dt><dd>${escapeHtml(formatDate(pack.submittedAt))}</dd></div><div><dt>Sales owner</dt><dd>${escapeHtml(lead.owner || 'Unassigned')}</dd></div><div><dt>Document version</dt><dd>V${escapeHtml(pack.version)}</dd></div></dl><div class="approval-queue-action"><span>PO · PI · OC</span><button class="admin-primary" type="button" data-approval-lead="${escapeHtml(lead.id)}" aria-label="Review ${escapeHtml(reference)} document pack version ${escapeHtml(pack.version)}">Review document pack <span aria-hidden="true">→</span></button></div></article>`;
    }).join('');
  }

  function renderAll() {
    const leads = readLocalLeads();
    const emails = readSandboxEmails();
    const today = new Date().toISOString().slice(0, 10);
    const open = leads.filter((lead) => !['Won', 'Lost'].includes(lead.stage));
    document.querySelector('#sandbox-lead-total').textContent = String(leads.length);
    document.querySelector('#sandbox-open-total').textContent = String(open.length);
    document.querySelector('#sandbox-email-total').textContent = String(emails.length);
    document.querySelector('#sandbox-unread-total').textContent = String(emails.filter((email) => !email.read).length);
    document.querySelector('#sandbox-due-total').textContent = String(open.filter((lead) => lead.followUpDate && lead.followUpDate <= today).length);
    document.querySelector('#sandbox-nav-count').textContent = String(open.length);
    renderBoard(leads);
    renderMail(emails);
    renderApprovals(leads);
  }

  function renderPOAttachment(lead) {
    const attachment = lead.poAttachment;
    document.querySelector('#sandbox-po-attachment').textContent = attachment
      ? `${attachment.name} · ${formatBytes(attachment.size)} · ${attachment.stored ? 'Original file stored only in this browser.' : 'Metadata only; the original file is unavailable.'}`
      : 'No client template attached. Sales can still create a draft using quotation details and editable template notes.';
    document.querySelector('#sandbox-download-po').disabled = !attachment?.stored;
    document.querySelector('#sandbox-po-status').textContent = lead.poDraft
      ? `PO draft saved ${formatDate(lead.poDraft.createdAt)} from ${lead.poDraft.values?.quoteReference || 'local quotation details'}.${lead.documentPack ? ` Document pack V${lead.documentPack.version}: ${lead.documentPack.status}.` : ''}`
      : '';
  }

  function openLead(id) {
    const lead = readLocalLeads().find((item) => item.id === id);
    if (!lead) return;
    activeLead = lead;
    document.querySelector('#sandbox-lead-id').value = lead.id;
    document.querySelector('#sandbox-dialog-title').textContent = `${lead.reference} · ${lead.name || 'Unnamed buyer'}`;
    document.querySelector('#sandbox-dialog-meta').textContent = `${lead.requestType} · Created ${formatDate(lead.createdAt)} · ${lead.source || 'website'}`;
    document.querySelector('#sandbox-lead-summary').innerHTML = `<dl><div><dt>Company</dt><dd>${escapeHtml(lead.company || 'Not provided')}</dd></div><div><dt>Buyer email</dt><dd>${escapeHtml(lead.email || 'Not provided')}</dd></div><div><dt>Models</dt><dd>${escapeHtml(lead.models?.join(', ') || 'General inquiry')}</dd></div><div><dt>Quantity</dt><dd>${escapeHtml(lead.quantity || 'Not specified')}</dd></div><div><dt>Destination</dt><dd>${escapeHtml(lead.destination || 'Not specified')}</dd></div></dl><p><strong>Buyer notes</strong></p><pre>${escapeHtml(lead.notes || 'None')}</pre>`;
    document.querySelector('#sandbox-lead-stage').value = lead.stage;
    document.querySelector('#sandbox-lead-owner').value = OWNERS.includes(lead.owner) ? lead.owner : 'Unassigned';
    document.querySelector('#sandbox-lead-department').value = lead.department;
    document.querySelector('#sandbox-lead-followup').value = lead.followUpDate || '';
    document.querySelector('#sandbox-lead-notes').value = lead.internalNotes || '';
    document.querySelector('#sandbox-save-status').textContent = '';
    document.querySelector('#sandbox-history-list').innerHTML = (lead.history || []).length ? lead.history.map((entry) => `<li><span>${escapeHtml(formatDate(entry.at))}</span><p>${escapeHtml(entry.text)}</p></li>`).join('') : '<li><p>No activity recorded.</p></li>';
    renderPOAttachment(lead);
    if (!dialog.open) dialog.showModal();
  }

  const poFields = {
    quoteReference: '#sandbox-po-quote-ref', model: '#sandbox-po-model', quantity: '#sandbox-po-quantity',
    unitPrice: '#sandbox-po-unit-price', total: '#sandbox-po-total', incoterm: '#sandbox-po-incoterm',
    destination: '#sandbox-po-destination', validUntil: '#sandbox-po-valid-until', leadTime: '#sandbox-po-lead-time',
    paymentTerms: '#sandbox-po-payment', templateText: '#sandbox-po-template-text'
  };

  function applyPOValues(values) {
    Object.entries(poFields).forEach(([key, selector]) => { document.querySelector(selector).value = values[key] || ''; });
  }

  function readPOValues() {
    return Object.fromEntries(Object.entries(poFields).map(([key, selector]) => [key, document.querySelector(selector).value]));
  }

  function setPOFieldsLocked(locked) {
    Object.values(poFields).forEach((selector) => { document.querySelector(selector).disabled = locked; });
    document.querySelector('#sandbox-po-quote').disabled = locked;
    document.querySelector('#sandbox-po-format').disabled = locked;
  }

  function renderDocumentSuite() {
    const suite = document.querySelector('#sandbox-document-suite');
    const employee = getEmployee();
    const isManager = employee?.role === 'Sales Manager';
    const approver = document.querySelector('#sandbox-approver');
    const approvalNote = document.querySelector('#sandbox-approval-note');
    suite.hidden = !currentDraft || !currentPack;
    if (suite.hidden) {
      setPOFieldsLocked(false);
      approver.disabled = true;
      approvalNote.disabled = true;
      return;
    }
    const statusNames = { draft: 'DRAFT', pending: 'AWAITING APPROVAL', approved: 'APPROVED & LOCKED' };
    const status = currentPack.status || 'draft';
    const managerReview = status === 'pending' && isManager;
    const statusElement = document.querySelector('#sandbox-document-status');
    statusElement.textContent = `${statusNames[status] || 'DRAFT'} · V${currentPack.version}`;
    statusElement.className = `document-status ${status}`;
    COMMERCIAL_DOCUMENTS.forEach((documentDefinition) => {
      document.querySelector(`[data-document-reference="${documentDefinition.type}"]`).textContent = documentReference(activeLead, currentPack, documentDefinition.type);
    });
    const submittedBy = currentPack.submittedBy || activeLead.owner;
    const summary = status === 'approved'
      ? `Approved by ${currentPack.approvedBy} (${currentPack.approvedByRole || 'Sales Manager'}) on ${formatDate(currentPack.approvedAt)}. Commercial fields are locked; either role can start a new revision.`
      : status === 'pending' && isManager
        ? `Submitted by ${submittedBy} on ${formatDate(currentPack.submittedAt)}. You are reviewing as ${employee.name}. Approval locks this exact version.`
        : status === 'pending'
          ? `Submitted by ${submittedBy} on ${formatDate(currentPack.submittedAt)}. Sign in with the separate Sales Manager demo account to approve; this version remains pending.`
          : `Version ${currentPack.version} is editable. Review all three documents, then submit this version for manager approval.`;
    document.querySelector('#sandbox-approval-summary').textContent = summary;
    approver.value = status === 'approved' ? currentPack.approvedBy || '' : managerReview ? employee.name : '';
    approver.readOnly = true;
    approvalNote.value = currentPack.approvalNote || '';
    approver.disabled = !managerReview;
    approvalNote.disabled = !managerReview;
    document.querySelector('#sandbox-submit-approval').disabled = status !== 'draft';
    const approveButton = document.querySelector('#sandbox-approve-documents');
    approveButton.disabled = !managerReview;
    approveButton.title = managerReview ? `Approve and lock as ${employee.name}` : 'Sales Manager access is required to approve this document pack.';
    document.querySelector('#sandbox-revise-documents').hidden = status !== 'approved';
    setPOFieldsLocked(status === 'approved');
  }

  function showDraft(draft) {
    currentDraft = draft || null;
    document.querySelector('#sandbox-po-output-wrap').hidden = !draft;
    document.querySelector('#sandbox-po-output').textContent = draft?.text || '';
    document.querySelector('#sandbox-po-download').disabled = !draft;
    document.querySelector('#sandbox-po-copy').disabled = !draft;
  }

  function invalidateDraft() {
    showDraft(null);
    currentPack = null;
    renderDocumentSuite();
    document.querySelector('#sandbox-po-save-status').textContent = 'Quotation or template details changed. Format again to update the saved draft and document pack.';
  }

  function saveDocumentPack(pack, historyText, statusText) {
    const updated = updateLocalLead(activeLead.id, (lead) => ({
      documentPack: pack,
      history: [{ at: pack.updatedAt, text: historyText }, ...(lead.history || [])].slice(0, 100)
    }));
    if (!updated) {
      document.querySelector('#sandbox-approval-status').textContent = 'The approval state could not be saved in this browser.';
      return null;
    }
    activeLead = updated;
    currentPack = updated.documentPack;
    renderAll();
    renderDocumentSuite();
    document.querySelector('#sandbox-approval-status').textContent = statusText;
    return updated;
  }

  function downloadCommercialDocument(type) {
    if (!activeLead || !currentPack) return;
    const definition = COMMERCIAL_DOCUMENTS.find((document) => document.type === type);
    if (!definition) return;
    const reference = documentReference(activeLead, currentPack, type);
    downloadFile(`${reference}.html`, commercialDocumentHTML(activeLead, currentPack, type), 'text/html;charset=utf-8');
    document.querySelector('#sandbox-approval-status').textContent = `${definition.title} downloaded locally. Open it in a browser to print or save as PDF; nothing was sent externally.`;
  }

  function openCommercialPreview(type) {
    if (!activeLead || !currentPack) return;
    const url = URL.createObjectURL(new Blob([commercialDocumentHTML(activeLead, currentPack, type)], { type: 'text/html;charset=utf-8' }));
    const preview = window.open(url, '_blank');
    if (!preview) {
      URL.revokeObjectURL(url);
      document.querySelector('#sandbox-approval-status').textContent = 'The preview was blocked. Allow pop-ups for this local site, or download the HTML document instead.';
      return;
    }
    try { preview.opener = null; } catch {}
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    document.querySelector('#sandbox-approval-status').textContent = 'Print preview opened locally. Use “Print / Save as PDF” in the preview; no PDF is generated or uploaded automatically.';
  }

  async function openPOFormatter() {
    const lead = readLocalLeads().find((item) => item.id === document.querySelector('#sandbox-lead-id').value);
    if (!lead) return;
    activeLead = lead;
    document.querySelector('#sandbox-po-status').textContent = 'Loading the browser-local template…';
    let templateText = '';
    let loadMessage = '';
    if (lead.poAttachment?.stored) {
      try {
        const record = await getPOFile(lead.id);
        if (record && /\.(txt|csv)$/i.test(record.name)) templateText = (await record.blob.text()).slice(0, 6000);
        else templateText = `Original template: ${lead.poAttachment.name}\nBinary contents are preserved but not extracted in this local demo. Add buyer-specific fields or instructions here.`;
      } catch {
        loadMessage = 'The original template could not be read. You can still format a draft using editable notes.';
      }
    }
    const quotes = getQuotes();
    document.querySelector('#sandbox-po-quote').innerHTML = `<option value="">Manual quotation details</option>${quotes.map((quote) => {
      const prospect = prospects[quote.values.prospectIndex]?.company || 'Unknown sample account';
      return `<option value="${escapeHtml(quote.snapshotId)}">${escapeHtml(`${quote.id} · V${quote.version} · ${quote.values.productModel} · ${money(quote.calculation.total)} · ${prospect}`)}</option>`;
    }).join('')}`;
    applyPOValues(lead.poDraft?.values || { ...defaultPOValues(lead), templateText });
    if (!lead.poDraft && templateText) document.querySelector('#sandbox-po-template-text').value = templateText;
    showDraft(lead.poDraft || null);
    currentPack = lead.documentPack || (lead.poDraft ? createDocumentPack(lead.poDraft) : null);
    renderDocumentSuite();
    document.querySelector('#sandbox-approval-status').textContent = '';
    document.querySelector('#sandbox-po-meta').textContent = `${lead.reference} · ${lead.company || lead.name} · ${lead.poAttachment?.name || 'No client template attached'}`;
    document.querySelector('#sandbox-po-save-status').textContent = loadMessage || (lead.poDraft ? 'Loaded the saved browser-local draft and document pack. Review and format again after any changes.' : 'No external AI or company system will be contacted.');
    dialog.close();
    if (!poDialog.open) poDialog.showModal();
  }

  board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sandbox-lead]');
    if (button) openLead(button.dataset.sandboxLead);
  });
  document.querySelector('#approval-queue').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-approval-lead]');
    if (!button || getEmployee()?.role !== 'Sales Manager') return;
    const lead = readLocalLeads().find((item) => item.id === button.dataset.approvalLead);
    if (!lead || lead.documentPack?.status !== 'pending') {
      renderAll();
      return;
    }
    document.querySelector('#sandbox-lead-id').value = lead.id;
    await openPOFormatter();
    poDialog.scrollTop = poDialog.scrollHeight;
    document.querySelector('#sandbox-approval-status').textContent = 'Opened from the manager approval queue. Review the documents above before locking this version.';
  });
  document.querySelector('#sandbox-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  document.querySelector('#sandbox-po-close').addEventListener('click', () => poDialog.close());
  poDialog.addEventListener('click', (event) => { if (event.target === poDialog) poDialog.close(); });
  document.querySelector('#sandbox-format-po').addEventListener('click', openPOFormatter);
  document.querySelector('#sandbox-po-back').addEventListener('click', () => {
    poDialog.close();
    if (activeLead) openLead(activeLead.id);
  });

  document.querySelector('#sandbox-download-po').addEventListener('click', async () => {
    if (!activeLead?.poAttachment?.stored) return;
    try {
      const record = await getPOFile(activeLead.id);
      const downloaded = downloadPOFile(record);
      document.querySelector('#sandbox-po-status').textContent = downloaded ? 'Original template downloaded from this browser.' : 'Original template is unavailable.';
    } catch {
      document.querySelector('#sandbox-po-status').textContent = 'The original template could not be read from browser storage.';
    }
  });

  document.querySelector('#sandbox-lead-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.querySelector('#sandbox-lead-id').value;
    const stage = document.querySelector('#sandbox-lead-stage').value;
    const owner = document.querySelector('#sandbox-lead-owner').value;
    const followUpDate = document.querySelector('#sandbox-lead-followup').value;
    const internalNotes = document.querySelector('#sandbox-lead-notes').value.trim();
    const updated = updateLocalLead(id, (lead) => ({
      stage,
      owner,
      followUpDate,
      internalNotes,
      history: [{ at: new Date().toISOString(), text: `Updated to ${stage}; owner ${owner}; follow-up ${followUpDate || 'not set'}. Internal notes saved.` }, ...(lead.history || [])].slice(0, 100)
    }));
    document.querySelector('#sandbox-save-status').textContent = updated ? 'Saved in this browser. No external system was updated.' : 'Browser storage is unavailable; changes could not be saved.';
    if (updated) activeLead = updated;
    renderAll();
    if (updated) document.querySelector('#sandbox-history-list').innerHTML = updated.history.map((entry) => `<li><span>${escapeHtml(formatDate(entry.at))}</span><p>${escapeHtml(entry.text)}</p></li>`).join('');
  });

  document.querySelector('#sandbox-po-quote').addEventListener('change', (event) => {
    const quote = getQuotes().find((item) => item.snapshotId === event.target.value);
    if (!quote || !activeLead) return;
    const templateText = document.querySelector('#sandbox-po-template-text').value;
    applyPOValues({ ...valuesFromQuote(quote, activeLead), templateText });
    invalidateDraft();
  });
  poForm.addEventListener('input', (event) => { if (event.target.id !== 'sandbox-po-quote') invalidateDraft(); });
  poForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!activeLead || currentPack?.status === 'approved' || !poForm.reportValidity()) return;
    const formatted = formatPODraft(activeLead, readPOValues());
    const draft = { ...formatted, createdAt: new Date().toISOString(), simulated: true, externallyDelivered: false };
    const pack = createDocumentPack(draft, activeLead.documentPack, draft.createdAt);
    const updated = updateLocalLead(activeLead.id, (lead) => ({
      poDraft: draft,
      documentPack: pack,
      history: [{ at: draft.createdAt, text: `Formatted local PO draft and commercial document pack V${pack.version} from ${draft.values.quoteReference}; no external AI or delivery.` }, ...(lead.history || [])].slice(0, 100)
    }));
    if (!updated) {
      document.querySelector('#sandbox-po-save-status').textContent = 'The draft could not be saved in this browser.';
      return;
    }
    activeLead = updated;
    currentPack = pack;
    showDraft(draft);
    renderAll();
    renderDocumentSuite();
    document.querySelector('#sandbox-approval-status').textContent = '';
    document.querySelector('#sandbox-po-save-status').textContent = 'Draft and matching document pack saved only in this browser. Review every commercial and buyer-specific field before approval.';
  });
  document.querySelector('#sandbox-po-download').addEventListener('click', () => {
    if (!currentDraft || !activeLead) return;
    downloadFile(`PO-${activeLead.reference}-draft.html`, formattedPOHTML(activeLead, currentDraft), 'text/html;charset=utf-8');
    document.querySelector('#sandbox-po-save-status').textContent = 'Source HTML draft downloaded locally. It is not an approved or externally delivered PO.';
  });
  document.querySelector('#sandbox-po-copy').addEventListener('click', async () => {
    if (!currentDraft) return;
    const copied = await copyText(currentDraft.text);
    document.querySelector('#sandbox-po-save-status').textContent = copied ? 'Source PO draft text copied.' : 'Copy unavailable. Select the draft text instead.';
  });

  document.querySelectorAll('[data-document-download]').forEach((button) => button.addEventListener('click', () => downloadCommercialDocument(button.dataset.documentDownload)));
  document.querySelectorAll('[data-document-print]').forEach((button) => button.addEventListener('click', () => openCommercialPreview(button.dataset.documentPrint)));

  document.querySelector('#sandbox-approval-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const employee = getEmployee();
    if (!currentPack || currentPack.status !== 'draft' || !employee) return;
    const now = new Date().toISOString();
    const pack = {
      ...currentPack,
      status: 'pending',
      updatedAt: now,
      submittedAt: now,
      submittedBy: employee.name,
      submittedById: employee.id,
      approvedAt: '',
      approvedBy: '',
      approvedById: '',
      approvedByRole: '',
      approvalNote: ''
    };
    saveDocumentPack(pack, `${employee.name} submitted commercial document pack V${pack.version} for manager review.`, `Document pack V${pack.version} submitted by ${employee.name} for local manager review. No external notification was sent.`);
  });

  document.querySelector('#sandbox-approve-documents').addEventListener('click', () => {
    if (!currentPack || currentPack.status !== 'pending') return;
    const employee = getEmployee();
    if (employee?.role !== 'Sales Manager') {
      document.querySelector('#sandbox-approval-status').textContent = 'Sales Manager access is required. Sign in with Morgan Lee’s fictional manager account to approve this pack.';
      return;
    }
    const approvedBy = employee.name;
    const now = new Date().toISOString();
    const pack = {
      ...currentPack,
      status: 'approved',
      updatedAt: now,
      approvedAt: now,
      approvedBy,
      approvedById: employee.id,
      approvedByRole: employee.role,
      approvalNote: document.querySelector('#sandbox-approval-note').value.trim()
    };
    saveDocumentPack(pack, `Approved and locked commercial document pack V${pack.version}; approver ${approvedBy} (${employee.role}).`, `Document pack V${pack.version} approved and locked by ${approvedBy} in this browser. This is a simulated approval, not external delivery or legal authorization.`);
  });

  document.querySelector('#sandbox-revise-documents').addEventListener('click', () => {
    if (!activeLead || !currentPack || currentPack.status !== 'approved') return;
    const now = new Date().toISOString();
    const previous = currentPack;
    const revision = reviseDocumentPack(previous, now);
    const updated = updateLocalLead(activeLead.id, (lead) => ({
      documentPack: revision,
      documentPackRevisions: [...(lead.documentPackRevisions || []), previous].slice(-20),
      history: [{ at: now, text: `Started commercial document pack V${revision.version}; approved V${previous.version} preserved in revision history.` }, ...(lead.history || [])].slice(0, 100)
    }));
    if (!updated) {
      document.querySelector('#sandbox-approval-status').textContent = 'The new revision could not be saved in this browser.';
      return;
    }
    activeLead = updated;
    currentPack = revision;
    renderAll();
    renderDocumentSuite();
    document.querySelector('#sandbox-approval-status').textContent = `Version ${revision.version} is now an editable draft. Approved version ${previous.version} remains in browser-local revision history.`;
  });

  document.querySelector('#sandbox-related-mail').addEventListener('click', () => {
    const leadId = document.querySelector('#sandbox-lead-id').value;
    const related = readSandboxEmails().find((email) => email.leadId === leadId);
    mailFilter = 'all';
    selectedEmailId = related?.id || null;
    document.querySelectorAll('[data-mail-filter]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mailFilter === 'all')));
    dialog.close();
    renderAll();
    document.querySelector('#sandbox-inbox').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  });

  mailPreview.addEventListener('click', (event) => {
    const button = event.target.closest('[data-mail-lead]');
    if (button) openLead(button.dataset.mailLead);
  });
  mailList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sandbox-email]');
    if (!button) return;
    selectedEmailId = button.dataset.sandboxEmail;
    updateSandboxEmail(selectedEmailId, () => ({ read: true }));
    renderAll();
  });
  document.querySelectorAll('[data-mail-filter]').forEach((button) => button.addEventListener('click', () => {
    mailFilter = button.dataset.mailFilter;
    document.querySelectorAll('[data-mail-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderMail(readSandboxEmails());
  }));

  document.querySelector('#sandbox-add-sample').addEventListener('click', () => {
    const result = createSandboxLead(samples[readLocalLeads().length % samples.length]);
    if (!result.saved) {
      document.querySelector('#sandbox-status').textContent = 'Browser storage is unavailable; the sample RFQ could not be saved.';
      return;
    }
    document.querySelector('#sandbox-status').textContent = `${result.lead.reference} created and routed to ${result.lead.department}. Two test emails generated; nothing was sent.`;
    renderAll();
    openLead(result.lead.id);
  });
  document.querySelector('#sandbox-export').addEventListener('click', () => {
    downloadFile('zj-rfq-sandbox.json', JSON.stringify({ exportedAt: new Date().toISOString(), sandboxOnly: true, externallyDelivered: false, note: 'PO file metadata, formatted drafts, commercial document packs, approvals, and revision history are included; uploaded binary files remain in IndexedDB.', leads: readLocalLeads(), emails: readSandboxEmails() }, null, 2), 'application/json');
    document.querySelector('#sandbox-status').textContent = 'Sandbox JSON exported. Uploaded binary files are not embedded.';
  });
  document.querySelector('#sandbox-clear').addEventListener('click', async () => {
    if (!window.confirm('Clear all browser-local RFQs, simulated emails, PO templates, formatted drafts, document packs, and approvals? Other employee demo drafts and tasks will not be changed.')) return;
    const filesCleared = await clearSandboxData();
    selectedEmailId = null;
    currentDraft = null;
    currentPack = null;
    dialog.close();
    poDialog.close();
    renderAll();
    document.querySelector('#sandbox-status').textContent = filesCleared ? 'Local RFQs, test emails, PO templates, document packs, approvals, and drafts cleared. Nothing external was affected.' : 'Local RFQs and emails cleared; browser file storage could not be fully cleared.';
  });
  window.addEventListener('storage', (event) => {
    if ([LEAD_INBOX_KEY, SANDBOX_EMAIL_KEY].includes(event.key)) renderAll();
  });
  renderAll();
}
