export const COMMERCIAL_DOCUMENTS = [
  { type: 'po', code: 'PO', title: 'Purchase order', short: 'Buyer order details and accepted commercial terms.' },
  { type: 'pi', code: 'PI', title: 'Proforma invoice', short: 'Payment request aligned with the same quotation and order.' },
  { type: 'oc', code: 'OC', title: 'Order confirmation', short: 'Seller confirmation of products, terms, and production timing.' }
];

const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Number(value) || 0);
const clean = (value, max = 500) => String(value || '').trim().slice(0, max);
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const definitionFor = (type) => COMMERCIAL_DOCUMENTS.find((document) => document.type === type) || COMMERCIAL_DOCUMENTS[0];

export function createDocumentPack(draft, previous = null, now = draft?.createdAt || new Date().toISOString()) {
  return {
    version: Number(previous?.version) || 1,
    status: 'draft',
    values: { ...(draft?.values || {}) },
    sourceDraftCreatedAt: draft?.createdAt || now,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
    submittedAt: '',
    submittedBy: '',
    approvedAt: '',
    approvedBy: '',
    approvalNote: '',
    simulated: true,
    externallyDelivered: false
  };
}

export function reviseDocumentPack(pack, now = new Date().toISOString()) {
  return {
    ...createDocumentPack({ values: pack.values, createdAt: now }, null, now),
    version: (Number(pack.version) || 1) + 1
  };
}

export function documentReference(lead, pack, type) {
  const definition = definitionFor(type);
  return `${definition.code}-${lead.reference}-V${Number(pack.version) || 1}`;
}

function statusLabel(status) {
  if (status === 'approved') return 'APPROVED · LOCAL SIMULATION';
  if (status === 'pending') return 'AWAITING MANAGER APPROVAL';
  return 'DRAFT · NOT FOR EXTERNAL USE';
}

function documentPurpose(type) {
  if (type === 'pi') return 'Proforma payment request based on the quotation and order details below. Verify beneficiary and banking information through an authorized company process before any real transaction.';
  if (type === 'oc') return 'Seller order confirmation structured from the current commercial draft. Production, shipment, and delivery remain subject to genuine authorized approvals and specifications.';
  return 'Purchase order structured from the buyer inquiry, optional client template, and selected quotation. Confirm the buyer legal entity, PO number, specifications, and authorization before external use.';
}

export function commercialDocumentHTML(lead, pack, type) {
  const definition = definitionFor(type);
  const values = pack.values || {};
  const reference = documentReference(lead, pack, type);
  const approved = pack.status === 'approved';
  const buyer = lead.company || lead.name || 'Unnamed test buyer';
  const quantity = Math.max(1, Number(values.quantity) || 1);
  const unitPrice = Math.max(0, Number(values.unitPrice) || 0);
  const total = Math.max(0, Number(values.total) || unitPrice * quantity);
  const approval = approved
    ? `<div class="approval approved"><strong>Approved in this local simulation</strong><p>${escapeHTML(pack.approvedBy)} · ${escapeHTML(new Date(pack.approvedAt).toLocaleString('en-US'))}</p>${pack.approvalNote ? `<p>Note: ${escapeHTML(pack.approvalNote)}</p>` : ''}</div>`
    : '<div class="approval"><strong>Manager approval required</strong><p>This document is not approved, externally delivered, or binding.</p></div>';
  const templateSection = type === 'po'
    ? `<section class="notes"><h2>Client template text / sales notes</h2><p>${escapeHTML(values.templateText || 'No extractable template text supplied. Review the original uploaded file and complete buyer-specific fields manually.')}</p></section>`
    : '';
  const paymentSection = type === 'pi'
    ? '<section class="notes"><h2>Payment verification</h2><p>Beneficiary, bank, tax, and remittance details must be supplied and independently verified by authorized ZJ Seating staff. This browser-local demo contains no banking credentials.</p></section>'
    : '';
  const confirmationSection = type === 'oc'
    ? '<section class="notes"><h2>Confirmation checklist</h2><p>Confirm final product specification, finishes, packaging, carton marks, inspection requirements, delivery terms, and authorized buyer acceptance before production.</p></section>'
    : '';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHTML(reference)} · ${escapeHTML(definition.title)}</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#eef2f1;color:#172536;font:14px/1.6 Arial,sans-serif}.toolbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;max-width:920px;margin:20px auto;padding:0 16px}.toolbar p{margin:0;color:#52606b;font-size:12px}.toolbar button{min-height:44px;padding:10px 18px;border:0;border-radius:3px;background:#b84a16;color:#fff;font:700 13px Arial,sans-serif;cursor:pointer}.toolbar button:hover{background:#94390f}.toolbar button:focus-visible{outline:3px solid #d67847;outline-offset:3px}.sheet{max-width:920px;margin:0 auto 32px;padding:48px;background:#fff;border:1px solid #d7dedd}.masthead{display:flex;justify-content:space-between;gap:24px;padding-bottom:24px;border-bottom:2px solid #172536}.brand{font-size:22px;font-weight:800;letter-spacing:.04em}.brand small{display:block;margin-top:3px;color:#52606b;font-size:10px;letter-spacing:.16em}.doc-title{text-align:right}.doc-title h1{margin:0;font-size:25px;line-height:1.25}.doc-title p{margin:5px 0 0;color:#52606b}.status{margin:22px 0;padding:11px 14px;border:1px solid #cf793f;background:#fff0e4;color:#743510;font-size:12px;font-weight:700}.status.approved{border-color:#6c9a7c;background:#edf6ef;color:#285b39}.intro{margin:0 0 24px;color:#3d4c59}.meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 28px;margin-bottom:26px}.meta div{min-width:0}.meta dt{color:#687681;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}.meta dd{margin:3px 0 0;overflow-wrap:anywhere;font-weight:700}table{width:100%;border-collapse:collapse;margin:8px 0 24px}caption{margin-bottom:8px;text-align:left;font-size:16px;font-weight:800}th,td{padding:11px 10px;border-bottom:1px solid #d7dedd;text-align:left;vertical-align:top;overflow-wrap:anywhere}th{background:#f3f6f5;color:#52606b;font-size:11px}td.number,th.number{text-align:right;white-space:nowrap}.total td{font-size:16px;font-weight:800}.terms{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 28px;margin:24px 0}.terms h2,.notes h2{margin:0 0 5px;font-size:12px;text-transform:uppercase;letter-spacing:.05em}.terms p,.notes p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.notes{margin-top:22px;padding-top:18px;border-top:1px solid #d7dedd}.approval{margin-top:26px;padding:14px 16px;border:1px solid #cf793f;background:#fff8f1}.approval.approved{border-color:#6c9a7c;background:#f2f8f3}.approval p{margin:4px 0 0}.signatures{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:40px;margin-top:42px}.signatures p{margin:0;padding-top:10px;border-top:1px solid #687681;color:#52606b;font-size:11px}.footer{margin-top:34px;padding-top:14px;border-top:1px solid #d7dedd;color:#52606b;font-size:10px}@page{size:A4;margin:14mm}@media(max-width:600px){.sheet{margin:0 10px 20px;padding:24px 18px}.masthead{display:block}.doc-title{margin-top:18px;text-align:left}.meta,.terms{grid-template-columns:minmax(0,1fr)}.signatures{gap:18px}.sheet table{font-size:11px}th,td{padding:8px 5px}}@media print{body{background:#fff;font-size:11px}.toolbar{display:none}.sheet{max-width:none;margin:0;padding:0;border:0}.masthead{padding-bottom:16px}.status{margin:16px 0}.meta{margin-bottom:18px}table{margin-bottom:16px}th,td{padding:7px}.terms{margin:16px 0}.notes{break-inside:avoid;margin-top:16px;padding-top:12px}.approval,.signatures{break-inside:avoid}.signatures{margin-top:30px}.footer{margin-top:22px}}
