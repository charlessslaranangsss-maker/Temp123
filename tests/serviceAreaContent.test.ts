import { describe, expect, it } from 'vitest';
import { auditContent, contentFamily } from '../scripts/service-area-content-rules.mjs';
import { alignedLocationIntro } from '../src/alignedIntroductions';
import { stateGuides } from '../src/stateGuides';
import { stateRentalHeadline } from '../src/rentalHeadlines';
import serviceDetails from '../content/service-details.json';
const row = (h1:string,intro:string,extra:Record<string,unknown>={}) => ({h1,intro,headingCount:1,kind:'state',location:'Alabama',family:contentFamily(h1),...extra});
describe('Independent service-area content regressions',()=>{
  it('describes containerized berthing as containers rather than trailers',()=>{
    const item=serviceDetails['/remote-containerized-military-berthing-solution-for-rent/'];
    expect(item.use).toContain('containerized sleeper units');
    expect(item.use).not.toMatch(/sleeper trailers/i);
  });
  it('does not interpret Nevada as an ADA equipment claim',()=>{
    expect(contentFamily('Las Vegas Valley, Nevada Institutional Facility Shower and Restroom Combination Trailer For Rent')).toBe('combination');
    expect(contentFamily('Nevada Accessible Commercial Site ADA Shower and Restroom Combination Trailer Leasing')).toBe('ada-combination');
  });
  it('rejects kitchen copy on a shower-only page',()=>{
    const r=row('Alabama Emergency Basecamp Shower Trailer Rental','Arrange commercial kitchen trailer rental in Alabama for emergency basecamps. Plan cooking capacity.');
    expect(auditContent(r).map((i:any)=>i.code)).toContain('lead-family');
  });
  it('rejects combination toilet specifications on a shower-only unit',()=>{
    const r=row('Alabama Emergency Basecamp Shower Trailer Rental','Arrange shower-only trailer rental in Alabama for emergency basecamps. This unit includes 4 toilets.');
    expect(auditContent(r).map((i:any)=>i.code)).toContain('shower-spec');
  });
  it('rejects man-camp copy that omits rental intent',()=>{
    const r=row('Alabama Remote Operations Man Camp Temporary Facilities Rental','Plan man-camp temporary facilities in Alabama for remote operations. Coordinate food and sleeping space.');
    expect(auditContent(r).map((i:any)=>i.code)).toContain('rental-intent');
  });
});
describe('Location-copy acceptance',()=>{
  for (const state of Object.keys(stateGuides)) it('aligns all state and modal lead dimensions: '+state,()=>{
    const title=stateRentalHeadline(state),intro=alignedLocationIntro(title,state);
    expect(auditContent(row(title,intro,{location:state}))).toEqual([]);
  });
  it('rejects a modular building summarized as only kitchen trailers',()=>{
    const r=row('Alabama Commercial Food Service Commercial Kitchen Modular Building For Rent','Arrange commercial kitchen modular building rental in Alabama for commercial food-service operations.',{kind:'full-map',primarySummary:'Core base camp services include kitchen trailers and showers.',focus:''});
    expect(auditContent(r).map((i:any)=>i.code)).toContain('modal-primary-family');
  });
  it('permits separately identified supporting rental options',()=>{
    const r=row('Alabama Emergency Basecamp Shower Trailer Rental','Arrange shower-only trailer rental in Alabama for emergency basecamps. Confirm the selected shower layout.',{kind:'full-map',primarySummary:'Separate supporting rentals include kitchens and combination units.',focus:'Plan utility access'});
    expect(auditContent(r)).toEqual([]);
  });
});
