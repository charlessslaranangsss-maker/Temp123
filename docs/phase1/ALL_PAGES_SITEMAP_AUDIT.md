# Temporary123 Full Page Inventory and Sitemap Audit

Audited: 2026-09-15 (Asia/Manila)

## Result

The current route registry contains **650 public page routes**. Every registered route has a generated local HTML file, and every corresponding URL on `https://temp123-nine.vercel.app` returned HTTP 200 during this audit.

The complete page-by-page list is in `audit/all-pages-sitemap.csv`. It records each route, page family, live preview URL, HTTP status, robots directive, canonical, and live sitemap membership.

The live preview sitemap at `https://temp123-nine.vercel.app/sitemap.xml` is valid but intentionally contains **zero URLs**. All 650 preview pages currently render `noindex,follow` and no canonical because the configured canonical origin is `https://temporary123.com` and `domainRoutingReady` is false. Adding these preview URLs to the sitemap would conflict with their noindex state and would expose the Vercel preview host as if it were the preferred production origin.

## Reconciled inventory

| Page family | Pages |
| --- | ---: |
| Homepage | 1 |
| Service detail | 26 |
| Core or preserved legacy | 52 |
| Equipment | 24 |
| Region | 246 |
| Region city directory | 246 |
| Reviewed city | 5 |
| State | 50 |
| **Total** | **650** |

| Check | Result |
| --- | ---: |
| Registered routes | 650 |
| Generated route HTML files present | 650 |
| Live preview pages returning HTTP 200 | 650 |
| Live redirects | 0 |
| Live request errors | 0 |
| Live pages carrying `noindex` | 650 |
| Live pages with a canonical | 0 |
| URLs in the live preview sitemap | 0 |
| Registry routes indexable in this build | 0 |

The generated `404.html` is an error document, not a public content route, and is therefore correctly excluded from the 650-page inventory and from the sitemap.

## Sitemap release requirement

“All pages” and “all sitemap URLs” should not be treated as the same set. A page belongs in a production sitemap only when it:

1. is approved for the current controlled indexing batch;
2. returns HTTP 200 on the canonical production domain;
3. is indexable (`index,follow`);
4. has a self-referencing canonical on `https://temporary123.com`;
5. contains reviewed, useful, non-duplicative content;
6. is internally linked and belongs to the intended indexing scope; and
7. has passed the URL, metadata, schema, mobile, and content checks for that batch.

The current configuration already specifies a 25-URL first batch, but it deliberately activates no URLs while `domainRoutingReady` is false. The safe next release is therefore the approved first 25 canonical production URLs—not all 650 preview URLs at once. Later approved batches can be added to the production sitemap according to the controlled rollout requirement in `docs/BOSS_REQUIREMENTS.md`.

## Artifacts

- Complete page list: `audit/all-pages-sitemap.csv`
- Machine-readable audit summary: `audit/all-pages-sitemap-summary.json`
- Current build registry: `audit/build-registry.json`
- Live sitemap checked: `https://temp123-nine.vercel.app/sitemap.xml`
- Live robots file checked: `https://temp123-nine.vercel.app/robots.txt`

## Validation boundary

This audit verifies the generated inventory and live Vercel preview behavior as observed on 2026-09-15. It does not claim that the canonical `temporary123.com` domain is routed to this build, that Google has indexed any page, or that all 650 routes have passed production content approval. No sitemap-generation, routing, indexing, deployment, or Search Console change was made by this audit.
