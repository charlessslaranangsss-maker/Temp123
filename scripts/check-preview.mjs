import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { load } from "cheerio";
const root = resolve("dist");
async function files(dir) {
  const all = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      all.map((f) =>
        f.isDirectory() ? files(resolve(dir, f.name)) : resolve(dir, f.name),
      ),
    )
  ).flat();
}
const htmlFiles = (await files(root)).filter((f) => f.endsWith(".html"));
const problems = [];
let links = 0,
  images = 0;
for (const file of htmlFiles) {
  const $ = load(await readFile(file, "utf8"));
  $("script,style").remove();
  if ($("h1").length !== 1) problems.push({ file, issue: "h1-count" });
  if (/[—*]/.test($("body").text()))
    problems.push({ file, issue: "copy-punctuation" });
  if (!$("meta[name=description]").attr("content"))
    problems.push({ file, issue: "missing-description" });
  if (!$("meta[name=robots]").attr("content")?.includes("noindex"))
    problems.push({ file, issue: "preview-indexable" });
  for (const el of $("a[href],img[src]").toArray()) {
    const value = $(el).attr(el.name === "img" ? "src" : "href");
    if (!value?.startsWith("/") || value.startsWith("//")) continue;
    const clean = decodeURIComponent(value.split(/[?#]/)[0]);
    const target = resolve(root, "." + clean);
    let valid = false;
    try {
      const info = await stat(target);
      valid =
        info.isFile() || (await stat(resolve(target, "index.html"))).isFile();
    } catch {}
    if (!valid)
      problems.push({ file, issue: "missing-local-destination", value });
    el.name === "img" ? images++ : links++;
  }
}
const report = {
  checkedAt: new Date().toISOString(),
  htmlPages: htmlFiles.length,
  localLinks: links,
  localImages: images,
  problems,
  migration: { expected: 98253, recovered: 625 },
  indexing:
    "Revision host remains noindex. Production origin migration is incomplete.",
};
await writeFile(
  "audit/homepage-revision-check.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify({ ...report, problems: problems.slice(0, 10) }));
if (problems.length) process.exitCode = 1;
