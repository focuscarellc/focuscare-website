import {chromium} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {BEAT,SWAP,LOOP} from '../design/motion-led/src/hero/data.mjs';
const root=resolve(import.meta.dirname,'..'),out=process.env.EVIDENCE_DIR||join(root,'release-evidence');mkdirSync(out,{recursive:true});
const origin=process.env.TEST_URL||'http://127.0.0.1:4175';
const manifest=JSON.parse(readFileSync(join(root,'design/generated/release-manifest.json'),'utf8'));
const report={createdUTC:new Date().toISOString(),origin,browser:null,checks:[],errors:[],performance:[],hashes:{}};
const check=(name,pass,details)=>{report.checks.push({name,pass:!!pass,details});if(!pass)console.error('FAIL',name,JSON.stringify(details))};
for(const f of ['package-lock.json','next.config.js','scripts/package-design.mjs','design/motion-led/build.mjs','design/motion-led/src/hero/runtime.js','design/motion-led/src/hero/hero.css','design/motion-led/src/hero/native.js'])report.hashes[f]=createHash('sha256').update(readFileSync(join(root,f))).digest('hex');
const browser=await chromium.launch({channel:'chrome'});report.browser=browser.version();
try{
 const c=await browser.newContext(),p=await c.newPage(),checkedImages=new Map();
 p.on('pageerror',e=>report.errors.push(e.message));
 for(const route of manifest.pages){
  const res=await p.goto(origin+route.route);await p.evaluate(()=>document.fonts.ready);
  const meta=await p.evaluate(()=>({h1:document.querySelectorAll('h1').length,title:document.title,desc:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href||null,robots:document.querySelector('meta[name=robots]')?.content,oldPhotos:[...document.images].some(i=>i.src.includes('/images/')),react:!!document.querySelector('script[src*="/_next/"]'),missing:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),pendingLazy:[...document.images].filter(i=>!i.complete&&i.loading==='lazy').map(i=>i.src),copy:document.body.innerText,images:[...new Set([...document.images].flatMap(i=>[i.src,i.currentSrc,...i.srcset.split(',').map(s=>s.trim().split(/\s+/)[0])]).filter(Boolean).map(s=>new URL(s,location.href).href))]}));
  const badText=/\u00c2[\u00a0-\u00bf]|\u00e2(?:\u20ac|\u0080)|\ufffd/.test(meta.copy+meta.desc);
  check(route.route+' metadata and static response',res.status()===(route.status||200)&&meta.h1===1&&meta.desc&&!/undefined|\*\*|TL;DR:/.test(meta.desc)&&!badText&&meta.canonical===(route.route==='/404'?null:'https://focuscarellc.com'+route.route)&&meta.robots===(route.indexed?'index,follow':'noindex,follow')&&!meta.react&&!meta.oldPhotos&&!meta.missing.length,{...meta,copy:undefined,images:undefined});
  for(const url of meta.images){
   if(checkedImages.has(url))continue;
   const response=await p.request.get(url);
   const valid=response.status()===200&&/^image\//.test(response.headers()['content-type']||'');
   checkedImages.set(url,valid);
   check('referenced image '+new URL(url).pathname,valid,{status:response.status(),type:response.headers()['content-type']});
  }
 }
 for(const route of ['/','/services','/services/training','/contact','/about','/blog','/compliance-kit']){
  await p.goto(origin+route);await p.evaluate(()=>document.fonts.ready);
  if(route==='/'){await p.waitForFunction(()=>window.FocusCareHero?.animationReady);await p.evaluate(()=>FocusCareHero.pause())}
  for(const width of [320,390,728,1024,1440]){
   await p.setViewportSize({width,height:900});await p.waitForTimeout(120);
   const g=await p.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontFamily}));
   check(route+' width '+width,g.width===width&&g.font.includes('Inter'),g);
   if([390,1440].includes(width))await p.screenshot({path:join(out,(route==='/'?'home':route.slice(1).replaceAll('/','-'))+'-'+width+'.png'),fullPage:true});
  }
 }
 await p.setViewportSize({width:1440,height:1000});await p.goto(origin+'/');await p.waitForFunction(()=>window.FocusCareHero?.animationReady);await p.evaluate(()=>FocusCareHero.pause());
 for(const w of [320,390,728,1024,1440]){
  await p.setViewportSize({width:w,height:1000});await p.waitForTimeout(100);
  for(const t of Array.from({length:6},(_,i)=>[.4,1.6,3.6,SWAP-.01,SWAP+.15,BEAT-.05].map(u=>i*BEAT+u)).flat()){
   await p.evaluate(t=>FocusCareHero.renderAt(t),t);
   const box=await p.evaluate(()=>{const stage=document.querySelector('.hx').getBoundingClientRect(),flow=document.querySelector('.hx-flow').getBoundingClientRect(),rail=document.querySelector('.hx-rail').getBoundingClientRect();return{stage:[stage.x,stage.y,stage.width,stage.height],flow:[flow.x,flow.y,flow.width,flow.height],rail:[rail.x,rail.y,rail.width,rail.height],overflow:document.documentElement.scrollWidth>innerWidth}});
   check('hero containment '+w+' '+t,!box.overflow&&box.flow[0]>=box.stage[0]-1&&box.flow[0]+box.flow[2]<=box.stage[0]+box.stage[2]+1&&box.flow[1]>=box.stage[1]&&box.flow[1]+box.flow[3]<=box.rail[1]+1,box);
  }
 }
 await p.setViewportSize({width:1440,height:1000});await p.goto(origin+'/');await p.waitForFunction(()=>window.FocusCareHero?.animationReady);await p.evaluate(()=>{FocusCareHero.pause();FocusCareHero.renderAt(3.5)});
 await p.addScriptTag({path:join(root,'node_modules/axe-core/axe.min.js')});const a=await p.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));check('home axe',!a.violations.length,a.violations.map(v=>({id:v.id,nodes:v.nodes.map(x=>x.target)})));
 // Determinism and user pause must survive resize/selection/preferences.
 const snap=()=>p.evaluate(()=>[document.querySelector('.hx-flow').textContent,document.querySelector('.hx-cam').style.transform,document.querySelector('.hx-chassis .body').getAttribute('d')].join('|'));
 await p.evaluate(()=>FocusCareHero.renderAt(11.37));const first=await snap();await p.evaluate(()=>{FocusCareHero.renderAt(23);FocusCareHero.renderAt(11.37)});check('deterministic seek',first===await snap());
 await p.locator('.hx-tab').nth(4).focus();await p.keyboard.press('Enter');check('keyboard selection while paused',await p.evaluate(()=>FocusCareHero.state.index===4&&!FocusCareHero.state.playing&&document.activeElement.dataset.i==='4'));
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);check('dynamic reduced motion',await p.evaluate(()=>FocusCareHero.state.reduced&&!FocusCareHero.state.playing&&getComputedStyle(document.querySelector('.hx-ov')).display!=='none'));
 await p.emulateMedia({reducedMotion:'no-preference'});check('user pause survives preference change',await p.evaluate(()=>FocusCareHero.state.userPaused&&!FocusCareHero.state.playing));
 await p.route('**/api/contact',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(r.request().method()==='POST'?{success:true,receipt:'11111111-1111-4111-8111-111111111111'}:{token:'local-fixture-token'})}));await p.goto(origin+'/contact?service=billing');await p.fill('#contact-name','TEST - ignore');await p.fill('#contact-email','test@example.invalid');await p.fill('#contact-message','Discuss the billing workflow.');await p.getByRole('button',{name:'Send enquiry'}).click();await p.locator('#contact-success').waitFor({state:'visible'});check('accepted enquiry receipt shown',await p.locator('#contact-receipt').innerText().then(x=>x.includes('11111111-1111-4111-8111-111111111111')));
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),np=await nojs.newPage();await np.goto(origin+'/');check('no JS readable hero and real service links',await np.locator('.hx-flow').innerText().then(x=>x.includes('Recruitment'))&&(await np.locator('.hx-tab[href]').count())===6);await np.screenshot({path:join(out,'home-nojs-390.png'),fullPage:true});await nojs.close();
 await c.close();
 // Controlled loopback lab, not field CWV or physical-device evidence.
 for(const width of [390,1440]){
  const ctx=await browser.newContext({viewport:{width,height:900}}),pg=await ctx.newPage(),cdp=await ctx.newCDPSession(pg);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await pg.addInitScript(()=>{window.lab={long:[],raf:[],cls:0,lcp:0};new PerformanceObserver(l=>l.getEntries().forEach(e=>lab.long.push({start:e.startTime,duration:e.duration}))).observe({type:'longtask',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)lab.cls+=e.value})).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>lab.lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});let last=0;function frame(t){if(last)lab.raf.push(t-last);last=t;requestAnimationFrame(frame)}requestAnimationFrame(frame)});
  await pg.goto(origin+'/');await pg.waitForFunction(()=>window.FocusCareHero?.animationReady);await pg.waitForTimeout((LOOP+1.4)*1000);
  const lab=await pg.evaluate(()=>({lcp:lab.lcp,cls:lab.cls,longTasks:lab.long,raf:lab.raf,resources:performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,transfer:r.transferSize,encoded:r.encodedBodySize})),state:FocusCareHero.state}));report.performance.push({width,cpu:4,network:'unthrottled loopback',...lab,raf:lab.raf.sort((a,b)=>a-b).filter((x,i,a)=>i===Math.floor(a.length*.5)||i===Math.floor(a.length*.95)||i===a.length-1)});await ctx.close();
 }
 check('no page errors',report.errors.length===0,report.errors);

}catch(e){report.errors.push(e.stack);check('harness completion',false,e.message)}finally{await browser.close();writeFileSync(join(out,'verification.json'),JSON.stringify(report,null,2))}
console.log(JSON.stringify({checks:report.checks.length,failures:report.checks.filter(x=>!x.pass),errors:report.errors,performance:report.performance.map(({raf,longTasks,lcp,cls,width})=>({width,lcp,cls,raf,longTasks}))}));
if(report.errors.length||report.checks.some(x=>!x.pass))process.exitCode=1;
