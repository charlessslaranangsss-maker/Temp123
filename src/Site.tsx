import site from "../site.json" with { type: "json" };
import { QuoteForm } from "./QuoteForm";
import { Home } from "./Home";
import { Cards } from "./Equipment";
import {
  EquipmentCatalog,
  EquipmentBrief,
  catalog as equipmentCatalogData,
} from "./EquipmentCatalog";
export type SourcePage = {
  id: number;
  path: string;
  title: string;
  html: string;
  description: string;
  images: { src: string; alt: string }[];
};
const nav = [
  ["Equipment", "/equipment-rental/"],
  ["Solutions", "/services/"],
  ["Locations", "/service-areas/"],
  ["About us", "/about-us/"],
];
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
            <a href={"tel:" + site.phoneE164}>+1 {site.phoneDisplay}</a>{" "}
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
              {[...nav, ["Contact", "/contact-us/"]].map(([n, p]) => (
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
            temporary<span>123</span>
          </a>
          <p>Temporary facilities for the work ahead.</p>
          <small>© {new Date().getFullYear()} Temporary 123</small>
        </div>
        <div>
          <strong>Explore</strong>
          <a href="/equipment-rental/">Equipment rental</a>
          <a href="/services/">Project solutions</a>
          <a href="/industries/">Industries served</a>
          <a href="/service-areas/">Locations directory</a>
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
}: {
  path: string;
  page?: SourcePage;
  catalog?: { path: string; title: string }[];
}) {
  const contact = ["/contact/", "/contact-us/"].includes(path);
  const equipmentBrief = equipmentCatalogData.items.find(
    (item) => item.path === path,
  );
  return (
    <div id="top">
      <Header path={path} />
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
              {site.inquiriesEnabled ? (
                <div id="quote-island">
                  <QuoteForm />
                </div>
              ) : (
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
              )}
            </div>
          </section>
        ) : path === "/service-areas/" ? (
          <section className="wrap section">
            <span className="eyebrow">THE TEMPORARY 123 DIRECTORY</span>
            <h1>
              Find your location
              <br />
              and service.
            </h1>
            <p>Explore our existing service and location pages.</p>
            <label className="search-label">
              Filter this page
              <input
                id="catalog-search"
                type="search"
                placeholder="Search by location or equipment"
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
            <p id="catalog-status" role="status" />
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
          <section className="wrap section narrow">
            <span className="eyebrow">ABOUT TEMPORARY 123</span>
            <h1>
              Facilities planned
              <br />
              around real work.
            </h1>
            <p>
              Temporary 123 helps organizations plan mobile kitchens, restrooms,
              showers, workforce accommodation and supporting site facilities.
            </p>
            <p>
              Start with your location, schedule, crew size and utility
              requirements. Our team can help you review equipment options, site
              access and delivery arrangements for your project.
            </p>
            <p>
              Call <a href={"tel:" + site.phoneE164}>{site.phoneDisplay}</a> to
              speak with a specialist, 24 hours a day.
            </p>
            <Button href="/equipment-rental/">Explore equipment</Button>
          </section>
        ) : page ? (
          <section className="wrap section source-layout">
            <div>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/service-areas/">Services & locations</a>
              </nav>
              <h1 className="page-title">{page.title}</h1>
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
