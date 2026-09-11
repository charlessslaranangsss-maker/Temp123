import site from "../site.json" with { type: "json" };
import { QuoteForm } from "./QuoteForm";
export type SourcePage = {
  id: number;
  path: string;
  title: string;
  html: string;
  description: string;
  images: { src: string; alt: string }[];
};
export const equipment = [
  {
    name: "Mobile kitchens",
    path: "/equipment-rental/mobile-kitchen-trailers/",
    image: "kitchen",
    text: "Commercial cooking, preparation and food service facilities.",
  },
  {
    name: "Restroom & shower trailers",
    path: "/equipment-rental/restroom-trailers/",
    image: "facility",
    text: "Comfortable, private facilities for your people on site.",
  },
  {
    name: "Workforce & base camps",
    path: "/man-camps-for-rent/",
    image: "housing",
    text: "Coordinate accommodation and the facilities that support it.",
  },
  {
    name: "Temporary facilities",
    path: "/equipment-rental/",
    image: "kitchen-wide",
    text: "Equipment and support spaces for changing project needs.",
  },
];
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
export function Header() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <div className="utility">
        <div className="wrap">
          <span>
            <i />
            Temporary facilities. Nationwide support.
          </span>
          <a href={"tel:" + site.phoneE164}>
            24/7 specialist support <strong>{site.phoneDisplay}</strong>
          </a>
        </div>
      </div>
      <header className="header wrap">
        <a className="brand" href="/" aria-label="Temporary 123 home">
          <img src="/images/logo.webp" width="53" height="44" alt="" />
          <span>
            temporary<span className="brand-number">123</span>
            <small>TEMPORARY FACILITIES · PERMANENT COMMITMENT</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          {nav.map(([n, p]) => (
            <a href={p} key={p}>
              {n}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="/contact-us/">
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
        <details className="mobile-nav">
          <summary>
            Menu <span aria-hidden="true">☰</span>
          </summary>
          <nav aria-label="Mobile navigation">
            {[...nav, ["Contact", "/contact-us/"]].map(([n, p]) => (
              <a href={p} key={p}>
                {n}
              </a>
            ))}
          </nav>
        </details>
      </header>
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
function Cards() {
  return (
    <div className="equipment-grid">
      {equipment.map((e, i) => (
        <a className="equipment-card" href={e.path} key={e.path}>
          <div className="image-box">
            <img
              src={`/images/${e.image}.webp`}
              alt={e.name + " equipment from Temporary 123"}
              width="850"
              height="650"
              loading="lazy"
              decoding="async"
            />
            <span className="card-number">0{i + 1}</span>
          </div>
          <h3>
            {e.name}
            <span aria-hidden="true">↗</span>
          </h3>
          <p>{e.text}</p>
        </a>
      ))}
    </div>
  );
}
function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow">
            <i />
            READY FOR WHAT’S NEXT
          </span>
          <h1>
            Keep your
            <br />
            operations
            <br />
            <em>moving.</em>
          </h1>
          <p>
            Mobile kitchens, workforce facilities, and restroom & shower
            trailers. The spaces you need, when your project needs them.
          </p>
          <div className="hero-actions">
            <Button />
            <a className="text-link" href="/equipment-rental/">
              Explore equipment ↓
            </a>
          </div>
          <div className="hero-foot">
            <span>PLANNED PROJECTS</span>
            <span>EMERGENCY RESPONSE</span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="/images/kitchen-wide.webp"
            width="850"
            height="650"
            alt="Temporary 123 mobile kitchen equipment"
            fetchPriority="high"
          />
          <div className="photo-label">
            <span>BUILT AROUND YOUR OPERATION</span>
            <strong>
              Real facilities.
              <br />
              Practical solutions.
            </strong>
            <a
              href="/equipment-rental/mobile-kitchen-trailers/"
              aria-label="Explore mobile kitchens"
            >
              ↗
            </a>
          </div>
        </div>
      </section>
      <div className="service-strip">
        <div className="wrap">
          <span>FOOD SERVICE</span>
          <b>+</b>
          <span>WORKFORCE SUPPORT</span>
          <b>+</b>
          <span>SITE FACILITIES</span>
          <b>+</b>
          <span>TURNKEY SOLUTIONS</span>
        </div>
      </div>
      <section className="wrap section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / THE RIGHT SPACE FOR THE JOB</span>
            <h2>
              Temporary by design.
              <br />
              Essential to your operation.
            </h2>
          </div>
          <p>
            From keeping a kitchen running to supporting people in the field,
            start with the facilities your team needs.
          </p>
        </div>
        <Cards />
      </section>
      <section className="process section">
        <div className="wrap process-grid">
          <div>
            <span className="eyebrow">02 / FROM REQUIREMENT TO READY</span>
            <h2>
              Make room
              <br />
              for a better plan.
            </h2>
            <p>
              Every site is different. Bring your equipment, access, utilities
              and schedule into one conversation.
            </p>
            <Button href="/planning/" secondary>
              Start with the essentials
            </Button>
          </div>
          <ol>
            {[
              [
                "Tell us what you need",
                "Share your location, dates, number of people and the operation you need to support.",
              ],
              [
                "Build the facility brief",
                "Explore equipment and supporting services around your space, access and utility requirements.",
              ],
              [
                "Coordinate the next step",
                "Confirm availability, delivery, installation and servicing in your project proposal.",
              ],
            ].map(([t, d], i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="wrap section industry-section">
        <span className="eyebrow">03 / WHERE WORK HAPPENS</span>
        <h2>
          Different projects.
          <br />
          The same commitment.
        </h2>
        <div className="industry-links">
          {[
            ["Construction & workforce", "/man-camps-for-rent/"],
            ["Government & public services", "/government/"],
            ["Food service & hospitality", "/food-services-2/"],
              ["Emergency & disaster response", "/disaster-relief-man-camp-workforce-rentals/"],
          ].map(([n, p], i) => (
            <a href={p} key={p}>
              <span>0{i + 1}</span>
              <h3>{n}</h3>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>
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
  return (
    <div id="top">
      <Header />
      <main id="main">
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
            {page && (
              <article
                className="source-content"
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
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
              This version does not load advertising or analytics scripts.
              Online inquiry collection is disabled until its backend and
              privacy details are configured.
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
