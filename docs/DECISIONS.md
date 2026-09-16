# Temporary123 Decision Log

Record decisions that multiple tasks must follow. Include the date, decision maker/source, decision, reason, and affected areas.

## 2026-09-15 — Shared coordination source

- Source: Charles
- Decision: All Codex tasks working on Temporary123 must read and update the shared coordination files in this repository.
- Reason: Separate tasks do not share conversation history, even when they can see the same working directory.
- Affected areas: Entire repository.

## 2026-09-15 — Separate calculator location fields

- Source: Charles request; calculator refinement task implementation decision
- Decision: Present State, City, and ZIP code as separate fields. Require State and City; keep ZIP optional until an exact delivery address is known. Use a 50-state dropdown and a free-text city field instead of duplicating all 19,702 city records in another homepage dropdown.
- Reason: Separate fields are clearer for customers and produce cleaner location details, while an optional ZIP avoids blocking early planning. Avoiding a second full city list limits additional homepage HTML weight; the dedicated calculator page still exposes the required city/state text below the form.
- Affected areas: Homepage calculator and `/rental-calculator/`

## 2026-09-15 — Reuse the protected inquiry boundary for calculator quotes

- Source: Charles request to make the homepage calculator a real quote-request feature
- Decision: The calculator submits its estimate and project details to the existing same-origin `/api/contact` endpoint. The endpoint remains the only write boundary and continues to enforce strict schema validation, allowed origin, Firebase App Check, an atomic distributed rate limit, a honeypot, idempotency, and private server-side storage before notification delivery.
- Threat model and access matrix: An anonymous visitor may create one validated inquiry but cannot read, list, update, or delete inquiries. A forged cross-origin or unverified client, spam bot, oversized/unknown payload, repeated request, or limiter failure must be rejected before storage. Site operators receive the inquiry through the existing delivery process; no calculator-specific administrative access is added.
- Negative-test evidence: Existing contact tests cover attacker origins, forged fields, honeypot spam, oversized and invalid bodies, missing App Check, limiter failure, duplicate-safe persistence, and storage/delivery failure ordering. Calculator tests cover the allowed page sources and deterministic service/duration mapping.
- Affected areas: Homepage calculator, `/rental-calculator/`, and the contact schema's page-source allowlist only
- Replaces an earlier decision: No

## 2026-09-15 — Separate calculation from optional quote submission

- Source: Charles clarification that the primary feature is a calculator, followed by approval to improve and enable the optional quote path
- Decision: Use `Calculate Starting Estimate` as a calculator-only button that performs no network request, persistence, or email action. Present contact details and consent in a distinct optional section with a separate `Request Exact Quote` submit button. Keep the estimate visible if quote submission is unavailable or fails.
- Reason: A visitor should be able to obtain the published starting-price calculation without accidentally creating a lead. A separate explicit action makes data transmission and the preliminary-versus-final-pricing boundary clear while retaining the boss-requested lead workflow.
- Affected areas: Homepage calculator, `/rental-calculator/`, calculator browser tests, and quote-request copy
- Replaces an earlier decision: Yes; replaces the combined automatic `Get Starting Estimate / Request Quote` interaction, but retains the protected inquiry boundary decision above for the optional submission

## 2026-09-15 — Keep production inquiry intake disabled until end-to-end configuration passes

- Source: Live activation attempt and production verification evidence
- Decision: Keep `CONTACT_ENABLED=false` after the split-calculator deployment. Enable it only after usable Firebase web/App Check configuration, server persistence credentials, approved delivery configuration, and one controlled end-to-end fictional QA submission are verified.
- Reason: The live client stopped before contacting the API because App Check configuration was unavailable, and a valid-shaped direct API probe returned HTTP 503. Leaving intake enabled would not provide a functioning customer workflow and would conflict with the existing release gate.
- Affected areas: Production Vercel environment, `/api/contact`, calculator exact-quote action, and operations handoff
- Replaces an earlier decision: No

## 2026-09-15 — Do not apply unverified bulk WordPress 404 repairs

- Source: WordPress 442 URL repair task; repository and production safety requirements
- Decision: Make no production permalink, redirect, page, template, plugin, or database change until the exact reported URL set is available, the origin/admin is reachable, and a restorable files-and-database backup is confirmed. Do not use blanket homepage redirects.
- Reason: The public sitemap contains 31,159 URLs and the representative sample did not reproduce a 404, so changing routing without the exact 442-URL evidence could damage valid URLs and SEO signals.
- Affected areas: `mobile-dishwashing-trailer-facility-rental.com` WordPress routing, sitemap, content restoration, and redirects
- Replaces an earlier decision: No

## 2026-09-15 — Do not integrate unverified trailer images

- Source: Charles's exact-model image requirement; Phase 1 page-to-asset mapping and QA evidence
- Decision: Keep the reusable carousel shell isolated until the Drive inventory confirms equipment family, form factor, exact model or length, configuration, and view. Do not fill missing interior or exterior views with a neighboring model or visually similar asset. Do not replace the incorrect homepage Shower and Restroom thumbnails until truthful same-family assets are confirmed.
- Reason: The current source reuses representative images across different lengths and configurations, and both homepage thumbnails were confirmed to depict ADA shower/restroom-combination facilities rather than their linked single-family categories.
- Affected areas: Service and equipment hero imagery, homepage equipment thumbnails, image alt text, carousel registry, and rendered QA
- Replaces an earlier decision: No

