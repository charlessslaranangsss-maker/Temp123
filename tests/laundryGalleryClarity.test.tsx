import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { resolveLocationGallery } from "../src/locationCarouselImages";
import { LocationImageCarousel } from "../src/LocationImageCarousel";
import { describeGalleryAudit } from "../scripts/gallery-audit-description";
import { referenceCaptionForModel } from "../src/equipmentPhotoPolicy";
import { panhandleGalleryCopy } from "../src/panhandleGalleryCopy";
import { olympicPeninsulaGalleryCaption } from "../src/olympicPeninsulaGalleryCopy";
import { serviceAreaGalleryCaption } from "../src/serviceAreaGalleryCopy";

const baseline = JSON.parse(
  fs.readFileSync(
    "audit/image-placement-revert-2026-09-16/acceptance.json",
    "utf8",
  ),
);
const flagged = baseline.rows.filter(
  (row: any) => row.family === "laundry-unspecified",
);
describe("broad laundry galleries and audit language", () => {
  it("enumerates all 50 flagged rows: 36 pages plus seven states in two maps", () => {
    expect(flagged).toHaveLength(50);
    expect(flagged.filter((row: any) => row.kind === "page")).toHaveLength(36);
    expect(flagged.filter((row: any) => row.kind === "full-map")).toHaveLength(
      7,
    );
    expect(
      flagged.filter((row: any) => row.kind === "compact-map"),
    ).toHaveLength(7);
  });
  it.each(
    flagged.map((row: any) => [row.kind + ": " + row.url, row]) as [
      string,
      any,
    ][],
  )("keeps two explicit product groups for %s", (_, row: any) => {
    const gallery = resolveLocationGallery(row.exactTitle);
    const report = describeGalleryAudit(gallery);
    expect(gallery.images.map((image) => image.fullSrc)).toEqual(
      row.assignedFiles,
    );
    expect(report.presentation).toBe("separate-options");
    expect(report.groupCount).toBe(2);
    expect(
      report.imageGroups.map((group) => [
        group.exactTitle,
        group.family,
        group.model,
        group.reviewIds,
      ]),
    ).toEqual([
      ["30 ft Laundry Trailer", "laundry-trailer", "model-08", ["08.01"]],
      [
        "20 ft Laundry Container",
        "laundry-container",
        "model-06",
        ["06.01", "06.02", "06.03"],
      ],
    ]);
    expect(report.correctionsMade).toContain("Intentional separately labelled");
    expect(report.correctionsMade).toContain("30 ft Laundry Trailer");
    expect(report.correctionsMade).toContain("20 ft Laundry Container");
    expect(report.correctionsMade).not.toContain("single verified");
    const $ = load(
      renderToStaticMarkup(<LocationImageCarousel headline={row.exactTitle} />),
    );
    expect($("[data-gallery-title]").attr("data-gallery-title")).toBe(
      row.exactTitle,
    );
    expect($("h1")).toHaveLength(0);
    expect($(".location-gallery-context")).toHaveLength(0);
    const groups = $("[data-gallery-group]");
    expect(groups).toHaveLength(2);
    gallery.groups.forEach((group, index) => {
      const el = groups.eq(index),
        carousel = el.find("[data-service-carousel]");
      expect(el.find("h3").text()).toBe(group.headline);
      expect(carousel.attr("data-carousel-lightbox-label")).toBe(
        group.headline,
      );
      expect(el.find("[data-carousel-caption]").text()).toBe(
        panhandleGalleryCopy(row.exactTitle, group.modelId)?.caption ??
          olympicPeninsulaGalleryCaption(row.exactTitle, group.modelId) ??
          serviceAreaGalleryCaption(
            row.exactTitle,
            group.headline,
            group.modelId,
          ) ??
          referenceCaptionForModel(group.modelId),
      );
      const token = index === 0 ? "trailer" : "container";
      group.images.forEach((image) =>
        expect(image.alt.toLowerCase()).toContain(token),
      );
      expect(new Set(group.images.map((image) => image.model))).toEqual(
        new Set([group.modelId]),
      );
      expect(new Set(group.images.map((image) => image.sha256)).size).toBe(
        group.images.length,
      );
    });
  });
  it.each(["30 ft Laundry Trailer", "20 ft Laundry Container"])(
    "keeps the exact product title single-model: %s",
    (title) => {
      const report = describeGalleryAudit(resolveLocationGallery(title));
      expect(report.presentation).toBe("single-model");
      expect(report.groupCount).toBe(1);
    },
  );
  it("does not report deliberate navigation layouts as missing photography", () => {
    const report = describeGalleryAudit(
      resolveLocationGallery("USA Temporary Facilities Rental Service Areas"),
      false,
    );
    expect(report.presentation).toBe("not-applicable");
    expect(report.imageGroups).toHaveLength(0);
  });
});
