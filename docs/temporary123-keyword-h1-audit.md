# Temporary123 family keyword and H1 audit

Status: audit and proposal only. No H1, content, URL, canonical, robots, redirect, Git remote, or deployment change is authorized by this document.

Date: 2026-09-15

## Confirmed interpretation

For each relevant non-homepage landing page, use one natural, page-supported phrase containing these adjacent parts:

`topical service + facility/equipment type + rental intent`

Location pages may add `in City, State` after the complete phrase. "Mix 1-8" means distribute the eight topical service families across appropriate pages; it does not mean placing all eight services in one H1. Selection must be deterministic for a stable URL, but deterministic selection is still constrained by page intent and visible supporting copy.

Homepage H1s remain unchanged pending separate approval. Navigation/directory, legal, utility, and other non-service pages are excluded from this rotation. Existing valuable refrigeration, dishwashing, restroom, and handwashing pages on the main Temporary123 build are held rather than retargeted because those topics are outside the supplied eight-family Temporary123 list.

## Properties and evidence sampled

| Property | Environment | Evidence | Current finding |
| --- | --- | --- | --- |
| `temp123-nine.vercel.app` | Candidate Vercel build represented by this repository | Current local source, generated `dist`, HTTP headers, Vercel/Git metadata | Local generated snapshot has 649 HTML pages. Homepage H1 is `Temporary Facilities and Trailer Rental / Rent or Lease Nationwide`. Alias sends `X-Robots-Tag: noindex, follow`. Generated canonicals are gated off while `domainRoutingReady` is false. |
| `temporary123.com` | Public WordPress production | Live fetch | Canonical is the public root and robots allow indexing. The sampled homepage has one H1, `NEWS/BLOG`, so it is not the same homepage implementation as the candidate build. Do not silently treat these as one page. |
| `temporarykitchens123.com` | Public kitchen site | Live crawl/fetch of homepage and representative routes | Homepage H1 is `Temporary Commercial Kitchen Rentals Nationwide`. The homepage already contains an `Industries We Serve` section for healthcare, education, correctional facilities, and government/military. Sampled child markup showed duplicate H1s on several landing pages. |
| `icefoxequipment.com` | Public refrigeration site | Live fetch | Homepage has two H1s; its existing primary H1 is a long refrigeration rental phrase. `/prefabricated-models/refrigeration/` has one broad H1, `Refrigeration`. |
| `icefoxleasing.com` | Public related leasing site | Live fetch | Homepage has one H1, `Ice Fox Leasing`; exact inclusion in this project needs owner confirmation. |
| `mobile-dishwashing-trailer-facility-rental.com` | Probable public dishwashing site | Live crawl/fetch | Sampled homepage has two H1s: `Mobile Dishwashing Trailer` and `Welcome to Mobile Dishwashing Trailer Facility Rental USA`. Confirm this is the boss's intended dishwashing property before mapping child pages. |

The repository is connected to GitHub at `charlessslaranangsss-maker/Temp123` (`origin`) with `markravencanete50-source/Temp123` as fetch-only `upstream`. The current branch is `main`. There were already unrelated working-tree edits before this audit, so this proposal does not modify production templates.

## Candidate build inventory

The generated snapshot contains 649 HTML pages, including 50 state pages, 246 regional pages, 246 regional city-directory pages, 5 reviewed city landing pages, plus service, equipment, legacy, and utility routes. The directory dataset contains 19,702 city records, but only Port Angeles, Sequim, Seattle, Tacoma, and Olympia currently have reviewed pre-rendered city guides. Directory records are not approved landing pages.

Each sampled generated page has one H1, but that does not make every H1 compliant. The current headline helper is stable rather than random; however, its eight patterns are generic headline patterns, not the boss's eight topical families. Examples requiring correction or review include:

- `Temporary Facilities Lease`: missing a topical service and uses `Lease` instead of `for Lease` or `Leasing`.
- `Portable Facilities Rental`: `portable` is not a Group 1 term and no topical family is present.
- `Mobile Trailer Lease` and `Emergency Trailer Rental`: no topical family is present.
- The Texas override combines several service families in one H1.
- Product naming can create grammatical defects such as `Breakroom trailers Rental`.

## Separate approved vocabulary maps

### Main Temporary123

- Topical families: shower; shower/restroom or bathroom combination; ADA shower/restroom combination; laundry; kitchen; commercial kitchen; sleeper bunk-bed facilities; remote man camp/life-support services.
- Group 1: trailer; facility; modular building; temporary facility/facilities; emergency trailer.
- Group 2: rental; for rent; for lease/leasing; short-term rental; long-term rental; emergency rental.
- Restrictions: a page-specific allowlist must control which combinations can be selected. Dishwashing, refrigeration, standalone restroom, and handwashing pages are exceptions pending an explicit rule.

### Temporary Kitchens 123

