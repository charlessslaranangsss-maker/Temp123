import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { load } from 'cheerio';
import { contentFamily, auditContent, normalizeCopy as n } from './service-area-content-rules.mjs';
import { statePageByPath } from '../src/StateDetail.tsx';
import { regionPages } from '../src/regionGuides.tsx';
import { reviewedCityPages } from '../src/cityDirectory.ts';
const stage = process.argv[2] || 'after';
const out = 'audit/service-area-content-20260917';
fs.mkdirSync(out,{recursive:true});
const registry = JSON.parse(fs.readFileSync('audit/build-registry.json','utf8')).pages;
const routes = registry.map(r=>r.path).filter(p=>p.startsWith('/service-areas/'));
const expected = new Set(['/service-areas/',...Object.keys(statePageByPath),...regionPages.flatMap(g=>[g.path,g.path+'cities/']),...reviewedCityPages.map(c=>c.path)]);
const universeProblems = [...routes.filter(p=>!expected.has(p)),...[...expected].filter(p=>!routes.includes(p))];
const rows=[];
const fingerprint = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for(const url of routes) {
  const file=path.join('dist',url.slice(1),'index.html');
  if(!fs.existsSync(file)){universeProblems.push('Missing generated HTML: '+url);continue;}
  const $=load(fs.readFileSync(file,'utf8'));
  const h1=n($('main h1').first().text());
  const region=regionPages.find(g=>g.path===url), directory=regionPages.find(g=>g.path+'cities/'===url);
  const city=reviewedCityPages.find(c=>c.path===url), state=statePageByPath[url], place=region || directory;
  const location=state || (city ? city.name+', '+city.state : place ? (place.region.toLowerCase().endsWith(place.state.toLowerCase()) ? place.region : place.region+', '+place.state) : '');
  const scope=$('main').clone();
  scope.find('script,style,template,dialog,nav.breadcrumb').remove();
  const paragraphs=scope.find('p,h2,h3,figcaption').map((_,e)=>({tag:e.tagName,text:n($(e).text())})).get().filter(x=>x.text);
  const row={id:url,url,kind:state?'state':region?'region':directory?'directory':city?'city':'hub',location,state:state||place?.state||city?.state||'',h1,headingTag:'h1',headingCount:$('main h1').length,intro:n($('main [data-h1-intro]').first().text()),family:contentFamily(h1),answer:n($('.region-answer-heading p,.city-answer > div:first-child p').text()),primaryLinks:n($('.region-service-links,.city-service-list').text()),secondarySummary:n($('.supporting-rentals,.city-supporting').text()),focus:'',primarySummary:'',supportingCopy:paragraphs};
  row.galleries=scope.find('[data-location-gallery]').map((_,e)=>({title:$(e).attr('data-gallery-title'),copy:n($(e).text()),models:$(e).find('[data-carousel-slide]').map((_,s)=>$(s).attr('data-image-model')||'').get(),families:$(e).find('[data-carousel-slide]').map((_,s)=>$(s).attr('data-image-family')||'').get()})).get();
  row.metadata={title:$('title').text(),description:$('meta[name=description]').attr('content')||'',canonical:$('link[rel=canonical]').attr('href')||'',robots:$('meta[name=robots]').attr('content')||''};
  row.htmlSha256=fingerprint(file);
  row.metadataDescription=row.metadata.description;
  row.issues=auditContent(row);rows.push(row);
}
for(const [kind,url] of [['full-map','/service-areas/'],['compact-map','/']]) {
  const $=load(fs.readFileSync(path.join('dist',url.slice(1),'index.html'),'utf8'));
  const guides=load($('#map-state-guides').html()||'');
  for(const el of guides('[data-state-guide]').toArray()){
    const g=guides(el),state=g.attr('data-state-guide'),h1=n(g.attr('data-state-headline'));
    const gallery=$('template[data-state-gallery-template]').filter((_,e)=>$(e).attr('data-state-gallery-template')===state);
    const photo=load(gallery.html()||'');
    const row={id:kind+':'+state,url:url+'#state='+encodeURIComponent(state),kind,location:state,state,h1,headingTag:'h2',headingCount:1,intro:n(g.find('[data-guide-intro]').text()),family:contentFamily(h1),focus:kind==='full-map'?n(g.find('[data-guide-focus]').text()):'',primarySummary:kind==='full-map'?n(g.find('[data-guide-services]').text()):'',question:kind==='full-map'?n(g.find('[data-guide-question]').text()):'',supportingCopy:kind==='full-map'?g.find('p,h3,strong').map((_,e)=>({tag:e.tagName,text:n(guides(e).text())})).get():[],runtimeVerified:false};
    row.galleries=[{title:photo('[data-location-gallery]').attr('data-gallery-title'),copy:n(photo('body').text()),models:photo('[data-carousel-slide]').map((_,e)=>photo(e).attr('data-image-model')||'').get(),families:photo('[data-carousel-slide]').map((_,e)=>photo(e).attr('data-image-family')||'').get()}];
    row.issues=auditContent(row);rows.push(row);
  }
}
const counts={};for(const r of rows)for(const i of r.issues)counts[i.code]=(counts[i.code]||0)+1;
const homepage=load(fs.readFileSync('dist/index.html','utf8'));
const invariants={homepageH1:n(homepage('main h1').text()),routes:registry.map(r=>r.path).sort(),config:Object.fromEntries(['site.json','vercel.json','src/rentalHeadlines.ts','src/Home.tsx'].map(f=>[f,fingerprint(f)])),robots:fingerprint('dist/robots.txt'),sitemap:fingerprint('dist/sitemap.xml')};
const summary={at:new Date().toISOString(),stage,environment:'Fresh isolated local build; template modals until browser verification',urls:rows.filter(r=>!r.kind.endsWith('map')).length,modals:rows.filter(r=>r.kind.endsWith('map')).length,byKind:Object.fromEntries([...new Set(rows.map(r=>r.kind))].map(k=>[k,rows.filter(r=>r.kind===k).length])),presentationsWithIssues:rows.filter(r=>r.issues.length).length,issueInstances:rows.reduce((s,r)=>s+r.issues.length,0),counts,universeProblems};
fs.writeFileSync(out+'/'+stage+'.json',JSON.stringify({summary,invariants,rows},null,2));
const cols=['id','url','kind','location','h1','intro','metadataDescription','family','focus','primarySummary','answer','primaryLinks','secondarySummary','supportingCopy','galleries','issues'];
const cell=v=>'"'+String(typeof v==='object'?JSON.stringify(v):v??'').replaceAll('"','""')+'"';
fs.writeFileSync(out+'/'+stage+'.csv',cols.join(',')+'\n'+rows.map(r=>cols.map(c=>cell(r[c])).join(',')).join('\n'));
console.log(JSON.stringify(summary,null,2));
if(stage==='after' && (summary.issueInstances||universeProblems.length))process.exitCode=1;
