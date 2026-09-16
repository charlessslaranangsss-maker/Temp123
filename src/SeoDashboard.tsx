import audit from "../audit/all-pages-sitemap-summary.json" with { type: "json" };
import { useCallback, useEffect, useMemo, useState } from "react";
import { authorityTop25, type EvidenceKind } from "./authorityTop25";

type LivePageCheck = {
  status: number | null;
  redirectLocation: string | null;
  responseMs: number;
  canonical: string | null;
  title: string | null;
  noindex: boolean | null;
  error: string | null;
};

type LiveSnapshot = {
  generatedAt: string;
  refreshSeconds: number;
  production: { homepage: LivePageCheck; robots: { status: number | null }; sitemap: { status: number | null; entries: number; url: string } };
  preview: { homepage: LivePageCheck; robots: { status: number | null }; sitemap: { status: number | null; entries: number; url: string } };
  priorityUrls: Array<{ rank: number; production: LivePageCheck; preview: LivePageCheck }>;
};

type DomainAuthoritySite = {
  domain: string;
  siteType: string;
  inventoryEvidence: EvidenceKind;
  readiness: string;
  metric: string;
  score: string;
  scoreEvidence: EvidenceKind;
  source: string;
  checkedAt: string;
  searchConsole: string;
};

export const domainAuthoritySites: DomainAuthoritySite[] = [
  {
    domain: "temporary123.com",
    siteType: "Multi-service temporary facilities",
    inventoryEvidence: "Manual",
    readiness: "Preview blocked from indexing",
    metric: "DA",
    score: "32",
    scoreEvidence: "Manual",
    source: "Owner-provided baseline; no report or API evidence imported",
    checkedAt: "Unknown",
    searchConsole: "Not connected",
  },
];

