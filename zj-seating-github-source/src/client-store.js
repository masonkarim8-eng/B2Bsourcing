export const CLIENT_ACCOUNTS_KEY = 'zj-client-accounts-v1';
export const CLIENT_SESSION_KEY = 'zj-client-demo-session-v1';
export const DEMO_CLIENT_CREDENTIALS = Object.freeze({ email: 'buyer@northline.test', password: 'Client2026!' });

const clean = (value, max = 240) => String(value || '').trim().slice(0, max);
const normalizeEmail = (value) => clean(value, 180).toLowerCase();

function demoClient() {
  return {
    id: 'client-northline-demo',
    demo: true,
    email: DEMO_CLIENT_CREDENTIALS.email,
    name: 'Maya Chen',
    company: 'Northline Workspace',
    phone: '+1 416 555 0138',
    country: 'Canada',
    address: 'Toronto, Ontario, Canada',
    owner: 'Mia Chen',
    createdAt: '2026-01-18T09:00:00.000Z',
    updatedAt: '2026-11-20T09:00:00.000Z',
    preferences: { productUpdates: true, orderUpdates: true },
    orders: [
      {
        id: 'PO-DEMO-0148',
        model: 'DEMO-8209H Legacy Mesh',
        quantity: 240,
        orderedAt: '2025-05-12',
        deliveredAt: '2025-08-14',
        destination: 'Toronto, Canada',
        status: 'Delivered',
        lifecycle: 'discontinued',
        replacementModels: ['8329H-RD', '9628H'],
        note: 'Fictional lifecycle scenario only; DEMO-8209H is not a real ZJ catalog model.'
      },
      {
        id: 'PO-DEMO-0192',
        model: '8413H-GR',
        quantity: 180,
        orderedAt: '2026-06-18',
        deliveredAt: '2026-09-02',
        destination: 'Toronto, Canada',
        status: 'Delivered',
        lifecycle: 'active',
        replacementModels: [],
        note: 'Fictional order record for account-layout preview.'
      }
    ],
    updates: [
      {
        id: 'update-demo-8209h',
        orderId: 'PO-DEMO-0148',
        model: 'DEMO-8209H Legacy Mesh',
        status: 'Needs review',
        createdAt: '2026-11-20T09:00:00.000Z',
        recommendation: 'Review the 8329H-RD and 9628H as possible successors for the next program.',
        preparedAt: null,
        preparedBy: null,
        draft: null
      }
    ]
  };
}

function normalizeAccount(account) {
  return {
    ...account,
    email: normalizeEmail(account.email),
    name: clean(account.name, 120),
    company: clean(account.company, 160),
    phone: clean(account.phone, 80),
    country: clean(account.country, 100),
    address: clean(account.address, 300),
    owner: clean(account.owner, 120) || 'Unassigned',
    preferences: { productUpdates: account.preferences?.productUpdates !== false, orderUpdates: account.preferences?.orderUpdates !== false },
    orders: Array.isArray(account.orders) ? account.orders : [],
    updates: Array.isArray(account.updates) ? account.updates : []
  };
}

export function readClientAccounts() {
  let accounts = [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(CLIENT_ACCOUNTS_KEY));
    if (Array.isArray(saved)) accounts = saved.filter((account) => account && typeof account === 'object');
  } catch {}
  if (!accounts.some((account) => account.id === 'client-northline-demo')) accounts.unshift(demoClient());
  return accounts.map(normalizeAccount);
}

function writeClientAccounts(accounts) {
  try {
    window.localStorage.setItem(CLIENT_ACCOUNTS_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

export function updateClientAccount(id, updater) {
  const accounts = readClientAccounts();
  const index = accounts.findIndex((account) => account.id === id);
  if (index < 0) return null;
  const current = accounts[index];
  const next = normalizeAccount({ ...current, ...updater(current), updatedAt: new Date().toISOString() });
  accounts[index] = next;
  return writeClientAccounts(accounts) ? next : null;
}

function bytesToHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function passwordHash(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}

export async function registerClientAccount(input) {
  const email = normalizeEmail(input.email);
  const password = String(input.password || '');
  if (!email || password.length < 8 || !clean(input.name) || !clean(input.company)) return { error: 'invalid' };
  const accounts = readClientAccounts();
  if (accounts.some((account) => account.email === email)) return { error: 'exists' };
  const salt = bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
  const account = {
    id: `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    demo: false,
    email,
    name: clean(input.name, 120),
    company: clean(input.company, 160),
    phone: clean(input.phone, 80),
    country: clean(input.country, 100),
    address: '',
    owner: 'Unassigned',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: { productUpdates: true, orderUpdates: true },
    orders: [],
    updates: [],
    salt,
    passwordHash: await passwordHash(password, salt)
  };
  accounts.unshift(account);
  if (!writeClientAccounts(accounts)) return { error: 'storage' };
  return { account: normalizeAccount(account) };
}

export async function authenticateClient(emailInput, password) {
  const email = normalizeEmail(emailInput);
  const account = readClientAccounts().find((item) => item.email === email);
  if (!account) return null;
  if (account.demo) return email === DEMO_CLIENT_CREDENTIALS.email && password === DEMO_CLIENT_CREDENTIALS.password ? account : null;
  if (!account.salt || !account.passwordHash) return null;
  const candidate = await passwordHash(String(password || ''), account.salt);
  return candidate === account.passwordHash ? account : null;
}

export function startClientSession(account) {
  try {
    window.sessionStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify({ clientId: account.id, authenticatedAt: new Date().toISOString(), demoOnly: true }));
  } catch {}
}

export function endClientSession() {
  try { window.sessionStorage.removeItem(CLIENT_SESSION_KEY); } catch {}
}

export function getAuthenticatedClient() {
  try {
    const session = JSON.parse(window.sessionStorage.getItem(CLIENT_SESSION_KEY));
    if (!session?.clientId || !session.authenticatedAt) return null;
    return readClientAccounts().find((account) => account.id === session.clientId) || null;
  } catch {
    return null;
  }
}
