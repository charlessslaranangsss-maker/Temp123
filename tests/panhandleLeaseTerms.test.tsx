import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { panhandleGalleryCopy } from '../src/panhandleGalleryCopy';
import { LocationImageCarousel } from '../src/LocationImageCarousel';

const headline = 'Panhandle, Oklahoma Workforce Camp Laundry Temporary Facilities Long-Term Rental';
describe('Oklahoma Panhandle rental durations and lease descriptions', () => {
  for (const [model, product] of [['model-08', '30 ft Laundry Trailer'], ['model-06', '20 ft Laundry Container']]) {
    it('leads with location, commercial use, exact product and rental or lease for ' + product, () => {
      const copy = panhandleGalleryCopy(headline, model);
      const use = model === 'model-08' ? 'Commercial Project' : 'Commercial Facility';
      expect(copy?.caption.startsWith('Oklahoma Panhandle ' + use + ' and Base Camp ' + product + ' Rental or Lease.')).toBe(true);
      for (const term of ['weekly rental', 'monthly rental', 'yearly rental', 'lease options']) expect(copy?.caption.toLowerCase()).toContain(term);
      expect(copy?.caption).toMatch(/Discuss weekly rental/i);
      expect(copy?.caption).not.toMatch(/availability|site requirements|confirm|quote/i);
      expect(copy?.caption.endsWith('Call us now at 800-443-5212 — available 24/7.')).toBe(true);
      expect(copy?.caption).not.toMatch(/guaranteed|in stock|immediate delivery|shower|kitchen/i);
      expect(copy?.altPrefix).not.toMatch(/weekly|monthly|yearly/i);
      expect(copy?.altPrefix).toBe(product.toLowerCase() + ' rental option — ');
    });
  }
  it('keeps the container distinct from the towable trailer', () => {
    expect(panhandleGalleryCopy(headline, 'model-06')?.caption).toContain('container, not a trailer');
    expect(panhandleGalleryCopy(headline, 'model-08')?.caption).not.toContain('container');
  });
  it('renders both descriptions in separate product galleries', () => {
    const doc = load(renderToStaticMarkup(createElement(LocationImageCarousel, { headline })));
    expect(doc('[data-gallery-group]')).toHaveLength(2);
    for (const id of ['model-08', 'model-06']) {
      const group = doc('[data-group-model="' + id + '"]');
      expect(group.text()).toContain(panhandleGalleryCopy(headline, id)!.caption);
      expect(group.find('[data-carousel-slide]').length).toBe(id === 'model-08' ? 1 : 3);
    }
    expect(doc('h1')).toHaveLength(0);
  });
  it('does not add the Oklahoma copy to unrelated locations or equipment', () => {
    expect(panhandleGalleryCopy('Texas Panhandle Laundry Rental', 'model-08')).toBeUndefined();
    expect(panhandleGalleryCopy('Oklahoma City Laundry Rental', 'model-06')).toBeUndefined();
    expect(panhandleGalleryCopy(headline, 'unknown')).toBeUndefined();
  });
});
