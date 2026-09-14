import { IndustryDetail, industryGuideByPath } from "./IndustryDetail";
import { rentalCategoryHeadline } from "./rentalHeadlines";
import { StateDetail, statePageByPath } from "./StateDetail";
import { CityDetail } from "./CityDetail";
import { cityPageByPath } from "./cityDirectory";
import { CoverageMap } from "./CoverageMap";
import { MapLocationDirectory } from "./MapLocationDirectory";
import { CityDirectoryPage } from "./CityDirectoryPage";
import site from "../site.json" with { type: "json" };
import { QuoteForm } from "./QuoteForm";
import { Home } from "./Home";
import { Cards } from "./Equipment";
import {
  EquipmentCatalog,
  EquipmentBrief,
  catalog as equipmentCatalogData,
} from "./EquipmentCatalog";
import { serviceCategories } from "./serviceMenu";
import { StateGuideCards } from "./StateGuideCards";
import consolidatedLocations from "../content/location-consolidation.json" with { type: "json" };
import { ServiceDetail, modelDetails } from "./ServiceDetail";
import { RegionDetail, regionPageByPath, regionSlug } from "./regionGuides";
export type SourcePage = {
  id: number;
  modified?: string;
  path: string;
  title: string;
  html: string;
  description: string;
  images: { src: string; alt: string }[];
};
const nav = [
  ["Service Areas", "/service-areas/"],
  ["About Us", "/about-us/"],
  ["Articles", "/blog/"],
  ["Contact Us", "/contact-us/"],
];
const locationPrefix = "/equipment-rental/mobile-kitchen-trailers/";
export const isLocationPagePath = (path: string) =>
  path.startsWith(locationPrefix) && path !== locationPrefix;
