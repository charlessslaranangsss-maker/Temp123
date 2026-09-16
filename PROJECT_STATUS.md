# Temporary123 Project Status

Last updated: 2026-09-16 (Asia/Manila)

## Current state

- Repository: `C:\Users\Charles\Documents\New project\Temporary 123`
- Branch: `main`
- Live preview referenced by the team: https://temp123-nine.vercel.app/
- Working tree: contains active uncommitted changes from earlier Codex tasks. Ownership must be confirmed before those files are edited further.

## Active workstreams

| Workstream | Status | Current evidence | Next action |
| --- | --- | --- | --- |
| Cross-workstream acceptance QA | Review needed; read-only handoff complete | Build/type/prerender, 548-page H1 audit, city/link audits, and 14 focused calculator/carousel browser checks passed. QA found semantic image order `inside, detail, outside` instead of `inside, outside, detail`; dashboard inventory remains at 650 while the build now generates 651 routes; one location test rejects valid `For Rent` wording. Concurrent builds removed `dist/404.html` during broader Playwright runs, so their connection failures are not product evidence. | Carousel/H1/dashboard owners resolve or confirm findings, then the boss task runs one uncontended final build and browser acceptance gate. No deployment before that gate. |
| Port Angeles service-area revision | Local wording clarification implemented; not deployed | The 22 ft, 10-stall shower-trailer link now ends with `with individual rooms` only on Port Angeles. TypeScript, client build, and focused server-render checks passed on 2026-09-16; H1 and link destination are unchanged. | Owner review, then include in an authorized deployment and verify the live desktop/mobile page |
| Homepage/map SEO | Active changes present | Modified homepage, site, content, editorial, prerender, and audit files | Confirm responsible task and run regression checks before merge/deploy |
| Nationwide rental calculator | Calculator split deployed; exact-quote activation blocked by missing production integration values | State, city, and optional ZIP are separate. `Calculate Starting Estimate` makes no contact request; `Request Exact Quote` is a separate protected action and is visibly disabled while intake is unavailable. 44 automated tests, the production build, 4 local browser tests, and 4 live browser tests passed on 2026-09-15. Current production deployment: `dpl_J7uvvuU7BA8LLTQWoNW2d1gvGWzS` | Supply and verify the Firebase web/App Check configuration, server persistence credentials, approved Resend sender and recipient, then run one controlled fictional QA submission before setting `CONTACT_ENABLED=true` |
| H1/keyword plan | Boss-approved main-site implementation complete locally; not deployed | Supported state, region, reviewed-city, service/category/model, and hub H1s now use deterministic topical-service + facility/equipment + rental-intent phrasing. The homepage, URLs, canonicals, robots/indexing, unsupported brands/specifications, dishwashing, and refrigeration wording were preserved. The production build generated 651 pages plus 404; 548 location H1s passed the uniqueness/formula/title sweep; 44 existing tests, 4 focused H1 unit tests, and 8 focused Chromium checks passed on 2026-09-16. | Owner review, then include in an authorized deployment and verify representative live pages and metadata |
| Service-area state modal headlines | Approved H1-rule wording implemented locally; not deployed | State modals now reuse the exact deterministic state headline source used by dedicated state pages. The modal heading remains an `h2`, so `/service-areas/` retains one page-level `h1`; dedicated state-guide links and routes are unchanged. The full production build and 8 focused browser tests passed on 2026-09-16. | Owner review, then include in an authorized deployment and verify representative live state selections |
| Phase 1 content/H1 plan | Audit complete; approved H1 subset implemented locally | `docs/phase1/CONTENT_H1_AUDIT.md` and the proposal CSV remain the audit baseline. The Boss-approved, source-supported Temporary123 subset is now implemented; held or unsupported terms remain unchanged. | Review the local H1 changes; resolve any remaining held content/brand/specification decisions separately |
| Exact service-image carousels | Urgent presentation refinement complete locally; not deployed | Ten exact routes use approved source photos with interiors and equipment details before exteriors. Autoplay exposes persistent Pause/Play, manual navigation pauses rotation, reduced-motion disables automatic movement, and inactive image alt text is hidden. Desktop/mobile checks verified edge-to-edge hero media within its figure. The approved Shower image remains on the homepage; Restroom uses a truthful pending state because the available combination-unit image is not a verified restroom-only trailer. Setting-specific alt text is used only where a commercial warehouse/building is visibly confirmed. | Boss task runs one uncontended final build/preview gate. Obtain a verified restroom-only asset and exact assets for documented missing models before expansion. Production/CDN rendering remains unverified because no deployment was performed. |
| Authority URL preservation | Planning required | Boss requirements captured; no completed Ahrefs protected-URL register is confirmed here | Import Ahrefs export and build the top-25 verification register |
| Controlled indexing rollout | Not started/unknown | Rollout requirement captured | Start only after top-25 pages pass technical and content QA |
| Full page inventory and sitemap reconciliation | Audit complete; owner review XML generated; official preview sitemap correctly remains empty | All 650 registered routes have local HTML and returned HTTP 200 live; all 650 are `noindex`, none has a canonical, and the live preview sitemap contains 0 URLs. Complete inventory: `audit/all-pages-sitemap.csv`. Review-only XML: `public/sitemap-review.xml`, containing 650 unique future `temporary123.com` URLs. | Route the canonical `temporary123.com` origin, approve the first controlled 25-page batch, then verify indexability, self-canonicals, and production sitemap membership before release. Do not submit the review XML to Google. |
| Central SEO management dashboard | Live-refresh defect fixed locally; not deployed | The deployed preview was directly confirmed to serve a frozen prerendered orange `Running...` / disabled `Refreshing...` control even though `/api/seo-live` returned HTTP 200. Local dashboard-only hydration now starts the stateful controls; the prerender fallback is enabled and honest, and a 25-second client timeout prevents indefinite refresh. Five component tests, typecheck, full 651-page build, and focused Chromium success/failure/retry checks passed on 2026-09-16. | Include the fix in an authorized deployment, then verify the live dashboard transitions from running to a timestamp or explicit error and that manual refresh re-enables. Add authenticated owner access before confidential data; provider integrations remain unconnected. |
| Mobile Dishwashing Trailer WordPress 404 repair | Blocked before production change | Public sitemap contains 31,159 listed URLs; representative sample found 21 live pages, 0 confirmed 404s, and 15 proxy-throttled requests. Direct origin/admin access timed out. | Obtain exact 442-URL export, reachable admin/hosting path, and verified restorable files-and-database backup |

