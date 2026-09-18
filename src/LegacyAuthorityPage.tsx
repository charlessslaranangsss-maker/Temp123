import legacyAuthorityData from "../content/legacy-authority-pages.json" with { type: "json" };

export type LegacyAuthorityPageRecord = {
  path: string;
  title: string;
  description: string;
  family: "restroom" | "shower" | "workforce" | "kitchen" | "food" | "equipment";
  location: string | null;
  parentPath: string;
};

export const legacyAuthorityPages = legacyAuthorityData.pages as LegacyAuthorityPageRecord[];

export const legacyAuthorityPageByPath = Object.fromEntries(
  legacyAuthorityPages.map((page) => [page.path, page]),
) as Record<string, LegacyAuthorityPageRecord>;

const familyPlanning: Record<LegacyAuthorityPageRecord["family"], string[]> = {
  restroom: [
    "Expected users and shift or event schedule",
    "Required restroom capacity and accessible layout",
    "Freshwater, wastewater and service access",
    "Level placement area and delivery clearance",
  ],
  shower: [
    "Expected users, shifts and required stall count",
    "Private changing and accessible layout requirements",
    "Freshwater, hot-water power and wastewater connections",
    "Level placement area and delivery clearance",
  ],
  workforce: [
    "Crew size, shift pattern and length of stay",
    "Sleeping, dining, hygiene and office requirements",
    "Power, water, wastewater and daily servicing",
    "Site access, security and phased delivery needs",
  ],
  kitchen: [
    "Meals per service period and operating schedule",
    "Cooking, preparation, refrigeration and warewashing needs",
    "Power, fuel, potable water and wastewater connections",
    "Ventilation clearance and delivery access",
  ],
  food: [
    "Meal volume, menu and service schedule",
    "Preparation, storage, refrigeration and warewashing needs",
    "Power, fuel, potable water and wastewater connections",
    "Food-service access, staffing and delivery schedule",
  ],
  equipment: [
    "Required capacity and intended site use",
    "Power, water and wastewater requirements",
    "Delivery route, placement area and access limits",
    "Requested delivery date and rental duration",
  ],
};

const familyLabel: Record<LegacyAuthorityPageRecord["family"], string> = {
  restroom: "RESTROOM RENTAL PLANNING",
  shower: "SHOWER RENTAL PLANNING",
  workforce: "WORKFORCE FACILITY PLANNING",
  kitchen: "MOBILE KITCHEN PLANNING",
  food: "FOOD SERVICE FACILITY PLANNING",
  equipment: "TEMPORARY EQUIPMENT PLANNING",
};

export function LegacyAuthorityPage({ page }: { page: LegacyAuthorityPageRecord }) {
  const locationPhrase = page.location ? ` for a project in ${page.location}` : "";
  return (
    <section className="wrap section source-layout legacy-authority-page">
      <div>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href={page.parentPath}>Related rentals</a>
        </nav>
        <span className="eyebrow">{familyLabel[page.family]}</span>
        <h1 className="page-title">{page.title}</h1>
        <p className="source-lead" data-h1-intro>{page.description}</p>

        <article className="source-content">
          <h2>Plan the facility around the operating site</h2>
          <p>
            Temporary123 reviews the actual delivery address, schedule, expected
            users and available utilities before recommending a configuration
            {locationPhrase}. Equipment availability, delivery timing and rental
            terms are confirmed for each request.
          </p>
          <h2>Details to prepare for the rental review</h2>
          <ul>
            {familyPlanning[page.family].map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p>
            Share the complete site address, requested dates and any access or
            utility constraints. The team can then review the appropriate
            equipment and provide project-specific availability and pricing.
          </p>
          <p><a href={page.parentPath}>Review related equipment and facility options</a></p>
        </article>
      </div>
      <aside className="source-aside">
        <span className="eyebrow">REQUEST A PROJECT REVIEW</span>
        <h2>Share your site requirements.</h2>
        <p>Include the location, dates, expected users and available utilities.</p>
        <a className="button" href="/contact-us/">Contact Temporary123 <span aria-hidden="true">↗</span></a>
      </aside>
    </section>
  );
}

export function LegacyAuthorityDirectory({ path }: { path: string }) {
  const pages = legacyAuthorityPages.filter((page) => page.parentPath === path);
  if (!pages.length) return null;
  return (
    <section className="wrap section legacy-authority-directory" aria-labelledby="related-planning-pages">
      <span className="eyebrow">RELATED RENTAL PLANNING</span>
      <h2 id="related-planning-pages">Related facility and location pages</h2>
      <p>Use these pages to prepare the site details needed for an availability and delivery review.</p>
      <ul>
        {pages.map((page) => <li key={page.path}><a href={page.path}>{page.title}</a></li>)}
      </ul>
    </section>
  );
}
