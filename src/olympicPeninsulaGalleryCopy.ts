const olympicPeninsulaHeadline =
  "Olympic Peninsula, Washington Remote Operations Man Camp Temporary Facilities Rental";

/** Review sample: one caption per verified equipment group on this exact page. */
export function olympicPeninsulaGalleryCaption(
  headline: string,
  modelId: string | null,
): string | undefined {
  if (headline !== olympicPeninsulaHeadline) return undefined;

  if (modelId === "new-office-sleeper-shower-restroom")
    return "Olympic Peninsula, Washington Commercial Base Camp Office, Sleeper, Shower & Restroom Trailer Rental or Lease. Discuss weekly rental, monthly rental, or yearly rental and lease options for a temporary site office and crew accommodations. Plan sleeping, showers, and restrooms together for your remote team. Call us now at 800-443-5212 — available 24/7.";

  if (modelId === "new-38ft-all-electric-kitchen")
    return "Olympic Peninsula, Washington Commercial Base Camp 38 ft All Electric Kitchen Rental or Lease. Discuss weekly rental, monthly rental, or yearly rental and lease options for on-site crew meal preparation. Plan your temporary kitchen around your project's electrical supply and meal-service needs. Call us now at 800-443-5212 — available 24/7.";

  if (modelId === "model-21")
    return "Olympic Peninsula, Washington Industrial Base Camp 20 ft Five Stall Shower Trailer Rental or Lease. Discuss weekly rental, monthly rental, or yearly rental and lease options for private crew showers and external handwashing sinks. These photos show the 20 ft five-stall unit, not the separate 22 ft shower trailer. Call us now at 800-443-5212 — available 24/7.";

  return undefined;
}
