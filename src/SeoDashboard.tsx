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

type ProviderState = "connected" | "not_configured" | "error";

type AuthorityProviderResult = {
  state: ProviderState;
  checkedAt: string | null;
  domain: string;
  metric: "Ahrefs DR" | "Moz DA";
  score: number | null;
  pageAuthority?: number | null;
  source: string;
  error?: string;
};

type GoogleInspectionResult = {
  url: string;
  indexed: boolean | null;
  verdict: string;
  coverageState: string;
  indexingState: string;
  lastCrawlTime: string | null;
  pageFetchState: string;
  googleCanonical: string | null;
  userCanonical: string | null;
  inspectionResultLink: string | null;
  error: string | null;
};

type LiveSnapshot = {
  generatedAt: string;
  refreshSeconds: number;
  production: { homepage: LivePageCheck; robots: { status: number | null }; sitemap: { status: number | null; entries: number; url: string } };
  preview: { homepage: LivePageCheck; robots: { status: number | null }; sitemap: { status: number | null; entries: number; url: string } };
  priorityUrls: Array<{ rank: number; production: LivePageCheck; preview: LivePageCheck }>;
  providers: {
    ahrefs: AuthorityProviderResult;
    moz: AuthorityProviderResult;
    searchConsole: {
      state: ProviderState;
      checkedAt: string | null;
      siteUrl: string | null;
      urls: GoogleInspectionResult[];
      error?: string;
    };
  };
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

type DiagnosticState = "healthy" | "warning" | "error" | "not_configured";
type DiagnosticPoint = { at: string; value: number };
type DiagnosticSnapshot = {
  generatedAt: string;
  frequencyHours: 12;
  origin: string;
  locationHealth: {
    state: DiagnosticState;
    truncated?: boolean;
    checked: number;
    errors: number;
    notFound: number;
    serverErrors: number;
    samples: string[];
    history: DiagnosticPoint[];
  };
  contentCompleteness: {
    state: DiagnosticState;
    checked: number;
    incomplete: number;
    requiredFields: string[];
    source: string;
    error?: string;
    history: DiagnosticPoint[];
  };
  firestoreHealth?: {
    state: DiagnosticState; connected: boolean; latencyMs: number | null; checked: number; broken: number;
    missingStateId: number; emptyContent: number; collection: string; error?: string; history: DiagnosticPoint[];
  };
  hosting404s?: {
    state: DiagnosticState; total: number | null; source: string;
    urls: Array<{ url: string; count: number; lastSeen: string | null }>;
    error?: string; history: DiagnosticPoint[];
  };
  googleIndexing: {
    state: DiagnosticState;
    submitted: number | null;
    indexed: number | null;
    nonIndexed: number | null;
    source: string;
    error?: string;
    history: DiagnosticPoint[];
  };
};

type DiagnosticsEnvelope = {
  latest: DiagnosticSnapshot | null;
  schedule: string;
  configured: boolean;
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

function providerLabel(state: ProviderState | undefined) {
  if (state === "connected") return "Live provider data";
  if (state === "error") return "Provider check failed";
  return "Not connected";
}

function providerEvidenceClass(state: ProviderState | undefined) {
  if (state === "connected") return "live";
  if (state === "error") return "unknown";
  return "manual";
}

function formatProviderDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString("en-US") : "Not checked";
}

function checkerUrl(provider: "Ahrefs" | "Moz", domain: string) {
  return provider === "Ahrefs"
    ? `https://ahrefs.com/website-authority-checker?target=${encodeURIComponent(domain)}`
    : "https://moz.com/domain-analysis";
}

function TrendChart({ points, label }: { points: DiagnosticPoint[]; label: string }) {
  const recent = points.slice(-12);
  if (recent.length < 2) {
    return <div className="diagnostic-empty-chart">Trend begins after two scheduled runs</div>;
  }
  const values = recent.map((point) => point.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const polyline = recent.map((point, index) => {
    const x = 8 + (index / (recent.length - 1)) * 304;
    const y = 84 - ((point.value - min) / range) * 72;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg className="diagnostic-chart" viewBox="0 0 320 92" role="img" aria-label={label}>
      <line x1="8" y1="84" x2="312" y2="84" />
      <line x1="8" y1="12" x2="312" y2="12" />
      <polyline points={polyline} />
    </svg>
  );
}

export function SeoDashboard() {
  const tabs = ["diagnostics", "indexing", "domain-authority", "overview", "portfolio", "authority", "workflow"] as const;
  type DashboardTab = typeof tabs[number];
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    const hash = typeof window === "undefined" ? "" : window.location.hash.slice(1);
    return tabs.find((tab) => tab === hash) ?? "diagnostics";
  });
  const selectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
  };
  const [live, setLive] = useState<LiveSnapshot | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsEnvelope | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  // This route is prerendered. Keep the server HTML recoverable until the
  // dashboard-only hydration in main.tsx attaches the live controls.
  const [refreshing, setRefreshing] = useState(false);
  const refreshLiveData = useCallback(async () => {
    setRefreshing(true);
    try {
      const results = await Promise.allSettled([
        fetch("/api/seo-live", { cache: "no-store", signal: AbortSignal.timeout(25_000) }).then(async (response) => { if (!response.ok) throw new Error(`Live endpoint returned ${response.status}`); return response.json() as Promise<LiveSnapshot>; }),
        fetch("/api/seo-diagnostics", { cache: "no-store", signal: AbortSignal.timeout(25_000) }).then(async (response) => { if (!response.ok) throw new Error(`Diagnostics endpoint returned ${response.status}`); return response.json() as Promise<DiagnosticsEnvelope>; }),
      ]);
      if (results[0].status === "fulfilled") setLive(results[0].value);
      if (results[1].status === "fulfilled") setDiagnostics(results[1].value);
      const errors = results.filter((result): result is PromiseRejectedResult => result.status === "rejected").map((result) => result.reason instanceof Error ? result.reason.message : "A live check failed");
      setLiveError(errors.length ? errors.join("; ") : null);
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
  const googleByUrl = useMemo(
    () => new Map(live?.providers?.searchConsole.urls.map((row) => [row.url, row]) || []),
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
  const googleVerified = live?.providers?.searchConsole.urls.filter(
    (row) => row.indexed === true,
  ).length ?? 0;
  const googleNotIndexed = live?.providers?.searchConsole.urls.filter(
    (row) => row.indexed === false,
  ).length ?? 0;
  const googleUnknown = authorityTop25.length - googleVerified - googleNotIndexed;
  const authorityRows = [
    {
      key: "ahrefs",
      domain: "temporary123.com",
      siteType: "Multi-service temporary facilities",
      metric: "Ahrefs DR",
      score: live?.providers?.ahrefs.score ?? null,
      evidence: providerLabel(live?.providers?.ahrefs.state),
      evidenceClass: providerEvidenceClass(live?.providers?.ahrefs.state),
      source: live?.providers?.ahrefs.error || live?.providers?.ahrefs.source || "Server-side Ahrefs API adapter",
      checkedAt: formatProviderDate(live?.providers?.ahrefs.checkedAt),
    },
    {
      key: "moz",
      domain: "temporary123.com",
      siteType: "Multi-service temporary facilities",
      metric: "Moz DA",
      score: live?.providers?.moz.score ?? null,
      evidence: providerLabel(live?.providers?.moz.state),
      evidenceClass: providerEvidenceClass(live?.providers?.moz.state),
      source: live?.providers?.moz.error || live?.providers?.moz.source || "Server-side Moz API adapter",
      checkedAt: formatProviderDate(live?.providers?.moz.checkedAt),
    },
    {
      key: "manual",
      domain: "temporary123.com",
      siteType: "Multi-service temporary facilities",
      metric: "Owner-provided DA baseline",
      score: 32,
      evidence: "Manual, unverified",
      evidenceClass: "manual",
      source: "Owner-provided baseline; retained separately from live provider metrics",
      checkedAt: "Unknown",
    },
  ];
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
        <nav role="tablist" aria-label="Dashboard sections">
          {([[
            "diagnostics", "12-hour diagnostics"],
            ["indexing", "Google status"],
            ["domain-authority", "Authority metrics"],
            ["overview", "Overview"],
            ["portfolio", "Portfolio readiness"],
            ["authority", "Protected URLs"],
            ["workflow", "Next checks"],
          ] as const).map(([id, label]) => (
            <button key={id} id={`seo-tab-${id}`} type="button" role="tab" aria-selected={activeTab === id} aria-controls={id} tabIndex={0} onClick={() => selectTab(id)}>{label}</button>
          ))}
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
            <p data-h1-intro>
              Review Temporary123 migration evidence, protected URLs and preview
              crawl checks. Indexing and authority values remain unknown until
              supported by their connected providers; a successful HTTP check is
              not proof of Google indexing.
            </p>
          </div>
          <span className="seo-mode">LIVE HTTP · PROVIDERS CACHED 6 HOURS</span>
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

        <section id="diagnostics" role="tabpanel" aria-labelledby="seo-tab-diagnostics" hidden={activeTab !== "diagnostics"} className="seo-section seo-order-diagnostics">
          <div className="diagnostic-heading">
            <div>
              <span className="seo-eyebrow">BOSS PRIORITY · AUTOMATED EVERY 12 HOURS</span>
              <h2>Programmatic SEO diagnostics</h2>
              <p>Three decision-ready signals first. Detailed URL evidence remains below.</p>
            </div>
            <span className="diagnostic-run-time">
              {diagnostics?.latest
                ? `Last run ${new Date(diagnostics.latest.generatedAt).toLocaleString("en-US")}`
                : "Awaiting first scheduled run"}
            </span>
          </div>
          <div className="diagnostic-grid">
            <article className={`diagnostic-card ${diagnostics?.latest?.firestoreHealth?.state ?? "not_configured"}`}>
              <div className="diagnostic-card-top"><span>Firestore city data health</span><b>{diagnostics?.latest?.firestoreHealth?.connected ? diagnostics.latest.firestoreHealth.broken : "—"}</b></div>
              <p>Unique cities missing stateId or content</p>
              <TrendChart points={diagnostics?.latest?.firestoreHealth?.history ?? []} label="Broken Firestore city trend" />
              <div className="diagnostic-details">
                <span>Checked <strong>{diagnostics?.latest?.firestoreHealth?.connected ? diagnostics.latest.firestoreHealth.checked : "—"}</strong></span>
                <span>Missing state <strong>{diagnostics?.latest?.firestoreHealth?.connected ? diagnostics.latest.firestoreHealth.missingStateId : "—"}</strong></span>
                <span>Empty content <strong>{diagnostics?.latest?.firestoreHealth?.connected ? diagnostics.latest.firestoreHealth.emptyContent : "—"}</strong></span>
                <span className="diagnostic-wide">{diagnostics?.latest?.firestoreHealth?.connected ? `Connected · Firestore fetch ${diagnostics.latest.firestoreHealth.latencyMs} ms` : diagnostics?.latest?.firestoreHealth?.error || "Awaiting first run"}</span>
              </div>
            </article>
            <article className={`diagnostic-card ${diagnostics?.latest?.hosting404s?.state ?? "not_configured"}`}>
              <div className="diagnostic-card-top"><span>Firebase Hosting 404 requests</span><b>{diagnostics?.latest?.hosting404s?.total ?? "—"}</b></div>
              <p>Top paths in recent Cloud Logging entries; Vercel traffic is not included</p>
              <TrendChart points={diagnostics?.latest?.hosting404s?.history ?? []} label="Firebase Hosting 404 trend" />
              <div className="diagnostic-details">
                {diagnostics?.latest?.hosting404s?.urls.map((row) => <span className="diagnostic-wide" key={row.url}>{row.url} <strong>×{row.count}</strong></span>)}
                <span className="diagnostic-wide">{diagnostics?.latest?.hosting404s?.error || diagnostics?.latest?.hosting404s?.source || "Awaiting first run"}</span>
              </div>
            </article>
            <article className={`diagnostic-card ${diagnostics?.latest?.locationHealth.state ?? "not_configured"}`}>
              <div className="diagnostic-card-top">
                <span>Location URL failures</span>
                <b>{diagnostics?.latest?.locationHealth.errors ?? "—"}</b>
              </div>
              <p>Non-2xx responses across sampled sitemap location URLs</p>
              <TrendChart points={diagnostics?.latest?.locationHealth.history ?? []} label="Location URL error trend" />
              <div className="diagnostic-details">
                <span>Checked <strong>{diagnostics?.latest?.locationHealth.checked ?? "—"}</strong></span>
                <span>404 <strong>{diagnostics?.latest?.locationHealth.notFound ?? "—"}</strong></span>
                <span>5xx <strong>{diagnostics?.latest?.locationHealth.serverErrors ?? "—"}</strong></span>
                {diagnostics?.latest?.locationHealth.truncated && <span className="diagnostic-wide">First 500 URLs only; this is not a full-site audit</span>}
              </div>
            </article>

            <article className={`diagnostic-card ${diagnostics?.latest?.contentCompleteness.state ?? "not_configured"}`}>
              <div className="diagnostic-card-top">
                <span>Incomplete content rows</span>
                <b>{diagnostics?.latest?.contentCompleteness.incomplete ?? "—"}</b>
              </div>
              <p>Null or empty required fields in the configured content database</p>
              <TrendChart points={diagnostics?.latest?.contentCompleteness.history ?? []} label="Incomplete content row trend" />
              <div className="diagnostic-details">
                <span>Rows checked <strong>{diagnostics?.latest?.contentCompleteness.checked ?? "—"}</strong></span>
                <span className="diagnostic-wide">
                  {diagnostics?.latest?.contentCompleteness.state === "not_configured"
                    ? "Connect SEO_CONTENT_DATABASE_PATH"
                    : diagnostics?.latest?.contentCompleteness.requiredFields.join(", ") || "Awaiting run"}
                </span>
              </div>
            </article>

            <article className={`diagnostic-card ${diagnostics?.latest?.googleIndexing.state ?? "not_configured"}`}>
              <div className="diagnostic-card-top">
                <span>GSC sitemap submissions</span>
                <b>{diagnostics?.latest?.googleIndexing.submitted ?? "—"}</b>
              </div>
              <p>Submission is not proof of indexing; site-wide indexed count is unavailable here</p>
              <div className="diagnostic-details">
                <span className="diagnostic-wide">
                  {diagnostics?.latest?.googleIndexing.state === "not_configured"
                    ? "Connect Google Search Console"
                    : diagnostics?.latest?.googleIndexing.source || "Awaiting run"}
                </span>
              </div>
            </article>
          </div>
          <p className="diagnostic-footnote">
            Schedule: {diagnostics?.schedule ?? "every 12 hours"}. Missing credentials or data sources are shown as not connected—not replaced with sample values.
          </p>
        </section>

        <section id="overview" role="tabpanel" aria-labelledby="seo-tab-overview" hidden={activeTab !== "overview"} className="seo-section seo-order-overview">
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
              <small>{providerLabel(live?.providers?.searchConsole.state)}</small>
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

        <section id="portfolio" role="tabpanel" aria-labelledby="seo-tab-portfolio" hidden={activeTab !== "portfolio"} className="seo-section seo-order-portfolio">
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

        <section id="authority" role="tabpanel" aria-labelledby="seo-tab-authority" hidden={activeTab !== "authority"} className="seo-section seo-order-protected">
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

        <section id="indexing" role="tabpanel" aria-labelledby="seo-tab-indexing" hidden={activeTab !== "indexing"} className="seo-section seo-order-indexing">
          <div className="section-heading">
            <div>
              <span className="seo-eyebrow">GOOGLE VERIFICATION REGISTER</span>
              <h2>Priority URL indexing status</h2>
            </div>
            <span className="data-chip">
              {googleVerified} INDEXED · {googleNotIndexed} NOT INDEXED · {googleUnknown} UNKNOWN
            </span>
          </div>
          <article className="seo-panel seo-index-boundary">
            <div>
              <strong>Google-verified indexed: {googleVerified}</strong>
              <p>
                {live?.providers?.searchConsole.state === "connected"
                  ? `${googleNotIndexed} verified not indexed and ${googleUnknown} unknown. Results are from the authorized URL Inspection API.`
                  : "No successful Search Console URL Inspection result is connected. Zero verified is not the same as zero indexed."}
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
                {authorityTop25.map((row) => {
                  const inspection = googleByUrl.get(row.exactUrl);
                  const status = inspection?.indexed === true
                    ? "Indexed"
                    : inspection?.indexed === false
                      ? "Not indexed"
                      : "Unknown";
                  return <tr key={`index-${row.rank}`}>
                    <td>{row.rank}</td>
                    <td>
                      <a href={row.exactUrl} target="_blank" rel="noreferrer">
                        {row.exactUrl}
                      </a>
                    </td>
                    <td>
                      <span className={`status ${inspection?.indexed === true ? "preserved" : inspection?.indexed === false ? "missing" : "unknown"}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <span className={`evidence ${inspection && !inspection.error ? "live" : "unknown"}`}>
                        {inspection && !inspection.error ? "Google URL Inspection API" : providerLabel(live?.providers?.searchConsole.state)}
                      </span>
                    </td>
                    <td>Not submitted by this dashboard</td>
                    <td>
                      {inspection?.error
                        || (inspection
                          ? `${inspection.coverageState}; crawl ${formatProviderDate(inspection.lastCrawlTime)}; Google canonical ${inspection.googleCanonical || "Unknown"}`
                          : "URL Inspection result, Google-selected canonical, last crawl, and evidence date")}
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section id="domain-authority" role="tabpanel" aria-labelledby="seo-tab-domain-authority" hidden={activeTab !== "domain-authority"} className="seo-section seo-order-domain-authority">
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
                {authorityRows.map((site) => (
                  <tr key={`authority-${site.key}`}>
                    <td>{site.domain}</td>
                    <td>{site.siteType}</td>
                    <td>{site.metric}</td>
                    <td>
                      <span className="authority-score">{site.score ?? "—"}</span>
                    </td>
                    <td>
                      <span
                        className={`evidence ${site.evidenceClass}`}
                      >
                        {site.evidence}
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

        <section id="workflow" role="tabpanel" aria-labelledby="seo-tab-workflow" hidden={activeTab !== "workflow"} className="seo-section seo-release seo-order-workflow">
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
