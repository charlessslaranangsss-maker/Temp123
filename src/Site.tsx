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
import { CoverageMap } from "./CoverageMap";
import { ServiceDetail, modelDetails } from "./ServiceDetail";
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
      <div className="utility">
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
          <p>
            <strong>Live agents available 24/7.</strong> <span>Call us at</span>{" "}
            <a href={"tel:" + site.phoneE164}>{site.phoneDisplay}</a>{" "}
            <span>to speak with a kitchen specialist.</span>
          </p>
        </div>
      </div>
      <div className="header-sticky">
        <header className="header wrap">
          <a className="brand" href="/" aria-label="Temporary 123 home">
            <img src="/images/logo.webp" width="53" height="44" alt="" />
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
                  <a href="/equipment-rental/">View all services ↗</a>
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
                            <a href={category.href}>Category overview ↗</a>
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
            <span>Call our team, 24/7</span>
            <strong>{site.phoneDisplay}</strong>
            <b aria-hidden="true">↗</b>
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
                  <a href="/equipment-rental/">View all rental services</a>
                  {serviceCategories.map((category) => (
                    <details
                      className="mobile-service-category"
                      key={category.name}
                    >
                      <summary>
                        {category.name} <span aria-hidden="true">+</span>
                      </summary>
                      <div>
                        <a href={category.href}>View category</a>
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
      <a className="mobile-call" href={"tel:" + site.phoneE164}>
        <span>Call our team, 24/7</span>
        <strong>{site.phoneDisplay}</strong>
        <b aria-hidden="true">↗</b>
      </a>
      <a
        className="contact-rail"
        href="/contact-us/"
        aria-label="Contact Temporary 123"
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

export function Footer() {
  return (
    <>
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
      <footer className="wrap footer">
        <div>
          <a className="wordmark" href="/">
            Temporary<span>123</span>
          </a>
          <p>Temporary facilities for the work ahead.</p>
          <small>© {new Date().getFullYear()} Temporary 123</small>
        </div>
        <div>
          <strong>Explore</strong>
          <a href="/equipment-rental/">Services</a>
          <a href="/services/">Project solutions</a>
          <a href="/industries/">Industries served</a>
          <a href="/service-areas/">Service Areas</a>
          <a href="/government/">Government services</a>
          <a href="/gsa-schedule/">GSA Schedule information</a>
        </div>
        <div>
          <strong>Get in touch</strong>
          <a href="/contact-us/">Contact us</a>
          <a href="/planning/">Project planning</a>
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
              <p>Share your site, dates and requirements with Temporary 123.</p>
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
        ) : path === "/service-areas/" ? (
          <>
            <section className="location-hero">
              <div className="wrap section location-hero-grid">
                <div className="location-hero-copy">
                  <span className="eyebrow">NATIONWIDE SERVICE AREAS</span>
                  <h1>
                    Temporary facility rentals
                    <br />
                    across the USA.
                  </h1>
                  <p>
                    Temporary 123 coordinates mobile kitchens, hygiene
                    facilities and workforce support in all 50 states.
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
                <CoverageMap />
              </div>
            </section>
            <section className="wrap section location-directory">
              <div className="location-directory-heading">
                <div>
                  <span className="eyebrow">FIND A SERVICE AREA</span>
                  <h2>Search available location pages.</h2>
                </div>
                <p>
                  Find Temporary 123 mobile kitchen trailer rental information
                  for cities and states in our current directory.
                </p>
              </div>
              <label className="search-label">
                Find a city or state
                <input
                  id="catalog-search"
                  type="search"
                  placeholder="Search mobile kitchen rental locations"
                />
              </label>
              <div className="catalog-list">
                {catalog.map((p) => (
                  <a key={p.path} href={p.path}>
                    {p.title}
                    <span>↗</span>
                  </a>
                ))}
              </div>
              <p id="catalog-status" role="status">
                {catalog.length} service locations
              </p>
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
                  <h1>{serviceCategory.name}</h1>
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
              Facilities that
              <br />
              keep work moving.
            </h1>
            <p>Explore Temporary 123 equipment and project support.</p>
            <Cards />
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
                    and emergency support pages from Temporary 123.
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
          <>
            <section className="about-hero">
              <div className="wrap section about-hero-grid">
                <div>
                  <span className="eyebrow">ABOUT TEMPORARY 123</span>
                  <h1>
                    Temporary facilities
                    <br />
                    built around the work.
                  </h1>
                  <p>
                    Temporary 123 supports construction, emergency response,
                    government, food service and remote workforce operations
                    with coordinated temporary facility rentals.
                  </p>
                  <Button href="/contact-us/">Plan your project</Button>
                </div>
                <aside className="about-summary" aria-label="Company approach">
                  <span>What we coordinate</span>
                  <strong>Facilities, logistics and site requirements</strong>
                  <p>
                    Start with the project location, schedule, occupancy and
                    utilities. Our team helps identify the equipment and support
                    services needed for a workable deployment plan.
                  </p>
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
                ].map(([title, description, href]) => (
                  <article key={title}>
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
                    Temporary 123 is listed as a GSA Schedule contract holder.
                    Call our team at{" "}
                    <a href={"tel:" + site.phoneE164}>{site.phoneDisplay}</a> to
                    discuss commercial, government or emergency project needs.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : path === "/blog/" ? (
          <>
            <section className="blog-hero">
              <div className="wrap section">
                <span className="eyebrow">ARTICLES & PLANNING GUIDES</span>
                <h1>
                  Field notes for
                  <br />
                  better site planning.
                </h1>
                <p>
                  Practical guidance for mobile kitchen rentals, restroom and
                  shower trailers, workforce housing and temporary site support.
                </p>
              </div>
            </section>
            <section className="wrap section blog-content">
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
                <article>
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
                <article>
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
                <article>
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
          </>
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
              This website provides information about Temporary 123 services.
              Calling the published telephone number connects you directly with
              the business.
            </p>
            <p>
              This version does not load advertising or analytics scripts. To
              discuss a project or ask about your information, please call our
              team.
            </p>
            <p>
              For questions about your information, contact Temporary 123 at{" "}
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
      <Footer />
    </div>
  );
}
