import { getLanguage, onLanguageChange, t, translateTree } from './i18n.js';

const STORAGE_KEY = 'zj-rfq-list-v1';

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

export function initRFQ({ products, onSubmit }) {
  let items = readItems();
  let statusMessage = '';

  const root = document.createElement('div');
  root.className = 'rfq-root';
  root.innerHTML = `<button class="rfq-toggle" id="rfq-toggle" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h3"/></svg><span data-rfq-toggle-label></span><strong id="rfq-toggle-count">0</strong></button>`;
  document.body.append(root);

  const dialog = document.createElement('dialog');
  dialog.className = 'modal rfq-modal';
  dialog.id = 'rfq-dialog';
  dialog.setAttribute('aria-labelledby', 'rfq-title');
  dialog.innerHTML = `
    <button class="modal-close" id="rfq-close" type="button">×</button>
    <p class="overline">MULTI-MODEL INQUIRY</p>
    <h2 id="rfq-title"></h2>
    <p class="rfq-dialog-count" id="rfq-dialog-count"></p>
    <p class="rfq-status" id="rfq-status" role="status" aria-live="polite"></p>
    <form id="rfq-review-form">
      <div class="rfq-items" id="rfq-items"></div>
      <div class="rfq-empty" id="rfq-empty"><p></p><button class="button" id="rfq-browse" type="button"></button></div>
      <p class="rfq-note" id="rfq-note"></p>
      <div class="rfq-review-actions">
        <button class="button" id="rfq-continue" type="submit"></button>
        <button class="text-link" id="rfq-clear" type="button"></button>
      </div>
    </form>`;
  document.body.append(dialog);

  const toggle = root.querySelector('#rfq-toggle');
  const toggleCount = root.querySelector('#rfq-toggle-count');
  const itemContainer = dialog.querySelector('#rfq-items');
  const empty = dialog.querySelector('#rfq-empty');
  const clearButton = dialog.querySelector('#rfq-clear');
  const continueButton = dialog.querySelector('#rfq-continue');
  const form = dialog.querySelector('#rfq-review-form');

  function readItems() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      const seen = new Set();
      return saved.filter((item) => {
        if (!item || typeof item.model !== 'string' || seen.has(item.model)) return false;
        const valid = products.some((product) => product.model === item.model);
        if (valid) seen.add(item.model);
        return valid;
      }).map((item) => ({
        model: item.model,
        quantity: String(item.quantity || '').replace(/[^0-9]/g, ''),
        notes: typeof item.notes === 'string' ? item.notes.slice(0, 500) : ''
      }));
    } catch {
      return [];
    }
  }

  function saveItems() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch {
      statusMessage = t('rfq.storageError');
      render();
      return false;
    }
  }

  function productFor(model) {
    return products.find((product) => product.model === model);
  }

  function syncButtons() {
    document.querySelectorAll('[data-rfq-add]').forEach((button) => {
      const selected = items.some((item) => item.model === button.dataset.rfqAdd);
      button.classList.toggle('is-added', selected);
      button.setAttribute('aria-pressed', String(selected));
      const primary = button.dataset.rfqVariant === 'primary';
      button.textContent = t(selected ? (primary ? 'rfq.addedPrimary' : 'rfq.added') : (primary ? 'rfq.addPrimary' : 'rfq.add'));
      button.setAttribute('aria-label', `${t(selected ? 'rfq.view' : 'rfq.add')}: ${button.dataset.rfqAdd}`);
    });
  }

  function makeItem(item) {
    const product = productFor(item.model);
    const article = document.createElement('article');
    article.className = 'rfq-item';
    article.dataset.rfqItem = product.model;
    article.innerHTML = `
      <a class="rfq-item-image" href="./product.html?model=${encodeURIComponent(product.model)}"><img src="${product.image}" alt="${escapeHtml(product.alt)}" width="120" height="120"></a>
      <div class="rfq-item-product"><span>${escapeHtml(product.label)}</span><h3>${escapeHtml(product.model)}</h3><a class="text-link" href="./product.html?model=${encodeURIComponent(product.model)}"><span data-product-link>View product</span></a></div>
      <label class="rfq-item-quantity"><span></span><input type="number" min="1" inputmode="numeric" data-rfq-quantity="${escapeHtml(product.model)}"></label>
      <label class="rfq-item-notes"><span></span><input type="text" maxlength="500" data-rfq-notes="${escapeHtml(product.model)}"></label>
      <button class="rfq-item-remove" type="button" data-rfq-remove="${escapeHtml(product.model)}"></button>`;

    const quantity = article.querySelector('[data-rfq-quantity]');
    quantity.value = item.quantity;
    quantity.placeholder = t('rfq.quantityPlaceholder');
    quantity.addEventListener('input', () => {
      item.quantity = quantity.value;
      saveItems();
    });
    const notes = article.querySelector('[data-rfq-notes]');
    notes.value = item.notes;
    notes.placeholder = t('rfq.notesPlaceholder');
    notes.addEventListener('input', () => {
      item.notes = notes.value;
      saveItems();
    });
    article.querySelector('.rfq-item-quantity > span').textContent = t('rfq.quantity');
    article.querySelector('.rfq-item-notes > span').textContent = t('rfq.notes');
    const remove = article.querySelector('[data-rfq-remove]');
    remove.textContent = t('rfq.remove');
    remove.setAttribute('aria-label', `${t('rfq.remove')}: ${product.model}`);
    translateTree(article);
    return article;
  }

  function render() {
    // Pages with an RFQ link in the header use that instead of the floating button.
    root.hidden = Boolean(document.querySelector('[data-rfq-open]'));
    document.querySelectorAll('[data-rfq-count]').forEach((count) => {
      count.textContent = String(items.length);
      count.hidden = items.length === 0;
    });
    toggleCount.textContent = String(items.length);
    toggleCount.hidden = items.length === 0;
    root.querySelector('[data-rfq-toggle-label]').textContent = t('rfq.list');
    toggle.setAttribute('aria-label', `${t('rfq.view')} · ${t('rfq.count', { count: items.length })}`);
    dialog.querySelector('#rfq-title').textContent = t('rfq.title');
    dialog.querySelector('#rfq-dialog-count').textContent = t('rfq.count', { count: items.length });
    dialog.querySelector('#rfq-status').textContent = statusMessage;
    dialog.querySelector('#rfq-note').textContent = t('rfq.note');
    dialog.querySelector('#rfq-close').setAttribute('aria-label', t('rfq.close'));
    empty.querySelector('p').textContent = t('rfq.empty');
    empty.querySelector('button').textContent = t('rfq.browse');
    clearButton.textContent = t('rfq.clear');
    continueButton.textContent = items.length ? t('rfq.continue') : t('rfq.general');
    empty.hidden = items.length > 0;
    clearButton.hidden = items.length === 0;
    itemContainer.hidden = items.length === 0;
    itemContainer.replaceChildren(...items.map(makeItem));
    translateTree(dialog);
    syncButtons();
  }

  function openReview() {
    render();
    if (!dialog.open) dialog.showModal();
  }

  function add(model, { open = false } = {}) {
    if (!productFor(model)) return;
    if (items.some((item) => item.model === model)) {
      statusMessage = t('rfq.existingStatus', { model });
    } else {
      items = [...items, { model, quantity: '', notes: '' }];
      statusMessage = t('rfq.addedStatus', { model });
      saveItems();
    }
    render();
    if (open) openReview();
  }

  function addMany(models, { open = true } = {}) {
    const unique = [...new Set(models)].filter((model) => productFor(model));
    unique.forEach((model) => {
      if (!items.some((item) => item.model === model)) items.push({ model, quantity: '', notes: '' });
    });
    statusMessage = unique.length ? t('rfq.addedStatus', { model: unique.join(', ') }) : '';
    saveItems();
    render();
    if (open) openReview();
  }

  function remove(model) {
    items = items.filter((item) => item.model !== model);
    statusMessage = t('rfq.removedStatus', { model });
    saveItems();
    render();
    dialog.querySelector(`[data-rfq-remove="${CSS.escape(model)}"]`)?.focus();
  }

  toggle.addEventListener('click', () => {
    statusMessage = '';
    openReview();
  });
  dialog.querySelector('#rfq-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
    const removeButton = event.target.closest('[data-rfq-remove]');
    if (removeButton) remove(removeButton.dataset.rfqRemove);
  });
  dialog.querySelector('#rfq-browse').addEventListener('click', () => {
    dialog.close();
    if (document.querySelector('#products')) document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
    else window.location.href = './index.html#products';
  });
  clearButton.addEventListener('click', () => {
    items = [];
    statusMessage = t('rfq.clearedStatus');
    saveItems();
    render();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    dialog.close();
    onSubmit(items.map((item) => ({ ...item })));
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-rfq-add]');
    if (!button) return;
    add(button.dataset.rfqAdd, { open: button.dataset.rfqOpen === 'true' });
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    items = readItems();
    render();
  });
  onLanguageChange(render);
  render();

  return { add, addMany, openReview, syncButtons, getItems: () => items.map((item) => ({ ...item })) };
}

export function rfqNotes(items) {
  if (!items.length) return '';
  return items.map((item) => (!item.quantity && !item.notes) ? item.model : t('rfq.line', {
    model: item.model,
    quantity: item.quantity || t('rfq.notSpecified'),
    notes: item.notes || t('rfq.none')
  })).join('\n');
}

export function rfqLanguage() {
  return getLanguage();
}
