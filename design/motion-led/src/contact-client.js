(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const topic = document.querySelector('#contact-service');
  const service = new URLSearchParams(location.search).get('service');
  if ([...topic.options].some(option => option.value === service)) topic.value = service;
  const summary = document.querySelector('#error-summary');
  const status = document.querySelector('#contact-status');
  const fields = document.querySelector('#contact-fields');
  const button = form.querySelector('[type=submit]');
  let busy = false;
  async function loadChallenge() {
    const res = await fetch('/api/contact', { credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    if (!res.ok || typeof data.token !== 'string') throw Error('The form is unavailable. Please email or call us.');
    return { token: data.token, readyAt: Date.now() + 3000 };
  }
  let challengePromise = loadChallenge().catch(() => null);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    summary.hidden = true;
    form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const payload = Object.fromEntries(new FormData(form));
    busy = true; fields.disabled = true; form.setAttribute('aria-busy', 'true');
    button.textContent = 'Sending...'; status.textContent = 'Saving your enquiry...';
    try {
      let challenge = await challengePromise;
      if (!challenge) { challengePromise = loadChallenge().catch(() => null); challenge = await challengePromise; }
      if (!challenge) throw Error('The form is unavailable. Your entries are still here. Please email or call us.');
      if (Date.now() < challenge.readyAt) await new Promise(resolve => setTimeout(resolve, challenge.readyAt - Date.now()));
      const res = await fetch('/api/contact', {
        method: 'POST', credentials: 'same-origin', signal: AbortSignal.timeout(15000),
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, token: challenge.token })
      });
      const data = await res.json();
      if (!res.ok || data.success !== true || typeof data.receipt !== 'string' || !/^[a-f0-9-]{36}$/i.test(data.receipt)) {
        if (data.refreshToken) challengePromise = loadChallenge().catch(() => null);
        if (['name', 'email'].includes(data.field)) document.querySelector('#contact-' + data.field).setAttribute('aria-invalid', 'true');
        throw Error(data.error || 'We could not confirm your enquiry. Please try again, email or call us.');
      }
      form.hidden = true; status.textContent = '';
      document.querySelector('#contact-receipt').textContent = 'Reference: ' + data.receipt;
      document.querySelector('#contact-success').hidden = false;
      document.querySelector('#contact-success-title').focus();
      window.FocusCareAnalytics?.capture('contact enquiry submitted', { service: window.FocusCareAnalytics.selectedService() });
    } catch (error) {
      status.textContent = '';
      summary.textContent = error.name === 'TimeoutError' || error.name === 'TypeError'
        ? 'We could not confirm your enquiry. Your entries are still here. Please try again, email or call us.'
        : error.message;
      summary.hidden = false; summary.focus();
    } finally {
      busy = false; fields.disabled = false; form.removeAttribute('aria-busy'); button.textContent = 'Send enquiry';
    }
  });
  // Show the form only after the server-submit handler is installed. Without JS, email and phone remain available.
  form.hidden = false;
})();
