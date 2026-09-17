import type { resolveLocationGallery } from "../src/locationCarouselImages";
import { referenceCaptionForModel } from "../src/equipmentPhotoPolicy";

/** Flat assignedFiles is a page inventory, not a claim that it is one carousel. */
export function describeGalleryAudit(
  gallery: ReturnType<typeof resolveLocationGallery>,
  photographyApplicable = true,
) {
  const imageGroups = photographyApplicable
    ? gallery.groups.map((group) => ({
        exactTitle: group.headline,
        family: group.family,
        model: group.modelId,
        assignedFiles: group.images.map((image) => image.fullSrc),
        reviewIds: group.images.map((image) => image.reviewId),
        imageAlts: group.images.map((image) => image.alt),
        interiorCount: group.images.filter((image) => image.view === "interior")
          .length,
        exteriorCount: group.images.filter((image) => image.view === "exterior")
          .length,
        caption: referenceCaptionForModel(group.modelId),
      }))
    : [];
  const presentation = !photographyApplicable
    ? "not-applicable"
    : !imageGroups.length
      ? "pending"
      : gallery.context
        ? "separate-options"
        : "single-model";
  const correctionsMade =
    presentation === "not-applicable"
      ? "Restored original navigation layout; no photo section is intended or missing."
      : presentation === "pending"
        ? "Retained the truthful pending state; no unrelated equipment substitution."
        : presentation === "separate-options"
          ? "Intentional separately labelled equipment options for the broad title: " +
            imageGroups
              .map(
                (group) =>
                  group.exactTitle +
                  " [" +
                  group.family +
                  "; " +
                  group.model +
                  "]",
              )
              .join("; ") +
            ". Each product has its own isolated carousel and full-image viewer; no product types are mixed within a carousel."
          : "Assigned approved title-matched imagery to one model/reference set with shared carousel and full-image controls.";
  return {
    presentation,
    groupCount: imageGroups.length,
    imageGroups,
    correctionsMade,
  };
}
