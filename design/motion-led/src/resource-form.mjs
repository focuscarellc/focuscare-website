export const resourceRoute = '/resources/inspection-readiness-checklist';
export const resourcePages = new Set([resourceRoute, '/blog/5-things-inspectors-look-for', '/services/compliance', '/services/training']);
export function renderResourceForm(route, { dedicated = false } = {}) {
  return `<section class="resource-request" id="email-checklist" aria-labelledby="resource-title">
<div class="resource-summary"><h2 id="resource-title">${dedicated ? 'Email me the checklist.' : 'Start with a checklist.'}</h2>
<p>A free, two-page inspection-readiness checklist. Review rights, fire safety, medication records, training and site conditions, then record what needs follow-up.</p>
<p class="small">Drawn from our published guides. You confirm completion and review requirements. Tools support your oversight; they do not guarantee compliance. The provider makes the final decisions.</p></div>
<div class="resource-form-wrap"><form id="resource-form" method="post" action="/api/resource-request" novalidate hidden>
<div id="resource-errors" class="errors" role="alert" hidden tabindex="-1"></div>
<fieldset id="resource-fields"><legend class="resource-sr-only">Request the inspection-readiness checklist</legend>
<label for="resource-email">Work email (required)<input id="resource-email" name="email" type="email" autocomplete="email" required maxlength="180" aria-describedby="resource-notice"></label>
<p id="resource-notice" class="small">We will email you the checklist and Jovanie will send one follow-up, nothing else. You will not be added to a waitlist or any list.</p>
<label for="resource-organisation">Organisation (optional)<input id="resource-organisation" name="organisation" autocomplete="organization" maxlength="120"></label>
<input type="hidden" name="source" value="${route}"><input type="hidden" name="noticeVersion" value="checklist-and-one-followup-v1">
<div class="contact-trap" aria-hidden="true"><label for="resource-website">Leave this field empty<input id="resource-website" name="website" tabindex="-1" autocomplete="off"></label></div>
<button type="submit" class="button">Email me the checklist</button>
</fieldset><p class="small"><a href="/privacy#resource-requests">How we use your details</a>. Please leave out care information.</p><p id="resource-status" role="status" aria-live="polite" class="small"></p></form>
<p id="resource-fallback" class="small">You can also <a href="mailto:jovanie@focuscarellc.com?subject=Inspection-readiness%20checklist">email Jovanie to request the checklist</a>.</p>
<section id="resource-success" class="email-ready" hidden aria-labelledby="resource-success-title"><h3 id="resource-success-title" tabindex="-1">Check your inbox.</h3><p id="resource-success-message">If this address has not already received the checklist, we will email the PDF. Jovanie will send at most one follow-up, nothing else. If you need help, email jovanie@focuscarellc.com.</p></section></div></section>`;
}
export function renderResourcePage(intro) {
  return `${intro('A practical start before your next inspection.','A free, printable checklist for Pennsylvania residential provider teams. Two pages to review evidence and assign follow-up, drawn from Focus Care’s existing guides.','<div class="actions"><a class="button" href="#email-checklist">Get the free checklist</a></div>')}
${renderResourceForm(resourceRoute, { dedicated: true })}
<section class="prose resource-reading"><h2>Five areas. A place to plan the next step.</h2><ul><li>Rights information that fits the person.</li><li>Fire-safety plans and evidence.</li><li>Medication records, training and storage.</li><li>Training evidence that matches the work.</li><li>Physical site conditions and repairs.</li></ul><p>The second page gives you space to note missing evidence, a responsible person and a review date. This is a short working checklist, not a complete regulatory checklist or a promise of an inspection outcome.</p><p>Read the source article: <a href="/blog/5-things-inspectors-look-for">5 Things Inspectors Look For That Most Providers Miss</a>.</p></section>`;
}
