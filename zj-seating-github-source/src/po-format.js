const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Number(value) || 0);
const clean = (value, max = 500) => String(value || '').trim().slice(0, max);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function defaultPOValues(lead) {
  const validUntil = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  return {
    quoteReference: `Q-${lead.reference}`,
    model: lead.models?.join(', ') || 'General seating program',
    quantity: lead.quantity || '1',
    unitPrice: '',
    total: '',
    incoterm: 'FOB',
    destination: lead.destination || '',
    validUntil,
    leadTime: '30–45 days after deposit and final approval (demo)',
    paymentTerms: '30% deposit / 70% before shipment (demo)',
    templateText: ''
  };
}

export function valuesFromQuote(quote, lead) {
  const values = defaultPOValues(lead);
  return {
    ...values,
    quoteReference: `${quote.id} · V${quote.version}`,
    model: quote.values.productModel,
    quantity: String(quote.values.quantity),
    unitPrice: String(quote.calculation.finalUnit),
    total: String(quote.calculation.total),
    incoterm: quote.values.incoterm,
    destination: quote.values.destination || lead.destination || '',
    validUntil: quote.values.validUntil,
    templateText: values.templateText
  };
}

export function formatPODraft(lead, input) {
  const values = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, clean(value, key === 'templateText' ? 6000 : 500)]));
  const quantity = Math.max(1, Number(values.quantity) || 1);
  const unitPrice = Math.max(0, Number(values.unitPrice) || 0);
  const total = Math.max(0, Number(values.total) || unitPrice * quantity);
  const buyer = lead.company || lead.name || 'Unnamed test buyer';
  const templateName = lead.poAttachment?.name || 'No client template attached';
  const lines = [
    'ZJ SEATING — FORMATTED PURCHASE ORDER DRAFT',
    'LOCAL AI-STYLE SIMULATION · HUMAN REVIEW REQUIRED',
    'Not an accepted purchase order or binding commercial document.',
    '',
    `PO draft: PO-${lead.reference}`,
    `RFQ reference: ${lead.reference}`,
    `Quotation: ${values.quoteReference}`,
    `Buyer: ${buyer}`,
    `Buyer contact: ${lead.name || 'Not provided'} <${lead.email || 'Not provided'}>`,
    `Client template: ${templateName}`,
    '',
    'ORDER DETAILS',
    `Model / product: ${values.model}`,
    `Quantity: ${quantity} pcs`,
    `Unit price: ${money(unitPrice)} USD`,
    `Illustrative order total: ${money(total)} USD`,
    '',
    'COMMERCIAL TERMS',
    `Incoterm: ${values.incoterm}`,
    `Destination: ${values.destination || 'Not specified'}`,
    `Quotation valid until: ${values.validUntil || 'Not specified'}`,
    `Lead time: ${values.leadTime || 'To be confirmed'}`,
    `Payment terms: ${values.paymentTerms || 'To be confirmed'}`,
    '',
    'BUYER PROJECT NOTES',
    lead.notes || 'None provided.',
    '',
    'CLIENT TEMPLATE TEXT / SALES NOTES',
    values.templateText || 'No extractable template text was supplied. Review the original uploaded file and complete buyer-specific fields manually.',
    '',
    'REVIEW CHECKLIST',
    '□ Confirm buyer legal name, billing details, shipping address, and PO number.',
    '□ Match model, specifications, quantity, currency, price, and quotation version.',
    '□ Confirm payment, lead time, Incoterm, freight, taxes, warranty, and approval terms.',
    '□ Obtain authorized buyer and ZJ Seating approval before external use.',
    '',
    'Generated and stored only in this browser. No AI service, email, CRM, or ERP was contacted.'
  ];
  return { text: lines.join('\n'), values: { ...values, quantity: String(quantity), unitPrice: String(unitPrice), total: String(total) } };
}

export function formattedPOHTML(lead, draft) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>PO-${escapeHTML(lead.reference)} · Local draft</title><style>body{margin:0;background:#f3f6f5;color:#172536;font:15px/1.65 Arial,sans-serif}main{box-sizing:border-box;max-width:900px;margin:32px auto;padding:40px;background:#fbfcfb;border:1px solid #d7dedd}h1{margin:0;font-size:26px}p{color:#52606b}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.65 Arial,sans-serif}.warning{padding:12px 16px;border:1px solid #cf793f;background:#fff0e4;color:#743510}@media(max-width:600px){main{margin:10px;padding:20px}}@media print{body{background:#fff}main{margin:0;border:0;max-width:none}.warning{border-color:#999}}</style></head><body><main><h1>Purchase order draft</h1><p class="warning">Local AI-style simulation. Human review and authorized approval are required. Nothing was sent externally.</p><pre>${escapeHTML(draft.text)}</pre></main></body></html>`;
}
