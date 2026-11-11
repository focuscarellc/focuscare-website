// Small first-party bootstrap. The PostHog SDK loads only after analytics consent.
const settings = document.querySelector('[data-focuscare-analytics]');
const allowedHosts = new Set(['focuscarellc.com', 'www.focuscarellc.com']);
const consentKey = 'focuscare.analytics-consent.v1';
const services = new Set(['recruitment', 'training', 'payroll', 'operations', 'billing', 'compliance']);
let consent = 'denied', client = null, pending = [], loading = null, generation = 0;

function privatePreference() {
  return navigator.globalPrivacyControl === true || ['1', 'yes'].includes(navigator.doNotTrack);
}
function readConsent() { try { return localStorage.getItem(consentKey); } catch { return null; } }
function remember(value) { try { localStorage.setItem(consentKey, value); } catch {} }
const selectedService = () => {
  const value = document.querySelector('#contact-service')?.value;
  return services.has(value) ? value : 'unspecified';
};
const placement = node => node.closest('.faq-actions') ? 'faq' : node.closest('.header') ? 'navigation' : node.closest('.footer') ? 'footer' : node.closest('.hero,.service-hero') ? 'hero' : 'page';

function capture(event, properties = {}) {
  if (consent !== 'granted' || privatePreference()) return;
  const props = { ...properties, source_path: location.pathname };
  if (client) client.capture(event, props);
  else if (pending.length < 25) pending.push([event, props]);
}
async function start() {
  if (loading || client || consent !== 'granted' || privatePreference()) return;
  const token = settings.dataset.projectToken, host = settings.dataset.apiHost;
  if (!token || !host) return;
  const current = generation;
  loading = import('./analytics-sdk.js').then(({ startAnalytics }) => {
    if (current !== generation || consent !== 'granted' || privatePreference()) return;
    client = startAnalytics({ token, host });
    for (const [event, props] of pending.splice(0)) client.capture(event, props);
  }).catch(() => { pending = []; }).finally(() => {
    loading = null;
    if (!client && consent === 'granted' && current !== generation) start();
  });
}
function choose(value) {
  generation++;
  consent = value;
  remember(value);
  notice.hidden = true;
  if (value === 'granted' && !privatePreference()) start();
  else { pending = []; client?.opt_out_capturing(); client = null; }
}

const notice = document.createElement('section');
notice.className = 'analytics-notice'; notice.hidden = true;
notice.setAttribute('aria-label', 'Website analytics preferences');
notice.innerHTML = '<p><strong>Help us improve this website.</strong> Allow optional analytics about visits and useful links. Form contents are excluded.</p><div><button type="button" class="button" data-analytics-choice="granted">Allow analytics</button><button type="button" class="button secondary" data-analytics-choice="denied">Decline</button><a href="/privacy#website-analytics">Privacy details</a></div>';

if (settings && allowedHosts.has(location.hostname) && settings.dataset.route === location.pathname) {
  document.body.append(notice);
  notice.addEventListener('click', e => { const b = e.target.closest('[data-analytics-choice]'); if (b) choose(b.dataset.analyticsChoice); });
  const pref = document.createElement('button');
  pref.type = 'button'; pref.className = 'analytics-preferences'; pref.textContent = 'Analytics preferences';
  if (privatePreference()) { pref.textContent = 'Analytics disabled by browser preference'; pref.disabled = true; }
  pref.addEventListener('click', () => { if (!privatePreference()) { notice.hidden = false; notice.querySelector('button').focus(); } });
  document.querySelector('.footer-bottom')?.append(pref);
  consent = readConsent() === 'granted' && !privatePreference() ? 'granted' : 'denied';
  if (consent === 'granted') {
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1800 });
    else setTimeout(start, 600);
  } else if (!readConsent() && !privatePreference()) notice.hidden = false;

  window.FocusCareAnalytics = { capture, selectedService };
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (link) {
      let url; try { url = new URL(link.href, location.href); } catch { return; }
      const common = { placement: placement(link) };
      if (url.protocol === 'mailto:') capture(link.id === 'email-link' ? 'email app opened' : 'email link clicked', { ...common, service: selectedService() });
      else if (url.protocol === 'tel:') capture('phone link clicked', common);
      else if (url.origin === location.origin && url.pathname === '/contact') {
        const service = url.searchParams.get('service');
        capture('contact CTA clicked', { ...common, service: services.has(service) ? service : 'unspecified' });
      } else if (url.origin === location.origin && /^\/services\//.test(url.pathname)) {
        const service = url.pathname.split('/')[2];
        if (services.has(service)) capture('service link clicked', { ...common, service });
      } else if (url.hostname === 'get.focuscarellc.com') capture('software link clicked', common);
      else if (url.hostname === 'focuscarellc.gumroad.com' || url.pathname === '/compliance-kit') capture('checklist link clicked', common);
    }
    const tab = e.target.closest('.hx-tab[data-i]');
    if (tab) {
      const service = [...services][Number(tab.dataset.i)];
      if (service) capture('workflow selected', { service });
    }
  });
}
