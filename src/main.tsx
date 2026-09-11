import "./style.css";
import "./mobile-fixes.css";
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
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    document
      .querySelector<HTMLDetailsElement>(".mobile-nav")
      ?.removeAttribute("open");
});
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
