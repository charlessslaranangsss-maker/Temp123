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

const option = (name: string, href: string): ServiceLink => ({ name, href });

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Mobile Kitchen Trailers",
    href: "/equipment-rental/mobile-kitchen-trailers/",
    description:
      "Commercial mobile kitchen rentals for planned projects, renovations and emergency food service.",
    links: [
      option(
        "24ft Mobile Kitchen Trailer",
        "/services/mobile-kitchen-trailers/24ft/",
      ),
      option(
        "26ft Bulk Mobile Kitchen",
        "/services/mobile-kitchen-trailers/26ft-bulk/",
      ),
      option(
        "28ft Mobile Kitchen Trailer",
        "/services/mobile-kitchen-trailers/28ft/",
      ),
      option(
        "38ft Mobile Kitchen Trailer",
        "/services/mobile-kitchen-trailers/38ft/",
      ),
      option(
        "40ft Mobile Kitchen Trailer",
        "/services/mobile-kitchen-trailers/40ft/",
      ),
      option(
        "40ft Combination Mobile Kitchen",
        "/services/mobile-kitchen-trailers/40ft-combination/",
      ),
      option(
        "40ft Bulk Combination Mobile Kitchen",
        "/services/mobile-kitchen-trailers/40ft-bulk-combination/",
      ),
    ],
  },
  {
    name: "Dishwashing Trailers",
    href: "/portable-dishwashing-trailer-rental/",
    description:
      "Portable dishwashing facilities for high-volume sanitation and food service support.",
    links: [
      option(
        "22ft Dishwashing Trailer",
        "/services/dishwashing-trailers/22ft/",
      ),
      option(
        "24ft Dishwashing Trailer",
        "/services/dishwashing-trailers/24ft/",
      ),
      option(
        "26ft Dishwashing Trailer",
        "/services/dishwashing-trailers/26ft/",
      ),
      option(
        "38ft Conveyor Dishwashing Trailer",
        "/services/dishwashing-trailers/38ft-conveyor/",
      ),
    ],
  },
  {
    name: "Refrigeration Trailers",
    href: "/equipment-rental/refrigeration/",
    description:
      "Temporary cold storage options for ingredients, prepared food and temperature-sensitive supplies.",
    links: [
      option(
        "12ft Refrigeration Trailer",
        "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
      ),
      option("20ft Refrigeration Trailer", "/20ft-refrigeration-trailers/"),
      option(
        "40ft Refrigerated Container",
        "/equipment-rental/refrigerated-containers/",
      ),
    ],
  },
  {
    name: "Handwashing Trailers",
    href: "/equipment-rental/handwashing-stations/",
    description:
      "Portable handwashing facilities that support hygiene plans at active and remote sites.",
    links: [
      option(
        "Portable Handwashing Stations",
        "/equipment-rental/handwashing-stations/",
      ),
      option(
        "Hands-Free Handwashing Stations",
        "/services/handwashing-trailers/hands-free/",
      ),
    ],
  },
  {
    name: "Mobile Sleeper Trailers and Containers",
    href: "/equipment-rental/mobile-sleep-trailers/",
    description:
      "Temporary sleeping facilities for rotating crews, remote operations and extended deployments.",
    links: [
      option(
        "20ft Shared Sleeper Trailer",
        "/services/mobile-sleeper-trailers/20ft-shared/",
      ),
      option(
        "20ft Contractor Sleeper Trailer",
        "/services/mobile-sleeper-trailers/20ft-contractor/",
      ),
      option(
        "20ft VIP Sleeper Trailer",
        "/services/mobile-sleeper-trailers/20ft-vip/",
      ),
      option(
        "Containerized Sleeper Units",
        "/remote-containerized-military-berthing-solution-for-rent/",
      ),
    ],
  },
  {
    name: "Restroom Trailers",
    href: "/equipment-rental/restroom-trailers/",
    description:
      "Clean portable restroom rentals for work sites, events and temporary facilities.",
    links: [
      option("12ft Restroom Trailer", "/services/restroom-trailers/12ft/"),
      option("14ft Restroom Trailer", "/services/restroom-trailers/14ft/"),
      option("20ft Restroom Trailer", "/services/restroom-trailers/20ft/"),
      option("30ft Restroom Trailer", "/services/restroom-trailers/30ft/"),
    ],
  },
  {
    name: "Shower Trailers",
    href: "/equipment-rental/shower-trailer/",
    description:
      "Mobile shower facilities planned around occupancy, utilities and daily servicing needs.",
    links: [
      option("12ft Shower Trailer", "/services/shower-trailers/12ft/"),
      option("14ft Shower Trailer", "/services/shower-trailers/14ft/"),
      option("20ft Shower Trailer", "/services/shower-trailers/20ft/"),
      option("30ft Shower Trailer", "/services/shower-trailers/30ft/"),
    ],
  },
  {
    name: "Shower and Restroom Combination Trailers",
    href: "/services/shower-restroom-combination-trailers/",
    description:
      "Combined restroom and shower facilities for sites that need both services in one footprint.",
    links: [
      option(
        "12ft Restroom and Shower Trailer",
        "/services/shower-restroom-combination-trailers/12ft/",
      ),
      option(
        "14ft Restroom and Shower Trailer",
        "/services/shower-restroom-combination-trailers/14ft/",
      ),
      option(
        "20ft Restroom and Shower Trailer",
        "/services/shower-restroom-combination-trailers/20ft/",
      ),
      option(
        "30ft Restroom and Shower Trailer",
        "/services/shower-restroom-combination-trailers/30ft/",
      ),
    ],
  },
  {
    name: "Laundry Trailers",
    href: "/equipment-rental/laundry-trailers/",
    description:
      "Mobile laundry facilities for workforce camps, emergency operations and long-duration projects.",
    links: [
      option("24ft Mobile Laundry Trailer", "/services/laundry-trailers/24ft/"),
      option("30ft Mobile Laundry Trailer", "/services/laundry-trailers/30ft/"),
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
      description: `${link.name} rental planning from Temporary 123 for commercial, government, emergency and remote site operations.`,
    })),
);

export type ServiceOption = (typeof serviceOptions)[number];
