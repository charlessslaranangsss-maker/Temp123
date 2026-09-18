import { load } from "cheerio";

export function readableFragmentText(fragment: string) {
  const $ = load(`<body>${fragment}</body>`);
  $("br").replaceWith(" ");
  return $("body").text().replace(/\s+/g, " ").trim();
}
