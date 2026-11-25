const sources = {
  steelcaseModels: { company: 'Steelcase', title: '2D / 3D and Revit planning resources', url: 'https://www.steelcase.com/resources/models/', note: 'Downloadable 2D and 3D DWG symbols and Revit models for space planning.' },
  steelcaseBuying: { company: 'Steelcase', title: 'Contract buying and dealer-supported quotation', url: 'https://www.steelcase.com/resources/documents/how-to-buy-guide/', note: 'Describes dealer-prepared formal quotations, contract references, purchase orders, delivery, installation, and ongoing service.' },
  steelcaseSustainability: { company: 'Steelcase', title: 'Material and product sustainability transparency', url: 'https://www.steelcase.com/people-planet/choose-use-materials-responsibly/', note: 'References Environmental Product Declarations and third-party certifications including Declare and BIFMA LEVEL.' },
  haworthResources: { company: 'Haworth', title: 'Integrated design and document resources', url: 'https://www.haworth.com/eu/en/resources.html', note: 'Public resources include BIM, an online configurator, images, documents, materials, virtual spaces, and warranty information.' },
  myOfs: { company: 'OFS', title: 'MyOFS customer and dealer services', url: 'https://my.ofs.com/', note: 'The public portal describes order tracking, warranty claims, and direct representative contact; access is requested through a sales representative.' },
  kiDesign: { company: 'KI', title: 'Design resources for every project stage', url: 'https://www.ki.com/design-resources/', note: 'Provides image, document, surface-material, CAD, and Revit libraries.' },
  kiSamples: { company: 'KI', title: 'Literature and material sample requests', url: 'https://www.ki.com/order-literature/', note: 'Provides a dedicated route for customers to request literature and material samples.' },
  kiOrder: { company: 'KI', title: 'Self-service order status', url: 'https://www.ki.com/customer-service/order-status/', note: 'Account-based access to acknowledgements, shipping and tracking, invoices, and delivery schedules.' },
  kiRepair: { company: 'KI', title: 'Repair and replacement support', url: 'https://www.ki.com/customer-service/repair-replacement/', note: 'Includes product-label QR scanning to help find order numbers and furniture details.' }
};

