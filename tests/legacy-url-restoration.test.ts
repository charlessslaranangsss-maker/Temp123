import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import legacyAuthorityData from "../content/legacy-authority-pages.json" with { type: "json" };
import { authorityReleaseRoutes } from "../scripts/seo-policy";
import vercel from "../vercel.json" with { type: "json" };

type LegacyPage = { path: string; parentPath: string };

const pages = legacyAuthorityData.pages as LegacyPage[];
const pathParameters = /:[A-Za-z0-9_]+\*?/g;
const migrationMap = readFileSync(
  new URL(
    "../audit/legacy-url-restoration-2026-09-18/migration-map.csv",
    import.meta.url,
  ),
  "utf8",
);

function redirectMatches(source: string, path: string) {
  if (source === path) return true;
  const pattern = source
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(pathParameters, (parameter) =>
      parameter.endsWith("*") ? ".*" : "[^/]+",
    );
  return new RegExp(`^${pattern}$`).test(path);
}

describe("legacy backlink URL restoration", () => {
  it("keeps every restored HTML route unique and out of redirect rules", () => {
    expect(pages).toHaveLength(90);
    expect(new Set(pages.map((page) => page.path)).size).toBe(90);

    for (const page of pages) {
      expect(page.path, page.path).toMatch(/^\/.+\/$/);
      expect(page.parentPath, page.path).toMatch(/^\/.+\/$/);
      expect(
        vercel.redirects.some(
          (rule) => !("has" in rule) && redirectMatches(rule.source, page.path),
        ),
        `${page.path} must render directly`,
      ).toBe(false);
    }
  });

  it("retains the non-HTML backlink as an asset redirect", () => {
    expect(
      vercel.redirects.find(
        (rule) =>
          rule.source ===
          "/wp-content/uploads/2023/04/2-Food-Service-Design.png",
      ),
    ).toMatchObject({
      destination: "https://temporary123.com/food-services-2/",
      permanent: true,
    });
  });

  it("redirects every www backlink path to the same apex path", () => {
    const wwwPaths = new Set(
      migrationMap
        .trim()
        .split("\n")
        .slice(1)
        .map((line) => line.split(","))
        .filter((columns) => columns[1] === "www.temporary123.com")
        .map((columns) => columns[2])
        .filter((path) => !/\.[^/]+$/.test(path)),
    );

    for (const path of wwwPaths) {
      expect(
        vercel.redirects.find(
          (rule) =>
            rule.source === path &&
            "has" in rule &&
            rule.has?.some(
              (condition) =>
                condition.type === "host" &&
                condition.value === "www.temporary123.com",
            ),
        ),
        path,
      ).toMatchObject({
        destination: `https://temporary123.com${path}`,
        permanent: true,
      });
    }
  });

  it("releases exactly the first 25 backlink-ranked paths", () => {
    expect(authorityReleaseRoutes).toHaveLength(25);
    expect(authorityReleaseRoutes[0]).toBe("/");
    expect(authorityReleaseRoutes).toContain(
      "/remote-workforce-housing-services-in-alaska/",
    );
    expect(authorityReleaseRoutes).toContain(
      "/equipment-rental/restroom-trailers/portable-restroom-trailers-in-california/",
    );
  });
});
