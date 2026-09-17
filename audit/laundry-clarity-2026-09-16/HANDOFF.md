# Laundry product separation — independent QA follow-up

Status: implemented and verified on a new frozen LOCAL candidate. Independent review pending. No commit, push or deployment.

## Decision and exact scope

Broad Laundry Temporary Facilities titles intentionally show two separately labelled product options within the existing image area. They are not one model, one combined unit or one mixed carousel. Exact Laundry Trailer and Laundry Container titles continue to select their own product. No new hero, directory or category photo section was added; the earlier placement correction remains intact.

The 50 flagged audit records comprise 36 dedicated state/regional pages and seven states in each map layout (14 modal presentations). The states are Indiana, Kentucky, Michigan, Minnesota, Oklahoma, Oregon and Wyoming. The exact affected inventory is in audit/laundry-clarity-2026-09-16/laundry-50-rows.json.

| Product heading | Family / model | Images |
| --- | --- | --- |
| 30 ft Laundry Trailer | laundry-trailer / model-08 | Review 08.01; one interior |
| 20 ft Laundry Container | laundry-container / model-06 | Reviews 06.01, 06.02 and 06.03; three interiors |

These are the SAME four original files as before the follow-up. No photo was reassigned, added, removed or used to infer a new specification. The trailer's reference status and unit-length/machine-count qualification remain explicit.

## Actual corrections

- The existing broad-laundry gallery introduction explicitly says these are two product options, each with its own labelled gallery, not one combined unit. Existing product headings remain visible.
- Both product captions now explicitly distinguish the trailer from the container. Container captions state that no exterior is pictured.
- The full-image viewer retains the selected product's visible heading, accessible dialog name and reference caption. Next/previous stays inside that product's image set; the single trailer image has no unnecessary next/previous controls. Product identity is cleared on close and when switching to a different equipment gallery. Original images remain uncropped with object-fit contain.
- Trailer review 08.01 now has the alt text: Laundry trailer interior reference with washing machines, dryers and a central aisle. All three existing container alts already identify the container and were preserved.
- The report generator now emits presentation, groupCount and imageGroups with separate title/family/model/files/review IDs/alts/view counts/caption for each product. Aggregate assignedFiles remains a page/modal inventory, not a single-carousel assertion.
- Grouped rows now say Intentional separately labelled equipment options and name both products. The misleading single verified title-matched model description is no longer generated for these rows. The same reporting fix handles other intentionally grouped contexts accurately.

Historical audit/image-placement-revert-2026-09-16/acceptance.json and its frozen build were not overwritten. A LAUNDRY_AUDIT_ERRATA.md sidecar identifies the old wording problem. Use the NEW evidence below for review.

## Verification

- TypeScript, JavaScript syntax, formatting and whitespace checks passed. There is no dedicated project lint command.
- 164 focused image/policy/order/placement tests passed, including concrete checks for every flagged row. An initial new-test tuple typing error was fixed; the final type check and build passed. Initial and final logs are retained.
- 44 application tests passed with one worker and a 30-second timeout.
- Production build generated 651 pages plus 404 in draft/noindex mode. Existing nonfatal JSON import/dependency annotation warnings remain in the build log.
- 34 Chromium browser tests passed. Every flagged row was exercised at 1440px and 390px: 100 targeted presentations and 400 original-image display checks (four unique images reused across the contexts, NOT 400 unique photographs). Product identity, image source and alt text, captions, uncropped viewing, within-product wraparound, close/reset and stale-context cleanup passed.
- All 100 state-modal presentations were also covered by the existing map regression tests. Removed unsolicited hub/directory/category galleries remain absent.
- The full Service Areas audit passed all 548 routes plus 100 modal presentations: 648 PASS, 0 FAIL, no broken assigned image paths. H1s, titles, head metadata, canonicals, robots and sitemaps match the stored baseline.
- All 548 Service Areas HTML files and the served carousel script in the OLD port-4205 build remain byte-identical. All image identity, order, approval and held records are unchanged; only the one trailer alt changed in the manifest.

Coverage remains 263 pages with photos/references, 247 intentionally without an image section and 38 modular-kitchen placeholders; eight states still have the documented photography hold. This follow-up does not close those holds or independently certify equipment dimensions/configurations.

## Exact review target and files

- Repository: C:/Users/Charles/Documents/New project/Temporary 123
- Branch: main; base HEAD: 8ad98dba33ef6d9b7b1e64028da3fc639bd7fd9a. These image changes are uncommitted; HEAD alone does not contain them.
- New frozen build: .temp/laundry-clarity-20260916/dist
- Local review URL: http://127.0.0.1:4207/service-areas/alabama/central-alabama/
- Image-lane source fingerprint: 4640b6077785c8efe9500f2af6eb2a99196af53c8dc47942b7cadae257f0cebc
- Manifest SHA-256: 77fb4db6af4efab4c22d2b75556aad90c3e391ec5bc2baf0742a5a102d734617

Changed runtime/data files: content/equipment-photo-policy.json, content/verified-equipment-images.json, src/LocationImageCarousel.tsx, src/ServiceHeroCarousel.tsx, src/equipmentPhotoPolicy.ts, public/service-hero-carousel.js and src/service-hero-carousel.css.

Audit/test changes: scripts/audit-service-area-images.ts; new scripts/gallery-audit-description.ts, tests/laundryGalleryClarity.test.tsx and tests/browser/laundry-gallery-clarity.spec.ts. Exact file hashes are in summary.json.

Evidence directory: audit/laundry-clarity-2026-09-16/

- acceptance.json / acceptance.csv / acceptance-summary.json: all 648 records and per-product grouping.
- laundry-50-rows.json: complete affected inventory and corrected descriptions.
- laundry-browser.json: all 100 targeted desktop/mobile presentations.
- summary.json: file hashes, source revision, counts and concurrent-edit boundary.
- lightbox-trailer-1440.png, lightbox-container-1440.png, lightbox-trailer-390.png, lightbox-container-390.png: visually reviewed examples.

Full command logs and baseline backups: work/qa/laundry-clarity-20260916/.

## Remaining review boundary

No deployment or live QA was performed. Review port 4207 for THIS correction; port 4205 deliberately retains the earlier candidate. Native Safari/non-Chromium and physical-device testing remain unverified.

Two unrelated changes appeared in the shared working tree AFTER this candidate was frozen: a missing-space correction in src/CityDirectoryPage.tsx and city-link wording in src/regionGuides.tsx. Their exact diffs/hashes were checked and recorded in summary.json, and the changes were preserved. They do not alter this image assignment, but their combined runtime has NOT been validated by this frozen-build report. A later integration/release gate must include them. All image-lane files still match the tested candidate.
