export function leadStatusMessage(result, t) {
  if (result.error === 'invalidPOFile') return t('lead.invalidPOFile');
  if (!result.saved) return 'Concept preview only — your inquiry has not been sent. Browser storage is unavailable, so no local lead draft could be saved.';
  if (result.attachmentSaved === true) return t('lead.sandboxSavedPO', { reference: result.lead.reference });
  if (result.attachmentError) return t('lead.sandboxSavedPOError', { reference: result.lead.reference });
  return t('lead.sandboxSaved', { reference: result.lead.reference });
}
