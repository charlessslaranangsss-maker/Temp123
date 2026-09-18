import fs from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { LocationImageCarousel } from "../src/LocationImageCarousel";
import { resolveLocationGallery } from "../src/locationCarouselImages";

type InventoryRow = {
  kind: "page" | "full-map" | "compact-map";
  url: string;
  exactTitle: string;
};

const rows = JSON.parse(
  fs.readFileSync(
    "audit/image-update-qa-handoff-2026-09-16/acceptance.json",
    "utf8",
  ),
).rows as InventoryRow[];

describe("service-area gallery context banners", () => {
  it("removes every review-style banner while preserving labelled groups and captions", () => {
    expect(rows).toHaveLength(648);
    const affected = rows.filter(
      (row) => resolveLocationGallery(row.exactTitle).context,
    );
    expect(affected.filter((row) => row.kind === "page")).toHaveLength(477);
    expect(affected.filter((row) => row.kind === "full-map")).toHaveLength(40);
    expect(affected.filter((row) => row.kind === "compact-map")).toHaveLength(
      40,
    );

    for (const row of rows) {
      const gallery = resolveLocationGallery(row.exactTitle);
      const $ = load(
        renderToStaticMarkup(
          createElement(LocationImageCarousel, {
            headline: row.exactTitle,
            inert: row.kind !== "page",
          }),
        ),
      );
      expect($(".location-gallery-context"), row.url).toHaveLength(0);
      expect($.text(), row.url).not.toMatch(
        /not photographs of a deployment|first gallery is an ADA-labelled catalogue reference|photos show the actual cooking and preparation interiors/i,
      );
      if (gallery.context && gallery.images.length) {
        expect($("[data-gallery-group]"), row.url).toHaveLength(
          gallery.groups.length,
        );
        expect($(".location-gallery-option-title"), row.url).toHaveLength(
          gallery.groups.length,
        );
        expect($("[data-carousel-caption]"), row.url).toHaveLength(
          gallery.groups.length,
        );
      }
    }
  });
});
