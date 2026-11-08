// Intent-loaded scene controls. Every wait checks the current playback intent.
const assets=document.body.dataset.assets||'assets/';
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const scripts=new Map(),controllers=[];
function loadScript(src,ready){
 if(ready())return Promise.resolve();
 if(scripts.has(src))return scripts.get(src);
 const p=new Promise((resolve,reject)=>{
  const s=document.createElement('script');let done=false;
  const finish=error=>{if(done)return;done=true;clearTimeout(timer);if(error){s.remove();scripts.delete(src);reject(error);}else resolve();};
  const timer=setTimeout(()=>finish(Error('Scene loading timed out')),6000);
  s.src=src;s.async=true;s.onload=()=>finish(ready()?null:Error('Scene API unavailable'));s.onerror=()=>finish(Error('Scene file unavailable'));document.head.append(s);
 });scripts.set(src,p);return p;
}
function loadScenes(id){
 if(!/^(recruitment|training|payroll|operations|billing|compliance|draft)$/.test(id))return Promise.reject(Error('Unknown scene'));
 return Promise.all([
  loadScript(window.FC_SCENES_SRC||assets+'scenes.js',()=>!!window.FocusCareScenes),
  loadScript(assets+'scene-'+id+'.js',()=>!!window.FocusCareSceneMarkup?.[id+'-wide'])
 ]);
}
function visibleStage(fig){return [...fig.querySelectorAll('.scene-stage')].find(s=>s.offsetParent!==null);}
function onScreen(fig){const r=fig.getBoundingClientRect();return !document.hidden&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}
function setupScene(fig){
 const name=fig.dataset.name.toLowerCase(),play=fig.querySelector('.scene-play'),stat=fig.querySelector('.scene-static-btn'),status=fig.querySelector('.scene-status');
 const saved=new Map([...fig.querySelectorAll('.scene-mount')].map(m=>[m,m.innerHTML]));
 const finalLabel=[...saved.keys()][0]?.querySelector('.fc-frame')?.getAttribute('aria-label');
 const c={finalLabel,fig,state:'static',token:0,m:null,mount:null,t:0,raf:0,variant:null};
 const labels={static:'Play',loading:'Cancel loading',playing:'Pause',paused:'Resume',done:'Replay',error:'Retry'};
 function set(state,message){
  c.state=state;fig.dataset.state=state;play.textContent=labels[state];
  if(c.mount)c.mount.querySelector('.fc-frame')?.setAttribute('aria-label',state==='done'?c.finalLabel:'Illustrative '+name+' workflow. '+fig.querySelector('.scene-note').textContent);
  play.setAttribute('aria-label',labels[state]+' '+name+(state==='error'?' animation':' example'));
  stat.hidden=!['playing','paused','done'].includes(state);stat.setAttribute('aria-label','Show static '+name+' record');
  status.textContent=message||({static:'Static record shown.',loading:'Loading animation...',playing:'Playing example.',paused:'Paused at '+c.t.toFixed(1)+' s.',done:'Finished on the final record.',error:'Animation unavailable. Static record shown.'})[state];
 }
 function stop(){cancelAnimationFrame(c.raf);c.raf=0;}
 function restore(){
  stop();c.token++;if(c.mount){c.mount.innerHTML=saved.get(c.mount);c.mount.classList.remove('scene-live');}
  c.m=null;c.mount=null;c.t=0;set('static');
 }
 function frame(now){
  if(c.state!=='playing')return;
  c.t=Math.min(c.m.duration,(now-c.t0)/1000);c.m.renderAt(c.t);
  if(c.t>=c.m.duration){stop();set('done');return;}c.raf=requestAnimationFrame(frame);
 }
 function run(){
  if(!c.m)return;
  if(!onScreen(fig)){set(c.state,'Bring the example into view, then press '+labels[c.state]+'.');return;}
  controllers.forEach(o=>o!==c&&o.suspend());c.t0=performance.now()-c.t*1000;set('playing');c.raf=requestAnimationFrame(frame);
 }
 c.pause=()=>{if(c.state==='playing'){stop();set('paused');}};
 c.suspend=()=>{if(c.state==='loading'){restore();set('static','Loading cancelled. Static record shown.');}else c.pause();};
 c.seek=t=>{if(!c.m)return null;stop();c.t=c.m.renderAt(t);set(c.t>=c.m.duration?'done':'paused');return c.t;};
 c.restore=restore;
 async function start(){
  const token=++c.token;set('loading');
  try{
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   if(token!==c.token||c.state!=='loading')return;
   await loadScenes(fig.dataset.scene);
   if(token!==c.token||c.state!=='loading')return;
   if(!onScreen(fig)){restore();return;}
   const stage=visibleStage(fig);if(!stage){restore();return;}
   c.mount=stage.querySelector('.scene-mount');c.variant=stage.dataset.variant;
   c.m=window.FocusCareScenes.mount(c.mount,fig.dataset.scene,c.variant,{depth:false});
   await c.m.ready;
   if(token!==c.token||c.state!=='loading')return;
   if(!onScreen(fig)){restore();return;}
   c.t=0;c.m.renderAt(0);run();
  }catch(e){if(token===c.token){restore();set('error');}}
 }
 play.addEventListener('click',()=>{
  if(c.state==='loading')c.suspend();else if(c.state==='playing')c.pause();
  else if(c.state==='paused')run();else if(c.state==='done'){c.t=0;run();}else start();
 });
 stat.addEventListener('click',()=>{restore();play.focus();});
 set('static');play.hidden=false;controllers.push(c);fig.__fc=c;
}
const figs=[...document.querySelectorAll('figure[data-scene]')];figs.forEach(setupScene);
if('IntersectionObserver'in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting||e.intersectionRatio<.2)e.target.__fc.suspend();}),{threshold:[0,.2]});
 figs.forEach(f=>io.observe(f));
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)controllers.forEach(c=>c.suspend());});
preference.addEventListener('change',()=>controllers.forEach(c=>c.restore()));
let lastW=innerWidth;
addEventListener('resize',()=>{if(Math.abs(innerWidth-lastW)<2)return;lastW=innerWidth;controllers.forEach(c=>{if(c.state==='loading'||c.mount&&visibleStage(c.fig)?.dataset.variant!==c.variant)c.restore();});});
window.FocusCareSceneControl={get:id=>controllers.find(c=>c.fig.dataset.scene===id),load:loadScenes};
window.FocusCareMotionHelpers={loadScenes,visibleStage,onScreen};
