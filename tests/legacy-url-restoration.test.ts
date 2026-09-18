import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import legacyAuthorityData from "../content/legacy-authority-pages.json" with { type: "json" };
import { authorityReleaseRoutes } from "../scripts/seo-policy";
import vercel from "../vercel.json" with { type: "json" };

type LegacyPage = {
  path: string;
  parentPath: string;
  title: string;
  description: string;
};

const pages = legacyAuthorityData.pages as LegacyPage[];
const priorityDescriptions = {
  "/equipment-rental/command-center-trailers/":
    "Plan a command center trailer rental around workspace capacity, communications, power, climate control, site access and delivery schedule.",
  "/equipment-rental/decontamination-trailers/":
    "Plan a decontamination trailer rental around personnel flow, clean and dirty zones, water, wastewater, power, site access and servicing.",
  "/equipment-rental/dump-rental/":
    "Plan a dump container rental around waste type, container capacity, placement access, pickup schedule, site rules and rental duration.",
  "/equipment-rental/multi-trailer/":
    "Plan a multi-purpose trailer rental around intended use, occupancy, layout, utilities, site access, delivery schedule and rental duration.",
  "/equipment-rental/ramp-rental/":
    "Plan a rental ramp around trailer entry height, load and accessibility needs, placement clearance, surface conditions and delivery access.",
  "/equipment-rental/sleeper-trailers/":
    "Plan a sleeper trailer rental around bed capacity, crew shifts, length of stay, power, water or wastewater needs, delivery access and servicing.",
  "/equipment-rental/stair-rental/":
    "Plan rental stairs around trailer entry height, expected users, handrail and landing needs, surface conditions, placement clearance and delivery access.",
  "/equipment-rental/waste-container/":
    "Plan a waste container rental around waste stream, required capacity, secure placement, service frequency, delivery access and rental duration.",
  "/temporary-workforce-housing-facilities/":
    "Plan temporary workforce housing facilities around crew size, length of stay, sleeping and hygiene needs, utilities, site access, security and phased delivery.",
} as const;
const distinctWorkforceMetadata = {
  "/emergency-container-modular-remote-executive-hotel-suites/": {
    title: "Emergency Modular Executive Hotel Suite Rental",
    description:
      "Plan temporary modular executive hotel suites around occupancy, privacy, utility connections, site access, servicing and the required rental term.",
  },
  "/emergency-migrant-containerized-living-spaces/": {
    title: "Emergency Containerized Living Space Rental",
    description:
      "Plan emergency containerized living spaces around resident count, sleeping and hygiene needs, utilities, site access, servicing and duration.",
  },
  "/emergency-modular-shelters-contained-for-rental/": {
    title: "Emergency Modular Shelter Rental",
    description:
      "Plan emergency modular shelter rentals around occupant capacity, sleeping and hygiene needs, utilities, delivery access, servicing and duration.",
  },
  "/modular-temporary-camp-facilities/": {
    title: "Modular Temporary Camp Facility Rental",
    description:
      "Plan modular temporary camp facilities around workforce size, sleeping, dining and hygiene needs, utilities, access and phased delivery.",
  },
  "/modular-temporary-workforce-housing-facilities/": {
    title: "Modular Temporary Workforce Housing Rental",
    description:
      "Plan modular temporary workforce housing around crew size, room layout, hygiene, utilities, site access, servicing and rental duration.",
  },
  "/remote-basecamp-housing-service-company/": {
    title: "Remote Base Camp Housing Services",
    description:
      "Coordinate remote base camp housing around crew rotations, sleeping, dining and hygiene needs, utilities, site logistics and service schedules.",
  },
  "/remote-containerized-military-berthing-solution/": {
    title: "Remote Containerized Military Berthing Rental",
    description:
      "Plan remote containerized military berthing around personnel count, sleeping layout, hygiene support, utilities, site access and deployment duration.",
  },
  "/remote-housing-facilities/": {
    title: "Remote Housing Facility Rental",
    description:
      "Plan a remote housing facility around workforce size, room mix, dining and hygiene support, utilities, access, servicing and length of stay.",
  },
  "/remote-temporary-workforce-housing-facilities-rental/": {
    title: "Remote Temporary Workforce Housing Facility Rental",
    description:
      "Plan remote temporary workforce housing facilities around crew size, shift patterns, sleeping and hygiene needs, utilities, access and rental term.",
  },
  "/remote-workforce-house-company-in-alabama/": {
    title: "Remote Workforce Housing Company in Alabama",
    description:
      "Plan with a remote workforce housing company in Alabama around crew size, room needs, utilities, site access, servicing and project duration.",
  },
  "/remote-workforce-housing-facilities/": {
    title: "Remote Workforce Housing Facility Rental",
    description:
      "Plan remote workforce housing facility rentals around crew rotations, room needs, utilities, site logistics, servicing and project duration.",
  },
  "/remote-workforce-housing-in-alabama/": {
    title: "Remote Workforce Housing Rentals in Alabama",
    description:
      "Plan remote workforce housing rentals in Alabama around crew size, sleeping and hygiene needs, utilities, access, servicing and rental duration.",
  },
} as const;
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

  it("keeps priority indexable descriptions route-specific", () => {
    const actual = Object.fromEntries(
      pages
        .filter((page) => page.path in priorityDescriptions)
        .map((page) => [page.path, page.description]),
    );

    expect(actual).toEqual(priorityDescriptions);
    expect(new Set(Object.values(actual)).size).toBe(
      Object.keys(priorityDescriptions).length,
    );
    for (const description of Object.values(actual)) {
      expect(description.length).toBeGreaterThanOrEqual(100);
      expect(description.length).toBeLessThanOrEqual(160);
    }
  });

  it("keeps overlapping workforce pages distinct and descriptive", () => {
    const actual = Object.fromEntries(
      pages
        .filter((page) => page.path in distinctWorkforceMetadata)
        .map((page) => [
          page.path,
          { title: page.title, description: page.description },
        ]),
    );

    expect(actual).toEqual(distinctWorkforceMetadata);
    expect(new Set(Object.values(actual).map((item) => item.title)).size).toBe(
      Object.keys(actual).length,
    );
    expect(
      new Set(Object.values(actual).map((item) => item.description)).size,
    ).toBe(Object.keys(actual).length);
    for (const { description } of Object.values(actual)) {
      expect(description.length).toBeGreaterThanOrEqual(100);
      expect(description.length).toBeLessThanOrEqual(160);
    }
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
