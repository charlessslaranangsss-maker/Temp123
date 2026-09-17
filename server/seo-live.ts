import { authorityTop25 } from "../src/authorityTop25.js";
import { createSign } from "node:crypto";

export const SEO_ORIGINS = {
  production: "https://temporary123.com",
  preview: "https://temp123-nine.vercel.app",
} as const;

export type LivePageCheck = {
  url: string;
  status: number | null;
  finalUrl: string | null;
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
  source: string;
  domainRating?: number;
  domainAuthority?: number;
  pageAuthority?: number;
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

type ProviderSnapshot = {
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

const PROVIDER_CACHE_MS = 6 * 60 * 60 * 1_000;
let providerCache: { expiresAt: number; value: ProviderSnapshot } | null = null;
const googleTokenCache = new Map<string, { token: string; expiresAt: number }>();

export function safeError(error: unknown) {
  if (!(error instanceof Error)) return "Provider request failed";
  return error.message
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/Basic\s+\S+/gi, "Basic [redacted]")
    .slice(0, 240);
}

export async function providerJson(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(20_000),
  });
  const text = (await response.text()).slice(0, 2_000_000);
  if (!response.ok) throw new Error(`Provider returned ${response.status}`);
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error("Provider returned invalid JSON");
  }
}

async function fetchAhrefsAuthority(): Promise<AuthorityProviderResult> {
  const token = process.env.AHREFS_API_TOKEN?.trim();
  if (!token) {
    return {
      state: "not_configured",
      checkedAt: null,
      source: "Ahrefs Domain Rating API is not configured",
    };
  }
  try {
    const json = await providerJson(
      "https://api.ahrefs.com/v3/public/domain-rating-free",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targets: ["temporary123.com"] }),
      },
    );
    const targets = (json.domain_rating as { targets?: Array<{ domain_rating?: number }> } | undefined)?.targets;
    const domainRating = targets?.[0]?.domain_rating;
    if (!Number.isFinite(domainRating)) throw new Error("Ahrefs response did not include Domain Rating");
    return {
      state: "connected",
      checkedAt: new Date().toISOString(),
      source: "Ahrefs Domain Rating API",
      domainRating,
    };
  } catch (error) {
    return {
      state: "error",
      checkedAt: new Date().toISOString(),
      source: "Ahrefs Domain Rating API",
      error: safeError(error),
    };
  }
}

async function fetchMozAuthority(): Promise<AuthorityProviderResult> {
  const accessId = process.env.MOZ_ACCESS_ID?.trim();
  const secretKey = process.env.MOZ_SECRET_KEY?.trim();
  if (!accessId || !secretKey) {
    return {
      state: "not_configured",
      checkedAt: null,
      source: "Moz URL Metrics API is not configured",
    };
  }
  try {
    const credentials = Buffer.from(`${accessId}:${secretKey}`).toString("base64");
    const json = await providerJson("https://lsapi.seomoz.com/v2/url_metrics", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targets: ["temporary123.com"] }),
    });
    const record = ((json.results as Array<Record<string, unknown>> | undefined)?.[0] || json) as Record<string, unknown>;
    const domainAuthority = Number(record.domain_authority);
    const pageAuthority = Number(record.page_authority);
    if (!Number.isFinite(domainAuthority)) throw new Error("Moz response did not include Domain Authority");
    return {
      state: "connected",
      checkedAt: new Date().toISOString(),
      source: "Moz URL Metrics API",
      domainAuthority,
      ...(Number.isFinite(pageAuthority) ? { pageAuthority } : {}),
    };
  } catch (error) {
    return {
      state: "error",
      checkedAt: new Date().toISOString(),
      source: "Moz URL Metrics API",
      error: safeError(error),
    };
  }
}

function base64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

