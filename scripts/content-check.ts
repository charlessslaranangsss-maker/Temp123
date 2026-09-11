import { services } from "../src/content";
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const pages = services.map((s) => {
  const text = [
    s.tag,
    s.name,
    s.intro,
    "Discuss this requirement",
    ...s.sections.flat(),
    "Share your site details",
    "Useful questions",
    ...s.faq.flat(),
    "Related planning: prepare your site brief or explore other facilities.",
  ].join(" ");
  return {
    route: `/services/${s.slug}/`,
    words: text.match(/\b[\w]+(?:[-’'][\w]+)*\b/g)!.length,
    hash: createHash("sha256").update(text).digest("hex"),
  };
});
writeFileSync(
  "audit/content-review.json",
  JSON.stringify(
    {
      scope:
        "Service main title, intro, headings, section bodies, CTA labels, FAQs and related links. Excludes shared nav/footer, closing CTA panel and repeated sidebar headings.",
      pages,
      exactDuplicateBodies:
        pages.length - new Set(pages.map((p) => p.hash)).size,
      limitations:
        "Only four new draft bodies compared. Original main content unavailable; semantic/source-site comparison remains open.",
    },
    null,
    2,
  ),
);
console.log(pages);
