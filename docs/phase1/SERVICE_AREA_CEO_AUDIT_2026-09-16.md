# Temporary123 — Independent Service Areas Image and SEO Audit

Audit completed: 2026-09-16T06:43:54.917Z

## Executive finding

**Image-family matching passes on the audited Vercel preview. Photography coverage is not complete, and canonical-domain launch readiness is not established.**

The fresh local build and public Vercel preview were audited independently of the application resolver. Every actual slide URL, full-size original, responsive source set, image label, source hash, family and model was checked against the reviewed image identities. A safe placeholder is recorded separately from a page with matching photographs, not counted as completed photography.

## Scope and evidence

| Check | Current result |
|---|---|
| Dedicated Service Areas URLs | 548 enumerated in the fresh build and checked over live HTTP |
| Live URL responses | 548 HTTP 200 |
| Photo-bearing pages | 150; no wrong-family or mixed-model image sets detected |
| Actual photo gaps | 73 pages: ADA combinations and modular kitchens |
| Heading/image-policy decisions | 325 pages; not 325 requests for new photos |
| State selections | 50; each tested on the Service Areas map and mobile homepage map |
| Live modal runtime checks | 100 presentations; 0 failures |
| Live responsive page checks | 22 visits across 1440px and 390px layouts; 0 failures |
| Distinct photographs actually displayed | 17; visually rechecked from local source images/contact sheets |
| Live original/responsive image files | 51 HTTP and exact-byte comparisons; 0 failures |
| Current source/manifest integrity | 153 classified source/catalog records rechecked by hash; 74 focused unit tests passed |
| Fresh production compilation/prerender | Passed: 651 pages plus 404, still draft/noindex |
| Live preview indexing state | 548 noindex pages; 0 canonical tags |

State photography breakdown: 23 states have matching images, 13 states need actual photography, and 14 states need heading/image-policy decisions. The latter two categories produce the previously reported 27 pending states. The same sets are used in both map layouts.

## Equipment-to-page coverage

| Heading family | Pages | States | Treatment |
|---|---:|---:|---|
| unspecified | 289 | 7 | Title/policy decision |
| shower-trailer | 40 | 6 | Matching photo set |
| laundry-unspecified | 36 | 7 | Title/policy decision |
| kitchen-modular | 38 | 8 | Verified photographs needed |
| ada-combination | 35 | 5 | Verified photographs needed |
| mobile-kitchen | 38 | 7 | Matching photo set |
| sleeper-trailer | 39 | 7 | Matching photo set |
| shower-restroom-combination | 33 | 3 | Matching photo set |

The 97 approved images in the broader library are not all displayed on Service Areas pages. The current headings select four isolated model sets totaling 17 distinct photos. Approval of an image does not make it suitable for every page in the same broad family.

## Photos and decisions needed

### Verified ADA shower-restroom combination unit

Affected: 35 pages / 5 state selections. State pages are included in page totals; modal presentations are additional interfaces, not additional URLs.

Uncropped exterior showing the actual access arrangement; interior showing the shower, toilet, basin and room layout; owner-confirmed unit/model and approved specification record.

Standard combination images and an ADA marketing label alone are not sufficient independent model/access evidence.

### Commercial modular kitchen building

Affected: 38 pages / 8 state selections. State pages are included in page totals; modal presentations are additional interfaces, not additional URLs.

Whole-building exterior and wide kitchen interior/cooking, preparation and washing views of the same modular unit. Confirm the offered product and its model.

Current kitchen-trailer images are a different form factor from these headings.

### Interior of the displayed four-room wheeled sleeper trailer

Affected: 39 pages / 7 state selections. State pages are included in page totals; modal presentations are additional interfaces, not additional URLs.

Wide sleeping-room/bunk-bed interiors explicitly tied to the same trailer as review image 23.09; confirm room configuration and unit identity.

Current sleeper pages safely show one exterior only. Repeated contractor/VIP/container interiors cannot be borrowed.

### Flagship 22 ft, 10-stall shower-only trailer

Affected: 40 pages / 6 state selections. State pages are included in page totals; modal presentations are additional interfaces, not additional URLs.

Owner-confirmed exterior and shower-only interior views of the 22 ft, 10-stall unit, including its sink area; alternatively approve an accurate label explaining the existing 20 ft, five-stall reference set.

The current photos match generic shower-trailer headings, but supporting copy/links mention a different 22 ft, 10-stall option. This is context ambiguity, not a wrong-family error.

### Laundry Temporary Facilities headings

Affected: 36 pages / 7 state selections. State pages are included in page totals; modal presentations are additional interfaces, not additional URLs.

Decide whether these pages describe trailers or containers. Both library families already have approved photos; confirm model identity for any explicit length/count.

The title-only rule currently cannot select one form factor safely.

### Generic hub, city-directory and man-camp headings

Affected: 289 pages / 7 state selections. State pages are included in page totals; modal presentations are additional interfaces, not additional URLs.

Approve appropriate image treatment or a specific equipment intent without inventing a product claim or rewriting valid directory headings just to fit photos.

These headings intentionally or ambiguously cover more than one equipment family. New photos alone do not resolve the title-only rule.

