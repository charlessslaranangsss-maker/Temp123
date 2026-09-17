/** Verified product-specific copy for the dishwashing, handwashing, laundry,
 * and shower/restroom gallery models. The caller supplies the page's location,
 * use case, and actual equipment headline. */
const details: Record<string, { benefit: string; detail: string }> = {
  "model-01": {
    benefit: "temporary dishwashing at a commercial meal site",
    detail: "Plan the wash area around your kitchen's dish flow and utility connections.",
  },
  "model-02": {
    benefit: "conveyor dishwashing for a temporary food-service operation",
    detail: "Ask our team how the 30 ft trailer can fit your meal-service workflow.",
  },
  "model-03": {
    benefit: "high-temperature conveyor dishwashing at a busy meal site",
    detail: "Plan the 38 ft trailer around your dish flow, site access, and utilities.",
  },
  "model-04": {
    benefit: "low-temperature dishwashing at a temporary food-service site",
    detail: "These interior views show worktables, sinks, and shelving in the 38 ft trailer.",
  },
  "model-05": {
    benefit: "outdoor handwashing points for a commercial or institutional site",
    detail: "The exterior photos show sink banks that crews can reach from outside the trailer.",
  },
  "model-06": {
    benefit: "container-based washing and drying for your crew",
    detail: "These interior photos show the 20 ft laundry container, not a trailer.",
  },
  "model-07": {
    benefit: "on-site washing and drying for workwear and crew laundry",
    detail: "Plan temporary laundry around the crew size and your site's water and drainage.",
  },
  "model-08": {
    benefit: "on-site washing and drying for a temporary crew",
    detail: "These interior photos show the 30 ft laundry trailer, not the 20 ft container.",
  },
  "model-09": {
    benefit: "crew showers and restrooms in one temporary unit",
    detail: "The 13 ft three-stall combination keeps both facilities together at your site.",
  },
  "model-10": {
    benefit: "temporary showers and restrooms for a larger crew",
    detail: "The 22 ft six-stall combination brings both facilities into one trailer.",
  },
  "model-11": {
    benefit: "temporary showers and restrooms for a larger crew",
    detail: "Ask about fitting the 30 ft eight-stall combination into your site plan.",
  },
};

export function captionDetailBatchA(
  modelId: string,
): { benefit: string; detail: string } | undefined {
  return details[modelId];
}
