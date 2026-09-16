import { readFile, writeFile } from "node:fs/promises";

const productionOrigin = "https://temporary123.com";
const registryPath = new URL("../audit/build-registry.json", import.meta.url);
const outputPath = new URL("../public/sitemap-review.xml", import.meta.url);

const registry = JSON.parse(await readFile(registryPath, "utf8"));
const paths = [...new Set(registry.pages.map(({ path }) => path))].sort((a, b) => {
  if (a === "/") return -1;
  if (b === "/") return 1;
  return a.localeCompare(b);
});

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map(
    (path) => `  <url><loc>${escapeXml(new URL(path, productionOrigin).href)}</loc></url>`,
  ),
  "</urlset>",
  "",
].join("\n");

await writeFile(outputPath, xml, "utf8");
console.log(`Generated ${paths.length} review URLs at ${outputPath.pathname}`);
