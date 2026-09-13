import modelDetails from "../content/service-details.json" with { type: "json" };
export type ServiceLink = {
  name: string;
  href: string;
};

export type ServiceCategory = {
  name: string;
  href: string;
  description: string;
  links: ServiceLink[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Mobile Kitchens",
    href: "/equipment-rental/mobile-kitchen-trailers/",
    description:
      "Commercial mobile kitchen rentals for planned projects, renovations and emergency food service.",
    links: [
      {
        name: "24ft Mobile Kitchen Trailer",
        href: "/services/mobile-kitchen-trailers/24ft/",
      },
      {
        name: "26ft Bulk Mobile Kitchen",
        href: "/services/mobile-kitchen-trailers/26ft-bulk/",
      },
      {
        name: "28ft Mobile Kitchen Trailer",
        href: "/services/mobile-kitchen-trailers/28ft/",
      },
      {
        name: "38ft Mobile Kitchen Trailer",
        href: "/services/mobile-kitchen-trailers/38ft/",
      },
      {
        name: "40ft Mobile Kitchen Trailer",
        href: "/services/mobile-kitchen-trailers/40ft/",
      },
      {
        name: "40ft Combination Mobile Kitchen",
        href: "/services/mobile-kitchen-trailers/40ft-combination/",
      },
      {
        name: "40ft Bulk Combination Mobile Kitchen",
        href: "/services/mobile-kitchen-trailers/40ft-bulk-combination/",
      },
    ],
  },
  {
    name: "Dishwashing",
    href: "/portable-dishwashing-trailer-rental/",
    description:
      "Portable dishwashing facilities for high-volume sanitation and food service support.",
    links: [
      {
        name: "22ft Dishwashing Trailer",
        href: "/services/dishwashing-trailers/22ft/",
      },
      {
        name: "24ft Dishwashing Trailer",
        href: "/services/dishwashing-trailers/24ft/",
      },
      {
        name: "26ft Dishwashing Trailer",
        href: "/services/dishwashing-trailers/26ft/",
      },
      {
        name: "38ft Conveyor Dishwashing Trailer",
        href: "/services/dishwashing-trailers/38ft-conveyor/",
      },
    ],
  },
  {
    name: "Refrigeration",
    href: "/equipment-rental/refrigeration/",
    description:
      "Temporary cold storage options for ingredients, prepared food and temperature-sensitive supplies.",
    links: [
      {
        name: "12ft Refrigeration Trailer",
        href: "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
      },
      {
        name: "20ft Refrigeration Trailer",
        href: "/20ft-refrigeration-trailers/",
      },
      {
        name: "40ft Refrigerated Container",
        href: "/equipment-rental/refrigerated-containers/",
      },
    ],
  },
  {
    name: "Shower",
    href: "/equipment-rental/shower-trailer/",
    description:
      "One 22 ft mobile shower trailer with 10 stalls, planned around occupancy, utilities and daily servicing needs.",
    links: [
      {
        name: "22 ft Shower Trailer, 10 Stalls",
        href: "/services/shower-trailers/22ft-10-stall/",
      },
    ],
  },
  {
    name: "Restroom",
    href: "/equipment-rental/restroom-trailers/",
    description:
      "Clean portable restroom rentals for work sites, events and temporary facilities.",
    links: [
      {
        name: "12ft Restroom Trailer",
        href: "/services/restroom-trailers/12ft/",
      },
      {
        name: "14ft Restroom Trailer",
        href: "/services/restroom-trailers/14ft/",
      },
      {
        name: "20ft Restroom Trailer",
        href: "/services/restroom-trailers/20ft/",
      },
      {
        name: "30ft Restroom Trailer",
        href: "/services/restroom-trailers/30ft/",
      },
    ],
  },
  {
    name: "Shower and Restroom Combination Trailers",
    href: "/services/shower-restroom-combination-trailers/",
    description:
      "Combined restroom and shower facilities for sites that need both services in one footprint.",
    links: [
      {
        name: "12ft Restroom and Shower Trailer",
        href: "/services/shower-restroom-combination-trailers/12ft/",
      },
      {
        name: "14ft Restroom and Shower Trailer",
        href: "/services/shower-restroom-combination-trailers/14ft/",
      },
      {
        name: "20ft Restroom and Shower Trailer",
        href: "/services/shower-restroom-combination-trailers/20ft/",
      },
      {
        name: "30ft Restroom and Shower Trailer",
        href: "/services/shower-restroom-combination-trailers/30ft/",
      },
    ],
  },
  {
    name: "Sleeper",
    href: "/equipment-rental/mobile-sleep-trailers/",
    description:
      "Temporary sleeping facilities for rotating crews, remote operations and extended deployments.",
    links: [
      {
        name: "20ft Shared Sleeper Trailer",
        href: "/services/mobile-sleeper-trailers/20ft-shared/",
      },
      {
        name: "20ft Contractor Sleeper Trailer",
        href: "/services/mobile-sleeper-trailers/20ft-contractor/",
      },
      {
        name: "20ft VIP Sleeper Trailer",
        href: "/services/mobile-sleeper-trailers/20ft-vip/",
      },
      {
        name: "Containerized Sleeper Units",
        href: "/remote-containerized-military-berthing-solution-for-rent/",
      },
    ],
  },
  {
    name: "Laundry",
    href: "/equipment-rental/laundry-trailers/",
    description:
      "Mobile laundry facilities for workforce camps, emergency operations and long-duration projects.",
    links: [
      {
        name: "24ft Mobile Laundry Trailer",
        href: "/services/laundry-trailers/24ft/",
      },
      {
        name: "30ft Mobile Laundry Trailer",
        href: "/services/laundry-trailers/30ft/",
      },
    ],
  },
  {
    name: "Handwashing Trailers",
    href: "/equipment-rental/handwashing-stations/",
    description:
      "Portable handwashing facilities that support hygiene plans at active and remote sites.",
    links: [
      {
        name: "Portable Handwashing Stations",
        href: "/equipment-rental/handwashing-stations/",
      },
      {
        name: "Hands-Free Handwashing Stations",
        href: "/services/handwashing-trailers/hands-free/",
      },
    ],
  },
];

const establishedPaths = new Set([
  "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
  "/20ft-refrigeration-trailers/",
  "/equipment-rental/refrigerated-containers/",
  "/equipment-rental/handwashing-stations/",
  "/remote-containerized-military-berthing-solution-for-rent/",
]);

export const serviceOptions = serviceCategories.flatMap((category) =>
  category.links
    .filter((link) => !establishedPaths.has(link.href))
    .map((link) => ({
      ...link,
      category: category.name,
      categoryHref: category.href,
      categoryDescription: category.description,
      description:
        modelDetails[link.href as keyof typeof modelDetails]?.intro ||
        `${link.name} rental planning from Temporary123.`,
    })),
);

export type ServiceOption = (typeof serviceOptions)[number];
