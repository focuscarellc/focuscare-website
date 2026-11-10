import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {gunzipSync} from 'node:zlib';
const root=resolve(import.meta.dirname,'..'),calls=[],checks=[];
let reject=false;
const original=globalThis.fetch;
globalThis.fetch=async(url,init)=>{if(reject)throw Error('Simulated vendor outage');const req=url instanceof Request?url:new Request(url,init);let bytes=Buffer.from(await req.arrayBuffer());if(bytes[0]===31&&bytes[1]===139)bytes=gunzipSync(bytes);calls.push({url:req.url,body:JSON.parse(bytes.toString())});return new Response('{"status":1}',{status:200,headers:{'Content-Type':'application/json'}})};
try{
 const source=readFileSync(resolve(root,'.vercel/output/static/_worker.js'),'utf8');
 mkdirSync(resolve(root,'release-evidence/posthog'),{recursive:true});const testModule=resolve(root,'release-evidence/posthog/worker-test.mjs');writeFileSync(testModule,source);
 const {default:worker}=await import(pathToFileURL(testModule));
 const env={POSTHOG_PROJECT_TOKEN:'phc_test_only_not_a_real_project',POSTHOG_HOST:'https://us.i.posthog.com'};
 async function request(headers={},config=env){const pending=[];const response=await worker.fetch(new Request('https://focuscarellc.com/api/compliance-kit',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify({email:'PRIVATE_API_EMAIL@example.invalid',name:'PRIVATE_API_NAME'})}),config,{waitUntil:p=>pending.push(p)});const data=await response.json();await Promise.allSettled(pending);return{status:response.status,data}}
 const check=(name,pass)=>checks.push({name,pass:!!pass});
 await request();check('no consent means no server analytics',calls.length===0);
 await request({'X-FocusCare-Analytics-Consent':'granted','DNT':'1'});check('DNT prevents server analytics',calls.length===0);
 await request({'X-FocusCare-Analytics-Consent':'granted'},{});check('missing config preserves API',calls.length===0);
 const normal=await request({'X-FocusCare-Analytics-Consent':'granted'});
 const serialized=JSON.stringify(calls);check('server outcome captured',serialized.includes('checklist request completed'));
 check('API fields excluded',!serialized.includes('PRIVATE_API_EMAIL')&&!serialized.includes('PRIVATE_API_NAME'));
 check('API delivery claims retained',normal.status===200&&normal.data.captureStatus==='not-configured'&&normal.data.message.includes('has not sent an email'));
 reject=true;const outage=await request({'X-FocusCare-Analytics-Consent':'granted'});check('analytics outage cannot fail API',outage.status===200);
 const report={atUTC:new Date().toISOString(),checks,failures:checks.filter(c=>!c.pass)};mkdirSync(resolve(root,'release-evidence/posthog'),{recursive:true});writeFileSync(resolve(root,'release-evidence/posthog/server-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(report.failures.length)process.exitCode=1;
}finally{globalThis.fetch=original}