const capabilities = [
  {
    id: 'trust', group: 'Attract', capability: 'Brand, factory & trust', status: 'covered', horizon: 'Keep + prove', owner: 'Marketing + Sales', effort: 'Contained', quadrant: 'useful',
    current: 'Factory photography, quality and culture sections, company profile, and five-star partnership positioning.',
    market: 'Steelcase connects procurement guidance with dealer delivery, installation, and ongoing service.', sourceIds: ['steelcaseBuying'],
    recommendation: 'Keep the story; add verified project proof, buyer-market cases, and named responsibilities for each handoff.',
    rationale: 'The trust layer is already a strength. The next gain comes from evidence and continuity, not more generic claims.', dependencies: 'Approved customer references, verified company data, content owner.'
  },
  {
    id: 'catalog', group: 'Attract', capability: 'Catalog & product landing pages', status: 'covered', horizon: 'Keep + govern', owner: 'Marketing + Product', effort: 'Contained', quadrant: 'useful',
    current: '24 filterable products, model-specific pages, specifications, related products, RFQ entry, and NFC-ready URLs.',
    market: 'Steelcase and KI expose planning assets alongside product information, including CAD and Revit resources.', sourceIds: ['steelcaseModels', 'kiDesign'],
    recommendation: 'Keep the catalog structure; drive every model page from a governed product record and add assets by buyer need.',
    rationale: 'ZJ already has the right public product spine. Governance matters before adding more media or models.', dependencies: 'Product information management, asset ownership, revision policy.'
  },
  {
    id: 'employee', group: 'Enable', capability: 'Employee coordination & onboarding', status: 'covered', horizon: 'Keep + secure', owner: 'Operations + IT', effort: 'Shared', quadrant: 'integrate',
    current: 'Dashboard, tasks, role clarity, SOPs, onboarding, sales handoffs, outreach, and readiness views.',
    market: 'Peer internal workspaces are not publicly visible; the useful benchmark is role-based access and clear workflow ownership.',
    recommendation: 'Keep the information architecture; add authenticated users, permissions, durable ownership, and audit history.',
    rationale: 'The concept covers daily coordination well. Production value depends on identity, accountability, and shared records.', dependencies: 'Identity provider, role matrix, system owners, retention policy.'
  },
  {
    id: 'product-data', group: 'Enable', capability: 'Product information & digital assets', status: 'partial', horizon: 'Now', owner: 'Product + Marketing', effort: 'Contained', quadrant: 'now', short: 'PIM + DAM',
    current: 'Specifications and images are represented in frontend data from supplied sheets, without a shared revision-controlled source.',
    market: 'KI and Haworth publish centralized image, document, material, BIM, and specification resources.', sourceIds: ['kiDesign', 'haworthResources'],
    recommendation: 'Create a PIM + DAM master for models, options, packaging, documents, images, translations, and NFC mappings.',
    rationale: 'This is the highest-leverage shared layer: it prevents the website, quotes, employees, and NFC pages from drifting apart.', dependencies: 'Canonical model IDs, option taxonomy, data steward, approval workflow.'
  },
  {
    id: 'configuration', group: 'Convert', capability: 'Options & configuration', status: 'partial', horizon: 'Selective', owner: 'Product + Engineering', effort: 'Higher', quadrant: 'selective', short: 'Guided configuration',
    current: 'Custom materials and colors are described, but option rules, compatibility, pricing effects, and visual selection are not modeled.',
    market: 'Haworth’s public configurator supports finish and function selection with renders and CAD downloads.', sourceIds: ['haworthResources'],
    recommendation: 'Start with a guided option selector and configuration summary; defer photorealistic 3D until option data is reliable.',
    rationale: 'Private-label buyers need clear, manufacturable choices more than an expensive visual toy.', dependencies: 'Option rules, SKU logic, pricing effects, approved imagery, engineering ownership.'
  },
  {
    id: 'rfq-crm', group: 'Convert', capability: 'RFQ, accounts & CRM continuity', status: 'partial', horizon: 'Now', owner: 'Sales + RevOps', effort: 'Contained', quadrant: 'now', short: 'RFQ → CRM',
    current: 'Website RFQ forms and employee prospect views exist, but records are samples and are not durably connected.',
    market: 'MyOFS connects portal users with representatives and account-based services.', sourceIds: ['myOfs'],
    recommendation: 'Persist inquiries, accounts, contacts, owners, source, consent, next action, quotation, and order history in one CRM flow.',
    rationale: 'This closes the most direct leak between website demand and employee follow-up.', dependencies: 'CRM selection, form endpoint, deduplication, ownership rules, data retention.'
  },
  {
    id: 'outreach', group: 'Convert', capability: 'Outreach delivery & consent', status: 'partial', horizon: 'Now', owner: 'Sales + RevOps', effort: 'Contained', quadrant: 'now', short: 'Email + consent',
    current: 'Draft generation, local drafts, opt-out language, and local suppression are represented; nothing is sent or synchronized.',
    market: 'Peer outreach stacks are not publicly visible; production requirements are operational rather than cosmetic.',
    recommendation: 'Connect approved mailboxes, SPF/DKIM/DMARC, bounce and reply handling, market review, and global suppression.',
    rationale: 'Cold outreach becomes dependable only when reputation, consent, and suppression work across every system.', dependencies: 'Email provider, domain authentication, legal review, contact provenance, send limits.'
  },
  {
    id: 'samples', group: 'Convert', capability: 'Samples & OEM development', status: 'partial', horizon: 'Now', owner: 'Sales + Engineering', effort: 'Contained', quadrant: 'now', short: 'Sample workflow',
    current: 'OEM steps and a sample-approval SOP are described, but there is no shared sample record or revision workflow.',
    market: 'KI provides a dedicated literature and material sample request route.', sourceIds: ['kiSamples'],
    recommendation: 'Track request, cost, specification, revision, approval, shipment, feedback, and production sign-off in one sample workflow.',
    rationale: 'Sample approval is a critical OEM/ODM conversion gate and should not live only in email threads.', dependencies: 'CRM, product data, sample owner, revision IDs, shipping details.'
  },
  {
    id: 'documents', group: 'Evaluate', capability: 'Documents, quality & design resources', status: 'partial', horizon: 'Now', owner: 'QA + Product', effort: 'Contained', quadrant: 'now', short: 'Controlled documents',
    current: 'Public quality content and an internal document register are represented, with validity and scope still requiring verification.',
    market: 'Haworth and KI expose product sheets, instructions, technical documents, certificates, and related assets.', sourceIds: ['haworthResources', 'kiDesign'],
    recommendation: 'Add controlled files with entity, model, market, version, expiry, approval, access, and download history.',
    rationale: 'Fast access matters, but scope and version control matter more for compliance-sensitive buyer documents.', dependencies: 'DAM, QA approval, legal-entity mapping, model and market scope.'
  },
  {
    id: 'nfc', group: 'Retain', capability: 'NFC identity & scan intelligence', status: 'partial', horizon: 'Next', owner: 'Product + Marketing', effort: 'Shared', quadrant: 'selective', short: 'NFC registry + events',
    current: 'Stable model URLs, batch parameters, clipboard tools, and CSV export exist; tag inventory and scan events do not.',
    market: 'KI uses product-label QR scanning to help retrieve order numbers and furniture details for repair support.', sourceIds: ['kiRepair'],
    recommendation: 'Add a tag registry, managed redirects, privacy-aware scan events, broken-link monitoring, and service actions.',
    rationale: 'NFC becomes more valuable after it can connect product identity to service, not just open a catalog page.', dependencies: 'Tag IDs, redirect service, event policy, product and order mapping.'
  },
  {
    id: 'cpq', group: 'Convert', capability: 'Pricing, quotation & approvals', status: 'gap', horizon: 'Now → Next', owner: 'Sales + Finance', effort: 'Higher', quadrant: 'integrate', short: 'Export CPQ',
    current: 'No durable priced quotation, cost and margin control, approval, revision, or customer acceptance flow.',
    market: 'Steelcase describes dealer-prepared formal quotations tied to contract terms and purchase orders.', sourceIds: ['steelcaseBuying'],
    recommendation: 'Build export CPQ for currency, Incoterms, MOQ, packaging, tooling, validity, margin approval, revisions, and acceptance.',
    rationale: 'This is the central commercial gap for an OEM exporter and the bridge between RFQ and order.', dependencies: 'CRM, PIM, cost and price ownership, approval thresholds, ERP order handoff.'
  },
  {
    id: 'customer-portal', group: 'Deliver', capability: 'Customer / dealer workspace', status: 'gap', horizon: 'Next', owner: 'Sales + IT', effort: 'Higher', quadrant: 'integrate', short: 'Buyer workspace',
    current: 'No authenticated customer workspace for shared quotes, approvals, documents, orders, or service.',
    market: 'MyOFS provides account-based order tracking, warranty claims, and representative contact.', sourceIds: ['myOfs'],
    recommendation: 'Launch an invite-only buyer workspace after CRM and CPQ are stable; begin with quotes, samples, documents, and approvals.',
    rationale: 'A portal should expose reliable workflows, not create another place for buyers to chase missing information.', dependencies: 'Identity, CRM, CPQ, document control, support ownership.'
  },
  {
    id: 'orders', group: 'Deliver', capability: 'Production & order visibility', status: 'gap', horizon: 'Next', owner: 'Operations + IT', effort: 'Higher', quadrant: 'integrate', short: 'Order milestones',
    current: 'Export support is described publicly and ERP is listed as a readiness need, but no live order or production status exists.',
    market: 'KI provides order acknowledgements, shipping and tracking, invoices, and delivery schedules through account-based access.', sourceIds: ['kiOrder', 'myOfs'],
    recommendation: 'Publish ERP/MES-backed milestones, exceptions, inspections, packing, container documents, and shipment events.',
    rationale: 'Visibility reduces status-chasing, but only if operational milestones are accurate and owned.', dependencies: 'ERP/MES source, milestone definitions, exception rules, customer permissions.'
  },
  {
    id: 'service', group: 'Retain', capability: 'Warranty, parts & after-sales', status: 'gap', horizon: 'Next', owner: 'Service + QA', effort: 'Shared', quadrant: 'integrate', short: 'Warranty + parts',
    current: 'No warranty claim, parts request, care content, corrective action, or installed-product history is represented.',
    market: 'MyOFS includes warranty claims; KI provides repair and replacement support with product-label scanning.', sourceIds: ['myOfs', 'kiRepair'],
    recommendation: 'Add NFC-enabled service intake with model, batch, PO, photos, warranty decision, parts, and resolution history.',
    rationale: 'After-sales closes the lifecycle and creates a practical reason for NFC to remain useful after delivery.', dependencies: 'Warranty policy, parts catalog, order history, QA workflow, NFC identity.'
  },
  {
    id: 'sustainability', group: 'Evaluate', capability: 'Sustainability & product evidence', status: 'gap', horizon: 'Selective', owner: 'QA + Sustainability', effort: 'Higher', quadrant: 'selective', short: 'Material + footprint data',
    current: 'General environmental principles and management-system references exist, without model-specific footprint evidence.',
    market: 'Steelcase references EPDs and third-party product certifications in its public material-transparency resources.', sourceIds: ['steelcaseSustainability'],
    recommendation: 'Collect material, supplier, packaging, and repair data now; publish EPD/LCA outputs only when verified and commercially required.',
    rationale: 'Data readiness is useful now; expensive declarations should follow verified buyer or market needs rather than marketing fashion.', dependencies: 'Supplier data, material taxonomy, verification partner, model scope, legal review.'
  },
  {
    id: 'localization', group: 'Attract', capability: 'Market-specific content & localization', status: 'gap', horizon: 'Next', owner: 'Marketing + Regional Sales', effort: 'Shared', quadrant: 'useful', short: 'Priority-market pages',
    current: 'The concept is English-only and does not vary compliance, logistics, proof, or contact paths by buyer market.',
    market: 'Haworth maintains regional resource experiences rather than treating all buyers as one market.', sourceIds: ['haworthResources'],
    recommendation: 'Prioritize two or three buyer markets with localized compliance, logistics, proof, search content, and contact routing.',
    rationale: 'Focused market relevance is more valuable than translating every page into many languages at once.', dependencies: 'Market priorities, translation ownership, regional review, CRM routing.'
  },
  {
    id: 'analytics', group: 'Enable', capability: 'Journey analytics & attribution', status: 'gap', horizon: 'Now', owner: 'RevOps + Marketing', effort: 'Contained', quadrant: 'now', short: 'Funnel + attribution',
    current: 'No connected website, RFQ, outreach, quotation, order, or NFC measurement is represented.',
    market: 'Peer measurement stacks are not publicly visible; the relevant benchmark is a connected buyer journey rather than pageviews alone.',
    recommendation: 'Measure source → visit → scan → RFQ → quote → order → reorder with privacy-aware events and shared IDs.',
    rationale: 'Attribution shows which products, markets, campaigns, and NFC placements create commercial outcomes.', dependencies: 'Consent policy, event taxonomy, CRM and CPQ IDs, dashboard owner.'
  },
  {
    id: 'identity', group: 'Enable', capability: 'Identity, integration & audit', status: 'gap', horizon: 'Now', owner: 'IT + Operations', effort: 'Higher', quadrant: 'integrate', short: 'SSO + APIs + audit',
    current: 'Drafts, tasks, and suppression use browser localStorage; there is no server persistence, authentication, role control, backup, or audit.',
    market: 'MyOFS and KI use account-based access for customer services and order information.', sourceIds: ['myOfs', 'kiOrder'],
    recommendation: 'Add SSO, MFA, RBAC, offboarding, backups, audit logs, and a controlled integration layer before real operational data.',
    rationale: 'This is a prerequisite for every production workflow, not a standalone feature to postpone until the end.', dependencies: 'Identity provider, role matrix, API contracts, security review, retention and recovery policy.'
  }
];

