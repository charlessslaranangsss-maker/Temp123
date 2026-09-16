# Mobile Dishwashing Trailer WordPress 404 Audit — 2026-09-15

## Scope and status

- Production site: `https://mobile-dishwashing-trailer-facility-rental.com/`
- Reported issue: approximately 442 URLs returning 404
- Status: blocked before repair; no production mutation was made
- Safety boundary: no restorable files-and-database backup was confirmed, so no bulk, permalink, plugin, redirect, database, or content change was attempted

## Evidence collected

- The public homepage and sitemap content were retrievable through a read-only web proxy.
- `robots.txt` allows crawling and identifies the site's sitemap.
- The sitemap index currently exposes 12 sitemap files:
  - `page-sitemap1.xml` through `page-sitemap10.xml`: 3,000 unique URLs each
  - `page-sitemap11.xml`: 1,098 unique URLs
  - `resources-sitemap.xml`: 61 unique URLs
  - Total listed URLs: 31,159
- A correctly parsed representative sample tested the first, middle, and last URL from every sitemap:
  - 36 attempted
  - 21 returned live page content corresponding to HTTP 200
  - 15 were inconclusive because the proxy returned HTTP 429
  - 0 of the 21 successfully fetched sample URLs returned 404
- A deliberately nonexistent URL produced the site's 404 title and an explicit upstream 404 warning, confirming the read-only method can distinguish a real 404 from live content.
- DNS resolved the origin to `209.38.156.235`, but direct TCP connections from this worker to ports 80 and 443 timed out. The in-app browser also returned `ERR_CONNECTION_TIMED_OUT` for WordPress admin.

## What remains unverified

- The exact 442 URLs were not supplied in the delegated task or repository, so none can yet be assigned to restore, redirect, intentional 404/410, or owner-decision categories.
- WordPress core/PHP versions, active theme, plugins, permalink settings, page/post status, redirect rules, generated templates, logs, and hosting configuration could not be inspected because the admin/origin was unreachable from this worker.
- No files-and-database backup record or successful restore test was available.
- No full recrawl of the reported 442-URL set was possible without the source export.

## Required continuation inputs

1. Export the exact 442-URL report, including source/tool, observed status, first-seen date, and referring page where available.
2. Provide a network path that can reach the WordPress admin/origin, or a scoped hosting/SSH/WordPress access method.
3. Confirm a recent files-and-database backup and the evidence that it is restorable.
4. After classification and the smallest safe repair, recrawl the exact input set and report fixed, redirected, intentionally removed, still broken, and inconclusive counts without blanket redirects.
5. Rotate the exposed temporary WordPress password after the work is complete and the owner explicitly authorizes the credential change; no password was transmitted or changed in this audit.

## Production change count

- Restored: 0
- Redirected: 0
- Intentionally removed: 0
- Production settings/content changed: 0
- Reported URLs awaiting exact-list classification: 442
