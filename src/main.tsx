import "./style.css";
import "./redesign.css";
import "./modern.css";
import "./homepage.css";
import "./contact-refresh.css";
import "./map-refresh.css";
import "./secondary-refresh.css";
import "@fontsource-variable/manrope";

// Keep every facility in the rendered HTML; filtering is an optional enhancement.
const rentalFilters = document.querySelector<HTMLElement>(".rental-filters");
if (rentalFilters) {
  rentalFilters.hidden = false;
  const buttons = [
    ...rentalFilters.querySelectorAll<HTMLButtonElement>(
      "[data-rental-filter]",
    ),
  ];
  const cards = [
    ...document.querySelectorAll<HTMLElement>(
      ".home-equipment [data-rental-group]",
    ),
  ];
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const group = button.dataset.rentalFilter;
      let count = 0;
      cards.forEach((card) => {
        card.hidden = group !== "all" && card.dataset.rentalGroup !== group;
        if (!card.hidden) count++;
      });
      buttons.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      const status = document.querySelector<HTMLElement>(
        "[data-rental-status]",
      );
      if (status)
        status.textContent = `Showing ${count} ${group === "all" ? "facilities" : `${button.childNodes[0].textContent?.trim()} facilities`}`;
    }),
  );
}
const search = document.querySelector<HTMLInputElement>("#catalog-search");
search?.addEventListener("input", () => {
  const term = search.value.trim().toLowerCase();
  let count = 0;
  document.querySelectorAll<HTMLElement>(".catalog-list a").forEach((a) => {
    a.hidden = !a.textContent?.toLowerCase().includes(term);
    if (!a.hidden) count++;
  });
  document.querySelector("#catalog-status")!.textContent =
    `${count} matching pages`;
});
const mobileNav = document.querySelector<HTMLDetailsElement>(".mobile-nav");
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileNav?.open) {
    mobileNav.open = false;
    mobileNav.querySelector<HTMLElement>("summary")?.focus();
  }
});
document.addEventListener("click", (e) => {
  if (mobileNav?.open && !mobileNav.contains(e.target as Node))
    mobileNav.open = false;
});
mobileNav?.addEventListener("focusout", () => {
  requestAnimationFrame(() => {
    if (!mobileNav.contains(document.activeElement)) mobileNav.open = false;
  });
});

const contactDrawer =
  document.querySelector<HTMLDialogElement>("#contact-drawer");
const requestedLocation =
  new URLSearchParams(window.location.search)
    .get("location")
    ?.trim()
    .slice(0, 120) || "";
if (requestedLocation) {
  document
    .querySelectorAll<HTMLElement>("[data-project-location]")
    .forEach((element) => {
      element.textContent = requestedLocation;
    });
  document
    .querySelectorAll<HTMLElement>("[data-location-context]")
    .forEach((element) => {
      element.hidden = false;
    });
  document.querySelectorAll<HTMLElement>("#quote-island").forEach((element) => {
    element.dataset.selectedLocation = requestedLocation;
  });
  document
    .querySelectorAll<HTMLAnchorElement>('a[href="/contact-us/"]')
    .forEach((anchor) => {
      anchor.href = `/contact-us/?location=${encodeURIComponent(requestedLocation)}`;
    });
  document
    .querySelectorAll<HTMLAnchorElement>(".service-category-cards a")
    .forEach((anchor) => {
      const destination = new URL(anchor.href);
      destination.searchParams.set("location", requestedLocation);
      anchor.href = destination.href;
    });
}
let contactTrigger: HTMLElement | SVGElement | null = null;
let contactScroll = 0;
if (
  contactDrawer &&
  typeof HTMLDialogElement !== "undefined" &&
  "showModal" in HTMLDialogElement.prototype
) {
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>("a");
    if (!anchor || anchor.target === "_blank") return;
    const destination = new URL(anchor.href, window.location.href);
    if (
      destination.origin !== window.location.origin ||
      !["/contact/", "/contact-us/"].includes(destination.pathname)
    )
      return;
    event.preventDefault();
    if (contactDrawer.open) return;
    contactTrigger = anchor;
    const inquiryLocation =
      destination.searchParams.get("location")?.trim().slice(0, 120) ||
      requestedLocation;
    if (inquiryLocation) {
      const island = contactDrawer.querySelector<HTMLElement>("#quote-island");
      if (island) island.dataset.selectedLocation = inquiryLocation;
      const field = contactDrawer.querySelector<HTMLInputElement>(
        'input[name="location"]',
      );
      if (field) field.value = inquiryLocation;
    }
    contactScroll = window.scrollY;
    mobileNav?.removeAttribute("open");
    contactDrawer.showModal();
    document.body.classList.add("dialog-open", "contact-drawer-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${contactScroll}px`;
    document.body.style.width = "100%";
    contactDrawer
      .querySelector<HTMLButtonElement>("[data-close-contact]")
      ?.focus();
  });
  contactDrawer
    .querySelector("[data-close-contact]")
    ?.addEventListener("click", () => contactDrawer.close());
  contactDrawer.addEventListener("click", (event) => {
    if (event.target !== contactDrawer) return;
    const box = contactDrawer.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      contactDrawer.close();
  });
  contactDrawer.addEventListener("close", () => {
    document.body.classList.remove("dialog-open", "contact-drawer-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo({ top: contactScroll, behavior: "instant" });
    contactTrigger?.focus({ preventScroll: true });
    contactTrigger = null;
  });
}

