(()=>{document.documentElement.classList.add('js');
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('.mobile-menu');document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary').focus();}});

const {loadScenes,visibleStage,onScreen}=window.FocusCareMotionHelpers;
// ---- resources search + empty state
const search=document.querySelector('#resource-search');
if(search){const empty=document.querySelector('#resource-empty'),count=document.querySelector('#resource-count');const run=()=>{let n=0;const q=search.value.trim().toLowerCase();document.querySelectorAll('[data-resource]').forEach(e=>{e.hidden=!e.dataset.search.includes(q);if(!e.hidden)n++;});count.textContent=`${n} ${n===1?'article':'articles'}${q?` match “${search.value.trim()}”`:''}`;empty.hidden=n>0;};search.addEventListener('input',run);document.querySelector('#resource-clear')?.addEventListener('click',()=>{search.value='';run();search.focus();});}
document.querySelector('[data-print]')?.addEventListener('click',()=>print());

// ---- contact: transparent email draft (nothing is sent from this page)
const form=document.querySelector('#contact-form');if(!form)return;const topic=document.querySelector('#contact-service'),query=new URLSearchParams(location.search).get('service');if(query&&[...topic.options].some(x=>x.value===query))topic.value=query;
let draftRAF=0,draftToken=0,draftSubject='Focus Care workflow';
const draftFigure=document.querySelector('.draft-scene');
const draftStatic=new Map([...draftFigure.querySelectorAll('.scene-mount')].map(m=>[m,m.innerHTML]));
const stopDraft=()=>{draftToken++;cancelAnimationFrame(draftRAF);draftRAF=0;for(const [mount,html]of draftStatic){mount.innerHTML=html;mount.classList.remove('scene-live');mount.querySelectorAll('.draft-subject').forEach(e=>e.textContent='Subject: '+draftSubject);}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDraft();});
addEventListener('scroll',()=>{const fig=document.querySelector('.draft-scene');if(fig&&!onScreen(fig))stopDraft();},{passive:true});
motionQuery.addEventListener('change',stopDraft);
navigator.connection?.addEventListener?.('change',()=>{if(navigator.connection.saveData)stopDraft();});
const invalidateDraft=()=>{const ready=document.querySelector('#email-ready');if(ready.hidden)return;stopDraft();ready.hidden=true;document.querySelector('#copy-draft').disabled=true;document.querySelector('#email-link').removeAttribute('href');document.querySelector('#draft-status').textContent='Your draft is out of date. Prepare it again to review your changes.';};
form.addEventListener('input',invalidateDraft);form.addEventListener('change',invalidateDraft);

document.querySelector('#copy-draft').addEventListener('click',async()=>{
 const text=document.querySelector('#draft-text'),status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText(text.value);status.textContent='Draft copied.';}
 catch{ text.focus();text.select();status.textContent='Draft selected. Use your browser’s Copy command.';}
});
form.addEventListener('submit',e=>{e.preventDefault();stopDraft();const summary=document.querySelector('#error-summary');form.querySelectorAll('.field-error').forEach(e=>e.remove());form.querySelectorAll('[aria-invalid]').forEach(e=>{e.removeAttribute('aria-invalid');const ids=(e.getAttribute('aria-describedby')||'').split(' ').filter(x=>x&&!x.endsWith('-error'));ids.length?e.setAttribute('aria-describedby',ids.join(' ')):e.removeAttribute('aria-describedby');});summary.replaceChildren();summary.hidden=true;document.querySelector('#email-ready').hidden=true;const invalid=[];for(const [id,label]of[['contact-name','Name'],['contact-email','Email']]){const field=document.getElementById(id);if(!field.value.trim()||!field.validity.valid){const message=id==='contact-email'?'Enter a valid email address.':'Enter your name.';const error=document.createElement('p');error.className='field-error';error.id=id+'-error';error.textContent=message;field.insertAdjacentElement('afterend',error);field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',error.id);invalid.push({field,label,message});}}if(invalid.length){const title=document.createElement('p');title.textContent='Please check these fields:';summary.append(title);const list=document.createElement('ul');invalid.forEach(({field,label,message})=>{const li=document.createElement('li'),a=document.createElement('a');a.href='#'+field.id;a.textContent=label+': '+message;a.addEventListener('click',e=>{e.preventDefault();field.focus();});li.append(a);list.append(li);});summary.append(list);summary.hidden=false;summary.focus();return;}
 const name=document.querySelector('#contact-name').value.trim(),email=document.querySelector('#contact-email').value.trim(),message=document.querySelector('#contact-message').value.trim(),svc=topic.options[topic.selectedIndex].text;const subject='Focus Care: '+(topic.value?svc:'workflow enquiry'),body=`Name: ${name}\nEmail: ${email}\nWorkflow: ${topic.value?svc:'Help choosing'}\n\n${message}`;document.querySelector('#email-link').href='mailto:info@focuscarellc.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 draftSubject=subject;document.querySelector('#copy-draft').disabled=false;document.querySelector('#draft-status').textContent='';document.querySelector('#draft-text').value='To: info@focuscarellc.com\nSubject: '+subject+'\n\n'+body;document.querySelector('#copy-status').textContent='';
 const ready=document.querySelector('#email-ready'),fig=ready.querySelector('.draft-scene');ready.querySelectorAll('.draft-subject').forEach(x=>x.textContent='Subject: '+subject);ready.hidden=false;ready.querySelector('h3').focus();
 window.FocusCareAnalytics?.capture('contact draft prepared',{service:window.FocusCareAnalytics.selectedService()});
 if(fig&&!motionQuery.matches&&!navigator.connection?.saveData){const t=++draftToken;loadScenes('draft').then(async()=>{if(t!==draftToken||ready.hidden||!onScreen(fig)||motionQuery.matches||navigator.connection?.saveData)return;const stage=visibleStage(fig);if(!stage)return;const mount=stage.querySelector('.scene-mount');const m=window.FocusCareScenes.mount(mount,'draft',stage.dataset.variant,{depth:false,prepare:r=>r.querySelectorAll('.draft-subject').forEach(x=>x.textContent='Subject: '+subject)});await m.ready;if(t!==draftToken)return;const t0=performance.now();const step=now=>{const s=Math.min(m.duration,(now-t0)/1000);m.renderAt(s);if(s<m.duration&&t===draftToken&&!document.hidden&&onScreen(fig))draftRAF=requestAnimationFrame(step);};draftRAF=requestAnimationFrame(step);}).catch(()=>{if(t===draftToken)stopDraft();});}
});
// Expose the form only after its draft-only submit handler is installed.
form.hidden=false;document.querySelector('#contact-fallback').hidden=true;
})();
