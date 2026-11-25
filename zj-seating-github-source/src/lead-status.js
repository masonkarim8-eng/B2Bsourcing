import { t } from './i18n.js';

export function leadStatusMessage(result, translate = t) {
  return statusText(result, translate);
}

function statusText(result, t) {
  if (result.error === 'invalidPOFile') return t('lead.invalidPOFile');
  if (!result.sent) return t('lead.sendFailed');
  return t('lead.sent', { reference: result.reference });
}

// Records when an inquiry form was opened, for the server's minimum fill-time check.
export function markInquiryOpened(form) {
  if (form) form.dataset.openedAt = String(Date.now());
}

export function resetInquiryCheck() {}

function onHomepage() {
  const path = window.location.pathname;
  return path === '/' || path.endsWith('/index.html') || path.endsWith('/index');
}

export function showInquirySuccess(reference, email) {
  let dialog = document.querySelector('#inquiry-success');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'inquiry-success';
    dialog.className = 'modal success-modal';
    dialog.setAttribute('aria-labelledby', 'inquiry-success-title');
    dialog.innerHTML = `
      <div class="success-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>
      <h2 id="inquiry-success-title"></h2>
      <p class="success-reference"></p>
      <p class="success-body"></p>
      <div class="success-actions">
        <a class="button" href="./index.html" data-success-home></a>
        <button class="button button-light success-close" type="button" data-success-close></button>
      </div>`;
    document.body.append(dialog);
    dialog.querySelector('[data-success-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-success-home]').addEventListener('click', (event) => {
      if (!onHomepage()) return;
      event.preventDefault();
      dialog.close();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }
  dialog.querySelector('#inquiry-success-title').textContent = t('lead.successTitle');
  dialog.querySelector('.success-reference').textContent = t('lead.successReference', { reference });
  dialog.querySelector('.success-body').textContent = t('lead.successBody', { email });
  dialog.querySelector('[data-success-home]').textContent = t('lead.backHome');
  dialog.querySelector('[data-success-close]').textContent = t('lead.close');
  dialog.showModal();
  dialog.querySelector('[data-success-home]').focus();
}