// Native dialogs supply keyboard focus containment and Escape handling.
// With JavaScript unavailable, ordinary equipment links remain the primary path.
if (
  typeof HTMLDialogElement !== "undefined" &&
  "showModal" in HTMLDialogElement.prototype
) {
  document
    .querySelectorAll<HTMLButtonElement>("[data-open-dialog]")
    .forEach((button) => {
      const dialog = document.getElementById(
        button.dataset.openDialog!,
      ) as HTMLDialogElement | null;
      if (!dialog) return;
      let previousScroll = 0;
      button.hidden = false;
      button.addEventListener("click", () => {
        previousScroll = window.scrollY;
        dialog.showModal();
        document.body.classList.add("dialog-open");
        document.body.style.position = "fixed";
        document.body.style.top = `-${previousScroll}px`;
        document.body.style.width = "100%";
      });
      dialog
        .querySelector("[data-close-dialog]")
        ?.addEventListener("click", () => dialog.close());
      dialog.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;
        const controls = [
          ...dialog.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          ),
        ];
        const first = controls[0],
          last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      });
      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          dialog.close();
      });
      dialog.addEventListener("close", () => {
        document.body.classList.remove("dialog-open");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo({ top: previousScroll, behavior: "instant" });
        button.focus({ preventScroll: true });
      });
    });
}

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let stepObserver: IntersectionObserver | undefined;
let revealObserver: IntersectionObserver | undefined;
function setupMotion() {
  stepObserver?.disconnect();
  revealObserver?.disconnect();
  if (motionPreference.matches) {
    document
      .querySelectorAll(".step-seen")
      .forEach((e) => e.classList.remove("step-seen"));
    document
      .querySelectorAll(".reveal-observed")
      .forEach((e) => e.classList.remove("reveal-observed"));
    return;
  }
  if (!("IntersectionObserver" in window)) return;
  stepObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.classList.add("step-seen");
          stepObserver?.unobserve(entry.target);
        }
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll("[data-step]:not(.step-seen)")
    .forEach((e) => stepObserver!.observe(e));
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("reveal-observed");
        revealObserver?.unobserve(entry.target);
      }
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(
      ".equipment-card, .catalog-card, .section-heading, .industry-links > a, .industry-briefs > article, .model-planning, .about-service-grid > article, .blog-grid > article",
    )
    .forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight)
        revealObserver!.observe(element);
    });
}
setupMotion();
motionPreference.addEventListener("change", setupMotion);
if (document.querySelector("#quote-island")) {
  Promise.all([
    import("react-dom/client"),
    import("react"),
    import("./QuoteForm"),
  ]).then(([{ hydrateRoot }, React, { QuoteForm }]) =>
    hydrateRoot(
      document.querySelector("#quote-island")!,
      React.createElement(QuoteForm),
    ),
  );
}

// The equipment directory is fully linked in HTML; filtering is an enhancement.
const equipmentSearch =
  document.querySelector<HTMLInputElement>("#equipment-search");
if (equipmentSearch) {
  document.querySelector<HTMLElement>(".equipment-filter")!.hidden = false;
  const applyFilter = () => {
    const term = equipmentSearch.value.trim().toLowerCase();
    let count = 0;
    document
      .querySelectorAll<HTMLElement>("[data-catalog-card]")
      .forEach((card) => {
        card.hidden = !card.dataset.search?.toLowerCase().includes(term);
        if (!card.hidden) count++;
      });
    document
      .querySelectorAll<HTMLElement>("[data-catalog-group]")
      .forEach((group) => {
        group.hidden = !group.querySelector(
          "[data-catalog-card]:not([hidden])",
        );
      });
    document.querySelector("#equipment-search-status")!.textContent =
      `${count} equipment ${count === 1 ? "entry" : "entries"}`;
    document.querySelector<HTMLElement>(".catalog-empty")!.hidden = count > 0;
  };
  equipmentSearch.addEventListener("input", applyFilter);
  document
    .querySelector("#clear-equipment-search")
    ?.addEventListener("click", () => {
      equipmentSearch.value = "";
      applyFilter();
      equipmentSearch.focus();
    });
  document.querySelectorAll("[data-catalog-jump]").forEach((link) =>
    link.addEventListener("click", () => {
      equipmentSearch.value = "";
      applyFilter();
    }),
  );
}

