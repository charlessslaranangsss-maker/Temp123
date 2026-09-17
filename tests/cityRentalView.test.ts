import { describe, expect, it, vi } from 'vitest';
import { localizedServiceCopy, applyCityRentalView } from '../src/cityRentalView';

describe('city context preserves the existing destination service', () => {
  it('supports the exact root-level containerized-berthing product URL used by propagated cards', () => {
    const title = {textContent:'Containerized Sleeper Units Rental', after:vi.fn()};
    const intro = {textContent:'Container-based crew accommodation.'};
    const main = {dataset:{}, querySelector:(selector:string) => selector==='h1'?title:intro};
    const doc = {title:'Base page', querySelector:(selector:string) => selector==='main'?main:null, querySelectorAll:()=>[]};
    vi.stubGlobal('document',doc);vi.stubGlobal('window',{location:{pathname:'/remote-containerized-military-berthing-solution-for-rent/'}});
    try {applyCityRentalView('Clanton, Alabama');expect(title.textContent).toBe('Containerized Sleeper Units Rental in Clanton, Alabama');expect(intro.textContent).toContain('rental dates');expect(intro.textContent).toContain('Clanton, Alabama');expect(title.after).toHaveBeenCalledWith(intro);} finally {vi.unstubAllGlobals();}
  });
  it('does not change the homepage H1 even when a location query is present', () => {
    const title = {textContent:'Temporary Facilities and Trailer Rental', after:vi.fn()};
    const intro = {textContent:'Rent or Lease Nationwide'};
    const main = {dataset:{}, querySelector:(selector:string) => selector==='h1'?title:intro};
    const doc = {title:'Base page', querySelector:(selector:string) => selector==='main'?main:null, querySelectorAll:()=>[]};
    vi.stubGlobal('document',doc);vi.stubGlobal('window',{location:{pathname:'/'}});
    try {applyCityRentalView('Clanton, Alabama');expect(title.textContent).toBe('Temporary Facilities and Trailer Rental');expect(title.after).not.toHaveBeenCalled();} finally {vi.unstubAllGlobals();}
  });
  it('moves the actual equipment introduction directly below the H1, ahead of the location note', () => {
    const title = {textContent:'Kitchen Trailer Rental', after:vi.fn()};
    const intro = {textContent:'Plan commercial kitchen trailer rental around food preparation.'};
    const main = {dataset:{}, querySelector:(selector:string) => selector==='h1'?title:intro};
    const doc = {title:'Base page', querySelector:(selector:string) => selector==='main'?main:null, querySelectorAll:()=>[]};
    vi.stubGlobal('document',doc);vi.stubGlobal('window',{location:{pathname:'/equipment-rental/mobile-kitchen-trailers/'}});
    try {applyCityRentalView('Huntsville, Alabama');expect(title.after).toHaveBeenCalledWith(intro);expect(title.textContent).toBe('Kitchen Trailer Rental in Huntsville, Alabama');expect(intro.textContent).toContain('commercial kitchen trailer');expect(intro.textContent).toContain('Huntsville, Alabama');} finally {vi.unstubAllGlobals();}
  });
  it('a second city selection does not accumulate locations or duplicate equipment copy', () => {
    const title = {textContent:'Shower Trailer Rental', after:vi.fn()};
    const intro = {textContent:'Plan shower-only rental facilities.'};
    const main = {dataset:{}, querySelector:(selector:string) => selector==='h1'?title:intro};
    const doc = {title:'Base page', querySelector:(selector:string) => selector==='main'?main:null, querySelectorAll:()=>[]};
    vi.stubGlobal('document',doc);vi.stubGlobal('window',{location:{pathname:'/services/shower-trailers/22ft-10-stall/'}});
    try {applyCityRentalView('Rogersville, Alabama');applyCityRentalView('Montgomery, Alabama');expect(title.textContent).toBe('Shower Trailer Rental in Montgomery, Alabama');expect(intro.textContent).not.toContain('Rogersville');expect(intro.textContent.match(/For your project/g)).toHaveLength(1);} finally {vi.unstubAllGlobals();}
  });
  const cases = [
    ['Huntsville, Alabama', 'Kitchen Trailer Rental', 'Plan commercial kitchen trailer rental around food preparation.'],
    ['Florence, Alabama', 'Shower and Restroom Combination Trailer Rental', 'Compare shower and toilet facilities in the same product.'],
    ['Rogersville, Alabama', '22 ft 10-Stall Shower Trailer Rental', 'This is a shower-only trailer; shower/restroom combinations are separate products.'],
    ['Clanton, Alabama', 'Sleeper Bunk-Bed Facility Rental', 'Plan sleeping space around occupancy and shift patterns.'],
    ['Albany, New York', 'ADA Shower and Restroom Combination Trailer Rental', 'Confirm the accessible room and access route for the selected configuration.'],
  ];
  it.each(cases)('keeps the actual product for %s', (location, heading, intro) => {
    const actual = localizedServiceCopy(location, heading, intro);
    expect(actual.heading).toBe(heading + ' in ' + location);
    expect(actual.introduction).toBe(intro + ' For your project in ' + location + ', confirm rental dates, site access and utility connections with the rental team.');
    expect(actual.heading.startsWith(heading)).toBe(true);
  });
  it('does not invent a commercial setting, availability or lease term', () => {
    const actual = localizedServiceCopy('Huntsville, Alabama', 'Kitchen Trailer Rental', 'Confirm the required cooking layout.');
    expect(actual.heading + actual.introduction).not.toMatch(/modular|ADA|construction project|emergency basecamp|long-term|short-term|available now/i);
  });
  it('normalizes an empty location without changing the base page', () => {
    expect(localizedServiceCopy('  ', 'Shower Trailer Rental', 'Plan shower access.')).toEqual({heading:'Shower Trailer Rental', introduction:'Plan shower access.'});
  });
  it('normalizes location whitespace and enforces the existing 120-character limit', () => {
    const copy = localizedServiceCopy('  New   York, New York  ', 'Kitchen Trailer Rental', 'Cooking space.');
    expect(copy.heading).toBe('Kitchen Trailer Rental in New York, New York');
    expect(localizedServiceCopy('x'.repeat(200), 'Rental', '').heading).toBe('Rental in '+'x'.repeat(120));
  });
});
