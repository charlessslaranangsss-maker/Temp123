import { applyCityRentalView } from "./cityRentalView";
import "./style.css";
import "./redesign.css";
import "./modern.css";
import "./homepage.css";
import "./calculator.css";
import "./contact-refresh.css";
import "./map-refresh.css";
import "./secondary-refresh.css";
import "./location-refresh.css";
import "./seo-dashboard.css";
import "@fontsource-variable/manrope";
import {
  calculateStartingEstimate,
  calculatorDuration,
  calculatorService,
  equipmentPrices,
} from "./calculatorData";

// Most routes use prerendered HTML plus targeted DOM enhancements. The SEO
// dashboard is the exception because its live evidence table is stateful.
// Hydrate only that route so its refresh status and results cannot remain
// frozen in the server-rendered fallback state.
if (location.pathname === "/seo-dashboard/") {
  const root = document.getElementById("root");
  if (root) {
    void Promise.all([import("react-dom/client"), import("./SeoDashboard")]).then(
      ([{ hydrateRoot }, { SeoDashboard }]) => {
        hydrateRoot(root, <SeoDashboard />);
      },
    );
  }
}

let calculatorAppCheck: import("firebase/app-check").AppCheck | undefined;
async function calculatorAppCheckToken() {
  if (!import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY)
    throw new Error(
      "Online quote requests are not enabled yet. Your details have not been sent.",
    );
  const [
    { initializeApp, getApps },
    { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken },
  ] = await Promise.all([import("firebase/app"), import("firebase/app-check")]);
  const app =
    getApps()[0] ||
    initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
  calculatorAppCheck ||= initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
      import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY,
    ),
    isTokenAutoRefreshEnabled: false,
  });
  try {
    return (await getToken(calculatorAppCheck)).token;
  } catch {
    throw new Error(
      "We could not verify the form. Please check your connection and try again.",
    );
  }
}