</style></head><body>
<div class="toolbar"><p>${escapeHTML(reference)} · Browser-local print preview</p><button id="print-document" type="button">Print / Save as PDF</button></div>
<main class="sheet">
<header class="masthead"><div class="brand">ZJ SEATING<small>SEATING TECHNOLOGY · CONCEPT DOCUMENT</small></div><div class="doc-title"><h1>${escapeHTML(definition.title)}</h1><p>${escapeHTML(reference)}</p></div></header>
<div class="status ${approved ? 'approved' : ''}">${escapeHTML(statusLabel(pack.status))} · VERSION ${Number(pack.version) || 1}</div>
<p class="intro">${escapeHTML(documentPurpose(type))}</p>
<dl class="meta"><div><dt>Buyer</dt><dd>${escapeHTML(buyer)}</dd></div><div><dt>Buyer contact</dt><dd>${escapeHTML(lead.name || 'Not provided')} · ${escapeHTML(lead.email || 'Not provided')}</dd></div><div><dt>RFQ reference</dt><dd>${escapeHTML(lead.reference)}</dd></div><div><dt>Quotation</dt><dd>${escapeHTML(values.quoteReference || 'Not specified')}</dd></div><div><dt>Document updated</dt><dd>${escapeHTML(new Date(pack.updatedAt).toLocaleDateString('en-US'))}</dd></div><div><dt>Client template</dt><dd>${escapeHTML(lead.poAttachment?.name || 'No client template attached')}</dd></div></dl>
<table><caption>Order details</caption><thead><tr><th>Model / product</th><th class="number">Quantity</th><th class="number">Unit price</th><th class="number">Total USD</th></tr></thead><tbody><tr><td>${escapeHTML(values.model || 'General seating program')}</td><td class="number">${quantity} pcs</td><td class="number">${money(unitPrice)}</td><td class="number">${money(total)}</td></tr><tr class="total"><td colspan="3">Illustrative order total</td><td class="number">${money(total)} USD</td></tr></tbody></table>
<section class="terms"><div><h2>Incoterm & destination</h2><p>${escapeHTML(values.incoterm || 'To be confirmed')} · ${escapeHTML(values.destination || 'Not specified')}</p></div><div><h2>Quotation valid until</h2><p>${escapeHTML(values.validUntil || 'Not specified')}</p></div><div><h2>Lead time</h2><p>${escapeHTML(values.leadTime || 'To be confirmed')}</p></div><div><h2>Payment terms</h2><p>${escapeHTML(values.paymentTerms || 'To be confirmed')}</p></div></section>
${templateSection}${paymentSection}${confirmationSection}
<section class="notes"><h2>Buyer project notes</h2><p>${escapeHTML(lead.notes || 'None provided.')}</p></section>
${approval}
<div class="signatures"><p>Authorized buyer / date</p><p>Authorized ZJ Seating representative / date</p></div>
<footer class="footer">Browser-local concept document. Human review and genuine company authorization are required before real commercial use. No external AI, email, CRM, ERP, payment platform, or ZJ Seating company system was contacted. This file was not externally delivered.</footer>
</main><script>document.querySelector('#print-document').addEventListener('click',()=>window.print());</script></body></html>`;
}
