# Image carousel independent QA

## Scope and coordination

- Role: independent QA only. No source-code, content-data, deployment, or production changes are authorized in this task.
- Test target: the local rendered application after the implementation owner reports BUILD complete.
- Production publishing and form submission are out of scope.
- Required behavior: each service/trailer hero contains every valid image for that exact equipment configuration, ordered interior, exterior, then remaining; no category, model, size, or configuration mixing.

## Pre-change evidence

Captured before carousel implementation from the current repository state.

| Surface | Current image | Evidence | Result |
|---|---|---|---|
| Homepage — Shower Trailers | `/images/catalog/temporary-shower-trailers-960.webp` | The bitmap itself is labeled “Shower and Restroom Facilities — ADA Room.” It depicts a shower/sink combination room, not evidence for the shower-only 22 ft, 10-stall model. | **FAIL — wrong category/configuration mapping** |
| Homepage — Restroom Trailers | `/media/ce44e887e6e1812d2195e955.webp` | The bitmap itself is labeled “Shower and Restroom Facilities — ADA Room.” It depicts an accessible restroom inside the combination-facility image set. | **FAIL — wrong category/configuration mapping** |
| Homepage — Shower & Restroom Combinations | `/media/3ce3bc9f066f86f54836e1b3.webp` | Exterior view is labeled “Shower and Restroom Facilities — ADA Room” and shows the combination facility. | Category is relevant, but this is a single static image. |
| Shower equipment page | `/images/catalog/temporary-shower-trailers-960.webp` | Same combination/ADA image is used as the shower-only hero. | **FAIL — wrong category/configuration mapping; static hero** |
| Restroom equipment page | `/images/catalog/restroom-trailers-960.webp` | Exterior is visibly branded as a shower-and-restroom ADA facility. | **FAIL — wrong category/configuration mapping; static hero** |
| Service-detail pages | One `image` field per route in `content/service-details.json` | All shower-only and shower/restroom size variants currently reuse `/images/catalog/temporary-shower-trailers-960.webp`; other families likewise expose one static hero reference per route. | **FAIL — no per-model carousel; reuse creates configuration-mixing risk** |

Baseline source review also found one flat `equipmentPhotos` collection. It includes grouped families but does not identify pure shower-only or pure restroom-only groups, so it cannot safely be sliced or rotated across equipment pages without an explicit model/category manifest.

## Acceptance checks

Each route below must pass all of these checks after BUILD:

1. Exact relevance: every slide is supported for the exact category and, for model pages, exact size/configuration.
2. Completeness: all valid local images assigned to that exact model/category are present once; no duplicate slide paths.
3. Order: interior images first, exterior images second, then plans/remaining material.
4. Semantics: natural, specific alt text; decorative controls have accessible names; current slide/status is announced without noisy repetition.
5. Controls: visible previous/next controls where more than one image exists; usable with mouse, Enter/Space, and keyboard arrow keys where implemented.
6. Touch: horizontal swipe works without blocking normal vertical page scrolling.
7. Focus: controls have a clearly visible keyboard focus indicator.
8. Motion: reduced-motion preference removes nonessential animated transitions/autoplay. No forced autoplay is expected.
9. Responsive: no clipping, overlap, distorted aspect ratio, or horizontal document overflow at phone, tablet, and desktop widths.
10. Performance/stability: first hero image is promptly requested, later images do not all receive eager/high-priority loading, intrinsic dimensions or stable aspect ratio reserve space, and observed carousel interaction does not produce material layout shift.
11. Regression: one H1 remains; title, canonical, primary navigation, CTA links, and visible form structure remain unchanged by the carousel work.

## Verification matrix

Status legend: the `PENDING` labels below preserve the pre-build test plan. Final disposition after the explicit BUILD handoff is recorded in the execution record that follows the matrix.

### Homepage and equipment folders

