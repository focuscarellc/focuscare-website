// Local workerd/D1 only. Every outbound request is intercepted; no live mail.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createRequire} from 'node:module';
import {createHmac,createHash,randomUUID} from 'node:crypto';
import {build} from 'esbuild';
const root=resolve(import.meta.dirname,'..'),evidence=resolve(process.env.EVIDENCE_DIR||join(root,'release-evidence/resource'));
mkdirSync(evidence,{recursive:true});
const {Miniflare,convertV4MiniflareOptions}=createRequire(import.meta.url)(process.env.MINIFLARE_MODULE||'miniflare');
const secret='local-fixture-resource-no-real-secret',checks=[];
const check=(name,pass)=>{checks.push({name,pass:!!pass});if(!pass)throw Error(name)};
const token=(age=5000,suffix='|resource-request-v1')=>{const t=`${Date.now()-age}.${randomUUID()}`;return t+'.'+createHmac('sha256',secret+suffix).update('https://focuscarellc.com|'+t).digest('hex')};
const bundle=await build({stdin:{contents:`import {handleResource,retryResourceRequests} from './server/resource.ts';export default {async fetch(req,env){if(new URL(req.url).pathname==='/__retry'){await retryResourceRequests(env);return new Response('ok')}const pending=[];let committed=false;const faultyDb={prepare(sql){if(committed&&sql.startsWith('SELECT id, payload_hash'))throw Error('local post-commit read outage');return env.CONTACT_DB.prepare(sql)},async batch(statements){const result=await env.CONTACT_DB.batch(statements);committed=true;return result}};const requestEnv=new URL(req.url).pathname==='/__postcommit'?{...env,CONTACT_DB:faultyDb}:env;const res=await handleResource(req,requestEnv,{waitUntil:p=>pending.push(p)});await Promise.allSettled(pending);return res}}`,resolveDir:root},bundle:true,write:false,format:'esm',platform:'neutral',target:'es2022'});
let statusForKind={checklist:200,owner:200},sends=[];
const options={modules:true,script:bundle.outputFiles[0].text,compatibilityDate:'2026-11-12',compatibilityFlags:['nodejs_compat'],d1Databases:['CONTACT_DB'],bindings:{RESEND_API_KEY:'local-fixture-only',CONTACT_FORM_SECRET:secret},cf:false,
outboundService:async req=>{if(req.url!=='https://api.resend.com/emails'||req.method!=='POST')throw Error('Unexpected outbound blocked');const body=await req.json(),key=req.headers.get('idempotency-key');const kind=key.endsWith('/owner')?'owner':'checklist';sends.push({key,body,kind});return Response.json({id:randomUUID()},{status:statusForKind[kind]})}};
const mf=new Miniflare(convertV4MiniflareOptions?convertV4MiniflareOptions(options):options),db=await mf.getD1Database('CONTACT_DB');
for(const f of ['contact-schema.sql','resource-schema.sql'])await db.batch(readFileSync(join(root,'server',f),'utf8').split(';').map(s=>s.trim()).filter(Boolean).map(sql=>db.prepare(sql)));
const count=async table=>(await db.prepare('SELECT count(*) n FROM '+table).first()).n;
const entry=(extra={})=>({email:'jovanie+TEST-ignore-resource@focuscarellc.com',organisation:'TEST - ignore',source:'/resources/inspection-readiness-checklist',noticeVersion:'checklist-and-one-followup-v1',token:token(),...extra});
let ip=0;
const post=async(data,headers={},host='focuscarellc.com',path='/api/resource-request')=>{const r=await mf.dispatchFetch('https://'+host+path,{method:'POST',headers:{Origin:'https://'+host,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.'+(++ip),...headers},body:typeof data==='string'?data:JSON.stringify(data)});return{status:r.status,data:await r.json(),requestId:typeof data==='object'?data.token?.split('.')[1]:undefined}};
try{
 let r=await mf.dispatchFetch('https://focuscarellc.com/api/resource-request');check('signed uncached challenge',r.status===200&&r.headers.get('cache-control')==='no-store'&&typeof(await r.json()).token==='string');
 for(const [name,data,headers,status]of[
 ['malformed JSON','{',{},400],['array',[],{},400],['invalid email',entry({email:'no'}),{},400],['email injection',entry({email:'a@example.com\r\nBcc:x@example.com'}),{},400],['long organisation',entry({organisation:'x'.repeat(121)}),{},400],['organisation controls',entry({organisation:'a\nb'}),{},400],['wrong source',entry({source:'https://evil.invalid'}),{},400],['missing notice',entry({noticeVersion:''}),{},400],['honeypot',entry({website:'spam'}),{},400],['fast token',entry({token:token(0)}),{},429],['expired token',entry({token:token(86401000)}),{},400],['forged token',entry({token:token()+'0'}),{},400],['contact token rejected',entry({token:token(5000,'')}),{},400],['cross origin',entry(),{Origin:'https://evil.invalid'},403],['missing origin',entry(),{Origin:''},403],['cross-site fetch',entry(),{'Sec-Fetch-Site':'cross-site'},403],['wrong media type',entry(),{'Content-Type':'text/plain'},415],['large body',entry({organisation:'x'.repeat(5000)}),{},413]])check(name,(await post(data,headers)).status===status);
 check('rejections create no resource/enquiry/email',await count('resource_requests')===0&&await count('contact_enquiries')===0&&sends.length===0);
 check('preview cannot submit',(await post(entry(),{},'test.pages.dev')).status===403);
 const accepted=entry();r=await post(accepted,{Cookie:'focuscare.analytics-consent.v1=denied',DNT:'1','Sec-GPC':'1'});
 check('cookie-declined durable request with two outbox rows',r.status===200&&await count('resource_requests')===1&&await count('resource_deliveries')===2&&await count('contact_enquiries')===0);
 const receipt=r.requestId;let row=await db.prepare('SELECT * FROM resource_requests WHERE id=?').bind(receipt).first();
 check('test/internal and notice recorded',row.is_test===1&&row.is_internal===1&&row.notice_version===accepted.noticeVersion);
 check('exactly two accepted emails, no list calls',sends.length===2&&sends[0].body.to[0]===accepted.email.toLowerCase()&&sends[1].body.to[0]==='jovanie@focuscarellc.com');
 const pdf=JSON.parse(readFileSync(join(root,'server/inspection-checklist.generated.json')));
 check('requester receives exact PDF bytes',createHash('sha256').update(Buffer.from(sends[0].body.attachments[0].content,'base64')).digest('hex')===pdf.sha256&&!sends[1].body.attachments);
 check('owner notice limits follow-up',sends[1].body.text.includes('at most ONE personal follow-up')&&sends[1].body.text.includes('confirm that the checklist was delivered')&&sends[1].body.text.includes('exclude from counts and do not follow up'));
 r=await post(accepted);check('same-token replay is neutral without sends',r.status===200&&JSON.stringify(r.data)==='{"success":true}'&&sends.length===2);
 check('changed payload same token rejected',(await post({...accepted,organisation:'Changed'})).status===409);
 r=await post(entry());check('same email new token never invents a receipt or sends again',r.status===200&&JSON.stringify(r.data)==='{"success":true}'&&await count('resource_requests')===1&&sends.length===2);
 const race=entry({email:'race@example.invalid',organisation:'Fixture Care'});const before=sends.length;await Promise.all(Array.from({length:8},()=>post(race)));
 check('concurrent accepted requests share row and leased deliveries',await count('resource_requests')===2&&sends.length===before+2);
 statusForKind.checklist=503;const q=await post(entry({email:'outage@example.invalid',organisation:'Fixture Care'}));
 let jobs=await db.prepare('SELECT * FROM resource_deliveries WHERE request_id=? ORDER BY kind').bind(q.requestId).all();
 check('PDF outage keeps request, owner notice independently sent',q.status===200&&jobs.results[0].delivery_status==='pending'&&jobs.results[1].delivery_status==='sent');
 const firstKey=sends.find(s=>s.key.includes(q.requestId)&&s.kind==='checklist').key;
 await db.prepare("UPDATE resource_deliveries SET next_attempt_at='2000-01-01' WHERE request_id=?").bind(q.requestId).run();statusForKind.checklist=200;
 const sendBefore=sends.length;await mf.dispatchFetch('https://focuscarellc.com/__retry');
 jobs=await db.prepare('SELECT * FROM resource_deliveries WHERE request_id=?').bind(q.requestId).all();
 check('retry sends only failed PDF with stable idempotency key',sends.length===sendBefore+1&&sends.at(-1).key===firstKey&&jobs.results.every(j=>j.delivery_status==='sent'));
 statusForKind.owner=422;r=await post(entry({email:'permanent@example.invalid',organisation:'Fixture Care'}));
 row=await db.prepare("SELECT * FROM resource_deliveries WHERE request_id=? AND kind='owner'").bind(r.requestId).first();check('permanent owner failure is durable',row.delivery_status==='failed'&&row.last_error_code==='http_422');statusForKind.owner=200;
 const limits=[];for(let n=0;n<6;n++)limits.push(await post(entry({email:`rate${n}@example.invalid`,organisation:'Fixture Care'}),{'CF-Connecting-IP':'198.51.100.10'}));
 check('atomic per-network rate limit',limits.slice(0,5).every(r=>r.status===200)&&limits[5].status===429);
 await db.prepare("UPDATE resource_requests SET created_at='2000-01-01' WHERE id=?").bind(q.requestId).run();await db.prepare("UPDATE resource_deliveries SET delivery_status='pending',next_attempt_at='2000-01-01' WHERE request_id=?").bind(q.requestId).run();
 const beforeExpiry=sends.length;await mf.dispatchFetch('https://focuscarellc.com/__retry');check('expired idempotency window never resends',sends.length===beforeExpiry&&(await db.prepare("SELECT count(*) n FROM resource_deliveries WHERE request_id=? AND delivery_status='failed'").bind(q.requestId).first()).n===2);
 const partial=entry({email:'postcommit@example.invalid',organisation:'Fixture Care'}),priorRows=await count('resource_requests');
 r=await post(partial,{},'focuscarellc.com','/__postcommit');
 check('post-commit read failure reports uncertainty and keeps durable request',r.status===503&&r.data.error.includes('could not confirm')&&!r.data.error.includes('not been sent')&&await count('resource_requests')===priorRows+1);
 await mf.dispatchFetch('https://focuscarellc.com/__retry');
 check('post-commit uncertain acknowledgement still has retriable outbox',(await db.prepare("SELECT count(*) n FROM resource_deliveries WHERE request_id=? AND delivery_status='sent'").bind(r.requestId).first()).n===2);
 await db.prepare('DROP TABLE resource_deliveries').run();const countBefore=await count('resource_requests');r=await post(entry({email:'rollback@example.invalid'}));
 check('outbox failure rolls back acceptance atomically',r.status===503&&!r.data.success&&await count('resource_requests')===countBefore);
}catch(e){checks.push({name:'runtime error',pass:false,error:e.stack})}
finally{await mf.dispose();const report={atUTC:new Date().toISOString(),runtime:'workerd/local D1/outbound mock only',checks,failures:checks.filter(x=>!x.pass)};writeFileSync(join(evidence,'resource-runtime-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks:checks.length,failures:report.failures}));if(report.failures.length)process.exitCode=1}
