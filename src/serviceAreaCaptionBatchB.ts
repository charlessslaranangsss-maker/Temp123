/** Verified, customer-facing use and detail for service-area gallery models 12–22. */
export function captionDetailBatchB(
  modelId: string,
): { benefit: string; detail: string } | undefined {
  switch (modelId) {
    case "model-12":
      return {
        benefit: "on-site cooking and meal service for project crews",
        detail:
          "Plan meal preparation and service around the pictured cooking line, counters, and service window.",
      };
    case "model-13":
      return {
        benefit: "temporary crew meal preparation at a commercial site",
        detail:
          "Use the cooking, sink, and storage areas to plan a practical kitchen workflow for your team.",
      };
    case "model-14":
      return {
        benefit: "on-site crew meals during a commercial project",
        detail:
          "These interior views show cooking equipment alongside refrigeration and washing stations.",
      };
    case "model-15":
      return {
        benefit: "bulk cooking and meal preparation for project crews",
        detail:
          "Plan kitchen work around the pictured steam kettle, commercial ovens, and washing stations.",
      };
    case "model-16":
      return {
        benefit: "bulk meal preparation for a remote crew",
        detail:
          "Plan cooking and cleanup around the pictured steam kettle, tilting skillet, and pot-washing sink.",
      };
    case "model-17":
      return {
        benefit: "crew cooking and washing in one temporary kitchen",
        detail:
          "Organize the meal workflow around the pictured cooking line, preparation area, and sink.",
      };
    case "model-18":
      return {
        benefit: "daily crew meal preparation on site",
        detail:
          "Plan cooking, cold storage, and handwashing around the kitchen areas shown in these photos.",
      };
    case "model-19":
      return {
        benefit: "temporary cold storage for a commercial operation",
        detail:
          "Plan refrigerated storage around the pictured insulated interior and cooling equipment.",
      };
    case "model-20":
      return {
        benefit: "private crew showers in a container-based setup",
        detail:
          "These interior photos show the 20 ft five-stall shower container, not a shower trailer.",
      };
    case "model-21":
      return {
        benefit: "private crew showers and external handwashing",
        detail:
          "These photos show the 20 ft five-stall trailer, separate from the 22 ft shower model.",
      };
    case "model-22":
      return {
        benefit: "temporary bunk-room accommodation for project crews",
        detail:
          "Plan crew sleeping space around the pictured bunk beds and reading lights.",
      };
    default:
      return undefined;
  }
}
