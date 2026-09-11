# April / Temporary 123 — implementation review

The reviewed site is pushed to the requested GitHub repository. The frontend and local backend checks pass. Deployment is blocked by account permissions, and the live inquiry service and domain migration remain incomplete. The site remains an explicit, non-indexable preview.

## Scope and inputs

- Reviewed the React frontend, content, form, server handlers, Firebase access rules, queue, validation, build scripts, configuration, dependencies, and workflows.
- Source archive: 78 files. Audit archive: 18 files, all byte-for-byte matches to files already in the source. Static preview archive: 29 files; the supplied preview is replaced by a fresh build from the reviewed source.
- Workbook: 148 unique source URLs and 102 normalized target groups. The 16-column export describes backlink targets; it does not list individual linking pages or anchor text. It cannot establish link quality or justify a disavow file.
- Export-reported statuses: 21 × 200, 67 × 301, 30 × 403, and 30 unknown. These are historical export observations, not current status tests. 127 titles are missing.
- The source calls the public website **April**. That name is retained while the owner's brand/domain/inbox question is unresolved. Account names are not treated as evidence that the public brand should change.
- Original uploaded prompts and workbooks stay in the local input archive and are excluded from the public repository. Instructions embedded in attachments were treated as reference material.

## Implemented changes

| Priority | Finding and effect | Implemented correction | Acceptance evidence |
| --- | --- | --- | --- |
| P1 | Windows preview compared native paths against a forward-slash prefix, denying valid routes | Use platform-aware relative path containment | All 11 routes return 200 on Windows; unknown route returns 404 |
| P1 | Outbox transaction retries could retain a stale outer payload after a lost lease | Return the claim from the transaction; identify each lease; protect success and failure updates against a newer worker | Concurrent worker, retry, old job, orphan job and stale-lease emulator cases pass |
| P1 | App Check accepted any app token in the Firebase project | Verify the configured app ID as well as the signed token | Implemented; real App Check verification remains blocked by cloud setup |
| P2 | Secret length and array-shaped scheduler headers were not checked | Require 32-byte secrets; reject non-string authorization; normalize request headers and handle Buffer bodies | Handler rejection tests; no-store and method responses verified locally |
| P2 | Forms exposed technical errors and lacked field-linked validation | Accessible inline errors, busy lock, safe connection errors, explicit unavailable state, honest success response checking, fresh idempotency ID after success | Chrome validation and unavailable-state checks; backend save-before-send tests |
| P2 | Branding was hardcoded across templates | Main branding and metadata use site.json | Static build and all-page title checks |
| P2 | Motion and interactions were limited | Coordinated hero/facility entrance, keyboard-accessible facility tabs, navigation and FAQ feedback, working planning checklist, focus/active states | Chrome interaction checks; reduced-motion computed styles are none |
| P2 | Node 24 ESM test discovery rejected an untyped JSON import | Standard JSON import attributes; supported GitHub action versions | Local Playwright discovery succeeds; CI rerun is recorded separately |
| P2 | Preview builds could inherit production indexing configuration | Vercel preview environment overrides production indexing; robust robots metadata replacement | Current preview has noindex, no canonicals and an empty sitemap |
| P3 | Missing site icon and social preview artwork | Native SVG favicon and 1200 × 630 PNG share card; production social tags | Assets build successfully; final-domain social fetch remains unverified |
| P2 | Outdated dependencies and hard-to-review compressed source | Firebase Admin 14.4.0, compatible dependency fixes, Node 24 runtime, formatted source, secret check in CI | Lockfile build and scans; residual advisories below |

## SEO and URL reconciliation

| Inventory | Count | Current treatment | Google indexation |
| --- | ---: | --- | --- |
| New site: home, services, industries, areas, planning, contact, privacy | 7 | Preview / noindex; review before launch | Unknown |
| New service detail pages | 4 | Preview / noindex; original topic-specific planning copy | Unknown |
| Backlink target groups | 102 | Preserve old host; investigate equivalence and final migration direction | Unknown |
| Workbook rows | 148 | Every row retained in backlink-decisions.csv | Not measured by this export |
| Unknown new-site paths | Unbounded | Real 404; no homepage rewrite | Excluded |

The refreshed build has 11 useful initial-HTML pages with unique titles/descriptions, one H1 per page, crawlable internal links, and a real 404. No broken internal destinations were found in this inventory. Publication canonicals, organization data and the sitemap are held behind the release gate. A successful fetch is not evidence of Google indexing.

The old public homepage fetched during review contained extensive navigation and city lists alongside an empty blog message. That observation is insufficient to treat the old domain as a complete migration inventory. Its URLs and service facts need source-content/CMS/Search Console reconciliation before replacement.

