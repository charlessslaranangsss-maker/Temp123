const locationSeed = (value: string) =>
  [...value].reduce(
    (seed, character) => (seed * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );

const select = <T,>(items: readonly T[], key: string) =>
  items[locationSeed(key) % items.length];

const stateHeadlines = [
  (state: string) => `Mobile Kitchen Rental in ${state}`,
  (state: string) => `Temporary Facilities Lease in ${state}`,
  (state: string) => `Emergency Shower Trailer Rental in ${state}`,
  (state: string) => `Bunk Bed Trailer Rental in ${state}`,
  (state: string) => `Portable Facilities Rental in ${state}`,
  (state: string) => `Modular Trailer Lease in ${state}`,
  (state: string) => `Emergency Trailer Rental in ${state}`,
  (state: string) => `Shower and Restroom Trailer Rental in ${state}`,
] as const;

const regionHeadlines = [
  (region: string, state: string) => `Mobile Kitchen Rental in ${region}, ${state}`,
  (region: string, state: string) => `Temporary Facilities Lease in ${region}, ${state}`,
  (region: string, state: string) => `Emergency Shower Trailer Rental in ${region}, ${state}`,
  (region: string, state: string) => `Bunk Bed Trailer Rental in ${region}, ${state}`,
  (region: string, state: string) => `Portable Facilities Rental in ${region}, ${state}`,
  (region: string, state: string) => `Modular Trailer Lease in ${region}, ${state}`,
  (region: string, state: string) => `Emergency Trailer Rental in ${region}, ${state}`,
  (region: string, state: string) => `Shower and Restroom Trailer Rental in ${region}, ${state}`,
] as const;

export const stateRentalHeadline = (state: string) =>
  select(stateHeadlines, state)(state);

export const regionRentalHeadline = (
  region: string,
  state: string,
  regionIndex: number,
) =>
  regionHeadlines[
    (locationSeed(state) + regionIndex) % regionHeadlines.length
  ](region, state);

const cityServiceHeadlines = {
  kitchen: [
    (location: string) => `Mobile Kitchen Rental in ${location}`,
    (location: string) => `Kitchen Trailer Lease in ${location}`,
  ],
  shower: [
    (location: string) => `Emergency Shower Trailer Rental in ${location}`,
    (location: string) => `Portable Shower Trailer Lease in ${location}`,
  ],
  combination: [
    (location: string) => `Shower and Restroom Trailer Rental in ${location}`,
    (location: string) => `Temporary Combination Trailer Lease in ${location}`,
  ],
  sleeper: [
    (location: string) => `Sleeper Bunk Bed Trailer Rental in ${location}`,
    (location: string) => `Base Camp Trailer Lease in ${location}`,
  ],
  facility: [
    (location: string) => `Temporary Facilities Rental in ${location}`,
    (location: string) => `Portable Facility Lease in ${location}`,
  ],
} as const;

export const cityRentalHeadline = (location: string, service: string) => {
  const lowerService = service.toLowerCase();
  const kind = /kitchen/.test(lowerService)
    ? "kitchen"
    : /combination|restroom/.test(lowerService)
      ? "combination"
      : /shower/.test(lowerService)
        ? "shower"
        : /sleep|bunk/.test(lowerService)
          ? "sleeper"
          : "facility";
  return select(cityServiceHeadlines[kind], `${location}-${service}`)(location);
};

export const rentalProductHeadline = (name: string) =>
  /rental|lease/i.test(name) ? name : `${name} Rental`;

const categoryHeadlines: Record<string, string> = {
  "Mobile Kitchens": "Mobile Kitchen Trailer Rental",
  Dishwashing: "Dishwashing Trailer Rental",
  Refrigeration: "Refrigerated Trailer Rental",
  Shower: "Emergency Shower Trailer Rental",
  Restroom: "Restroom Trailer Rental",
  "Shower and Restroom Combination Trailers":
    "Shower and Restroom Trailer Rental",
  Sleeper: "Sleeper Bunk Bed Trailer Rental",
  Laundry: "Laundry Trailer Rental",
  "Handwashing Trailers": "Portable Handwashing Trailer Rental",
};

export const rentalCategoryHeadline = (name: string) =>
  categoryHeadlines[name] || `${name} Facility Rental`;
