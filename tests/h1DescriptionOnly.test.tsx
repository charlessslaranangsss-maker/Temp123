import {describe,it,expect} from 'vitest';
import fixture from './fixtures/h1DescriptionOnly.json';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {load} from 'cheerio';
import {ServiceDetail} from '../src/ServiceDetail';
import {alignedPageIntro,alignedLocationIntro} from '../src/alignedIntroductions';
import details from '../content/service-details.json';
const before=fixture;
const manifest=fixture;
const n=(s:string)=>s.replace(/\s+/g,' ').trim(), rental=/\brent(?:al|als|ed|ing)?\b|\bleas(?:e|ing|ed)\b/i;
describe('Description-only corrections preserve approved H1s',()=>{
  for(const [url,item] of Object.entries(details).filter(([url])=>before.rows.some((r:{url:string})=>r.url===url)))it('retains heading and equipment rental purpose: '+url,()=>{
    const doc=load(renderToStaticMarkup(createElement(ServiceDetail,{path:url as keyof typeof details}))),old=before.rows.find((r:{url:string})=>r.url===url);
    if(!old)throw new Error('Missing H1 baseline for '+url);
    expect(doc('h1').length).toBe(1);expect(n(doc('h1').text())).toBe(old.h1);
    const intro=n(doc('[data-h1-intro]').text());expect(intro).toMatch(rental);
    if(/kitchen/i.test(old.h1))expect(intro).not.toMatch(/shower|restroom|sleep|laundry/i);
    if(/shower/i.test(old.h1)&&!/restroom/i.test(old.h1))expect(intro).not.toMatch(/kitchen|cooking|sleeper|laundry/i);
    const exact=manifest.exactOverrides.find((r:{url:string})=>r.url===url);
    expect(intro).toBe(exact?.after ?? (old.intro.startsWith('The ')?old.intro.replace(' option ',' rental option '):old.intro));
  });
  for(const row of manifest.exactOverrides)it('uses the reviewed rental description: '+row.url,()=>expect(alignedPageIntro(row.url,'Heading remains outside description helper')).toBe(row.after));
  for(const row of before.modals.filter((r:{kind:string})=>r.kind==='full-map'))it('leaves '+row.state+' map introduction unchanged',()=>expect(alignedLocationIntro(row.h1,row.state)).toBe(row.intro));
  for(const [url,item] of Object.entries(details).filter(([url])=>!before.rows.some((r:{url:string})=>r.url===url)))it('renders the registered model as its own page: '+url,()=>{
    const doc=load(renderToStaticMarkup(createElement(ServiceDetail,{path:url as keyof typeof details})));
    expect(doc('h1')).toHaveLength(1);expect(n(doc('h1').text())).toContain(item.name);
    expect(n(doc('[data-h1-intro]').text())).toMatch(rental);
  });
  it('preserves unknown-family fallback copy',()=>expect(alignedPageIntro('/not-registered/','General Information','Original description')).toBe('Original description'));
});