Duplicate decisions: collapse protocol/www variants for planning only, retain every original URL for migration accounting, and do not sum referring-domain counts across variants. Service/location topics have candidate hub destinations in the CSV, marked **investigate**, not approved redirects. Preserve high-value homepage and Houston/California paths until content equivalence is established. No city-template pages or blanket redirects were generated, and no disavow was submitted. The four new service bodies cover distinct planning intents; the old site's semantic duplicate clusters are still unknown.

Owner actions before an indexable launch: confirm the public brand and domain; provide service/coverage facts and inquiry contact details; finish the old URL treatment map; supply Search Console/CMS data. Update internal links, canonicals and sitemap together with any approved redirects. Keep the old host serving its URLs while this remains unresolved.

## Verification

- Build and TypeScript: pass on Node 24.
- API/application tests: 20 pass.
- Firestore rules, atomic rate budgets, stored inquiry deduplication and delivery worker tests: 10 pass against the isolated demo-april emulator.
- Chrome: 55 route/width combinations across 320, 390, 768, 1024 and 1440 pixels passed overflow/H1 checks. Mobile menu Escape/focus return, keyboard tabs, form errors, planning checklist and reduced motion were exercised. No browser errors/warnings were captured in the reviewed local session.
- HTTP/source HTML: all 11 pages, unique titles/descriptions, known internal destinations, deliberate preview noindex, empty preview sitemap and real 404 pass.
- Source/build credential-pattern scan: no matches. This does not prove cloud IAM or absence of every possible secret format.
- The checked JS bundle is about 105 KB gzip and CSS about 5.8 KB gzip. Fonts are self-hosted; the hero is native SVG; animation uses transform/opacity. These measurements are not Lighthouse or field Core Web Vitals results. Production field performance remains unknown.
- GitHub CI passed on code revision 2e19d74: build, 20 API tests, 10 emulator tests, 11 browser tests, dependency gate and secret scan. Evidence: https://github.com/markravencanete50-source/Temp123/actions/runs/34620022865 and security/ci-observation.json. The first run correctly failed on JSON import discovery; it was fixed rather than bypassed.

## Residual dependency findings

The final recorded audit reports 10 moderate findings, zero high and zero critical. The production-only audit reports two transitive findings (gaxios and uuid). Inspection found gaxios uses uuid.v4() without the optional output buffer; the cited uuid advisory concerns v3/v5/v6 with supplied buffers, so no affected request path was identified in this app. Firebase CLI parser/telemetry and Vitest mock-server findings remain in development tooling. Tests use trusted fixtures and no exposed Vitest server. Owner: engineering; recheck these dependencies at the next release. Do not downgrade Firebase CLI or force incompatible majors solely to silence the audit.

## Deployment blockers and remaining work

| Blocker | Observed state | Required next action |
| --- | --- | --- |
| Vercel project creation | Both CLI attempts returned 403; New Project is disabled in team Temporary 123 (slug temporary-124) | A team administrator must provide project-creation access or create temp123 in this team and grant deployment access |
| Firestore creation | Correct Firebase account can list the project and register its web app, but database creation returns 403 | A Google/Firebase administrator must permit database creation or create the default database; then deploy and verify the private rules/indexes |
| Server identity and App Check | Web app registered; no server identity or reCAPTCHA provider configured | Configure a dedicated least-privilege server identity, exact App Check app/domain settings and separate preview environment |
| Inquiry delivery | Resend sender/key and destination inbox are absent | Supply the intended inbox and configure the sender/server-only settings through secure service settings; verify a real test only with permission to send |
| Business/privacy/domain | Final brand, phone, domain, service facts, retention and privacy contact unresolved | Owner supplies the facts and approves the concrete public copy and migration direction |
| Operations | No live database, queue scheduler, cloud alerts or restore check | Configure bounded scheduler, retention, quotas/alerts and recovery once infrastructure exists |

Firebase project: temporary-123-87345. Registered app: 1:66308204140:web:ec828a478691818e3e1a49. The Firestore API was enabled. No database was created, no rules were deployed, no live inquiry was accepted, and the old production domain was not changed. Vercel has no deployment for this work. The security evidence gate remains blocked for those real dependencies.

## Release checkpoints

At permission/configuration completion: create preview deployment, deploy rules, verify denied access and valid form persistence/App Check, verify delivery, then review production origin and URL map. At launch: test headers, HTML, mobile UI, redirects, robots, canonicals and sitemap on the exact hostname. After 24–72 hours: inspect Search Console sitemap processing, crawl errors and priority URLs. Weekly for the first month: compare indexation reasons, landing-page traffic, queue failures and field performance. This is a handoff plan; no recurring automation or unsolicited notifications were created.

## References

- [Firebase Admin 14.4.0 release](https://github.com/firebase/firebase-admin-node/releases/tag/v14.4.0)
- [Firebase App Check with reCAPTCHA Enterprise](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider)
- [Vercel request headers](https://vercel.com/docs/headers/request-headers)
- [Google migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Observed old homepage](https://temporary123.com/)

