import site from "../site.json" with { type: "json" };
export const services = [
  { slug: "mobile-kitchens", name: "Mobile kitchens" },
  { slug: "dishwashing", name: "Dishwashing" },
  { slug: "refrigeration", name: "Refrigeration" },
  { slug: "restroom-shower-trailers", name: "Restroom & shower trailers" },
  { slug: "sleeper", name: "Sleeper" },
  { slug: "laundry", name: "Laundry" },
  { slug: "sink", name: "Sink" },
  { slug: "workforce-housing", name: "Workforce housing" },
  { slug: "temporary-facilities", name: "Temporary facilities" },
];
export const routes = [
  "/",
  "/services/",
  "/equipment-rental/",
  "/industries/",
  "/service-areas/",
  "/rental-calculator/",
  "/planning/",
  "/about-us/",
  "/blog/",
  "/contact-us/",
  "/privacy/",
];
const titles: Record<string, string> = {
  "/": "Temporary Facilities Rental: Rent or Lease Nationwide",
  "/services/": "Temporary Facility Solutions",
  "/equipment-rental/": "Equipment Rental",
  "/industries/": "Industries & Project Solutions",
  "/service-areas/": "USA Temporary Facilities Rental Service Areas",
  "/seo-dashboard/": "SEO Migration Dashboard",
  "/rental-calculator/":
    "Nationwide Temporary Facility Rental and Delivery Calculator",
  "/planning/": "Plan Your Temporary Facilities",
  "/about-us/": "About Temporary123",
  "/blog/": "Articles on Temporary Facility Planning",
  "/contact-us/": "Contact Our Team",
  "/privacy/": "Privacy",
};
const descriptions: Record<string, string> = {
  "/": "Rent or lease Temporary Facilities nationwide. Rental kitchens, shower and restroom combinations, showers and sleeper trailers for base camps. Emergency 24/7.",
  "/equipment-rental/":
    "Browse mobile kitchens, restroom and shower trailers, workforce accommodation and temporary facility options. Discuss your site and dates with Temporary123.",
  "/services/":
    "Plan equipment, site access, utilities and delivery for your temporary facilities. Talk through your project requirements with the Temporary123 team.",
  "/industries/":
    "Explore temporary facility support for construction, government, food service and emergency response projects. Find equipment for your operation.",
  "/service-areas/":
    "Rental Services across the USA. Rent or lease Temporary Facilities: kitchens, shower and restroom combinations, shower trailers and sleeper trailers. Emergency 24/7.",
  "/seo-dashboard/":
    "Owner-facing Temporary123 migration dashboard for crawl health, city landing pages, priority authority URLs, and controlled SEO release readiness.",
  "/rental-calculator/":
    "Calculate published starting prices for nationwide temporary facility rental and trailer delivery, then contact Temporary123 for a project-specific quote.",
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