// Native disclosures work before the enhancement bundle arrives.
const servicesNav = document.querySelector<HTMLDetailsElement>(".services-nav");
const servicesTrigger =
  servicesNav?.querySelector<HTMLElement>(".services-trigger");
if (servicesNav && servicesTrigger) {
  const setOpen = (open: boolean) => {
    servicesNav.open = open;
    servicesTrigger.setAttribute("aria-expanded", String(open));
  };
  servicesNav.addEventListener("toggle", () => {
    servicesTrigger.setAttribute("aria-expanded", String(servicesNav.open));
  });
  servicesTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    setOpen(true);
  });
  const categories =
    servicesNav.querySelectorAll<HTMLDetailsElement>(".service-category");
  categories.forEach((category, index) => {
    const trigger = category.querySelector<HTMLElement>(
      ".service-category-link",
    )!;
    trigger.setAttribute("aria-controls", "service-submenu-" + index);
    trigger.nextElementSibling?.setAttribute("id", "service-submenu-" + index);
    const sync = () =>
      trigger.setAttribute("aria-expanded", String(category.open));
    sync();
    category.addEventListener("toggle", sync);
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      categories.forEach((item) => {
        item.open = item === category;
      });
    });
  });
  document.addEventListener("click", (event) => {
    if (!servicesNav.contains(event.target as Node)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && servicesNav.open) {
      setOpen(false);
      servicesTrigger.focus();
    }
  });
}
const mapDialog = document.querySelector<HTMLDialogElement>(".map-dialog");
const mapTrigger =
  document.querySelector<HTMLButtonElement>("[data-expand-map]");
mapTrigger?.addEventListener("click", () => mapDialog?.showModal());
mapDialog
  ?.querySelector("[data-close-map]")
  ?.addEventListener("click", () => mapDialog.close());
mapDialog?.addEventListener("click", (event) => {
  if (event.target === mapDialog) {
    const r = mapDialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      mapDialog.close();
  }
});

const stateDialog = document.querySelector<HTMLDialogElement>(
  "#state-services-dialog",
);
let stateTrigger: HTMLElement | SVGElement | null = null;
const openState = (name: string, trigger: HTMLElement | SVGElement) => {
  if (!stateDialog) return;
  stateTrigger = trigger;
  stateDialog.querySelectorAll("[data-state-name]").forEach((node) => {
    node.textContent = name;
  });
  const guides = Array.from(
    document.querySelectorAll<HTMLElement>("[data-state-guide]"),
  );
  const stateIndex = guides.findIndex(
    (node) => node.dataset.stateGuide === name,
  );
  const guide = guides[stateIndex];
  const stateCode = stateDialog.querySelector<HTMLElement>("[data-state-code]");
  if (stateCode)
    stateCode.textContent = `State ${String(stateIndex + 1).padStart(2, "0")} of ${guides.length}`;
  stateDialog.dataset.stateTheme = String(Math.max(stateIndex, 0) % 6);
  const intro = stateDialog.querySelector("#state-services-intro");
  const question = stateDialog.querySelector("[data-state-question]");
  if (intro)
    intro.textContent =
      guide?.querySelector("[data-guide-intro]")?.textContent ||
      `Discuss rental availability and delivery arrangements for your project in ${name}.`;
  if (question)
    question.textContent =
      guide?.querySelector("[data-guide-question]")?.textContent || "";
  stateDialog.showModal();
};
document.querySelectorAll<SVGElement>("[data-state]").forEach((state) => {
  state.addEventListener("click", () => openState(state.dataset.state!, state));
  state.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openState(state.dataset.state!, state);
    }
  });
});
const statePicker = document.querySelector<HTMLSelectElement>(
  "[data-state-picker]",
);
statePicker?.addEventListener("change", () => {
  openState(statePicker.value, statePicker);
  statePicker.value = "";
});
stateDialog
  ?.querySelector("[data-close-state]")
  ?.addEventListener("click", () => stateDialog.close());
stateDialog?.addEventListener("close", () => {
  if (!contactDrawer?.open) stateTrigger?.focus({ preventScroll: true });
});
stateDialog?.addEventListener("click", (event) => {
  if (event.target !== stateDialog) return;
  const box = stateDialog.getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    stateDialog.close();
});
