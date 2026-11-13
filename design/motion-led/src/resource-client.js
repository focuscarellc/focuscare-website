(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;
  const summary = document.querySelector('#resource-errors'), status = document.querySelector('#resource-status');
  const fields = document.querySelector('#resource-fields'), button = form.querySelector('[type=submit]');
  let busy = false;
  async function loadChallenge() {
    const res = await fetch('/api/resource-request', { credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    if (!res.ok || typeof data.token !== 'string') throw Error('The checklist form is unavailable. Please email Jovanie.');
    return { token: data.token, readyAt: Date.now() + 3000 };
  }
  let challengePromise = loadChallenge().catch(() => null);
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    summary.hidden = true;
    form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const payload = Object.fromEntries(new FormData(form));
    busy = true; fields.disabled = true; form.setAttribute('aria-busy', 'true');
    button.textContent = 'Requesting...'; status.textContent = 'Saving your checklist request...';
    try {
      let challenge = await challengePromise;
      if (!challenge) { challengePromise = loadChallenge().catch(() => null); challenge = await challengePromise; }
      if (!challenge) throw Error('The checklist form is unavailable. Your entries are still here. Please email Jovanie.');
      if (Date.now() < challenge.readyAt) await new Promise(resolve => setTimeout(resolve, challenge.readyAt - Date.now()));
      const res = await fetch('/api/resource-request', { method: 'POST', credentials: 'same-origin', signal: AbortSignal.timeout(15000), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, token: challenge.token }) });
      const data = await res.json();
      if (!res.ok || data.success !== true) {
        if (data.refreshToken) challengePromise = loadChallenge().catch(() => null);
        if (['email', 'organisation'].includes(data.field)) document.querySelector('#resource-' + data.field).setAttribute('aria-invalid', 'true');
        throw Error(data.error || 'We could not confirm your request. Please try again or email Jovanie.');
      }
      form.hidden = true; status.textContent = '';
      document.querySelector('#resource-success').hidden = false; document.querySelector('#resource-success-title').focus();
    } catch (error) {
      status.textContent = '';
      summary.textContent = ['TimeoutError', 'TypeError', 'SyntaxError'].includes(error.name) ? 'We could not confirm your request. Your entries are still here. Please try again or email Jovanie.' : error.message;
      summary.hidden = false; summary.focus();
    } finally { busy = false; fields.disabled = false; form.removeAttribute('aria-busy'); button.textContent = 'Email me the checklist'; }
  });
  form.hidden = false;
})();
