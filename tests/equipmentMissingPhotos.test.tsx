import { existsSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { Site } from "../src/Site";
import { catalog } from "../src/EquipmentCatalog";
import { catalogPhotoCoverage } from "../src/catalogImageCoverage";
import { equipment, equipmentGalleryForPath } from "../src/Equipment";

const supplied = [
  ["restroom-trailers", 3, "restroom"],
  ["dining-structure-rental", 3, "dining"],
  ["stair-rentals", 2, "stair"],
] as const;

describe("equipment-page missing photo follow-up", () => {
  it.each(supplied)("uses supplied %s imagery", (id, count, altWord) => {
    const item = catalog.items.find((entry) => entry.id === id)!;
    const result = catalogPhotoCoverage(item);
    expect(result.status).toBe("reviewed-supplied");
    expect(result.images).toHaveLength(count);
    expect(result.caption).toMatch(/rental or lease/i);
    for (const image of result.images) {
      expect(image.alt).toMatch(new RegExp(altWord, "i"));
      expect(image.src).toContain("/images/catalog-supplied/");
      expect(existsSync(`public${image.src}`)).toBe(true);
      expect(existsSync(`public${image.thumbnail}`)).toBe(true);
    }
  });

  it.each(["temporary-shower-trailers", "shower-trailer"])(
    "keeps the truthful disclosed shower reference for %s",
    (id) => {
      const item = catalog.items.find((entry) => entry.id === id)!;
      const result = catalogPhotoCoverage(item);
      expect(result.images.length).toBeGreaterThan(0);
      expect(result.caption).toMatch(/20 ft five-stall/i);
      expect(result.caption).toMatch(/does not depict.*22 ft ten-stall/i);
    },
  );

  it("renders the new restroom-only photo on the service and home cards", () => {
    const restroom = equipment.find((entry) => entry.name === "Restroom")!;
    const approved = equipmentGalleryForPath(restroom.path).images;
    expect(approved).toHaveLength(3);
    for (const path of ["/services/", "/"]) {
      const $ = load(renderToStaticMarkup(createElement(Site, { path })));
      const card = $(".equipment-card")
        .filter((_, element) =>
          $(element).find("h3").text().includes("Restroom"),
        )
        .first();
      expect(card.find("img").attr("src"), path).toBe(approved[0].src);
      expect(card.find("img").attr("alt"), path).toMatch(/toilet.*sink/i);
      expect(card.text(), path).not.toMatch(/photography is pending/i);
      expect(card.text(), path).not.toMatch(/combination unit/i);
    }
  });

  it.each(["12ft", "14ft", "20ft", "30ft"])(
    "renders reviewed restroom-only photos with a truthful %s disclosure",
    (length) => {
      const path = `/services/restroom-trailers/${length}/`;
      const $ = load(renderToStaticMarkup(createElement(Site, { path })));
      const carousel = $(".service-hero-carousel");
      expect(carousel).toHaveLength(1);
      const uniqueSources = new Set(
        carousel
          .find("img")
          .toArray()
          .map((image) => $(image).attr("src")),
      );
      expect(uniqueSources).toHaveLength(3);
      expect(carousel.text()).toMatch(
        new RegExp(`do not establish the separate ${length.replace("ft", " ft")} model`, "i"),
      );
      expect(carousel.text()).toMatch(/rental or lease configuration/i);
      expect($(".service-hero-unverified")).toHaveLength(0);
      expect($("main").text()).not.toMatch(
        /photo review in progress|photography (?:is )?pending|verified photography coming soon|pending specification/i,
      );
      const descriptiveImages = carousel
        .find("img")
        .filter((_, image) => Boolean($(image).attr("alt")));
      expect(descriptiveImages).toHaveLength(1);
      expect(
        carousel.find("img").filter((_, image) => !$(image).attr("alt")),
      ).toHaveLength(5);
      descriptiveImages.each((_, image) => {
        expect($(image).attr("alt")).toMatch(/restroom trailer/i);
      });
      carousel.find("img").each((_, image) => {
        expect($(image).attr("src")).toContain(
          "/images/catalog-supplied/restroom-trailers/",
        );
      });
    },
  );

  it("renders all five requested catalogue entries without pending photos", () => {
    const $ = load(
      renderToStaticMarkup(createElement(Site, { path: "/equipment-rental/" })),
    );
    const names = [
      "Restroom trailers",
      "Dining structures",
      "22 ft shower trailer, 10 stalls",
      "Stair rentals",
    ];
    for (const name of names) {
      const cards = $("[data-catalog-card]").filter((_, element) =>
        $(element).find("h4").text().includes(name),
      );
      expect(cards.length, name).toBe(name.startsWith("22 ft") ? 2 : 1);
      cards.each((_, card) => {
        expect($(card).find("img")).toHaveLength(1);
        expect($(card).find("[data-catalog-photo-pending]")).toHaveLength(0);
        if (name.startsWith("22 ft")) {
          expect($(card).text()).toMatch(
            /does not depict the separate 22 ft ten-stall/i,
          );
        }
      });
    }
  });
});
