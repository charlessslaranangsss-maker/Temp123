# Service Areas verified-image correction

Audit timestamp: 2026-09-16T06:01:27.816Z

**Local acceptance: PASS. Production deployment: NOT PERFORMED by this task.**

## Scope and measured results

| Check | Result |
|---|---:|
| Registered site routes | 651 |
| Dedicated service-area routes enumerated | 548 |
| Unique states | 50 |
| Full-map plus compact-map modal presentations | 100 |
| Classified images | 153 (149 source + 4 catalog) |
| Approved / withheld images | 97 / 56 |
| Responsive derivatives / bytes | 194 / 21179990 |
| Pages with verified matching photographs | 150 |
| Pages with truthful photography-pending states | 398 |
| States with photography-pending states | 27 |
| Previously pooled page mappings corrected | 301 |
| Audit rows PASS / FAIL | 648 / 0 |

PASS means a verified matching photo set **or the explicitly required truthful placeholder**. It does not mean missing photography was supplied. Fifty fixed full-map galleries were replaced; the compact map now uses the same 50 title-driven sets. These are 50 states, not 100 different states.

## Files to inspect

- `audit/service-area-images-2026-09-16.csv` — every page and modal, exact title, family/model, original files, interior/exterior counts, mismatches, corrections, missing-image reasons and final status.
- `audit/service-area-images-2026-09-16.json` — complete machine-readable evidence and summary.
- `audit/service-area-image-classification.csv` and `content/verified-equipment-images.json` — all 153 classifications, provenance, hashes and withheld reasons.
- `audit/service-area-image-source-inventory.json` and `audit/service-area-images-baseline-2026-09-16.json.gz` — pinned source-image identities and pre-change page/metadata baseline.
- `work/qa/service-area-images/` — original contact sheets, command logs, browser evidence and desktop/mobile screenshots.

## Matching decisions

Only the exact visible H1 or modal title selects the gallery. A central resolver chooses one verified family and one model/configuration; it never fills a missing view with another unit. Explicit length and stall requirements must match the recorded model. Generic or conflicting titles do not receive a mixed fallback. Image labels describe what is visible, never an inferred geographic deployment.

Kitchen trailers and modular buildings, shower trailers and shower containers, laundry trailers and containers, refrigerated trailers and containers, standard and ADA combinations, wheeled sleepers and containerized accommodation are separate. Supporting equipment mentioned elsewhere in page copy does not influence gallery selection.

Review corrected misleading filenames: some combination-unit files named exterior/steps are interiors, and some shower files named interior are external wash stations. Images duplicated across contractor/VIP/sleeper folders are withheld where model identity is ambiguous. A sleeping container carried on a separate flatbed is not a verified sleeper trailer. Exterior fixtures remain exterior views. Diagrams, duplicate views, unsupported backgrounds and uncertain model associations are not used as approved photography.

## Missing photography or insufficiently specific titles

| Detected title family | Pages using the required placeholder |
|---|---:|
| ada-combination | 35 |
| kitchen-modular | 38 |
| laundry-unspecified | 36 |
| unspecified | 289 |

The unspecified group includes the main service-area hub, generic city-directory headings and man-camp headings. Those titles do not identify one equipment family/configuration. Laundry temporary-facility titles do not identify trailer versus container. Modular-kitchen titles cannot reuse kitchen-trailer imagery. ADA titles require independently verified ADA combination imagery. Existing H1s were preserved rather than rewritten to suit available photographs.

States with pending photography: Alaska, Arkansas, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Maine, Maryland, Massachusetts, Michigan, Minnesota, Montana, New Jersey, North Carolina, Oklahoma, Oregon, Rhode Island, South Carolina, Tennessee, Texas, Utah, Washington, West Virginia, Wyoming.

## Runtime behavior

Interior photos precede exterior photos; duplicate source hashes are rejected. Manual controls, thumbnails, keyboard and swipe navigation remain available where multiple photos exist. Autoplay stops during hover, keyboard/pointer interaction, reduced motion and lightbox use. Manual navigation pauses persistently until Play is selected and interaction ends. Single-image sets do not rotate pointlessly.

State opening destroys the old controller and gallery before mounting the exact matching inert template at slide zero. Closing clears the old gallery. Full images open in a centered native dialog above the state modal, use the complete original without cropping, and support previous/next, Arrow/Home/End, close, Escape, outside click and bounded Tab focus. A mobile caption-over-thumbnail collision was fixed with a scoped caption layout rule.

## Validation and release boundary

The audit independently reconciles generated service-area files and the route registry, inspects every route, checks every original and responsive asset, verifies ordering/family/model/hash uniqueness, and checks the 50 template sets in both map layouts. HTTP checks cover every service-area route and all assigned image paths. Browser evidence includes all 100 modal presentations, state switching, responsive layouts, autoplay, reduced motion and the complete-image lightbox. Final audit PASS requires browser evidence with the same build/manifest fingerprint.

The baseline comparison preserves route inventory, H1s, document titles, head meta tags, canonical tags, robots.txt and the official/review sitemaps. Image structured-data references track the corrected visible first image; this is an intentional image-reference correction, not a claim that every JSON-LD byte is unchanged.

Other active tasks modified contact/emergency UI and SEO backend files concurrently. This task used an isolated validation snapshot rather than overwriting their work or racing a shared build. No inquiry was intentionally sent, no domain or indexing gate was enabled, and no Search Console submission or production cutover was performed.

**Deployment remains a separate, coordinated acceptance step.** The audit records live output as unverified. Do not infer that the canonical business website or existing Vercel alias contains this correction merely because the local build passes. The preview server used for this audit is `http://127.0.0.1:4197`.

## Reproduce

1. Run `python scripts/build-location-image-manifest.py` only against the pinned, unchanged reviewed source inventory.
2. Run typecheck, application and focused image tests, formatter/syntax checks, and one uncontended production build.
3. Serve that exact build. Set `PLAYWRIGHT_BASE_URL` and `SERVICE_AREA_AUDIT_DIST` to the same build/preview, then run `npx playwright test tests/browser/service-area-images.spec.ts --workers=1`.
4. Set `SERVICE_AREA_AUDIT_URL` and run `node --import tsx scripts/audit-service-area-images.ts` followed by `python scripts/write-service-area-image-report.py`.
5. After an authorized deployment, repeat representative live page, state-switch, lightbox, console/network and indexing-boundary checks; record the exact deployment URL and build identity.

Do not reuse old browser evidence for a changed build. Do not treat a placeholder PASS as model availability or verified physical dimensions.