const calculatorForm = document.querySelector<HTMLFormElement>(
  "#rental-calculator-form",
);
if (calculatorForm) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const submitButton = calculatorForm.querySelector<HTMLButtonElement>(
    "[data-calculator-submit]",
  );
  const calculateButton = calculatorForm.querySelector<HTMLButtonElement>(
    "[data-calculator-calculate]",
  );
  const calculationStatus = calculatorForm.querySelector<HTMLElement>(
    "[data-calculator-status]",
  );
  const submitStatus = calculatorForm.querySelector<HTMLElement>(
    "[data-calculator-submit-status]",
  );
  const planningFieldNames = [
    "state",
    "city",
    "zipCode",
    "equipment",
    "length",
    "people",
    "startDate",
    "endDate",
  ];
  let lastPayload = "";
  let idempotencyKey = "";
  let submitting = false;

  const calculate = () => {
    const endInput = calculatorForm.elements.namedItem(
      "endDate",
    ) as HTMLInputElement;
    endInput.setCustomValidity("");
    for (const name of planningFieldNames) {
      const field = calculatorForm.elements.namedItem(name);
      if (!(field instanceof HTMLElement) || !("checkValidity" in field))
        continue;
      const control = field as HTMLInputElement | HTMLSelectElement;
      if (!control.checkValidity()) {
        control.reportValidity();
        return null;
      }
    }
    const data = new FormData(calculatorForm);
    const startDate = String(data.get("startDate") || "");
    const endDate = String(data.get("endDate") || "");
    const message = document.querySelector<HTMLElement>(
      "[data-estimate-message]",
    );
    if (startDate && endDate && endDate < startDate) {
      endInput.setCustomValidity("End date must be on or after the start date.");
      endInput.reportValidity();
      endInput.addEventListener("input", () => endInput.setCustomValidity(""), {
        once: true,
      });
      return;
    }
    try {
      const estimate = calculateStartingEstimate(
        String(data.get("equipment") || ""),
        Number(data.get("length")),
        Number(data.get("people")),
      );
      document.querySelector<HTMLElement>("[data-estimate-total]")!.textContent =
        currency.format(estimate.total);
      document.querySelector<HTMLElement>("[data-equipment-price]")!.textContent =
        currency.format(estimate.equipment);
      document.querySelector<HTMLElement>("[data-delivery-price]")!.textContent =
        currency.format(estimate.delivery);
      if (message)
        message.textContent =
          "Starting equipment plus delivery estimate. Rental duration and project-specific charges are not included. Call us for discounts!";
      const equipmentId = String(data.get("equipment") || "");
      const equipment = equipmentPrices.find((item) => item.id === equipmentId);
      if (!equipment) throw new RangeError("Choose a listed equipment type.");
      if (calculationStatus) {
        calculationStatus.className = "calculator-submit-status success";
        calculationStatus.textContent =
          "Starting estimate calculated. No contact information was sent.";
      }
      return { data, estimate, equipment, startDate, endDate };
    } catch (error) {
      if (message)
        message.textContent =
          error instanceof Error ? error.message : "Unable to calculate an estimate.";
      if (calculationStatus) {
        calculationStatus.className = "calculator-submit-status error";
        calculationStatus.setAttribute("role", "alert");
        calculationStatus.textContent = "Unable to calculate the starting estimate.";
      }
      return null;
    }
  };

  calculateButton?.addEventListener("click", calculate);

  calculatorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!calculatorForm.reportValidity()) return;
    const calculation = calculate();
    if (!calculation) return;
    const { data, estimate, equipment, startDate, endDate } = calculation;
    try {
      const equipmentId = String(data.get("equipment") || "");
      const state = String(data.get("state") || "").trim();
      const city = String(data.get("city") || "").trim();
      const zipCode = String(data.get("zipCode") || "").trim();
      const projectDetails = String(data.get("projectDetails") || "").trim();
      const length = Number(data.get("length"));
      const people = Number(data.get("people"));
      const payload = JSON.stringify({
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        startDate,
        location: `${city}, ${state}${zipCode ? ` ${zipCode}` : ""}`,
        service: calculatorService(equipmentId),
        duration: calculatorDuration(startDate, endDate),
        industry: String(data.get("industry") || ""),
        message: [
          "Calculator quote request.",
          `Equipment: ${equipment.name}.`,
          `Trailer length: ${length} ft. Number of people: ${people}.`,
          `Rental dates: ${startDate} through ${endDate}.`,
          `Preliminary starting estimate: ${currency.format(estimate.total)} (${currency.format(estimate.equipment)} equipment plus ${currency.format(estimate.delivery)} delivery).`,
          projectDetails ? `Project details: ${projectDetails}` : "Project details: Not provided.",
          "Final pricing, availability and site requirements must be confirmed.",
        ].join("\n"),
        consent: data.get("consent") === "on",
        website: String(data.get("website") || ""),
        page: location.pathname === "/rental-calculator/" ? "/rental-calculator/" : "/",
      });
      if (payload !== lastPayload) {
        idempotencyKey = crypto.randomUUID();
        lastPayload = payload;
      }
      submitting = true;
      calculatorForm.setAttribute("aria-busy", "true");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Saving quote request…";
      }
      if (submitStatus) {
        submitStatus.className = "calculator-submit-status";
        submitStatus.setAttribute("role", "status");
        submitStatus.textContent = "Your estimate is ready. Securely saving your quote request…";
      }
      try {
        const token = await calculatorAppCheckToken();
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Firebase-AppCheck": token,
            "Idempotency-Key": idempotencyKey,
          },
          body: payload,
          signal: AbortSignal.timeout(20_000),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          if (response.status === 429)
            throw new Error("Too many attempts. Please wait a few minutes before trying again.");
          throw new Error(
            typeof result?.error === "string"
              ? result.error
              : "We could not save your quote request. Please try again.",
          );
        }
        if (result?.ok !== true)
          throw new Error("We could not confirm your quote request. Please retry with the same details.");
        if (submitStatus) {
          submitStatus.classList.add("success");
          submitStatus.textContent =
            "Your estimate is ready and your quote request has been saved. Our team can now follow up.";
        }
      } catch (submissionError) {
        if (submitStatus) {
          submitStatus.classList.add("error");
          submitStatus.setAttribute("role", "alert");
          submitStatus.textContent =
            submissionError instanceof Error &&
            ["TimeoutError", "AbortError", "TypeError"].includes(submissionError.name)
              ? "The connection was interrupted. Your estimate and details are still here; try again."
              : submissionError instanceof Error
                ? submissionError.message
                : "We could not save your quote request. Please try again.";
        }
      } finally {
        submitting = false;
        calculatorForm.removeAttribute("aria-busy");
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Request Exact Quote ↗";
        }
      }
    } catch (error) {
      if (submitStatus) {
        submitStatus.className = "calculator-submit-status error";
        submitStatus.setAttribute("role", "alert");
        submitStatus.textContent =
          error instanceof Error
            ? error.message
            : "We could not prepare your quote request. Please try again.";
      }
    }
  });
}

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
const citySearch = document.querySelector<HTMLInputElement>(
  "#city-directory-search",
);
citySearch?.addEventListener("input", () => {
  const term = citySearch.value.trim().toLowerCase();
  let count = 0;
  document.querySelectorAll<HTMLElement>("[data-city-item]").forEach((item) => {
    item.hidden = !item.dataset.cityName?.includes(term);
    if (!item.hidden) count++;
  });
  document
    .querySelectorAll<HTMLElement>(".city-directory-group")
    .forEach((group) => {
      group.hidden = !group.querySelector("[data-city-item]:not([hidden])");
    });
  const status = document.querySelector<HTMLElement>("#city-directory-status");
  if (status) status.textContent = `${count} matching locations`;
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
const emergencyStorageKey = "temporary123:emergency-seen";
const setEmergencyOpen = (dispatch: HTMLElement, open: boolean) => {
  const panel = dispatch.querySelector<HTMLElement>("[data-emergency-panel]");
  const trigger = dispatch.querySelector<HTMLButtonElement>(
    "[data-emergency-open]",
  );
  if (!panel || !trigger) return;
  dispatch.classList.toggle("is-open", open);
  panel.setAttribute("aria-hidden", String(!open));
  trigger.setAttribute("aria-expanded", String(open));
};
document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const trigger = target.closest<HTMLButtonElement>("[data-emergency-open]");
  const close = target.closest<HTMLButtonElement>("[data-emergency-close]");
  const dispatch = (trigger ?? close)?.closest<HTMLElement>(
    "[data-emergency-dispatch]",
  );
  if (!dispatch) return;
  if (trigger) {
    setEmergencyOpen(dispatch, !dispatch.classList.contains("is-open"));
    return;
  }
  setEmergencyOpen(dispatch, false);
  try {
    window.sessionStorage.setItem(emergencyStorageKey, "1");
  } catch {
    // The experience still works when storage is unavailable.
  }
  dispatch.querySelector<HTMLButtonElement>("[data-emergency-open]")?.focus();
});
if (document.querySelector("[data-emergency-dispatch]")) {
  let alreadySeen = false;
  try {
    alreadySeen = window.sessionStorage.getItem(emergencyStorageKey) === "1";
  } catch {
    // Treat blocked storage as a fresh visit.
  }
  if (!alreadySeen) {
    window.setTimeout(() => {
      const dispatch = document.querySelector<HTMLElement>(
        "[data-emergency-dispatch]",
      );
      if (!dispatch) return;
      setEmergencyOpen(dispatch, true);
      try {
        window.sessionStorage.setItem(emergencyStorageKey, "1");
      } catch {
        // The experience still works when storage is unavailable.
      }
    }, 6000);
  }
}
const requestedLocation =
  new URLSearchParams(window.location.search)
    .get("location")
    ?.trim()
    .slice(0, 120) || "";
