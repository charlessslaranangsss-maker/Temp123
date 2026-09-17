"""Write the readable handoff from the measured audit, never from assumed results."""
from pathlib import Path
from collections import Counter
import json, csv

root = Path.cwd()
audit = json.loads((root/'audit/service-area-images-2026-09-16.json').read_text(encoding='utf8'))
manifest = json.loads((root/'content/verified-equipment-images.json').read_text(encoding='utf8'))
s, rows = audit['summary'], audit['rows']
photos = sorted((root/'public/images/location-verified').glob('*.webp'))
pages = [r for r in rows if r['kind']=='page']
states = [r for r in rows if r['kind']=='full-map']
missing = Counter(r['family'] for r in pages if r['missingVerifiedPhotography'])
quote = chr(96)
def code(value): return quote+str(value)+quote

with (root/'audit/service-area-image-classification.csv').open('w',newline='',encoding='utf-8-sig') as out:
    fields=['id','family','model','view','status','reason','original','alt','sha256','reviewedVisually']
    writer=csv.DictWriter(out,fieldnames=fields,extrasaction='ignore')
    writer.writeheader(); writer.writerows(manifest['images'])

lines=[
 '# Service Areas verified-image correction',
 '',
 'Audit timestamp: '+s['auditedAt'],
 '',
 '**Local acceptance: '+('PASS' if s['fail']==0 and not s['issues'] and not s['brokenImages'] else 'NOT PASSED')+'. Production deployment: NOT PERFORMED by this task.**',
 '',
 '## Scope and measured results',
 '',
 '| Check | Result |','|---|---:|',
 f'| Registered site routes | {s["registeredPages"]} |',
 f'| Dedicated service-area routes enumerated | {s["serviceAreaPages"]} |',
 f'| Unique states | {s["uniqueStates"]} |',
 f'| Full-map plus compact-map modal presentations | {s["modalPresentations"]} |',
 f'| Classified images | {s["imagesClassified"]} (149 source + 4 catalog) |',
 f'| Approved / withheld images | {s["approvedImages"]} / {s["withheldImages"]} |',
 f'| Responsive derivatives / bytes | {len(photos)} / {sum(p.stat().st_size for p in photos)} |',
 f'| Pages with verified matching photographs | {s["pagesWithPhotos"]} |',
 f'| Pages with truthful photography-pending states | {s["pagesMissingPhotography"]} |',
 f'| States with photography-pending states | {s["statesMissingPhotography"]} |',
 f'| Previously pooled page mappings corrected | {s["unsafePageMappingsCorrected"]} |',
 f'| Audit rows PASS / FAIL | {s["pass"]} / {s["fail"]} |',
 '',
 'PASS means a verified matching photo set **or the explicitly required truthful placeholder**. It does not mean missing photography was supplied. Fifty fixed full-map galleries were replaced; the compact map now uses the same 50 title-driven sets. These are 50 states, not 100 different states.',
 '',
 '## Files to inspect',
 '',
 '- '+code('audit/service-area-images-2026-09-16.csv')+' — every page and modal, exact title, family/model, original files, interior/exterior counts, mismatches, corrections, missing-image reasons and final status.',
 '- '+code('audit/service-area-images-2026-09-16.json')+' — complete machine-readable evidence and summary.',
 '- '+code('audit/service-area-image-classification.csv')+' and '+code('content/verified-equipment-images.json')+' — all 153 classifications, provenance, hashes and withheld reasons.',
 '- '+code('audit/service-area-image-source-inventory.json')+' and '+code('audit/service-area-images-baseline-2026-09-16.json.gz')+' — pinned source-image identities and pre-change page/metadata baseline.',
 '- '+code('work/qa/service-area-images/')+' — original contact sheets, command logs, browser evidence and desktop/mobile screenshots.',
 '',
 '## Matching decisions',
 '',
 'Only the exact visible H1 or modal title selects the gallery. A central resolver chooses one verified family and one model/configuration; it never fills a missing view with another unit. Explicit length and stall requirements must match the recorded model. Generic or conflicting titles do not receive a mixed fallback. Image labels describe what is visible, never an inferred geographic deployment.',
 '',
 'Kitchen trailers and modular buildings, shower trailers and shower containers, laundry trailers and containers, refrigerated trailers and containers, standard and ADA combinations, wheeled sleepers and containerized accommodation are separate. Supporting equipment mentioned elsewhere in page copy does not influence gallery selection.',
 '',
 'Review corrected misleading filenames: some combination-unit files named exterior/steps are interiors, and some shower files named interior are external wash stations. Images duplicated across contractor/VIP/sleeper folders are withheld where model identity is ambiguous. A sleeping container carried on a separate flatbed is not a verified sleeper trailer. Exterior fixtures remain exterior views. Diagrams, duplicate views, unsupported backgrounds and uncertain model associations are not used as approved photography.',
 '',
 '## Missing photography or insufficiently specific titles',
 '',
 '| Detected title family | Pages using the required placeholder |','|---|---:|',
 *[f'| {family} | {count} |' for family,count in sorted(missing.items())],
 '',
 'The unspecified group includes the main service-area hub, generic city-directory headings and man-camp headings. Those titles do not identify one equipment family/configuration. Laundry temporary-facility titles do not identify trailer versus container. Modular-kitchen titles cannot reuse kitchen-trailer imagery. ADA titles require independently verified ADA combination imagery. Existing H1s were preserved rather than rewritten to suit available photographs.',
 '',
 'States with pending photography: '+', '.join(r['state'] for r in states if r['missingVerifiedPhotography'])+'.',
 '',
 '## Runtime behavior',
 '',
 'Interior photos precede exterior photos; duplicate source hashes are rejected. Manual controls, thumbnails, keyboard and swipe navigation remain available where multiple photos exist. Autoplay stops during hover, keyboard/pointer interaction, reduced motion and lightbox use. Manual navigation pauses persistently until Play is selected and interaction ends. Single-image sets do not rotate pointlessly.',
 '',
 'State opening destroys the old controller and gallery before mounting the exact matching inert template at slide zero. Closing clears the old gallery. Full images open in a centered native dialog above the state modal, use the complete original without cropping, and support previous/next, Arrow/Home/End, close, Escape, outside click and bounded Tab focus. A mobile caption-over-thumbnail collision was fixed with a scoped caption layout rule.',
 '',
 '## Validation and release boundary',
 '',
 'The audit independently reconciles generated service-area files and the route registry, inspects every route, checks every original and responsive asset, verifies ordering/family/model/hash uniqueness, and checks the 50 template sets in both map layouts. HTTP checks cover every service-area route and all assigned image paths. Browser evidence includes all 100 modal presentations, state switching, responsive layouts, autoplay, reduced motion and the complete-image lightbox. Final audit PASS requires browser evidence with the same build/manifest fingerprint.',
 '',
 'The baseline comparison preserves route inventory, H1s, document titles, head meta tags, canonical tags, robots.txt and the official/review sitemaps. Image structured-data references track the corrected visible first image; this is an intentional image-reference correction, not a claim that every JSON-LD byte is unchanged.',
 '',
 'Other active tasks modified contact/emergency UI and SEO backend files concurrently. This task used an isolated validation snapshot rather than overwriting their work or racing a shared build. No inquiry was intentionally sent, no domain or indexing gate was enabled, and no Search Console submission or production cutover was performed.',
 '',
 '**Deployment remains a separate, coordinated acceptance step.** The audit records live output as unverified. Do not infer that the canonical business website or existing Vercel alias contains this correction merely because the local build passes. The preview server used for this audit is '+code(s.get('baseURL') or 'not recorded')+'.',
 '',
 '## Reproduce',
 '',
 '1. Run '+code('python scripts/build-location-image-manifest.py')+' only against the pinned, unchanged reviewed source inventory.',
 '2. Run typecheck, application and focused image tests, formatter/syntax checks, and one uncontended production build.',
 '3. Serve that exact build. Set '+code('PLAYWRIGHT_BASE_URL')+' and '+code('SERVICE_AREA_AUDIT_DIST')+' to the same build/preview, then run '+code('npx playwright test tests/browser/service-area-images.spec.ts --workers=1')+'.',
 '4. Set '+code('SERVICE_AREA_AUDIT_URL')+' and run '+code('node --import tsx scripts/audit-service-area-images.ts')+' followed by '+code('python scripts/write-service-area-image-report.py')+'.',
 '5. After an authorized deployment, repeat representative live page, state-switch, lightbox, console/network and indexing-boundary checks; record the exact deployment URL and build identity.',
 '',
 'Do not reuse old browser evidence for a changed build. Do not treat a placeholder PASS as model availability or verified physical dimensions.',
]
(root/'docs/phase1/SERVICE_AREA_IMAGE_AUDIT.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(json.dumps({'auditRows':len(rows),'pass':s['pass'],'fail':s['fail'],'sourceImages':149,'classifiedImages':s['imagesClassified'],'derivativeFiles':len(photos),'derivativeBytes':sum(p.stat().st_size for p in photos),'missingByFamily':dict(missing)},indent=2))
