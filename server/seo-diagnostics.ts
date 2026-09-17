import { firebase } from "./firebase.js";
import { FieldPath, type Query } from "firebase-admin/firestore";
import { getGoogleAccessToken, getGoogleServiceAccountToken, providerJson, safeError, SEO_ORIGINS } from "./seo-live.js";

type State = "healthy" | "warning" | "error" | "not_configured";
type Point = { at: string; value: number };
export type DiagnosticSnapshot = {
  generatedAt: string;
  frequencyHours: 12;
  origin: string;
  locationHealth: { state: State; checked: number; errors: number; notFound: number; serverErrors: number; truncated?: boolean; samples: Array<{ url: string; status: number | null; error?: string }>; history: Point[] };
  contentCompleteness: { state: State; checked: number; incomplete: number; requiredFields: string[]; source: string; error?: string; history: Point[] };
  firestoreHealth: { state: State; connected: boolean; latencyMs: number | null; checked: number; broken: number; missingStateId: number; emptyContent: number; collection: string; samples: Array<{ id: string; missingFields: string[] }>; error?: string; history: Point[] };
  hosting404s: { state: State; total: number | null; truncated?: boolean; source: string; urls: Array<{ url: string; count: number; lastSeen: string | null }>; error?: string; history: Point[] };
  googleIndexing: { state: State; submitted: number | null; indexed: number | null; nonIndexed: number | null; source: string; error?: string; history: Point[] };
};

const STORE = "seoDiagnostics/runs";
const limit = <T>(items: T[], size: number) => items.slice(Math.max(0, items.length - size));

async function urlsFromSitemap(origin: string) {
  const seen = new Set<string>();
  const visit = async (url: string, depth = 0): Promise<void> => {
    if (depth > 2 || seen.has(url)) return;
    if (new URL(url).origin !== origin) return;
    seen.add(url);
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`Sitemap returned ${response.status}`);
    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => match[1].trim()).filter((item) => { try { return new URL(item).origin === origin; } catch { return false; } });
    await Promise.all(locations.filter((item) => item.endsWith(".xml")).map((item) => visit(item, depth + 1)));
    locations.filter((item) => !item.endsWith(".xml") && item.includes("/service-areas/")).forEach((item) => seen.add(item));
  };
  await visit(`${origin}/sitemap.xml`);
  return [...seen].filter((item) => item.includes("/service-areas/") && !item.endsWith(".xml"));
}

async function checkLocations(origin: string) {
  const urls = await urlsFromSitemap(origin);
  const results: Array<{ url: string; status: number | null; error?: string }> = [];
  const checkedUrls = urls.slice(0, 500);
  for (let start = 0; start < checkedUrls.length; start += 12) {
    const batch = checkedUrls.slice(start, start + 12);
    results.push(...await Promise.all(batch.map(async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(15_000) });
        return { url, status: response.status };
      } catch (error) {
        return { url, status: null, error: safeError(error) };
      }
    })));
  }
  const failures = results.filter((row) => row.status == null || row.status < 200 || row.status >= 300);
  return {
    state: failures.length ? "error" as const : results.length === 0 || urls.length > checkedUrls.length ? "warning" as const : "healthy" as const,
    checked: results.length,
    truncated: urls.length > checkedUrls.length,
    errors: failures.length,
    notFound: results.filter((row) => row.status === 404).length,
    serverErrors: results.filter((row) => row.status != null && row.status >= 500).length,
    samples: failures.slice(0, 20),
  };
}

function recordsFrom(value: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(value)) return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
  if (value && typeof value === "object") return Object.values(value).filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
  return [];
}

async function checkContent() {
  const path = process.env.SEO_CONTENT_DATABASE_PATH?.trim();
  const requiredFields = (process.env.SEO_CONTENT_REQUIRED_FIELDS || "title,h1,content").split(",").map((field) => field.trim()).filter(Boolean);
  if (!path) return { state: "not_configured" as const, checked: 0, incomplete: 0, requiredFields, source: "Set SEO_CONTENT_DATABASE_PATH to the Firebase content collection" };
  try {
    const snapshot = await firebase().db.ref(path).get();
    const rows = recordsFrom(snapshot.val());
    const incomplete = rows.filter((row) => requiredFields.some((field) => row[field] == null || String(row[field]).trim() === "")).length;
    return { state: incomplete ? "warning" as const : "healthy" as const, checked: rows.length, incomplete, requiredFields, source: `Firebase: ${path}` };
  } catch (error) {
    return { state: "error" as const, checked: 0, incomplete: 0, requiredFields, source: `Firebase: ${path}`, error: safeError(error) };
  }
}