- Topical terms: kitchen; commercial kitchen; modular kitchen; emergency kitchen; dishwashing; commercial dishwasher; refrigeration; emergency refrigeration.
- Emergency-kitchen modifiers: construction, renovation, and emergency operations only when page copy supports that situation.
- Homepage: keep its current H1. The required industry categories and most example phrases are already visible; verify/refine wording instead of duplicating the section.
- Availability statement: add only after confirming the actual offer. Current public copy supports trailers, modular facilities, emergency/planned projects, rental, and long-term use. `Sales` is not approved from the audited evidence.

### Ice Fox refrigeration

- Topical terms: freezer; freezer trailer; refrigeration trailer; walk-in refrigeration; walk-in freezer; outdoor walk-in cooler; refrigeration/freezer container; emergency walk-in refrigeration; temporary refrigeration.
- Transaction terms: short-term rental; long-term rental; leasing; rental; sales.
- Restriction: `sales` requires page-level evidence. The homepage duplicate-H1 defect needs separate approval because homepage wording is frozen.

### Dishwashing / warewashing

- Topical terms: commercial dishwashing; warewashing; CMA dishwashing trailer rental; dishmachine rental; flight-type dishwashing machine; CMA flight machine; Hobart, Champion, or Jackson dishwashing machine; commercial warewashing machine.
- Restrictions: confirm the exact property first. Brand terms are held until inventory/service evidence and non-affiliation-safe wording are verified; text on an existing SEO page alone is not sufficient proof.

## Initial proposed page mapping

The detailed export is `audit/h1-proposed-mapping-2026-09-15.csv`. Status meanings:

- `KEEP`: already acceptable; no edit proposed.
- `PROPOSE`: reviewable wording supported by sampled page intent.
- `HOLD`: a business, ownership, or content-support decision is missing.
- `EXCLUDE`: not a relevant single-service landing page.
- `LOCKED_HOME`: preserve the homepage H1; structural duplicate-H1 findings still need a separate decision.

| URL | Existing H1 | Proposed H1 | Decision |
| --- | --- | --- | --- |
| Candidate `/` | Temporary Facilities and Trailer Rental / Rent or Lease Nationwide | Unchanged | `LOCKED_HOME` |
| Candidate `/service-areas/texas/` | Multi-service keyword list | Remote Man Camp Temporary Facilities Rental in Texas | `PROPOSE`; approve the Texas focus first. |
| Candidate `/service-areas/washington/puget-sound/olympia/` | Olympia, Washington Shower and Restroom Trailer Rental | Shower and Restroom Combination Trailer Rental in Olympia, Washington | `PROPOSE` |
| Candidate `/service-areas/washington/olympic-peninsula/port-angeles/` | Port Angeles, Washington Mobile Kitchen Trailer Rental | Kitchen Trailer Rental in Port Angeles, Washington | `PROPOSE` |
| Candidate `/portable-dishwashing-trailer-rental/` | Dishwashing Trailer Rental | No change yet | `HOLD`; outside the supplied main-site family list. |
| Kitchen homepage | Temporary Commercial Kitchen Rentals Nationwide | Unchanged | `LOCKED_HOME`; industry section already present. |
| Kitchen `/emergency-kitchen/` | Emergency Kitchen | Emergency Kitchen Trailer Rental for Construction and Renovation Projects | `PROPOSE`, subject to fresh rendered-page verification. |
| Ice Fox `/prefabricated-models/refrigeration/` | Refrigeration | Walk-In Refrigeration Modular Building Rental | `HOLD` pending product-format confirmation. |
| Dishwashing homepage | Two current H1s | Wording unchanged pending approval | `LOCKED_HOME`; confirm exact domain and authoritative H1. |

## QA findings and release boundary

- TypeScript typecheck: passed.
- City data/content validation: passed (`19,702` records, `246` region directories, `5` reviewed city pages, no reported data issues).
- Existing headline test: failed on the current Texas override for excessive length, multi-topic wording, old geography-first assumptions, and title/H1 mismatch. The test itself encodes the older geography-first convention and must be updated only after the new mapping is approved.
- Generated page count: 649.

Approval is still needed for:

1. which public homepage (`temporary123.com` WordPress or the Vercel candidate) the homepage-freeze instruction refers to;
2. the topical focus for broad state/region pages and Seattle/Sequim;
3. whether main-site refrigeration, dishwashing, restroom, and handwashing pages are exempt or receive additional allowed families;
4. where leasing, short-term, long-term, emergency rental, modular-building, and sales claims are factually available;
5. the exact dishwashing domain and evidence supporting any CMA, Hobart, Champion, or Jackson wording.

No bulk H1 change, homepage rewrite, URL/canonical/redirect/indexability change, Git push, or deployment should occur until those decisions and CSV rows are approved. After approval, use constrained per-template/per-page allowlists, then verify one rendered H1, supporting copy, titles, canonicals, robots, internal links, and representative desktop/mobile pages.