For broad location headings, a confirmed model set can support multiple relevant locations. No separate state-by-state photo shoot is required by the implemented mapping. Model numbers, dimensions and configuration claims must come from the owner/product records, not guesses from a photo.

The 289 unspecified pages comprise 246 city directories, 1 nationwide hub, and 42 man-camp pages. Do not rewrite legitimate directory headings merely to force a photograph into the page.

## Further findings and priority

**High — Resolve the two actual missing families.** Obtain verified ADA-combination and modular-kitchen assets or confirm whether the corresponding advertised product descriptions are correct. This addresses 73 pages and 13 states without borrowing another equipment family.

**High — Resolve the title/policy decision set.** The 36 laundry headings do not distinguish trailer from container. The other 289 are generic directory/hub/man-camp headings. Changing filenames or downloading more photos does not solve this ambiguity.

**Medium — Identify the shower model near its gallery.** All 40 shower-title pages currently use the reviewed 20 ft / five-stall source set while supporting page copy or links mention the 22 ft / 10-stall option. The generic H1 matches the photo family; this is a potential customer-context ambiguity, not a detected wrong-family image. Supply the flagship model photos or label the reference model accurately, without pretending the 20 ft images prove the 22 ft specification.

**Medium — Complete the sleeper gallery.** The 39 sleeper-title pages have a single approved exterior. It visibly shows a wheeled sleeper and a bunk room, but it does not establish a complete matched interior set or overall length. Do not substitute a container being carried on a separate flatbed.

**Medium — Improve the kitchen opening slide.** The 38 kitchen-title pages currently start with a close view of the range. It is relevant and correctly classified as an interior view. A reviewed wide interior would explain the rentable space better while retaining interior-before-exterior ordering. This is a presentation recommendation, not a category mismatch.

**Before production indexing — Check social-preview image generation.** scripts/prerender.tsx:293-295 still selects legacy region.image for a regional og:image when a canonical is emitted, rather than the new verified hero. The present noindex preview does not emit those regional OG images. This is a confirmed source-code dependency and a future-release risk, not a current live-preview image mismatch. Validate and align it before enabling production canonicals; do not silently change indexing gates during an image audit.

## Live/canonical distinction

The Vercel preview at https://temp123-nine.vercel.app already serves the corrected title-driven gallery during this audit. This is newly observed live evidence; the earlier local-only report is no longer the complete deployment picture. This audit did not deploy it and has not established the deployment ID or who published it.

| Canonical-domain sample | Observed HTTP |
|---|---:|
| /service-areas/ | 404 |
| /service-areas/alabama/ | 301 |
| /service-areas/california/ | 301 |
| /service-areas/texas/ | 301 |
| /service-areas/washington/olympic-peninsula/port-angeles/ | 404 |
| /service-areas/washington/puget-sound/tacoma/ | 404 |

These are six canonical-domain samples, not a crawl of every canonical URL. Do not equate a working Vercel preview with successful migration of temporary123.com. The noindex preview controls were left unchanged.

## Browser acceptance

All 100 state presentations were opened through real map/list controls. Each assigned slide was decoded, labels and actual image paths were compared, navigation was exercised, and closing cleared the old gallery. State switching/reopening, complete uncropped lightboxes above an expanded map and state dialog, close/previous/next/Escape/outside click, keyboard focus containment, desktop/mobile centering, the real 5.5-second autoplay interval, interaction pause and reduced-motion controls passed.

Recorded page exceptions: 0. Failed same-origin assets: 0. Unexpected contact submissions: 0. Native iOS Safari and other non-Chromium engines were not tested.

## SEO evidence boundaries

Google describes image relevance using page context, captions and descriptive alt text, not the H1 alone. The strict title-only selector is this project’s business rule, not a Google requirement. Actual image identity, truthful copy and complete product context therefore remain separate acceptance concerns. No rankings, Google indexing outcomes, authority metrics, traffic uplift or Core Web Vitals score were inferred.

Primary guidance consulted: https://developers.google.com/search/docs/appearance/google-images and https://developers.google.com/search/docs/crawling-indexing/block-indexing .

## Artifacts and changes

- audit/service-area-ceo-audit-2026-09-16.csv: every page and modal in both local and live environments, 1,296 rows; exact title, actual assigned files, status, counts and issues.
- audit/service-area-ceo-photo-needs-2026-09-16.csv: prioritized photo/owner-decision list.
- audit/service-area-ceo-audit-2026-09-16-summary.json: measured totals and canonical probes.
- audit/service-area-ceo-browser-2026-09-16.json: live browser evidence.
- work/qa/service-area-ceo-audit-20260916/: standalone independent audit scripts, source snapshot fingerprints, logs and screenshots.

Only audit/report/coordination artifacts were changed by this audit. Website source, URLs, H1s, metadata, indexing flags and published assets were not edited. No deployment, URL submission or contact request was performed.

Files changed by concurrent work after the frozen source snapshot: none in the recorded source/configuration set. These are observed differences, not changes made by this audit.

**Decision: accept the audited image-family routing and carousel behavior; keep photography coverage and canonical-domain launch as separate open workstreams.**
