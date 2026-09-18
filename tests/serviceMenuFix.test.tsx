import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { Site } from "../src/Site";
import { serviceCategories, serviceOptions } from "../src/serviceMenu";

describe("Inventory menu family and laundry option corrections", () => {
  it("lists the four restroom models under Restroom and leaves combinations separate", () => {
    const restroom = serviceCategories.find(({ name }) => name === "Restroom");
    const combination = serviceCategories.find(
      ({ name }) => name === "Shower and Restroom Combination Trailers",
    );

    expect(restroom?.links.map(({ href }) => href)).toEqual([
      "/services/restroom-trailers/12ft/",
      "/services/restroom-trailers/14ft/",
      "/services/restroom-trailers/20ft/",
      "/services/restroom-trailers/30ft/",
    ]);
    expect(combination?.links).toHaveLength(5);
    expect(
      combination?.links.every(({ href }) => href.includes("combination")),
    ).toBe(true);
  });

  it("lists both requested laundry options without creating new indexed routes", () => {
    const laundry = serviceCategories.find(({ name }) => name === "Laundry");
    expect(laundry?.links.map(({ name }) => name)).toEqual([
      "20ft Laundry Container",
      "24ft Mobile Laundry Trailer",
      "26ft-27ft Laundry Trailer (8 Washer/Dryer)",
      "30ft Mobile Laundry Trailer",
    ]);
    expect(
      serviceOptions.some(({ href }) =>
        href.includes("#20ft-laundry-container"),
      ),
    ).toBe(false);
    expect(
      serviceOptions.some(({ href }) =>
        href.includes("#26ft-27ft-laundry-trailer"),
      ),
    ).toBe(false);
  });

  it("renders anchored laundry cards and both reviewed galleries on the existing hub", () => {
    const $ = load(
      renderToStaticMarkup(
        createElement(Site, { path: "/equipment-rental/laundry-trailers/" }),
      ),
    );

    expect($("a[href$='#20ft-laundry-container']")).toHaveLength(3);
    expect($("a[href$='#26ft-27ft-laundry-trailer']")).toHaveLength(3);
    expect($("#20ft-laundry-container [data-carousel-slide]")).toHaveLength(3);
    expect($("#26ft-27ft-laundry-trailer [data-carousel-slide]")).toHaveLength(
      1,
    );
    expect($("[data-verified-photo-pending]")).toHaveLength(0);
  });
});
