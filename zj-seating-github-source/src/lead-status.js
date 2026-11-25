export function leadStatusMessage(result, t) {
  if (result.error === 'invalidPOFile') return t('lead.invalidPOFile');
  if (result.error === 'check') return t('lead.checkFailed');
  if (!result.sent) return t('lead.sendFailed');
  return t('lead.sent', { reference: result.reference });
}

export function resetInquiryCheck() {
  try { window.turnstile?.reset(); } catch {}
}
