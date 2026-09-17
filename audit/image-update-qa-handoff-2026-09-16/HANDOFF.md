# Temporary123 — current image update: independent QA handoff

Prepared: 2026-09-16T08:52:06.818Z

**READY FOR INDEPENDENT QA ON THE FROZEN LOCAL BUILD. NOT RELEASED BY THIS TASK.**

## Exact revision and environment

- Repository: C:\Users\Charles\Documents\New project\Temporary 123
- Branch: main
- Current base HEAD: 8ad98dba33ef6d9b7b1e64028da3fc639bd7fd9a
- The image changes are uncommitted. The base commit alone does NOT contain this update. Unrelated working-tree changes were not reset, committed, or published.
- Frozen tested build: C:\Users\Charles\Documents\New project\Temporary 123\.temp\owner-image-rollout-20260916\dist
- Local URL: http://127.0.0.1:4201/service-areas/ . Old ports 4197 and 4199 are older snapshots.
- Image-source snapshot SHA-256: f4e2edf9462d7e9969a4ca2f142e8db0b8947fafbfe910dbde83b7f55496e2a7
- Verified-image manifest SHA-256: b2dd5c5c6b5bd2d6194421d9d583a8bdddeac914a512d80eda8dc72331fdcd57
- Photo-policy SHA-256: a6d254484922a68e1f1974a6d2f6952e84091625fc07005f7e143efd8ef070ad
- Exact file hashes and full observed git status: audit/image-update-qa-handoff-2026-09-16/files-and-revision.json .

## Deployment status — do not use the wrong version for QA

No Vercel deployment was performed by this update/handoff task. No immutable deployment URL or deployment revision is established for this update.
At 2026-09-16T08:43:36.108Z, all 10 sampled URLs on https://temp123-nine.vercel.app returned HTTP 200, but 10 did not match this snapshot's image presentation. The alias still showed the earlier implementation in this comparison. Request-trace headers are not deployment IDs.
Evidence: audit/image-update-qa-handoff-2026-09-16/live-comparison.json . These were HTTP comparisons, not live browser acceptance. Independent live QA is pending a coordinated deployment of the reviewed revision.

## Complete affected inventory

| Scope | Enumerated |
|---|---:|
| Service Areas hub | 1 |
| Dedicated state pages | 50 |
| Dedicated regional pages | 246 |
| City-directory pages | 246 |
| Dedicated city pages | 5 |
| Total Service Areas routes | 548 |
| Full Service Areas map state presentations | 50 |
| Compact homepage map state presentations | 50 |
| Other carousel-bearing routes affected by the shared component | 26 |

Primary inventory: audit/image-update-qa-handoff-2026-09-16/route-modal-inventory.csv (648 rows). Every row includes exact URL/title/state, family, presentation, model group, assigned original files, image review IDs, counts and outcome. Modal rows use the host URL and named state; they are not 100 separate public page URLs.
Additional shared-component regression scope: audit/image-update-qa-handoff-2026-09-16/other-carousel-routes.csv . This also records the homepage map host. These include retained service carousels whose control IDs changed, not only newly assigned photos.
Full nested inventory, source hashes and 77 assigned original/responsive paths: audit/image-update-qa-handoff-2026-09-16/inventory.json .

## What this revision changes

- One matching usable interior or exterior is sufficient. Additional angles are not a required-photo blocker.
- 20ft refrigerated container: exactly one explicitly shared trailer-interior reference, no exterior; on /equipment-rental/refrigeration/#20ft-refrigerated-container. No new standalone route.
- 20ft refrigerated trailer: all five Drive references, two interiors then three exterior/fleet references; /20ft-refrigeration-trailers/.
- Two-stall sleeper: existing review IDs 24.01 and 24.08, interior-only; no substituted four-room or container-on-flatbed exterior.
- Generic laundry pages show separate 30ft trailer and 20ft container galleries. Man-camp and directory/hub pages show separately labelled equipment options. No multi-family carousel is created and no H1 is rewritten.
- Named 30ft laundry, contractor accommodation and VIP private-room references are used with limitation captions. Generic ADA pages use a labelled catalogue reference only; exact ADA variants remain held.
- Generic kitchen galleries start with the wide interior (12.05). Shared carousel instance IDs are unique, including when page and modal repeat an equipment set.

## Mapping source and changed files

