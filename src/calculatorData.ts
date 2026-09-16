export const trailerLengths = [20, 25, 30, 35, 40] as const;

export type TrailerLength = (typeof trailerLengths)[number];

export const equipmentPrices = [
  {
    id: "refrigeration-trailer",
    name: "Refrigeration Trailer",
    startingPrice: 1495,
    details: "Temporary cold-storage support.",
  },
  {
    id: "modular-dishwashing",
    name: "Temporary Modular Dishwashing Facility",
    startingPrice: 4995,
    details: "Commercial ware-washing capacity.",
  },
  {
    id: "mobile-kitchen",
    name: "Temporary Mobile Kitchen",
    startingPrice: 4995,
    details: "Commercial food-service workspace.",
  },
  {
    id: "sleeper-bunkbed-trailer",
    name: "Sleeper/Bunkbed Trailer",
    startingPrice: 4995,
    details: "Sleeps 16 people at four per room, or eight at two per room.",
  },
  {
    id: "sleeper-modular-container",
    name: "Sleeper Modular Container",
    startingPrice: 2495,
    details: "Sleeps four to eight people.",
  },
  {
    id: "shower-trailer",
    name: "Shower Trailer",
    startingPrice: 5995,
    details:
      "Ten stalls, three hand sinks and individually locking privacy rooms.",
  },
  {
    id: "shower-restroom-combination",
    name: "Shower and Restroom Combination",
    startingPrice: 6995,
    details: "Eight stalls with individually locking privacy rooms.",
  },
  {
    id: "ada-shower-restroom-combination",
    name: "ADA Shower and Restroom Combination",
    startingPrice: 3995,
    details: "Three to eight stalls with individually locking privacy rooms.",
  },
  {
    id: "laundry-trailer",
    name: "Laundry Trailer",
    startingPrice: 7995,
    details: "Eight to ten stackable washers and dryers.",
  },
  {
    id: "man-camp",
    name: "Man Camp",
    startingPrice: 200,
    perPerson: true,
    details: "Food, sleeping, laundry, showers, tents and water.",
  },
] as const;

export type EquipmentId = (typeof equipmentPrices)[number]["id"];

export const deliveryStartingPrice = (length: number) => {
  if (!trailerLengths.includes(length as TrailerLength))
    throw new RangeError("Trailer length must be 20, 25, 30, 35 or 40 feet.");
  return 995 + (length - 20) * 100;
};

export const equipmentStartingPrice = (id: string, people: number) => {
  const equipment = equipmentPrices.find((item) => item.id === id);
  if (!equipment) throw new RangeError("Choose a listed equipment type.");
  if ("perPerson" in equipment) {
    if (!Number.isInteger(people) || people < 1)
      throw new RangeError("Enter at least one person for a man camp estimate.");
    return equipment.startingPrice * people;
  }
  return equipment.startingPrice;
};

export const calculateStartingEstimate = (
  id: string,
  length: number,
  people: number,
) => {
  const equipment = equipmentStartingPrice(id, people);
  const delivery = deliveryStartingPrice(length);
  return { equipment, delivery, total: equipment + delivery };
};

export const calculatorService = (id: string) => {
  if (["mobile-kitchen", "modular-dishwashing", "refrigeration-trailer"].includes(id))
    return "mobile-kitchens" as const;
  if (["shower-trailer", "shower-restroom-combination", "ada-shower-restroom-combination", "laundry-trailer"].includes(id))
    return "restroom-shower-trailers" as const;
  if (["sleeper-bunkbed-trailer", "sleeper-modular-container", "man-camp"].includes(id))
    return "workforce-housing" as const;
  throw new RangeError("Choose a listed equipment type.");
};

export const calculatorDuration = (startDate: string, endDate: string) => {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start)
    throw new RangeError("End date must be on or after the start date.");
  const days = Math.floor((end - start) / 86_400_000) + 1;
  if (days < 30) return "under-1-month" as const;
  if (days < 90) return "1-3-months" as const;
  if (days < 180) return "3-6-months" as const;
  return "6-plus-months" as const;
};