## Files currently changed or newly created

These were present before the coordination system was added. Do not assume ownership:

- `.gitignore`
- `audit/build-registry.json`
- `audit/homepage-revision-check.json`
- `audit/indexing-rollout.json`
- `audit/location-schema-check.json`
- `audit/h1-proposed-mapping-2026-09-15.csv`
- `docs/temporary123-keyword-h1-audit.md`
- `package.json`
- `scripts/audit-external-h1.mjs`
- `scripts/prerender.tsx`
- `src/Home.tsx`
- `src/Site.tsx`
- `src/cityEditorial.ts`
- `src/content.ts`
- `src/main.tsx`
- `src/RentalCalculator.tsx`
- `src/calculator.css`
- `src/calculatorData.ts`
- `tests/browser/calculator.spec.ts`
- `tests/browser/iowa-heading.spec.ts`
- `tests/calculator.test.ts`

The carousel implementation workstream owns the component, exact-route registry, isolated browser enhancer, generated responsive assets, route/homepage integration, and focused tests listed in `docs/PAGE_ASSIGNMENTS.md`. Local implementation is complete for the ten verified exact-model routes; missing and ambiguous models remain deliberately unpictured.

The 2026-09-15 WordPress 404 audit added only coordination documentation in this repository; it did not change the external production site. See `docs/wordpress-404-audit-2026-09-15.md`.

## Completion rule

A workstream is complete only when its implementation, relevant automated checks, live or preview behavior, SEO/runtime boundaries, and remaining risks are recorded. A build, HTTP 200 response, or deployment alone is not completion.

## 2026-09-16 Google Drive source-asset collection

- Downloaded the supplied Drive collection into `work/drive-assets-2026-09-16/`.
- Organized 149 images (323,702,572 bytes) into 25 unique equipment folders. The supplied parent `Equipments` link duplicated 24 supplied child links and also exposed one omitted child, `20ft Laundry Container`; each equipment group is stored once.
- Added `manifest.csv`, `SHA256SUMS.txt`, and a local `README.md`.
- Every image matched its Drive-reported byte size, and Pillow decoded all 149 images with zero corrupt files.
- This is a source-only collection. No files were placed in `public/`, no page or image mapping changed, and nothing was deployed.