if (requestedLocation) {
  applyCityRentalView(requestedLocation);
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
    void mountQuoteForm();
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
let quoteHydration: Promise<void> | undefined;
function mountQuoteForm() {
  const island = document.querySelector<HTMLElement>("#quote-island");
  if (!island || quoteHydration) return quoteHydration;
  quoteHydration = Promise.all([
    import("react-dom/client"),
    import("react"),
    import("./QuoteForm"),
  ])
    .then(([{ hydrateRoot }, React, { QuoteForm }]) => {
      hydrateRoot(island, React.createElement(QuoteForm));
    })
    .catch(() => {
      quoteHydration = undefined;
    });
  return quoteHydration;
}
// The form stays server-rendered. Load its interactive code only when needed.
if (
  document.querySelector("#quote-island") &&
  !document.querySelector("#quote-island")?.closest("dialog")
)
  void mountQuoteForm();

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
  const planningTitle = stateDialog.querySelector("#state-seasonal-title");
  if (planningTitle) {
    planningTitle.textContent =
      name === "Iowa"
        ? "Trailer, or Modular Facilities, or Mobile, or Trailer, or Emergency."
        : `Rental Planning Conditions in ${name}`;
  }
  const guides = Array.from(
    (
      document.querySelector<HTMLTemplateElement>("#map-state-guides")
        ?.content || document
    ).querySelectorAll<HTMLElement>("[data-state-guide]"),
  );
  const stateIndex = guides.findIndex(
    (node) => node.dataset.stateGuide === name,
  );
  const guide = guides[stateIndex];
  stateDialog
    .querySelectorAll<HTMLElement>("[data-state-headline]")
    .forEach((node) => {
      node.textContent =
        guide?.dataset.stateHeadline ||
        `Temporary Facilities Rental in ${name}`;
    });
  const stateCode = stateDialog.querySelector<HTMLElement>("[data-state-code]");
  if (stateCode)
    stateCode.textContent = `State ${String(stateIndex + 1).padStart(2, "0")} of ${guides.length}`;
  stateDialog.dataset.stateTheme = String(Math.max(stateIndex, 0) % 6);
  stateDialog.dataset.stateLayout = guide?.dataset.stateLayout || "0";
  stateDialog.dataset.stateMotion = guide?.dataset.stateMotion || "0";
  stateDialog.dataset.stateSignature = String(Math.max(stateIndex, 0) + 1);
  const intro = stateDialog.querySelector("#state-services-intro");
  const question = stateDialog.querySelector("[data-state-question]");
  const focus =
    guide?.querySelector<HTMLElement>("[data-guide-focus]")?.textContent ||
    "Plan for the exact site";
  stateDialog
    .querySelectorAll<HTMLElement>("[data-state-focus]")
    .forEach((node) => {
      node.textContent = focus;
    });
  const stateImage = stateDialog.querySelector<HTMLImageElement>(
    "img[data-state-image]",
  );
  if (stateImage) {
    stateImage.src =
      guide?.dataset.stateImage ||
      "/images/catalog/mobile-kitchen-trailers-960.webp";
    stateImage.alt =
      guide?.dataset.stateImageAlt ||
      "Commercial equipment inside a mobile kitchen trailer";
    const caption = stateDialog.querySelector<HTMLElement>(
      "[data-state-image-caption]",
    );
    if (caption) caption.textContent = stateImage.alt;
  }
  const galleryImages = stateDialog.querySelectorAll<HTMLImageElement>(
    "img[data-state-gallery-image]",
  );
  const gallerySources = [
    [guide?.dataset.stateImageTwo, guide?.dataset.stateImageAltTwo],
    [guide?.dataset.stateImageThree, guide?.dataset.stateImageAltThree],
  ];
  galleryImages.forEach((image, index) => {
    const [src, alt] = gallerySources[index] || [];
    if (src) image.src = src;
    if (alt) image.alt = alt;
    const caption = stateDialog.querySelector<HTMLElement>(
      `[data-state-gallery-caption="${index + 1}"]`,
    );
    if (caption) caption.textContent = image.alt;
  });
  const initials = stateDialog.querySelector<HTMLElement>(
    "[data-state-initials]",
  );
  if (initials)
    initials.textContent = guide?.dataset.stateAbbreviation || name.slice(0, 2);
  if (intro)
    intro.textContent =
      guide?.querySelector("[data-guide-intro]")?.textContent ||
      `Discuss rental availability and delivery arrangements for your project in ${name}.`;
  if (question)
    question.textContent =
      guide?.querySelector("[data-guide-question]")?.textContent || "";
  const statePage =
    stateDialog.querySelector<HTMLAnchorElement>("[data-state-page]");
  if (statePage)
    statePage.href = `/service-areas/${name.toLowerCase().replaceAll(" ", "-")}/`;
  const regions = stateDialog.querySelector("[data-state-regions]");
  const fact = stateDialog.querySelector("[data-state-fact]");
  const servicesCopy = stateDialog.querySelector("[data-state-services-copy]");
  if (regions) {
    regions.replaceChildren();
    const regionNames = guide
      ?.querySelector("[data-guide-regions]")
      ?.querySelectorAll("a");
    if (regionNames?.length) {
      regionNames.forEach((source, index) => {
        const link = document.createElement("a");
        link.href = source.getAttribute("href") || "/service-areas/";
        const number = document.createElement("span");
        number.className = "state-region-number";
        number.setAttribute("aria-hidden", "true");
        number.textContent = String(index + 1).padStart(2, "0");
        const label = document.createElement("strong");
        label.textContent =
          source.textContent?.replace(/\s*↗\s*$/, "") || "Travel region";
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        link.append(number, label, arrow);
        regions.append(link);
      });
    } else {
      regions.textContent = "Confirm the exact service area";
    }
  }
  if (fact)
    fact.textContent =
      guide?.querySelector("[data-guide-fact]")?.textContent ||
      "Confirm the exact project location.";
  if (servicesCopy)
    servicesCopy.textContent =
      guide?.querySelector("[data-guide-services]")?.textContent ||
      "Basecamp and supporting temporary facility rentals are available.";
  const citySection = stateDialog.querySelector<HTMLElement>(
    "[data-state-cities]",
  );
  let hasPublishedCities = false;
  citySection
    ?.querySelectorAll<HTMLElement>("[data-map-city-state]")
    .forEach((group) => {
      const matchesState = group.dataset.mapCityState === name;
      group.hidden = !matchesState;
      hasPublishedCities ||= matchesState;
    });
  if (citySection) citySection.hidden = !hasPublishedCities;
  const seasonalCopy = stateDialog.querySelector<HTMLElement>(
    "[data-state-seasonal-copy]",
  );
  if (seasonalCopy) {
    seasonalCopy.replaceChildren();
    guide
      ?.querySelectorAll<HTMLElement>("[data-guide-seasonal-copy] p")
      .forEach((source) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = source.textContent;
        seasonalCopy.append(paragraph);
      });
  }
  const demand = stateDialog.querySelector<HTMLElement>("[data-state-demand]");
  const demandCode = stateDialog.querySelector<HTMLElement>(
    "[data-state-demand-code]",
  );
  if (demand)
    demand.textContent =
      guide?.querySelector<HTMLElement>("[data-guide-demand]")?.textContent ||
      "";
  if (demandCode)
    demandCode.textContent = `Code ${guide?.dataset.stateDemandCode || "3"} · ${guide?.dataset.stateDemandLabel || "Moderate"}`;
  const seasonalSources = stateDialog.querySelector<HTMLElement>(
    "[data-state-seasonal-sources]",
  );
  if (seasonalSources) {
    seasonalSources.replaceChildren();
    guide
      ?.querySelectorAll<HTMLAnchorElement>("[data-guide-sources] a")
      .forEach((source) => {
        const link = document.createElement("a");
        link.href = source.href;
        link.textContent = source.textContent;
        link.target = "_blank";
        link.rel = "external noreferrer";
        seasonalSources.append(link);
      });
  }
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
