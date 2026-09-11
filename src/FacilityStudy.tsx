import { useState, useRef } from "react";
import { FacilityArt } from "./FacilityArt";
const studies = [
  {
    label: "Kitchen",
    title: "Room to keep service running.",
    note: "Start with meal volumes, menu and utility connections.",
    href: "/services/mobile-kitchens/",
  },
  {
    label: "Welfare",
    title: "Comfort belongs in the plan.",
    note: "Bring peak occupancy, access and servicing into focus.",
    href: "/services/restroom-shower-trailers/",
  },
  {
    label: "Housing",
    title: "A place between shifts.",
    note: "Connect sleeping, dining and daily crew routines.",
    href: "/services/workforce-housing/",
  },
  {
    label: "Workspace",
    title: "Space for the next phase.",
    note: "Define the activities your temporary space must support.",
    href: "/services/temporary-facilities/",
  },
];
export function FacilityStudy() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const study = studies[active];
  return (
    <div className="facility-study">
      <div className="hero-art">
        <FacilityArt />
        <div className="art-caption">
          <span>PLANNED AROUND PEOPLE</span>
          <span>CONCEPT / A–01</span>
        </div>
      </div>
      <div
        className="study-tabs"
        role="tablist"
        aria-label="Explore facility requirements"
      >
        {studies.map((item, i) => (
          <button
            key={item.label}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`study-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="study-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              const next =
                e.key === "ArrowRight"
                  ? (active + 1) % 4
                  : e.key === "ArrowLeft"
                    ? (active + 3) % 4
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 3
                        : null;
              if (next !== null) {
                e.preventDefault();
                setActive(next);
                tabs.current[next]?.focus();
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        id="study-panel"
        role="tabpanel"
        aria-labelledby={`study-tab-${active}`}
        tabIndex={0}
        className="study-panel"
      >
        <div key={active} className="study-content">
          <p className="study-title">{study.title}</p>
          <p>{study.note}</p>
          <a href={study.href} className="text-link">
            Explore {study.label.toLowerCase()}{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