export async function getGoogleServiceAccountToken(email: string, privateKey: string, scope: string) {
  const cacheKey = `${email}|${scope}`;
  const cached = googleTokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
  if (!email || !privateKey) return null;
  const now = Math.floor(Date.now() / 1_000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3_600,
  }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  signer.end();
  const assertion = `${header}.${payload}.${signer.sign(privateKey, "base64url")}`;
  const json = await providerJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const token = typeof json.access_token === "string" ? json.access_token : null;
  if (!token) throw new Error("Google token response did not include an access token");
  const expiresIn = Number(json.expires_in) || 3_600;
  googleTokenCache.set(cacheKey, { token, expiresAt: Date.now() + expiresIn * 1_000 });
  return token;
}

export async function getGoogleAccessToken() {
  const directToken = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN?.trim();
  if (directToken) return directToken;
  const email = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!email || !privateKey) return null;
  return getGoogleServiceAccountToken(email, privateKey, "https://www.googleapis.com/auth/webmasters.readonly");
}

async function inspectGoogleUrl(token: string, siteUrl: string, url: string): Promise<GoogleInspectionResult> {
  try {
    const json = await providerJson(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inspectionUrl: url, siteUrl, languageCode: "en-US" }),
      },
    );
    const inspection = (json.inspectionResult || {}) as Record<string, unknown>;
    const index = (inspection.indexStatusResult || {}) as Record<string, unknown>;
    const verdict = typeof index.verdict === "string" ? index.verdict : "UNKNOWN";
    return {
      url,
      indexed: verdict === "PASS" ? true : verdict === "FAIL" ? false : null,
      verdict,
      coverageState: typeof index.coverageState === "string" ? index.coverageState : "Unknown",
      indexingState: typeof index.indexingState === "string" ? index.indexingState : "Unknown",
      lastCrawlTime: typeof index.lastCrawlTime === "string" ? index.lastCrawlTime : null,
      pageFetchState: typeof index.pageFetchState === "string" ? index.pageFetchState : "Unknown",
      googleCanonical: typeof index.googleCanonical === "string" ? index.googleCanonical : null,
      userCanonical: typeof index.userCanonical === "string" ? index.userCanonical : null,
      inspectionResultLink: typeof inspection.inspectionResultLink === "string" ? inspection.inspectionResultLink : null,
      error: null,
    };
  } catch (error) {
    return {
      url,
      indexed: null,
      verdict: "ERROR",
      coverageState: "Unknown",
      indexingState: "Unknown",
      lastCrawlTime: null,
      pageFetchState: "Unknown",
      googleCanonical: null,
      userCanonical: null,
      inspectionResultLink: null,
      error: safeError(error),
    };
  }
}

async function fetchSearchConsole(): Promise<ProviderSnapshot["searchConsole"]> {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() || null;
  const hasCredential = Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN?.trim() ||
    (process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL?.trim() && process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY?.trim()),
  );
  if (!siteUrl || !hasCredential) {
    return { state: "not_configured", checkedAt: null, siteUrl, urls: [] };
  }
  try {
    const token = await getGoogleAccessToken();
    if (!token) throw new Error("Google Search Console credentials are incomplete");
    const urls = await Promise.all(
      authorityTop25.map((row) => inspectGoogleUrl(token, siteUrl, row.exactUrl)),
    );
    const allFailed = urls.length > 0 && urls.every((row) => row.error);
    return {
      state: allFailed ? "error" : "connected",
      checkedAt: new Date().toISOString(),
      siteUrl,
      urls,
      ...(allFailed ? { error: "All URL Inspection requests failed" } : {}),
    };
  } catch (error) {
    return {
      state: "error",
      checkedAt: new Date().toISOString(),
      siteUrl,
      urls: [],
      error: safeError(error),
    };
  }
}

