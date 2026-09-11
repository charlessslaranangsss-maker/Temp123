import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { load } from "cheerio";

const root = resolve("dist");
const vercel = JSON.parse(await readFile("vercel.json", "utf8"));
const redirectSources = new Set(vercel.redirects.map((rule) => rule.source));

async function files(dir) {
  const all = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      all.map((file) =>
        file.isDirectory()
          ? files(resolve(dir, file.name))
          : resolve(dir, file.name),
      ),
    )
  ).flat();
}

const routeForFile = (file) => {
  if (file.endsWith("404.html")) return "/404/";
  const folder = relative(root, file.slice(0, -"index.html".length)).replaceAll(
    "\\",
    "/",
  );
  return folder ? `/${folder.replace(/^\/+|\/+$/g, "")}/` : "/";
};

const htmlFiles = (await files(root)).filter((file) => file.endsWith(".html"));
const problems = [];
let links = 0;
let images = 0;
const titles = new Map();
const descriptions = new Map();
const incoming = new Map();

for (const file of htmlFiles) {
  const $ = load(await readFile(file, "utf8"));
  const route = routeForFile(file);
  const title = $("title").text().trim();
  const description = $("meta[name=description]").attr("content")?.trim();
  const robots = $("meta[name=robots]").attr("content");
  const canonical = $("link[rel=canonical]").attr("href");

  if (title) titles.set(title, [...(titles.get(title) || []), route]);
  if (description)
    descriptions.set(description, [
      ...(descriptions.get(description) || []),
      route,
    ]);

  $("script,style").remove();
  if ($("h1").length !== 1) problems.push({ file, issue: "h1-count" });
  if (/[—*]/.test($("body").text()))
    problems.push({ file, issue: "copy-punctuation" });
  if (!description) problems.push({ file, issue: "missing-description" });
  if (
    description &&
    (/^(previous|next)/i.test(description) ||
      /complete list of states and cities|forminator_form/i.test(description))
  )
    problems.push({ file, issue: "boilerplate-description" });

  const expectedRobots =
    route === "/404/" ? "noindex,nofollow" : "noindex,follow";
  if (robots !== expectedRobots)
    problems.push({ file, issue: "preview-robots", value: robots });
  if (canonical)
    problems.push({ file, issue: "preview-canonical", value: canonical });

  for (const selector of [
    "meta[property='og:title']",
    "meta[property='og:description']",
    "meta[property='og:type']",
    "meta[property='og:site_name']",
    "meta[property='og:locale']",
    "meta[name='twitter:card']",
    "meta[name='twitter:title']",
    "meta[name='twitter:description']",
  ]) {
    if (!$(selector).attr("content"))
      problems.push({ file, issue: "missing-social-metadata", selector });
  }

  for (const element of $("a[href],img[src]").toArray()) {
    const value = $(element).attr(element.name === "img" ? "src" : "href");
    if (!value?.startsWith("/") || value.startsWith("//")) continue;
    const clean = decodeURIComponent(value.split(/[?#]/)[0]);
    const target = resolve(root, `.${clean}`);
    let valid = false;
    try {
      const info = await stat(target);
      valid =
        info.isFile() || (await stat(resolve(target, "index.html"))).isFile();
    } catch {}
    if (!valid)
      problems.push({ file, issue: "missing-local-destination", value });
    if (element.name === "a" && redirectSources.has(clean))
      problems.push({ file, issue: "internal-link-to-redirect", value });
    if (element.name === "a" && valid) {
      const linkedRoute = clean.endsWith("/") ? clean : `${clean}/`;
      incoming.set(linkedRoute, (incoming.get(linkedRoute) || 0) + 1);
    }
    element.name === "img" ? images++ : links++;
  }
}

for (const [title, routes] of titles)
  if (routes.length > 1)
    problems.push({ issue: "duplicate-title", value: title, routes });
for (const [description, routes] of descriptions)
  if (routes.length > 1)
    problems.push({
      issue: "duplicate-description",
      value: description,
      routes,
    });
for (const file of htmlFiles) {
  const route = routeForFile(file);
  if (route !== "/" && route !== "/404/" && !incoming.get(route))
    problems.push({ file, issue: "orphan-page", route });
}

const robotsText = await readFile(resolve(root, "robots.txt"), "utf8");
if (!/User-agent: \*\s+Allow: \/\s+Disallow: \/api\//.test(robotsText))
  problems.push({ issue: "robots-policy" });
const sitemapText = await readFile(resolve(root, "sitemap.xml"), "utf8");
if (/<url>/.test(sitemapText))
  problems.push({ issue: "preview-sitemap-not-empty" });

const report = {
  checkedAt: new Date().toISOString(),
  htmlPages: htmlFiles.length,
  localLinks: links,
  localImages: images,
  uniqueTitles: titles.size,
  uniqueDescriptions: descriptions.size,
  linkedRoutes: incoming.size,
  problems,
  migration: { expected: 98253, recovered: 625 },
  indexing:
    "Revision host remains noindex. Production origin migration is incomplete.",
};
await writeFile(
  "audit/homepage-revision-check.json",
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify({ ...report, problems: problems.slice(0, 10) }));
if (problems.length) process.exitCode = 1;
