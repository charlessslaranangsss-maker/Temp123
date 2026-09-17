/** View describes the equipment space, not the surrounding building.
 * External sinks and trailers inside warehouses remain exterior views.
 */
export function galleryViewRank(view: string): number {
  switch (view) {
    case "interior":
      return 0;
    case "detail":
      return 1;
    case "exterior":
      return 2;
    case "plan":
    case "diagram":
      return 3;
    default:
      throw new Error("Unreviewed gallery view: " + view);
  }
}

/** Pure stable ordering; does not add, remove, mutate or relabel images. */
export function orderGalleryImages<
  T extends { view: string; sortOrder?: number },
>(images: readonly T[]): T[] {
  return images
    .map((image, index) => ({ image, index }))
    .sort(
      (a, b) =>
        galleryViewRank(a.image.view) - galleryViewRank(b.image.view) ||
        (a.image.sortOrder ?? a.index) - (b.image.sortOrder ?? b.index) ||
        a.index - b.index,
    )
    .map(({ image }) => image);
}