## 2026-09-15 — Integrate only inventory-approved exact-model imagery

- Source: Completed `docs/phase1/DRIVE_ASSET_INVENTORY.md`; Charles's exact-model and exclusion requirements
- Decision: Populate the reusable carousel only on routes with exact, unflagged inventory mappings. Order accepted assets as interior, exterior, then remaining approved images. Routes without a safe exact mapping render a truthful non-photo verification-pending state. Homepage Shower and Restroom cards also render neutral pending states because no category-appropriate exact assets were supplied.
- Reason: This adds verified photography where the equipment identity is supported while preventing residential, ambiguous, wrong-model, duplicate, or unverified imagery from being presented as a specific rental product.
- Affected areas: `src/ServiceDetail.tsx`, `src/ServiceHeroCarousel.tsx`, `src/serviceHeroImages.ts`, generated service-hero assets, homepage Shower/Restroom cards, carousel tests, and visual QA
- Replaces an earlier decision: Yes — supersedes only the temporary integration hold in “Do not integrate unverified trailer images”; its exact-model and exclusion requirements remain in force.

## 2026-09-15 — Keep noindex preview URLs out of the sitemap

- Source: Charles's all-pages/sitemap request; live preview audit; controlled indexing requirement in `docs/BOSS_REQUIREMENTS.md`
- Decision: Maintain the complete 650-page owner-visible inventory in `audit/all-pages-sitemap.csv`, but do not add the current Vercel preview URLs to `sitemap.xml`. Add only approved, HTTP-200, indexable, self-canonical `temporary123.com` URLs to the production sitemap in controlled release batches after canonical-domain routing is ready.
- Reason: All 650 preview pages currently declare `noindex,follow`, expose no canonical, and belong to a build whose canonical production domain is not ready. Listing them would conflict with the robots state and the requirement not to release hundreds of unreviewed pages at once.
- Affected areas: Page inventory, sitemap generation, canonical-domain activation, controlled indexing batches, release QA, and Search Console submission
- Replaces an earlier decision: No

## 2026-09-16 — Provide the complete URL inventory as a separate review sitemap

- Source: Charles's request for the complete sitemap using the eventual `temporary123.com` hostname
- Decision: Generate all 650 registered routes as `public/sitemap-review.xml` with absolute `https://temporary123.com` URLs, but keep this owner/dev review artifact separate from the official gated `sitemap.xml` and do not submit it to search engines.
- Reason: This provides the requested complete XML inventory immediately without representing all currently noindex and not-yet-approved pages as the controlled production indexing batch.
- Affected areas: Owner/dev URL review, sitemap QA, future canonical-domain cutover, and controlled indexing release
- Replaces an earlier decision: No; it supplements “Keep noindex preview URLs out of the sitemap.”

## Entry template

### YYYY-MM-DD — Decision title

- Source:
- Decision:
- Reason:
- Affected areas:
- Replaces an earlier decision: Yes/No; link if applicable.

## 2026-09-16 — Keep dashboard evidence typed and owner access explicit

- Source: Urgent owner-visible SEO dashboard request; existing Phase 1 authority and sitemap audits
- Decision: Treat observed crawl data, imported third-party exports, manual owner baselines, and unknown values as separate evidence classes. Keep Search Console property verification, submission, and index status separate. Keep Moz DA, Ahrefs DR/UR, referring domains, and backlinks as distinct metrics. Until authentication exists, expose only a read-only non-confidential preview and state that access boundary visibly.
- Reason: A management dashboard is useful only when it does not turn missing integrations, an owner-entered score, a broad redirect, or a public search result into fabricated SEO evidence.
- Affected areas: `/seo-dashboard/`, protected-URL register, Google status register, portfolio readiness, authority-check workflow, future data imports and owner access
- Replaces an earlier decision: No; it implements the dashboard MVP within the existing controlled-indexing and exact-URL preservation decisions.

## 2026-09-16 — Apply the Boss-approved H1 formula to supported Temporary123 pages

- Source: Charles's instruction to implement the H1 plan discussed in the Boss chat; Boss requirements and Phase 1 audit artifacts
- Decision: For supported non-home Temporary123 pages, compose one deterministic H1 from a relevant service/facility topic, rental intent, and location where applicable. Use the same H1 source for the document title. Apply explicit approved mappings for Alabama, California, Colorado, Texas, Port Angeles, Tacoma, and Olympia, and deterministic supported-topic rotation for the remaining state and region pages.
- Reason: This implements the approved SEO/content structure without inventing unsupported specifications or changing page intent, URL architecture, or indexing controls.
- Affected areas: State, region, reviewed-city, supported service/category/model, equipment, industry, and service hub H1/title generation and focused validation
- Replaces an earlier decision: No. Homepage wording, URLs, canonicals, redirects, robots/indexing, separate brands, unsupported specifications, Seattle and Sequim editorial headings, dishwashing, and refrigeration wording remain unchanged or held for separate approval.

