import "./style.css";
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow-condensed/latin-600.css";
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

const contactDrawer = document.querySelector<HTMLDialogElement>(
  "#contact-drawer",
);
let contactTrigger: HTMLAnchorElement | null = null;
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
    contactScroll = window.scrollY;
    mobileNav?.removeAttribute("open");
    contactDrawer.showModal();
    document.body.classList.add("dialog-open", "contact-drawer-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${contactScroll}px`;
    document.body.style.width = "100%";
    contactDrawer.querySelector<HTMLButtonElement>("[data-close-contact]")?.focus();
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
function setupMotion() {
  stepObserver?.disconnect();
  if (motionPreference.matches) {
    document
      .querySelectorAll(".step-seen")
      .forEach((e) => e.classList.remove("step-seen"));
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
