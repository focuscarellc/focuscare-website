export function renderContact(intro, services) {
  return `${intro('Tell us what slows your team.','Choose a workflow, or ask where to start.','<div class="actions"><a class="button" href="#enquiry">Go to enquiry form</a></div>')}
<section class="contact-layout"><div class="contact-options">
<a href="mailto:jovanie@focuscarellc.com">jovanie@focuscarellc.com</a>
<a href="tel:+12024550325">+1 (202) 455-0325</a>
<p>Focus Care LLC<br>239 4th Ave, Suite 1401, Unit #7549<br>Pittsburgh, PA 15222</p>
</div><div class="contact-form" id="enquiry"><h2>Send an enquiry.</h2>
<p>Tell us what you need. We will follow up by email.</p>
<p id="contact-fallback" class="small">You can also email or call us using the contact details above.</p>
<form class="js-only" id="contact-form" method="post" action="/api/contact" novalidate hidden>
<div id="error-summary" class="errors" role="alert" hidden tabindex="-1"></div>
<fieldset id="contact-fields"><legend class="sr-only">Your enquiry</legend>
<label for="contact-name">Name (required)<input id="contact-name" name="name" autocomplete="name" required maxlength="100"></label>
<label for="contact-email">Email (required)<input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="180"></label>
<label for="contact-service">Workflow<select id="contact-service" name="service"><option value="">Help me choose</option>${services.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></label>
<label for="contact-message">What would you like to improve?<textarea id="contact-message" name="message" rows="3" maxlength="1200" aria-describedby="message-help"></textarea></label>
<p id="message-help" class="small">Please leave out care records and personal care information.</p>
<div class="contact-trap" aria-hidden="true"><label for="contact-website">Leave this field empty<input id="contact-website" name="website" tabindex="-1" autocomplete="off"></label></div>
<button type="submit" class="button">Send enquiry</button></fieldset>
<p class="small">We save your enquiry so we can respond. Optional analytics are separate. <a href="/privacy#contact-enquiries">Privacy details</a></p>
<p id="contact-status" class="small" role="status" aria-live="polite"></p></form>
<section id="contact-success" class="email-ready" hidden aria-labelledby="contact-success-title"><h3 id="contact-success-title" tabindex="-1">Your enquiry is saved.</h3><p>Thank you. Focus Care will follow up by email.</p><p class="small" id="contact-receipt"></p></section>
</div></section>`;
}
