# Top 25 Authority URLs

Audit date: 2026-09-15 (Asia/Singapore)

## Decision summary

The homepage is the only URL in this top-25 register that currently preserves its exact path. The other 24 historical targets return `404` on `temporary123.com`. The Vercel preview issues a one-hop `308` redirect for each of those paths, but the replacements are broader pages, have no canonical tag, and are `noindex,follow`. This is a migration-protection register, not evidence that backlink equity has transferred or that Google has indexed any replacement.

Immediate order:

1. Protect `/` and retain its exact path.
2. Restore or approve a tightly equivalent destination for the Houston kitchen, California restroom, workforce housing, and sleeper-trailer URLs.
3. Review the 20 state/province restroom URLs as a set. Do not collapse them to a generic hub unless the owner and SEO lead confirm that the location pages lack distinct useful intent.
4. Before launch, make every approved destination crawlable, self-canonical, internally linked, and included in the production sitemap.

## Source and method

The confirmed export is recorded as `temporary123.com-bbl-external-subdomains_2026-09-11_03-38-48 (1).csv.xlsx`, SHA-256 `a0b2e858845fc6df5d50078ee467b34061d4f2ae92795eea9c3db0b3379cbc62`. The original workbook is not currently present in the searched local, attachment, download, OneDrive, or temporary folders. This register therefore uses its checked-in, row-complete derivative `audit/url-inventory.csv`, whose audit record reports 148 data rows, 16 source columns, 148 exact unique URLs, and 102 normalized strategic targets.

Normalization preserved each path exactly while consolidating only protocol, `www`, and trailing-slash variants for ranking. The strongest observed row represents each normalized target; referring-domain counts were not summed across variants because source domains may overlap. Assets, off-domain URLs, malformed/tracking URLs, and duplicate normalized targets were excluded.

Ranking order is:

1. Referring domains.
2. Dofollow backlinks, because dofollow referring-domain counts are not included in the supplied export.
3. Total backlinks.
4. UR.
5. Live HTTP condition, then exact path as a deterministic tie-breaker.

Organic traffic is not present. The `Dofollow` field is a backlink count, not a referring-domain count. Four source rows have totals where dofollow plus nofollow does not reconcile to total links; the workforce-housing winner is one of them (`23,110` dofollow versus `23,073` total). These limitations prevent a claim that the list is a Google authority score.

Live verification used direct HTTP retrieval on 2026-09-15. `temporary123.com` and `temp123-nine.vercel.app` were checked separately. A live `200` alone was not treated as indexability: canonical and robots directives were inspected from returned HTML.

## Ranked register

| Rank | Exact URL | Intent | Metrics (RD / dofollow links / total / UR) | Live result | Section | Preservation and priority |
|---:|---|---|---|---|---|---|
| 1 | `https://temporary123.com/` | Nationwide temporary facility rental | 541 / 169 / 695 / 4.5 | Production `200`, self-canonical, `index`; preview `200`, no canonical, `noindex` | Homepage | Exact path retained. Highest referring-domain count; protect first. |
| 2 | `https://temporary123.com/houston-texas-mobile-kitchen-rental/` | Houston mobile kitchen rental | 8 / 5 / 12 / 0 | Production `404`; preview `308` to `/equipment-rental/mobile-kitchen-trailers/` then `200`, no canonical, `noindex` | Location | Exact slug not retained. Restore it or approve a tightly equivalent one-hop destination. |
| 3 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-california/` | California restroom trailer rental | 6 / 14 / 18 / 4.4 | Production `404`; preview `308` to `/equipment-rental/restroom-trailers/` then `200`, no canonical, `noindex` | Location | Exact location intent is lost in the broad hub redirect. |
| 4 | `https://temporary123.com/temporary-workforce-housing-facilities/` | Temporary workforce housing | 4 / 23,110 / 23,073 / 5 | Production `404`; preview `308` to `/man-camps-for-rent/` then `200`, no canonical, `noindex` | Equipment/Service | Very high link volume from four domains; reconcile metrics and inspect source-link quality before approving the mapping. |
| 5 | `https://temporary123.com/equipment-rental/sleeper-trailers/` | Sleeper trailer rental | 2 / 344 / 344 / unavailable | Production `404`; preview `308` to `/equipment-rental/mobile-sleep-trailers/` then `200`, no canonical, `noindex` | Equipment/Service | Highest followed-link count among two-domain targets; exact slug is not retained. |
| 6 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-alabama/` | Alabama restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Alabama page. |
| 7 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-alaska/` | Alaska restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Alaska page. |
| 8 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-alberta-ca/` | Alberta Canada restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve the supplied `alberta-ca` slug unless an equivalent is approved. |
| 9 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-arizona/` | Arizona restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Arizona page. |
| 10 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-arkansas/` | Arkansas restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Arkansas page. |
| 11 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-colorado/` | Colorado restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Colorado page. |
| 12 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-connecticut/` | Connecticut restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Connecticut page. |
| 13 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-delaware/` | Delaware restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Delaware page. |
| 14 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-district-of-columbia/` | District of Columbia restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent District of Columbia page. |
| 15 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-florida/` | Florida restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Florida page. |
| 16 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-georgia/` | Georgia restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Georgia page. |
| 17 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-hawaii/` | Hawaii restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Hawaii page. |
| 18 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-idaho/` | Idaho restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Idaho page. |
| 19 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-illinois/` | Illinois restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Illinois page. |
| 20 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-indiana/` | Indiana restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Indiana page. |
| 21 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-iowa/` | Iowa restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Iowa page. |
| 22 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-kansas/` | Kansas restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Kansas page. |
| 23 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-kentucky/` | Kentucky restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Kentucky page. |
| 24 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-louisiana/` | Louisiana restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Louisiana page. |
| 25 | `https://temporary123.com/equipment-rental/restroom-trailers/portable-restroom-trailers-in-maine/` | Maine restroom trailer rental | 2 / 13 / 13 / 4.4 | Production `404`; preview `308` to restroom hub then `200`, no canonical, `noindex` | Location | Preserve or approve an equivalent Maine page. |

## Acceptance gate

No URL above should be marked protected until its production destination returns the intended status, keeps equivalent useful content, has the approved canonical/indexability state, appears in internal linking and the production sitemap where appropriate, and is checked after launch. This work did not change source code, redirects, Search Console, publishing, or deployment.
