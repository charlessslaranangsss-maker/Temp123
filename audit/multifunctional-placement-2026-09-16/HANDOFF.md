# Temporary123 — multifunctional image placement

Implemented and verified locally. No commit, push or deployment.

## Authorized placement decision

Charles explicitly authorized: Yes, decide the best exact placements and do it locally. The two client-supplied multifunctional products fit the broad Man Camp / Remote Operations equipment galleries. Replace the existing accommodation and kitchen selections there rather than adding sections, inventing product pages, or changing standalone products.

| Existing position | Current labelled selection | New source |
| --- | --- | --- |
| Accommodation option in man-camp galleries | Office, Sleeper and Shower & Restroom Trailer | Review 27.01 — supplied exterior |
| Kitchen option in man-camp galleries | 38ft All Electric Kitchen | Review 26.01 — supplied exterior |
| Third, shower-only option | Existing 20 ft Shower Trailer | Unchanged |

These are separate products, each with its own gallery and full-image viewer. No borrowed interior images, physical-unit merging, fabricated dimensions, or inferred electrical certification. Existing reference caveats remain beside the images and in each product-labelled lightbox.

## Exact scope

42 existing dedicated location pages and 14 modal presentations (seven states in each map). State selections: Georgia, Iowa, Massachusetts, New Jersey, Texas, Washington, West Virginia.

All affected URLs and exact H1/modal titles, assigned files, product groups, captions and results: affected-route-modal-inventory.csv/json. Full universe: acceptance.csv/json (548 routes plus 100 modal presentations).

The Service Areas hub remains map-focused. All 246 city directories remain without photo sections. No new category sections or routes. Standard 38ft kitchen, standalone kitchen/sleeper/shower products, April's 20ft container-inside-only rule, all five refrigerated-trailer images, two-stall sleeper images, and laundry separation are unchanged.

## Reproduction and evidence

Repository: C:\Users\Charles\Documents\New project\Temporary 123
Branch: main; base HEAD: 8ad98dba33ef6d9b7b1e64028da3fc639bd7fd9a. Uncommitted changes are required; base HEAD alone does not contain this update.
Frozen build: C:\Users\Charles\Documents\New project\Temporary 123\.temp\multifunctional-placement-20260916\dist
Local preview: http://127.0.0.1:4209/service-areas/texas/
Source fingerprint: f25c4a3cd33efe24fdd8ebc44e0df4ff0b50a6b63dd35807d4cfeeeed8fd15ca
Central selection: content/equipment-photo-policy.json delegatedSelection.contextGalleries.man-camp.
Source identities: content/equipment-photo-additions.json and content/verified-equipment-images.json. Existing image bytes/model identities are unchanged.

Validation: 227 focused tests, 44 application tests, 36 browser tests, TypeScript and 651-page production build plus 404 passed. All 648 route/modal records passed. Every affected page/modal was checked at 1440px and 390px: 112 presentations and 224 complete-image displays. All 100 map modal presentations were exercised in the regression suite; zero recorded page exceptions or failed same-origin image requests. All six new original/responsive image responses byte-matched local assets.

No-photo navigation pages: 247 (intentional, not missing images). Still-pending modular-kitchen pages: 38. Generic ADA references do not establish exact accessible variants. The new exterior references do not independently establish the electrical specification, office interior, dimensions, capacity or local availability.

## Changed source files

- content/equipment-photo-policy.json — SHA-256 95eb4ab2d0bbbeab277cc92730d380f933c15857009e68cce21d37cf72527afd
- content/equipment-photo-additions.json — SHA-256 d7903a4264ae61e33e5fef2c3254a08ebc6347bfff8a5e506b8cd2300a009ca2
- src/LocationImageCarousel.tsx — SHA-256 4955bb504de5218557c34b9549965942ad074039e29d211f73e24b87f9a5fe4d
- tests/multifunctionalPlacement.test.tsx — SHA-256 90b3c6337af1071caddd4b69147689e8efa1c8b397010daeccaabd5198be3ebb
- tests/browser/multifunctional-placement.spec.ts — SHA-256 a4e032bffba9586661102e8a82e35e48c515572e093d9f0060ecbeeef31cf95e

Full hashes, protected-file checks and audit summary: summary.json. Logs and screenshots: work/qa/multifunctional-placement-20260916/.

Publication: NOT DEPLOYED. Older frozen previews remain unchanged. Independent review of this candidate, non-Chromium/native-device testing and any future live acceptance remain separate. Do not use a passing build as evidence of live deployment.
Concurrent root-only boundary: later equipment-card, legacy reference-alt, Iowa planning-heading and ADA-introduction corrections were observed in four files. Those edits are preserved; their combined runtime is not part of this frozen placement acceptance. Exact files/fields/hashes are recorded in summary.json.
