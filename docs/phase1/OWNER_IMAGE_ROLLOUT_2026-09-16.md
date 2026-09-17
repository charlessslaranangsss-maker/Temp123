# Temporary123 — owner-delegated available-photo rollout

## Result and environment

Implemented in the local source and accepted against the frozen production compilation at http://127.0.0.1:4201. No new Vercel deployment, canonical-domain cutover, indexing change or inquiry submission was performed by this task. The public alias must not be assumed to contain this revision.

The local audit at 2026-09-16T08:48:31.395Z enumerated all 548 Service Areas routes and all 50 states in both map presentations (100 modal presentations). All 648 audit records passed. Photo/reference-bearing pages increased from 150 to 510; placeholders decreased from 398 to 38. States with pictures/references increased from 23 to 42; eight states remain pending for modular-kitchen photography.

PASS means the displayed reference is correctly assigned or a required placeholder is truthful. It is not a certification of the pictured unit's technical specification or accessibility.

## Latest authorization and decisions

Charles delegated choosing suitable existing imagery using the supplied equipment names and visual review. This supersedes the former requirement to await another heading/image-policy decision for every generic location title. It does not authorize inventing dimensions or converting a different form factor into the requested equipment.

April's specific instructions remain unchanged: one usable photo is enough; 20ft refrigerated container uses exactly one shared interior and no exterior; 20ft refrigerated trailer uses all five Drive references (two interiors, then three exterior/fleet references); two-stall sleeper uses interior references 24.01 and 24.08.

Broad titles now show explicitly named equipment options in separate carousels. The existing H1s remain unchanged. The 36 laundry pages separately show a 30ft laundry-trailer interior and a 20ft laundry-container set. The 289 hub/directory/man-camp pages show context-appropriate, labelled equipment options rather than a mixed-family carousel or an arbitrary unlabelled hero.

The existing branded image labelled Shower and Restroom Facilities ADA Room is now used on 35 generic ADA-title pages as a catalogue reference. Its caption explicitly states that the accessible room and ramp arrangement are not shown. No exact 3+1 or 8+1 ADA product, length, stall configuration or compliance claim is inferred. Exact ADA product requests remain open.

The client-named 30ft laundry, 20ft contractor and 20ft VIP collections now supply narrowly selected references. Contractor and VIP trailer pages use interior-only views; modular contractor exteriors are not shown as wheeled trailer exteriors. The private VIP room, two-bunk room, four-bed room and four-room wheeled trailer remain separate.

The 24ft kitchen location gallery starts with the wide interior instead of the range close-up. Shower reference captions identify the 20ft/five-stall unit and distinguish it from the separately advertised 22ft/ten-stall option.

## Implementation files

- content/equipment-photo-policy.json: version 3, delegated selection rules and explicit reference-use approvals.
- scripts/build-location-image-manifest.py and content/verified-equipment-images.json: reproducible approvals and opening-slide order; 154 use records for 153 source/catalog references, 108 approved uses and 46 held uses. No new original photos downloaded.
- src/locationCarouselImages.ts and src/LocationImageCarousel.tsx: exact single-equipment selection plus separate, visible equipment groups for recognized broad headings.
- src/equipmentPhotoPolicy.ts: minimum-photo rule and truthful reference captions.
- src/ServiceHeroCarousel.tsx: unique per-instance control IDs when the same model appears on a page and in its state dialog.
- src/location-image-gallery.css: bounded responsive option cards and carousel controls.
- src/serviceHeroImages.ts, src/ServiceDetail.tsx and src/ApprovedEquipmentPhotoOptions.tsx: named service-page references and labelled category photography.
- scripts/audit-service-area-images.ts: validates every group's actual src/srcset/original, identity, labels, ordering and duplicate hashes; retains baseline SEO/route comparisons.
- tests/ownerImageRollout.test.tsx and tests/browser/owner-image-rollout.spec.ts: delegated-selection tests; related location/April/browser assertions updated for separate groups.

## Verification

- TypeScript passed.
- 94 focused unit/component/policy tests passed.
- 44 application tests passed (15-second test timeout, two workers).
- 29 browser tests passed, including all 100 state presentations, every assigned modal image decoding, multi-gallery navigation and cleanup, desktop/mobile layouts, full-image lightboxes, reduced motion, April refrigeration rules and calculator regressions.
- Production compilation and prerender generated 651 pages plus 404, still draft/noindex. Existing non-fatal JSON import and third-party Rollup annotation warnings remain.
- All 548 Service Areas paths returned HTTP 200 from the tested local compilation; all 648 route/modal audit entries passed with zero assigned broken image paths.
- H1s, document titles, head metadata, canonical tags, robots directives and sitemaps matched the preserved baseline. Image structured-data references appropriately track the new visible hero.
- Prettier checks and git diff whitespace checks passed. No dedicated lint script is configured.
- Visual review of the 1440px and 390px laundry option layouts confirmed readable, separate cards and usable controls. Other browser engine/native-device behavior remains outside this Chromium run.

Evidence is in work/qa/owner-image-rollout/: manifest.log, typecheck.log, unit-tests.log, app-tests.log, build.log, browser.log, route-audit.log, format-check.log and screenshots. The frozen source identity is snapshot.json. The exhaustive audit is saved as audit/owner-image-rollout-2026-09-16.csv and .json, with a separate summary.

## Remaining work

The 38 Service Areas placeholders are commercial modular-kitchen headings. No suitable actual modular-kitchen photo was found; a kitchen-trailer image is not substituted. The wider equipment tracker also retains exact-model/feature requests such as 3+1/8+1 ADA, 22ft ten-stall shower, all-electric kitchen, unsupported lengths and hands-free operation.

The revised April tracker has 42 retained equipment entries: 26 with available/approved references, 11 needing one suitable photo or clearance of an existing hold, and five needing a remaining product/photo decision. Close R25, R32, R33, R08 and R09 for reference-image use, not as independent specification validation. Sixteen active equipment requests remain.

The coordinator owns the combined release and independent live acceptance. Do not publish unrelated dirty files or turn on indexing from this image task. After the reviewed revision is deployed, verify the exact deployed build and representative pages, both map layouts and lightboxes.
