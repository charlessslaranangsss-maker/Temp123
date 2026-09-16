# Temporary123 Phase 1 Content and H1 Audit

Date: 2026-09-15

Owner/task: Temporary123 Phase 1 — CONTENT + H1

Scope: Audit and content planning only; no source, template, route, metadata, URL, indexing, production, or deployment changes.

## Executive summary

The current candidate contains 650 prerendered HTML pages. Every page in the current `dist` snapshot has exactly one H1. Sixteen representative pages were also checked on `https://temp123-nine.vercel.app/`; all returned HTTP 200 and exactly one H1, and their live H1 text matched the local snapshot.

The primary problem is therefore not H1 count. It is intent quality and consistency:

1. Generated state and region pages use eight deterministic headings, but four patterns omit a clear topical service or equipment family. Those four weak patterns affect 23 of 50 state pages and 119 of 246 region pages.
2. Several hub H1s are brand statements rather than search-intent headings.
3. Some recovered pages are thin or use unsupported marketing claims. `/government/hospitals/` is the clearest content gap, with only about 36 words of main content in the current render.
4. Temporary123 must remain a multi-family commercial base-camp and temporary-facility site. It must not be reframed as a mobile-kitchen-only website.
5. The 22 ft shower-only trailer is consistently represented as a 10-stall model in the equipment and service data. The separate “three hand sinks” detail appears in calculator copy and the Port Angeles editorial draft, but not in the service-detail record; treat that specification as pending owner/equipment-sheet verification before repeating it sitewide.

The recommended H1 structure is one natural, deterministic phrase per page:

> topical service or equipment + facility type + rental intent + location or operational context when relevant

Rotation should happen between pages through an approved mapping, never randomly during a page view. A page should receive the phrase that matches its actual primary intent; rotation must not turn a broad state page into an arbitrary single-product page without supporting copy.

## Evidence and boundaries

- Local evidence: current `dist` snapshot, 650 `index.html` files.
- Live evidence: 16 representative candidate URLs checked on 2026-09-15.
- H1 count result: 650 with one H1; 0 missing; 0 with multiple H1s.
- Live representative result: 16 HTTP 200; 16 with one H1; 0 live/local H1 mismatches.
- Content depth figures are approximate main-content word counts after removing navigation, footer, scripts, and styles.
- This audit does not approve indexation, validate backlinks, verify inventory availability, or establish legal/procurement claims.
- Current candidate pages render `noindex,follow`; indexation policy belongs to the separate technical SEO and rollout workstreams.

## Page-family inventory

| Page family | Count | Current pattern | Audit result | Content/H1 direction |
| --- | ---: | --- | --- | --- |
| Homepage | 1 | Multi-family nationwide rental statement | One H1; text concatenates at a visual line break | Freeze substantive change pending owner approval; fix readable spacing and retain nationwide multi-family intent |
| Equipment hub | 1 | Brand-style heading | One H1, but weak search intent | Use a natural nationwide equipment/facility rental hub heading |
| Equipment category | 23 | Product/category plus “Rental” | One H1 each; several grammar/capitalization issues and thin pages | Keep category-specific intent; normalize singular/plural and “rental,” “for rent,” or “leasing” naturally |
| Services hub | 1 | Brand-style heading | One H1, but weak search intent | Use a multi-family temporary facility rental heading |
| Service category/model | 25 | Configuration plus rental | Strongest current H1 family | Preserve model specificity; add commercial use, capacity, utilities, and verification-safe copy |
| Industries hub | 1 | Brand-style heading | One H1, weak commercial query match | Use commercial and institutional temporary facility context |
| Industry and recovered institutional detail | Included among recovered/root pages | Mixed: government, military, correctional, hospital, workforce | Uneven; hospital page is extremely thin | Use facility-specific temporary rental intent and cautious procurement/compliance language |
| Service-areas hub | 1 | Nationwide coverage heading | One H1 | Keep as navigation/coverage intent, not a single product page |
| State landing pages | 50 | Eight deterministic patterns | One H1 each; 23 use weak/incomplete formula | Assign an approved family focus only where the page copy supports it; otherwise use multi-family state intent |
| Region landing pages | 246 | Same eight deterministic patterns | One H1 each; 119 use weak/incomplete formula | Same rule as state pages; add region-specific operational context rather than tourism copy |
| Region city directories | 246 | `{Region}, {State} Facility Rental Locations` | One H1; approximately 74 words in sampled page | Treat as directory/navigation intent; do not force a rotating equipment phrase |
| Reviewed city pages | 5 | City/state plus one primary service | One H1 each; supporting copy is broader and commercial | Retain deterministic primary service while supporting other facility families naturally |
| Recovered/root service, man-camp, resource, and legacy pages | 43 | Mixed original titles and revised rental headings | One H1 each; intent and quality vary widely | Preserve exact URL intent; consolidate only after backlink and owner review |
| Company, utility, calculator, and policy pages | 4 core utility pages plus utility routes within recovered set | Brand, contact, calculator, privacy/resource intent | One H1 each | Exclude privacy and pure utility pages from keyword rotation; keep calculator’s stable H1 |