| Page/category | Canonical route | Exact-image boundary | Status |
|---|---|---|---|
| Homepage cards | `/` | Each card must use only its named service family; Shower and Restroom require corrected mappings. | PENDING |
| Laundry trailers | `/equipment-rental/laundry-trailers/` | Laundry only | PENDING |
| Handwashing stations | `/equipment-rental/handwashing-stations/` | Portable handwashing stations only | PENDING |
| Classroom trailers | `/equipment-rental/classroom-trailers/` | Classroom only | PENDING |
| Restroom trailers | `/equipment-rental/restroom-trailers/` | Restroom-only evidence; no shower/restroom combination images | PENDING |
| Shower trailers | `/equipment-rental/shower-trailer/` | Shower-only 22 ft/10-stall fleet plus explicitly supported shower-container links; no combination/ADA restroom images | PENDING |
| Mobile sleep trailers | `/equipment-rental/mobile-sleep-trailers/` | Sleeper family only | PENDING |
| Mobile office trailers | `/equipment-rental/mobile-office-trailers/` | Mobile office only | PENDING |
| Modular command center trailers | `/equipment-rental/modular-command-center-trailers/` | Command-center family only | PENDING |
| Mobile crew camps | `/equipment-rental/mobile-crew-camps/` | Crew-camp/base-camp only | PENDING |
| Stair rentals | `/equipment-rental/stair-rentals/` | Stairs only | PENDING |
| Refrigeration trailers | `/equipment-rental/refrigeration/` | Refrigeration trailers only; do not mix containers unless explicitly identified | PENDING |
| Mobile kitchen trailers | `/equipment-rental/mobile-kitchen-trailers/` | Kitchen family only; category page may include supported sizes, never dishwashing | PENDING |
| Security camera trailers | `/equipment-rental/security-camera-trailers/` | Security-camera trailer only | PENDING |
| Refrigerated containers | `/equipment-rental/refrigerated-containers/` | Refrigerated container only; no trailer substitution | PENDING |
| Tent structures | `/equipment-rental/tent-structures/` | Tent structures only | PENDING |
| Ramp rentals | `/equipment-rental/ramp-rentals/` | Ramps only | PENDING |
| Wastewater/freshwater containers | `/equipment-rental/wastewater-and-freshwater-container/` | Water/wastewater equipment only | PENDING |
| Modular buildings | `/equipment-rental/modular-buildings/` | Modular buildings only | PENDING |
| Bunkhouse trailers | `/equipment-rental/bunkhouse-trailers/` | Bunkhouse only | PENDING |
| Fencing/barricades/receptacles | `/equipment-rental/fencing-barricades-trash-receptacles/` | Named site-equipment family only | PENDING |
| Generator trailers | `/equipment-rental/generator-trailers/` | Generator trailer only | PENDING |
| Dining structures | `/equipment-rental/dining-structure-rental/` | Dining structure only | PENDING |
| Breakroom trailers | `/equipment-rental/breakroom-trailer/` | Breakroom only | PENDING |

### Exact service/model pages

