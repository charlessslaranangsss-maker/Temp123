import fs from 'node:fs';
import { chromium } from '@playwright/test';
import { auditContent } from './service-area-content-rules.mjs';
const origin=process.env.CONTENT_REVIEW_URL || 'http://127.0.0.1:4215';
const out='audit/service-area-content-20260917';
const audit=JSON.parse(fs.readFileSync(out+'/after.json','utf8'));
const evidence={at:new Date().toISOString(),origin,pages:[],modals:[],samples:[],errors:[]};
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await context.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
await context.addInitScript(()=>{
  if(window.top!==window)return;
  try{localStorage.setItem('temporary123:emergency-dismissed-until-v1',String(Date.now()+86400000));}catch{}
});
const page=await context.newPage();
page.setDefaultTimeout(12000);
const save=()=>fs.writeFileSync(out+'/browser-progress.json',JSON.stringify(evidence,null,2));
page.on('pageerror',e=>evidence.errors.push({url:page.url(),message:e.message}));
async function readPage(expected){
  const actual=await page.evaluate(()=>{
    const n=t=>String(t||'').replace(/\s+/g,' ').trim();
    const q=s=>n(document.querySelector(s)?.textContent);
    const visible=s=>{const e=document.querySelector(s);return Boolean(e&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');};
    return {h1:q('main h1'),intro:q('main [data-h1-intro]'),headingVisible:visible('main h1'),leadVisible:visible('main [data-h1-intro]'),headingCount:document.querySelectorAll('main h1').length,answer:q('.region-answer-heading p,.city-answer > div:first-child p'),primaryLinks:q('.region-service-links,.city-service-list'),secondarySummary:q('.supporting-rentals,.city-supporting'),canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href')||'',robots:document.querySelector('meta[name=robots]')?.getAttribute('content')||''};
  });
  actual.metadataDescription=await page.locator('meta[name="description"]').getAttribute('content') || '';
  const issues=auditContent({...expected,...actual});
  if(!actual.headingVisible||!actual.leadVisible)issues.push({code:'invisible-heading-or-lead'});
  if(actual.h1!==expected.h1)issues.push({code:'browser-heading-drift'});
  if(actual.intro!==expected.intro)issues.push({code:'browser-intro-drift'});
  if(actual.canonical!==expected.metadata.canonical || actual.robots!==expected.metadata.robots)issues.push({code:'browser-indexing-drift'});
  return {...actual,id:expected.id,url:expected.url,kind:expected.kind,family:expected.family,issues};
}
for(const expected of audit.rows.filter(r=>!r.kind.endsWith('map'))){
  try {const response=await page.goto(origin+expected.url,{waitUntil:'domcontentloaded',timeout:30000});const result=await readPage(expected);result.status=response.status();if(result.status!==200)result.issues.push({code:'http',status:result.status});evidence.pages.push(result);}
  catch(e){evidence.pages.push({url:expected.url,issues:[{code:'unverified',message:e.message}]});}
  if(evidence.pages.length%25===0){save();console.log('Base pages checked: '+evidence.pages.length);}
}
for(const width of [1440,390]) for(const [kind,url] of [['full-map','/service-areas/'],['compact-map','/']]){
  await page.setViewportSize({width,height:1000});
  await page.goto(origin+url,{waitUntil:'domcontentloaded'});
  for(const expected of audit.rows.filter(r=>r.kind===kind)){
    try{
      await page.locator('[data-state-picker]').selectOption(expected.state);
      await page.waitForFunction(title=>document.querySelector('#state-services-dialog')?.open && document.querySelector('#state-services-dialog [data-state-headline]')?.textContent?.trim()===title,expected.h1);
      const actual=await page.locator('#state-services-dialog').evaluate(dialog=>{
        const n=t=>String(t||'').replace(/\s+/g,' ').trim(),q=s=>n(dialog.querySelector(s)?.textContent);
        return {h1:q('[data-state-headline]'),headingCount:dialog.querySelectorAll('#state-services-title').length,intro:q('#state-services-intro'),focus:q('[data-state-focus]'),primarySummary:q('[data-state-services-copy]'),question:q('[data-state-question]'),supportingCopy:n(dialog.textContent),families:[...dialog.querySelectorAll('[data-image-family]')].map(e=>e.getAttribute('data-image-family'))};
      });
      const issues=auditContent({...expected,...actual});
      for(const key of ['h1','intro','focus','primarySummary']) if(actual[key]!==expected[key])issues.push({code:'modal-render-drift',field:key});
      const families=expected.galleries.flatMap(g=>g.families);
      if(JSON.stringify(actual.families)!==JSON.stringify(families))issues.push({code:'modal-gallery-drift'});
      evidence.modals.push({id:expected.id,state:expected.state,kind,width,...actual,issues});
      if(['Virginia','Montana','Alabama'].includes(expected.state))await page.screenshot({path:out+'/'+kind+'-'+expected.state+'-'+width+'.png'});
      await page.locator('#state-services-dialog [data-close-state]').click();
    }catch(e){evidence.modals.push({id:expected.id,kind,width,issues:[{code:'unverified',message:e.message}]});await page.keyboard.press('Escape');}
    if(evidence.modals.length%25===0){save();console.log('Modal viewport checks: '+evidence.modals.length);}
  }
}
const samples=[...new Set([...['state','region'].flatMap(kind=>[...new Set(audit.rows.filter(r=>r.kind===kind).map(r=>r.family))].map(f=>audit.rows.find(r=>r.kind===kind&&r.family===f)?.url)),...audit.rows.filter(r=>r.kind==='city').map(r=>r.url),audit.rows.find(r=>r.kind==='directory')?.url,'/service-areas/'])].filter(Boolean);
for(const width of [1440,390])for(const url of samples){
  try{await page.setViewportSize({width,height:1000});await page.goto(origin+url,{waitUntil:'domcontentloaded'});const result=await readPage(audit.rows.find(r=>r.url===url));const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(overflow>1)result.issues.push({code:'horizontal-overflow',pixels:overflow});evidence.samples.push({...result,width});if(/montana\/$|tacoma\/$|olympia\/$|southern-arizona\/$/.test(url))await page.screenshot({path:out+'/page-'+url.split('/').filter(Boolean).join('-')+'-'+width+'.png'});}
  catch(e){evidence.samples.push({url,width,issues:[{code:'unverified',message:e.message}]});}
}
evidence.mapClicks=[];
for(const width of [1440,390])for(const route of ['/service-areas/','/']){
  await page.setViewportSize({width,height:1000});await page.goto(origin+route,{waitUntil:'domcontentloaded'});
  for(const state of ['Alabama','Montana','Texas']){
    try{
      await page.locator('.coverage-map-stage [data-state="'+state+'"]').click();
      await page.locator('#state-services-dialog').waitFor({state:'visible'});
      const h1=(await page.locator('#state-services-dialog [data-state-headline]').innerText()).replace(/\s+/g,' ').trim();
      const expected=audit.rows.find(r=>r.kind===(route==='/'?'compact-map':'full-map')&&r.state===state);
      evidence.mapClicks.push({route,width,state,h1,issues:h1===expected.h1?[]:[{code:'map-click-heading'}]});
      await page.locator('#state-services-dialog [data-close-state]').click();
    }catch(e){evidence.mapClicks.push({route,width,state,issues:[{code:'map-click-unverified',message:e.message}]});await page.keyboard.press('Escape');}
  }
}
await browser.close();
const summary={at:new Date().toISOString(),origin,baseUrls:evidence.pages.length,modalPresentations:100,modalViewportChecks:evidence.modals.length,responsivePageChecks:evidence.samples.length,pageFailures:evidence.pages.filter(r=>r.issues.length).length,modalFailures:evidence.modals.filter(r=>r.issues.length).length,responsiveFailures:evidence.samples.filter(r=>r.issues.length).length,browserErrors:evidence.errors.length};
summary.mapClicks=evidence.mapClicks.length;summary.mapClickFailures=evidence.mapClicks.filter(r=>r.issues.length).length;
fs.writeFileSync(out+'/browser.json',JSON.stringify({summary,...evidence},null,2));console.log(JSON.stringify(summary,null,2));
process.exitCode=summary.pageFailures||summary.modalFailures||summary.responsiveFailures||summary.mapClickFailures||summary.browserErrors?1:0;
