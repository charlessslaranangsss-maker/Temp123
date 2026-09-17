import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import {
  alignedLocationIntro,
  alignedPageIntro,
} from "../src/alignedIntroductions";
import { resolveLocationGallery } from "../src/locationCarouselImages";
import { LocationImageCarousel } from "../src/LocationImageCarousel";
import { stateGuides } from "../src/stateGuides";
import { stateRentalHeadline } from "../src/rentalHeadlines";
import { regionPages } from "../src/regionGuides";
import { StateGuideCards } from "../src/StateGuideCards";
import { ServiceDetail } from "../src/ServiceDetail";
import { imagesForServicePath } from "../src/serviceHeroImages";
import { catalog } from "../src/EquipmentCatalog";
import { catalogPhotoCoverage } from "../src/catalogImageCoverage";
import detail from "../content/service-details.json" with { type: "json" };
import { renderSourceContent } from "../scripts/source-content";
describe("H1, introduction and equipment consistency", () => {
  for (const state of Object.keys(stateGuides))
    it("matches the state topic for " + state, () => {
      const h1 = stateRentalHeadline(state),
        intro = alignedLocationIntro(h1, state),
        gallery = resolveLocationGallery(h1);
      expect(intro).toContain(state);
      expect(intro.length).toBeGreaterThan(100);
      if (gallery.family === "mobile-kitchen")
        expect(intro).not.toMatch(/shower|restroom|sleep|laundry/i);
      if (gallery.family === "laundry-unspecified") {
        expect(intro).toContain("30 ft laundry trailer");
        expect(intro).toContain("20 ft laundry container");
        expect(intro).not.toMatch(/kitchen|shower|sleeper/i);
      }
      if (gallery.context === "man-camp")
        expect(intro).toContain("38 ft all-electric kitchen");
    });
  it("uses the same exact state lead for both map collections", () => {
    const $ = load(renderToStaticMarkup(createElement(StateGuideCards)));
    for (const state of Object.keys(stateGuides))
      expect(
        $("[data-state-guide]")
          .filter((_, e) => $(e).attr("data-state-guide") === state)
          .find("[data-guide-intro]")
          .text(),
      ).toBe(alignedLocationIntro(stateRentalHeadline(state), state));
  });
  it("renders every exact service with one H1 and its own lead", () => {
    for (const [path, item] of Object.entries(detail)) {
      const $ = load(
        renderToStaticMarkup(
          createElement(ServiceDetail, { path: path as keyof typeof detail }),
        ),
      );
      expect($("h1").length, path).toBe(1);
      expect($("[data-h1-intro]").text(), path).toBe(
        alignedPageIntro(path, item.name, item.intro),
      );
      const approved = imagesForServicePath(path) || [];
      expect($("[data-carousel-slide]").length, path).toBe(approved.length);
      expect(new Set(approved.map((i) => i.fullSrc)).size, path).toBe(
        approved.length,
      );
    }
  });
  it("audits every catalogue card and forbids the known false substitutes", () => {
    expect(catalog.items).toHaveLength(25);
    for (const item of catalog.items) {
      const selection = catalogPhotoCoverage(item);
      expect(selection.status, item.id).not.toBe("unreviewed");
      for (const im of selection.images) {
        expect(fs.existsSync("public" + im.src), im.src).toBe(true);
        expect(fs.existsSync("public" + im.fullSrc), im.fullSrc).toBe(true);
      }
      if (
        [
          "restroom-trailers",
          "temporary-shower-trailers",
          "shower-trailer",
          "stair-rentals",
          "dining-structure-rental",
        ].includes(item.id)
      )
        expect(selection.images).toHaveLength(0);
      if (item.id === "laundry-trailers")
        expect(selection.images[0].reviewId).toBe("08.01");
      if (item.id === "bunkhouse-trailers")
        expect(selection.images.map((i) => i.reviewId)).toEqual([
          "24.01",
          "24.08",
        ]);
    }
  });
  it("provides progressive-enhancement product selectors with unique controls", () => {
    const $ = load(
      renderToStaticMarkup(
        createElement(LocationImageCarousel, {
          headline:
            "Workforce Camp Laundry Temporary Facilities Long-Term Rental",
        }),
      ),
    );
    expect($("[role=tab]")).toHaveLength(2);
    expect($("[data-gallery-group]")).toHaveLength(2);
    expect($("[data-product-tabs]").attr("hidden")).toBeDefined();
    $("[role=tab]").each((_, el) => {
      expect($("#" + $(el).attr("aria-controls"))).toHaveLength(1);
    });
    const first = $("[data-gallery-group]").eq(0),
      second = $("[data-gallery-group]").eq(1);
    expect(first.find("[data-carousel-slide]")).toHaveLength(1);
    expect(second.find("[data-carousel-slide]")).toHaveLength(3);
  });
  it("retains source paragraphs when no exact old lead is supplied", () => {
    const html =
      "<h2>Body details</h2><p>This is a substantive body paragraph that should not be removed because a missing lead was never present.</p>";
    const options = {
      origin: "https://temporary123.com",
      routes: new Set<string>(),
      redirects: new Map<string, string>(),
      media: {},
      unresolved: new Set<string>(),
      removeLeadParagraph: true,
    };
    expect(renderSourceContent(html, options)).toContain(
      "should not be removed",
    );
    expect(
      renderSourceContent(html, {
        ...options,
        replacedLead:
          "This is a substantive body paragraph that should not be removed because a missing lead was never present.",
      }),
    ).not.toContain("should not be removed");
  });
  it("keeps all 246 directories and source archive files intact", () => {
    expect(regionPages).toHaveLength(246);
    const before = JSON.parse(
      fs.readFileSync(
        "work/qa/all-page-alignment-20260916/before.json",
        "utf8",
      ),
    );
    for (const [file, hash] of Object.entries(before.hashes))
      if (file.replaceAll("\\", "/").startsWith("content/pages/"))
        expect(
          createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
          file,
        ).toBe(hash);
  });
});
