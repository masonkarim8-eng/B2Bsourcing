import { getAttribution } from './sharing.js';
import { clearPOFiles, poFileMetadata, validatePOFile } from './po-files.js';

export const LEAD_INBOX_KEY = 'zj-lead-inbox-v1';
export const SANDBOX_EMAIL_KEY = 'zj-sandbox-emails-v1';
export const SANDBOX_STAGES = ['New', 'Contacted', 'Sampling', 'Quoted', 'Won', 'Lost'];

function clean(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeLead(lead, index) {
  return {
    ...lead,
    reference: lead.reference || `LOCAL-${String(index + 1).padStart(4, '0')}`,
    stage: SANDBOX_STAGES.includes(lead.stage) ? lead.stage : 'New',
    department: lead.department || 'Unassigned',
    owner: lead.owner || 'Unassigned',
    followUpDate: lead.followUpDate || '',
    internalNotes: lead.internalNotes || '',
    history: Array.isArray(lead.history) ? lead.history : []
  };
}

export function readLocalLeads() {
  try {
    const leads = JSON.parse(window.localStorage.getItem(LEAD_INBOX_KEY));
    return Array.isArray(leads) ? leads.filter((lead) => lead && typeof lead === 'object').map(normalizeLead) : [];
  } catch {
    return [];
  }
}

export function readSandboxEmails() {
  try {
    const emails = JSON.parse(window.localStorage.getItem(SANDBOX_EMAIL_KEY));
    return Array.isArray(emails) ? emails.filter((email) => email && typeof email === 'object') : [];
  } catch {
    return [];
  }
}

function routeFor(requestType, notes) {
  const request = `${requestType} ${notes}`.toLowerCase();
  if (request.includes('certificate') || request.includes('test report') || request.includes('quality & compliance')) {
    return { department: 'Quality & Compliance', owner: 'Grace Liu', departmentEmail: 'quality@zjseating.test' };
  }
  if (request.includes('sample') || request.includes('product development')) {
    return { department: 'Product Development', owner: 'Leo Wang', departmentEmail: 'product@zjseating.test' };
  }
  if (request.includes('international account manager') || request.includes('after-sales')) {
    return { department: 'Account Support', owner: 'Mia Chen', departmentEmail: 'accounts@zjseating.test' };
  }
  return { department: 'Export Sales', owner: 'Daniel Zhou', departmentEmail: 'sales@zjseating.test' };
}

function nextReference(leads, date) {
  const year = date.getFullYear();
  const highest = leads.reduce((max, lead) => {
    const match = /^RFQ-(\d{4})-(\d{4})$/.exec(lead.reference || '');
    return match && Number(match[1]) === year ? Math.max(max, Number(match[2])) : max;
  }, 0);
  return `RFQ-${year}-${String(highest + 1).padStart(4, '0')}`;
}

function persistLead(input, language = 'en') {
  const now = new Date();
  const createdAt = now.toISOString();
  const leads = readLocalLeads();
  const reference = input.reference || nextReference(leads, now);
  const route = routeFor(input.requestType, input.notes);
  const followUpDate = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const id = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const lead = {
    id,
    reference,
    createdAt,
    updatedAt: createdAt,
    requestType: clean(input.requestType, 120) || 'Request a quote',
    name: clean(input.name, 120),
    company: clean(input.company, 160),
    email: clean(input.email, 180),
    quantity: clean(input.quantity, 30),
    destination: clean(input.destination, 180),
    notes: clean(input.notes, 3000),
    models: Array.isArray(input.models) ? input.models.map((model) => clean(model, 80)).filter(Boolean).slice(0, 24) : [],
    language: clean(language, 12) || 'en',
    pageUrl: clean(input.pageUrl, 500),
    source: clean(input.source, 80) || 'website',
    attribution: input.attribution || null,
    poAttachment: input.poAttachment || null,
    poDraft: input.poDraft || null,
    documentPack: input.documentPack || null,
    documentPackRevisions: Array.isArray(input.documentPackRevisions) ? input.documentPackRevisions : [],
    stage: 'New',
    ...route,
    followUpDate,
    internalNotes: '',
    history: [{ at: createdAt, text: `Created in the local sandbox and routed to ${route.department}.` }]
  };
  const buyerEmail = {
    id: `mail-${Date.now()}-buyer`,
    leadId: id,
    reference,
    createdAt,
    mailbox: 'buyer',
    from: 'no-reply@zjseating.test',
    to: lead.email || 'buyer@example.test',
    subject: `[TEST] ${reference} received — ZJ Seating sandbox`,
    body: `Hello ${lead.name || 'Test Buyer'},\n\nThis is a simulated confirmation generated inside the ZJ Seating local sandbox. No message has been sent externally.\n\nReference: ${reference}\nRequest: ${lead.requestType}\nModels: ${lead.models.join(', ') || 'General inquiry'}\nQuantity: ${lead.quantity || 'Not specified'}\nDestination: ${lead.destination || 'Not specified'}\nPO template: ${lead.poAttachment?.name || 'Not attached'}\n\nA fictional ${route.department} owner has been assigned for workflow testing.\n\nSANDBOX ONLY — NOT A COMMERCIAL OFFER OR REAL CONFIRMATION.`,
    read: false,
    externallyDelivered: false
  };
  const departmentEmail = {
    id: `mail-${Date.now()}-department`,
    leadId: id,
    reference,
    createdAt,
    mailbox: 'department',
    from: 'no-reply@zjseating.test',
    to: route.departmentEmail,
    subject: `[TEST] ${reference} routed to ${route.department}`,
    body: `SIMULATED DEPARTMENT NOTIFICATION — NO EXTERNAL DELIVERY\n\nReference: ${reference}\nBuyer: ${lead.name} <${lead.email}>\nRequest: ${lead.requestType}\nModels: ${lead.models.join(', ') || 'General inquiry'}\nQuantity: ${lead.quantity || 'Not specified'}\nDestination: ${lead.destination || 'Not specified'}\nPO template: ${lead.poAttachment?.name || 'Not attached'}\nOwner: ${route.owner}\nFollow-up date: ${followUpDate}\n\nBuyer notes:\n${lead.notes || 'None'}\n\nOpen admin.html#sandbox to review this browser-local test record.`,
    read: false,
    externallyDelivered: false
  };
  try {
    window.localStorage.setItem(LEAD_INBOX_KEY, JSON.stringify([lead, ...leads].slice(0, 200)));
    window.localStorage.setItem(SANDBOX_EMAIL_KEY, JSON.stringify([departmentEmail, buyerEmail, ...readSandboxEmails()].slice(0, 400)));
    return { saved: true, lead, emails: [buyerEmail, departmentEmail] };
  } catch {
    return { saved: false, lead, emails: [] };
  }
}

export async function saveLocalLead(form, language = 'en') {
  const data = new FormData(form);
  const attribution = getAttribution();
  const file = data.get('poTemplate');
  const hasFile = Boolean(file?.name);
  const validation = validatePOFile(hasFile ? file : null);
  if (!validation.valid) return { sent: false, error: 'invalidPOFile' };
  if (!hasFile) data.delete('poTemplate');
  data.set('language', language);
  data.set('formStartedAt', String(form.dataset.openedAt || ''));
  data.set('pageUrl', window.location.href.split('#')[0]);
  if (attribution) data.set('attribution', JSON.stringify(attribution).slice(0, 1000));

  let reference = '';
  try {
    const response = await fetch('/api/inquiry', { method: 'POST', body: data });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.ok) return { sent: false, error: body.error === 'check' ? 'check' : body.error === 'file' ? 'invalidPOFile' : 'sendFailed' };
    reference = body.reference;
  } catch {
    return { sent: false, error: 'sendFailed' };
  }

  // Keep a copy in this browser so the employee portal demo can show it.
  const models = clean(data.get('model'), 500).split(',').map((model) => model.trim()).filter(Boolean).slice(0, 24);
  persistLead({
    reference,
    requestType: data.get('requestType'),
    name: data.get('name'),
    company: data.get('company'),
    email: data.get('email'),
    quantity: data.get('quantity'),
    destination: data.get('destination'),
    notes: data.get('notes'),
    models,
    poAttachment: hasFile ? poFileMetadata(file, false) : null,
    pageUrl: window.location.href.split('#')[0],
    source: attribution?.medium === 'social' || attribution?.source ? 'social' : 'website',
    attribution
  }, language);
  return { sent: true, reference };
}