function isEmptyContent(value: unknown) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
}

async function checkFirestore() {
  const collection = process.env.FIRESTORE_CITIES_COLLECTION?.trim() || "cities";
  const configured = Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
  if (!configured) return { state: "not_configured" as const, connected: false, latencyMs: null, checked: 0, broken: 0, missingStateId: 0, emptyContent: 0, collection, samples: [], error: "Firebase service account is not configured" };
  try {
    const firestore = firebase().firestore;
    const startedAt = Date.now();
    const first = await firestore.collection(collection).orderBy(FieldPath.documentId()).limit(500).get();
    const latencyMs = Date.now() - startedAt;
    let page = first;
    let checked = 0;
    let broken = 0;
    let missingStateId = 0;
    let emptyContent = 0;
    const samples: Array<{ id: string; missingFields: string[] }> = [];
    while (checked < 5000) {
      for (const document of page.docs) {
        const data = document.data();
        const missingFields: string[] = [];
        if (typeof data.stateId !== "string" || data.stateId.trim() === "") { missingStateId += 1; missingFields.push("stateId"); }
        if (isEmptyContent(data.content)) { emptyContent += 1; missingFields.push("content"); }
        if (missingFields.length) {
          broken += 1;
          if (samples.length < 20) samples.push({ id: document.id, missingFields });
        }
        checked += 1;
      }
      if (page.size < 500) break;
      const next: Query = firestore.collection(collection).orderBy(FieldPath.documentId()).startAfter(page.docs.at(-1)!.id).limit(500);
      page = await next.get();
    }
    return { state: checked === 0 || broken || checked >= 5000 ? "warning" as const : "healthy" as const, connected: true, latencyMs, checked, broken, missingStateId, emptyContent, collection, samples, error: checked >= 5000 ? "Scan limited to first 5,000 city documents" : undefined };
  } catch (error) {
    return { state: "error" as const, connected: false, latencyMs: null, checked: 0, broken: 0, missingStateId: 0, emptyContent: 0, collection, samples: [], error: safeError(error) };
  }
}

async function checkHosting404s() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const email = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  const source = "Google Cloud Logging / Firebase Hosting";
  if (process.env.FIREBASE_HOSTING_LOGS_ENABLED !== "true") return { state: "not_configured" as const, total: null, source, urls: [], error: "Firebase Hosting logs are not enabled for this deployment" };
  if (!projectId || !email || !privateKey) return { state: "not_configured" as const, total: null, source, urls: [], error: "Firebase service account is not configured" };
  try {
    const token = await getGoogleServiceAccountToken(email, privateKey, "https://www.googleapis.com/auth/cloud-platform.read-only");
    const lookback = Math.max(1, Math.min(720, Number(process.env.GOOGLE_CLOUD_LOG_LOOKBACK_HOURS) || 168));
    const since = new Date(Date.now() - lookback * 60 * 60 * 1_000).toISOString();
    const filter = process.env.GOOGLE_CLOUD_LOG_FILTER?.trim() || `resource.type="firebase_domain" AND httpRequest.status=404 AND timestamp>="${since}"`;
    const rows: Array<Record<string, unknown>> = [];
    let pageToken: string | undefined;
    for (let page = 0; page < 5; page += 1) {
      const json = await providerJson("https://logging.googleapis.com/v2/entries:list", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ resourceNames: [`projects/${projectId}`], filter, orderBy: "timestamp desc", pageSize: 1000, ...(pageToken ? { pageToken } : {}) }),
      });
      if (Array.isArray(json.entries)) rows.push(...json.entries as Array<Record<string, unknown>>);
      pageToken = typeof json.nextPageToken === "string" ? json.nextPageToken : undefined;
      if (!pageToken) break;
    }
    const grouped = new Map<string, { count: number; lastSeen: string | null }>();
    for (const row of rows) {
      const request = row.httpRequest as Record<string, unknown> | undefined;
      const rawUrl = typeof request?.requestUrl === "string" ? request.requestUrl : "";
      let url = "Unknown URL";
      try { const parsed = new URL(rawUrl); url = `${parsed.host}${parsed.pathname}`.slice(0, 500); } catch { /* Do not expose untrusted log payloads. */ }
      const timestamp = typeof row.timestamp === "string" ? row.timestamp : null;
      const current = grouped.get(url) || { count: 0, lastSeen: timestamp };
      current.count += 1;
      if (timestamp && (!current.lastSeen || timestamp > current.lastSeen)) current.lastSeen = timestamp;
      grouped.set(url, current);
    }
    const urls = [...grouped.entries()].map(([url, value]) => ({ url, ...value })).sort((a, b) => b.count - a.count).slice(0, 10);
    return { state: rows.length ? "warning" as const : "healthy" as const, total: rows.length, truncated: Boolean(pageToken), source: `${source}, last ${lookback} hours${pageToken ? " (first 5,000 entries only)" : ""}`, urls };
  } catch (error) {
    return { state: "error" as const, total: null, source, urls: [], error: safeError(error) };
  }
}