function Button({
  children = "Plan your project",
  href = "/contact-us/",
  secondary = false,
}: {
  children?: React.ReactNode;
  href?: string;
  secondary?: boolean;
}) {
  return (
    <a className={"button" + (secondary ? " secondary" : "")} href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
export function Header({ path }: { path: string }) {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <div className="utility utility-refresh">
        <div className="wrap utility-inner">
          <span className="utility-status" aria-hidden="true">
            <i />
          </span>
          <svg
            className="utility-agent-icon"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
          >
            <path
              d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="utility-message">
            <strong>Emergency support available 24/7.</strong>{" "}
            <span className="utility-call-label">Call us at</span>{" "}
            <a href={"tel:" + site.phoneE164}>{site.phoneDisplay}</a>{" "}
            <span className="utility-specialist">
              to speak with a kitchen specialist.
            </span>
          </p>
        </div>
      </div>
      <div className="header-sticky header-refresh">
        <header className="header wrap">
          <a className="brand" href="/" aria-label="Temporary123 home">
            <img
              src="/images/temporary123-logo.png"
              width="80"
              height="44"
              alt=""
            />
            <span>
              Temporary<span className="brand-number">123</span>
              <small>TEMPORARY FACILITIES · PERMANENT COMMITMENT</small>
            </span>
          </a>
          <nav aria-label="Main navigation">
            <a href="/" aria-current={path === "/" ? "page" : undefined}>
              Home
            </a>
            <details className="services-nav">
              <summary
                className="services-trigger"
                role="button"
                aria-controls="services-panel"
                aria-current={
                  path.startsWith("/equipment-rental/") ? "page" : undefined
                }
              >
                Services <span aria-hidden="true">⌄</span>
              </summary>
              <div
                id="services-panel"
                className="services-panel"
                role="group"
                aria-label="Services menu"
              >
                <div className="services-panel-heading">
                  <div>
                    <span>Temporary facility rentals</span>
                    <strong>Services for every stage of your project</strong>
                  </div>
                  <a href="/equipment-rental/">View All Services ↗</a>
                </div>
                <div className="services-panel-body">
                  <div className="service-category-list">
                    {serviceCategories.map((category, index) => (
                      <details
                        className="service-category"
                        name="service-category"
                        open={index === 0}
                        key={category.name}
                      >
                        <summary
                          className="service-category-link"
                          role="button"
                        >
                          {category.name} <span aria-hidden="true">›</span>
                        </summary>
                        <section
                          className="service-submenu"
                          aria-label={`${category.name} models`}
                        >
                          <div className="service-submenu-heading">
                            <div>
                              <span>Available configurations</span>
                              <strong>{category.name}</strong>
                            </div>
                            <a href={category.href}>Category Overview ↗</a>
                          </div>
                          <p>{category.description}</p>
                          <div className="service-submenu-links">
                            {category.links.map((link) => (
                              <a href={link.href} key={link.href}>
                                {link.name} <span aria-hidden="true">↗</span>
                              </a>
                            ))}
                          </div>
                        </section>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </details>
            {nav.map(([n, p]) => (
              <a
                href={p}
                key={p}
                aria-current={path === p ? "page" : undefined}
              >
                {n}
              </a>
            ))}
          </nav>
          <a className="header-contact" href={"tel:" + site.phoneE164}>
            <svg
              className="header-phone-icon"
              viewBox="0 0 24 24"
              width="23"
              height="23"
              aria-hidden="true"
            >
              <path
                d="M21 16.5v3a1.5 1.5 0 0 1-1.7 1.5A18.4 18.4 0 0 1 3 4.7 1.5 1.5 0 0 1 4.5 3h3a1.5 1.5 0 0 1 1.5 1.3c.1.9.4 1.8.7 2.6a1.5 1.5 0 0 1-.3 1.6L8.1 9.8a15 15 0 0 0 6.1 6.1l1.3-1.3a1.5 1.5 0 0 1 1.6-.3c.8.3 1.7.6 2.6.7a1.5 1.5 0 0 1 1.3 1.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Call our team, 24/7</span>
            <strong>{site.phoneDisplay}</strong>
          </a>
          <details className="mobile-nav">
            <summary>
              Menu <span aria-hidden="true">☰</span>
            </summary>
            <nav aria-label="Mobile navigation">
              <a href="/" aria-current={path === "/" ? "page" : undefined}>
                Home
              </a>
              <details className="mobile-services">
                <summary>
                  Services <span aria-hidden="true">+</span>
                </summary>
                <div>
                  <a href="/equipment-rental/">View All Rental Services</a>
                  {serviceCategories.map((category) => (
                    <details
                      className="mobile-service-category"
                      key={category.name}
                    >
                      <summary>
                        {category.name} <span aria-hidden="true">+</span>
                      </summary>
                      <div>
                        <a href={category.href}>View Category</a>
                        {category.links.map((link) => (
                          <a href={link.href} key={link.href}>
                            {link.name}
                          </a>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </details>
              {nav.map(([n, p]) => (
                <a
                  href={p}
                  key={p}
                  aria-current={path === p ? "page" : undefined}
                >
                  {n}
                </a>
              ))}
            </nav>
          </details>
        </header>
        <div className="scroll-progress" aria-hidden="true" />
      </div>
      <a
        className="mobile-call mobile-call-refresh"
        href={"tel:" + site.phoneE164}
      >
        <span>Call our team, 24/7</span>
        <strong>{site.phoneDisplay}</strong>
        <svg
          className="mobile-phone-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path
            d="M21 16.5v3a1.5 1.5 0 0 1-1.7 1.5A18.4 18.4 0 0 1 3 4.7 1.5 1.5 0 0 1 4.5 3h3a1.5 1.5 0 0 1 1.5 1.3c.1.9.4 1.8.7 2.6a1.5 1.5 0 0 1-.3 1.6L8.1 9.8a15 15 0 0 0 6.1 6.1l1.3-1.3a1.5 1.5 0 0 1 1.6-.3c.8.3 1.7.6 2.6.7a1.5 1.5 0 0 1 1.3 1.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      <a
        className="contact-rail contact-rail-refresh"
        href="/contact-us/"
        aria-label="Contact Us at Temporary123"
        aria-current={path === "/contact-us/" ? "page" : undefined}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M5 5h14v11H9l-4 3V5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <span>Contact us</span>
      </a>
    </>
  );
}

function ContactDrawer() {
  return (
    <dialog
      id="contact-drawer"
      className="contact-drawer"
      aria-labelledby="contact-drawer-title"
    >
      <div className="contact-drawer-shell">
        <div className="contact-drawer-call">
          <a href={"tel:" + site.phoneE164}>Call: {site.phoneDisplay}</a>
          <button
            type="button"
            data-close-contact
            aria-label="Close contact form"
          >
            ×
          </button>
        </div>
        <header className="contact-drawer-header">
          <span aria-hidden="true">☰</span>
          <h2 id="contact-drawer-title">Contact Us</h2>
          <span aria-hidden="true" />
        </header>
        <div className="contact-drawer-scroll">
          <p className="contact-drawer-intro">
            Tell us about your project. Our team is available 24 hours a day,
            seven days a week.
          </p>
          <div id="quote-island">
            <QuoteForm />
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function Footer({ showClosing = true }: { showClosing?: boolean }) {
  return (
    <>
      {showClosing && (
        <section className="closing">
          <div className="wrap closing-grid">
            <div>
              <span className="eyebrow">LET’S GET YOUR PROJECT MOVING</span>
              <h2>
                One call.
                <br />A clearer plan.
              </h2>
            </div>
            <div>
              <p>
                Tell us where, when, and what your team needs. Our specialists
                will help you take the next step.
              </p>
              <a className="phone-link" href={"tel:" + site.phoneE164}>
                {site.phoneDisplay} ↗
              </a>
              <span className="small">Call our team, 24 hours a day.</span>
            </div>
          </div>
        </section>
      )}
      <footer className="wrap footer">
        <div>
          <a className="wordmark" href="/">
            Temporary<span>123</span>
          </a>
          <p>Temporary facilities for the work ahead.</p>
          <small>© {new Date().getFullYear()} Temporary123</small>
        </div>
        <div>
          <strong>Explore</strong>
          <a href="/equipment-rental/">Services</a>
          <a href="/services/">Project Solutions</a>
          <a href="/industries/">Industries Served</a>
          <a href="/service-areas/">Service Areas</a>
          <a href="/government/">Government Services</a>
          <a href="/gsa-schedule/">GSA Schedule Information</a>
        </div>
        <div>
          <strong>Get in touch</strong>
          <a href="/contact-us/">Contact Us</a>
          <a href="/planning/">Project Planning</a>
          <a href="/privacy/">Privacy</a>
        </div>
        <a className="back-top" href="#top">
          Back to top ↑
        </a>
      </footer>
    </>
  );
}
export function Site({
  path,
  page,
  catalog = [],
  serviceCatalog = [],
}: {
  path: string;
  page?: SourcePage;
  catalog?: { path: string; title: string }[];
  serviceCatalog?: { path: string; title: string }[];
}) {
  const contact = ["/contact/", "/contact-us/"].includes(path);
  const equipmentBrief = equipmentCatalogData.items.find(
    (item) => item.path === path,
  );
  const serviceCategory = serviceCategories.find((item) => item.href === path);
  const directoryParent = path.endsWith("/cities/") ? path.slice(0, -7) : "";
  return (
    <div id="top">
      <Header path={path} />
      <ContactDrawer />
      <main id="main" tabIndex={-1}>
        {path === "/" ? (
          <Home />
        ) : contact ? (
          <section className="wrap section contact-grid">
            <div>
              <span className="eyebrow">LET’S TALK ABOUT YOUR PROJECT</span>
              <h1>
                The right facilities
                <br />
                start here.
              </h1>
              <p>Share your site, dates and requirements with Temporary123.</p>
              <a className="phone-link" href={"tel:" + site.phoneE164}>
                {site.phoneDisplay} ↗
              </a>
              <p>Specialist support available 24/7.</p>
            </div>
            <div>
              <div className="contact-call">
                <span className="eyebrow">SPEAK WITH A SPECIALIST</span>
                <h2>
                  Let’s work through
                  <br />
                  the details.
                </h2>
                <p>
                  For equipment availability, delivery arrangements and a
                  project quote, call our team.
                </p>
                <Button href={"tel:" + site.phoneE164}>
                  Call {site.phoneDisplay}
                </Button>
                <p className="small">
                  Have your project location and preferred dates ready.
                </p>
              </div>
            </div>
          </section>
        ) : industryGuideByPath[path] ? (
          <IndustryDetail path={path} />
        ) : statePageByPath[path] ? (
          <StateDetail name={statePageByPath[path]} />
        ) : cityPageByPath[path] ? (
          <CityDetail city={cityPageByPath[path]!} />
        ) : regionPageByPath[directoryParent] ? (
          <CityDirectoryPage guide={regionPageByPath[directoryParent]!} />
        ) : regionPageByPath[path] ? (
          <RegionDetail guide={regionPageByPath[path]!} />
        ) : path === "/service-areas/" ? (
          <>
            <section className="location-hero">
              <div className="wrap section location-hero-grid">
                <div className="location-hero-copy">
                  <nav className="breadcrumb" aria-label="Breadcrumb">
                    <a href="/">Home</a>
                    <span>/</span>
                    <span aria-current="page">Service Areas</span>
                  </nav>
                  <span className="eyebrow">NATIONWIDE SERVICE AREAS</span>
                  <h1>USA Temporary Facilities Rental Service Areas</h1>
                  <p>
                    Rent or lease Temporary Facilities with Temporary123. Rental
                    services include mobile kitchens, hygiene facilities and
                    workforce support in all 50 states. Emergency 24/7.
                  </p>
                  <div className="location-stats" aria-label="Coverage summary">
                    <div>
                      <strong>50</strong>
                      <span>states served</span>
                    </div>
                    <div>
                      <strong>24/7</strong>
                      <span>project support</span>
                    </div>
                  </div>
                </div>
                <div
                  id="service-area-map"
                  className="location-hero-map"
                  aria-label="Explore service locations"
                >
                  <CoverageMap showDirectory={false} />
                </div>
              </div>
            </section>
            <section className="wrap section">
              <MapLocationDirectory />
            </section>
            <section
              className="wrap section state-planning"
              aria-labelledby="state-planning-title"
            >
              <div className="section-heading">
                <div>
                  <span className="eyebrow">PLAN FOR YOUR LOCATION</span>
                  <h2 id="state-planning-title">
                    A useful starting point
                    <br />
                    for each state.
                  </h2>
                </div>
                <p>
                  Choose your state for practical questions to bring to your
                  rental conversation. Availability and delivery arrangements
                  depend on your exact site and dates.
                </p>
              </div>
              <div className="state-planning-grid">
                <StateGuideCards />
              </div>
            </section>
            <section className="wrap section location-directory">
              <div className="location-directory-heading">
                <div>
                  <span className="eyebrow">FIND A SERVICE AREA</span>
                  <h2>Plan a rental for your location.</h2>
                </div>
                <p>
                  Explore kitchen configurations with your project location in
                  mind. Confirm the state, delivery address and transport
                  arrangements with our team before booking.
                </p>
              </div>
              <form
                className="location-planner"
                action="/equipment-rental/mobile-kitchen-trailers/"
                method="get"
              >
                <label className="search-label" htmlFor="project-location">
                  Project city and state
                </label>
                <div className="location-planner-controls">
                  <input
                    id="project-location"
                    name="location"
                    list="known-project-locations"
                    placeholder="Enter your project location"
                    maxLength={120}
                    required
                  />
                  <button className="button" type="submit">
                    Explore mobile kitchens <span aria-hidden="true">↗</span>
                  </button>
                </div>
                <datalist id="known-project-locations">
                  {consolidatedLocations.routes.map((row) => (
                    <option key={row.path} value={row.location} />
                  ))}
                </datalist>
              </form>
            </section>
          </>
        ) : path in modelDetails ? (
          <ServiceDetail path={path as keyof typeof modelDetails} />
        ) : serviceCategory ? (
          <section className="service-option-page">
            <div className="wrap section">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/equipment-rental/">Services</a>
              </nav>
              <span className="eyebrow">TEMPORARY FACILITY RENTALS</span>
              <div className="service-category-heading">
                <div>
                  <h1>{rentalCategoryHeadline(serviceCategory.name)}</h1>
                  {path === consolidatedLocations.destination && (
                    <p
                      className="selected-project-location"
                      data-location-context
                      hidden
                    >
                      Your project location: <strong data-project-location />.
                      Include the state and full delivery address in your
                      inquiry so we can confirm the correct destination.
                    </p>
                  )}
                  <p>{serviceCategory.description}</p>
                  <p>
                    {
                      Object.values(modelDetails).find(
                        (item) => item.category === serviceCategory.name,
                      )?.use
                    }
                  </p>
                </div>
                <div className="service-category-actions">
                  <Button>Check availability</Button>
                  <a className="model-call" href={"tel:" + site.phoneE164}>
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="service-category-cards">
                {serviceCategory.links.map((link, index) => (
                  <a href={link.href} key={link.href}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{link.name}</strong>
                    <p>
                      {
                        modelDetails[link.href as keyof typeof modelDetails]
                          ?.intro
                      }
                    </p>
                    <b aria-hidden="true">↗</b>
                  </a>
                ))}
              </div>
              {path === consolidatedLocations.destination && (
                <section
                  className="kitchen-project-guide"
                  aria-labelledby="kitchen-project-heading"
                >
                  <span className="eyebrow">PREPARE YOUR PROJECT BRIEF</span>
                  <h2 id="kitchen-project-heading">
                    Match the kitchen to the operation.
                  </h2>
                  <div className="kitchen-planning-grid">
                    <article>
                      <h3>Cooking and service</h3>
                      <p>
                        Describe the menu, meals per service and busiest
                        operating period. Identify which functions need
                        temporary space: preparation, cooking, refrigeration,
                        dishwashing or the full kitchen.
                      </p>
                    </article>
                    <article>
                      <h3>Site and connections</h3>
                      <p>
                        Bring site dimensions, delivery access and the available
                        power, potable-water and wastewater arrangements.
                        Equipment choice and placement should be reviewed
                        against those details.
                      </p>
                    </article>
                    <article>
                      <h3>Dates and continuity</h3>
                      <p>
                        Separate delivery and setup time from the date food
                        service must begin. For a renovation, explain how staff
                        and supplies will move between the temporary kitchen and
                        the serving area.
                      </p>
                    </article>
                  </div>
                  <p>
                    Availability, transport feasibility, setup responsibilities
                    and servicing are confirmed for the actual project. A
                    location selection is a starting point for that discussion.
                  </p>
                  <Button>Discuss your kitchen project</Button>
                </section>
              )}
            </div>
          </section>
        ) : equipmentBrief ? (
          <EquipmentBrief item={equipmentBrief} />
        ) : ["/services/", "/equipment-rental/", "/industries/"].includes(
            path,
          ) ? (
          <section className="wrap section">
            <span className="eyebrow">EQUIPMENT & PROJECT SOLUTIONS</span>
            <h1>
              {path === "/equipment-rental/"
                ? "Equipment for your temporary site."
                : path === "/industries/"
                  ? "Facilities shaped around your industry."
                  : "Temporary facilities for the whole project."}
            </h1>
            <p className="directory-intro">
              {path === "/equipment-rental/"
                ? "Compare equipment layouts and explore the facilities your operation needs. Confirm availability, access and connections with our team before selecting a unit."
                : path === "/industries/"
                  ? "Start with the work your team needs to keep doing. Each setting brings different requirements for food service, staff welfare and site access."
                  : "Bring food service, hygiene and crew facilities into one site plan. Explore the services below, then discuss how they need to work together."}
            </p>
            {path === "/industries/" ? (
              <div className="industry-briefs">
                {[
                  [
                    "Construction & workforce",
                    "Plan around the busiest shift",
                    "Share crew numbers, shift changes and whether workers stay on site. Meal production, washing and sleeping requirements should follow the actual working day.",
                    "/man-camps-for-rent/",
                  ],
                  [
                    "Food service & hospitality",
                    "Keep preparation and service connected",
                    "Identify the functions affected by the renovation: cooking, cold storage, dishwashing or the full kitchen. Map the route between temporary preparation and the existing serving area.",
                    "/food-services-2/",
                  ],
                  [
                    "Government & public services",
                    "Prepare the project requirements",
                    "Bring the operating brief, site access procedures and procurement requirements. Review available supplier documents and confirm which details apply to the proposed rental.",
                    "/government/",
                  ],
                  [
                    "Emergency & disaster response",
                    "Establish the immediate priorities",
                    "Provide the location, team size, access conditions and utilities known to be available. Separate the facilities needed first from those that can follow as the site develops.",
                    "/disaster-relief-man-camp-workforce-rentals/",
                  ],
                ].map(([name, title, text, href], index) => (
                  <article key={href}>
                    <span className="eyebrow">
                      {String(index + 1).padStart(2, "0")} / {name}
                    </span>
                    <h2>{title}</h2>
                    <p>{text}</p>
                    <a className="text-link" href={href}>
                      Explore {name.toLowerCase()}{" "}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <Cards />
            )}
            {path === "/equipment-rental/" ? (
              <EquipmentCatalog />
            ) : (
              page && (
                <article
                  className="source-content"
                  dangerouslySetInnerHTML={{ __html: page.html }}
                />
              )
            )}
            {path === "/services/" && serviceCatalog.length > 0 && (
              <section
                className="service-library"
                aria-labelledby="service-library-heading"
              >
                <div className="service-library-heading">
                  <span className="eyebrow">SERVICE RESOURCE LIBRARY</span>
                  <h2 id="service-library-heading">
                    More ways to support
                    <br />
                    your operation.
                  </h2>
                  <p>
                    Browse specialized temporary facility, workforce, government
                    and emergency support pages from Temporary123.
                  </p>
                </div>
                <details>
                  <summary>
                    Browse {serviceCatalog.length} additional services and
                    resources <span aria-hidden="true">+</span>
                  </summary>
                  <div className="service-library-links">
                    {serviceCatalog.map((item) => (
                      <a href={item.path} key={item.path}>
                        {item.title} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </details>
              </section>
            )}
          </section>
        ) : path === "/planning/" ? (
          <section className="wrap section narrow">
            <span className="eyebrow">PROJECT PLANNING</span>
            <h1>
              Bring the essentials.
              <br />
              We’ll take it from there.
            </h1>
            {[
              [
                "Your operation",
                "What will the facilities support? Include occupancy, meal volume, operating hours and any special equipment needs.",
              ],
              [
                "Your location",
                "Share the site address, delivery access and known water, power and wastewater arrangements.",
              ],
              [
                "Your schedule",
                "Include your start date, expected rental duration and any installation or removal restrictions.",
              ],
            ].map(([t, d]) => (
              <details className="planning-detail" key={t} open>
                <summary>{t}</summary>
                <p>{d}</p>
              </details>
            ))}
            <Button />
          </section>
        ) : path === "/about-us/" ? (
          <div className="secondary-page about-refresh">
            <section className="about-hero" aria-labelledby="about-title">
              <div className="wrap section about-hero-grid">
                <div className="secondary-intro-copy">
                  <span className="eyebrow">ABOUT TEMPORARY123</span>
                  <h1 id="about-title">
                    Temporary facilities built around the work.
                  </h1>
                  <p>
                    Temporary123 supports construction, emergency response,
                    government, food service and remote workforce operations
                    with coordinated temporary facility rentals.
                  </p>
                  <Button href="/contact-us/">Plan your project</Button>
                  <div className="about-intro-topics" aria-label="Our approach">
                    <span>Facilities</span>
                    <span>Logistics</span>
                    <span>Site planning</span>
                  </div>
                </div>
                <aside className="about-summary" aria-label="Company approach">
                  <img
                    className="about-summary-photo"
                    src="/images/kitchen.webp"
                    srcSet="/images/kitchen-480.webp 480w, /images/kitchen.webp 850w"
                    sizes="(max-width: 760px) calc(100vw - 40px), 480px"
                    width="850"
                    height="650"
                    alt="Commercial cooking equipment and preparation space inside a Temporary123 mobile kitchen"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="about-summary-copy">
                    <span>What we coordinate</span>
                    <strong>Facilities, logistics and site requirements</strong>
                    <p>
                      Start with the project location, schedule, occupancy and
                      utilities. Our team helps identify the equipment and
                      support services needed for a workable deployment plan.
                    </p>
                  </div>
                </aside>
              </div>
            </section>
            <section className="wrap section about-capabilities">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">TEMPORARY FACILITY SERVICES</span>
                  <h2>
                    One source for
                    <br />
                    essential site support.
                  </h2>
                </div>
                <p>
                  Choose individual rental units or coordinate several
                  facilities for one job site, base camp or emergency operation.
                </p>
              </div>
              <div className="about-service-grid">
                {[
                  [
                    "Mobile kitchen and food service",
                    "Mobile kitchen trailer rentals, refrigeration trailers and temporary dining structures for planned or urgent food service operations.",
                    "/equipment-rental/mobile-kitchen-trailers/",
                  ],
                  [
                    "Restroom, shower and laundry facilities",
                    "Portable restroom trailers, shower trailers, handwashing stations and mobile laundry facilities for crews and guests.",
                    "/equipment-rental/restroom-trailers/",
                  ],
                  [
                    "Workforce housing and base camps",
                    "Sleeper trailers, bunkhouses, mobile offices, breakrooms and crew camp facilities for remote and extended projects.",
                    "/man-camps-for-rent/",
                  ],
                  [
                    "Site infrastructure and operations",
                    "Temporary power, tents, modular buildings, command centers, water storage and site access equipment.",
                    "/equipment-rental/",
                  ],
                ].map(([title, description, href], index) => (
                  <article key={title}>
                    <span className="secondary-card-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <a href={href}>Explore services ↗</a>
                  </article>
                ))}
              </div>
            </section>
            <section className="about-commitment">
              <div className="wrap section about-commitment-grid">
                <div>
                  <span className="eyebrow">A PRACTICAL PROJECT PROCESS</span>
                  <h2>
                    Plan the site before
                    <br />
                    equipment arrives.
                  </h2>
                </div>
                <div>
                  <p>
                    A reliable temporary facility starts with clear information.
                    We review access, available power, water and wastewater,
                    expected occupancy, operating hours and rental dates before
                    arrangements are finalized.
                  </p>
                  <p>
                    Temporary123 is listed as a GSA Schedule contract holder.
                    Call our team at{" "}
                    <a href={"tel:" + site.phoneE164}>{site.phoneDisplay}</a> to
                    discuss commercial, government or emergency project needs.
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : path === "/blog/" ? (
          <div className="secondary-page articles-refresh">
            <section className="blog-hero" aria-labelledby="articles-title">
              <div className="wrap section blog-intro-grid">
                <div className="secondary-intro-copy">
                  <span className="eyebrow">ARTICLES & PLANNING GUIDES</span>
                  <h1 id="articles-title">
                    Field notes for better site planning.
                  </h1>
                  <p>
                    Practical guidance for mobile kitchen rentals, restroom and
                    shower trailers, workforce housing and temporary site
                    support.
                  </p>
                  <a className="secondary-inline-link" href="#planning-guides">
                    Browse planning guides <span aria-hidden="true">↓</span>
                  </a>
                </div>
                <nav
                  className="article-topics"
                  aria-label="Planning guide topics"
                >
                  <span>In this collection</span>
                  {[
                    ["01", "Mobile kitchens", "#kitchen-guide"],
                    ["02", "Hygiene facilities", "#hygiene-guide"],
                    ["03", "Remote workforce support", "#workforce-guide"],
                  ].map(([number, label, href]) => (
                    <a key={href} href={href}>
                      <small>{number}</small>
                      <strong>{label}</strong>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </nav>
              </div>
            </section>
            <section className="wrap section blog-content" id="planning-guides">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">PLANNING GUIDES</span>
                  <h2>
                    Start with the questions
                    <br />
                    that shape the site.
                  </h2>
                </div>
                <p>
                  These guides help project teams prepare useful details before
                  discussing availability, delivery and installation.
                </p>
              </div>
              <div className="blog-grid">
                <article id="kitchen-guide">
                  <img
                    className="article-guide-photo"
                    src="/images/kitchen.webp"
                    srcSet="/images/kitchen-480.webp 480w, /images/kitchen.webp 850w"
                    sizes="(max-width: 760px) calc(100vw - 40px), 380px"
                    width="850"
                    height="650"
                    alt="Cooking line inside a mobile kitchen trailer"
                    loading="lazy"
                    decoding="async"
                  />
                  <span>Mobile kitchens</span>
                  <h3>How to plan a mobile kitchen trailer rental</h3>
                  <p>
                    Estimate meal volume, service periods, menu requirements and
                    staffing. Then confirm power, potable water, wastewater,
                    ventilation clearance and delivery access at the site.
                  </p>
                  <a href="/equipment-rental/mobile-kitchen-trailers/">
                    Explore mobile kitchen trailers ↗
                  </a>
                </article>
                <article id="hygiene-guide">
                  <img
                    className="article-guide-photo"
                    src="/media/ce44e887e6e1812d2195e955.webp"
                    width="850"
                    height="650"
                    alt="Restroom trailer interior with a toilet and yellow grab rails"
                    loading="lazy"
                    decoding="async"
                  />
                  <span>Hygiene facilities</span>
                  <h3>Choosing restroom and shower trailers for a job site</h3>
                  <p>
                    Start with occupancy, shift schedules and accessibility
                    needs. Servicing frequency, water connections, wastewater
                    storage and placement affect the right restroom or shower
                    configuration.
                  </p>
                  <a href="/equipment-rental/restroom-trailers/">
                    Compare restroom trailers ↗
                  </a>
                </article>
                <article id="workforce-guide">
                  <img
                    className="article-guide-photo"
                    src="/images/catalog/mobile-sleep-trailers-960.webp"
                    srcSet="/images/catalog/mobile-sleep-trailers-480.webp 480w, /images/catalog/mobile-sleep-trailers-960.webp 960w"
                    sizes="(max-width: 760px) calc(100vw - 40px), 380px"
                    width="850"
                    height="650"
                    alt="White sleeper trailer with separate entrances and access steps"
                    loading="lazy"
                    decoding="async"
                  />
                  <span>Remote workforce support</span>
                  <h3>What a temporary base camp needs to operate well</h3>
                  <p>
                    Sleeping, dining, hygiene, office and recreation facilities
                    should follow crew size, shift patterns and site conditions.
                    A coordinated layout also improves access and daily
                    servicing.
                  </p>
                  <a href="/man-camps-for-rent/">
                    Explore base camp services ↗
                  </a>
                </article>
              </div>
            </section>
            <section className="blog-checklist">
              <div className="wrap section blog-checklist-grid">
                <div>
                  <span className="eyebrow">BEFORE YOU REQUEST A QUOTE</span>
                  <h2>Prepare a stronger project brief.</h2>
                </div>
                <ol>
                  <li>
                    <strong>Confirm the location</strong>
                    <span>
                      Share the delivery address and site access limits.
                    </span>
                  </li>
                  <li>
                    <strong>Define capacity</strong>
                    <span>
                      Include crew size, meal counts or expected users.
                    </span>
                  </li>
                  <li>
                    <strong>List available utilities</strong>
                    <span>Note power, water and wastewater connections.</span>
                  </li>
                  <li>
                    <strong>Set the schedule</strong>
                    <span>Provide delivery, operating and removal dates.</span>
                  </li>
                </ol>
              </div>
            </section>
          </div>
        ) : page ? (
          <section className="wrap section source-layout">
            <div>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a
                  href={
                    isLocationPagePath(path) ? "/service-areas/" : "/services/"
                  }
                >
                  {isLocationPagePath(path) ? "Service Areas" : "Services"}
                </a>
              </nav>
              <h1 className="page-title">{page.title}</h1>
              {path === "/gsa-schedule/" && (
                <aside
                  className="procurement-documents"
                  aria-label="Supplier documents"
                >
                  <h2>Supplier documents</h2>
                  <p>
                    Review the published documents and contact our team to
                    confirm current details for your procurement requirements.
                  </p>
                  <ul>
                    <li>
                      <a href="https://temporarykitchens123.com/wp-content/uploads/2023/02/EntityInformation.pdf">
                        Entity information (PDF)
                      </a>
                    </li>
                    <li>
                      <a href="https://temporarykitchens123.com/wp-content/uploads/2023/02/V9-tk123-CAPABILITY-STATEMENT-1.pdf">
                        Capability statement (PDF)
                      </a>
                    </li>
                  </ul>
                </aside>
              )}
              <article
                className="source-content"
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
            </div>
            <aside className="source-aside">
              <span className="eyebrow">YOUR NEXT STEP</span>
              <h2>
                Let’s talk
                <br />
                facilities.
              </h2>
              <p>Tell us your location, dates and equipment needs.</p>
              <Button href={"tel:" + site.phoneE164}>
                Call {site.phoneDisplay}
              </Button>
              <a href="/contact-us/">Contact our team ↗</a>
            </aside>
          </section>
        ) : path === "/privacy/" ? (
          <section className="wrap section narrow">
            <h1>Privacy</h1>
            <p>
              This website provides information about Temporary123 services.
              Calling the published telephone number connects you directly with
              the business.
            </p>
            <p>
              This version does not load advertising or analytics scripts. To
              discuss a project or ask about your information, please call our
              team.
            </p>
            <p>
              For questions about your information, contact Temporary123 at{" "}
              {site.phoneDisplay}.
            </p>
          </section>
        ) : (
          <section className="wrap section narrow">
            <span className="eyebrow">PAGE NOT FOUND</span>
            <h1>
              Let’s get you
              <br />
              back on track.
            </h1>
            <p>
              We couldn’t find this page. Explore our equipment or contact the
              team for help.
            </p>
            <Button href="/equipment-rental/">Explore equipment</Button>
          </section>
        )}
      </main>
      <Footer
        showClosing={
          !regionPageByPath[path] &&
          !regionPageByPath[directoryParent] &&
          !cityPageByPath[path] &&
          !statePageByPath[path] &&
          !industryGuideByPath[path]
        }
      />
    </div>
  );
}
