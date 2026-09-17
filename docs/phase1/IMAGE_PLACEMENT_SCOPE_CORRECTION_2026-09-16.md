# Temporary123 — photo-placement scope correction

Implemented and verified locally on 16 September 2026. Not committed or deployed.

Charles clarified that he requested image updates, not additional photography sections or layout expansion. This supersedes the earlier assistant decision to add imagery wherever a gallery could be rendered.

## Reverted

- /service-areas/: removed the gallery beneath the H1 alongside the map. Kept the original heading, introduction, coverage summary and map.
- All 246 city-directory pages: removed injected galleries and restored the original directory layout. No replacement placeholder or empty photo box.
- Six generic equipment category overviews: removed unsolicited photo-option sections for mobile kitchens, dishwashing, showers, sleepers, laundry and shower/restroom combinations.

## Preserved

Existing state, regional, city and equipment photo positions; all 100 state-modal presentations; approved files/labels and image-selection policy; carousel/lightbox controls and ordering work. April's specifically requested 20ft container interior remains on the refrigeration hub, with no exterior. The 20ft trailer keeps all five Drive references; the two-stall sleeper retains its existing interiors. No other photo-use approval was revoked.

Runtime files changed: src/Site.tsx, src/CityDirectoryPage.tsx, src/ApprovedEquipmentPhotoOptions.tsx. Added placement regression tests and updated audit assertions so pages originally without photo positions are not classified as missing photography.

## QA target and results

- Repo: C:/Users/Charles/Documents/New project/Temporary 123; branch main; base HEAD 8ad98dba33ef6d9b7b1e64028da3fc639bd7fd9a. Changes remain uncommitted.
- Frozen preview: http://127.0.0.1:4205/service-areas/ from .temp/image-placement-revert-20260916/dist. Older previews are historical and unchanged.
- TypeScript/build passed; 651 pages plus 404. Focused tests: 110 passed. Browser tests: 31 passed, including all 100 modal presentations, desktop/mobile layouts and lightboxes.
- Application tests: initial archive-test timeout at 15 seconds; unchanged full serial rerun passed 44/44 at a 30-second limit (archive test completed in 5.7 seconds). Both logs preserved.
- All 548 Service Areas routes plus 100 modals audited: 648 PASS / 0 FAIL, no broken assigned image paths. H1s, non-image head metadata, canonicals, robots and sitemaps preserved.
- Service Areas: 263 pages display photographs or approved references; 247 navigation pages intentionally have no photo section; 38 modular-kitchen pages retain a photography placeholder. Do not count the 247 navigation pages as missing-photo requests.
- Verified desktop and mobile screenshots are in work/qa/image-placement-revert/. Complete current route/modal CSV and machine-readable evidence are in audit/image-placement-revert-2026-09-16/.

No publication, indexing submission or contact request. A new live deployment and its independent acceptance remain separate; a passing local build is not live QA.
