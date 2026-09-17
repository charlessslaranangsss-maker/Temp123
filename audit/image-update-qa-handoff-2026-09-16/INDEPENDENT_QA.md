# Independent image QA — 16 September 2026

Status: **Local image-mapping and classified presentation-order QA passed; public release not verified.**

## Reviewed target

- Frozen build: `.temp/owner-image-rollout-20260916/dist`, served at `http://127.0.0.1:4201/`.
- Base HEAD `8ad98dba33ef6d9b7b1e64028da3fc639bd7fd9a`; image changes are uncommitted. This SHA alone is not the reviewed revision. Exact file hashes are in `files-and-revision.json`.
- Scope enumerated by `route-modal-inventory.csv`: 548 Service Areas URLs, 50 full-map state presentations, and 50 compact-map state presentations (648 records). Modal records share host URLs; they are not additional routes.

## Independent checks and result

- Fetched all 549 unique host URLs represented by the audit inventory: all returned HTTP 200 locally.
- Compared all 648 rendered page/modal presentations against their assigned titles, equipment groups and models, ordered image review IDs, image sources and alt text, limitation captions, and held-image fallbacks: **648 matched, 0 recorded mismatches**. The check covered 5,169 slide instances.
- All 77 assigned image asset paths returned HTTP 200 with image content types.
- The reviewer visually inspected the approved source-image groups and found no definite wrong-equipment-family image. Browser samples at desktop and phone widths showed first images loaded and galleries within the viewport, including shower-only, ADA catalogue, laundry trailer/container, held-image, and refrigeration cases.
- The two-stall sleeper uses interior references only; the generic ADA catalogue image is explicitly qualified as not proving an exact accessible-room/ramp configuration.

## Presentation-order recheck

The filename-only heuristic initially flagged possible order defects, but this was a false positive. The reviewed image classification identifies `21.04` (despite its `interior` filename) as external handwashing sinks, `21.08` as externally accessible sinks and mirrors, and `10.06` (despite its `private-shower-stall` filename) as exterior entrances. I rechecked all 5,169 slide instances in all 648 presentations against the visually reviewed `audit/service-area-image-classification.csv`; every ID had a classification, and **zero** galleries place an approved interior view after an approved exterior view. The earlier correction request to the updater should be disregarded. This remains classification-dependent; visual browser inspection was sampled, not exhaustive for every slide.

## Open evidence holds

- **38 dedicated pages across eight states** still have no approved matching commercial modular-kitchen photography and retain an explicit pending-image fallback: Arkansas, Maine, Maryland, Montana, North Carolina, South Carolina, Tennessee, Utah. Related state-map selections are held. These are content/asset holds, not a case for substituting unrelated photography.
- The generic ADA catalogue image does not prove an exact 3+1 or 8+1 configuration or accessible ramp/room. Exact variants remain unverified.
- Two-stall sleeper interior photos do not prove the trailer exterior, chassis, or exact physical layout. Refrigeration fleet/support exteriors do not prove a specific 20-ft unit; the 20-ft container has only a labeled shared interior reference and no exterior.
- Image approval alone does not verify claimed dimensions, stall or machine counts, capacity, or site-specific operational claims. Keep limitation captions until source evidence is supplied.

## Release boundary

This is **not** a sign-off for `temp123-nine.vercel.app`. The updater confirmed no deployment of this revision and no immutable Vercel deployment ID/URL. Its 10-URL comparison found the public alias still showing the older image presentation. Also, the independent browser interaction and visual pass sampled representative routes; it did not manually click every slide on every route. The 26 other shared-carousel routes were outside this exhaustive Service Areas mapping audit and require normal release-regression checks.

Next: coordinate an exact revision and deploy to the **existing** Vercel project, then rerun the mapping and representative desktop/phone interaction checks against its immutable URL and the public alias. Do not represent held photographs or unverified equipment specifications as complete.