The family counts above describe the current render architecture. Some recovered paths also act as industry or utility pages; they are counted once in the 650-page total.

## Generated H1 rotation audit

### State pages: 50

| Current suffix | Count | Formula quality | Recommendation |
| --- | ---: | --- | --- |
| Mobile Kitchen Trailer Rental | 6 | Complete | Keep only where kitchen is the assigned primary intent |
| Temporary Facilities Lease | 2 | Missing topical service; “lease” reads as a noun | Use `Temporary Facility Rental and Leasing` for broad pages |
| Emergency Shower Trailer Rental | 6 | Complete | Keep where emergency shower support is the primary intent |
| Sleeper Bunkbed Trailer Rental | 7 | Complete but awkward compound wording | Use `Sleeper and Bunkbed Trailer Rental` |
| Portable Facilities Rental | 6 | Missing topical service and approved facility specificity | Use a supported service family or broad `Temporary Facility Rental` |
| Mobile Trailer Lease | 8 | Missing topical service; “lease” grammar is weak | Replace with a supported service-specific heading |
| Emergency Trailer Rental | 7 | Missing topical service | Specify kitchen, shower, refrigeration, base-camp, or another supported service |
| Shower and Restroom Trailer Rental | 7 | Complete | Use `Shower and Restroom Combination Trailer Rental` where the combination unit is primary |

### Region pages: 246

| Current suffix | Count | Formula quality | Recommendation |
| --- | ---: | --- | --- |
| Mobile Kitchen Trailer Rental | 34 | Complete | Keep where kitchen is the assigned primary intent |
| Temporary Facilities Lease | 29 | Missing topical service; awkward intent phrase | Use a supported family or broad multi-family heading |
| Emergency Shower Trailer Rental | 30 | Complete | Keep where emergency shower support is primary |
| Sleeper Bunkbed Trailer Rental | 29 | Complete but awkward compound wording | Use `Sleeper and Bunkbed Trailer Rental` |
| Portable Facilities Rental | 29 | Missing topical service | Replace with supported service/equipment wording |
| Mobile Trailer Lease | 30 | Missing topical service | Replace with supported service/equipment wording |
| Emergency Trailer Rental | 31 | Missing topical service | Specify the emergency facility actually covered by the page |
| Shower and Restroom Trailer Rental | 34 | Complete | Add `Combination` where combination equipment is the intent |

The 142 weak generated headings are not an instruction to rewrite 142 pages blindly. First approve a deterministic assignment table and ensure every page has enough distinct local and operational copy to support its assigned intent.

## Recommended content system

### Supported primary families

1. **Kitchen and food operations:** mobile commercial kitchen, modular kitchen, emergency kitchen, commercial dishwashing/warewashing, refrigeration and emergency cold storage.
2. **Hygiene:** shower trailer, shower and restroom combination, ADA shower/restroom combination, restroom trailer, handwashing, and laundry.
3. **Accommodation and base-camp support:** sleeper and bunkbed trailers, sleeper modular containers, remote man camps, life-support and base-operations services.
4. **Related temporary facilities:** offices, classrooms, breakrooms, dining structures, command centers, utilities, tents, access equipment, and site-support equipment.

### Approved intent vocabulary

