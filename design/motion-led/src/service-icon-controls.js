// Small, finite native-icon exports; never run more than one at a time.
(()=>{
 const cards=[...document.querySelectorAll('[data-service-icon]')],motion=matchMedia('(prefers-reduced-motion: reduce)'),connection=navigator.connection;
 if(!cards.length)return;
 let active=null,queue=[];const seen=new WeakSet();
 const allowed=()=>!motion.matches&&!connection?.saveData&&!document.hidden;
 const visible=el=>{const b=el.getBoundingClientRect();return b.top<innerHeight-20&&b.bottom>20;};
 function stop(){if(active){clearTimeout(active.timer);active.image.remove();active.card.classList.remove('icon-playing');active=null;}}
 function next(){if(!allowed())return;let card;while((card=queue.shift())&&!visible(card)){}if(card)play(card);}
 function play(card){
  if(!allowed()||!visible(card)||active?.card===card)return;
  stop();queue=queue.filter(x=>x!==card);
  const icon=card.querySelector('.service-icon'),image=new Image(192,192),state={card,image};active=state;
  image.alt='';image.setAttribute('aria-hidden','true');image.decoding='async';
  image.onload=()=>{if(active!==state)return;card.classList.add('icon-playing');state.timer=setTimeout(()=>{if(active===state){stop();next();}},Number(icon.dataset.duration)+80);};
  image.onerror=()=>{if(active===state){stop();next();}};
  icon.append(image);image.src=icon.dataset.motion+'#play-'+performance.now();
 }
 const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting&&e.intersectionRatio>=.6){if(allowed()&&!seen.has(e.target)){seen.add(e.target);queue.push(e.target);}}else if(active?.card===e.target){stop();}}if(!active)next();},{threshold:[0,.6]});
 cards.forEach(card=>{observer.observe(card);card.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')play(card);});card.addEventListener('focusin',()=>play(card));});
 function reset(){stop();queue=[];}
 motion.addEventListener('change',reset);connection?.addEventListener?.('change',reset);
 document.addEventListener('visibilitychange',reset);
})();
