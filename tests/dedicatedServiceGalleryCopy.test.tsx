import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import details from "../content/service-details.json" with { type: "json" };
import { Site } from "../src/Site";

const upgradedRoutes = [
  "/services/mobile-kitchen-trailers/24ft/",
  "/services/mobile-kitchen-trailers/28ft/",
  "/services/mobile-kitchen-trailers/38ft/",
  "/services/mobile-kitchen-trailers/40ft/",
  "/services/mobile-kitchen-trailers/40ft-combination/",
  "/services/mobile-kitchen-trailers/40ft-bulk-combination/",
  "/services/dishwashing-trailers/38ft-conveyor/",
  "/equipment-rental/refrigerated-containers/",
  "/remote-containerized-military-berthing-solution-for-rent/",
  "/equipment-rental/handwashing-stations/",
  "/services/shower-restroom-combination-trailers/13ft-3-stall/",
  "/services/shower-restroom-combination-trailers/22ft-6-stall/",
  "/services/shower-containers/20ft-5-stall/",
] as const;

describe("dedicated service gallery captions", () => {
  it.each(upgradedRoutes)("replaces the generic caption on %s", (path) => {
    const $ = load(renderToStaticMarkup(createElement(Site, { path })));
    const caption = $(".service-hero-carousel figcaption").text();

    expect(caption).toMatch(/commercial project and base camp/i);
    expect(caption).toMatch(/rental or lease/i);
    expect(caption).toMatch(/weekly rental/i);
    expect(caption).toMatch(/monthly rental/i);
    expect(caption).toMatch(/yearly rental and lease/i);
    expect(caption).toMatch(
      /call us now at \+1 \(800\) 443-5212, available 24\/7/i,
    );
    expect(caption).not.toMatch(/reviewed equipment reference images/i);
    expect(caption).not.toMatch(/photos do not establish availability/i);
  });

  it("leaves no generic reviewed-photo caption on a dedicated service route", () => {
    for (const path of Object.keys(details)) {
      const $ = load(renderToStaticMarkup(createElement(Site, { path })));
      expect($("main").text(), path).not.toMatch(
        /reviewed equipment reference images|photos do not establish availability or a deployment in this location/i,
      );
    }
  });
});
