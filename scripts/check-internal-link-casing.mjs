import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { load } from "cheerio";

const root = "dist";
const htmlPages = [];
const emittedFiles = new Set();
const collect = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else {
      const emitted = `/${relative(root, path).split(sep).join("/")}`;
      emittedFiles.add(emitted);
      if (entry.name === "index.html") htmlPages.push(path);
    }
  }
};

await collect(root);
const vercel = JSON.parse(await readFile("vercel.json", "utf8"));
const redirectSources = new Set(
  (vercel.redirects || [])
    .filter((rule) => !rule.has?.length && !rule.missing?.length)
    .map((rule) => rule.source),
);
const routes = new Set(
  [...emittedFiles]
    .filter((path) => path.endsWith("/index.html"))
    .map((path) => path === "/index.html" ? "/" : path.slice(0, -"index.html".length)),
);
const capitalizationIssues = [];
const missingTargets = [];

for (const path of htmlPages) {
  const page = path === join(root, "index.html")
    ? "/"
    : `/${relative(root, path).split(sep).join("/")}`.replace(/index\.html$/, "");
  const $ = load(await readFile(path, "utf8"));
  $("a[href]").each((_, anchor) => {
    const rawHref = $(anchor).attr("href") || "";
    if (/^(?:mailto:|tel:|javascript:|#)/i.test(rawHref)) return;
    let url;
    try {
      url = new URL(rawHref, "https://temporary123.com");
    } catch {
      return;
    }
    if (!["temporary123.com", "www.temporary123.com"].includes(url.hostname)) return;
    const href = decodeURI(url.pathname);
    const label = $(anchor).text().replace(/\s+/g, " ").trim();
    const firstLetter = label.match(/^([A-Za-z])/)?.[1];
    if (rawHref.startsWith("/") && firstLetter && firstLetter === firstLetter.toLowerCase())
      capitalizationIssues.push({ page, href, label });

    if (/^\/api\//.test(href)) return;
    const normalizedRoute = href.endsWith("/") ? href : `${href}/`;
    const fileTarget = extname(href) ? href : null;
    if (
      routes.has(normalizedRoute) ||
      (fileTarget && emittedFiles.has(fileTarget)) ||
      redirectSources.has(href) ||
      redirectSources.has(normalizedRoute)
    ) return;
    missingTargets.push({ page, href, label });
  });
}

const uniqueMissing = [...new Map(
  missingTargets.map((issue) => [`${issue.page}|${issue.href}`, issue]),
).values()];
console.log(JSON.stringify({
  pages: htmlPages.length,
  capitalizationIssues: capitalizationIssues.length,
  missingTargets: uniqueMissing.length,
  capitalizationLabels: [...new Set(capitalizationIssues.map((issue) => issue.label))],
  missing: uniqueMissing,
}, null, 2));
if (capitalizationIssues.length || uniqueMissing.length) process.exitCode = 1;
