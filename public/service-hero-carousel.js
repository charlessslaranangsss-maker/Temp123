/* Shared, idempotent gallery controller. State changes explicitly destroy and remount it. */
(() => {
  "use strict";
  const namespace = "__temporary123ServiceGalleries";
  if (window[namespace]) {
    window[namespace].scan(document);
    return;
  }
  const controllers = new Map();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lightbox,
    lightboxController = null,
    lightboxTrigger = null;

  function closeLightbox() {
    if (!lightbox || !lightbox.open) return;
    lightbox.close();
  }
  function renderLightbox() {
    const controller = lightboxController;
    if (!controller || !lightbox) return;
    const source = controller.slides[controller.index].querySelector("img");
    const image = lightbox.querySelector("[data-lightbox-image]");
    // Opt-in group identity stays with the full image, even above a state modal.
    const productLabel = controller.root.dataset.carouselLightboxLabel || "";
    const title = lightbox.querySelector("[data-lightbox-title]");
    title.textContent = productLabel;
    title.hidden = !productLabel;
    lightbox.setAttribute(
      "aria-label",
      productLabel ? productLabel + " full image" : "Full equipment image",
    );
    const reference = lightbox.querySelector("[data-lightbox-reference]");
    reference.textContent = productLabel
      ? controller.root.querySelector("[data-carousel-caption]")?.textContent ||
        ""
      : "";
    reference.hidden = !reference.textContent;
    const url =
      source.dataset.carouselFullSrc || source.currentSrc || source.src;
    image.style.visibility = "hidden";
    image.alt = source.dataset.carouselAlt || source.alt;
    image.onload = () => {
      image.style.visibility = "visible";
    };
    image.onerror = () => {
      lightbox.querySelector("[data-lightbox-caption]").textContent =
        "The full image could not be loaded. Close and retry.";
    };
    image.src = url;
    if (image.complete && image.naturalWidth)
      image.style.visibility = "visible";
    lightbox.querySelector("[data-lightbox-caption]").textContent = image.alt;
    lightbox.querySelector("[data-lightbox-position]").textContent =
      controller.index + 1 + " of " + controller.slides.length;
    lightbox
      .querySelectorAll("[data-lightbox-previous], [data-lightbox-next]")
      .forEach((button) => {
        button.hidden = controller.slides.length < 2;
      });
  }
  function lightboxNavigate(delta) {
    if (!lightboxController) return;
    lightboxController.navigate(lightboxController.index + delta);
    renderLightbox();
  }
  function getLightbox() {
    if (lightbox && lightbox.isConnected) return lightbox;
    lightbox = document.createElement("dialog");
    lightbox.className = "service-image-lightbox";
    lightbox.setAttribute("data-service-image-lightbox", "");
    lightbox.setAttribute("aria-label", "Full equipment image");
    lightbox.innerHTML =
      '<div class="service-image-lightbox-backdrop" data-lightbox-outside></div><div class="service-image-lightbox-dialog" tabindex="-1"><button type="button" class="service-image-lightbox-close" data-lightbox-close aria-label="Close full image">Close ×</button><h2 data-lightbox-title hidden></h2><div class="service-image-lightbox-stage"><button type="button" class="service-image-lightbox-prev" data-lightbox-previous aria-label="Previous full image">←</button><img data-lightbox-image alt=""><button type="button" class="service-image-lightbox-next" data-lightbox-next aria-label="Next full image">→</button></div><div class="service-image-lightbox-footer"><div><p data-lightbox-caption></p><p data-lightbox-reference hidden></p></div><span data-lightbox-position aria-live="polite"></span></div></div>';
    document.body.append(lightbox);
    lightbox.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      if (
        event.target === lightbox ||
        event.target.closest("[data-lightbox-outside], [data-lightbox-close]")
      )
        closeLightbox();
      else if (event.target.closest("[data-lightbox-previous]"))
        lightboxNavigate(-1);
      else if (event.target.closest("[data-lightbox-next]"))
        lightboxNavigate(1);
    });
    lightbox.addEventListener("cancel", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeLightbox();
    });
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        const controls = Array.from(
          lightbox.querySelectorAll("button:not([disabled]):not([hidden])"),
        ).filter((control) => control.getClientRects().length > 0);
        if (controls.length) {
          event.preventDefault();
          event.stopPropagation();
          const current = controls.indexOf(document.activeElement);
          const next =
            current < 0
              ? event.shiftKey
                ? controls.length - 1
                : 0
              : (current + (event.shiftKey ? -1 : 1) + controls.length) %
                controls.length;
          controls[next].focus({ preventScroll: true });
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLightbox();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        lightboxNavigate(event.key === "ArrowLeft" ? -1 : 1);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        event.stopPropagation();
        if (lightboxController) {
          lightboxController.navigate(
            event.key === "Home" ? 0 : lightboxController.slides.length - 1,
          );
          renderLightbox();
        }
      }
    });
    lightbox.addEventListener("close", () => {
      const trigger = lightboxTrigger;
      lightboxController = null;
      lightboxTrigger = null;
      const image = lightbox.querySelector("[data-lightbox-image]");
      image.onload = null;
      image.onerror = null;
      image.removeAttribute("src");
      image.alt = "";
      for (const selector of [
        "[data-lightbox-title]",
        "[data-lightbox-reference]",
      ]) {
        const element = lightbox.querySelector(selector);
        element.textContent = "";
        element.hidden = true;
      }
      lightbox.setAttribute("aria-label", "Full equipment image");
      if (
        trigger &&
        trigger.isConnected &&
        (!trigger.closest("dialog") || trigger.closest("dialog").open)
      )
        trigger.focus({ preventScroll: true });
    });
    return lightbox;
  }
  function openLightbox(controller, trigger) {
    controller.pause();
    const box = getLightbox();
    lightboxController = controller;
    lightboxTrigger = trigger;
    renderLightbox();
    if (!box.open) box.showModal();
    box
      .querySelector(".service-image-lightbox-dialog")
      .focus({ preventScroll: true });
  }

  function destroy(root) {
    const controller = controllers.get(root);
    if (!controller) return;
    if (lightboxController === controller) closeLightbox();
    controller.stop();
    controller.abort.abort();
    controllers.delete(root);
    delete root.dataset.carouselReady;
  }
  function mount(root) {
    if (!(root instanceof HTMLElement)) return;
    if (controllers.has(root) && root.dataset.carouselReady === "true") return;
    destroy(root);
    const slides = [...root.querySelectorAll("[data-carousel-slide]")];
    if (!slides.length) return;
    const abort = new AbortController();
    const options = { signal: abort.signal };
    const thumbnails = [...root.querySelectorAll("[data-carousel-select]")];
    const toggle = root.querySelector("[data-carousel-toggle]");
    const behavior = root.querySelector("[data-carousel-behavior]");
    let index = 0,
      timer = null,
      userPaused = false,
      hover = false,
      pointer = null,
      suppressClickUntil = 0;
    const controller = {
      root,
      slides,
      abort,
      get index() {
        return index;
      },
      stop,
      pause,
      navigate,
      start,
    };
    controllers.set(root, controller);
    root.dataset.carouselReady = "true";
    function stop() {
      if (timer !== null) clearInterval(timer);
      timer = null;
      root.dataset.carouselRunning = "false";
    }
    function eligible() {
      const dialog = root.closest("dialog");
      return (
        slides.length > 1 &&
        root.dataset.carouselAutoplay === "true" &&
        !userPaused &&
        !motion.matches &&
        !document.hidden &&
        root.isConnected &&
        root.getClientRects().length > 0 &&
        (!dialog || dialog.open) &&
        !hover &&
        !pointer &&
        !root.contains(document.activeElement) &&
        lightboxController !== controller
      );
    }
    function updateControls() {
      root
        .querySelector(".service-carousel-status")
        ?.setAttribute(
          "aria-live",
          userPaused || motion.matches ? "polite" : "off",
        );
      if (toggle) {
        toggle.disabled = motion.matches;
        toggle.textContent = motion.matches
          ? "Motion off"
          : userPaused
            ? "Play"
            : "Pause";
        toggle.setAttribute(
          "aria-label",
          motion.matches
            ? "Autoplay disabled for reduced motion"
            : (userPaused ? "Play" : "Pause") + " equipment slideshow",
        );
      }
      if (behavior)
        behavior.textContent = motion.matches
          ? "Reduced motion: use the image controls to navigate."
          : userPaused
            ? "Slideshow paused. Choose Play to resume after interaction."
            : "Auto-advances when you are not interacting with the gallery.";
    }
    function start() {
      stop();
      updateControls();
      if (!eligible()) return;
      timer = setInterval(
        () => {
          if (!eligible()) {
            stop();
            return;
          }
          show(index + 1);
        },
        Math.max(100, Number(root.dataset.carouselInterval) || 5500),
      );
      root.dataset.carouselRunning = "true";
    }
    function pause() {
      userPaused = true;
      stop();
      updateControls();
    }
    function show(next) {
      index = (next + slides.length) % slides.length;
      root.dataset.carouselIndex = String(index);
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.dataset.active = String(active);
        slide.hidden = !active;
        if (active) slide.removeAttribute("aria-hidden");
        else slide.setAttribute("aria-hidden", "true");
        const image = slide.querySelector("img");
        if (image) image.alt = active ? image.dataset.carouselAlt || "" : "";
        const button = slide.querySelector("[data-carousel-zoom]");
        if (button) button.tabIndex = active ? 0 : -1;
      });
      thumbnails.forEach((thumb, i) =>
        thumb.setAttribute("aria-pressed", String(i === index)),
      );
      root
        .querySelectorAll(
          "[data-carousel-position], [data-carousel-position-overlay]",
        )
        .forEach((el) => {
          el.textContent = String(index + 1);
        });
      const label = root.querySelector(
        ".service-carousel-overlay [data-carousel-view]",
      );
      if (label)
        label.textContent =
          thumbnails[index]?.dataset.carouselViewLabel ||
          {
            interior: "Interior",
            exterior: "Exterior",
            detail: "Interior detail",
            plan: "Floor plan",
          }[slides[index].dataset.imageView] ||
          "Equipment view";
    }
    function navigate(next) {
      pause();
      show(next);
    }
    root.addEventListener(
      "click",
      (event) => {
        if (performance.now() < suppressClickUntil) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        if (!(event.target instanceof Element)) return;
        const target = event.target;
        const thumb = target.closest("[data-carousel-select]");
        if (thumb) navigate(Number(thumb.dataset.carouselSelect));
        else if (target.closest("[data-carousel-previous]"))
          navigate(index - 1);
        else if (target.closest("[data-carousel-next]")) navigate(index + 1);
        else if (target.closest("[data-carousel-toggle]")) {
          userPaused = !userPaused;
          start();
        } else if (target.closest("[data-carousel-zoom]"))
          openLightbox(controller, target.closest("[data-carousel-zoom]"));
      },
      options,
    );
    root.addEventListener(
      "keydown",
      (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        navigate(
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? slides.length - 1
              : index + (event.key === "ArrowLeft" ? -1 : 1),
        );
      },
      options,
    );
    root.addEventListener(
      "pointerenter",
      (event) => {
        if (event.pointerType !== "touch") {
          hover = true;
          stop();
        }
      },
      options,
    );
    root.addEventListener(
      "pointerleave",
      () => {
        hover = false;
        start();
      },
      options,
    );
    root.addEventListener("focusin", stop, options);
    root.addEventListener("focusout", () => queueMicrotask(start), options);
    root.addEventListener(
      "pointerdown",
      (event) => {
        if (!event.target.closest(".service-carousel-viewport")) return;
        pointer = { x: event.clientX, y: event.clientY };
        stop();
      },
      options,
    );
    window.addEventListener(
      "pointerup",
      (event) => {
        if (!pointer) return;
        const dx = event.clientX - pointer.x,
          dy = event.clientY - pointer.y;
        pointer = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          suppressClickUntil = performance.now() + 450;
          navigate(index + (dx < 0 ? 1 : -1));
        } else start();
      },
      options,
    );
    root.addEventListener(
      "pointercancel",
      () => {
        pointer = null;
        start();
      },
      options,
    );
    show(0);
    start();
  }
  function scan(scope) {
    if (scope instanceof Element && scope.matches("[data-service-carousel]"))
      mount(scope);
    scope.querySelectorAll?.("[data-service-carousel]").forEach(mount);
  }
  document.addEventListener("service-carousel:destroy", (event) => {
    const scope = event.target;
    for (const root of controllers.keys())
      if (scope === root || scope.contains?.(root)) destroy(root);
  });
  document.addEventListener("service-carousel:mount", (event) =>
    scan(event.target),
  );
  document.addEventListener("service-carousel:pause", (event) => {
    const scope = event.target;
    for (const [root, controller] of controllers)
      if (scope === root || scope.contains?.(root)) controller.pause();
  });
  document.addEventListener("visibilitychange", () =>
    controllers.forEach((c) => c.start()),
  );
  motion.addEventListener("change", () =>
    controllers.forEach((c) => c.start()),
  );
  new MutationObserver(() => {
    for (const root of controllers.keys()) if (!root.isConnected) destroy(root);
  }).observe(document.documentElement, { childList: true, subtree: true });
  window[namespace] = { scan };
  scan(document);
})();