const statusLabels = { covered: 'IN CONCEPT', partial: 'PARTIAL', gap: 'NOT ADDRESSED' };
const list = document.querySelector('#capability-list');
const search = document.querySelector('#coverage-search');
const empty = document.querySelector('#coverage-empty');
const dialog = document.querySelector('#capability-dialog');
let activeStatus = 'all';

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const sourceLinks = (ids = []) => ids.map((id) => {
  const source = sources[id];
  return `<a href="${source.url}" target="_blank" rel="noopener" aria-label="${source.company}: ${source.title} (opens in new tab)">${source.company}</a>`;
}).join(' ');

function renderCapabilities() {
  const term = search.value.trim().toLowerCase();
  const filtered = capabilities.filter((item) => {
    const statusMatch = activeStatus === 'all' || item.status === activeStatus;
    const text = [item.capability, item.group, item.current, item.market, item.recommendation, item.owner, item.horizon].join(' ').toLowerCase();
    return statusMatch && (!term || text.includes(term));
  });
  list.innerHTML = filtered.map((item) => `
    <article class="capability-row" role="row" data-status="${item.status}">
      <div class="capability-name" role="cell"><span>${escapeHtml(item.group)}</span><h3>${escapeHtml(item.capability)}</h3><small>${escapeHtml(item.horizon)} · ${escapeHtml(item.owner)}</small></div>
      <div class="matrix-cell" role="cell"><span class="mobile-column-label">Current concept</span><span class="status-badge ${item.status}">${statusLabels[item.status]}</span><p>${escapeHtml(item.current)}</p></div>
      <div class="matrix-cell market-cell" role="cell"><span class="mobile-column-label">Observed elsewhere</span><p>${escapeHtml(item.market)}</p><div class="inline-sources">${sourceLinks(item.sourceIds)}</div></div>
      <div class="matrix-cell recommendation-cell" role="cell"><span class="mobile-column-label">Best-fit move for ZJ</span><p>${escapeHtml(item.recommendation)}</p></div>
      <div class="row-action" role="cell"><button type="button" data-open-capability="${item.id}" aria-label="View details for ${escapeHtml(item.capability)}">→</button></div>
    </article>`).join('');
  empty.hidden = filtered.length > 0;
  document.querySelector('.capability-matrix').hidden = filtered.length === 0;
  document.querySelector('#filter-status').textContent = `Showing ${filtered.length} of ${capabilities.length} capabilities`;
}

