import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { WF, BEAT, SETTLE, SWAP } from '../design/motion-led/src/hero/data.mjs';
const root=resolve(import.meta.dirname,'..'),url=process.env.TEST_URL||'http://127.0.0.1:4180';
const result={createdUTC:new Date().toISOString(),hashes:{},checks:[],errors:[]};
for(const file of ['design/motion-led/build.mjs','design/motion-led/src/text.mjs','design/motion-led/src/case-studies.mjs','design/motion-led/src/site.js','design/motion-led/src/hero/data.mjs'])result.hashes[file]=createHash('sha256').update(readFileSync(join(root,file))).digest('hex');
const check=(name,pass,details)=>{result.checks.push({name,pass:!!pass,details});if(!pass)console.error('FAIL',name,details)};
const browser=await chromium.launch({channel:'chrome'});
try{
 const context=await browser.newContext({viewport:{width:390,height:900}}),page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
 for(const [route,date] of [['5-things-inspectors-look-for','2026-02-12'],['elevating-care-digital-transformation-story','2026-01-31']]){
  await page.goto(url+'/blog/'+route);
  const data=await page.evaluate(()=>({h1:document.querySelector('h1').textContent,article:JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent).find(s=>s['@type']==='Article'),selfLinks:[...document.querySelectorAll('.case-source a')].filter(a=>a.href===document.querySelector('link[rel=canonical]').href).length,source:document.querySelector('.case-source')?.textContent}));
  check('calendar date and visible headline '+route,data.article.datePublished===date&&data.article.headline===data.h1,data);
  if(route.startsWith('elevating-'))check('qualified provenance without circular citation',!data.selfLinks&&data.source.includes('originally published 31 January 2026')&&data.source.includes('does not specify the measurement period or calculation method'),data.source);
 }
 const network=[];page.on('request',r=>{if(r.isNavigationRequest()||r.method()==='POST')network.push({url:r.url(),method:r.method()})});
 await page.route('**/api/contact',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(r.request().method()==='POST'?{success:true,receipt:'11111111-1111-4111-8111-111111111111'}:{token:'local-fixture-token'})}));
 await page.goto(url+'/contact?service=billing');await page.fill('#contact-name','TEST - ignore');await page.fill('#contact-email','preview@example.invalid');await page.getByRole('button',{name:'Send enquiry',exact:true}).click();
 await page.locator('#contact-success').waitFor({state:'visible'});
 check('contact submits only to same-origin API without field values in URLs',await page.locator('#contact-success').isVisible()&&network.filter(n=>n.method==='POST').length===1&&network.every(n=>!n.url.includes('preview%40')&&!n.url.includes('TEST%20')),network);
 check('safe static form method',await page.locator('#contact-form').getAttribute('method')==='post');
 await page.route('**/assets/contact.js',r=>r.abort());await page.goto(url+'/contact');
 check('blocked submit script keeps form unavailable',await page.locator('#contact-form').isHidden()&&await page.locator('#contact-fallback').isVisible());
 check('failure preserves direct contact routes',await page.locator('a[href="mailto:jovanie@focuscarellc.com"]').first().isVisible()&&await page.locator('a[href^="tel:"]').first().isVisible());
 await page.screenshot({path:join(root,'release-evidence/contact-script-failure-390.png'),fullPage:true});
 await page.unroute('**/assets/contact.js');await page.goto(url);await page.waitForFunction(()=>window.FocusCareHero?.animationReady);await page.evaluate(()=>FocusCareHero.pause());
 check('fully revealed reading interval',SWAP-(SETTLE+.55)>=2.7,{seconds:SWAP-(SETTLE+.55),loop:BEAT*6});
 for(let i=0;i<WF.length;i++)for(const u of [3.05,4.2,SWAP-.05]){
  const state=await page.evaluate(t=>{FocusCareHero.renderAt(t);const e=document.querySelector('.hx-note'),r=e.getBoundingClientRect(),clip=document.querySelector('.hx-clip').getBoundingClientRect();return{height:parseFloat(e.style.maxHeight),contentHeight:e.scrollHeight,bottom:r.bottom,clipBottom:clip.bottom,masks:[...document.querySelectorAll('.hx-flow .hx-car')].map(e=>e.style.clipPath)}},i*BEAT+u);
  check('readable outcome '+i+' '+u,state.height>=state.contentHeight-.1&&state.bottom<state.clipBottom&&state.masks.every(m=>!m),state);
 }
 await context.close();
 const nojs=await browser.newContext({javaScriptEnabled:false}),p=await nojs.newPage();await p.goto(url+'/contact');check('no-JS contact fallback',await p.locator('#contact-form').isHidden()&&await p.locator('#contact-fallback').isVisible());await nojs.close();
 check('no unexpected page errors',!result.errors.length,result.errors);
}catch(e){result.errors.push(e.stack)}finally{await browser.close();writeFileSync(join(root,'release-evidence/content-safety.json'),JSON.stringify(result,null,2),'utf8')}
console.log(JSON.stringify({checks:result.checks.length,failures:result.checks.filter(c=>!c.pass),errors:result.errors}));
if(result.errors.length||result.checks.some(c=>!c.pass))process.exitCode=1;
