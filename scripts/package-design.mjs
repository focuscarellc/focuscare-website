// Publish only generated, reviewed marketing pages. Preserve the Next API/deployment.
import {readFileSync,writeFileSync,readdirSync,mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {resolve,dirname,join,posix} from 'node:path';
import {createHash} from 'node:crypto';
import {assertCleanText} from '../design/motion-led/src/text.mjs';
const root=resolve(import.meta.dirname,'..'), dist=join(root,'design/motion-led/dist'), pub=join(root,'public');
const origin='https://focuscarellc.com', preview=process.env.SITE_PREVIEW==='1';
const analyticsToken=process.env.POSTHOG_PROJECT_TOKEN||'',analyticsHost=process.env.POSTHOG_HOST||'';
const analyticsEnabled=!!analyticsToken&&!!analyticsHost;
if(!analyticsEnabled&&process.env.NODE_ENV!=='production')console.warn('POSTHOG_PROJECT_TOKEN and POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This warning stops appearing once configured.');
const attr=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const analyticsTags=route=>analyticsEnabled&&route!='/404'?`<link rel="stylesheet" href="/assets/analytics.css"><script type="module" src="/assets/analytics.js?v=${sha(readFileSync(join(dist,'assets/analytics.js'))).slice(0,12)}" data-focuscare-analytics data-project-token="${attr(analyticsToken)}" data-api-host="${attr(analyticsHost)}" data-route="${attr(route)}"></script>`:'';
const manifest=JSON.parse(readFileSync(join(dist,'route-manifest.json'),'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const out=(file,data)=>{assertCleanText(data,file);const p=join(pub,file);mkdirSync(dirname(p),{recursive:true});writeFileSync(p,data,'utf8')};
function copyTree(from,to){mkdirSync(to,{recursive:true});for(const d of readdirSync(from,{withFileTypes:true})){const a=join(from,d.name),b=join(to,d.name);if(d.isDirectory())copyTree(a,b);else copyFileSync(a,b)}}
copyTree(join(dist,'assets'),join(pub,'assets'));copyTree(join(dist,'licenses'),join(pub,'licenses'));
const routes=[],records=[];
let notFoundHtml='';
for(const p of manifest.pages){
 if(['/resources','/testimonials'].includes(p.route))continue;
 let html=readFileSync(join(dist,p.path),'utf8');
 // Resolve review-file relative URLs into clean site URLs before publishing.
 html=html.replace(/\b(href|src|srcset|data-assets|data-motion)="([^"]*)"/g,(all,attr,val)=>{
  if(attr==='srcset')return `${attr}="${val.split(',').map(x=>{const [u,...rest]=x.trim().split(/\s+/);return normalize(u,p.path)+' '+rest.join(' ')}).join(', ')}"`;
  if(/^(?:https?:|mailto:|tel:|#|data:)/.test(val))return all;
  return `${attr}="${normalize(val,p.path)}"`;
 });
 const indexed=!preview&&p.route!='/404';
 html=html.replace('content="noindex,follow"',`content="${indexed?'index,follow':'noindex,follow'}"`)
  .replace('<meta name="twitter:card" content="summary">','<meta name="twitter:card" content="summary_large_image">')
  .replace('</head>',`<meta property="og:image" content="${origin}/assets/social-card.png"><meta property="og:image:alt" content="Focus Care: Less paperwork. More time for care."><meta name="twitter:image" content="${origin}/assets/social-card.png"></head>`);
 if(/(?:undefined|Private migration review|Design proposal)/.test(html))throw Error('Unresolved review copy in '+p.route);
 if(p.route==='/404'){
  html=html.replace(/<link rel="canonical"[^>]*>/,'').replace(/<meta property="og:url"[^>]*>/,'').replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,'');
  notFoundHtml=html;
 }
 if(analyticsEnabled&&p.route==='/privacy')html=html.replace('</article>','<section id="website-analytics"><h2>Website analytics</h2><p>With your permission, we use PostHog to measure visits and interest in our services. We do not send contact-form contents or record sessions. You can change your choice using Analytics preferences in the footer.</p></section></article>');
 html=html.replace('</head>',analyticsTags(p.route)+'</head>');
 const file='redesign/'+p.path;out(file,html);
 routes.push(p.route==='/404'?{source:'/404',destination:'/__focuscare_not_found'}:{source:p.route,destination:'/'+file});
 records.push({...p,path:file,status:p.route==='/404'?404:200,sha256:sha(html),bytes:Buffer.byteLength(html),indexed});
}
function normalize(u,page){
 if(u.startsWith('/'))return u.replace(/\/index\.html(?=[?#]|$)/,'')||'/';
 const abs=posix.normalize(posix.join('/',posix.dirname(page),u));
 return abs.replace(/\/index\.html(?=[?#]|$)/,'').replace(/^index\.html(?=[?#]|$)/,'/')||'/';
}
// Previously published campaign destinations stay useful without claiming a subscription or email delivery.
const base=readFileSync(join(pub,'redesign/contact/index.html'),'utf8');
for(const [route,title,description,body]of[
 ['/compliance-kit','6400 Self-Inspection Checklist','Get the published checklist and organize your follow-up.','<p>Use the checklist to review required records, note missing items and assign follow-up.</p><ul><li>Review documentation</li><li>Track what needs attention</li><li>Keep staff responsible for the final review</li></ul><div class="actions"><a class="button" href="https://focuscarellc.gumroad.com/l/free-inspection-checklist">Open the checklist</a><a href="/contact?service=compliance">Discuss compliance workflows</a></div><p class="small">The checklist opens on Gumroad. Its download and privacy terms apply. This website does not send a download email.</p>'],
 ['/newsletter','Keep up with Focus Care','Browse our latest guides and articles for care-provider teams.','<p>Read practical guidance on records, training, billing and everyday workflows.</p><div class="actions"><a class="button" href="/blog">Browse resources</a><a href="mailto:info@focuscarellc.com?subject=Focus%20Care%20updates">Ask about updates</a></div>']
]){
 let html=base.replace(/<main class="shell" id="main" tabindex="-1">[\s\S]*?<\/main>/,`<main class="shell" id="main" tabindex="-1"><section class="page-intro"><h1>${title}</h1><p>${description}</p></section><section class="prose">${body}</section><section class="cta"><div><h2>Which workflow would you fix first?</h2></div><a class="button" href="/contact">Talk to Focus Care</a></section></main>`)
 .replace(/<title>[^<]*<\/title>/,`<title>${title} | Focus Care</title>`).replace(/content="Contact Focus Care[^"\n]*"/g,`content="${description}"`).replaceAll('https://focuscarellc.com/contact',origin+route).replace('"name":"Contact Focus Care | Discuss a workflow"',`"name":${JSON.stringify(title+' | Focus Care')}`).replace(/<script src="\/assets\/contact.js" defer><\/script>/,'').replace(/ aria-current="page"/g,'');
 // These campaign pages derive from Contact; keep their page type and tracking path distinct.
 html=html.replace('"@type":"ContactPage"','"@type":"WebPage"').replace('data-route="/contact"',`data-route="${route}"`);
 const path='redesign'+route+'/index.html';out(path,html);routes.push({source:route,destination:'/'+path});records.push({route,path,title,description,indexed:!preview,bytes:Buffer.byteLength(html),sha256:sha(html)});
}
out('robots.txt',preview?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nDisallow: /redesign/\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);
out('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+records.filter(p=>p.indexed).map(p=>`<url><loc>${origin}${p.route==='/'?'/':p.route}</loc></url>`).join('')+'</urlset>');
mkdirSync(join(root,'design/generated'),{recursive:true});
if(!notFoundHtml)throw Error('Missing branded 404 composition');
writeFileSync(join(root,'design/generated/not-found.json'),JSON.stringify(notFoundHtml),'utf8');
writeFileSync(join(root,'design/generated/routes.json'),JSON.stringify(routes,null,2));
writeFileSync(join(root,'design/generated/release-manifest.json'),JSON.stringify({createdUTC:new Date().toISOString(),preview,origin,pages:records,redirects:[{from:'/resources',to:'/blog'},{from:'/testimonials',to:'/case-studies'},{from:'/get-started',to:'/contact'}]},null,2));
console.log(JSON.stringify({packaged:records.length,preview,framework:'Next 15 beforeFiles rewrites; existing API retained'}));
