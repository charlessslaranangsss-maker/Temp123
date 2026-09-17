/** Product-specific sales details for the approved service-area gallery models. */
export function captionDetailBatchC(
  modelId: string,
): { benefit: string; detail: string } | undefined {
  const details: Record<string, { benefit: string; detail: string }> = {
    "model-23": {
      benefit: "private crew lodging for temporary commercial operations",
      detail:
        "Plan a quieter room option for supervisors or visiting personnel.",
    },
    "model-24": {
      benefit: "two-room crew sleeping space at a temporary base camp",
      detail: "Keep overnight accommodation close to the worksite.",
    },
    "model-25": {
      benefit: "temporary water storage for a commercial site or base camp",
      detail:
        "Plan tank placement and refill access around your crew's daily water needs.",
    },
    "sleeper-four-room": {
      benefit: "four-room crew lodging at a temporary worksite",
      detail:
        "The pictured wheeled trailer has bunk accommodation; discuss the room layout for your crew.",
    },
    "reefer-catalog": {
      benefit: "temporary cold storage for commercial food-service operations",
      detail:
        "This catalogue image shows a 40 ft refrigerated container, not a refrigerated trailer.",
    },
    "april-20ft-refrigerated-container": {
      benefit: "20 ft container-based cold storage for a temporary facility",
      detail:
        "The approved interior photo is a shared refrigeration reference; discuss the container layout for your site.",
    },
    "april-two-stall-sleeper": {
      benefit: "two-stall crew sleeping space for temporary operations",
      detail:
        "These interior photos show the designated bunk room; discuss the sleeping arrangement for your crew.",
    },
    "client-labelled-ada-reference": {
      benefit:
        "a temporary shower and restroom option for a commercial facility",
      detail:
        "The catalogue shows a combined unit; ask our team which accessible configuration fits your site.",
    },
    "new-38ft-all-electric-kitchen": {
      benefit: "on-site crew meal preparation at a remote base camp",
      detail:
        "Plan the temporary kitchen around your electrical supply and meal-service needs.",
    },
    "new-office-sleeper-shower-restroom": {
      benefit:
        "a temporary site office and crew accommodation in one camp setup",
      detail:
        "Plan sleeping, showers, and restrooms together for your remote team.",
    },
  };

  return details[modelId];
}
