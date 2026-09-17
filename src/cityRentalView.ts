/** A selected city adds project context; it must never change the product. */
export function localizedServiceCopy(
  location: string,
  heading: string,
  introduction: string,
): { heading: string; introduction: string } {
  const place = location.replace(/\s+/g, " ").trim().slice(0, 120);
  const originalHeading = heading.trim();
  const originalIntroduction = introduction.trim();
  if (!place) return { heading: originalHeading, introduction: originalIntroduction };
  return {
    heading: originalHeading + " in " + place,
    introduction: originalIntroduction + (originalIntroduction ? " " : "") +
      "For your project in " + place +
      ", confirm rental dates, site access and utility connections with the rental team.",
  };
}

// These are contextual views of existing service URLs, not new city landing pages.
export function applyCityRentalView(location: string) {
  const main = document.querySelector<HTMLElement>("main");
  const title = main?.querySelector("h1");
  if (!main || !title || !location.trim() ||
      (!/\/(equipment-rental|services)\//.test(window.location.pathname) &&
       window.location.pathname !== "/remote-containerized-military-berthing-solution-for-rent/")) return;

  let description = main.querySelector<HTMLElement>("[data-h1-intro]");
  if (!description) {
    description = document.createElement("p");
    description.className = "model-intro";
    description.setAttribute("data-h1-intro", "");
    title.after(description);
  }
  // Keep the original values for a second selection without accumulating locations.
  const originalTitle = main.dataset.cityOriginalHeading || title.textContent || "Equipment Rental";
  const originalIntroduction = main.dataset.cityOriginalIntroduction ?? description.textContent ?? "";
  main.dataset.cityOriginalHeading = originalTitle;
  main.dataset.cityOriginalIntroduction = originalIntroduction;
  const copy = localizedServiceCopy(location, originalTitle, originalIntroduction);
  title.textContent = copy.heading;
  description.textContent = copy.introduction;
  // Category pages have a separate location note here; the equipment lead must come first.
  title.after(description);
  main.dataset.cityView = "true";

  // All reviewed galleries, specifications, product tabs and supporting copy stay intact.
  // In particular, never substitute a modular kitchen for a trailer or ADA for non-ADA.
  document.title = copy.heading + " | Temporary123";
  document.querySelector('meta[name="description"]')?.setAttribute("content", copy.introduction);
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const schema = JSON.parse(script.textContent || "{}");
      for (const node of Array.isArray(schema["@graph"]) ? schema["@graph"] : []) {
        const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
        if (types.some((type: string) => type === "WebPage" || type === "Service")) {
          node.name = copy.heading;
          node.description = copy.introduction;
        }
      }
      script.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
    } catch {
      // A malformed, unrelated schema block must not break city context or the page.
    }
  }
  // Canonical links, robots directives, URLs, redirects and the base page remain unchanged.
}
