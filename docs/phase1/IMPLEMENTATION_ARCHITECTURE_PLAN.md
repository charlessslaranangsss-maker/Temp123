# Temporary123 Phase 1 Implementation Architecture Plan

**Status:** Read-only implementation design  
**Prepared:** 2026-09-15  
**Scope:** Deterministic H1, metadata, body-copy, and image governance across the existing Temporary123 route families. This document does not authorize source, route, URL, canonical, indexing, deployment, or production changes.

## Executive recommendation

Introduce one typed, path-keyed presentation resolver that reads an approved page manifest and returns the exact H1, title, meta description, hero-image reference, and body-copy source for a route. The exact existing pathname must be the immutable key. React rendering and static prerender metadata must consume the same resolved record so they cannot calculate different page identities.

Keep page-family templates and the established editorial datasets. Do not rewrite all pages into one generic template. The new layer should coordinate those sources and freeze approved values per path. Existing deterministic headline formulas may remain temporarily as a migration aid for unapproved draft routes, but an approved or indexable route must fail validation if it reaches a formula or fallback.

## Current architecture observed

The project is a Vite/React application statically rendered by `scripts/prerender.tsx`. The build assembles `allRoutes` from core routes, recovered source pages, equipment catalog entries, service categories and options, regions, region city directories, reviewed cities, and states. It renders `Site` once per route into `dist/<path>/index.html` and then adds metadata, canonical/indexing directives, image dimensions, breadcrumbs, and schema.

Page identity is currently distributed across several sources:

| Family | Route/content source | Visible H1 and body source | Metadata source |
| --- | --- | --- | --- |
| Core/home | hard-coded branches in `src/Home.tsx` and `src/Site.tsx` | JSX copy | `src/content.ts` via `pageInfo()` |
| Service category | `src/serviceMenu.ts` | `rentalCategoryHeadline()` plus category/model data | separate category branch in `scripts/prerender.tsx` |
| Service model | `content/service-details.json` via `src/ServiceDetail.tsx` | `rentalProductHeadline(item.name)` plus JSON fields | separate detail branch in `scripts/prerender.tsx` |
| Equipment brief/catalog | equipment catalog JSON and the catalog component | catalog/component fields | separate catalog branch in `scripts/prerender.tsx` |
| Industry | `src/IndustryDetail.tsx` | `industryGuides[].title` and guide fields | a separately composed title in `scripts/prerender.tsx` |
| State | `src/stateGuides.ts`, `src/StateDetail.tsx`, and `src/statePaths.ts` | Texas override or `stateRentalHeadline()`; guide body | separately recalculated with `stateRentalHeadline()` |
| Region | generated records in `src/regionGuides.tsx` | `regionRentalHeadline()` and modulo-selected body templates | separately recalculated with `regionRentalHeadline()` |
| Reviewed city | `src/cityDirectory.json` and `src/cityEditorial.ts` | explicit `cityEditorial[geoid].heading` and editorial fields | `cityHeadline()` plus editorial intro |
| Region city directory | generated from the region path | directory component | separately composed directory title/description |
| Recovered/legacy | route index/source HTML loaded by `scripts/prerender.tsx` | recovered page title and sanitized HTML | recovered title and `sourceDescription()` |
| Privacy/404 | hard-coded JSX | hard-coded copy | core/default logic |

This arrangement produces usable static pages, but it has four structural risks:

1. H1 and metadata are calculated in different branches, so an edit can update one without the other.
2. `src/rentalHeadlines.ts` is deterministic for a given input, but many outputs depend on array order and hash/modulo selection. Reordering or adding a variant can change many pages on the next build.
3. `src/regionGuides.tsx` also selects copy and equipment imagery by offsets and modulo values. Inserting a state, region, template, or image can cascade changes to unrelated pages.
4. `src/cityRentalView.ts` rewrites the visible H1, document title, description, schema, and image gallery from a `location` query value after the page loads. The calculation is deterministic, but the semantic identity of one URL changes by query and differs between prerendered HTML and hydrated browser state.

The prerender post-processing step also replaces filename-like alt text with `<visible H1>: Temporary123 equipment reference`. That prevents empty-looking alts but couples accessibility text to SEO copy and can create repetitive, non-descriptive alternatives.

## Proposed content model

### 1. Approved page-presentation manifest

Add a reviewable data file such as `content/page-presentation.json`, keyed by the exact normalized pathname already present in the route inventory. Do not derive its key from the H1, title, city name, or slug generator.

Each approved record should contain:

```ts
type PageFamily =
  | "core"
  | "service-category"
  | "service-model"
  | "equipment"
  | "industry"
  | "state"
  | "region"
  | "city"
  | "city-directory"
  | "legacy";

type PagePresentationRecord = {
  family: PageFamily;
  reviewStatus: "draft" | "approved";
  h1: string;
  title: string;
  description: string;
  primaryService?: string;
  facilityNeed?: string;
  rentalIntent?: "rental" | "rent" | "lease" | "rent-or-lease";
  heroImageId?: string;
  bodySource: { kind: string; key: string };
  contentRevision: string;
};
```

The pathname is the object key, for example `"/service-areas/washington/olympic-peninsula/"`. `bodySource` points to the established family dataset rather than duplicating all body content immediately. City content can continue to use its GEOID key, state content its state name, regions their existing path record, service models their current JSON record, and recovered pages their route-index source. This keeps Phase 1 small and reviewable while giving every approved page one authoritative presentation record.

The approved H1 should contain a natural combination of topical service, facility or operational need, and rental intent where that is appropriate for the family. These are editorial fields, not strings assembled during render. Validation should check required concepts and readability, not impose mechanical keyword density or force the same formula on informational/privacy pages.

### 2. Family policy, not family-generated identity

Add a small typed policy module, such as `src/pagePresentationPolicy.ts`, describing required fields and allowed body-source kinds for each family. Family policy may supply layout defaults, labels, and validation rules. It must not rotate H1s, images, or indexable body paragraphs.

Examples:

- State and region records require a location name, rental intent, a primary temporary-facility topic, and a state/region body source.
- City records require the exact reviewed city path and GEOID-backed editorial content.
- Service-model records require the product/equipment name and the matching service-detail record.
- Core and privacy pages may use purpose-specific copy instead of a location keyword formula.

### 3. One resolver shared by React and prerendering

Add `src/pagePresentation.ts` with a pure function similar to:

```ts
resolvePagePresentation(path, routeContext): ResolvedPagePresentation
```

It should:

1. normalize only slash shape using the same existing route convention;
2. look up the exact path in the approved manifest;
3. verify that the declared family matches the existing route owner;
4. resolve the referenced body source and image asset;
5. return one immutable object used by both the component and `scripts/prerender.tsx`.

The resolver must not read time, browser state, query parameters, environment-specific randomness, or mutable array order. It must not call `Math.random()`, use `Date` for selection, or hash a user-entered location to choose semantic content. Repeated calls for the same path and content revision must return identical values.

During migration, draft/non-indexable routes may explicitly opt into their existing family fallback. An `approved` record, any route selected for indexing, and every route in the release batch must cause the build to fail if the exact record or referenced data is missing. Silent fallback is not acceptable for released pages.

### 4. Keep body copy in owned family datasets

Do not move all JSX and editorial fields at once. Extend the existing family records only when that family is assigned for implementation:

- `src/cityEditorial.ts`: explicit city heading, intro, local sections, sources, and photo reference.
- `src/stateGuides.ts`: state-specific intro, planning facts, sections, and image reference.
- `src/regionGuides.tsx`: replace modulo-selected indexable paragraphs with approved per-path editorial values or a generated snapshot checked into data. Templates can remain for drafting, but approved output must be persisted.
- `src/IndustryDetail.tsx`: retain the explicit guide records and connect them to the path manifest.
- `content/service-details.json` and `src/serviceMenu.ts`: retain service-specific body data and connect them to exact route records.
- Recovered route content: retain sanitized source HTML until a separately assigned editorial migration replaces it.

This preserves family-specific layouts and substantive copy while making the H1/metadata/image selection centrally auditable.

## Deterministic rendering rules

1. **Exact path is identity.** A path resolves to one family and one approved presentation record.
2. **Approved strings are stored, not selected.** H1, title, description, and hero image ID are explicit fields.
3. **No array-order dependence.** Adding a headline variant, image, state, or region must not change another route.
4. **No query-based semantic mutation.** A `?location=` value may populate a form or visible “project location” note, but it must not replace the H1, document title, meta description, canonical, or structured-data name. `src/cityRentalView.ts` should eventually be narrowed accordingly.
5. **Server/static and client parity.** The prerendered H1/title/description/image/schema must remain the same after hydration and reload.
6. **One source per field.** Components must receive resolved presentation data; `scripts/prerender.tsx` must use that same result rather than reconstructing headlines in a parallel conditional tree.
7. **Visible-content schema.** Breadcrumb and page schema may continue to be verified against final HTML, but their names and image data should originate from the resolved record.

## Exact URL and canonical preservation

No Phase 1 content change should create, slugify, rename, redirect, or delete a route.