function openCapability(id) {
  const item = capabilities.find((capability) => capability.id === id);
  if (!item) return;
  document.querySelector('#dialog-content').innerHTML = `
    <span class="status-badge ${item.status}">${statusLabels[item.status]}</span>
    <p class="dialog-group">${escapeHtml(item.group)} / ${escapeHtml(item.horizon)}</p>
    <h2 id="dialog-title">${escapeHtml(item.capability)}</h2>
    <p class="dialog-rationale">${escapeHtml(item.rationale)}</p>
    <dl class="dialog-facts"><div><dt>Recommended owner</dt><dd>${escapeHtml(item.owner)}</dd></div><div><dt>Implementation shape</dt><dd>${escapeHtml(item.effort)}</dd></div></dl>
    <section><h3>Best-fit move</h3><p>${escapeHtml(item.recommendation)}</p></section>
    <section><h3>Dependencies</h3><p>${escapeHtml(item.dependencies)}</p></section>
    ${item.sourceIds?.length ? `<section><h3>Observed public examples</h3><p>${escapeHtml(item.market)}</p><div class="dialog-sources">${sourceLinks(item.sourceIds)}</div></section>` : ''}`;
  dialog.showModal();
}

function renderQuadrants() {
  document.querySelectorAll('.quadrant').forEach((quadrant) => {
    const items = capabilities.filter((item) => item.quadrant === quadrant.dataset.quadrant && item.status !== 'covered');
    quadrant.querySelector('.quadrant-items').innerHTML = items.map((item) => `<button type="button" data-open-capability="${item.id}"><i class="signal-dot ${item.status}"></i><span>${escapeHtml(item.short || item.capability)}</span><small>${escapeHtml(item.horizon)}</small></button>`).join('');
  });
}

