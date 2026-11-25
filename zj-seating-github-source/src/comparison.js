import { onLanguageChange, t, translateTree } from './i18n.js';

const STORAGE_KEY = 'zj-product-shortlist-v1';
const MAX_MODELS = 3;
const SALES_ONLY = 'Available through sales';

function selectedProduct(products, model) {
  return products.find((product) => product.model === model);
}

function readShortlist(products) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return [...new Set(saved.filter((model) => typeof model === 'string' && selectedProduct(products, model)))].slice(0, MAX_MODELS);
  } catch {
    return [];
  }
}

export function initComparison({ products, getDisclosure, publicSpecs, openQuote }) {
  const tray = document.querySelector('#shortlist-tray');
  const selectedList = document.querySelector('#shortlist-models');
  const count = document.querySelector('#shortlist-count');
  const status = document.querySelector('#shortlist-status');
  const compareButton = document.querySelector('#compare-now');
  const quoteButton = document.querySelector('#shortlist-quote');
  const clearButton = document.querySelector('#shortlist-clear');
  const dialog = document.querySelector('#comparison-dialog');
  const table = document.querySelector('#comparison-table');
  const dialogStatus = document.querySelector('#comparison-dialog-status');
  const dialogQuote = document.querySelector('#comparison-quote');
  let shortlist = readShortlist(products);
  let offsetFrame = 0;

  function announce(message) {
    status.textContent = message;
  }

  function saveShortlist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shortlist));
      return true;
    } catch {
      announce(t('comparison.storageError'));
      return false;
    }
  }

  function selectedProducts() {
    return shortlist.map((model) => selectedProduct(products, model)).filter(Boolean);
  }

  function updateFloatingOffset() {
    cancelAnimationFrame(offsetFrame);
    offsetFrame = requestAnimationFrame(() => {
      const height = tray.hidden ? 0 : tray.offsetHeight;
      document.documentElement.style.setProperty('--shortlist-height', `${height}px`);
    });
  }

  function syncCompareButtons() {
    document.querySelectorAll('[data-compare-model]').forEach((button) => {
      const model = button.dataset.compareModel;
      const selected = shortlist.includes(model);
      const full = shortlist.length >= MAX_MODELS && !selected;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-selected', selected);
      button.textContent = selected ? 'Added to compare' : 'Compare';
      button.setAttribute('aria-label', t(selected ? 'comparison.removeAria' : 'comparison.addAria', { model }));
      button.setAttribute('aria-disabled', String(full));
      button.title = full ? t('comparison.fullTitle') : '';
      translateTree(button);
    });
  }

  function renderTray() {
    tray.hidden = shortlist.length === 0;
    document.body.classList.toggle('has-shortlist', shortlist.length > 0);
    count.textContent = t('comparison.count', { count: shortlist.length });
    compareButton.disabled = shortlist.length < 2;
    compareButton.title = shortlist.length < 2 ? t('comparison.minTitle') : '';
    quoteButton.disabled = shortlist.length === 0;
    clearButton.disabled = shortlist.length === 0;

    selectedList.replaceChildren();
    selectedProducts().forEach((product) => {
      const item = document.createElement('li');
      const model = document.createElement('span');
      const remove = document.createElement('button');
      item.className = 'shortlist-item';
      model.textContent = product.model;
      remove.type = 'button';
      remove.dataset.shortlistRemove = product.model;
      remove.setAttribute('aria-label', t('comparison.removeAria', { model: product.model }));
      remove.textContent = '×';
      item.append(model, remove);
      selectedList.append(item);
    });

    translateTree(tray);
    syncCompareButtons();
    updateFloatingOffset();
  }

  function specification(product, term) {
    if (getDisclosure(product).tier !== 'public') return SALES_ONLY;
    const match = publicSpecs(product).find(([label]) => label === term);
    return match?.[1] || SALES_ONLY;
  }

  function cell(text, tagName = 'td') {
    const element = document.createElement(tagName);
    element.textContent = text;
    return element;
  }

  function renderComparison() {
    const selected = selectedProducts();
    table.replaceChildren();

    const head = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const rowLabel = cell('Product', 'th');
    rowLabel.scope = 'col';
    headerRow.append(rowLabel);

    selected.forEach((product) => {
      const heading = document.createElement('th');
      heading.scope = 'col';
      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.alt;
      image.width = 240;
      image.height = 240;
      const name = document.createElement('span');
      name.className = 'comparison-model';
      name.textContent = product.model;
      const badge = document.createElement('span');
      badge.className = 'comparison-badge';
      badge.textContent = getDisclosure(product).badge;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'comparison-remove';
      remove.dataset.shortlistRemove = product.model;
      remove.setAttribute('aria-label', t('comparison.removeAria', { model: product.model }));
      remove.textContent = 'Remove';
      heading.append(image, name, badge, remove);
      headerRow.append(heading);
    });
    head.append(headerRow);
    table.append(head);

    const body = document.createElement('tbody');
    const rows = [
      ['Category', (product) => product.label],
      ['Disclosure level', (product) => getDisclosure(product).badge],
      ['Dimensions', (product) => specification(product, 'Dimensions')],
      ['Minimum order (MOQ)', (product) => specification(product, 'Minimum order')],
      ['Container loading', (product) => specification(product, 'Container loading')]
    ];
    rows.forEach(([label, value]) => {
      const row = document.createElement('tr');
      const heading = cell(label, 'th');
      heading.scope = 'row';
      row.append(heading);
      selected.forEach((product) => row.append(cell(value(product))));
      body.append(row);
    });
    table.append(body);

    dialogStatus.textContent = t('comparison.dialogStatus', { count: selected.length });
    dialogQuote.textContent = t('comparison.quote', { count: selected.length });
    translateTree(dialog);
  }

  function addModel(model) {
    const product = selectedProduct(products, model);
    if (!product) return;
    if (shortlist.includes(model)) {
      shortlist = shortlist.filter((item) => item !== model);
      if (saveShortlist()) announce(t('comparison.removed', { model }));
    } else if (shortlist.length >= MAX_MODELS) {
      announce(t('comparison.full', { model }));
      tray.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    } else {
      shortlist = [...shortlist, model];
      const remaining = MAX_MODELS - shortlist.length;
      if (saveShortlist()) announce(t(remaining ? 'comparison.added' : 'comparison.ready', { model, remaining }));
    }
    renderTray();
  }

  function removeModel(model) {
    if (!shortlist.includes(model)) return;
    shortlist = shortlist.filter((item) => item !== model);
    if (saveShortlist()) announce(t('comparison.removedShort', { model }));
    renderTray();
    if (dialog.open) {
      if (shortlist.length < 2) dialog.close();
      else {
        renderComparison();
        dialog.querySelector('[data-shortlist-remove]')?.focus();
      }
    }
  }

  function openComparison() {
    if (shortlist.length < 2) {
      announce(t('comparison.needTwo'));
      return;
    }
    renderComparison();
    if (!dialog.open) dialog.showModal();
  }

  function requestShortlistQuote() {
    const selected = selectedProducts();
    if (!selected.length) return;
    if (dialog.open) dialog.close();
    openQuote(selected.map((product) => product.model).join(', '));
  }

  document.querySelector('#product-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-compare-model]');
    if (button) addModel(button.dataset.compareModel);
  });
  tray.addEventListener('click', (event) => {
    const remove = event.target.closest('[data-shortlist-remove]');
    if (remove) removeModel(remove.dataset.shortlistRemove);
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
      return;
    }
    const remove = event.target.closest('[data-shortlist-remove]');
    if (remove) removeModel(remove.dataset.shortlistRemove);
  });
  compareButton.addEventListener('click', openComparison);
  quoteButton.addEventListener('click', requestShortlistQuote);
  dialogQuote.addEventListener('click', requestShortlistQuote);
  clearButton.addEventListener('click', () => {
    shortlist = [];
    if (saveShortlist()) announce(t('comparison.cleared'));
    renderTray();
  });

  onLanguageChange(() => {
    renderTray();
    if (dialog.open) renderComparison();
  });
  if ('ResizeObserver' in window) new ResizeObserver(updateFloatingOffset).observe(tray);
  window.addEventListener('resize', updateFloatingOffset);
  renderTray();

  return { syncCompareButtons };
}
