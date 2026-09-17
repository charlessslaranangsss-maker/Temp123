import { resolveLocationGallery } from "./locationCarouselImages";
import { useId } from "react";
import { ServiceHeroCarousel } from "./ServiceHeroCarousel";
import { panhandleGalleryCopy } from "./panhandleGalleryCopy";
import { serviceAreaGalleryCaption } from "./serviceAreaGalleryCopy";
import { olympicPeninsulaGalleryCaption } from "./olympicPeninsulaGalleryCopy";
import {
  photoCoverage,
  referenceCaptionForModel,
} from "./equipmentPhotoPolicy";

export function LocationImageCarousel({
  headline,
  inert = false,
}: {
  headline: string;
  inert?: boolean;
}) {
  const gallery = resolveLocationGallery(headline);
  const coverage = photoCoverage(gallery.images);
  const productId = "product-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div
      className="location-image-gallery"
      data-location-gallery
      data-gallery-title={headline}
      data-equipment-family={gallery.family}
      data-equipment-model={gallery.modelId || ""}
      data-photography-status={gallery.images.length ? "verified" : "missing"}
      data-photo-coverage={coverage.kind}
      data-gallery-presentation={
        gallery.context ? "separate-options" : "single-model"
      }
    >
      {gallery.images.length ? (
        <>
          {gallery.context && (
            <p className="location-gallery-context">
              {gallery.context === "laundry"
                ? "Two separate laundry product options: a 30 ft trailer and a 20 ft container. Each has its own labelled gallery; these images do not show one combined unit."
                : gallery.context === "kitchen-alternatives"
                  ? "These photos show the actual cooking and preparation interiors of mobile kitchen trailers offered as separate rental alternatives. They do not show a modular kitchen building; ask our team about the modular configuration for your site."
                : gallery.context === "ada-reference"
                  ? "The first gallery is an ADA-labelled catalogue reference. The second shows a standard shower-restroom combination trailer; its photos do not verify an ADA access arrangement. Confirm the required accessible layout with our team."
                : gallery.context === "sleeper-options"
                  ? "The two-stall sleeper interior and four-room sleeper trailer exterior are separate equipment references. The interior does not depict the four-room trailer. Confirm the available room layout with our team."
                : gallery.context === "shower-reference"
                  ? "These photos show a 20 ft five-stall shower trailer reference. They do not verify the separately described 22 ft ten-stall shower trailer; confirm the required layout with our team."
                : gallery.context === "man-camp"
                  ? "Multifunctional accommodation, an all-electric kitchen option and a shower-only trailer are shown as separate products. Each labelled gallery describes its own unit."
                  : "Equipment options for temporary-facility planning are shown separately below."}{" "}
              These are equipment references, not photographs of a deployment in
              this location.
            </p>
          )}
          {gallery.groups.length > 1 && (
            <div
              className="location-product-tabs"
              data-product-tabs
              role="tablist"
              aria-label="Choose equipment type"
              hidden
            >
              {gallery.groups.map((group, index) => (
                <button
                  type="button"
                  key={group.modelId}
                  id={productId + "-tab-" + index}
                  role="tab"
                  data-product-tab={index}
                  aria-selected={index === 0}
                  aria-controls={productId + "-panel-" + index}
                  tabIndex={index === 0 ? 0 : -1}
                >
                  <span>{group.headline}</span>
                  <small>
                    {group.images.length}{" "}
                    {group.images.length === 1 ? "photo" : "photos"}
                  </small>
                </button>
              ))}
            </div>
          )}
          <div
            className={
              gallery.context
                ? "location-gallery-options"
                : "location-gallery-single"
            }
          >
            {gallery.groups.map((group, index) => (
              <section
                key={group.modelId}
                id={productId + "-panel-" + index}
                data-gallery-group
                data-group-title={group.headline}
                data-group-family={group.family}
                data-group-model={group.modelId}
                className="location-gallery-option"
              >
                {gallery.context && (
                  <h3 className="location-gallery-option-title">
                    {group.headline}
                  </h3>
                )}
                <ServiceHeroCarousel
                  images={group.images.map((image) => {
                    const copy = panhandleGalleryCopy(headline, group.modelId);
                    return copy
                      ? { ...image, alt: copy.altPrefix + image.alt }
                      : image;
                  })}
                  deferLoading={inert || index > 0}
                  label={group.headline + " photography"}
                  lightboxLabel={group.headline}
                  caption={
                    panhandleGalleryCopy(headline, group.modelId)?.caption ??
                    olympicPeninsulaGalleryCaption(headline, group.modelId) ??
                    serviceAreaGalleryCaption(headline, group.headline, group.modelId) ??
                    referenceCaptionForModel(group.modelId)
                  }
                />
              </section>
            ))}
          </div>
          {gallery.groups.length > 1 && (
            <script src="/location-product-tabs.js" defer />
          )}
        </>
      ) : (
        <div
          className="verified-photo-pending"
          data-verified-photo-pending
          role="note"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
            <rect
              x="5"
              y="9"
              width="38"
              height="30"
              rx="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="16"
              cy="19"
              r="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="m7 34 11-9 8 6 8-8 8 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <strong>Verified photography coming soon</strong>
          <p>
            Matching equipment images are being verified. We will not substitute
            a different unit or configuration.
          </p>
        </div>
      )}
    </div>
  );
}