- Facility forms: `trailer`, `facility`, `modular building`, `temporary facility`, `container`, and `emergency trailer` only when accurate for the actual page.
- Commercial intent: `rental`, `for rent`, `leasing`, `short-term rental`, and `long-term rental` used naturally. Do not append every modifier to one H1.
- Operational context: construction, renovation, commercial kitchen interruption, equipment failure, emergency base camp, hospital/institutional continuity, correctional operations, military/public-service procurement, remote workforce, and hospitality only where the body copy substantively covers it.

### H1 rules

- Use exactly one H1.
- Make the primary service clear in the first readable phrase.
- Include the facility form and rental intent without keyword stacking.
- Add city and state on reviewed city pages; add state on state pages; use region and state on region pages.
- Do not rotate the homepage automatically.
- Do not use the same H1 for pages with materially different intent.
- Do not force “emergency” onto normal-rental pages or imply guaranteed delivery/availability.
- Keep configuration details in H1s only when they are documented and central to the page.

## Representative audit and proposal map

The detailed, filterable version is in `audit/phase1-content-h1-mapping.csv`. Key proposals follow.

| Current URL | Page type/search intent | Current H1 | Proposed natural H1 | Supporting-copy revision |
| --- | --- | --- | --- | --- |
| `/` | Nationwide multi-family commercial rental | Temporary Facilities and Trailer Rental / Rent or Lease Nationwide | Temporary Facilities and Trailer Rental — Rent or Lease Nationwide | Homepage freeze: spacing/punctuation only unless owner approves broader change; keep kitchen, hygiene, accommodation, and base-camp families visible |
| `/equipment-rental/` | Equipment hub | Equipment for your temporary site. | Nationwide Temporary Facility and Equipment Rental | Introduce the four supported family groups and route users by operational need |
| `/equipment-rental/mobile-kitchen-trailers/` | Kitchen category | Mobile Kitchen Trailer Rental | Commercial Mobile Kitchen Trailer Rental | Add renovation, construction, equipment-failure, institutional, meal-volume, utility, and inspection-planning context |
| `/equipment-rental/shower-trailer/` | Shower category | Emergency Shower Trailer Rental | 22 ft Emergency Shower Trailer Rental | Use documented 10-stall configuration; mention three hand sinks only after equipment-sheet confirmation |
| `/equipment-rental/refrigeration/` | Refrigeration category | Refrigerated Trailer Rental | Commercial Refrigeration Trailer Rental | Explain temporary and emergency cold-storage workflow without inventing temperatures or capacity |
| `/equipment-rental/laundry-trailers/` | Laundry category | Laundry Trailer Rental | Commercial Laundry Trailer Rental | Add workforce/headcount, utilities, servicing, construction, renovation, and base-camp context |
| `/equipment-rental/mobile-sleep-trailers/` | Sleeper category | Sleeper Bunk Bed Trailer Rental | Sleeper and Bunkbed Trailer Rental | Keep trailer and modular-container capacity claims separate and documented |
| `/equipment-rental/mobile-crew-camps/` | Man-camp category | Mobile crew camps Rental | Remote Man Camp Temporary Facility Rental | Explain coordinated food, sleeping, laundry, showers, water, and site operations without promising an all-inclusive package by default |
| `/services/` | Service hub | Temporary facilities for the whole project. | Nationwide Temporary Facility Rental Services | Present multi-family services and commercial/institutional use cases, not a keyword list |
| `/services/dishwashing-trailers/22ft/` | Dishwashing model | 22ft Dishwashing Trailer Rental | 22 ft Commercial Dishwashing Trailer Rental | Describe warewashing workflow and documented equipment; do not insert CMA, Hobart, Champion, or Jackson unless the specific unit record proves it |
| `/services/shower-trailers/22ft-10-stall/` | Flagship shower model | 22 ft Shower Trailer, 10 Stalls Rental | 22 ft 10-Stall Shower Trailer Rental | Call it the flagship only after owner confirms designation; verify the three-sink detail before repeating it |
| `/services/shower-restroom-combination-trailers/3-stall-1-ada/` | Accessible combination model | Luxury Shower and Restroom Combination Trailer, 3 Stalls + 1 ADA Rental | ADA Shower and Restroom Combination Trailer Rental — 3 Stalls + 1 ADA | Explain accessibility features factually; do not claim legal compliance for a site without configuration review |
| `/man-camp-rental/` | Remote workforce accommodation | Man Camp Rental \| Workforce Housing for Remote Sites | Remote Man Camp and Life-Support Facility Rental | Separate facility rental from optional services and clarify project-specific scope |
| `/facility-management-and-base-operations-support/` | Life-support service | Facility Management and Base Operations Support | Remote Base-Camp Life-Support Services | Explain food, hygiene, accommodation, utilities, staffing, and management as selectable services; verify global capability claims |
| `/portable-dishwashing-trailer-rental/` | Dishwashing service | Dishwashing Trailer Rental | Commercial Dishwashing and Warewashing Trailer Rental | Add construction/renovation/emergency kitchen continuity and documented machine details |
| `/government/hospitals/` | Hospital continuity | Hospitals | Hospital Temporary Facility Rental | Rebuild from a verified hospital workflow: temporary kitchen, dishwashing, refrigeration, hygiene, access, utilities, and approval responsibilities |
| `/government/military-kitchen/` | Military/public procurement | Military Kitchen | Military Mobile Kitchen Facility Rental | Retain only verified equipment, procurement, and approval claims; avoid implying universal contract eligibility |
| `/government/correctional-facilities/` | Correctional continuity | Correctional Facilities | Correctional Facility Temporary Kitchen and Support Rental | Add secure access, staffing separation, utilities, food workflow, and approval responsibilities without security/compliance guarantees |
| `/service-areas/washington/` | State landing | Washington Shower and Restroom Trailer Rental | Washington Shower and Restroom Combination Trailer Rental | Keep primary hygiene intent and add supporting kitchen, sleeper, laundry, dishwashing, and refrigeration links naturally |
| `/service-areas/washington/olympic-peninsula/` | Region landing | Olympic Peninsula, Washington Shower and Restroom Trailer Rental | Olympic Peninsula, Washington Shower and Restroom Combination Trailer Rental | Replace tourism-style material with access, utilities, servicing, weather, commercial/institutional, and base-camp planning |
| `/service-areas/washington/olympic-peninsula/cities/` | City directory | Olympic Peninsula, Washington Facility Rental Locations | Temporary Facility Rental Locations in the Olympic Peninsula, Washington | Keep directory/navigation intent; add a concise description of what each reviewed city page covers |
| `/service-areas/washington/olympic-peninsula/port-angeles/` | Reviewed city/kitchen | Port Angeles, Washington Mobile Kitchen Trailer Rental | Port Angeles, Washington Commercial Mobile Kitchen Trailer Rental | Retain commercial base-camp focus; verify any waterfront/US 101 claims and three-sink equipment detail before publication |
| `/rental-calculator/` | Calculator | Nationwide Temporary Facility Rental and Delivery Calculator | Keep current H1 | Preserve stable H1; supporting visible HTML may cover all service families without turning the page into a keyword dump |