| Family | Canonical route | Exact-image boundary | Status |
|---|---|---|---|
| Mobile kitchen | `/services/mobile-kitchen-trailers/24ft/` | 24 ft only | PENDING |
| Mobile kitchen | `/services/mobile-kitchen-trailers/26ft-bulk/` | 26 ft bulk only | PENDING |
| Mobile kitchen | `/services/mobile-kitchen-trailers/28ft/` | 28 ft only | PENDING |
| Mobile kitchen | `/services/mobile-kitchen-trailers/38ft/` | 38 ft only | PENDING |
| Mobile kitchen | `/services/mobile-kitchen-trailers/40ft/` | 40 ft standard only | PENDING |
| Mobile kitchen | `/services/mobile-kitchen-trailers/40ft-combination/` | 40 ft combination only | PENDING |
| Mobile kitchen | `/services/mobile-kitchen-trailers/40ft-bulk-combination/` | 40 ft bulk combination only | PENDING |
| Dishwashing | `/services/dishwashing-trailers/22ft/` | 22 ft only | PENDING |
| Dishwashing | `/services/dishwashing-trailers/24ft/` | 24 ft only | PENDING |
| Dishwashing | `/services/dishwashing-trailers/26ft/` | 26 ft only | PENDING |
| Dishwashing | `/services/dishwashing-trailers/38ft-conveyor/` | 38 ft conveyor only | PENDING |
| Restroom | `/services/restroom-trailers/12ft/` | 12 ft restroom only | PENDING |
| Restroom | `/services/restroom-trailers/14ft/` | 14 ft restroom only | PENDING |
| Restroom | `/services/restroom-trailers/20ft/` | 20 ft restroom only | PENDING |
| Restroom | `/services/restroom-trailers/30ft/` | 30 ft restroom only | PENDING |
| Laundry | `/services/laundry-trailers/24ft/` | 24 ft only | PENDING |
| Laundry | `/services/laundry-trailers/30ft/` | 30 ft only | PENDING |
| Sleeper | `/services/mobile-sleeper-trailers/20ft-shared/` | 20 ft shared layout only | PENDING |
| Sleeper | `/services/mobile-sleeper-trailers/20ft-contractor/` | 20 ft contractor layout only | PENDING |
| Sleeper | `/services/mobile-sleeper-trailers/20ft-vip/` | 20 ft VIP layout only | PENDING |
| Refrigeration | `/equipment-rental-refrigeration-12ft-refrigerated-trailer/` | 12 ft trailer only | PENDING |
| Refrigeration | `/20ft-refrigeration-trailers/` | 20 ft trailer only | PENDING |
| Refrigeration | `/equipment-rental/refrigerated-containers/` | 40 ft container only | PENDING |
| Sleeper | `/remote-containerized-military-berthing-solution-for-rent/` | Containerized sleeper only | PENDING |
| Handwashing | `/services/handwashing-trailers/hands-free/` | Hands-free station only | PENDING |
| Shower | `/services/shower-trailers/22ft-10-stall/` | 22 ft, 10-stall shower-only model | PENDING |
| Shower/restroom combination | `/services/shower-restroom-combination-trailers/13ft-3-stall/` | 13 ft, 3-stall combination only | PENDING |
| Shower/restroom combination | `/services/shower-restroom-combination-trailers/22ft-6-stall/` | 22 ft, 6-stall combination only | PENDING |
| Shower/restroom combination | `/services/shower-restroom-combination-trailers/30ft-8-stall/` | 30 ft, 8-stall combination only | PENDING |
| ADA shower/restroom combination | `/services/shower-restroom-combination-trailers/3-stall-1-ada/` | 3 stalls + 1 ADA only | PENDING |
| ADA shower/restroom combination | `/services/shower-restroom-combination-trailers/8-stall-1-ada/` | 8 stalls + 1 ADA only | PENDING |
| Shower container | `/services/shower-containers/20ft-5-stall/` | 20 ft, 5-stall container only; no trailer substitution | PENDING |

## Post-BUILD execution record

### 2026-09-15 — Isolated shell checkpoint

- Implementation status reviewed: the reusable server-first component, deterministic view-order helper, styles, and browser enhancer exist only as an isolated shell.
- Builder-reported verification recorded in `docs/TEST_RESULTS.md`: TypeScript passed; 4 focused Vitest/SSR checks passed; 2 isolated Chromium keyboard/swipe checks passed; the Vite client build passed.
- Independent rendered-route acceptance was **not run**, as instructed. No current equipment/service hero uses the shell, no exact route image arrays are populated, and the two incorrect homepage mappings remain unchanged.
- Blocking prerequisite: `docs/phase1/DRIVE_ASSET_INVENTORY.md` does not exist yet. Without that authoritative inventory, exact family/model/length/configuration/view relevance, completeness, and order cannot be truthfully verified.
- Decision boundary: do not treat isolated fixture tests or a client build as route acceptance. Resume this matrix only after the Drive inventory is complete and the implementation owner reports route integration BUILD complete.

Overall status: **BLOCKED — authoritative image inventory and route integration are missing.** Independent QA will populate exact build identifier, commands, viewport/device evidence, per-route results, accessibility checks, performance observations, regressions, and blocking failures after that handoff.

### 2026-09-16 — Homepage Shower Trailer image addendum

- Charles explicitly identified the supplied shower-stall image as the Shower Trailer. Responsive 480 px and 960 px derivatives now replace the previously incorrect Shower homepage asset.
- The homepage Shower card uses category-specific alt text limited to the visible shower stall, overhead and handheld fixtures, ventilation, and hooks. It does not claim an exact trailer length, stall count, or model.
- Focused component/browser QA passed at 1440 x 1000 and 390 x 844: both responsive assets were available, the selected image decoded, `object-fit: cover` remained active, and mobile document overflow was zero.
- This approval applies only to the homepage Shower category card. It does not fill the exact 22 ft/10-stall shower route gap. Restroom imagery was not changed by this task.
- Full-page local rerun remains blocked by the unrelated active prerender CSV-module error documented in `docs/TEST_RESULTS.md`; no deployment was performed.

### 2026-09-15 — Integrated local production-preview acceptance