function renderSources() {
  document.querySelector('#source-list').innerHTML = Object.values(sources).map((source, index) => `
    <a class="source-item" href="${source.url}" target="_blank" rel="noopener">
      <span>${String(index + 1).padStart(2, '0')} · ${source.company}</span><h3>${source.title}</h3><p>${source.note}</p><strong>Open official source ↗</strong>
    </a>`).join('');
}

document.querySelectorAll('[data-status-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    activeStatus = button.dataset.statusFilter;
    document.querySelectorAll('[data-status-filter]').forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    renderCapabilities();
  });
});
search.addEventListener('input', renderCapabilities);
document.querySelector('#reset-filters').addEventListener('click', () => {
  activeStatus = 'all';
  search.value = '';
  document.querySelectorAll('[data-status-filter]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.statusFilter === 'all')));
  renderCapabilities();
  search.focus();
});
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-open-capability]');
  if (button) openCapability(button.dataset.openCapability);
});
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
document.querySelector('#print-map').addEventListener('click', () => {
  activeStatus = 'all';
  search.value = '';
  document.querySelectorAll('[data-status-filter]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.statusFilter === 'all')));
  renderCapabilities();
  window.print();
});

document.querySelector('#covered-count').textContent = capabilities.filter((item) => item.status === 'covered').length;
document.querySelector('#partial-count').textContent = capabilities.filter((item) => item.status === 'partial').length;
document.querySelector('#gap-count').textContent = capabilities.filter((item) => item.status === 'gap').length;
renderCapabilities();
renderQuadrants();
renderSources();