## Reviewed city-page direction

| URL | Current primary intent | Recommendation |
| --- | --- | --- |
| `/service-areas/washington/olympic-peninsula/port-angeles/` | Commercial mobile kitchen | Keep kitchen primary; base-camp support services remain secondary |
| `/service-areas/washington/olympic-peninsula/sequim/` | Broad temporary facilities | Use a specific approved primary family or a genuinely broad multi-family H1; do not imply a random product focus |
| `/service-areas/washington/puget-sound/seattle/` | Broad temporary facilities | Use a supported Seattle operational need and distinct evidence; avoid generic metropolitan copy |
| `/service-areas/washington/puget-sound/tacoma/` | Sleeper/bunkbed | Keep accommodation primary and connect supporting hygiene/food services to workforce needs |
| `/service-areas/washington/puget-sound/olympia/` | Shower/restroom combination | Keep combination-unit primary and support with commercial/institutional continuity copy |

All five reviewed pages should mention city, state, target facility, rental intent, commercial or institutional setting, access/utility planning, and related services only where useful. Nearby-place and logistics statements must be checked against reliable sources before publication.

## Flagship 22 ft shower trailer audit

Current project evidence supports:

- one 22 ft shower-only trailer configuration;
- 10 shower stalls;
- construction, man-camp, renovation, and emergency base-camp use cases;
- the need to confirm water, wastewater, power, hot water, access, and availability.

Current project evidence does **not yet consistently support** repeating all of the following across every page:

- “flagship” as an official product designation;
- three hand sinks as a verified specification in the service-detail record;
- universal availability;
- guaranteed delivery time;
- site-specific ADA or regulatory compliance.

Required decision/evidence: obtain an owner-approved equipment sheet or fleet record for the April 22 ft unit. Record length, stall count, sink count/type, privacy-room configuration, utilities, dimensions, weights, accessibility status, photos, availability language, and approved alt-text description. Until then, use `22 ft 10-stall shower trailer` and keep the three-sink/flagship claims flagged for verification.

## Unsupported or high-risk claims to review

1. Specific dishmachine brands or models—CMA, Hobart, Champion, Jackson, flight machines—must be tied to a documented unit, not spread as generic keywords.
2. “GSA Schedule,” approved supplier, contract holder, military approval, or procurement eligibility claims need current documentation and applicable scope.
3. “ADA” should describe a documented unit configuration, not guarantee that every placement or completed site is compliant.
4. “Emergency 24/7” may describe phone/rental-team availability, but must not promise equipment availability or arrival time.
5. “Fully equipped,” “turnkey,” worldwide staffing, full life-support packages, and specific workforce capacities need a current service definition and proposal boundary.
6. Refrigeration temperature, storage capacity, power draw, and food-safety outcomes must come from equipment records.
7. City access, waterfront, corridor, distance, permitting, and local-authority statements require factual verification.
8. Commercial photos and alt text must describe what is visibly present; do not claim a hospital, prison, military, or industrial setting unless the image record supports it.

## Supporting-copy revision priorities

### Priority 1 — content gaps and misleading intent

- Rebuild `/government/hospitals/` before it is considered publishable.
- Replace the 142 weak generated state/region H1 patterns through an approved deterministic mapping, paired with matching body copy.
- Rewrite hub H1s and introductions so equipment, services, industries, and service areas each have distinct intent.
- Normalize awkward category grammar such as `Breakroom trailers Rental`, `Mobile crew camps Rental`, and `Sleeper Bunk Bed Trailer Rental`.

### Priority 2 — family completeness

- Ensure kitchens include construction, renovation, commercial kitchen fire/equipment failure, institutional continuity, dishwashing, and refrigeration where relevant.
- Ensure hygiene pages distinguish shower-only, restroom-only, combination, accessible combination, handwashing, and laundry.
- Ensure accommodation pages distinguish sleeper/bunkbed trailers, sleeper modular containers, man-camp facilities, and optional life-support services.
- Cross-link related services based on user workflow, not simply to repeat keywords.

### Priority 3 — page differentiation

- Give each state/region/city page a documented operational brief: user type, project trigger, facility need, access, utilities, servicing, and relevant supporting families.
- Remove generic tourism narration unless it directly affects delivery or operations.
- Keep region city-directory pages concise and navigational; do not pad them into doorway pages.
- Preserve valuable recovered URLs and original intent pending the separate backlink/authority register.

## Decisions needed before implementation

1. **Homepage:** approve spacing-only correction, or approve the proposed normalized H1. Do not rotate the homepage dynamically.
2. **Generated locations:** approve whether broad state/region pages receive a multi-family H1 or a documented service-family assignment table.
3. **22 ft shower unit:** provide the authoritative equipment sheet and approve “flagship” and three-hand-sink language.
4. **Dishwashing brands:** identify exact units and pages allowed to mention CMA, Hobart, Champion, Jackson, or flight machines.
5. **Recovered URLs:** provide the Ahrefs/high-authority URL register before consolidation, deletion, or slug changes.
6. **Institutional claims:** provide current GSA, military, correctional, hospital, ADA, and procurement evidence or approve conservative wording.
7. **City rollout:** approve the operational-brief fields required before a city page can move from draft to review.

## Implementation acceptance criteria for the next phase

- Approved mapping covers every indexable page family and assigns one stable H1 per page.
- Every page has exactly one H1 and a unique primary intent.
- State/region/city copy supports the H1 and is materially distinct.
- Homepage remains multi-family and is changed only with owner approval.
- 22 ft shower and brand/model claims match approved equipment records.
- Institutional/procurement/compliance claims have evidence or conservative qualifiers.
- Representative desktop/mobile rendering and source HTML are checked after implementation.
- No valuable URL is removed or changed before authority-URL review.
