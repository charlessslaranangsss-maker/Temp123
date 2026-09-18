import { describe, expect, it } from "vitest";
import {
  imagesForServicePath,
  orderedServiceHeroImages,
  servicePhotoCaption,
  serviceHeroImages,
  type ServiceHeroImage,
} from "../src/serviceHeroImages";
import { serviceOptions } from "../src/serviceMenu";

const image = (
  id: string,
  view: ServiceHeroImage["view"],
  sortOrder: number,
): ServiceHeroImage => ({
  id,
  view,
  src: `/test/${id}.webp`,
  srcSet: `/test/${id}-480.webp 480w, /test/${id}.webp 960w`,
  sizes: "100vw",
  width: 960,
  height: 640,
  alt: `${view} view of the exact test trailer`,
  sortOrder,
  sourceUrl: `https://drive.google.com/file/d/${id}/view`,
});

describe("service hero image ordering", () => {
  it("keeps interior details ahead of exterior views", () => {
    expect(
      orderedServiceHeroImages([
        image("detail", "detail", 3),
        image("outside", "exterior", 2),
        image("inside", "interior", 1),
      ]).map(({ id }) => id),
    ).toEqual(["inside", "detail", "outside"]);
  });

  it("puts every interior and interior detail before exterior views", () => {
    Object.values(serviceHeroImages).forEach((images) => {
      const ordered = orderedServiceHeroImages(images);
      if (ordered.some(({ view }) => view === "interior")) {
        expect(ordered[0].view).toBe("interior");
      }
      const firstExterior = ordered.findIndex(
        ({ view }) => view === "exterior",
      );
      if (firstExterior < 0) return;
      expect(
        ordered
          .slice(firstExterior + 1)
          .some(({ view }) => view === "interior" || view === "detail"),
      ).toBe(false);
    });
  });

  it("excludes inventory rows flagged as duplicates or ambiguous backgrounds", () => {
    const sourceUrls = Object.values(serviceHeroImages)
      .flat()
      .map(({ sourceUrl }) => sourceUrl);
    [
      "1OOpQfZagqwIQw_Z53N7E-8ZBj1KpM6MO",
      "1bhqDy0kXvQztwpT6fNnEz4Qe4BEdXIuD",
      "1nfL9Kylpa1xaGNBE_3OvKVx40HMRGw_l",
      "1a5B7sxon2jh773an_bR2bpfCJLsq-zTu",
      "1D_vOb7GHVVuLMJXH5_NXXxcRLNCM9XLa",
      "1iekNo18xWjysKX_3vsqTCFqBqg6kjRWW",
    ].forEach((fileId) => {
      expect(sourceUrls.some((url) => url.includes(fileId))).toBe(false);
    });
  });

  it("uses setting-specific alt text only for visually verified commercial settings", () => {
    const refrigeratedFleet = serviceHeroImages[
      "/20ft-refrigeration-trailers/"
    ].find(({ reviewId }) => reviewId === "19.04");
    const warehouseViews = serviceHeroImages[
      "/services/shower-restroom-combination-trailers/22ft-6-stall/"
    ].filter(({ sourceUrl }) =>
      ["1tscOQ", "1tWbp0"].some((id) => sourceUrl.includes(id)),
    );

    expect(refrigeratedFleet?.alt).toContain("commercial building");
    expect(warehouseViews).toHaveLength(2);
    warehouseViews.forEach(({ alt }) =>
      expect(alt).toContain("commercial warehouse"),
    );
  });

  it("keeps each sleeper variant matched to its page identity", () => {
    const shared =
      serviceHeroImages["/services/mobile-sleeper-trailers/20ft-shared/"];
    const contractor =
      serviceHeroImages["/services/mobile-sleeper-trailers/20ft-contractor/"];
    const vip =
      serviceHeroImages["/services/mobile-sleeper-trailers/20ft-vip/"];
    const containerized =
      serviceHeroImages[
        "/remote-containerized-military-berthing-solution-for-rent/"
      ];

    expect(shared.length).toBeGreaterThan(1);
    shared.forEach(({ alt }) =>
      expect(alt.toLowerCase()).toMatch(/sleeper|bunk-bed/),
    );
    contractor.forEach(({ alt }) =>
      expect(alt.toLowerCase()).toContain("contractor"),
    );
    expect(vip).toHaveLength(1);
    expect(vip[0].alt.toLowerCase()).toMatch(/vip|private/);
    expect(vip[0].alt.toLowerCase()).not.toMatch(/shared|contractor|bunk/);
    containerized.forEach(({ alt }) =>
      expect(alt.toLowerCase()).toMatch(/containerized|berthing|modular/),
    );
  });

  it("provides reviewed imagery for every published service-model route", () => {
    const routes = [...new Set(serviceOptions.map(({ href }) => href))];
    expect(routes).toHaveLength(24);
    routes.forEach((path) => {
      expect(imagesForServicePath(path)?.length, path).toBeGreaterThan(0);
    });
  });

  it("labels non-exact reference galleries with their material difference", () => {
    expect(
      imagesForServicePath(
        "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
      )?.length,
    ).toBeGreaterThan(0);
    expect(
      servicePhotoCaption(
        "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
      ),
    ).toContain("separate 12 ft trailer");
    expect(
      servicePhotoCaption("/services/mobile-kitchen-trailers/26ft-bulk/"),
    ).toContain("40 ft");
    expect(
      servicePhotoCaption("/services/shower-trailers/22ft-10-stall/"),
    ).toContain("does not depict");
    expect(
      servicePhotoCaption("/services/handwashing-trailers/hands-free/"),
    ).toContain("do not establish hands-free controls");
  });
});
