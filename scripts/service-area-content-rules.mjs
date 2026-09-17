// Independent checks of rendered text; no production intro-generator import.
export const normalizeCopy = value => String(value || '').replace(/\s+/g, ' ').trim();
export function contentFamily(title) {
  if (/man camp/i.test(title)) return 'man-camp';
  if (/\bADA\b.*shower.*restroom/i.test(title)) return 'ada-combination';
  if (/kitchen.*modular|modular.*kitchen/i.test(title)) return 'modular-kitchen';
  if (/kitchen/i.test(title)) return 'kitchen-trailer';
  if (/laundry/i.test(title)) return 'laundry';
  if (/sleeper|bunk.bed/i.test(title)) return 'sleeper';
  if (/shower.*restroom|restroom.*shower/i.test(title)) return 'combination';
  if (/shower/i.test(title)) return 'shower-only';
  return 'directory';
}
export function namesFamily(copy, family) {
  const match = {
    'man-camp': /man.camp|remote operations|workforce.camp/i,
    'ada-combination': /\bADA\b|accessible|accessibility/i,
    'modular-kitchen': /modular|kitchen.*building/i,
    'kitchen-trailer': /kitchen|cooking|food.preparation/i,
    laundry: /laundry|washing and drying/i,
    sleeper: /sleep|bunk|bed|accommodation/i,
    combination: /shower.*(?:restroom|toilet)|(?:restroom|toilet).*shower/i,
    'shower-only': /shower/i,
    directory: /location|rental|guide|facilit/i,
  };
  return match[family]?.test(copy) || false;
}
export function auditContent(row) {
  const issues = [];
  const add = (code, field, reason) => issues.push({code,field,reason,oldCopy:row[field] || ''});
  const first = row.intro.split(/(?<!\bSt)\. (?=[A-Z])/)[0];
  const family = row.family || contentFamily(row.h1);
  if (!row.h1 || row.headingCount !== 1) add('heading-count', 'h1', 'Expected exactly one page or modal heading.');
  if (row.intro.length < 40) add('missing-lead', 'intro', 'Opening description is absent or insufficient.');
  if (row.location && !row.intro.includes(row.location)) add('location', 'intro', 'Opening description does not identify the same location.');
  if (!namesFamily(first,family)) add('lead-family', 'intro', 'Opening sentence does not support the primary equipment family.');
  if (row.location?.includes('St. ') && row.metadataDescription && !row.metadataDescription.includes(row.location)) add('metadata-location','metadataDescription','Sentence splitting truncated the place name at St.');
  if (/Kitchen Emergency Trailer/.test(row.h1) && !/emergency|interruption|outage/i.test(row.intro)) add('emergency-intent','intro','Opening copy omits the emergency-kitchen qualification.');
  if (family==='ada-combination' && !/trailer/i.test(first)) add('equipment-form','intro','Opening sentence omits the trailer form factor.');
  if (family !== 'directory') {
    if (!/rent|leas/i.test(first)) add('rental-intent', 'intro', 'Opening sentence omits rental intent.');
    if (/long.term/i.test(row.h1) && !/long.term/i.test(first)) add('long-term-intent','intro','Long-term intent is missing.');
    if (/short.term/i.test(row.h1) && !/short.term/i.test(first)) add('short-term-intent','intro','Short-term intent is missing.');
    if (/Commercial Food Service/.test(row.h1) && !/for commercial food.service|for food.service operations/i.test(first)) add('commercial-use','intro','Commercial food-service use case was reduced to an unspecified operation.');
    if (/facilities (?:long.term rental|short.term rental|leasing|rental)/i.test(first)) add('rental-grammar','intro','Plural facilities are joined unnaturally to rental/leasing.');
    if (family === 'shower-only' && /kitchen|cooking|\d+.stall.*(?:restroom|combination)|(?:restroom|combination).*\d+.stall/i.test(first)) add('shower-family','intro','Shower-only lead describes another family or combination specifications.');
    if (family === 'shower-only' && /(?:includes?|features?|has|with) [^.]*\btoilets?\b/i.test(row.intro)) add('shower-spec','intro','Shower-only lead assigns toilet specifications to a shower-only unit.');
  }
  if (row.kind === 'full-map') {
    if (['modular-kitchen','ada-combination'].includes(family) && !namesFamily(row.primarySummary,family)) add('modal-primary-family','primarySummary','State summary omits the H1 form factor or accessibility requirement.');
    if (!['kitchen-trailer','modular-kitchen','man-camp'].includes(family) && /food service route|transition between kitchens/i.test(row.focus)) add('modal-focus-family','focus','State focus introduces kitchens under a different primary family.');
    if (family === 'laundry' && /(?:Supporting|Additional|also|remain available)[^.]*laundry|laundry[^.]*also available/i.test(row.primarySummary)) add('modal-primary-secondary','primarySummary','Laundry is relegated to an additional service despite being the primary topic.');
  }
  if (row.kind === 'region') {
    if (family === 'laundry' && /Supporting rentals:[^.]*laundry/i.test(row.secondarySummary)) add('region-primary-secondary','secondarySummary','Primary laundry is labelled supporting while other families dominate the answer.');
    if (['modular-kitchen','ada-combination'].includes(family) && !namesFamily(row.answer + ' ' + row.primaryLinks,family)) add('region-primary-family','answer','Quick answer and primary links omit the H1 modular/accessibility family.');
  }
  if (row.kind === 'city' && ['sleeper','combination'].includes(family) && /^(?:Tacoma crews can rent or lease mobile commercial kitchens|Olympia project teams can discuss a mobile kitchen rental)/.test(row.answer)) add('city-primary-family','answer','Quick answer leads with kitchens rather than the H1 service.');
  return issues;
}
