import policy from "../content/equipment-photo-policy.json" with { type: "json" };
import additions from "../content/equipment-photo-additions.json" with { type: "json" };

export const equipmentPhotoPolicy = policy;

export const genericEquipmentReferenceCaption =
  "Reviewed equipment reference images. Photos do not establish availability or a deployment in this location.";

/** A missing second angle is an optional improvement, not a no-photo condition. */
export function photoCoverage(images: readonly { view: string }[]) {
  const interiorCount = images.filter(
    (i) => i.view === "interior" || i.view === "detail",
  ).length;
  const exteriorCount = images.filter((i) => i.view === "exterior").length;
  const usableCount = interiorCount + exteriorCount;
  const usable = usableCount >= policy.minimumUsablePhotos;
  return {
    usable,
    usableCount,
    interiorCount,
    exteriorCount,
    kind: !usable
      ? "missing"
      : interiorCount && exteriorCount
        ? "interior-and-exterior"
        : interiorCount
          ? "interior-only"
          : "exterior-only",
  };
}

export function referenceCaptionForModel(modelId: string | null) {
  const added = additions.models.find((model) => model.id === modelId);
  if (added) return added.caption;
  const named = policy.delegatedSelection.additionalApprovals.find(
    (approval) => approval.modelId === modelId,
  );
  if (named) return named.caption;
  if (modelId === "model-06")
    return "20 ft laundry container option: interior references from the supplied container collection, not a laundry trailer. No exterior is pictured. Confirm the available unit and layout with your quote.";
  if (modelId === "model-21")
    return "20 ft, five-stall shower-trailer reference set with external handwashing sinks. These are not photographs of the separate 22 ft, ten-stall option. Confirm the available unit with your quote.";
  if (modelId === "april-20ft-refrigerated-container")
    return "Interior reference for the 20 ft refrigerated container option. The same interior reference is used for the 20 ft trailer; no container exterior is pictured.";
  if (modelId === "model-19")
    return "Reference photos for the 20 ft refrigerated trailer option. Exterior and fleet reference views do not establish one physical unit; confirm the supplied unit with your quote.";
  if (modelId === "april-two-stall-sleeper")
    return "Interior reference photos for the two-stall sleeper option. Overall length and exterior configuration are not established by these interior views.";
  return genericEquipmentReferenceCaption;
}
