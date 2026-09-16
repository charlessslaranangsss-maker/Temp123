import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ServiceHeroCarousel } from "../src/ServiceHeroCarousel";
import type { ServiceHeroImage } from "../src/serviceHeroImages";

const images: ServiceHeroImage[] = [
  {
    id: "test-interior",
    src: "/test/interior.webp",
    srcSet: "/test/interior-480.webp 480w, /test/interior.webp 960w",
    sizes: "100vw",
    width: 960,
    height: 640,
    alt: "Interior of the exact test trailer",
    view: "interior",
    sortOrder: 1,
    sourceUrl: "https://drive.google.com/file/d/test-interior/view",
  },
  {
    id: "test-exterior",
    src: "/test/exterior.webp",
    srcSet: "/test/exterior-480.webp 480w, /test/exterior.webp 960w",
    sizes: "100vw",
    width: 960,
    height: 640,
    alt: "Exterior of the exact test trailer",
    view: "exterior",
    sortOrder: 2,
    sourceUrl: "https://drive.google.com/file/d/test-exterior/view",
  },
];

describe("ServiceHeroCarousel", () => {
  it("server-renders the first meaningful image and defers later images", () => {
    const html = renderToStaticMarkup(
      <ServiceHeroCarousel
        images={images}
        label="Exact test trailer"
        caption="Exact test trailer views"
      />,
    );

    expect(html).toContain('alt="Interior of the exact test trailer"');
    expect(html).toContain('loading="eager"');
    expect(html).toContain(
      'data-carousel-alt="Exterior of the exact test trailer"',
    );
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('aria-label="Previous Exact test trailer image"');
    expect(html).toContain('aria-label="Next Exact test trailer image"');
    expect(html).toContain('aria-live="off"');
    expect(html).toContain("data-carousel-toggle");
    expect(html).toContain("data-carousel-zoom");
    expect(html).toContain("View full image:");
    expect(html).toContain('aria-label="Pause Exact test trailer slideshow"');
  });

  it("does not render navigation controls for one image", () => {
    const html = renderToStaticMarkup(
      <ServiceHeroCarousel images={images.slice(0, 1)} label="Test trailer" />,
    );

    expect(html).not.toContain("data-carousel-next");
    expect(html).toContain('src="/service-hero-carousel.js"');
  });
});
