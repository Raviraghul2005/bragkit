import type { ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "011",
  slug: "ship-log",
  name: "Ship Log",
  component: "ShipLog",
  wing: "West",
  summary: "What you shipped, and when.",
  object: "A museum timeline: a thin rail on the wall with a brass pin for each entry.",
  moment: "The entries settle onto the rail one by one when the timeline scrolls into view.",
  how: "Pass the entries, newest first. Each one has a date and a title, and can have a link and one more line. The server renders the whole list, so it reads fine with no script. An empty log says so.",
  props: {
    entries: { type: "json", shape: "{ date: string; title: string; href?: string; note?: string }[]", description: "What you shipped, newest first. Dates like 2026-11-02 are shown as 2 Nov 2026." },
    caption: { type: "string", default: "Ship log", description: "Small heading." },
  },
  example: {
    entries: [
      { date: "2026-11-09", title: "Dark mode, finally", note: "Only took three tries." },
      { date: "2026-10-21", title: "tiny-router 2.0", href: "https://example.com" },
      { date: "2026-09-30", title: "A talk about build tools" },
      { date: "2026-08-12", title: "The portfolio you are looking at" },
    ],
  },
  live: false,
  client: true,
};