async function checkGoogle(origin: string) {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim();
  const token = await getGoogleAccessToken();
  if (!siteUrl || !token) return { state: "not_configured" as const, submitted: null, indexed: null, nonIndexed: null, source: "Google Search Console sitemap API is not connected" };
  try {
    const sitemapUrl = `${origin}/sitemap.xml`;
    const json = await providerJson(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`, { headers: { Authorization: `Bearer ${token}` } });
    const contents = Array.isArray(json.contents) ? json.contents as Array<Record<string, unknown>> : [];
    const submitted = contents.reduce((sum, row) => sum + (Number(row.submitted) || 0), 0);
    return { state: "warning" as const, submitted, indexed: null, nonIndexed: null, source: "Google Search Console sitemap submissions; verified site-wide index totals are not available from this endpoint" };
  } catch (error) {
    return { state: "error" as const, submitted: null, indexed: null, nonIndexed: null, source: "Google Search Console sitemap report", error: safeError(error) };
  }
}

async function history() {
  try {
    const snap = await firebase().db.ref(STORE).orderByKey().limitToLast(12).get();
    return recordsFrom(snap.val()) as unknown as DiagnosticSnapshot[];
  } catch { return []; }
}

export async function readLatestDiagnostics() {
  try {
    const snap = await firebase().db.ref(STORE).orderByKey().limitToLast(1).get();
    const rows = recordsFrom(snap.val()) as unknown as DiagnosticSnapshot[];
    return rows[0] || null;
  } catch { return null; }
}

export async function runDiagnostics(): Promise<DiagnosticSnapshot> {
  const origin = (process.env.SEO_DIAGNOSTICS_ORIGIN || SEO_ORIGINS.preview).replace(/\/$/, "");
  const old = await history();
  const [locations, content, firestore, hosting404s, google] = await Promise.all([checkLocations(origin), checkContent(), checkFirestore(), checkHosting404s(), checkGoogle(origin)]);
  const generatedAt = new Date().toISOString();
  const snapshot: DiagnosticSnapshot = {
    generatedAt, frequencyHours: 12, origin,
    locationHealth: { ...locations, history: limit([...old.map((row) => ({ at: row.generatedAt, value: row.locationHealth.errors })), { at: generatedAt, value: locations.errors }], 12) },
    contentCompleteness: { ...content, history: limit([...old.map((row) => ({ at: row.generatedAt, value: row.contentCompleteness.incomplete })), { at: generatedAt, value: content.incomplete }], 12) },
    firestoreHealth: { ...firestore, history: limit([...old.filter((row) => row.firestoreHealth).map((row) => ({ at: row.generatedAt, value: row.firestoreHealth.broken })), { at: generatedAt, value: firestore.broken }], 12) },
    hosting404s: { ...hosting404s, history: limit([...old.filter((row) => row.hosting404s?.total != null).map((row) => ({ at: row.generatedAt, value: row.hosting404s.total! })), ...(hosting404s.total == null ? [] : [{ at: generatedAt, value: hosting404s.total }])], 12) },
    googleIndexing: { ...google, history: limit([...old.filter((row) => row.googleIndexing.indexed != null).map((row) => ({ at: row.generatedAt, value: row.googleIndexing.indexed! })), ...(google.indexed == null ? [] : [{ at: generatedAt, value: google.indexed }])], 12) },
  };
  try { await firebase().db.ref(`${STORE}/${Date.now()}`).set(snapshot); } catch { /* Endpoint still returns measured results when history storage is unavailable. */ }
  return snapshot;
}
