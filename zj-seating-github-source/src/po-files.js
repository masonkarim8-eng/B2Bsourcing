const DB_NAME = 'zj-rfq-sandbox-files-v1';
const STORE_NAME = 'poTemplates';
export const PO_FILE_LIMIT = 10 * 1024 * 1024;
const allowedExtensions = /\.(pdf|doc|docx|xls|xlsx|csv|txt)$/i;

export function validatePOFile(file) {
  if (!file || !file.name) return { valid: true };
  if (!allowedExtensions.test(file.name)) return { valid: false, reason: 'type' };
  if (file.size > PO_FILE_LIMIT) return { valid: false, reason: 'size' };
  return { valid: true };
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is unavailable'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: 'leadId' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open local file storage'));
    request.onblocked = () => reject(new Error('Local file storage is blocked'));
  });
}

function completeTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Local file transaction failed'));
    transaction.onabort = () => reject(transaction.error || new Error('Local file transaction was aborted'));
  });
}

export function poFileMetadata(file, stored = false) {
  if (!file?.name) return null;
  return { name: file.name.slice(0, 240), size: file.size, type: file.type || 'application/octet-stream', lastModified: file.lastModified || null, stored };
}

export async function storePOFile(leadId, file) {
  const validation = validatePOFile(file);
  if (!validation.valid) throw new Error(`Invalid PO template: ${validation.reason}`);
  const db = await openDatabase();
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put({ leadId, blob: file, ...poFileMetadata(file, true), storedAt: new Date().toISOString() });
    await completeTransaction(transaction);
    return poFileMetadata(file, true);
  } finally {
    db.close();
  }
}

export async function getPOFile(leadId) {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(leadId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('Could not read PO template'));
    });
  } finally {
    db.close();
  }
}

export async function clearPOFiles() {
  const db = await openDatabase();
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).clear();
    await completeTransaction(transaction);
  } finally {
    db.close();
  }
}

export function downloadPOFile(record) {
  if (!record?.blob) return false;
  const url = URL.createObjectURL(record.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = record.name || 'po-template';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
