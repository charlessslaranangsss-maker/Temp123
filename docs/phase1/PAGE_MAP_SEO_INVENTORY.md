# Temporary123 Phase 1 Page Map and SEO Inventory

Audit date: 2026-09-15 (Asia/Manila)

Scope: read-only inventory of the local/Vercel candidate and a limited boundary check of the current public WordPress site. No page content, URL, metadata, canonical, redirect, robots, sitemap, deployment, or Search Console setting was changed.

Detailed inventory: `audit/phase1-page-map.csv`

## Executive result

The candidate has **650 rendered HTML pages** and **629 configured redirect-source URLs**, for **1,279 known route records** in the reconciled candidate inventory. Redirect sources are not counted as pages.

The 650 rendered pages agree between the generated HTML tree and `audit/build-registry.json`. The 625 records in `content/route-index.json` are not a second page total: 65 remain rendered candidate pages and 560 are legacy URLs now handled by redirects. An additional 69 redirect sources exist in `vercel.json` but not in the source route index. This explains the apparent source/output discrepancy.

All 650 rendered candidate URLs returned HTTP 200 during the live check. All 629 configured redirect sources returned HTTP 308 and their `Location` headers matched `vercel.json`. The 629 redirects resolve to 590 unique destinations; all 590 destination URLs returned HTTP 200.

The candidate is **not an indexable production release**:

- all 650 generated pages contain `meta robots="noindex,follow"`;
- the Vercel candidate serves `X-Robots-Tag: noindex, follow` on rendered pages;
- all 650 rendered pages omit canonical tags in the current preview build;
- `dist/sitemap.xml` contains zero URL entries; and
- `audit/build-registry.json` reports `domainRoutingReady: false`, 309 routes eligible under the configured scope, and zero active indexing routes.

These are consistent preview safeguards, not proof of a production SEO defect. They must be deliberately changed and re-tested only when the production-domain routing and controlled release are approved.

## Inventory reconciliation

| Source | Raw records | Reconciled meaning | Difference explained |
| --- | ---: | --- | --- |
| `audit/build-registry.json` | 650 | Rendered candidate pages | Matches generated HTML exactly |
| Generated `dist/**/index.html` | 650 | Rendered candidate pages | Matches build registry exactly |
| `content/route-index.json` | 625 | Imported/source URL records | 65 rendered; 560 redirected |
| `vercel.json` redirects | 629 | Redirect-source URLs, not pages | 560 occur in source index; 69 are additional legacy aliases |
| `dist/sitemap.xml` | 0 | Currently submitted candidate URLs | Empty because candidate is not released for indexing |
| Ordinary internal links in generated HTML | 650 rendered destinations represented | Discovery graph for rendered pages | No rendered page appeared orphaned in the static-link scan |

The reconciled candidate total is therefore:

- 650 rendered pages;
- 629 redirect sources;
- 1,279 total route records represented in the CSV.

## Rendered page map

### Broad classification

| Classification | Rendered pages |
| --- | ---: |
| Homepage | 1 |
| Location | 548 |
| Equipment/Service | 51 |
| Article/Resource | 1 |
| Calculator | 1 |
| Utility | 5 |
| Other | 43 |
| **Total** | **650** |

`Other` contains imported source and industry-style pages that do not safely fit the requested broad classes without a content-owner decision. They remain individually identified in the CSV instead of being forced into an inaccurate category.

### Template/page family

| Page family | Rendered pages |
| --- | ---: |
| Homepage | 1 |
| Location hub | 1 |
| State | 50 |
| Region | 246 |
| Regional city directory | 246 |
| Reviewed city guide | 5 |
| Equipment | 24 |
| Service | 27 |
| Industry | 8 |
| Imported source | 35 |
| Article/resource | 1 |
| Calculator | 1 |
| Utility | 5 |
| **Total** | **650** |

The five reviewed city guides are Port Angeles, Sequim, Olympia, Seattle, and Tacoma, Washington. The 246 `/cities/` routes are regional directory pages; they must not be confused with thousands of independently reviewed city landing pages.

## On-page and discovery checks

| Check | Result | Interpretation |
| --- | --- | --- |
| Live rendered-page status | 650/650 returned 200 | Candidate pages were reachable at test time |
| H1 count | 650/650 had exactly one H1 | Structural H1 count passes; wording quality is a separate audit |
| Static internal discovery | 0 rendered pages appeared orphaned | Every non-home rendered page received at least one link from another generated page |
| Canonical | 650/650 missing | Expected under the present preview gate; blocks production acceptance |
| HTML robots | 650/650 `noindex,follow` | Expected preview behavior; blocks production indexing |
| Candidate sitemap | 0 URLs | Expected preview behavior; not ready for controlled release |
| Redirect response | 629/629 returned 308 | Redirect configuration is live |
| Redirect target | 590/590 unique targets returned 200 | No broken redirect destination observed |

