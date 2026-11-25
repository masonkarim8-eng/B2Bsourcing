import './quote-room.css';
import { readClientAccounts } from './client-store.js';
import { publishQuoteRoom, readQuoteRooms } from './quote-room-store.js';

const baseRates = { mesh: 48, executive: 78, visitor: 32, study: 28, task: 26, sofa: 185 };
const configurations = {
  standard: { label: 'Standard configuration', addition: 0 },
  color: { label: 'Custom color', addition: 1.5 },
  fabric: { label: 'Custom fabric', addition: 4 },
  premium: { label: 'Premium components', addition: 7.5 }
};
const packagingOptions = {
  standard: { label: 'Standard export packaging', addition: 0 },
  reinforced: { label: 'Reinforced packaging', addition: 1.25 },
  retail: { label: 'Retail / color box', addition: 2.75 }
};

const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
const numberValue = (value) => Number.parseFloat(value) || 0;
const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;

function productMoq(product) {
  return Number.parseInt(product.moq, 10) || 100;
}

function quoteId() {
  return `Q-DEMO-${Date.now().toString(36).toUpperCase()}`;
}

function defaultValidity() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

export function initQuotes({ products, prospects, state, saveState, downloadFile, copyText, escapeHtml, navigate, getEmployee = () => null }) {
  const form = document.querySelector('#quote-form');
  const productSelect = document.querySelector('#quote-product');
  const prospectSelect = document.querySelector('#quote-prospect');
  let currentId = quoteId();
  let currentCalculation = null;

  prospectSelect.innerHTML = prospects.map((prospect, index) => `<option value="${index}">${escapeHtml(prospect.company)} · ${escapeHtml(prospect.market)}</option>`).join('');
  productSelect.innerHTML = products.map((product) => `<option value="${escapeHtml(product.model)}">${escapeHtml(product.model)} · ${escapeHtml(product.label)}</option>`).join('');

  function resetForm() {
    form.reset();
    prospectSelect.value = '3';
    productSelect.value = '9628H';
    document.querySelector('#quote-quantity').value = '300';
    document.querySelector('#quote-valid-until').value = defaultValidity();
    document.querySelector('#quote-notes').value = '';
    currentId = quoteId();
    updateProduct();
  }

  function readValues() {
    return {
      prospectIndex: Number(prospectSelect.value),
      productModel: productSelect.value,
      quantity: Math.max(1, Math.round(numberValue(document.querySelector('#quote-quantity').value))),
      configuration: document.querySelector('#quote-configuration').value,
      packaging: document.querySelector('#quote-packaging').value,
      incoterm: document.querySelector('#quote-incoterm').value,
      destination: document.querySelector('#quote-destination').value.trim(),
      tooling: Math.max(0, numberValue(document.querySelector('#quote-tooling').value)),
      testing: Math.max(0, numberValue(document.querySelector('#quote-testing').value)),
      freight: Math.max(0, numberValue(document.querySelector('#quote-freight').value)),
      discount: Math.min(15, Math.max(0, numberValue(document.querySelector('#quote-discount').value))),
      validUntil: document.querySelector('#quote-valid-until').value,
      notes: document.querySelector('#quote-notes').value.trim()
    };
  }

  function calculate(values, quantity = values.quantity) {
    const product = products.find((item) => item.model === values.productModel) || products[0];
    const moq = productMoq(product);
    const base = baseRates[product.category] ?? baseRates.mesh;
    const option = configurations[values.configuration]?.addition ?? 0;
    const packaging = packagingOptions[values.packaging]?.addition ?? 0;
    const quantityAdjustment = quantity < moq ? 0.12 : quantity < moq * 2 ? 0 : quantity < moq * 4 ? -0.03 : -0.05;
    const unitBeforeDiscount = (base + option + packaging) * (1 + quantityAdjustment);
    const finalUnit = unitBeforeDiscount * (1 - values.discount / 100);
    const productSubtotal = finalUnit * quantity;
    const oneTimeCharges = values.tooling + values.testing;
    const total = productSubtotal + oneTimeCharges + values.freight;
    const estimatedCost = (base * 0.72 + option * 0.80 + packaging * 0.85) * quantity + oneTimeCharges + values.freight;
    const margin = total > 0 ? ((total - estimatedCost) / total) * 100 : 0;
    return {
      ...values, product, quantity, moq, unit: product.moq?.toLowerCase().includes('sets') ? 'sets' : 'pcs',
      base, option, packagingRate: packaging, quantityAdjustment, unitBeforeDiscount, finalUnit, productSubtotal,
      oneTimeCharges, total, estimatedCost, margin
    };
  }

  function approvalFor(calculation) {
    if (calculation.discount > 12 || calculation.margin < 8) {
      return { key: 'outside', label: 'Outside demo guardrail', detail: 'Save a draft only. Director review and a revised commercial position are required before approval.', action: 'Outside guardrail — save draft only' };
    }
    if (calculation.discount > 5 || calculation.margin < 18) {
      return { key: 'requested', label: 'Director approval requested', detail: 'The discount exceeds 5% or illustrative margin is below 18%. Saving records an approval request only.', action: 'Save & request approval' };
    }
    return { key: 'approved', label: 'Within sales-manager authority', detail: 'Discount is no more than 5% and illustrative margin is at least 18%. This is a local demo approval.', action: 'Approve & save version' };
  }

  function updateProduct() {
    const product = products.find((item) => item.model === productSelect.value);
    const moq = productMoq(product);
    document.querySelector('#quote-product-image').src = product.image;
    document.querySelector('#quote-product-image').alt = product.alt;
    document.querySelector('#quote-model-name').textContent = product.name;
    document.querySelector('#quote-model-moq').textContent = `${product.moq || `100 ${product.category === 'sofa' ? 'pcs' : 'pcs'}`} · sample category rate ${money(baseRates[product.category] ?? 48)} / unit`;
    document.querySelector('#quote-quantity-help').textContent = `MOQ ${moq} · below-MOQ orders remain quotable with a 12% sample surcharge and sales acceptance check.`;
    render();
  }

  function renderAlternatives(calculation) {
    const alternatives = [
      { quantity: calculation.moq, label: 'MOQ', detail: 'Standard volume tier' },
      { quantity: calculation.moq * 2, label: '2× MOQ', detail: '3% volume adjustment' },
      { quantity: calculation.moq * 4, label: '4× MOQ', detail: '5% volume adjustment' }
    ];
    document.querySelector('#quote-alternatives').innerHTML = alternatives.map((alternative) => {
      const comparison = calculate(calculation, alternative.quantity);
      return `<article class="quantity-option ${alternative.quantity === calculation.quantity ? 'selected' : ''}"><div><span>${alternative.label}</span><strong>${alternative.quantity} ${calculation.unit}</strong><small>${alternative.detail}</small></div><dl><div><dt>Unit price</dt><dd>${money(comparison.finalUnit)}</dd></div><div><dt>Order total</dt><dd>${money(comparison.total)}</dd></div></dl><button type="button" data-apply-quantity="${alternative.quantity}" aria-label="Apply ${alternative.quantity} ${calculation.unit}" ${alternative.quantity === calculation.quantity ? 'disabled' : ''}>${alternative.quantity === calculation.quantity ? 'Current quantity' : 'Apply quantity'}</button></article>`;
    }).join('');
  }

  function renderHistory() {
    const container = document.querySelector('#quote-history');
    if (!state.quotes.length) {
      container.innerHTML = '<p>No saved quotation versions yet. Save a draft or approval outcome to start the negotiation record.</p>';
      return;
    }
    const rooms = readQuoteRooms();
    container.innerHTML = state.quotes.map((quote) => {
      const prospect = prospects[quote.values.prospectIndex]?.company || 'Unknown prospect';
      const room = rooms.find((item) => item.quoteSnapshotId === quote.snapshotId);
      const roomStatus = room ? `<span class="quote-room-status ${room.status.toLowerCase().replaceAll(' ', '-')}">${escapeHtml(room.status)} · ${escapeHtml(room.client.company)}</span>` : '';
      const roomDecision = room?.decision ? `<small class="quote-room-decision"><strong>${room.decision.type === 'accepted' ? 'Client acceptance' : 'Client change request'}:</strong> ${escapeHtml(room.decision.note || 'No additional note.')}</small>` : '';
      const shareButton = quote.statusKey === 'approved' && !room ? `<button type="button" data-share-quote="${escapeHtml(quote.snapshotId)}">Share to client</button>` : '';
      return `<article class="quote-version"><div class="version-marker">V${quote.version}</div><div><strong>${escapeHtml(quote.id)} · ${escapeHtml(prospect)}</strong><small>${escapeHtml(quote.values.productModel)} · ${quote.values.quantity} units · ${money(quote.calculation.total)}</small><small>${escapeHtml(new Date(quote.savedAt).toLocaleString('en-US'))}</small></div><span class="version-status ${quote.statusKey}">${escapeHtml(quote.status)}</span><div class="quote-version-actions"><button type="button" data-load-quote="${escapeHtml(quote.snapshotId)}">Load version</button>${shareButton}${roomStatus}${roomDecision}</div></article>`;
    }).join('');
  }

  function render() {
    currentCalculation = calculate(readValues());
    const quote = currentCalculation;
    const approval = approvalFor(quote);
    document.querySelector('#quote-id-display').textContent = currentId;
    document.querySelector('#quote-base').textContent = money(quote.base);
    document.querySelector('#quote-option').textContent = `+ ${money(quote.option)}`;
    document.querySelector('#quote-packaging-rate').textContent = `+ ${money(quote.packagingRate)}`;
    document.querySelector('#quote-quantity-adjustment').textContent = `${quote.quantityAdjustment > 0 ? '+' : ''}${(quote.quantityAdjustment * 100).toFixed(0)}%`;
    document.querySelector('#quote-negotiated-adjustment').textContent = `− ${quote.discount.toFixed(1)}%`;
    document.querySelector('#quote-final-unit').textContent = money(quote.finalUnit);
    document.querySelector('#quote-subtotal').textContent = money(quote.productSubtotal);
    document.querySelector('#quote-one-time').textContent = money(quote.oneTimeCharges);
    document.querySelector('#quote-freight-total').textContent = money(quote.freight);
    document.querySelector('#quote-total').textContent = money(quote.total);
    document.querySelector('#quote-cost').textContent = money(quote.estimatedCost);
    document.querySelector('#quote-margin').textContent = `${quote.margin.toFixed(1)}%`;
    document.querySelector('#quote-margin-bar').style.setProperty('--margin', `${Math.max(0, Math.min(100, quote.margin))}%`);
    document.querySelector('#quote-approval-title').textContent = approval.label;
    document.querySelector('#quote-approval-detail').textContent = approval.detail;
    document.querySelector('#quote-approval').className = `quote-approval ${approval.key}`;
    const approvalButton = document.querySelector('#quote-approve');
    approvalButton.textContent = approval.action;
    approvalButton.disabled = approval.key === 'outside';
    const warning = document.querySelector('#quote-moq-warning');
    warning.hidden = quote.quantity >= quote.moq;
    if (quote.quantity < quote.moq) warning.textContent = `${quote.quantity} ${quote.unit} is below the ${quote.moq}-${quote.unit} MOQ. The 12% illustrative surcharge is included; sales must confirm acceptance before offering these terms.`;
    document.querySelector('#quote-quantity-context').textContent = `${quote.quantity} ${quote.unit} · ${quote.product.label}`;
    renderAlternatives(quote);
  }

  function customerSummary() {
    const quote = currentCalculation;
    const prospect = prospects[quote.prospectIndex];
    return [
      'ZJ SEATING — ILLUSTRATIVE QUOTATION SUMMARY',
      'Sample pricing only — not approved ZJ Seating pricing or a binding offer.',
      '',
      `Reference: ${currentId}`,
      `Customer: ${prospect.company}`,
      `Product: ${quote.product.model} — ${quote.product.name}`,
      `Quantity: ${quote.quantity} ${quote.unit}`,
      `Configuration: ${configurations[quote.configuration].label}`,
      `Packaging: ${packagingOptions[quote.packaging].label}`,
      `Incoterm / destination: ${quote.incoterm}${quote.destination ? ` / ${quote.destination}` : ''}`,
      `Unit price: ${money(quote.finalUnit)} USD`,
      `Product subtotal: ${money(quote.productSubtotal)} USD`,
      `Tooling and testing: ${money(quote.oneTimeCharges)} USD`,
      `Freight / services: ${money(quote.freight)} USD`,
      `Illustrative order total: ${money(quote.total)} USD`,
      `Valid until: ${quote.validUntil}`,
      quote.notes ? `Notes: ${quote.notes}` : '',
      '',
      quote.quantity < quote.moq ? `Below-MOQ acceptance must be confirmed by sales (published MOQ: ${quote.moq} ${quote.unit}).` : '',
      'Final pricing, specifications, freight, taxes, payment terms, lead time, and availability require written confirmation by ZJ Seating.'
    ].filter((line, index) => line || (index > 0 && index < 18)).join('\n');
  }

  function saveVersion(mode) {
    if (!form.reportValidity()) return;
    const quote = currentCalculation;
    const approval = approvalFor(quote);
    const statusKey = mode === 'draft' ? 'draft' : approval.key;
    if (statusKey === 'outside') return;
    const status = statusKey === 'draft' ? 'Draft (demo)' : statusKey === 'approved' ? 'Approved (demo)' : 'Approval requested (demo)';
    const version = Math.max(0, ...state.quotes.filter((item) => item.id === currentId).map((item) => item.version)) + 1;
    const snapshot = {
      snapshotId: `quote-${Date.now()}`,
      id: currentId,
      version,
      savedAt: new Date().toISOString(),
      values: readValues(),
      calculation: {
        finalUnit: round(quote.finalUnit), productSubtotal: round(quote.productSubtotal),
        oneTimeCharges: round(quote.oneTimeCharges), freight: quote.freight, total: round(quote.total),
        estimatedCost: round(quote.estimatedCost), margin: round(quote.margin), moq: quote.moq
      },
      status,
      statusKey
    };
    state.quotes.unshift(snapshot);
    saveState();
    renderHistory();
    document.querySelector('#quote-save-status').textContent = `${currentId} version ${version} saved as “${status}” in this browser only.`;
  }

  form.addEventListener('input', (event) => {
    if (event.target === productSelect) updateProduct();
    else render();
  });
  form.addEventListener('change', (event) => {
    if (event.target === productSelect) updateProduct();
    else render();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveVersion('submit');
  });
  document.querySelector('#quote-save-draft').addEventListener('click', () => saveVersion('draft'));
  document.querySelector('#quote-new').addEventListener('click', () => {
    resetForm();
    document.querySelector('#quote-save-status').textContent = 'New quotation started. No saved versions were changed.';
  });
  document.querySelector('#quote-alternatives').addEventListener('click', (event) => {
    const button = event.target.closest('[data-apply-quantity]');
    if (!button || button.disabled) return;
    document.querySelector('#quote-quantity').value = button.dataset.applyQuantity;
    render();
    document.querySelector('#quote-save-status').textContent = `Quantity changed to ${button.dataset.applyQuantity}. Review and save a new version to retain this comparison.`;
  });
  document.querySelector('#quote-copy').addEventListener('click', async () => {
    const copied = await copyText(customerSummary());
    document.querySelector('#quote-save-status').textContent = copied ? 'Customer summary copied. Internal cost and margin were excluded.' : 'Copy unavailable in this browser.';
  });
  document.querySelector('#quote-export').addEventListener('click', () => {
    const quote = currentCalculation;
    const prospect = prospects[quote.prospectIndex];
    const rows = [
      ['ZJ Seating illustrative quotation — not approved pricing or a binding offer'],
      ['Reference', currentId], ['Customer', prospect.company], ['Model', quote.productModel],
      ['Quantity', quote.quantity], ['Unit', quote.unit], ['Configuration', configurations[quote.configuration].label],
      ['Packaging', packagingOptions[quote.packaging].label], ['Incoterm', quote.incoterm], ['Destination', quote.destination],
      ['Sample base rate USD', quote.base.toFixed(2)], ['Options per unit USD', quote.option.toFixed(2)],
      ['Packaging per unit USD', quote.packagingRate.toFixed(2)], ['Quantity adjustment', `${quote.quantityAdjustment * 100}%`],
      ['Negotiated discount', `${quote.discount}%`], ['Final unit price USD', quote.finalUnit.toFixed(2)],
      ['Product subtotal USD', quote.productSubtotal.toFixed(2)], ['Tooling USD', quote.tooling.toFixed(2)],
      ['Testing / inspection USD', quote.testing.toFixed(2)], ['Freight / services USD', quote.freight.toFixed(2)],
      ['Illustrative order total USD', quote.total.toFixed(2)], ['Valid until', quote.validUntil], ['Notes', quote.notes],
      ['Below-MOQ sales acceptance required', quote.quantity < quote.moq ? 'Yes' : 'No']
    ];
    downloadFile(`${currentId.toLowerCase()}-illustrative.csv`, rows.map((row) => row.map(csvCell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
    document.querySelector('#quote-save-status').textContent = 'Customer CSV exported without internal cost or margin.';
  });
  function roomPayload(saved) {
    const product = products.find((item) => item.model === saved.values.productModel);
    return {
      snapshotId: saved.snapshotId,
      id: saved.id,
      version: saved.version,
      quote: {
        id: saved.id,
        version: saved.version,
        savedAt: saved.savedAt,
        productModel: saved.values.productModel,
        productName: product?.name || saved.values.productModel,
        productImage: product?.image || '',
        productAlt: product?.alt || saved.values.productModel,
        quantity: saved.values.quantity,
        unit: product?.moq?.toLowerCase().includes('sets') ? 'sets' : 'pcs',
        configuration: configurations[saved.values.configuration]?.label || saved.values.configuration,
        packaging: packagingOptions[saved.values.packaging]?.label || saved.values.packaging,
        incoterm: saved.values.incoterm,
        destination: saved.values.destination,
        finalUnit: saved.calculation.finalUnit,
        productSubtotal: saved.calculation.productSubtotal,
        oneTimeCharges: saved.calculation.oneTimeCharges,
        freight: saved.calculation.freight,
        total: saved.calculation.total,
        validUntil: saved.values.validUntil,
        notes: saved.values.notes,
        belowMoq: saved.values.quantity < saved.calculation.moq,
        moq: saved.calculation.moq,
        currency: 'USD'
      }
    };
  }

  document.body.insertAdjacentHTML('beforeend', '<dialog class="quote-share-dialog" id="quote-share-dialog" aria-labelledby="quote-share-title"><button class="quote-share-close" id="quote-share-close" type="button" aria-label="Close client sharing">×</button><p class="overline">CLIENT QUOTE ROOM</p><h2 id="quote-share-title">Share an approved version.</h2><p id="quote-share-summary"></p><form id="quote-share-form"><label>Client account<select id="quote-share-client" required></select></label><p>The client will see only customer-safe commercial details. Internal cost and margin are never copied into the quote room.</p><button class="admin-primary" type="submit">Publish to client quote room</button><p class="form-message" id="quote-share-status" role="status"></p></form><small>Browser-local sharing only. No external email or notification is sent.</small></dialog>');
  const shareDialog = document.querySelector('#quote-share-dialog');
  const shareForm = document.querySelector('#quote-share-form');

  function openShare(snapshotId) {
    const saved = state.quotes.find((item) => item.snapshotId === snapshotId && item.statusKey === 'approved');
    if (!saved) return;
    shareDialog.dataset.snapshotId = snapshotId;
    document.querySelector('#quote-share-summary').textContent = `${saved.id} · Version ${saved.version} · ${saved.values.productModel} · ${money(saved.calculation.total)}`;
    document.querySelector('#quote-share-client').innerHTML = readClientAccounts().map((client) => `<option value="${escapeHtml(client.id)}">${escapeHtml(client.company)} · ${escapeHtml(client.name)} · ${escapeHtml(client.email)}</option>`).join('');
    document.querySelector('#quote-share-status').textContent = '';
    shareDialog.showModal();
  }

  document.querySelector('#quote-share-close').addEventListener('click', () => shareDialog.close());
  shareDialog.addEventListener('click', (event) => { if (event.target === shareDialog) shareDialog.close(); });
  shareForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const saved = state.quotes.find((item) => item.snapshotId === shareDialog.dataset.snapshotId && item.statusKey === 'approved');
    const client = readClientAccounts().find((item) => item.id === document.querySelector('#quote-share-client').value);
    if (!saved || !client) return;
    const result = publishQuoteRoom({ client, quote: roomPayload(saved), employee: getEmployee() });
    if (result.error) {
      document.querySelector('#quote-share-status').textContent = 'The quote room could not be saved. Check browser storage permissions.';
      return;
    }
    shareDialog.close();
    renderHistory();
    document.querySelector('#quote-save-status').textContent = result.existing ? `${saved.id} V${saved.version} is already shared with ${client.company}.` : `${saved.id} V${saved.version} published to ${client.company}. No external message was sent.`;
  });

  document.querySelector('#quote-history').addEventListener('click', (event) => {
    const share = event.target.closest('[data-share-quote]');
    if (share) {
      openShare(share.dataset.shareQuote);
      return;
    }
    const button = event.target.closest('[data-load-quote]');
    if (!button) return;
    const saved = state.quotes.find((item) => item.snapshotId === button.dataset.loadQuote);
    if (!saved) return;
    currentId = saved.id;
    const values = saved.values;
    prospectSelect.value = String(values.prospectIndex);
    productSelect.value = values.productModel;
    ['quantity', 'configuration', 'packaging', 'incoterm', 'destination', 'tooling', 'testing', 'freight', 'discount', 'validUntil', 'notes'].forEach((key) => {
      const id = key === 'validUntil' ? 'valid-until' : key;
      document.querySelector(`#quote-${id}`).value = values[key];
    });
    updateProduct();
    document.querySelector('#quote-save-status').textContent = `${saved.id} version ${saved.version} loaded. Saving will create the next version without overwriting history.`;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  resetForm();
  renderHistory();

  return function loadQuote(prospectIndex, model, quantity) {
    resetForm();
    prospectSelect.value = String(prospectIndex);
    productSelect.value = model;
    document.querySelector('#quote-quantity').value = String(quantity);
    updateProduct();
    navigate('quotes');
    document.querySelector('#quote-save-status').textContent = 'RFQ details carried into a new illustrative quotation. Confirm specifications and commercial terms before saving.';
  };
}
