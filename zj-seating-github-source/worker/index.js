import { EmailMessage } from 'cloudflare:email';
import { handleChat } from './assistant.js';

// All site inquiries are delivered to this verified Email Routing destination.
// The tag in the subject shows which b2bsourcing.org inbox the request belongs to.
const DELIVER_TO = 'masonkarim8@gmail.com';
const SENDER = 'website@b2bsourcing.org';
const ROUTES = {
  'Request a quote': 'sales',
  'Order a sample': 'sales',
  'Request certificates / test reports': 'researchteam',
  'Custom design / R&D request': 'researchteam'
};
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/inquiry') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
      try {
        return await handleInquiry(request, env);
      } catch (error) {
        console.error('inquiry failed', error);
        return json({ ok: false, error: 'server' }, 500);
      }
    }
    if (url.pathname === '/api/chat') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
      try {
        return await handleChat(request, env, { sendLead: (lead) => sendChatLead(lead, env) });
      } catch (error) {
        console.error('chat failed', error);
        return json({ ok: false, error: 'server' }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

async function sendChatLead({ email, language, page, transcript }, env) {
  const reference = makeReference().replace('RFQ', 'CHAT');
  const lines = transcript.map((m) => `${m.role === 'user' ? 'Buyer' : 'Ask ZJ'}: ${m.content}`);
  const text = [
    'New lead from the Ask ZJ chat on the ZJ Seating concept site',
    'Inbox: sales@b2bsourcing.org',
    `Reference: ${reference}`,
    `Buyer email: ${email}`,
    `Language: ${language}`,
    `Page: ${page || 'Unknown'}`,
    '',
    'Conversation so far:',
    '',
    ...lines,
    '',
    'Reply to this email to answer the buyer directly.'
  ].join('\r\n');
  const raw = buildTextEmail({ subject: `[sales] ${reference} · Chat lead · ${email}`, text, replyTo: email, reference, inbox: 'sales' });
  await env.SEND_EMAIL.send(new EmailMessage(SENDER, DELIVER_TO, raw));
}

function buildTextEmail({ subject, text, replyTo, reference, inbox }) {
  return [
    `From: "ZJ Seating site" <${SENDER}>`,
    `To: ${DELIVER_TO}`,
    `Reply-To: ${headerSafe(replyTo)}`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${reference}.${crypto.randomUUID()}@b2bsourcing.org>`,
    `X-Inquiry-Inbox: ${inbox}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap(toBase64(new TextEncoder().encode(text)))
  ].join('\r\n');
}

async function handleInquiry(request, env) {
  const data = await request.formData();
  if (clean(data.get('website'))) return json({ ok: true, reference: 'RFQ-RECEIVED' }); // honeypot

  const token = clean(data.get('cf-turnstile-response'), 4096);
  if (!(await verifyTurnstile(token, request, env))) return json({ ok: false, error: 'check' }, 400);

  const lead = {
    requestType: clean(data.get('requestType'), 120) || 'Request a quote',
    model: clean(data.get('model'), 500),
    name: clean(data.get('name'), 120),
    company: clean(data.get('company'), 160),
    email: clean(data.get('email'), 180),
    quantity: clean(data.get('quantity'), 30),
    destination: clean(data.get('destination'), 180),
    notes: clean(data.get('notes'), 5000),
    language: clean(data.get('language'), 12),
    pageUrl: clean(data.get('pageUrl'), 500),
    attribution: clean(data.get('attribution'), 1000)
  };
  if (!lead.name || !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(lead.email)) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  let attachment = null;
  const file = data.get('poTemplate');
  if (file && typeof file === 'object' && file.size > 0) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!FILE_TYPES.includes(ext) || file.size > MAX_FILE_BYTES) return json({ ok: false, error: 'file' }, 400);
    attachment = { name: safeFilename(file.name), type: file.type || 'application/octet-stream', bytes: new Uint8Array(await file.arrayBuffer()) };
  }

  const reference = makeReference();
  const inbox = ROUTES[lead.requestType] || 'sales';
  const raw = buildMime({ reference, inbox, lead, attachment });
  await env.SEND_EMAIL.send(new EmailMessage(SENDER, DELIVER_TO, raw));
  return json({ ok: true, reference });
}

async function verifyTurnstile(token, request, env) {
  if (!token || !env.TURNSTILE_SECRET) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const outcome = await res.json();
  return outcome.success === true;
}

function buildMime({ reference, inbox, lead, attachment }) {
  const boundary = `zj-${crypto.randomUUID()}`;
  const subject = `[${inbox}] ${reference} · ${lead.requestType} · ${lead.company || lead.name}${lead.model ? ` · ${lead.model}` : ''}`;
  const text = [
    `New inquiry from the ZJ Seating concept site`,
    `Inbox: ${inbox}@b2bsourcing.org`,
    `Reference: ${reference}`,
    '',
    `Request: ${lead.requestType}`,
    `Models: ${lead.model || 'Not specified'}`,
    `Quantity: ${lead.quantity || 'Not specified'}`,
    `Destination: ${lead.destination || 'Not specified'}`,
    '',
    `Name: ${lead.name}`,
    `Company: ${lead.company || 'Not given'}`,
    `Email: ${lead.email}`,
    '',
    'Notes:',
    lead.notes || 'None',
    '',
    `PO template: ${attachment ? attachment.name : 'Not attached'}`,
    `Page: ${lead.pageUrl || 'Unknown'}`,
    `Language: ${lead.language || 'en'}`,
    `Source: ${lead.attribution || 'Direct'}`,
    '',
    'Reply to this email to answer the buyer directly.'
  ].join('\r\n');

  const headers = [
    `From: "ZJ Seating site" <${SENDER}>`,
    `To: ${DELIVER_TO}`,
    `Reply-To: ${headerSafe(lead.email)}`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${reference}.${crypto.randomUUID()}@b2bsourcing.org>`,
    `X-Inquiry-Inbox: ${inbox}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`
  ];
  const parts = [
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap(toBase64(new TextEncoder().encode(text)))
  ];
  if (attachment) {
    parts.push(
      `--${boundary}`,
      `Content-Type: ${headerSafe(attachment.type)}; name="${attachment.name}"`,
      `Content-Disposition: attachment; filename="${attachment.name}"`,
      'Content-Transfer-Encoding: base64',
      '',
      wrap(toBase64(attachment.bytes))
    );
  }
  parts.push(`--${boundary}--`, '');
  return `${headers.join('\r\n')}\r\n\r\n${parts.join('\r\n')}`;
}

function makeReference() {
  const d = new Date();
  const date = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 4).toUpperCase();
  return `RFQ-${date}-${suffix}`;
}

function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function headerSafe(value) {
  return String(value).replace(/[\r\n"]/g, ' ');
}

function safeFilename(name) {
  return String(name).replace(/[\r\n"\\/]/g, '_').replace(/[^\x20-\x7E]/g, '_').slice(0, 120) || 'po-template';
}

function encodeHeader(value) {
  const safe = headerSafe(value);
  return /^[\x20-\x7E]*$/.test(safe) ? safe : `=?UTF-8?B?${toBase64(new TextEncoder().encode(safe))}?=`;
}

function toBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

function wrap(base64) {
  return base64.replace(/.{1,76}/g, '$&\r\n').trimEnd();
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}
