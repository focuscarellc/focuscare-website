import {chromium} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {assertCleanText,plainText} from '../design/motion-led/src/text.mjs';
import {BEAT,CONTACT,SETTLE,SWAP} from '../design/motion-led/src/hero/data.mjs';
const root=resolve(import.meta.dirname,'..'),out=join(root,'release-evidence'),url=process.env.TEST_URL||'http://127.0.0.1:4180';
mkdirSync(out,{recursive:true});
const R={createdUTC:new Date().toISOString(),url,hashes:{},checks:[],errors:[]};
const check=(name,pass,details)=>{R.checks.push({name,pass:!!pass,details});if(!pass)console.error('FAIL',name,JSON.stringify(details))};
for(const file of ['design/motion-led/build.mjs','design/motion-led/src/text.mjs','design/motion-led/src/hero/hero.css','design/motion-led/src/hero/runtime.js','scripts/package-design.mjs','app/[...path]/route.ts'])R.hashes[file]=createHash('sha256').update(readFileSync(join(root,file))).digest('hex');
const manifest=JSON.parse(readFileSync(join(root,'design/generated/release-manifest.json'),'utf8'));
for(const p of manifest.pages){
 const html=readFileSync(join(root,'public',p.path),'utf8');let clean=true;try{assertCleanText(html,p.route)}catch{clean=false}
 check(p.route+' UTF-8 and plain metadata',clean&&p.description===plainText(p.description)&&p.description.length<=180,{description:p.description});
}
const b=await chromium.launch({channel:'chrome',ignoreDefaultArgs:['--hide-scrollbars'],args:['--disable-features=OverlayScrollbar,OverlayScrollbars']});
try{
 for(const width of [320,390,728,1440]){
  const c=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1.25}),p=await c.newPage();p.on('pageerror',e=>R.errors.push(e.message));
  await p.goto(url);await p.addStyleTag({content:'html{overflow-y:scroll;scrollbar-gutter:stable}::-webkit-scrollbar{width:15px}'});await p.waitForFunction(()=>window.FocusCareHero?.animationReady);await p.evaluate(()=>FocusCareHero.pause());
  const client=await p.evaluate(()=>document.documentElement.clientWidth);check('classic scrollbar exercised '+width,client===width-15,{width,client,dpr:1.25});
  for(let i=0;i<6;i++){
   await p.evaluate(i=>FocusCareHero.select(i),i);
   const g=await p.evaluate(()=>{
    const box=e=>{const r=e.getBoundingClientRect();return{x:r.x,right:r.right,top:r.top,bottom:r.bottom,width:r.width}},stage=box(document.querySelector('.hx')),card=box(document.querySelector('.hx-flow')),rail=box(document.querySelector('.hx-rail'));
    const text=[];for(const el of document.querySelectorAll('.hx-flow .hx-rl,.hx-flow .hx-chip')){const range=document.createRange();range.selectNodeContents(el);text.push(...[...range.getClientRects()].map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom})))}
    return{stage,card,rail,rows:[...document.querySelectorAll('.hx-row')].map(box),tabs:[...document.querySelectorAll('.hx-tab')].map(box),text,overflow:document.documentElement.scrollWidth>innerWidth};
   });
   const contained=!g.overflow&&g.card.bottom<=g.rail.top&&g.rows.every(r=>r.x>=g.card.x&&r.right<=g.card.right)&&g.tabs.every(t=>t.x>=g.stage.x&&t.right<=g.stage.right)&&g.text.every(t=>t.left>=g.card.x-1&&t.right<=g.card.right+1);
   check('workflow '+i+' classic '+width,contained,g);
  }
  await p.locator('.hx').screenshot({path:join(out,'classic-'+width+'.png')});
  // Reproduce a pause during every reveal/swap, using the actual pause handler.
  for(let i=0;i<6;i++)for(const t of [.01,.25,CONTACT+.25,SETTLE+.01,SWAP+.11,SWAP+.25]){
   const result=await p.evaluate(t=>{FocusCareHero.renderAt(t);const before=FocusCareHero.state.index;FocusCareHero.pause();return{before,after:FocusCareHero.state.index,playing:FocusCareHero.state.playing,phase:FocusCareHero.state.phase,masks:[...document.querySelectorAll('.hx-flow .hx-car')].map(e=>e.style.clipPath)}},i*BEAT+t);
   check('readable pause '+width+' '+i+' '+t,result.before===result.after&&!result.playing&&result.phase==='settled'&&result.masks.every(x=>!x),result);
  }
  await p.emulateMedia({reducedMotion:'reduce'});
  const reduced=await p.evaluate(()=>{const h=document.querySelector('.hx').getBoundingClientRect(),o=document.querySelector('.hx-ov').getBoundingClientRect(),rail=document.querySelector('.hx-rail').getBoundingClientRect();return{playing:FocusCareHero.state.playing,rows:document.querySelectorAll('.hx-ov-row').length,inside:o.x>=h.x&&o.right<=h.right&&o.bottom<rail.top}});
  check('reduced overview classic '+width,!reduced.playing&&reduced.rows===6&&reduced.inside,reduced);
  await p.locator('.hx').screenshot({path:join(out,'classic-reduced-'+width+'.png')});await c.close();
 }
 const c=await b.newContext(),p=await c.newPage();
 for(const path of ['/404','/no-such-page','/services/no-such-workflow','/blog/no-such-article']){
  const response=await p.goto(url+path),state=await p.evaluate(()=>({title:document.title,h1:document.querySelector('h1')?.textContent,canonical:!!document.querySelector('link[rel=canonical]'),robots:document.querySelector('meta[name=robots]')?.content,scripts:[...document.scripts].some(s=>s.src.includes('/_next/')),brand:!!document.querySelector('a.brand img'),contact:!!document.querySelector('a[href="/contact"]')}));
  check(path+' branded 404',response.status()===404&&state.title==='Page not found | Focus Care'&&!state.canonical&&state.robots.includes('noindex')&&!state.scripts&&state.brand&&state.contact,state);
 }
 const missing=await p.request.get(url+'/assets/intentional-missing-image.webp');check('missing image cannot pass asset gate',!(missing.status()===200&&/^image\//.test(missing.headers()['content-type']||'')),{status:missing.status(),type:missing.headers()['content-type']});
 await c.close();check('no page errors',!R.errors.length,R.errors);
}catch(e){R.errors.push(e.stack);check('harness completion',false,e.message)}finally{await b.close();writeFileSync(join(out,'corrections.json'),JSON.stringify(R,null,2))}
console.log(JSON.stringify({checks:R.checks.length,failures:R.checks.filter(c=>!c.pass).map(c=>({name:c.name,details:c.details})),errors:R.errors}));
if(R.errors.length||R.checks.some(c=>!c.pass))process.exitCode=1;
