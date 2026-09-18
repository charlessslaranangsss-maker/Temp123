import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import media from "../content/media-map.json" with { type: "json" };
import routeIndex from "../content/route-index.json" with { type: "json" };
import { renderSourceContent } from "../scripts/source-content";

const militaryRoutes = [
  "/26ft-military-bulk-kitchen/",
  "/2800-military-series/",
  "/4000-military-series/",
  "/40ft-military-bulk-kitchen/",
  "/4500-military-series/",
  "/government/military-kitchen/",
] as const;

const expectedMilitaryAlt = [
  "United States Air Force seal",
  "United States Army seal",
  "United States Coast Guard seal",
  "United States Department of Veterans Affairs seal",
  "United States Marine Corps seal",
  "United States Department of the Navy seal",
];

const recoveredMedia: Record<string, { local?: string }> = Object.fromEntries(
  Object.entries(media).map(([src, record]) => [
    src,
    "local" in record ? { local: record.local } : {},
  ]),
);

const sourceHtml = (path: string) => {
  const record = routeIndex.find((entry) => entry.path === path);
  if (!record) throw new Error(`Missing source route: ${path}`);
  return JSON.parse(
    gunzipSync(
      readFileSync(new URL(`../content/pages/${record.file}`, import.meta.url)),
    ).toString(),
  ).html as string;
};

const renderRoute = (path: string) =>
  load(
    renderSourceContent(sourceHtml(path), {
      origin: "https://temporary123.com",
      routes: new Set<string>(),
      redirects: new Map<string, string>(),
      media: recoveredMedia,
      unresolved: new Set<string>(),
    }),
  );

describe("legacy visible image alternatives", () => {
  it("identifies all 36 linked military seals without a generic link label", () => {
    for (const path of militaryRoutes) {
      const $ = renderRoute(path);
      const seals = $("a img")
        .toArray()
        .filter((image) =>
          expectedMilitaryAlt.includes($(image).attr("alt") || ""),
        );

      expect(
        seals.map((image) => $(image).attr("alt")),
        path,
      ).toEqual(expectedMilitaryAlt);
      expect($("a[aria-label='View image']"), path).toHaveLength(0);
    }
  });

  it("describes both recovered restroom-trailer figures by their visible scene", () => {
    const $ = renderRoute("/restroom-trailer-rental/");

    expect(
      $("figure img")
        .toArray()
        .map((image) => $(image).attr("alt")),
    ).toEqual([
      "Large shower and restroom trailer with open private stalls and an ADA access ramp",
      "Large shower and restroom trailer at dusk with illuminated open private stalls",
    ]);
  });
});