export function createSandboxLead(input = {}) {
  return persistLead({
    requestType: input.requestType || 'Request a quote',
    name: input.name || 'Test Buyer',
    company: input.company || 'Example Workspace Co.',
    email: input.email || 'buyer@example.test',
    quantity: input.quantity || '100',
    destination: input.destination || 'Test destination',
    notes: input.notes || 'Browser-local sandbox test record.',
    models: input.models || ['8387H-RD'],
    pageUrl: 'admin.html#sandbox',
    source: 'sandbox',
    attribution: null
  }, input.language || 'en');
}

export function updateLocalLead(id, updater) {
  const leads = readLocalLeads();
  const index = leads.findIndex((lead) => lead.id === id);
  if (index < 0) return null;
  const updated = { ...leads[index], ...updater(leads[index]), updatedAt: new Date().toISOString() };
  leads[index] = updated;
  try {
    window.localStorage.setItem(LEAD_INBOX_KEY, JSON.stringify(leads));
    return updated;
  } catch {
    return null;
  }
}

export function updateSandboxEmail(id, updater) {
  const emails = readSandboxEmails();
  const index = emails.findIndex((email) => email.id === id);
  if (index < 0) return null;
  emails[index] = { ...emails[index], ...updater(emails[index]) };
  try {
    window.localStorage.setItem(SANDBOX_EMAIL_KEY, JSON.stringify(emails));
    return emails[index];
  } catch {
    return null;
  }
}

export async function clearSandboxData() {
  window.localStorage.removeItem(LEAD_INBOX_KEY);
  window.localStorage.removeItem(SANDBOX_EMAIL_KEY);
  try {
    await clearPOFiles();
    return true;
  } catch {
    return false;
  }
}
