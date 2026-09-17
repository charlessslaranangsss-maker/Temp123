# Temporary123 — gallery ordering follow-up / QA handoff

Status: source ordering safeguards and full local validation complete. Independent re-review pending. NO COMMIT, PUSH OR DEPLOYMENT.

## Corrected QA target
- Repository: C:\Users\Charles\Documents\New project\Temporary 123
- Branch: main; base HEAD: 8ad98dba33ef6d9b7b1e64028da3fc639bd7fd9a (image changes remain uncommitted).
- NEW frozen build: .temp/image-order-followup-20260916/dist
- NEW local URL: http://127.0.0.1:4203/service-areas/
- Original 4201 build and original handoff retained; all 548 original Service Areas HTML hashes still match that handoff.
- Manifest SHA-256: e2b4f1adca1fe28ee564673ee73a703e2f9df021d4eaf5f100258fc51bb3f11c
- Photo-policy SHA-256 (UNCHANGED): a6d254484922a68e1f1974a6d2f6952e84091625fc07005f7e143efd8ef070ad
- Ordering-revision source fingerprint: f2270831321d02243f6778d4a27559f6a3b6d1d0f16d2fcd4ab07bd712d13c98
- Exact per-file hashes: files-and-revision.json. No immutable Vercel URL/ID exists for this follow-up.

## What the visual recheck established
The two reported filename-based examples are not physical interior-after-exterior violations. Filenames are misleading and were not renamed or used to misclassify the image:
- model-21 / 21.04, private-shower-trailer-stall-interior.png: EXTERIOR sink bank, with trailer rear lights/stabilizers and warehouse floor visible.
- model-21 / 21.08, shower-trailer-sink-and-mirror-area.png: EXTERIOR-access sink bank, not an enclosed room.
- model-10 / 10.06, luxury-shower-restroom-trailer-private-shower-stall.png: EXTERIOR doors, wheels and steps.
- model-10 / 10.05, luxury-6-stall-shower-restroom-trailer-entry-steps.png: actual INTERIOR shower/toilet photo despite its filename.

Actual preserved model-21 sequence: 21.01 INTERIOR; 21.02, 21.04, 21.05, 21.07, 21.08 EXTERIOR.
Actual preserved model-10 sequence: 10.05, 10.07 INTERIOR; 10.01, 10.02, 10.06 EXTERIOR.

All 113 distinct assigned full-image paths were visually checked. The broader sweep found one genuine view-label defect: the external handwashing-trailer image /images/service-heroes/handwashing-sink-trailer/01-960.webp was labelled detail (displayed as Interior detail). Its view is now exterior. Its image bytes, equipment selection and caption/alt text were preserved.

## Source changes
- src/galleryImageOrder.ts: shared pure stable ordering (interior, interior detail, exterior, then plans).
- src/ServiceHeroCarousel.tsx: applies ordering at the render boundary, so unsorted callers cannot interleave views; slides, thumbnails and lightbox indices use one sequence.
- src/locationCarouselImages.ts and src/serviceHeroImages.ts: use the shared order definition; external handwashing view label corrected.
- scripts/build-location-image-manifest.py / content/verified-equipment-images.json: source array canonicalized by model/view, manifest v4. Every image/model record is unchanged when compared by ID; only array order/version changed.
- scripts/audit-gallery-order.mjs: independent complete rendered-gallery audit against hash-pinned visual review; does not import the resolver/sorter.
- tests/galleryImageOrder.test.tsx and tests/browser/gallery-order-followup.spec.ts: permutations, direct unsorted renderer calls, named-file evidence, all modal presentations and full-image sequence checks.

## Exhaustive audit scope and results
- All 651 registered routes enumerated and fetched locally.
- Service Areas: 648 records = 548 routes + 100 state-modal presentations.
- Ordering is checked within EACH separate equipment carousel, not across a flattened list of unrelated gallery groups.
- All assigned galleries: 1276 separate carousel instances; 5280 slide instances.
- Service Areas subset: 1250 carousel groups and 5169 slide instances.
- 256 assigned original/responsive asset paths fetched; image bytes match the original frozen build.
- Physical interior-before-exterior failures: 0. Presentation failures: 0. General errors: 0.
- Effective gallery order changes versus 4201: 0. View-label correction applies to 1 gallery. This is ordering hardening plus a view-label correction, not a claim that the misleadingly named images were real interiors.
- Image selections, identities, categories, captions, alt text, held cases, H1s, titles, head metadata, canonicals, robots and sitemaps preserved by comparisons.
- Held Service Areas pages: 38; held modal presentations: 16 (eight states in two layouts). ADA/sleeper/refrigeration reference limitations unchanged.
- 99 focused tests, 44 application tests and 32 browser tests passed. Production build: 651 pages plus 404, draft/noindex; existing non-fatal warnings remain.
- Additional physical-view browser sweep: 100 modal presentations; 28 distinct gallery sequences traversed in the uncropped lightbox; no recorded exceptions, same-origin failure responses or POSTs.

## Files for independent QA
- route-modal-inventory.csv: every Service Areas page/modal; group slides now include position, physical view, declared view, filename, hash and visual basis.
- assigned-slide-order.csv: one row per slide instance; makes interior/exterior boundaries explicit.
- all-assigned-gallery-order.csv: every assigned carousel, including non-Service-Areas equipment galleries; first exterior and last interior positions.
- other-carousel-routes.csv: complete additional equipment-route regression scope.
- visual-view-review.json and assigned-01.jpg through assigned-10.jpg: all reviewed image files and visual evidence.
- held-images.csv, summary.json, inventory.json, files-and-revision.json, browser-view-order-evidence.json.

## Release restriction
No commit, push, deployment, Vercel project creation, live-acceptance claim or indexing change. The original 4201 snapshot is retained for comparison; re-review the new 4203 revision. Only an explicitly coordinated later release to the EXISTING temp123-nine project may proceed, with a separately verified immutable deployment URL/revision and independent live QA.

Implementation logs: work/qa/image-order-followup-20260916/. Native iOS Safari and other browser engines remain untested. Existing photo-identity/specification caveats are not closed by this ordering audit.
