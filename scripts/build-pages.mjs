// Native Cloudflare Pages build: packaged HTML + approved assets + bundled advanced-mode worker.
// Starts from design:build outputs; never touches files outside the owned output directory.
import {readFileSync,writeFileSync,readdirSync,mkdirSync,copyFileSync,existsSync,rmSync,statSync,lstatSync} from 'node:fs';
import {resolve,dirname,join,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
const root=resolve(import.meta.dirname,'..'), pub=join(root,'public'), dist=join(root,'design/motion-led/dist');
const out=resolve(root,'.vercel/output/static');
const sha=b=>createHash('sha256').update(b).digest('hex');
// Containment check before any cleanup.
if(relative(root,out)!==['.vercel','output','static'].join(sep)||!out.startsWith(root+sep))throw Error('Refusing unexpected output path '+out);
for(const path of [join(root,'.vercel'),join(root,'.vercel/output'),out]) {
 if(existsSync(path)&&lstatSync(path).isSymbolicLink())throw Error('Refusing linked output path '+path);
}
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
const files=[];
const copy=(from,to)=>{const a=resolve(from),b=resolve(out,to);if(!b.startsWith(out+sep))throw Error('Escapes output: '+to);mkdirSync(dirname(b),{recursive:true});copyFileSync(a,b);files.push({path:to.split(sep).join('/'),source:relative(root,a).split(sep).join('/'),sha256:sha(readFileSync(b))})};
const tree=(from,to)=>{for(const d of readdirSync(from,{withFileTypes:true})){const a=join(from,d.name),b=join(to,d.name);if(d.isDirectory())tree(a,b);else if(d.isFile())copy(a,b)}};
const release=JSON.parse(readFileSync(join(root,'design/generated/release-manifest.json'),'utf8'));
// Packaged HTML exactly as design:build wrote it; verify against the release manifest.
for(const p of release.pages){
 const src=join(pub,p.path),buf=readFileSync(src);
 if(p.sha256&&sha(buf)!==p.sha256)throw Error('Packaged HTML hash mismatch: '+p.path);
 copy(src,p.path);
}
tree(join(dist,'assets'),'assets');tree(join(dist,'licenses'),'licenses');
for(const f of['assets/social-card.png'])if(!existsSync(join(out,f))&&existsSync(join(pub,f)))copy(join(pub,f),f);
for(const f of['robots.txt','sitemap.xml','_headers','favicon.ico','favicon.svg','favicon-16x16.png','favicon-32x32.png','favicon-96x96.png','apple-touch-icon.png','android-chrome-192x192.png','android-chrome-512x512.png'])if(existsSync(join(pub,f)))copy(join(pub,f),f);
await build({entryPoints:[join(root,'server/pages-worker.ts')],outfile:join(out,'_worker.js'),bundle:true,format:'esm',platform:'neutral',target:'es2022',minify:false,legalComments:'none',logLevel:'warning'});
files.push({path:'_worker.js',source:'server/pages-worker.ts',sha256:sha(readFileSync(join(out,'_worker.js')))});
writeFileSync(join(out,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]},null,2));
const sources=['server/pages-worker.ts','server/compliance-kit.ts','design/generated/release-manifest.json','design/generated/not-found.json','scripts/build-pages.mjs'].map(f=>({path:f,sha256:sha(readFileSync(join(root,f)))}));
writeFileSync(join(out,'.build-manifest.json'),JSON.stringify({createdUTC:new Date().toISOString(),preview:release.preview,sources,files},null,2));
console.log(JSON.stringify({output:relative(root,out),files:files.length,worker:statSync(join(out,'_worker.js')).size}));