- Capture the current route set from `allRoutes` as a reviewed baseline before implementation.
- Require every manifest key to match an existing route exactly, including leading/trailing slashes and case.
- Reject unknown keys, duplicate normalized keys, and mismatches between the manifest family and the existing route owner.
- Compare the route set before and after each batch. Added, removed, or changed paths should fail CI unless a separately approved URL migration includes a one-to-one redirect decision.
- Leave `vercel.json`, `scripts/seo-policy.ts`, indexing batches, robots directives, sitemap generation, and `canonicalFor()` unchanged during the content/H1 implementation.
- Continue deriving canonical eligibility from the existing release/indexing policy. The resolver supplies page presentation; it does not decide whether a route is indexable.
- Canonical URLs must use the existing pathname, never a pathname generated from the new H1 or title.
- Preserve query strings only for user context where currently supported; canonical and page identity remain the base route under the existing policy.

## Commercial-only image system

Add an asset registry such as `content/image-assets.json`. A page stores an immutable `heroImageId`; it does not select an image by numeric offset. Each asset record should include:

```ts
type CommercialContext =
  | "correctional-facility"
  | "hospital"
  | "nursing-home"
  | "man-camp"
  | "hotel-hospitality"
  | "military"
  | "industrial-facility";

type ImageAsset = {
  src: string;
  width: number;
  height: number;
  context: CommercialContext;
  equipmentType: string;
  alt: string;
  caption?: string;
  sourceUrl?: string;
  license?: string;
  reviewStatus: "unreviewed" | "approved" | "rejected";
  allowedFamilies: PageFamily[];
};
```

Build validation must reject an approved page whose image is missing, unreviewed, residential/small-business in context, disallowed for the page family, or missing dimensions. An asset should not be labeled as a prison, hospital, nursing home, military site, hotel, man camp, or industrial facility unless the image itself and its documented source support that description. When an equipment image is representative rather than from the named location, captions should say so and must not imply a verified local installation.

Assign images explicitly per path. Do not rotate them with `equipmentSet(index)`, a location hash, or global array offsets. A validator can report excessive reuse within a batch, but reuse limits should be editorial warnings unless duplication would misrepresent the page.

### Alt-text rules

- Describe the visible equipment and commercial/institutional setting in plain language.
- Mention the equipment type once when it helps identify the image.
- Add the context only when visually or source-verified.
- Do not inject a city/state merely because the page targets it.
- Do not repeat “rental,” “rent,” “lease,” the brand, and the full H1 as an SEO phrase.
- Use `alt=""` for decorative images that add no information and are already described beside the image.
- Keep captions separate from alt text; captions may explain that an image is representative.

Good examples include “Mobile kitchen trailer staged beside a hospital service wing,” “Shower and restroom trailer at a remote industrial man camp,” and “Commercial dishwashing line inside a temporary kitchen facility.” Avoid claims such as “Port Angeles hospital rental” unless both location and context are verified.

Once the registry is in use, remove the prerender rule that turns filename-like alts into the H1 plus “equipment reference.” Missing or invalid informative alt text should instead fail validation so it is corrected at the source.

## Validation and regression test plan

### Data and unit tests

Add focused tests such as `tests/pagePresentation.test.ts` and `tests/imagePolicy.test.ts`, while extending existing route/SEO tests where appropriate.

Required assertions:

1. Every current route is owned by exactly one family; every approved/indexable route has exactly one presentation record.
2. Every manifest key exactly matches the route baseline. No path is added, removed, renamed, or derived from an H1.
3. The resolver returns byte-for-byte identical H1, title, description, image ID, and body-source key across repeated calls and fresh module loads.
4. Approved/indexable records cannot use a fallback, hash-selected headline, modulo-selected paragraph, or rotating image.
5. Every rendered page has one non-empty H1. H1/title policy is consistent without requiring awkward exact duplication.
6. Required family concepts are present naturally, with explicit exceptions for non-commercial informational pages. Tests should avoid crude keyword-density targets.
7. Body-source references exist and approved location pages meet the established uniqueness, usefulness, and source requirements.
8. Image references resolve to existing assets with dimensions, approved commercial context, appropriate family use, and valid informative/decorative alt behavior.
9. Alt text is not a filename, full-H1 echo, repeated brand phrase, or mechanically repeated keyword list. Duplicate-alt and image-reuse reports should identify editorial review candidates.
10. React rendering and prerender metadata consume the same resolver output.
11. Existing `canonicalFor()`, release/noindex behavior, sitemap membership, redirect handling, and malicious-path rejection tests remain unchanged and passing.

### Browser/static-output tests

Create a representative family matrix covering at least:

- homepage/core;
- service directory and one service category;
- one service model and one equipment brief;
- one industry page;
- Texas plus one non-overridden state;
- one region and its `/cities/` directory;
- Port Angeles plus another reviewed city;
- one recovered/legacy page;
- privacy and 404.

Run the matrix at approximately 375 px and 1440 px. For each applicable route verify:

1. HTTP response and browser pathname remain the exact expected route with no accidental redirect.
2. The page has exactly one visible H1 equal to the approved manifest value.
3. `<title>`, meta description, canonical, Open Graph fields, and schema name/image agree with the resolved record and existing indexability policy.
4. The expected hero image and alt text are present; the image loads and does not cause overflow or layout shift from missing dimensions.
5. Approved intro/body sections are visible and internal links retain their exact destinations.
6. Reloading and opening a fresh browser context produce the same H1, metadata, and image.
7. Adding `?location=...` or other supported UI query parameters does not alter H1, title, description, canonical, or schema identity.
8. Raw generated `dist` HTML and the post-hydration DOM have matching semantic page identity.
9. Existing keyboard, responsive map/modal, location, service, calculator, and 404 tests still pass.

Extend `tests/browser/seo.spec.ts`, `tests/browser/location-refresh.spec.ts`, and relevant service/site tests rather than duplicating their existing coverage. Replace broad regex-only H1 checks with exact approved values for migrated routes. Do not weaken current canonical/indexing or accessibility assertions to accommodate the new layer.

## Release controls and acceptance boundaries

- Implement in small, explicitly assigned family batches. Start with a few representative pages and expand only after static and hydrated parity passes.
- Treat the H1/content audit mapping as an input requiring editorial approval, not as executable route data by itself.
- A local build proves static generation only. Before any later authorized release, record the commit, Vercel deployment, production route responses, and live browser results separately.
- Do not bulk-index newly migrated pages. Existing release batches, `editorialNoindex`, canonical eligibility, and production-domain checks remain the authority.
- Do not claim that an image depicts a named institution or location without source evidence.
- Do not change route counts or URL shape as a side effect of content work.

## Ordered minimal-change implementation sequence and collision risks

1. **Freeze a clean baseline.** After current active tasks finish, record the current route list, redirect set, indexability behavior, and exact H1/title/canonical/image output for the representative family matrix. Do not use the present dirty tree as a migration baseline.
2. **Approve the data contract.** Add only the typed presentation/image schemas, exact-path manifest, and validators. Seed a small representative set without changing rendering.
3. **Add resolver tests.** Prove exact-path coverage, deterministic output, body/image reference integrity, and URL/canonical invariants before wiring components.
4. **Integrate one low-collision family.** Wire one explicitly assigned family component to the resolver and use the same resolved object in prerender metadata. Run unit, build, raw-HTML, hydration, and two-viewport tests.
5. **Remove semantic query mutation.** In a separately assigned change, keep location query data as form/context copy and stop it from rewriting H1, title, description, canonical, or schema.
6. **Migrate family by family.** Move approved state, region, city, service, equipment, industry, core, and legacy records in owned batches. Persist any previously generated H1/body/image choice before removing its fallback.
7. **Enable strict release validation.** Fail builds when an approved/indexable route lacks an explicit presentation record or approved image. Retain drafting fallbacks only for explicitly non-approved/non-indexable routes.
8. **Retire obsolete generators last.** Remove duplicated metadata branches, headline/image rotations, and prerender alt rewriting only after every consumer and regression test uses the resolver.
9. **Release only under separate authorization.** Re-run the full route/canonical diff, build, browser matrix, and production validation before any commit/push/deployment or indexing change.

Current collision risks are material. `src/Site.tsx`, `src/Home.tsx`, `src/content.ts`, `src/cityEditorial.ts`, `src/main.tsx`, and `scripts/prerender.tsx` already have uncommitted changes with ownership that must be resolved before implementation. Calculator work also touches `src/main.tsx`, `server/schema.ts`, package/build inputs, and tests. The active Phase 1 H1 audit owns its mapping artifacts, and the concurrent page-map inventory owns `docs/phase1/PAGE_MAP_SEO_INVENTORY.md` and `audit/phase1-page-map.csv`; neither should be edited or treated as final until its owner marks it complete. `scripts/prerender.tsx` is the highest-risk integration point because it owns route collection, metadata, canonical/indexing output, post-processing, schema, and generated audit files. Any build can rewrite currently modified audit artifacts. Before implementation, re-read `docs/PAGE_ASSIGNMENTS.md`, claim exact files/family, coordinate shared integration points, and work from a clean or owner-approved baseline.
