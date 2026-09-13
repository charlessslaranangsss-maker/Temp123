import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import serviceDetails from "../content/service-details.json" with { type: "json" };
import locationPhotos from "../src/locationPhotos.json" with { type: "json" };
import type { LocationPhoto } from "../src/locationPhotos";
import { regionPages } from "../src/regionGuides";
import { serviceCategories } from "../src/serviceMenu";
import { stateGuides } from "../src/stateGuides";

const words = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length;
const normalized = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const seasonalCopy = (seasonal: {
  summary: string[];
  basis: string;
  delivery: { window: string; note: string };
}) =>
  [
    ...seasonal.summary,
    seasonal.basis,
    seasonal.delivery.window,
    seasonal.delivery.note,
  ].join(" ");

describe("state and regional planning content", () => {
  it("covers all 50 states and 246 distinct travel regions", () => {
    expect(Object.keys(stateGuides)).toHaveLength(50);
    expect(regionPages).toHaveLength(246);
    expect(new Set(regionPages.map((guide) => guide.path)).size).toBe(246);
    for (const state of Object.keys(stateGuides)) {
      const guides = regionPages.filter((guide) => guide.state === state);
      const cityPairs = guides.map((guide) =>
        [...guide.cities].sort().join("|"),
      );
      const cities = guides.flatMap((guide) => guide.cities);
      expect(new Set(cityPairs).size, `${state} city pairs`).toBe(
        guides.length,
      );
      expect(new Set(cities).size, `${state} repeated cities`).toBe(
        cities.length,
      );
    }
  });

  it("keeps each state brief direct, qualified and locally useful", () => {
    for (const [state, guide] of Object.entries(stateGuides)) {
      const copy = [
        guide.intro,
        guide.serviceSummary,
        guide.fact,
        seasonalCopy(guide.seasonal),
      ].join(" ");
      expect(words(copy), state).toBeGreaterThanOrEqual(250);
      expect(words(copy), state).toBeLessThanOrEqual(500);
      expect(guide.seasonal.code, state).toBeGreaterThanOrEqual(1);
      expect(guide.seasonal.code, state).toBeLessThanOrEqual(5);
      expect(guide.seasonal.basis, state).toContain(
        "not an official government risk rating",
      );
      expect(guide.seasonal.delivery.note, state).toMatch(
        /estimated|estimate/i,
      );
      expect(copy, state).toMatch(/Emergency support is available 24\/7/i);
      expect(copy, state).toMatch(/base camp|man camp/i);
      expect(copy, state).toMatch(/mobile commercial kitchens/i);
      expect(copy, state).toMatch(/shower and restroom combination/i);
      expect(copy, state).toMatch(/22 ft shower trailers with 10 stalls/i);
      expect(copy, state).toMatch(/sleeper and bunkbed/i);
      expect(copy, state).not.toMatch(/[—*]/);
    }
  });

  it("keeps every regional brief within the requested reading length", () => {
    for (const guide of regionPages) {
      const copy = [
        guide.intro,
        guide.detail,
        guide.fact,
        seasonalCopy(guide.seasonal),
      ].join(" ");
      expect(words(copy), guide.path).toBeGreaterThanOrEqual(250);
      expect(words(copy), guide.path).toBeLessThanOrEqual(500);
      expect(guide.cities.length, guide.path).toBeGreaterThanOrEqual(4);
      expect(guide.cities.length, guide.path).toBeLessThanOrEqual(8);
      expect(new Set(guide.cities).size, guide.path).toBe(guide.cities.length);
      for (const city of guide.cities) {
        expect(city, guide.path).not.toBe(guide.state);
        expect(copy, guide.path).toContain(city);
      }
      expect(guide.seasonal.basis, guide.path).toContain(
        "not an official government risk rating",
      );
      expect(guide.seasonal.delivery.note, guide.path).toMatch(
        /estimated|estimate/i,
      );
      expect(copy, guide.path).toMatch(/Emergency support is available 24\/7/i);
      expect(copy, guide.path).toMatch(/base camp|man camp/i);
      expect(copy, guide.path).not.toMatch(/[—*]/);
    }
  });
});

describe("location media and shower inventory", () => {
  it("assigns one unique licensed location image to every page", () => {
    const entries: [string, LocationPhoto][] = [
      ...Object.entries(locationPhotos.states),
      ...Object.entries(locationPhotos.regions),
    ] as [string, LocationPhoto][];
    expect(Object.keys(locationPhotos.states)).toHaveLength(50);
    expect(Object.keys(locationPhotos.regions)).toHaveLength(246);
    expect(new Set(entries.map(([, photo]) => photo.sourceUrl)).size).toBe(296);
    for (const [name, photo] of entries) {
      expect(
        existsSync(`public${photo.image}`),
        `${name}: ${photo.image}`,
      ).toBe(true);
      expect(photo.imageAlt.length, name).toBeGreaterThan(24);
      expect(photo.sourceUrl, name).toMatch(
        /^https:\/\/commons\.wikimedia\.org\//,
      );
      expect(photo.license, name).toBeTruthy();
      expect(photo.width, name).toBeGreaterThanOrEqual(photo.height);
      expect(photo.title, name).not.toMatch(
        /\b(map|flag|logo|seal|diagram|drawing|plan|sign|marker|plaque|fish|grayling|bird|specimen|portrait|statue|monument|memorial|sculpture|cemetery)\b/i,
      );
    }
    for (const guide of regionPages) {
      const photo = locationPhotos.regions[
        guide.path as keyof typeof locationPhotos.regions
      ] as LocationPhoto;
      const title = normalized(photo.title);
      const placeTerms = [guide.region, ...guide.cities];
      if (guide.path === "/service-areas/alaska/arctic/") {
        placeTerms.push("Barrow");
      }
      expect(
        placeTerms.some((place) => title.includes(normalized(place))),
        `${guide.path}: ${photo.title}`,
      ).toBe(true);
    }
  });

  it("publishes only the current 22 ft, 10-stall shower model", () => {
    const shower = serviceCategories.find(
      (category) => category.name === "Shower",
    );
    expect(shower?.links).toEqual([
      {
        name: "22 ft Shower Trailer, 10 Stalls",
        href: "/services/shower-trailers/22ft-10-stall/",
      },
    ]);
    expect(serviceDetails).toHaveProperty(
      "/services/shower-trailers/22ft-10-stall/",
    );
    for (const size of ["12ft", "14ft", "20ft", "30ft"]) {
      expect(serviceDetails).not.toHaveProperty(
        `/services/shower-trailers/${size}/`,
      );
    }
    const redirects = readFileSync("vercel.json", "utf8");
    for (const size of ["12ft", "14ft", "20ft", "30ft"]) {
      expect(redirects).toContain(`/services/shower-trailers/${size}/`);
    }
  });
});