- Handoff received: BUILD explicitly reported integration complete and provided the running production preview at `http://localhost:4173/`. No production deployment was in scope or performed.
- Inventory traceability: 54 approved registry file IDs were found in `docs/phase1/DRIVE_ASSET_INVENTORY.md`. The generated asset directory contains exactly 108 responsive derivatives: one 480 px and one 960 px WebP for each approved photo (9.71 MiB total).
- Exact mapped routes: **PASS** for all 10 routes. Each rendered exactly one carousel, began with an interior view, preserved the registry order, stayed within the viewport, and loaded without failed image requests at 390 x 844, 768 x 1024, and 1440 x 1000. The observed slide totals were 5, 7, 2, 10, 9, 6, 4, 2, 5, and 4 in registry order.
- Full slide activation: **PASS**. All 54 approved photos were individually activated on desktop and phone (108 activations total). Every active image decoded with a nonzero natural width, the visible counter matched its selected position, and exactly one slide exposed meaningful alt text at a time; inactive images exposed an empty alt.
- Deterministic order: **PASS** against `src/serviceHeroImages.ts` and the inventory classifications. Interior is first on every mapped route; an approved exterior is second when available; remaining exact-model interiors/details/plans follow. The 28 ft kitchen and 13 ft combination correctly do not claim an unavailable approved exterior.
- Controls and keyboard: **PASS**. Previous/next and numbered selectors worked; Arrow Left/Right and Home/End wrapped or selected the expected slide; native buttons retain Enter/Space behavior; current position is in a polite atomic live region.
- Touch behavior: **PASS**. Horizontal pointer swipe changed slides, while a primarily vertical gesture did not. The viewport declares `touch-action: pan-y`, preserving ordinary vertical page scrolling.
- Focus and motion: **PASS**. Carousel and buttons have a visible 3 px focus outline. With reduced motion enabled, the authored 180 ms fade is absent; Chromium reports only its effectively-zero `0.00001s` reduced-motion transition value. There is no autoplay.
- Responsive/visual inspection: **PASS** for representative 24 ft kitchen desktop, 22 ft combination phone, and homepage desktop captures under `work/qa/service-carousel/`. Images retain aspect ratio with `object-fit: contain`; controls and captions remain readable; no document-level horizontal overflow was observed across the three tested widths.
- Homepage category correction: **PASS** at desktop and phone. `Shower trailers` and `Restroom trailers` each render a neutral `Verified equipment photo pending` state and contain no `<img>`; the prior ADA combination photos are no longer presented as either category. The separate combination card retains combination-specific imagery.
- Truthful fallbacks: **PASS** on the 19 non-redirected service-detail routes without verified exact-model arrays. They render `Exact equipment photography is pending verification` and no carousel instead of borrowing another model's images.
- Redirect-source clarification: the four legacy restroom model paths (`12ft`, `14ft`, `20ft`, and `30ft`) are permanent redirect sources in `vercel.json` to `/equipment-rental/restroom-trailers/`; they are intentionally excluded from prerendered model-detail output and therefore do not render model fallbacks. The local static server returned the destination page content under the requested URL, so production redirect status remains a deployment-time boundary.
- Equipment-category regression sweep: **PASS for rendered structure** across all 23 unique `/equipment-rental/` routes at phone, tablet, and desktop (69 checks): HTTP 200, exactly one H1, no failed requests, and no horizontal overflow. These category pages were not converted to model carousels in this build. Canonical elements were absent on these local responses; because no pre-change rendered baseline was available in this QA task, canonical preservation is not claimed.
- Focused implementation suite: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 npx playwright test tests/browser/service-hero-carousel.spec.ts --reporter=line` — **6 passed** against actual routes, including button/keyboard behavior, swipe/vertical gesture separation, deterministic 24 ft ordering, an unverified fallback, homepage correction, and desktop/mobile containment.
- SEO/content regression observation: all 33 service-detail inventory paths returned HTTP 200 with exactly one H1 and no horizontal overflow at all three widths. Titles remained populated. This task made no H1, title, URL, redirect, navigation, CTA, or form changes; source-level historical equivalence beyond the scoped diff was not independently reconstructed.

Overall disposition: **PASS WITH DOCUMENTED COVERAGE GAPS — ready for owner review, not production publication.** The ten exact-model carousels and homepage category correction pass independent local acceptance. Missing or ambiguous inventory remains deliberately represented by truthful non-photo states; it is not approval to invent, cross-map, or publish unsupported equipment imagery. Production redirect behavior, live CDN delivery, and post-deployment rendering remain unverified because deployment was explicitly out of scope.
