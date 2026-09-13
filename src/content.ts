import site from "../site.json" with { type: "json" };
export const services = [
  { slug: "mobile-kitchens", name: "Mobile kitchens" },
  { slug: "restroom-shower-trailers", name: "Restroom & shower trailers" },
  { slug: "workforce-housing", name: "Workforce housing" },
  { slug: "temporary-facilities", name: "Temporary facilities" },
];
export const routes = [
  "/",
  "/services/",
  "/equipment-rental/",
  "/industries/",
  "/service-areas/",
  "/planning/",
  "/about-us/",
  "/blog/",
  "/contact-us/",
  "/privacy/",
];
const titles: Record<string, string> = {
  "/": "Mobile Kitchen & Temporary Facility Rentals",
  "/services/": "Temporary Facility Solutions",
  "/equipment-rental/": "Equipment Rental",
  "/industries/": "Industries & Project Solutions",
  "/service-areas/": "Temporary Facility Rental Service Areas",
  "/planning/": "Plan Your Temporary Facilities",
  "/about-us/": "About Temporary123",
  "/blog/": "Articles on Temporary Facility Planning",
  "/contact-us/": "Contact Our Team",
  "/privacy/": "Privacy",
};
const descriptions: Record<string, string> = {
  "/": "Rent mobile kitchens, refrigeration, restroom and shower trailers, and workforce facilities nationwide. Plan your project with Temporary123. Call our team 24/7.",
  "/equipment-rental/":
    "Browse mobile kitchens, restroom and shower trailers, workforce accommodation and temporary facility options. Discuss your site and dates with Temporary123.",
  "/services/":
    "Plan equipment, site access, utilities and delivery for your temporary facilities. Talk through your project requirements with the Temporary123 team.",
  "/industries/":
    "Explore temporary facility support for construction, government, food service and emergency response projects. Find equipment for your operation.",
  "/service-areas/":
    "Find mobile kitchen trailer rentals by city and state. Search Temporary123 service locations across the United States for temporary food service support.",
  "/planning/":
    "Prepare your temporary facility brief with site access, utilities, occupancy and rental dates. Use the Temporary123 project planning guide before you call.",
  "/about-us/":
    "Learn how Temporary123 coordinates mobile kitchens, restroom and shower trailers, workforce housing and temporary facility rentals nationwide.",
  "/blog/":
    "Read practical guides for mobile kitchen trailer rentals, restroom and shower facilities, temporary base camps, utilities, delivery and site planning.",
  "/contact-us/":
    "Call Temporary123 at +1 (800) 443 - 5212, available 24/7. Discuss equipment availability, your project location, rental dates and delivery requirements.",
  "/privacy/":
    "Read how this Temporary123 website handles visitor information and contact the team with questions about your information.",
};
export function pageInfo(path: string) {
  return {
    title: `${titles[path] || "Page not found"} | ${site.brand}`,
    description:
      descriptions[path] ||
      "Find the right facility for your project. Explore Temporary123 equipment or call +1 (800) 443 - 5212 for help.",
  };
}
