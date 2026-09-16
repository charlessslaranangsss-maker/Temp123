import { authorityTop25 } from "../src/authorityTop25.js";

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
  const [production, preview, priorityUrls] = await Promise.all([
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
  ]);

  return {
    generatedAt: new Date().toISOString(),
    evidence: "Live server-side HTTP checks",
    refreshSeconds: 0,
    production,
    preview,
    priorityUrls,
    providerBoundaries: {
      googleIndexing: "Unavailable until Google Search Console is connected",
      domainAuthority: "Unavailable until a dated Moz or Ahrefs provider result is connected",
    },
  };
}
