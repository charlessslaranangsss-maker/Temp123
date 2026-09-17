/* Progressive enhancement: no-JS visitors see all separate product galleries. */
(() => {
  "use strict";
  const key = "__temporary123ProductTabs";
  if (window[key]) {
    window[key].scan(document);
    return;
  }
  const mounted = new Map();
  const inside = (scope, node) =>
    scope === node || Boolean(scope.contains && scope.contains(node));
  const eventFor = (node, name) =>
    node.dispatchEvent(new CustomEvent(name, { bubbles: true }));
  function scan(scope) {
    const galleries = [
      ...(scope.querySelectorAll?.("[data-location-gallery]") || []),
    ];
    if (scope.matches?.("[data-location-gallery]")) galleries.unshift(scope);
    for (const root of galleries) {
      if (mounted.has(root)) continue;
      const list = root.querySelector("[data-product-tabs]");
      const tabs = [...(list?.querySelectorAll("[data-product-tab]") || [])];
      const groups = [...root.querySelectorAll("[data-gallery-group]")];
      if (!list || groups.length < 2 || groups.length !== tabs.length) continue;
      const abort = new AbortController();
      let selected = 0;
      const choose = (index, focus = false, interacting = true) => {
        selected = (index + groups.length) % groups.length;
        // Destroy each isolated carousel before hiding it; closes its lightbox and timer.
        groups.forEach((group) => eventFor(group, "service-carousel:destroy"));
        groups.forEach((group, i) => {
          group.hidden = i !== selected;
          group.setAttribute("role", "tabpanel");
          group.setAttribute("aria-labelledby", tabs[i].id);
          tabs[i].setAttribute("aria-selected", String(i === selected));
          tabs[i].tabIndex = i === selected ? 0 : -1;
        });
        root.dataset.selectedProduct = String(selected);
        window.__temporary123ServiceGalleries?.scan(groups[selected]);
        if (interacting) eventFor(groups[selected], "service-carousel:pause");
        if (focus) tabs[selected].focus({ preventScroll: true });
      };
      mounted.set(root, { abort, groups, tabs, list });
      root.dataset.productTabsReady = "true";
      list.hidden = false;
      choose(0, false, false);
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => choose(index), {
          signal: abort.signal,
        });
        tab.addEventListener(
          "keydown",
          (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            event.stopPropagation();
            choose(
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? tabs.length - 1
                  : selected + (event.key === "ArrowLeft" ? -1 : 1),
              true,
            );
          },
          { signal: abort.signal },
        );
      });
    }
  }
  function cleanup(scope) {
    for (const [root, item] of mounted) {
      if (!inside(scope, root)) continue;
      item.abort.abort();
      item.groups.forEach((group) => {
        group.hidden = false;
        group.removeAttribute("role");
        group.removeAttribute("aria-labelledby");
      });
      item.list.hidden = true;
      delete root.dataset.productTabsReady;
      delete root.dataset.selectedProduct;
      mounted.delete(root);
    }
  }
  document.addEventListener("service-carousel:mount", (event) =>
    queueMicrotask(() => scan(event.target)),
  );
  document.addEventListener("service-carousel:destroy", (event) =>
    cleanup(event.target),
  );
  new MutationObserver(() => {
    for (const [root, item] of mounted)
      if (!root.isConnected) {
        item.abort.abort();
        mounted.delete(root);
      }
  }).observe(document.documentElement, { childList: true, subtree: true });
  window[key] = { scan };
  scan(document);
})();
