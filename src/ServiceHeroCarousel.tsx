import type { ServiceHeroImage } from "./serviceHeroImages";
import { orderGalleryImages } from "./galleryImageOrder";
import { useId } from "react";

type ServiceHeroCarouselProps = {
  images: readonly ServiceHeroImage[];
  label: string;
  caption?: string;
  lightboxLabel?: string;
  deferLoading?: boolean;
};

const viewLabels: Record<ServiceHeroImage["view"], string> = {
  interior: "Interior",
  detail: "Interior detail",
  exterior: "Exterior",
  plan: "Floor plan",
};

export function ServiceHeroCarousel({
  images: suppliedImages,
  label,
  caption,
  lightboxLabel,
  deferLoading = false,
}: ServiceHeroCarouselProps) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  // Slides, thumbnails and lightbox indices share this enforced sequence.
  const images = orderGalleryImages(suppliedImages);
  if (images.length === 0) return null;

  const carouselId = `service-carousel-${images[0].id.replace(/[^a-z0-9_-]/gi, "-")}-${instanceId}`;
  const hasMultipleImages = images.length > 1;

  return (
    <figure
      className="service-hero-carousel"
      data-service-carousel
      data-carousel-autoplay="true"
      data-carousel-interval="5500"
      data-carousel-lightbox-label={lightboxLabel}
      aria-label={`${label} images`}
      aria-roledescription="carousel"
      tabIndex={hasMultipleImages ? 0 : undefined}
    >
      <div className="service-carousel-viewport" id={carouselId}>
        {images.map((image, index) => (
          <div
            className="service-carousel-slide"
            data-carousel-slide
            data-image-review-id={image.reviewId}
            data-image-family={image.family}
            data-image-model={image.model}
            data-image-hash={image.sha256}
            data-image-view={image.view}
            data-active={index === 0 ? "true" : "false"}
            aria-hidden={index === 0 ? undefined : "true"}
            key={image.id}
          >
            <button
              type="button"
              className="service-carousel-zoom"
              data-carousel-zoom
              aria-label={`View full image: ${image.alt}`}
              aria-haspopup="dialog"
            >
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes={image.sizes}
                width={image.width}
                height={image.height}
                alt={index === 0 ? image.alt : ""}
                data-carousel-alt={image.alt}
                data-carousel-full-src={image.fullSrc || image.src}
                loading={index === 0 && !deferLoading ? "eager" : "lazy"}
                fetchPriority={index === 0 && !deferLoading ? "high" : "low"}
                decoding="async"
              />
              <span className="service-carousel-zoom-hint" aria-hidden="true">
                View full image
              </span>
            </button>
          </div>
        ))}
        <div className="service-carousel-overlay" aria-hidden="true">
          <span data-carousel-view>{viewLabels[images[0].view]}</span>
          <span>
            <b data-carousel-position-overlay>1</b> / {images.length}
          </span>
        </div>
        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="service-carousel-arrow service-carousel-arrow--previous"
              data-carousel-previous
              aria-controls={carouselId}
              aria-label={`Previous ${label} image`}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="service-carousel-arrow service-carousel-arrow--next"
              data-carousel-next
              aria-controls={carouselId}
              aria-label={`Next ${label} image`}
            >
              <span aria-hidden="true">→</span>
            </button>
          </>
        )}
      </div>
      {hasMultipleImages && (
        <div className="service-carousel-controls">
          <div>
            <strong>Explore the equipment</strong>
            <small data-carousel-behavior>
              Auto-advances. Choosing an image pauses the slideshow.
            </small>
          </div>
          <div className="service-carousel-actions">
            <p
              className="service-carousel-status"
              aria-live="off"
              aria-atomic="true"
            >
              <span data-carousel-position>1</span> of {images.length}
            </p>
            <button
              type="button"
              className="service-carousel-toggle"
              data-carousel-toggle
              aria-label={`Pause ${label} slideshow`}
            >
              Pause
            </button>
          </div>
        </div>
      )}
      {hasMultipleImages && (
        <div
          className="service-carousel-thumbnails"
          aria-label="Choose an image"
        >
          {images.map((image, index) => (
            <button
              type="button"
              data-carousel-select={index}
              aria-label={`Show ${image.alt}`}
              aria-pressed={index === 0 ? "true" : "false"}
              data-carousel-view={image.view}
              data-carousel-view-label={viewLabels[image.view]}
              key={image.id}
            >
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes="88px"
                width={image.width}
                height={image.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span aria-hidden="true">{viewLabels[image.view]}</span>
            </button>
          ))}
        </div>
      )}
      {caption && <figcaption data-carousel-caption>{caption}</figcaption>}
      <script src="/service-hero-carousel.js" defer />
    </figure>
  );
}
