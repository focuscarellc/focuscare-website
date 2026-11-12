// Run after pages:build with dummy PostHog env values. All network calls are intercepted.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public'),out=path.resolve(process.env.EVIDENCE_DIR||path.join(root,'release-evidence/posthog'));
fs.mkdirSync(out,{recursive:true});
const release=JSON.parse(fs.readFileSync(path.join(root,'design/generated/release-manifest.json')));
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png'};
const checks=[],errors=[],batches=[];let sends=0;
const check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(detail?{detail}:{})});
const decode=req=>{let b=req.postDataBuffer();if(!b)return[];if(b[0]===31&&b[1]===139)b=zlib.gunzipSync(b);let s=b.toString();if(s.startsWith('data='))s=Buffer.from(new URLSearchParams(s).get('data'),'base64').toString();const d=JSON.parse(s);return Array.isArray(d)?d:d.batch||[d];};
async function context(browser,{privacy,denySDK,host='focuscarellc.com'}={}){
 const ctx=await browser.newContext({viewport:{width:390,height:844},userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36'});
 if(privacy)await ctx.addInitScript(key=>Object.defineProperty(navigator,key,{get:()=>key==='doNotTrack'?'1':true}),privacy);
 await ctx.route('**/*',async route=>{const req=route.request(),u=new URL(req.url());
  if(u.hostname==='us.i.posthog.com'){
   if(req.method()!=='OPTIONS'){sends++;try{batches.push(...decode(req));}catch(e){errors.push('capture decode: '+e.message)}}
   await route.fulfill({status:req.method()==='OPTIONS'?204:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*'},body:req.method()==='OPTIONS'?'':JSON.stringify({status:1})});return;
  }
  if(u.hostname!==host){await route.abort();return}
  if(u.pathname==='/api/contact'){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(req.method()==='POST'?{success:true,receipt:'11111111-1111-4111-8111-111111111111'}:{token:'local-fixture-token'})});return}
  if(['/assets/contact.js','/assets/analytics.js'].includes(u.pathname)&&!u.search){await route.fulfill({status:200,contentType:'application/javascript',body:'throw Error("Stale unversioned asset")'});return}
  if(denySDK&&u.pathname.startsWith('/assets/analytics-analytics-sdk-')){await route.fulfill({status:503,body:'Unavailable'});return}
  const record=release.pages.find(p=>p.route===u.pathname);const file=path.resolve(pub,record?.path||u.pathname.slice(1));
  if(!file.startsWith(pub+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){await route.fulfill({status:404,body:'Not found'});return}
  await route.fulfill({status:record?.status||200,contentType:types[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
 });
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));return{ctx,p};
}
async function until(predicate,ms=8000){const start=Date.now();while(!predicate()&&Date.now()-start<ms)await new Promise(r=>setTimeout(r,100));return predicate()}
(async()=>{const b=await chromium.launch({channel:'chrome'});try{
 const {ctx,p}=await context(b);
 await p.goto('https://focuscarellc.com/contact?service=billing&email=PRIVATE_QUERY&analytics_test=1#PRIVATE_FRAGMENT');
 check('contact initializes despite stale unversioned assets',await p.locator('#contact-form').isVisible());
 await p.waitForTimeout(700);check('no collection before consent',sends===0);check('SDK deferred before consent',!(await p.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.includes('analytics-analytics-sdk-')))));
 check('consent notice visible',await p.locator('.analytics-notice').isVisible());
 await p.setViewportSize({width:320,height:844});check('notice reflows at 320',await p.evaluate(()=>{const r=document.querySelector('.analytics-notice').getBoundingClientRect();return r.x>=0&&r.right<=innerWidth}));
 await p.screenshot({path:path.join(out,'consent-320.png')});
 await p.locator('[data-analytics-choice=granted]').click();
 check('pageview after consent',await until(()=>batches.some(e=>e.event==='$pageview')));
 await p.locator('#contact-name').fill('PRIVATE_NAME');await p.locator('#contact-email').fill('private-value@example.invalid');await p.locator('#contact-message').fill('PRIVATE_CARE_MESSAGE');
 await p.locator('#contact-form button[type=submit]').click();
 check('accepted enquiry captured',await until(()=>batches.some(e=>e.event==='contact enquiry submitted')));
 const enquiry=batches.find(e=>e.event==='contact enquiry submitted');check('only service context in enquiry event',enquiry?.properties?.service==='billing');
 const encoded=JSON.stringify(batches);check('no form/query/fragment values in capture',!['PRIVATE_NAME','private-value@example.invalid','PRIVATE_CARE_MESSAGE','PRIVATE_QUERY','PRIVATE_FRAGMENT'].some(v=>encoded.includes(v)));
 check('URL stripped to public path',batches.filter(e=>e.event==='$pageview').every(e=>e.properties.$current_url==='https://focuscarellc.com/contact'));
 check('person profiles disabled',batches.every(e=>e.properties.$process_person_profile===false));
 check('cookie isolated from SaaS',!(await ctx.cookies()).some(c=>c.domain==='.focuscarellc.com'));
 const count=sends;await p.locator('.analytics-preferences').click();await p.locator('[data-analytics-choice=denied]').click();await p.evaluate(()=>window.FocusCareAnalytics.capture('contact CTA clicked',{service:'billing'}));await p.waitForTimeout(3500);check('revoked consent stops collection',sends===count);
 await p.reload();check('decline remembered',!(await p.locator('.analytics-notice').isVisible()));
 await p.locator('.analytics-preferences').click();await p.locator('[data-analytics-choice=granted]').click();check('consent can be restored',await until(()=>sends>count));await ctx.close();
 for(const privacy of ['doNotTrack','globalPrivacyControl']){const baseline=sends;const {ctx,p}=await context(b,{privacy});await p.goto('https://focuscarellc.com/');await p.waitForTimeout(1000);check(privacy+' disables analytics',sends===baseline&&!(await p.locator('.analytics-notice').isVisible()));await ctx.close()}
 {const baseline=sends;const {ctx,p}=await context(b,{denySDK:true});await p.goto('https://focuscarellc.com/');await p.locator('[data-analytics-choice=granted]').click();await p.waitForTimeout(500);check('SDK failure preserves site',await p.locator('h1').isVisible()&&sends===baseline);await ctx.close()}
 {const baseline=sends;const {ctx,p}=await context(b,{host:'review.pages.dev'});await p.goto('https://review.pages.dev/');await p.waitForTimeout(700);check('preview traffic excluded',sends===baseline&&await p.locator('.analytics-notice').count()===0);await ctx.close()}
 check('browser errors',errors.length===0,errors);
 const result={atUTC:new Date().toISOString(),browser:b.version(),captureEvents:batches.map(e=>e.event),checks,failures:checks.filter(c=>!c.pass),errors};fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({checks:checks.length,failures:result.failures,events:result.captureEvents,errors}));if(result.failures.length)process.exitCode=1;
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