async function getProviderSnapshot() {
  if (providerCache && providerCache.expiresAt > Date.now()) return providerCache.value;
  const [ahrefs, moz, searchConsole] = await Promise.all([
    fetchAhrefsAuthority(),
    fetchMozAuthority(),
    fetchSearchConsole(),
  ]);
  const value = { ahrefs, moz, searchConsole };
  providerCache = { expiresAt: Date.now() + PROVIDER_CACHE_MS, value };
  return value;
}

function firstMatch(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1]?.trim() || null;
}

export function parseSeoHtml(html: string, xRobotsTag = "") {
  const robots = [
    xRobotsTag,
    ...Array.from(
      html.matchAll(
        /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/gi,
      ),
      (match) => match[1],
    ),
  ]
    .join(",")
    .toLowerCase();

  return {
    title: firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    canonical:
      firstMatch(
        html,
        /<link[^>]+rel=["'][^"']*canonical[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i,
      ) ||
      firstMatch(
        html,
        /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*canonical[^"']*["'][^>]*>/i,
      ),
    noindex: /(?:^|[,\s])noindex(?:[,\s]|$)/i.test(robots),
  };
}

export async function inspectPage(url: string): Promise<LivePageCheck> {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "Temporary123-SEO-Dashboard/1.0" },
      signal: AbortSignal.timeout(8_000),
    });
    const location = response.headers.get("location");
    const contentType = response.headers.get("content-type") || "";
    const html =
      response.status === 200 && contentType.includes("text/html")
        ? (await response.text()).slice(0, 1_000_000)
        : "";
    const parsed = html
      ? parseSeoHtml(html, response.headers.get("x-robots-tag") || "")
      : { title: null, canonical: null, noindex: null };
    return {
      url,
      status: response.status,
      finalUrl: response.url || url,
      redirectLocation: location,
      responseMs: Date.now() - started,
      ...parsed,
      error: null,
    };
  } catch (error) {
    return {
      url,
      status: null,
      finalUrl: null,
      redirectLocation: null,
      responseMs: Date.now() - started,
      canonical: null,
      title: null,
      noindex: null,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

async function inspectText(url: string) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "Temporary123-SEO-Dashboard/1.0" },
      signal: AbortSignal.timeout(8_000),
    });
    const text = response.status === 200 ? (await response.text()).slice(0, 2_000_000) : "";
    return {
      url,
      status: response.status,
      responseMs: Date.now() - started,
      entries: Array.from(text.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)).length,
      error: null,
    };
  } catch (error) {
    return {
      url,
      status: null,
      responseMs: Date.now() - started,
      entries: 0,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

async function inspectHost(origin: string) {
  const [homepage, robots, ...sitemaps] = await Promise.all([
    inspectPage(`${origin}/`),
    inspectText(`${origin}/robots.txt`),
    inspectText(`${origin}/sitemap.xml`),
    inspectText(`${origin}/sitemap_index.xml`),
    inspectText(`${origin}/wp-sitemap.xml`),
  ]);
  return {
    origin,
    homepage,
    robots,
    sitemap: sitemaps.find((item) => item.status === 200) || sitemaps[0],
  };
}

export async function createLiveSeoSnapshot() {
  const [production, preview, priorityUrls, providers] = await Promise.all([
    inspectHost(SEO_ORIGINS.production),
    inspectHost(SEO_ORIGINS.preview),
    Promise.all(
      authorityTop25.map(async (row) => {
        const [productionCheck, previewCheck] = await Promise.all([
          inspectPage(row.exactUrl),
          inspectPage(`${SEO_ORIGINS.preview}${row.exactPath}`),
        ]);
        return { rank: row.rank, production: productionCheck, preview: previewCheck };
      }),
    ),
    getProviderSnapshot(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    evidence: "Live server-side HTTP checks with cached provider evidence",
    refreshSeconds: 300,
    production,
    preview,
    priorityUrls,
    providers,
    providerBoundaries: {
      googleIndexing: providers.searchConsole.state,
      domainAuthority: providers.moz.state,
      domainRating: providers.ahrefs.state,
    },
  };
}
