import { attributedProductUrl } from './sharing.js';
import { readLocalLeads } from './lead-handoff.js';

const CAMPAIGNS_KEY = 'zj-social-campaigns-v1';
const channelNames = { linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram' };
const languageNames = { en: 'English', zh: '简体中文', es: 'Español', de: 'Deutsch' };

function readCampaigns() {
  try {
    const campaigns = JSON.parse(localStorage.getItem(CAMPAIGNS_KEY));
    return Array.isArray(campaigns) ? campaigns.filter((campaign) => campaign && typeof campaign === 'object') : [];
  } catch {
    return [];
  }
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'seating-campaign';
}

function safeDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date not set' : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

export function initSocial({ products, downloadFile, copyText, escapeHtml }) {
  const form = document.querySelector('#social-campaign-form');
  const status = document.querySelector('#social-status');
  const queue = document.querySelector('#social-campaign-queue');
  const leadTable = document.querySelector('#social-lead-table');
  let leadFilter = 'all';
  let campaigns = readCampaigns();

  document.querySelector('#social-products').innerHTML = products.map((product, index) => `
    <label class="social-product-option"><input type="checkbox" name="products" value="${escapeHtml(product.model)}" ${product.model === '8387H-RD' || (index === 0 && !products.some((item) => item.model === '8387H-RD')) ? 'checked' : ''}><span><strong>${escapeHtml(product.model)}</strong><small>${escapeHtml(product.label)}</small></span></label>`).join('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.querySelector('#social-launch-date').value = tomorrow.toISOString().slice(0, 10);

  function campaignPack(campaign) {
    const lines = [
      'ZJ SEATING · SOCIAL CAMPAIGN HANDOFF',
      'Local concept only — not delivered to a social platform.',
      '',
      `Campaign: ${campaign.name}`,
      `Status: ${campaign.status}`,
      `Language: ${languageNames[campaign.language] || campaign.language}`,
      `Channels: ${campaign.channels.map((channel) => channelNames[channel] || channel).join(', ')}`,
      `Launch date: ${campaign.launchDate}`,
      `Owner: ${campaign.owner}`,
      `Products: ${campaign.models.join(', ')}`,
      '',
      'CREATIVE BRIEF',
      campaign.brief,
      '',
      'PUBLIC PRODUCT COPY'
    ];
    campaign.models.forEach((model) => {
      const product = products.find((item) => item.model === model);
      if (product) lines.push(`${product.model} — ${product.name}\n${product.summary}`);
    });
    lines.push('', 'ATTRIBUTED PRODUCT LINKS');
    campaign.channels.forEach((channel) => {
      campaign.models.forEach((model) => {
        lines.push(`${channelNames[channel] || channel} · ${model}\n${attributedProductUrl(model, { source: channel, campaign: campaign.campaignCode, language: campaign.language })}`);
      });
    });
    lines.push('', 'Before publishing: replace preview URLs with the final HTTPS domain if needed, confirm current product details, and complete human review.');
    return lines.join('\n');
  }

  function campaignExport(campaign) {
    return {
      ...campaign,
      conceptOnly: true,
      externallyDelivered: false,
      productLinks: campaign.channels.flatMap((channel) => campaign.models.map((model) => ({
        channel,
        model,
        url: attributedProductUrl(model, { source: channel, campaign: campaign.campaignCode, language: campaign.language })
      })))
    };
  }

  function renderCampaigns() {
    document.querySelector('#social-campaign-count').textContent = String(campaigns.length);
    document.querySelector('#social-ready-count').textContent = String(campaigns.filter((campaign) => campaign.status === 'Ready for social').length);
    if (!campaigns.length) {
      queue.innerHTML = '<p class="social-empty">No campaign handoffs yet. Save the brief to create a local campaign pack.</p>';
      return;
    }
    queue.innerHTML = campaigns.map((campaign) => {
      const id = escapeHtml(campaign.id);
      return `<article class="social-campaign-card"><div class="social-campaign-top"><span class="stage-pill ${campaign.status === 'Ready for social' ? 'qualified' : ''}">${escapeHtml(campaign.status)}</span><small>${escapeHtml(safeDate(campaign.createdAt))}</small></div><h3>${escapeHtml(campaign.name)}</h3><p>${escapeHtml(campaign.models.join(' · '))}</p><dl><div><dt>Channels</dt><dd>${escapeHtml(campaign.channels.map((channel) => channelNames[channel] || channel).join(', '))}</dd></div><div><dt>Launch</dt><dd>${escapeHtml(campaign.launchDate)}</dd></div><div><dt>Owner</dt><dd>${escapeHtml(campaign.owner)}</dd></div></dl><div class="social-card-actions"><button class="admin-secondary" type="button" data-social-copy="${id}">Copy campaign pack</button><button class="admin-secondary" type="button" data-social-export="${id}">Export JSON</button></div></article>`;
    }).join('');
  }

  function isSocialLead(lead) {
    return lead.source === 'social' || lead.attribution?.medium === 'social' || Boolean(lead.attribution?.source);
  }

  function sourceLabel(lead) {
    if (!isSocialLead(lead)) return 'Website';
    const source = lead.attribution?.source || 'social';
    const knownNames = { linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram', whatsapp: 'WhatsApp' };
    return knownNames[source.toLowerCase()] || source.charAt(0).toUpperCase() + source.slice(1);
  }

  function visibleLeads() {
    return readLocalLeads().filter((lead) => leadFilter === 'all' || isSocialLead(lead));
  }

  function renderLeads() {
    const allLeads = readLocalLeads();
    const leads = visibleLeads();
    document.querySelector('#social-lead-total').textContent = String(allLeads.length);
    document.querySelector('#social-attributed-total').textContent = String(allLeads.filter(isSocialLead).length);
    document.querySelector('#social-lead-nav-count').textContent = String(allLeads.length);
    document.querySelector('#social-lead-filter-count').textContent = `${leads.length} local ${leads.length === 1 ? 'draft' : 'drafts'}`;
    if (!leads.length) {
      leadTable.innerHTML = `<tr><td colspan="7" class="empty-row">No ${leadFilter === 'social' ? 'social-attributed ' : ''}lead drafts in this browser yet.</td></tr>`;
      return;
    }
    leadTable.innerHTML = leads.map((lead) => {
      const attribution = lead.attribution || {};
      return `<tr><td><strong>${escapeHtml(sourceLabel(lead))}</strong><small>${escapeHtml(attribution.medium || 'direct website')}</small></td><td><strong>${escapeHtml(attribution.campaign || 'No campaign')}</strong><small>${escapeHtml(attribution.content || '—')}</small></td><td><strong>${escapeHtml((lead.models || []).join(', ') || 'General inquiry')}</strong><small>${escapeHtml(lead.requestType || 'Request a quote')}</small></td><td><strong>${escapeHtml(lead.name || 'Unnamed')}</strong><small>${escapeHtml(lead.email || 'No email')}</small></td><td>${escapeHtml(languageNames[lead.language] || lead.language || 'English')}</td><td><strong>${escapeHtml(safeDate(lead.createdAt))}</strong><small>${escapeHtml(new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</small></td><td><details class="social-lead-details"><summary>View</summary><div><p><strong>Destination:</strong> ${escapeHtml(lead.destination || 'Not provided')}</p><p><strong>Quantity:</strong> ${escapeHtml(lead.quantity || 'Not provided')}</p><p><strong>Notes:</strong> ${escapeHtml(lead.notes || 'None')}</p><p><strong>Source page:</strong><br>${escapeHtml(lead.pageUrl || 'Not recorded')}</p></div></details></td></tr>`;
    }).join('');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.classList.remove('error');
    if (!form.reportValidity()) return;
    const channels = [...form.querySelectorAll('input[name="channels"]:checked')].map((input) => input.value);
    const models = [...form.querySelectorAll('input[name="products"]:checked')].map((input) => input.value);
    if (!channels.length || !models.length) {
      status.textContent = 'Select at least one channel and one public product.';
      status.classList.add('error');
      return;
    }
    const name = document.querySelector('#social-campaign-name').value.trim();
    const campaign = {
      id: `campaign-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name,
      campaignCode: slugify(name),
      language: document.querySelector('#social-language').value,
      channels,
      models,
      launchDate: document.querySelector('#social-launch-date').value,
      owner: document.querySelector('#social-owner').value.trim(),
      brief: document.querySelector('#social-brief').value.trim(),
      status: document.querySelector('#social-campaign-status').value
    };
    campaigns = [campaign, ...campaigns].slice(0, 100);
    try {
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
      status.textContent = 'Campaign handoff saved in this browser only. Nothing was published or sent.';
    } catch {
      status.textContent = 'Browser storage is unavailable. Use Copy campaign pack or Export JSON instead.';
      status.classList.add('error');
    }
    renderCampaigns();
  });

  queue.addEventListener('click', async (event) => {
    const copyButton = event.target.closest('[data-social-copy]');
    const exportButton = event.target.closest('[data-social-export]');
    const id = copyButton?.dataset.socialCopy || exportButton?.dataset.socialExport;
    if (!id) return;
    const campaign = campaigns.find((item) => item.id === id);
    if (!campaign) return;
    if (copyButton) {
      const copied = await copyText(campaignPack(campaign));
      status.textContent = copied ? 'Campaign pack copied. It has not been sent or published.' : 'Copy unavailable. Use Export JSON instead.';
    } else {
      downloadFile(`zj-social-${campaign.campaignCode}.json`, JSON.stringify(campaignExport(campaign), null, 2), 'application/json');
      status.textContent = 'Campaign JSON exported with public product copy and attributed links.';
    }
  });

  document.querySelectorAll('[data-lead-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      leadFilter = button.dataset.leadFilter;
      document.querySelectorAll('[data-lead-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      renderLeads();
    });
  });

  document.querySelector('#export-social-leads').addEventListener('click', () => {
    const leads = visibleLeads();
    downloadFile(`zj-${leadFilter}-lead-drafts.json`, JSON.stringify({ exportedAt: new Date().toISOString(), conceptOnly: true, externallyDelivered: false, leads }, null, 2), 'application/json');
    status.textContent = `${leads.length} local lead ${leads.length === 1 ? 'draft' : 'drafts'} exported.`;
  });

  window.addEventListener('storage', (event) => {
    if (event.key === CAMPAIGNS_KEY) {
      campaigns = readCampaigns();
      renderCampaigns();
    }
    if (event.key === 'zj-lead-inbox-v1') renderLeads();
  });

  renderCampaigns();
  renderLeads();
}
