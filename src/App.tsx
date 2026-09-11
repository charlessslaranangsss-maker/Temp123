import { useRef, useState } from "react";
import site from "../site.json";
import { services } from "./content";
import { FacilityStudy } from "./FacilityStudy";
import { PlanningChecklist } from "./PlanningChecklist";
import { QuoteForm } from "./QuoteForm";
const Arrow = () => <span aria-hidden="true">↗</span>;
function CTA({
  label = "Discuss your project",
  light = false,
}: {
  label?: string;
  light?: boolean;
}) {
  return (
    <a className={`button ${light ? "light" : ""}`} href="/contact/">
      {label}
      <Arrow />
    </a>
  );
}
const nav = [
  ["Services", "/services/"],
  ["Industries", "/industries/"],
  ["Service areas", "/service-areas/"],
  ["Planning guide", "/planning/"],
];
function Header({ path }: { path: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const scroll = useRef(0);
  function close() {
    dialog.current?.close();
    setOpen(false);
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scroll.current);
  }
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      {site.mode === "draft" && (
        <div className="preview-note">
          Design preview · Service details await approval · Inquiries require
          setup
        </div>
      )}
      <header className="header wrap">
        <a href="/" className="brand" aria-label={`${site.brand} home`}>
          {site.brand.toLowerCase()}
          <span>·</span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-action">
          <CTA label="Start a project" />
        </div>
        <button
          className="menu-button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => {
            scroll.current = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scroll.current}px`;
            document.body.style.width = "100%";
            dialog.current?.showModal();
            setOpen(true);
          }}
        >
          Menu <span aria-hidden="true">☰</span>
        </button>
        <dialog
          ref={dialog}
          id="mobile-menu"
          aria-label="Navigation menu"
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onClick={(e) => {
            if (e.target === dialog.current) close();
          }}
        >
          <div className="menu-panel">
            <button onClick={close} className="menu-close">
              Close ×
            </button>
            <nav aria-label="Mobile navigation">
              {nav.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  aria-current={path === href ? "page" : undefined}
                >
                  {label}
                </a>
              ))}
              <CTA label="Start a project" />
            </nav>
          </div>
        </dialog>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <a href="/" className="brand">
          {site.brand.toLowerCase()}
          <span>·</span>
        </a>
        <p>
          Temporary facilities.
          <br />A considered approach.
        </p>
        <div>
          <a href="/planning/">Project planning</a>
          <a href="/privacy/">Privacy notice</a>
          {site.phoneE164 && (
            <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>
          )}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.brand}
        </span>
        <span>Built around your project.</span>
      </div>
    </footer>
  );
}
function Closing() {
  return (
    <section className="closing">
      <div className="wrap closing-inner">
        <div>
          <p className="eyebrow">LET'S START WITH THE REQUIREMENT</p>
          <h2>
            What does your
            <br />
            project need?
          </h2>
        </div>
        <div>
          <p>
            Share the location, timeline and the people your facility needs to
            support.
          </p>
          <CTA label="Build your project brief" light />
        </div>
      </div>
    </section>
  );
}
function ServiceList() {
  return (
    <div className="service-list">
      {services.map((s, i) => (
        <a className="service-row" href={`/services/${s.slug}/`} key={s.slug}>
          <span className="service-num">0{i + 1}</span>
          <div>
            <span className="eyebrow">{s.tag}</span>
            <h3>{s.name}</h3>
          </div>
          <p>{s.short}</p>
          <Arrow />
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
          <p className="eyebrow">
            <span className="small-square" /> TEMPORARY FACILITIES /{" "}
            {site.brand.toUpperCase()}
          </p>
          <h1>
            Keep your
            <br />
            project <em>moving.</em>
          </h1>
          <p className="lead">
            Space to cook. Room to rest. Facilities to carry the work forward.
          </p>
          <p className="hero-sub">
            Bring your temporary facility requirements into focus, from the
            first site question to a considered project brief.
          </p>
          <CTA />
          <a className="text-link" href="#services">
            Explore the facilities <span aria-hidden="true">↓</span>
          </a>
        </div>
        <FacilityStudy />
      </section>
      <div className="index-strip">
        <div className="wrap">
          <span>THE FACILITY INDEX</span>
          <span>Kitchens</span>
          <span>Welfare</span>
          <span>Accommodation</span>
          <span>Workspace</span>
        </div>
      </div>
      <section className="wrap services-section" id="services">
        <div className="section-heading">
          <p className="eyebrow">A PRACTICAL STARTING POINT</p>
          <h2>
            Different requirements.
            <br />
            One clear brief.
          </h2>
        </div>
        <ServiceList />
      </section>
      <section className="planning-spread wrap">
        <div className="planning-number" aria-hidden="true">
          {site.brand.charAt(0)}
          <span>/</span>
        </div>
        <div>
          <p className="eyebrow">BEFORE THE FIRST DELIVERY</p>
          <h2>
            The right questions
            <br />
            make a better plan.
          </h2>
          <p>
            Every site brings a different set of constraints. Start with the
            people, the work and the space. A useful brief makes those details
            clear before equipment is selected.
          </p>
          <ol className="steps">
            <li>
              <strong>Define the operation</strong>
              <span>Purpose, occupancy and daily use.</span>
            </li>
            <li>
              <strong>Understand the site</strong>
              <span>Access, connections and positioning.</span>
            </li>
            <li>
              <strong>Set the timeline</strong>
              <span>Installation, operation and removal.</span>
            </li>
          </ol>
          <a className="text-link" href="/planning/">
            Read the planning guide <Arrow />
          </a>
          <div className="mid-cta">
            <CTA label="Share your requirements" />
          </div>
        </div>
      </section>
      <Closing />
    </>
  );
}
function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="page-intro wrap">
      <a className="breadcrumb" href="/">
        {site.brand} /
      </a>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="lead">{children}</div>
    </section>
  );
}
function ServicePage({ service: s }: { service: (typeof services)[number] }) {
  return (
    <>
      <PageIntro eyebrow={s.tag} title={s.name}>
        <p>{s.intro}</p>
        <CTA label="Discuss this requirement" />
      </PageIntro>
      <div className="wrap article-layout">
        <aside>
          <p className="eyebrow">PROJECT NOTES</p>
          <ul>
            {s.sections.map(([h], i) => (
              <li key={h}>
                <a href={`#section-${i}`}>{h}</a>
              </li>
            ))}
          </ul>
          <p>
            Configuration and availability require project-specific
            confirmation.
          </p>
        </aside>
        <article>
          {s.sections.map(([h, b], i) => (
            <section key={h} id={`section-${i}`}>
              <h2>{h}</h2>
              <p>{b}</p>
              {i === 1 && <CTA label="Share your site details" />}
            </section>
          ))}
          <section>
            <h2>Useful questions</h2>
            {s.faq.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </section>
          <p>
            Related planning: <a href="/planning/">prepare your site brief</a>{" "}
            or <a href="/services/">explore other facilities</a>.
          </p>
        </article>
      </div>
      <Closing />
    </>
  );
}
function Planning() {
  return (
    <>
      <PageIntro
        eyebrow="THE PROJECT NOTEBOOK"
        title="A clearer brief. A better beginning."
      >
        <p>
          Collect the details that help a project team understand what you need,
          where it will go and how it will be used.
        </p>
      </PageIntro>
      <section className="wrap planning-grid">
        {[
          [
            "The people",
            "Expected occupancy, peak periods, shift patterns and accessibility requirements.",
          ],
          [
            "The purpose",
            "Daily activities, essential equipment, supporting spaces and operating hours.",
          ],
          [
            "The site",
            "Location, delivery route, proposed positions, known utilities and access restrictions.",
          ],
          [
            "The schedule",
            "Preferred operating date, rental duration, milestones and removal requirements.",
          ],
        ].map(([h, p], i) => (
          <article key={h}>
            <span className="service-num">0{i + 1}</span>
            <h2>{h}</h2>
            <p>{p}</p>
          </article>
        ))}
      </section>
      <PlanningChecklist />
      <section className="wrap note-panel">
        <h2>Not everything needs to be known yet.</h2>
        <p>
          Mark unknown connections or measurements as questions. Include the
          site contact and explain which decisions are still open. Equipment
          specifications, permits, responsibilities and availability must be
          confirmed for the actual project.
        </p>
        <CTA label="Start with what you know" />
      </section>
      <Closing />
    </>
  );
}
function Industries() {
  return (
    <>
      <PageIntro
        eyebrow="BUILT AROUND THE WORK"
        title="Every project has its own rhythm."
      >
        <p>
          Use the operating context to shape the facility brief. These are
          planning examples, with equipment and service coverage subject to
          confirmation.
        </p>
        <CTA />
      </PageIntro>
      <section className="wrap sector-list">
        {[
          [
            "Construction & infrastructure",
            "Crew rotations, site access and phased work can shape accommodation and welfare needs.",
            "workforce-housing",
          ],
          [
            "Schools & institutions",
            "A planned kitchen closure may require a temporary food-service arrangement that follows the existing meal schedule.",
            "mobile-kitchens",
          ],
          [
            "Events & gatherings",
            "Peak attendance, opening hours and pedestrian access are useful starting points for restroom planning.",
            "restroom-shower-trailers",
          ],
          [
            "Operations & renovation",
            "Identify which workplace functions need temporary space while a permanent facility changes.",
            "temporary-facilities",
          ],
        ].map(([h, p, slug], i) => (
          <article key={h}>
            <span className="service-num">0{i + 1}</span>
            <div>
              <h2>{h}</h2>
              <p>{p}</p>
              <a className="text-link" href={`/services/${slug}/`}>
                Explore the planning considerations <Arrow />
              </a>
            </div>
          </article>
        ))}
      </section>
      <Closing />
    </>
  );
}
function Areas() {
  return (
    <>
      <PageIntro
        eyebrow="START WITH YOUR LOCATION"
        title="Where is your next project?"
      >
        <p>
          Location affects delivery planning, site access and servicing. Share
          the city and state so coverage can be reviewed for the facility you
          need.
        </p>
        <CTA label="Ask about your location" />
      </PageIntro>
      <section className="wrap note-panel">
        <h2>Site details make the difference.</h2>
        <p>
          Include the project address, planned dates and any known delivery
          restrictions. If a site is remote, provide an agreed location
          reference and explain how vehicles reach it.
        </p>
        <p>
          Service areas and equipment availability require confirmation. This
          preview does not list unverified local coverage.
        </p>
        <a className="text-link" href="/planning/">
          Prepare the rest of your brief <Arrow />
        </a>
      </section>
      <Closing />
    </>
  );
}
function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="YOUR PROJECT STARTS HERE"
        title="Tell us what comes next."
      >
        <p>
          Share the essentials. Start with your location, the facility you need
          and the dates you have in mind.
        </p>
      </PageIntro>
      <section className="wrap contact-layout">
        <aside>
          <h2>A useful first conversation.</h2>
          <p>
            You do not need a complete specification to start. Tell us what is
            known and which details still need a review.
          </p>
          <ul>
            <li>Site location and access</li>
            <li>Expected dates and duration</li>
            <li>Occupancy and intended use</li>
            <li>Known utility connections</li>
          </ul>
          <p>
            Please do not include sensitive personal or financial information.
          </p>
        </aside>
        <QuoteForm />
      </section>
    </>
  );
}
function Privacy() {
  return (
    <>
      <PageIntro eyebrow="INQUIRY INFORMATION" title="Privacy notice">
        <p>
          This notice is a draft for business review before the inquiry service
          is enabled.
        </p>
      </PageIntro>
      <article className="wrap prose">
        <h2>Information in your inquiry</h2>
        <p>
          The form requests your name, email, optional phone, project location,
          service category and project description. It records consent to use
          those details to respond.
        </p>
        <h2>How the application processes it</h2>
        <p>
          Configured inquiries are stored in Google Cloud Firestore. The server
          forwards the inquiry to the approved business inbox through Resend.
          The application does not provide public access to inquiry records.
        </p>
        <h2>Security and browser storage</h2>
        <p>
          The application does not install analytics or advertising tools, set
          authentication cookies, or save inquiry text in local browser storage.
          If enabled, Firebase App Check with reCAPTCHA Enterprise helps protect
          the form. Its live browser behavior and provider disclosures require
          review before launch.
        </p>
        <h2>Required business details</h2>
        <p>
          The responsible legal entity, privacy contact, retention period,
          deletion process and applicable rights must be approved and inserted
          here before publication. The current draft is not a complete legal
          notice.
        </p>
      </article>
    </>
  );
}
export function App({ path }: { path: string }) {
  const service = services.find((s) => path === `/services/${s.slug}/`);
  let body;
  if (service) body = <ServicePage service={service} />;
  else
    switch (path) {
      case "/":
        body = <Home />;
        break;
      case "/services/":
        body = (
          <>
            <PageIntro
              eyebrow="THE FACILITY INDEX"
              title="Space to keep things moving."
            >
              <p>Explore four starting points for a temporary facility plan.</p>
              <CTA />
            </PageIntro>
            <section className="wrap">
              <ServiceList />
            </section>
            <Closing />
          </>
        );
        break;
      case "/planning/":
        body = <Planning />;
        break;
      case "/industries/":
        body = <Industries />;
        break;
      case "/service-areas/":
        body = <Areas />;
        break;
      case "/contact/":
        body = <Contact />;
        break;
      case "/privacy/":
        body = <Privacy />;
        break;
      default:
        body = (
          <PageIntro
            eyebrow="404 / PAGE NOT FOUND"
            title="This page is not here."
          >
            <p>
              Try the <a href="/services/">service index</a> or return to{" "}
              <a href="/">{site.brand} home</a>.
            </p>
          </PageIntro>
        );
    }
  return (
    <>
      <Header path={path} />
      <main id="main">{body}</main>
      <Footer />
    </>
  );
}
