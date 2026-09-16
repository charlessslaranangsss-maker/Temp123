import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";
import { stateGuides } from "../src/stateGuides.ts";
import { statePath } from "../src/statePaths.ts";
import { regionPages } from "../src/regionGuides.tsx";
import { reviewedCityPages } from "../src/cityDirectory.ts";
import {
  matchesLocationRentalHeadline,
  regionLocationLabel,
} from "../src/rentalHeadlines.ts";

const cases = [{ path: "/service-areas/", location: "USA", excluded: true }];
for (const state of Object.keys(stateGuides))
  cases.push({ path: statePath(state), location: state });
for (const region of regionPages) {
  const location = regionLocationLabel(region.region, region.state);
  cases.push({ path: region.path, location });
  cases.push({ path: `${region.path}cities/`, location, excluded: true });
}
for (const city of reviewedCityPages)
  cases.push({
    path: city.path,
    location: `${city.name}, ${city.state}`,
  });

const issues = [];
const headings = new Map();
for (const { path, location, excluded } of cases) {
  const file = join("dist", ...path.split("/").filter(Boolean), "index.html");
  const $ = load(await readFile(file, "utf8"));
  const h1 = $("main h1").first().text().replace(/\s+/g, " ").trim();
  const title = $("title").text().trim();
  if (!excluded && !matchesLocationRentalHeadline(h1, location))
    issues.push(
      `${path}: expected location + commercial use case + equipment family + rental intent: ${h1}`,
    );
  if (!title.startsWith(h1))
    issues.push(`${path}: title and H1 differ: ${title}`);
  if (headings.has(h1))
    issues.push(`${path}: duplicate H1 shared with ${headings.get(h1)}`);
  headings.set(h1, path);
}

console.log(
  JSON.stringify({
    locationPages: cases.length,
    uniqueHeadlines: headings.size,
    issues: issues.slice(0, 30),
  }),
);
if (issues.length) process.exitCode = 1;
