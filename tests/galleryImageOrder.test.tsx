import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { orderGalleryImages } from "../src/galleryImageOrder";
import { ServiceHeroCarousel } from "../src/ServiceHeroCarousel";
import type { ServiceHeroImage } from "../src/serviceHeroImages";
import { resolveLocationGallery } from "../src/locationCarouselImages";
import manifest from "../content/verified-equipment-images.json";

describe("interior-before-exterior is enforced at source and render boundary", () => {
  it("stably orders every permutation without changing identity or mutating inputs", () => {
    const records = [
      { id: "inside-1", view: "interior", sortOrder: 2 },
      { id: "inside-2", view: "interior", sortOrder: 3 },
      { id: "detail", view: "detail", sortOrder: 4 },
      { id: "outside", view: "exterior", sortOrder: 1 },
      { id: "plan", view: "plan", sortOrder: 0 },
    ];
    function permutations<T>(items: T[]): T[][] {
      if (!items.length) return [[]];
      return items.flatMap((v, i) =>
        permutations(items.filter((_, j) => i !== j)).map((t) => [v, ...t]),
      );
    }
    for (const input of permutations(records)) {
      const before = [...input];
      const result = orderGalleryImages(input);
      expect(result.map((i) => i.id)).toEqual(records.map((i) => i.id));
      expect(input).toEqual(before);
      result.forEach((i) => expect(records.includes(i)).toBe(true));
    }
  });
  it("sorts a direct unsorted renderer call and aligns thumbnails, first image and labels", () => {
    const input: ServiceHeroImage[] = ["exterior", "interior", "detail"].map(
      (view, i) => ({
        id: view,
        src: "/test/" + view + ".webp",
        srcSet: "/test/" + view + ".webp",
        sizes: "100vw",
        width: 400,
        height: 300,
        alt: "Preserved " + view + " label",
        view: view as ServiceHeroImage["view"],
        sortOrder: i + 1,
        sourceUrl: "/test/" + view + ".webp",
      }),
    );
    const $ = load(
      renderToStaticMarkup(
        <ServiceHeroCarousel
          images={input}
          label="Unchanged group"
          caption="Unchanged caption"
        />,
      ),
    );
    const slides = $("[data-carousel-slide]");
    expect(slides.toArray().map((e) => $(e).attr("data-image-view"))).toEqual([
      "interior",
      "detail",
      "exterior",
    ]);
    expect(
      $("[data-carousel-select]")
        .toArray()
        .map((e) => $(e).attr("data-carousel-view")),
    ).toEqual(["interior", "detail", "exterior"]);
    expect(slides.first().find("img").attr("alt")).toBe(
      "Preserved interior label",
    );
    expect($("[data-carousel-caption]").text()).toBe("Unchanged caption");
    expect(input[0].view).toBe("exterior");
  });
  it("stores the central manifest in actual interior-before-exterior order for every model", () => {
    for (const model of manifest.models) {
      let exterior = false;
      for (const image of manifest.images.filter(
        (i) => i.model === model.id && i.status === "approved",
      )) {
        if (image.view === "exterior") exterior = true;
        if (image.view === "interior")
          expect(exterior, model.id + ":" + image.id).toBe(false);
      }
    }
  });
  it("keeps the misleadingly named external shower sinks outside the interior group", () => {
    const g = resolveLocationGallery("20 ft Shower Trailer");
    expect(g.images.map((i) => [i.reviewId, i.view])).toEqual([
      ["21.01", "interior"],
      ["21.02", "exterior"],
      ["21.04", "exterior"],
      ["21.05", "exterior"],
      ["21.07", "exterior"],
      ["21.08", "exterior"],
    ]);
    expect(g.images[2].fullSrc).toContain(
      "private-shower-trailer-stall-interior",
    );
  });
  it("puts the actual combination interiors first; the private-shower-stall filename is an exterior", () => {
    const g = resolveLocationGallery(
      "22 ft 6-Stall Shower-Restroom Combination Trailer",
    );
    expect(g.images.map((i) => [i.reviewId, i.view])).toEqual([
      ["10.05", "interior"],
      ["10.07", "interior"],
      ["10.01", "exterior"],
      ["10.02", "exterior"],
      ["10.06", "exterior"],
    ]);
    expect(g.images[4].fullSrc).toContain("private-shower-stall");
  });
});
