import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {auditContent} from './service-area-content-rules.mjs';
const out='audit/service-area-content-20260917',origin='http://127.0.0.1:4215';
const before=JSON.parse(fs.readFileSync(out+'/browser.json','utf8'));
const expected=JSON.parse(fs.readFileSync(out+'/after.json','utf8'));
const backup=out+'/browser-initial-with-harness-errors.json';
if(fs.existsSync(backup))throw Error('Recheck already began; preserve original evidence.');
fs.copyFileSync(out+'/browser.json',backup);
const targets=[...new Set([...before.errors.map(e=>new URL(e.url).pathname),...before.pages.filter(r=>r.issues.length).map(r=>r.url)])];
const browser=await chromium.launch({headless:true});
const result={origin,at:new Date().toISOString(),probe:[],rows:[],errors:[],targets:targets.length};
const save=()=>fs.writeFileSync(out+'/browser-recheck.json',JSON.stringify(result,null,2));
async function context(guarded){
 const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await c.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
 if(guarded)await c.addInitScript(()=>{if(window.top!==window)return;try{localStorage.setItem('temporary123:emergency-dismissed-until-v1',String(Date.now()+86400000));}catch{}});
 else await c.addInitScript(()=>localStorage.setItem('temporary123:emergency-dismissed-until-v1',String(Date.now()+86400000)));
 return c;
}
try{
 for(const guarded of [false,true]){
  const c=await context(guarded),page=await c.newPage(),errors=[];
  page.on('pageerror',e=>errors.push({message:e.message,stack:e.stack}));
  await page.goto(origin+'/service-areas/alabama/north-alabama/',{waitUntil:'domcontentloaded'});
  await page.locator('iframe').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
  result.probe.push({guarded,errors,h1:await page.locator('main h1').innerText()});await c.close();
 }
 if(!result.probe[0].errors.some(e=>/localStorage/.test(e.message))||result.probe[1].errors.length)throw Error('Storage-test error attribution was not proved by controlled A/B.');
 const c=await context(true),page=await c.newPage();page.setDefaultTimeout(30000);
 page.on('pageerror',e=>result.errors.push({url:page.url(),message:e.message,stack:e.stack}));
 for(const url of targets){
  const base=expected.rows.find(r=>r.url===url&&!r.kind.endsWith('map'));if(!base)throw Error('Missing expected page '+url);
  try{
   const r=await page.goto(origin+url,{waitUntil:'domcontentloaded',timeout:45000});
   const actual=await page.evaluate(()=>{const n=s=>String(s||'').replace(/\s+/g,' ').trim(),q=s=>n(document.querySelector(s)?.textContent);const visible=s=>{const e=document.querySelector(s);return!!e&&e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';};return{h1:q('main h1'),intro:q('main [data-h1-intro]'),headingCount:document.querySelectorAll('main h1').length,headingVisible:visible('main h1'),leadVisible:visible('main [data-h1-intro]'),answer:q('.region-answer-heading p,.city-answer > div:first-child p'),primaryLinks:q('.region-service-links,.city-service-list'),secondarySummary:q('.supporting-rentals,.city-supporting'),metadataDescription:document.querySelector('meta[name=description]')?.getAttribute('content')||'',canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href')||'',robots:document.querySelector('meta[name=robots]')?.getAttribute('content')||''};});
   const issues=auditContent({...base,...actual});
   if(r.status()!==200)issues.push({code:'http',status:r.status()});
   if(actual.h1!==base.h1||actual.intro!==base.intro)issues.push({code:'rendered-content-drift'});
   if(!actual.headingVisible||!actual.leadVisible)issues.push({code:'invisible-heading-lead'});
   if(actual.canonical!==base.metadata.canonical||actual.robots!==base.metadata.robots)issues.push({code:'indexing-drift'});
   if(actual.metadataDescription!==base.metadata.description)issues.push({code:'metadata-drift'});
   result.rows.push({...actual,id:url,url,kind:base.kind,family:base.family,status:r.status(),issues});
  }catch(e){result.rows.push({url,issues:[{code:'unverified',message:e.message}]});}
  if(result.rows.length%25===0){save();console.log('Guarded rechecks: '+result.rows.length+'/'+targets.length);}
 }
 await c.close();
 const byUrl=new Map(result.rows.map(r=>[r.url,r]));
 const final={...before,pages:before.pages.map(r=>byUrl.get(r.url)||r),errors:result.errors,initialHarnessErrors:before.errors,recheckEvidence:'browser-recheck.json'};
 final.summary={...before.summary,at:new Date().toISOString(),pageFailures:final.pages.filter(r=>r.issues.length).length,browserErrors:result.errors.length,recheckedPages:result.rows.length,initialStorageSetupErrors:before.errors.length,storageSetupErrorAttribution:'Controlled unguarded/guarded iframe A/B; raw initial evidence preserved'};
 result.summary={recheckedPages:result.rows.length,failures:result.rows.filter(r=>r.issues.length).length,browserErrors:result.errors.length};
 save();fs.writeFileSync(out+'/browser.json',JSON.stringify(final,null,2));console.log(JSON.stringify(final.summary,null,2));
 if(final.summary.pageFailures||final.summary.browserErrors)process.exitCode=1;
}finally{save();await browser.close();}