The static orphan check counts distinct generated pages linking to each canonical pathname. It does not measure link prominence, anchor quality, JavaScript-only interactions, external backlinks, or Google discovery.

## Vercel candidate versus public WordPress

These are separate systems and their counts must not be combined.

### Vercel candidate

- Host checked: `https://temp123-nine.vercel.app/`
- Local/generated source of truth: this repository and `dist`
- 650 rendered candidate pages plus 629 redirect sources
- preview-wide noindex behavior
- zero candidate sitemap URLs
- no candidate canonical tags in the preview build

### Current public WordPress site

- Host checked: `https://temporary123.com/`
- Homepage returned HTTP 200
- Homepage title observed: `Temporary 123 - Lease High Quality Outdoor Kitchens`
- Homepage H1 observed: `NEWS/BLOG`
- Homepage canonical observed: `https://temporary123.com/`
- Homepage meta robots observed: `follow, index`
- `https://temporary123.com/wp-sitemap.xml` returned 301 to `https://temporary123.com/sitemap_index.xml`
- The public sitemap index returned HTTP 200 and referenced 328 child page sitemaps
- The first child sitemap contained 300 URL entries and the last contained 153, but the full public sitemap corpus was not downloaded and reconciled in this task; therefore this report does **not** claim a confirmed public WordPress page total

The public WordPress sitemap, backlinks, analytics landings, and Search Console inventory still need to be reconciled against the 650 candidate pages and 629 redirect sources before a migration or production-domain switch. The CSV intentionally describes the candidate route universe only.

## CSV field guide

Each row includes:

- candidate URL path and live Vercel URL;
- route disposition (`rendered_page` or `configured_redirect`);
- configured redirect destination where applicable;
- broad classification and page family;
- state, region, and reviewed city where available;
- membership in the build registry, imported source route index, and Vercel redirects;
- generated-HTML presence;
- title, H1 count, current H1, canonical, and robots directive for rendered HTML;
- candidate sitemap inclusion;
- number of generated pages linking internally to the rendered pathname and apparent-orphan flag;
- initial live HTTP response, `Location` header, final response/destination where followed, `X-Robots-Tag`, and any request error.

Blank H1/title/canonical fields on redirect-source rows are intentional: a redirect is not an HTML page and should not be judged as though it has page markup.

## Gaps and boundaries

1. **Public WordPress URL reconciliation is incomplete.** Its 328 child sitemaps were identified, but their complete URL union was not crawled in this scoped candidate inventory.
2. **Backlink authority is unknown.** No Ahrefs export was supplied, so no candidate URL can yet be certified as preserving a valuable backlink target.
3. **Google index status is unknown.** No Search Console data or URL Inspection results were available. HTTP 200, sitemap presence, and `site:` searches do not prove indexing.
4. **Candidate production behavior is untested.** Canonicals, index directives, and populated sitemaps are deliberately absent while `domainRoutingReady` is false.
5. **Content-quality classification is not complete.** The inventory records headings and route families but does not certify uniqueness, factual accuracy, intent alignment, image appropriateness, or keyword quality.
6. **Internal-link depth and prominence are not scored.** The audit proves at least one ordinary link to each rendered page, not that the architecture is strong enough for users or search engines.
7. **Live results are time-bound.** They are observations from 2026-09-15 and do not guarantee later availability.

## Recommended priority order

1. Export all public WordPress sitemap URLs and the Ahrefs top/backlinked URLs, normalize them, and reconcile exact paths against candidate pages and redirects.
2. Build the Protected Authority URL Register and select the first 25 valuable URLs from evidence, not from route order.
3. Review the 650-page candidate inventory by template, beginning with homepage, priority service/equipment pages, states, regions, and the five reviewed cities. Keep regional city-directory pages noindex until their value and intended role are approved.
4. Resolve every valuable public URL as exact preserved 200 page or explicitly approved redirect, with original intent and backlink evidence recorded.
5. Validate unique content, one useful H1, titles/descriptions, internal links, images/alt text, and schema on the first 25.
6. Configure production-domain canonicals, robots, and the first controlled sitemap batch only after routing is approved.
7. Deploy to a production-like candidate, re-run HTTP/rendered/mobile checks, and confirm the first 25 before any Search Console submission.
8. Record authorized URL Inspection requests and actual Google results; pause before broader batches if crawl, canonical, duplicate, or quality problems appear.

## Acceptance evidence for this inventory task

- Candidate registry, source-route index, generated HTML, redirects, sitemap, and internal links were reconciled.
- All 650 rendered candidate routes were live-tested.
- All 629 redirect-source responses and all 590 unique redirect destinations were live-tested.
- The candidate and public WordPress site are reported separately.
- No production or indexation changes were made.
