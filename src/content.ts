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
  "/contact-us/",
  "/privacy/",
];
const titles: Record<string, string> = {
  "/": "Mobile Kitchens & Temporary Facilities",
  "/services/": "Temporary Facility Solutions",
  "/equipment-rental/": "Equipment Rental",
  "/industries/": "Industries & Project Solutions",
  "/service-areas/": "Service & Location Directory",
  "/planning/": "Plan Your Temporary Facilities",
  "/contact-us/": "Contact Our Team",
  "/privacy/": "Privacy",
};
export function pageInfo(path: string) {
  return {
    title: `${titles[path] || "Page not found"} | ${site.brand}`,
    description:
      path === "/"
        ? "Mobile kitchens, restroom and shower trailers, workforce facilities and project support. Call Temporary 123 at (800) 443-5212, 24/7."
        : `${titles[path] || "Find the right facility for your project"}. Explore Temporary 123 equipment and project support, or call (800) 443-5212.`,
  };
}
