export const publicOrigin = "https://temp123-alpha.vercel.app";

export type IndexingScope = "full" | "homepage-and-service-areas";

export function routeInIndexingScope(path: string, scope: IndexingScope) {
  if (scope === "full") return true;
  return (
    path === "/" ||
    path === "/service-areas/" ||
    path.startsWith("/service-areas/")
  );
}

export function routesForIndexingBatch(
  paths: string[],
  activeBatch: number,
  batchSize: number,
) {
  if (!Number.isInteger(activeBatch) || activeBatch < 1)
    throw new Error("Active indexing batch must be a positive integer");
  if (!Number.isInteger(batchSize) || batchSize < 1)
    throw new Error("Indexing batch size must be a positive integer");
  return paths.slice(0, activeBatch * batchSize);
}

export function productionBuild(mode: string, environment?: string) {
  return (
    mode === "production" && (!environment || environment === "production")
  );
}

export function canonicalFor(
  path: string,
  indexable: boolean,
  production: boolean,
) {
  if (!production || !indexable || path === "/404/") return undefined;
  if (!path.startsWith("/") || path.startsWith("//") || /[?#]/.test(path))
    throw new Error(`Invalid canonical path: ${path}`);
  return new URL(path, publicOrigin).href;
}

// WordPress modified dates have no timezone in older exports. Keep the known
// calendar date instead of inventing a UTC timestamp or using the build time.
export function modificationDate(value?: string) {
  const date = value?.match(/^\d{4}-\d{2}-\d{2}(?=$|T)/)?.[0];
  if (!date) return undefined;
  const parsed = new Date(date);
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    return undefined;
  return date <= new Date().toISOString().slice(0, 10) ? date : undefined;
}

export function sitemapXml(
  rows: { path: string; indexable: boolean; modified?: string }[],
  production: boolean,
) {
  const escape = (s: string) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll('"', "&quot;");
  const urls = production
    ? rows
        .flatMap((row) => {
          const canonical = canonicalFor(row.path, row.indexable, true);
          if (!canonical) return [];
          const modified = modificationDate(row.modified);
          return [
            `<url><loc>${escape(canonical)}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ""}</url>`,
          ];
        })
        .join("")
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
