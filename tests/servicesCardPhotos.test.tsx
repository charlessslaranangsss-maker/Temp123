import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { Site } from "../src/Site";
import { equipmentGalleryForPath, equipment } from "../src/Equipment";

const cardPhotos = [
  ["Dishwashing", "38ft-high-temp-dish/01", "dishwashing machine"],
  ["Shower", "catalog/shower-trailer", "shower-only"],
  ["Laundry", "30ft-laundry-trailer/01", "washers and dryers"],
  [
    "Handwashing Trailers",
    "handwashing-sink-trailer/01",
    "handwashing trailer",
  ],
] as const;

describe("Services equipment card photos", () => {
  it.each(["/services/", "/equipment-rental/"])(
    "shows the four verified photos on %s",
    (path) => {
      const $ = load(renderToStaticMarkup(createElement(Site, { path })));
      for (const [name] of cardPhotos) {
        const card = $(".equipment-card").filter(
          (_, element) => $(element).find("h3").text().trim() === name,
        );
        expect(card, `${path}: ${name}`).toHaveLength(1);
        const image = card.find(".image-box img");
        const entry = equipment.find((row) => row.name === name)!;
        const approved = equipmentGalleryForPath(entry.path).images;
        expect(approved.length, name).toBeGreaterThan(0);
        expect(image.attr("src"), name).toBe(approved[0].src);
        expect(image.attr("srcset"), name).toContain(approved[0].thumbnail);
        expect(image.attr("alt"), name).toBe(approved[0].alt);
        expect(card.find("dialog [data-carousel-slide]").length, name).toBe(
          approved.length,
        );
        for (const source of [
          image.attr("src"),
          image.attr("srcset")?.split(" ")[0],
        ]) {
          expect(existsSync(`public${source}`), source).toBe(true);
        }
      }
    },
  );
});
