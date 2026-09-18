import { describe, expect, it } from "vitest";
import legacyAuthorityData from "../content/legacy-authority-pages.json" with { type: "json" };
import { authorityReleaseRoutes } from "../scripts/seo-policy";
import vercel from "../vercel.json" with { type: "json" };

type LegacyPage = { path: string; parentPath: string };

const pages = legacyAuthorityData.pages as LegacyPage[];
const pathParameters = /:[A-Za-z0-9_]+\*?/g;

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
