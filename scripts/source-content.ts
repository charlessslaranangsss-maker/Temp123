import { load } from "cheerio";

type Options = {
  origin: string;
  routes: Set<string>;
  redirects: Map<string, string>;
  media: Record<string, { local?: string }>;
  unresolved: Set<string>;
  dimensions?: Record<string, { width: number; height: number }>;
  removeLeadParagraph?: boolean;
  replacedLead?: string;
};

const verifiedAltByLocalMedia: Record<string, string> = {
  "/media/ce6614a557c75682ffc570f2.png":
    "Emergency base camp CAD site plan with temporary sleeper, shower, restroom, laundry, dining and support units",
  "/media/1ac075338bb250b85779f3e2.png":
    "Four-room deluxe sleeper trailer exterior with entry steps and bunk rooms",
  "/media/0565a9898f04382d02ea17f6.png":
    "Mobile command center office trailer exterior with desks and monitors visible through the open door",
  "/media/2e9e8064f1d689d4bf02d975.png":
    "Mobile command center office trailer exterior with workstations and display screens",
  "/media/cabdb3d7102cfc907e29b9c2.png":
    "Temporary sleeper, office, laundry, shower, restroom and hand-sanitation support facilities",
  "/media/03efc139cc08fb12416ec9f7.png":
    "Temporary mobile kitchen, refrigeration, dishwashing, water, ramp and generator support facilities",
  "/media/42cd0eec786d86ea67fa4fde.png":
    "Mobile kitchen trailer equipment elevation with ovens, skillets, sinks, preparation tables and refrigeration",
  "/media/83eb76b43d26ae91bc2b9c11.png":
    "Forty-foot mobile kitchen trailer equipment elevation with walk-in refrigerator and freezer",
  "/media/ee5ce479c966af021cd6b78b.png":
    "Forty-foot mobile kitchen trailer floor plan with cooking, preparation, sink and refrigeration equipment",
  "/media/30edc5b4ac0956615e579ab5.png":
    "Commercial mobile kitchen trailer interior with stainless-steel ventilation hoods and cooking equipment",
};

export function renderSourceContent(html: string, options: Options) {
  const $ = load(html, undefined, false);
  if (options.removeLeadParagraph) {
    // Site renders the aligned H1 lead. Preserve navigation, images and archives.
    const normalizeLead = (s: string) => s.replace(/\s+/g, ' ').trim();
    const first = $("p").filter((_, el) => Boolean(options.replacedLead) && normalizeLead($(el).text()) === normalizeLead(options.replacedLead || '') && !$(el).find("img").length).first();
    if (first.length) first.remove();
  }
  // These headings introduce repeated global navigation, not page-specific copy.
  // Preserve subsequent peer sections and keep the original archive untouched.
  $("h2,h3,h4,h5,h6").each((_, el) => {
    if (
      !/^(complete list of states and cities of united states|other states we served|top 100 big cities that we served)$/i.test(
        $(el).text().trim(),
      )
    )
      return;
    const level = Number(el.tagName.slice(1));
    let next = el.nextSibling;
    while (next) {
      if (
        next.type === "tag" &&
        /^h[2-6]$/.test(next.tagName) &&
        Number(next.tagName.slice(1)) <= level
      ) break;
      const following = next.nextSibling;
      $(next).remove();
      next = following;
    }
    $(el).replaceWith(
      '<p><a href="/service-areas/">Explore our service areas</a></p>',
    );
  });

  $("img").each((_, el) => {
    const image = $(el);
    const original = image.attr("src") || "";
    const mapped = options.media[original]?.local;
    if (mapped) image.attr("src", mapped);
    else if (/^https?:/.test(original)) {
      options.unresolved.add(original);
      // Retain the source reference in the archive and migration ledger. The
      // existing CSP cannot display remote images; do not emit broken images.
      image.remove();
      return;
    }
    const src = image.attr("src") || "";
    const verifiedAlt = verifiedAltByLocalMedia[src];
    if (verifiedAlt) image.attr("alt", verifiedAlt);
    const size = options.dimensions?.[src];
    if (size)
      image.attr({ width: String(size.width), height: String(size.height) });
    image.attr({ loading: "lazy", decoding: "async" });
  });

  $("a[href]").each((_, el) => {
    const a = $(el),
      href = a.attr("href") || "";
    if (/^(tel:|mailto:|#)/i.test(href)) return;
    let url: URL;
    try {
      url = new URL(href, options.origin);
    } catch {
      return;
    }
    if (
      ![new URL(options.origin).hostname, "www.temporary123.com"].includes(
        url.hostname,
      )
    )
      return;
    const firstTextNode = a
      .contents()
      .toArray()
      .find(
        (node) =>
          node.type === "text" &&
          "data" in node &&
          typeof node.data === "string" &&
          node.data.trim().length > 0,
      );
    if (
      firstTextNode &&
      "data" in firstTextNode &&
      typeof firstTextNode.data === "string"
    )
      firstTextNode.data = firstTextNode.data.replace(
        /^(\s*)([a-z])/,
        (_match: string, space: string, letter: string) =>
          `${space}${letter.toUpperCase()}`,
      );
    const path = url.pathname;
    const suffix = url.search + url.hash;
    const mapped = options.media[new URL(path, options.origin).href]?.local;
    if (mapped) {
      a.attr("href", mapped + suffix);
      return;
    }
    if (options.routes.has(path)) {
      a.attr("href", path + suffix);
      return;
    }
    const redirect = options.redirects.get(path);
    if (redirect) {
      a.attr("href", redirect + suffix);
      return;
    }
    options.unresolved.add(path);
    // An image's enlargement link may be unavailable while its displayed
    // source image is recovered. Link to that actual image, never fake an asset.
    if (/\.(png|jpe?g|webp|gif)$/i.test(path)) {
      const image = a.find("img").first();
      const recovered = image.attr("src");
      if (recovered?.startsWith("/")) {
        a.attr("href", recovered);
        if (!image.attr("alt")) a.attr("aria-label", "View image");
        return;
      }
    }
    // Keep unresolved valuable links visible and explicitly tracked. Never
    // silently turn them into a homepage redirect or claim migration success.
    // Unavailable routes remain readable but are not emitted as broken links.
    const unavailable = $("<span></span>")
      .addClass("migration-link-unavailable")
      .attr("data-unavailable-path", path);
    unavailable.append(a.contents());
    a.replaceWith(unavailable);
  });
  $("a").each((_, el) => {
    if (!$(el).text().trim() && !$(el).find("img").length) $(el).remove();
  });
  $("h2,h3,h4,h5,h6").each((_, el) => {
    const previous = $(el).prevAll("h2,h3,h4,h5,h6").first();
    const max = previous.length ? Number(previous[0].tagName.slice(1)) + 1 : 2;
    if (Number(el.tagName.slice(1)) > max) el.tagName = `h${max}`;
  });
  $("figure").each((_, el) => {
    const figure = $(el);
    if (
      !figure.find("img,picture,iframe,video,figcaption").length &&
      !figure.text().trim()
    )
      figure.remove();
  });
  return $.html();
}