const checkedDate = new Date(audit.checkedAt).toLocaleString("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

function evidenceClass(kind: EvidenceKind) {
  return kind.toLowerCase();
}

function checkerUrl(provider: "Ahrefs" | "Moz", domain: string) {
  return provider === "Ahrefs"
    ? `https://ahrefs.com/website-authority-checker?target=${encodeURIComponent(domain)}`
    : "https://moz.com/domain-analysis";
}

export function SeoDashboard() {
  const [live, setLive] = useState<LiveSnapshot | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  // This route is prerendered. Keep the server HTML recoverable until the
  // dashboard-only hydration in main.tsx attaches the live controls.
  const [refreshing, setRefreshing] = useState(false);
  const refreshLiveData = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/seo-live", {
        cache: "no-store",
        signal: AbortSignal.timeout(25_000),
      });
      if (!response.ok) throw new Error(`Live endpoint returned ${response.status}`);
      setLive((await response.json()) as LiveSnapshot);
      setLiveError(null);
    } catch (error) {
      setLiveError(error instanceof Error ? error.message : "Live checks failed");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshLiveData();
    const interval = window.setInterval(() => void refreshLiveData(), 300_000);
    return () => window.clearInterval(interval);
  }, [refreshLiveData]);

  const liveByRank = useMemo(
    () => new Map(live?.priorityUrls.map((row) => [row.rank, row]) || []),
    [live],
  );
  const staticMissingExactUrls = authorityTop25.filter(
    (row) => row.exactSlugStatus === "Missing",
  ).length;
  const livePreserved = live?.priorityUrls.filter(
    (row) => row.preview.status === 200 && !row.preview.redirectLocation,
  ).length;
  const missingExactUrls = livePreserved == null
    ? staticMissingExactUrls
    : authorityTop25.length - livePreserved;
  const googleVerified = authorityTop25.filter(
    (row) => row.googleIndexStatus !== "Unknown",
  ).length;
  const checks = live ? [
    {
      label: "Preview homepage availability",
      value: `${live.preview.homepage.status ?? "Error"}`,
      pass: live.preview.homepage.status === 200,
      evidence: "Live HTTP check",
    },
    {
      label: "Priority exact URLs",
      value: `${livePreserved}/${authorityTop25.length}`,
      pass: livePreserved === authorityTop25.length,
      evidence: "Live HTTP checks; redirects do not count",
    },
    {
      label: "Preview homepage indexable",
      value: live.preview.homepage.noindex === false ? "Yes" : "No",
      pass: live.preview.homepage.noindex === false,
      evidence: "Live meta/X-Robots check",
    },
    {
      label: "Preview homepage canonical",
      value: live.preview.homepage.canonical ? "Present" : "Missing",
      pass: Boolean(live.preview.homepage.canonical),
      evidence: "Live HTML check",
    },
    {
      label: "Preview sitemap",
      value: live.preview.sitemap.status === 200 ? `${live.preview.sitemap.entries} entries` : "Unavailable",
      pass: live.preview.sitemap.status === 200 && live.preview.sitemap.entries > 0,
      evidence: "Live sitemap check",
    },
  ] : [
    { label: "Preview HTML availability", value: `${audit.live200}/${audit.registryPages}`, pass: audit.live200 === audit.registryPages, evidence: "Stored crawl fallback" },
    { label: "Preview HTTP errors", value: `${audit.liveErrors}`, pass: audit.liveErrors === 0, evidence: "Stored crawl fallback" },
    { label: "Preview indexable", value: `${audit.registryIndexable}/${audit.registryPages}`, pass: audit.registryIndexable === audit.registryPages, evidence: "Stored crawl fallback" },
    { label: "Preview canonicals", value: `${audit.canonicalPresent}/${audit.registryPages}`, pass: audit.canonicalPresent === audit.registryPages, evidence: "Stored crawl fallback" },
    { label: "Preview sitemap membership", value: `${audit.sitemapIncluded}/${audit.registryPages}`, pass: audit.sitemapIncluded === audit.registryPages, evidence: "Stored crawl fallback" },
  ];
  const readiness = Math.round(
    (checks.filter((item) => item.pass).length / checks.length) * 100,
  );
  const currentGeneratedPages = audit.registryPages + 1;

  return (
    <div className="seo-shell">
      <aside className="seo-sidebar">
        <a className="seo-brand" href="/">
          Temporary<span>123</span>
        </a>
        <p>SEO evidence center</p>
        <nav aria-label="Dashboard sections">
          <a href="#indexing">Google status</a>
          <a href="#domain-authority">Authority metrics</a>
          <a href="#overview">Overview</a>
          <a href="#portfolio">Portfolio readiness</a>
          <a href="#authority">Protected URLs</a>
          <a href="#workflow">Next checks</a>
        </nav>
        <a className="seo-back" href="/">
          ← Return to website
        </a>
      </aside>

      <main className="seo-main">
        <header className="seo-topbar">
          <div>
            <span className="seo-eyebrow">
              OWNER-VISIBLE · EVIDENCE LABELED
            </span>
            <h1>SEO Migration Dashboard</h1>
            <p>
              Temporary123 · Top-25 authority pilot and preview crawl status
            </p>
          </div>
          <span className="seo-mode">LIVE HTTP · AUTO REFRESH 5 MIN</span>
        </header>

        <div className="seo-live-controls" role="status" aria-live="polite">
          <span className={`live-dot ${liveError ? "error" : live ? "ready" : "loading"}`} />
          <span>
            {liveError
              ? `Live check failed: ${liveError}. Showing stored evidence.`
              : live
                ? `Live checked ${new Date(live.generatedAt).toLocaleString("en-US")}`
                : refreshing
                  ? "Running live production and preview checks…"
                  : "Stored evidence loaded. Run live checks when ready."}
          </span>
          <button type="button" onClick={() => void refreshLiveData()} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "Refresh now"}
          </button>
        </div>

        <div className="seo-alert" role="note">
          <strong>Access boundary:</strong> this dashboard is a read-only
          preview route, not an authenticated owner portal. Do not add
          confidential exports or credentials until an owner access gate exists.
        </div>

        <section id="overview" className="seo-section seo-order-overview">
          <div className="seo-kpis">
            <article>
              <span>Protected URLs</span>
              <strong>{authorityTop25.length}</strong>
              <small>Imported pilot register</small>
            </article>
            <article>
              <span>Exact paths preserved</span>
              <strong>{authorityTop25.length - missingExactUrls}</strong>
              <small>{live ? "Live preview exact-path checks" : "Stored audit fallback"}</small>
            </article>
            <article className="warning-card">
              <span>Exact paths missing</span>
              <strong>{missingExactUrls}</strong>
              <small>Require restore or approved redirect</small>
            </article>
            <article>
              <span>Live priority URLs checked</span>
              <strong>{live?.priorityUrls.length ?? 0}</strong>
              <small>{live ? "Production + preview" : `Stored crawl: ${checkedDate}`}</small>
            </article>
            <article>
              <span>Google-verified URLs</span>
              <strong>{googleVerified}</strong>
              <small>Search Console not connected</small>
            </article>
            <article>
              <span>Current generated pages</span>
              <strong>{currentGeneratedPages}</strong>
              <small>
                {audit.registryPages} audited routes + this dashboard
              </small>
            </article>
          </div>

          <div className="seo-grid-two">
            <article className="seo-panel readiness">
              <div className="panel-heading">
                <div>
                  <span className="seo-eyebrow">TECHNICAL PREVIEW GATE</span>
                  <h2>Migration readiness</h2>
                </div>
                <strong>{readiness}%</strong>
              </div>
              <progress
                className="seo-progress"
                aria-label="Migration readiness"
                max={100}
                value={readiness}
              >
                {readiness}%
              </progress>
              <p className="seo-note">
                Five equally weighted preview checks. This is not a ranking,
                traffic, or complete SEO score.
              </p>
              {checks.map((check) => (
                <div className="seo-check" key={check.label}>
                  <span className={check.pass ? "check-pass" : "check-fail"}>
                    {check.pass ? "✓" : "!"}
                  </span>
                  <span>
                    {check.label}
                    <small>{check.evidence}</small>
                  </span>
                  <strong>{check.value}</strong>
                </div>
              ))}
            </article>
            <article className="seo-panel">
              <span className="seo-eyebrow">EVIDENCE LEGEND</span>
              <h2>What each label means</h2>
              <dl className="evidence-legend">
                <div>
                  <dt>
                    <span className="evidence observed">Observed</span>
                  </dt>
                  <dd>
                    Directly checked in a crawl, response, or source artifact.
                  </dd>
                </div>
                <div>
                  <dt>
                    <span className="evidence imported">Imported</span>
                  </dt>
                  <dd>
                    Loaded from a named third-party or owner-supplied export.
                  </dd>
                </div>
                <div>
                  <dt>
                    <span className="evidence manual">Manual</span>
                  </dt>
                  <dd>
                    Owner-entered baseline without independent verification.
                  </dd>
                </div>
                <div>
                  <dt>
                    <span className="evidence unknown">Unknown</span>
                  </dt>
                  <dd>No connected source or sufficient evidence.</dd>
                </div>
              </dl>
              <p className="seo-stamp">
                Crawl environment: {audit.previewOrigin}
              </p>
            </article>
          </div>
        </section>

        <section id="portfolio" className="seo-section seo-order-portfolio">
          <div className="section-heading">
            <div>
              <span className="seo-eyebrow">
                PORTFOLIO / SITE-TYPE READINESS
              </span>
              <h2>Registered websites</h2>
            </div>
            <span className="data-chip">1 DOMAIN · MANUAL INVENTORY</span>
          </div>
          <div className="seo-table-wrap compact-table">
            <table>
              <thead>
                <tr>
                  <th>Website</th>
                  <th>Site type</th>
                  <th>Inventory</th>
                  <th>Technical status</th>
                  <th>Authority evidence</th>
                  <th>Google verification</th>
                  <th>Readiness</th>
                </tr>
              </thead>
              <tbody>
                {domainAuthoritySites.map((site) => (
                  <tr key={site.domain}>
                    <td>
                      <a
                        href={`https://${site.domain}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {site.domain}
                      </a>
                    </td>
                    <td>{site.siteType}</td>
                    <td>
                      <span
                        className={`evidence ${evidenceClass(site.inventoryEvidence)}`}
                      >
                        {site.inventoryEvidence}
                      </span>
                      <small>Domain and type entered manually</small>
                    </td>
                    <td>
                      <span className="status preserved">
                        {live ? "Live HTTP checks active" : "Stored crawl fallback"}
                      </span>
                      <small>
                        {live
                          ? `Production ${live.production.homepage.status ?? "error"}; preview ${live.preview.homepage.status ?? "error"}`
                          : `${audit.live200}/${audit.registryPages} returned 200`}
                      </small>
                    </td>
                    <td>
                      <span className="evidence manual">Manual</span>
                      <small>
                        {site.metric} {site.score}; not independently verified
                      </small>
                    </td>
                    <td>
                      <span className="status unknown">
                        {site.searchConsole}
                      </span>
                    </td>
                    <td>
                      <span className="status missing">{site.readiness}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="seo-note">
            Portfolio completeness is unknown. Add domains only from an approved
            inventory, then classify each site type and attach crawl, authority,
            Search Console, and launch evidence separately.
          </p>
        </section>

        <section id="authority" className="seo-section seo-order-protected">
          <div className="section-heading">
            <div>
              <span className="seo-eyebrow">
                PROTECTED URL / AUTHORITY REGISTER
              </span>
              <h2>Top 25 exact URLs and restoration status</h2>
            </div>
            <span className="data-chip">AHREFS METRICS: IMPORTED</span>
          </div>
          <p className="seo-section-intro">
            The production URL and exact path are the protected targets. A broad
            preview replacement is shown separately and does not count as
            restoration.
          </p>
          <div className="seo-table-wrap authority-register">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Protected production URL / exact path</th>
                  <th>Imported authority</th>
                  <th>Section</th>
                  <th>New title</th>
                  <th>HTTP</th>
                  <th>Exact URL / slug</th>
                  <th>Preview replacement</th>
                  <th>Canonical</th>
                  <th>Sitemap</th>
                  <th>Content restoration</th>
                  <th>Testing / internal links</th>
                </tr>
              </thead>
              <tbody>
                {authorityTop25.map((row) => {
                  const observed = liveByRank.get(row.rank);
                  const exactPreserved = observed
                    ? observed.preview.status === 200 && !observed.preview.redirectLocation
                    : row.exactSlugStatus === "Preserved";
                  return <tr key={row.rank}>
                    <td>{row.rank}</td>
                    <td>
                      <a href={row.exactUrl} target="_blank" rel="noreferrer">
                        {row.topicIntent}
                      </a>
                      <code>{row.exactPath}</code>
                    </td>
                    <td>
                      <strong>
                        RD {row.referringDomains} · BL{" "}
                        {row.totalBacklinks.toLocaleString()} · UR{" "}
                        {row.urlRating ?? "Unknown"}
                      </strong>
                      <small>
                        <span className="evidence imported">
                          {row.metricsEvidence}
                        </span>{" "}
                        {row.metricsSource}
                      </small>
                    </td>
                    <td>{row.section}</td>
                    <td>
                      <span className={observed?.preview.title ? "status preserved" : "status unknown"}>
                        {observed?.preview.title || "Unknown"}
                      </span>
                      <small>{observed ? "Live HTML title" : row.newTitle}</small>
                    </td>
                    <td>
                      <strong>Production {observed?.production.status ?? row.productionHttp}</strong>
                      <small>
                        Preview: {observed?.preview.status ?? row.previewBehavior}
                        {observed?.preview.redirectLocation ? " (redirect)" : ""}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`status ${exactPreserved ? "preserved" : "missing"}`}
                      >
                        {exactPreserved ? "Preserved" : "Missing"}
                      </span>
                      <small>{observed ? "Live exact-path result" : row.restorationStatus}</small>
                    </td>
                    <td>
                      <a
                        href={row.replacementUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open preview ↗
                      </a>
                      <small>{new URL(row.replacementUrl).pathname}</small>
                    </td>
                    <td>{observed?.preview.canonical || row.canonicalStatus}</td>
                    <td>{row.sitemapStatus}</td>
                    <td>{row.contentRestorationStatus}</td>
                    <td>
                      {row.testingStatus}
                      <small>{row.internalLinkStatus}</small>
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section id="indexing" className="seo-section seo-order-indexing">
          <div className="section-heading">
            <div>
              <span className="seo-eyebrow">GOOGLE VERIFICATION REGISTER</span>
              <h2>Priority URL indexing status</h2>
            </div>
            <span className="data-chip">0 VERIFIED · 25 UNKNOWN</span>
          </div>
          <article className="seo-panel seo-index-boundary">
            <div>
              <strong>Google-verified indexed: 0</strong>
              <p>
                No Search Console property, URL Inspection export, or API result
                is connected. Zero verified is not the same as zero indexed.
              </p>
            </div>
            <div>
              <strong>
                Preview homepage indexable: {live
                  ? live.preview.homepage.noindex === false ? "Yes" : "No"
                  : audit.registryIndexable}
              </strong>
              <p>
                This is read from the current HTTP/HTML response when live data
                is available. Indexability does not establish Google indexation.
              </p>
            </div>
            <div>
              <strong>Public search checks: insufficient</strong>
              <p>
                A <code>site:</code> result may support investigation but is not
                accepted here as verified indexation evidence.
              </p>
            </div>
          </article>
          <div className="seo-table-wrap compact-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exact production URL</th>
                  <th>Google status</th>
                  <th>Verification source</th>
                  <th>Search Console request</th>
                  <th>Evidence needed</th>
                </tr>
              </thead>
              <tbody>
                {authorityTop25.map((row) => (
                  <tr key={`index-${row.rank}`}>
                    <td>{row.rank}</td>
                    <td>
                      <a href={row.exactUrl} target="_blank" rel="noreferrer">
                        {row.exactUrl}
                      </a>
                    </td>
                    <td>
                      <span className="status unknown">
                        {row.googleIndexStatus}
                      </span>
                    </td>
                    <td>
                      <span className="evidence unknown">
                        {row.googleVerificationStatus}
                      </span>
                    </td>
                    <td>{row.searchConsoleSubmission}</td>
                    <td>
                      URL Inspection result, Google-selected canonical, last
                      crawl, and evidence date
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="domain-authority" className="seo-section seo-order-domain-authority">
          <div className="section-heading">
            <div>
              <span className="seo-eyebrow">DOMAIN AUTHORITY WORKFLOW</span>
              <h2>Authority metrics by website</h2>
            </div>
            <span className="data-chip">DO NOT MIX DA AND DR</span>
          </div>
          <article className="seo-panel seo-authority-boundary">
            <div>
              <strong>Current baseline</strong>
              <p>
                <span className="evidence manual">Manual</span> DA 32 for
                temporary123.com. The owner supplied this value; there is no
                dated Moz report, Ahrefs report, or API response attached.
              </p>
            </div>
            <div>
              <strong>Required record fields</strong>
              <p>
                Domain, site type, metric name, score, provider, source type,
                checked date, checked by, report URL/file, scope, and notes.
              </p>
            </div>
          </article>
          <div className="seo-table-wrap compact-table">
            <table>
              <thead>
                <tr>
                  <th>Website</th>
                  <th>Site type</th>
                  <th>Metric</th>
                  <th>Score</th>
                  <th>Evidence</th>
                  <th>Source</th>
                  <th>Checked</th>
                  <th>Independent checks</th>
                </tr>
              </thead>
              <tbody>
                {domainAuthoritySites.map((site) => (
                  <tr key={`authority-${site.domain}`}>
                    <td>{site.domain}</td>
                    <td>{site.siteType}</td>
                    <td>{site.metric}</td>
                    <td>
                      <span className="authority-score">{site.score}</span>
                    </td>
                    <td>
                      <span
                        className={`evidence ${evidenceClass(site.scoreEvidence)}`}
                      >
                        {site.scoreEvidence}
                      </span>
                    </td>
                    <td>{site.source}</td>
                    <td>{site.checkedAt}</td>
                    <td>
                      <div className="checker-actions">
                        <a
                          href={checkerUrl("Ahrefs", site.domain)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Check Ahrefs DR ↗
                        </a>
                        <a
                          href={checkerUrl("Moz", site.domain)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Check Moz DA ↗
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="seo-note">
            Ahrefs Domain Rating and Moz Domain Authority are different provider
            metrics. Save each as its own dated observation; never overwrite one
            with the other.
          </p>
        </section>

        <section id="workflow" className="seo-section seo-release seo-order-workflow">
          <span className="seo-eyebrow">NEXT EVIDENCE CHECKS</span>
          <h2>Owner workflow</h2>
          <div className="release-steps">
            <article>
              <span>1</span>
              <h3>Restore exact target</h3>
              <p>
                Choose exact-page restoration or approve a tightly equivalent
                one-hop redirect. Record the owner decision.
              </p>
            </article>
            <article>
              <span>2</span>
              <h3>Verify technical fields</h3>
              <p>
                Fetch production and preview; record final HTTP, self-canonical,
                robots state, sitemap membership, internal link, and content
                review.
              </p>
            </article>
            <article>
              <span>3</span>
              <h3>Verify Google separately</h3>
              <p>
                Import authorized URL Inspection evidence. Keep property
                verification, submission, and indexed status as separate fields.
              </p>
            </article>
            <article>
              <span>4</span>
              <h3>Check authority</h3>
              <p>
                Record provider, metric, score, evidence source, date, and
                reviewer. Preserve DA, DR, UR, referring domains, and backlinks
                as distinct metrics.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
