export function panhandleGalleryCopy(headline: string, modelId: string | null) {
  if (!/panhandle/i.test(headline) || !/oklahoma/i.test(headline)) return undefined;
  if (modelId === "model-08") return {
    caption: "Oklahoma Panhandle Commercial Project and Base Camp 30 ft Laundry Trailer Rental or Lease. Discuss weekly rental, monthly rental, or yearly rental and lease options for on-site washing and drying. Plan temporary laundry around your crew and workwear needs. Call us now at 800-443-5212 — available 24/7.",
    altPrefix: "30 ft laundry trailer rental option — ",
  };
  if (modelId === "model-06") return {
    caption: "Oklahoma Panhandle Commercial Facility and Base Camp 20 ft Laundry Container Rental or Lease. Discuss weekly rental, monthly rental, or yearly rental and lease options for container-based washing and drying. These interior photos show the 20 ft container, not a trailer. Call us now at 800-443-5212 — available 24/7.",
    altPrefix: "20 ft laundry container rental option — ",
  };
  return undefined;
}
