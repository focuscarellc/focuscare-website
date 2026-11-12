(()=>{document.documentElement.classList.add('js');
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('.mobile-menu');document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary').focus();}});

const {loadScenes,visibleStage,onScreen}=window.FocusCareMotionHelpers;
// ---- resources search + empty state
const search=document.querySelector('#resource-search');
if(search){const empty=document.querySelector('#resource-empty'),count=document.querySelector('#resource-count');const run=()=>{let n=0;const q=search.value.trim().toLowerCase();document.querySelectorAll('[data-resource]').forEach(e=>{e.hidden=!e.dataset.search.includes(q);if(!e.hidden)n++;});count.textContent=`${n} ${n===1?'article':'articles'}${q?` match “${search.value.trim()}”`:''}`;empty.hidden=n>0;};search.addEventListener('input',run);document.querySelector('#resource-clear')?.addEventListener('click',()=>{search.value='';run();search.focus();});}
document.querySelector('[data-print]')?.addEventListener('click',()=>print());

})();