## 2026-09-16 — Use the owner-identified image for the homepage Shower Trailer card

- Source: Charles explicitly stated that the supplied `Codex Image Sep 15, 2026, 10_55_03 PM.png` is the Shower Trailer.
- Decision: Use responsive derivatives of that image only for the homepage `Shower trailers` card. Describe only the visible private shower stall and fixtures; do not infer a trailer length, stall count, exact model, restroom configuration, or route-level model mapping.
- Reason: The owner supplied the missing category identification, while the image itself does not establish a more specific equipment configuration.
- Affected areas: Homepage Shower Trailer thumbnail, responsive image assets, alt text, and focused homepage image QA. The Restroom card and service-detail carousel registry are unchanged by this decision.
- Replaces an earlier decision: Yes — it supersedes only the homepage Shower pending-photo state in “Integrate only inventory-approved exact-model imagery”; all exact-model safeguards remain in force.

## 2026-09-16 — Reuse the state-page headline source in state map modals

- Source: Charles's request to apply the H1 rule to the state modals on `/service-areas/`
- Decision: Display the same deterministic `stateRentalHeadline(state)` wording in each map modal title, but keep the modal title as an `h2`. Retain the modal's link to the dedicated state guide and leave state routes unchanged.
- Reason: The modal gains consistent topical-service, rental-intent, and location wording without creating multiple document H1s or removing useful crawlable state pages.
- Affected areas: Compact and full state-map modal titles, modal accessible names, state-guide metadata, and focused browser coverage
- Replaces an earlier decision: No; it extends the Boss-approved H1 formula to modal copy while preserving the one-H1 document rule.

## 2026-09-16 — Keep carousel motion controllable and image claims evidence-bound

- Source: Urgent imagery and commercial-page presentation refinement
- Decision: Auto-advance verified service carousels, but persistently pause after any manual navigation until the visitor chooses Play, and disable automatic motion when reduced motion is requested. Present interiors and equipment details before exteriors. Do not label a shower/restroom combination photo as restroom-only, and add setting-specific alt text only when the supplied image visibly confirms that commercial setting; do not infer a geographic location.
- Reason: This keeps the gallery useful without overriding user intent, preserves semantic image priority, and prevents unsupported equipment or location claims.
- Affected areas: Service carousel behavior and controls, route image ordering, homepage Shower/Restroom presentation, alt text, and responsive hero QA
- Replaces an earlier decision: Yes; it refines the earlier interior/exterior order and supersedes only the homepage Restroom-photo assumption. Exact-model and inventory safeguards remain in force.
## 2026-09-16 — Prioritize indexing and authority metrics in the SEO dashboard

- Source: Charles's instruction that the boss wants indexing and `Authority metrics by website` on top
- Decision: Display Google indexing status first and website authority metrics second in the dashboard content and sidebar navigation, before overview and supporting registers. Preserve the existing metric values, evidence classifications, and access warnings.
- Reason: These are the boss's priority management signals, while retaining the dashboard's evidence boundaries and supporting detail.
- Affected areas: `/seo-dashboard/` visual section order, sidebar navigation order, and focused dashboard-order regression coverage
- Replaces an earlier decision: No; it refines presentation priority within the existing evidence-typed dashboard.

## 2026-09-16 — Hydrate only the stateful SEO dashboard route

- Source: Live defect report that the dashboard remained orange with its refresh button disabled; direct live HTML/API and local runtime diagnosis
- Decision: Keep the general site as prerendered HTML with targeted DOM enhancements, but hydrate React on `/seo-dashboard/` because its live evidence controls and tables depend on component state. Render an enabled, truthful stored-evidence fallback before hydration and bound each browser request to 25 seconds.
- Reason: The API was healthy, but React effects and click handlers cannot run in static server-rendered markup without hydration. Route-only hydration restores the dashboard without broadening client hydration across all 651 content pages, and the timeout guarantees recovery from a stalled request.
- Affected areas: `/seo-dashboard/` live status, automatic refresh, manual refresh, live evidence table updates, and the dashboard-only initialization block in `src/main.tsx`
- Replaces an earlier decision: No; it completes the existing live dashboard behavior within the current prerendered architecture.

## 2026-09-16 — Keep downloaded Drive assets deduplicated and outside public website assets

- Source: Charles's 25 supplied Google Drive folder links and the repository's existing image-ownership safeguards
- Decision: Store each of the parent `Equipments` folder's 25 equipment groups once under `work/drive-assets-2026-09-16/`, including the parent-only `20ft Laundry Container` child. Keep the collection out of `public/` until individual images are reviewed and approved for truthful route use.
- Reason: The supplied links include both the parent and 24 children, so reproducing every link literally would duplicate nearly the entire collection. A source-only staging area makes all assets accessible while preventing unreviewed model, setting, or alt-text claims from reaching the site.
- Affected areas: Local source-asset organization, Drive manifest, integrity checks, and future image-review workflow
- Replaces an earlier decision: No; it preserves the existing exact-model and verified-image requirements.
