# Legacy Backlink URL Parity Report

## Scope

- Source rows: 153
- Unique absolute URLs: 153
- Unique paths: 105
- Duplicate host or protocol rows: 48
- Canonical replacement pages: 23

The export is treated as historical evidence. Its HTTP-code column describes the old crawl and does not control the current routing decision.

## Pre-change production result

- 148 rows ended at HTTP 200.
- 5 rows ended at HTTP 404 across 3 unique paths.
- All 148 successful final pages exposed `noindex,follow`.
- None of the successful final pages emitted a canonical.

## Repair

Permanent mappings were added for:

- `/emergency-container-modular-remote-executive-hotel-suites/` to `/man-camps-for-rent/`
- `/emergency-modular-shelters-contained-for-rental/` to `/man-camps-for-rent/`
- `/greensboro-north-carolina-usa-temporary-restroom-building-rental/` to `/equipment-rental/restroom-trailers/`

`www.temporary123.com` requests are permanently consolidated onto `temporary123.com` while preserving the requested path. The 23 canonical destinations receiving the supplied legacy links lead the controlled 25-page indexing batch. The remaining two pages are `/services/` and `/service-areas/`.

## Local acceptance

- 153/153 source rows pass.
- 24 rows are current direct pages.
- 129 rows use permanent path redirects.
- 23/23 final destinations have generated HTML.
- 23/23 final destinations emit `index,follow` and exact apex self-canonicals.
- 23/23 final destinations appear in the 25-URL production sitemap.
- 0 redirect loops and 0 missing destination pages were found.

Per-row evidence is in `results.csv`. Aggregate counts are in `summary.json`. `live-prechange.json` preserves the response chains observed before release.

## Production acceptance

- Repository: `Temporary-123-Inc/Temporary-123`, branch `main`
- Deployed commit: `4df32c3`
- READY Vercel deployment: `dpl_CLEabVTivoctpYLbKg23TV39QURD`
- Audit timestamp: `2026-09-18T10:54:55Z`
- Source URL results: 153 passed, 0 failed
- Unique source paths: 105
- Unique final URLs: 23
- Maximum redirect hops: 2
- All redirect hops permanent: yes
- All final responses HTTPS apex HTTP 200: yes
- All final pages `index,follow`: yes
- All final pages exact apex self-canonical: yes
- All final pages in the production sitemap: yes
- Production sitemap: HTTP 200, exactly 25 URLs
- Production robots.txt: HTTP 200 and declares the sitemap
- Non-batch control `/contact-us/`: `noindex,follow`, no canonical
- Vercel preview alias: `X-Robots-Tag: noindex, follow`

The complete response chains and metadata are recorded in `live-postchange.csv` and `live-postchange.json`; aggregate production assertions are in `live-summary.json`.

## Validation boundary

This report proves route coverage and the production response, redirect, canonical, robots and sitemap state observed at the audit timestamp. Google recrawling and index inclusion are external outcomes and require later Search Console or search-result evidence.
