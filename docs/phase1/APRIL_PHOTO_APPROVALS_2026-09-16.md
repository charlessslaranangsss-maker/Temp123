# April photo-use clarification — 16 September 2026

Status: implemented and verified locally. No new deployment or indexing change.

## Latest authorized instructions
- One matching usable photo is sufficient: interior-only and exterior-only sets are accepted. Missing extra angles are optional, not a no-photo condition.
- 20ft refrigerated container: exactly one existing refrigerated interior from the trailer folder; no exterior. Explicit narrow owner approval for this shared reference, not blanket cross-family reuse.
- 20ft refrigerated trailer: all five supplied Drive photos, with the two interiors first and three exterior/fleet reference images after. This latest instruction supersedes the earlier interior-only trailer plan.
- Two-stall sleeper: use two existing owner-designated bunk-room interior views, 24.01 and 24.08. Do not mix a different four-bunk room, container-on-flatbed exterior or four-room wheeled trailer. No overall length inferred.

## Implementation
- content/equipment-photo-policy.json records the exact instructions and per-use approval IDs. The manifest generator applies these decisions reproducibly.
- The 20ft trailer route now uses the centralized five-image set. The container has an inside-only section on /equipment-rental/refrigeration/#20ft-refrigerated-container; no new route was invented and the existing 40ft container page was not changed.
- Generic sleeper location headings now select the approved two-stall interior set: 39 dedicated pages and seven state selections, each in both map layouts. The four-room exterior is retained as a separate configuration.
- Truthful captions distinguish approved shared/reference use from independently photographed exact-unit evidence. Approval of imagery is not evidence of physical dimensions or technical specifications.
- Existing one-image and interior-only rendering remains accepted. Added explicit minimum-photo coverage helper and regression tests.

## Verification
- TypeScript: passed. Focused image, policy and component unit tests: 85 passed.
- Application tests: 44 passed with 15-second timeout and two workers.
- Production build/prerender: 651 pages plus 404, draft/noindex.
- Final browser run: 26 passed, including refrigeration galleries, full-image lightboxes, two-stall sleeper, 100 state modal presentations, responsive layouts, state resets, reduced motion, carousel and calculator regressions.
- Exhaustive service-area audit: 548 routes plus 100 modal presentations, 648 PASS and 0 FAIL; no broken assigned image paths. H1s, document titles, head metadata, canonicals, robots and sitemaps compared unchanged to the audit baseline.
- First browser run had one invalid numeric-ID CSS selector in the new test; corrected to an attribute selector and the full run passed. Both logs are retained.
- Classified physical source/catalog references: 153. Image-use records: 154, including the explicitly shared refrigeration interior. Approved use records: 104; held use records: 50.
- Source drift versus the frozen source snapshot: []

## Revised April tracker
42 equipment entries: 21 have usable imagery; 11 still need one usable matching photo or clearance of an existing hold; 10 need product/photo confirmation. The active checklist therefore contains 21 tasks rather than the previous 37. Original request IDs are retained. R03 two-stall sleeper, R21 trailer and R22 container are closed for their approved image uses.

Service-area coverage remains 150 photo-bearing pages and 398 safe placeholders. The remaining 73 ADA/modular-kitchen photo-family gaps and 325 heading/policy decisions were not overridden by a one-photo minimum.

## Environment and remaining boundary
Verified local preview: http://127.0.0.1:4199 . The older port 4197 preview was not rebuilt by this task. No Vercel publication, canonical-domain release, SEO/indexing submission or contact request was performed. Other uncommitted work remains preserved for the coordinated release.

Evidence: audit/april-approved-service-area-images.csv and .json; work/qa/april-approval-implementation/build.log, app-tests.log, image-tests.log, browser-final.log, browser-evidence.json, route-audit.log.
