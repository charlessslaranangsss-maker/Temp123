(() => {
  const carousels = document.querySelectorAll("[data-service-carousel]");

  const getLightbox = () => {
    let lightbox = document.querySelector("[data-service-image-lightbox]");
    if (lightbox) return lightbox;

    lightbox = document.createElement("div");
    lightbox.className = "service-image-lightbox";
    lightbox.dataset.serviceImageLightbox = "true";
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <div class="service-image-lightbox__backdrop" data-lightbox-close></div>
      <div class="service-image-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="service-image-lightbox-caption" tabindex="-1">
        <button type="button" class="service-image-lightbox__close" data-lightbox-close aria-label="Close full image">×</button>
        <img class="service-image-lightbox__image" data-lightbox-image alt="">
        <p class="service-image-lightbox__caption" id="service-image-lightbox-caption" data-lightbox-caption></p>
      </div>`;
    document.body.append(lightbox);
    return lightbox;
  };

  const lightbox = getLightbox();
  const lightboxDialog = lightbox.querySelector("[role='dialog']");
  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
  let returnFocus = null;

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("service-lightbox-open");
    returnFocus?.focus?.();
    returnFocus = null;
  };

  const openLightbox = (trigger) => {
    const image = trigger.querySelector("img");
    if (!image || !lightboxImage || !lightboxCaption) return;
    const alt = image.dataset.carouselAlt || image.alt || "Equipment image";
    returnFocus = trigger;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt;
    lightbox.hidden = false;
    document.body.classList.add("service-lightbox-open");
    lightboxDialog?.focus();
  };

  lightbox.querySelectorAll("[data-lightbox-close]").forEach((control) =>
    control.addEventListener("click", closeLightbox),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  for (const carousel of carousels) {
    if (carousel.dataset.carouselReady === "true") continue;

    const viewport = carousel.querySelector(".service-carousel-viewport");
    const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
    const selectors = [...carousel.querySelectorAll("[data-carousel-select]")];
    const position = carousel.querySelector("[data-carousel-position]");
    const overlayPosition = carousel.querySelector(
      "[data-carousel-position-overlay]",
    );
    const activeView = carousel.querySelector("[data-carousel-view]");
    const toggle = carousel.querySelector("[data-carousel-toggle]");
    const behavior = carousel.querySelector("[data-carousel-behavior]");
    const status = carousel.querySelector(".service-carousel-status");
    if (!viewport || slides.length === 0) continue;

    carousel.dataset.carouselReady = "true";
    let activeIndex = 0;
    let pointerStartX = null;
    let pointerStartY = null;
    let autoplayTimer = null;
    let userPaused = false;
    const autoplayInterval = Math.max(
      100,
      Number.parseInt(carousel.dataset.carouselInterval || "5500", 10) || 5500,
    );
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const show = (nextIndex, announce = false) => {
      if (status) status.setAttribute("aria-live", announce ? "polite" : "off");
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.dataset.active = String(active);
        slide.toggleAttribute("aria-hidden", !active);
        const image = slide.querySelector("img");
        if (image) image.alt = active ? image.dataset.carouselAlt || "" : "";
      });
      selectors.forEach((button, index) =>
        button.setAttribute("aria-pressed", String(index === activeIndex)),
      );
      if (position) position.textContent = String(activeIndex + 1);
      if (overlayPosition)
        overlayPosition.textContent = String(activeIndex + 1);
      if (activeView)
        activeView.textContent =
          selectors[activeIndex]?.dataset.carouselViewLabel || "";
    };

    const stopAutoplay = () => {
      if (autoplayTimer !== null) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };
    const updateToggle = () => {
      if (!toggle) return;
      const reduced = motionPreference.matches;
      toggle.disabled = reduced;
      toggle.textContent = reduced
        ? "Motion off"
        : userPaused
          ? "Play"
          : "Pause";
      toggle.setAttribute(
        "aria-label",
        reduced
          ? "Slideshow paused because reduced motion is enabled"
          : userPaused
            ? "Play slideshow"
            : "Pause slideshow",
      );
      if (behavior) {
        behavior.textContent = reduced
          ? "Automatic motion is off for your reduced-motion preference."
          : userPaused
            ? "Slideshow paused. Choose Play to resume."
            : "Auto-advances. Choosing an image pauses the slideshow.";
      }
    };
    const startAutoplay = () => {
      stopAutoplay();
      if (
        carousel.dataset.carouselAutoplay !== "true" ||
        userPaused ||
        motionPreference.matches ||
        document.hidden
      )
        return;
      autoplayTimer = window.setInterval(
        () => show(activeIndex + 1),
        autoplayInterval,
      );
    };
    const showFromInteraction = (nextIndex) => {
      userPaused = true;
      stopAutoplay();
      updateToggle();
      show(nextIndex, true);
    };

    carousel.querySelectorAll("[data-carousel-zoom]").forEach((trigger) =>
      trigger.addEventListener("click", () => openLightbox(trigger)),
    );

    if (slides.length < 2) continue;

    toggle?.addEventListener("click", () => {
      if (motionPreference.matches) return;
      userPaused = !userPaused;
      updateToggle();
      if (userPaused) stopAutoplay();
      else startAutoplay();
    });

    carousel
      .querySelector("[data-carousel-previous]")
      ?.addEventListener("click", () => showFromInteraction(activeIndex - 1));
    carousel
      .querySelector("[data-carousel-next]")
      ?.addEventListener("click", () => showFromInteraction(activeIndex + 1));
    selectors.forEach((button, index) =>
      button.addEventListener("click", () => showFromInteraction(index)),
    );

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showFromInteraction(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showFromInteraction(activeIndex + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        showFromInteraction(0);
      } else if (event.key === "End") {
        event.preventDefault();
        showFromInteraction(slides.length - 1);
      }
    });

    viewport.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary) return;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
    });
    viewport.addEventListener("pointerup", (event) => {
      if (pointerStartX === null || pointerStartY === null) return;
      const horizontal = event.clientX - pointerStartX;
      const vertical = event.clientY - pointerStartY;
      pointerStartX = null;
      pointerStartY = null;
      if (
        Math.abs(horizontal) < 40 ||
        Math.abs(horizontal) <= Math.abs(vertical)
      )
        return;
      showFromInteraction(activeIndex + (horizontal < 0 ? 1 : -1));
    });
    viewport.addEventListener("pointercancel", () => {
      pointerStartX = null;
      pointerStartY = null;
    });

    carousel.addEventListener("pointerenter", stopAutoplay);
    carousel.addEventListener("pointerleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) startAutoplay();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });
    motionPreference.addEventListener?.("change", () => {
      updateToggle();
      if (motionPreference.matches) stopAutoplay();
      else startAutoplay();
    });
    updateToggle();
    startAutoplay();
  }
})();