Policy and explicit April/Charles use approvals: content/equipment-photo-policy.json .
Central image identity/approval manifest: content/verified-equipment-images.json; generator: scripts/build-location-image-manifest.py .
Title/group resolver: src/locationCarouselImages.ts; rendering: src/LocationImageCarousel.tsx; reference captions: src/equipmentPhotoPolicy.ts .
Equipment-route integration: src/serviceHeroImages.ts, src/ServiceDetail.tsx, src/ApprovedEquipmentPhotoOptions.tsx. The map uses templates rendered through the same LocationImageCarousel.

Image-lane files changed since the previously tested April snapshot:
- content/equipment-photo-policy.json (changed)
- content/verified-equipment-images.json (changed)
- scripts/build-location-image-manifest.py (changed)
- src/equipmentPhotoPolicy.ts (changed)
- src/locationCarouselImages.ts (changed)
- src/LocationImageCarousel.tsx (changed)
- src/location-image-gallery.css (changed)
- src/ApprovedEquipmentPhotoOptions.tsx (changed)
- src/serviceHeroImages.ts (changed)
- src/ServiceDetail.tsx (changed)
- src/ServiceHeroCarousel.tsx (changed)
- tests/ownerImageRollout.test.tsx (added)
- tests/aprilPhotoPolicy.test.tsx (changed)
- tests/locationCarouselImages.test.ts (changed)
- tests/browser/owner-image-rollout.spec.ts (added)
- tests/browser/service-area-images.spec.ts (changed)
- scripts/audit-service-area-images.ts (changed)

Do not regenerate with an older policy. New reference derivatives are in public/images/location-verified/; assigned paths/hashes are enumerated in inventory.json. Historical strict-rule audit files and the earlier spreadsheet are not the acceptance specification for this delegated update.

## Verification completed locally

- TypeScript and production build passed: 651 pages plus 404, draft/noindex. Existing non-fatal build warnings remain recorded.
- 94 focused image/policy/component unit tests, 44 application tests and 29 implementation browser tests passed.
- Exhaustive local HTTP/static/manifest and matched browser-evidence audit: 648 PASS, 0 FAIL; zero assigned broken image paths. H1s, document titles, head metadata, canonical tags, robots and sitemaps compare unchanged against the stored baseline.
- Additional handoff runtime sweep: 100 state presentations plus 16 desktop/mobile page visits; unique IDs, first-slide reset, per-group images/controls, close cleanup and full-image lightboxes passed. No recorded page exceptions, failed same-origin responses or write requests.
- This is local acceptance, not live acceptance. No Search Console submission, canonical-domain cutover, inquiry submission or indexing-gate change was made.

## Remaining holds and evidence limits

| Service Areas presentation | Dedicated pages | Unique states |
|---|---:|---:|
| Matched single-family photo sets | 150 | 23 |
| Separately labelled equipment options | 325 | 14 |
| Labelled ADA catalogue reference, not verified access/variant evidence | 35 | 5 |
| Still pending: commercial modular-kitchen photography | 38 | 8 |

The 38 modular-kitchen pages and these eight state selections must retain the safe pending state: Arkansas, Maine, Maryland, Montana, North Carolina, South Carolina, Tennessee, Utah.
Exact 3-stall+1-ADA and 8-stall+1-ADA units remain unverified. The generic ADA reference does not show or establish the required room/ramp configuration. Reference photo approval also does not prove dimensions, machine counts, capacities, hands-free operation or all-electric equipment.
Other unresolved exact-photo requests include the 22ft/10-stall shower-only unit, 12ft refrigerated trailer, 26ft bulk kitchen, 24ft laundry trailer, 38ft all-electric kitchen and exact-size dishwashing associations. No unrelated size/configuration was substituted. Some are outside the dedicated Service Areas scope.
The central manifest excludes 46 image-use records. audit/image-update-qa-handoff-2026-09-16/held-images.csv lists every excluded file and reason; these include duplicates/diagrams as well as unsuitable or unresolved references, NOT 46 missing physical units.
Native iOS Safari/non-Chromium engines, real device behavior, live deployment/CDN behavior, production indexing and canonical-domain migration are not signed off here. Legacy regional social-preview selection remains a release-time review item when canonicals are enabled.

## Independent QA starting point

Audit the frozen port-4201 build and the exact inventories first. Do not rebuild that snapshot while another audit is using it. For live acceptance, first obtain the coordinated immutable deployment URL/revision and verify its manifest/image presentation matches these hashes, then repeat the state/location and carousel/lightbox checks on that deployed revision.

Evidence directory: audit/image-update-qa-handoff-2026-09-16 . Full implementation logs remain in work/qa/owner-image-rollout/; collector and additional runtime scripts remain in work/qa/image-qa-handoff/.
