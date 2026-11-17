import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "002",
  slug: "shipping-streak",
  name: "Shipping Streak",
  component: "ShippingStreak",
  wing: "East",
  summary: "Every day you ship adds a tile. Miss one and everyone can tell.",
  object: "A wall of glazed tiles, one per day.",
  moment: "Hover a tile and it lifts and shows its date. Today's tile pulses once when the wall loads.",
  how: "Give it the day the streak began, or a list of days you shipped. It counts in the visitor's time zone, so the wall is drawn in the browser and shows empty sockets until then. Pass a GitHub username and it reads public pushes instead, with no key, and marks itself live.",
  props: {
    start: { type: "string", placeholder: "2026-09-29", description: "The day the streak began. Every day since counts as shipped." },
    history: { type: "json", shape: "(string | number | Date)[]", description: "Days you shipped, as YYYY-MM-DD strings, timestamps or Dates. Can be used with start, for the days before it." },
    days: { type: "number", default: 28, min: 7, max: 56, step: 7, description: "How many tiles are on the wall, seven per row." },
    count: { type: "number", min: 0, max: 999, description: "Show this number instead of the counted streak." },
    user: { type: "string", placeholder: "GitHub username", description: "Reads public pushes from GitHub (about the last 90 days) and shows the live dot." },
    zone: { type: "string", placeholder: "Europe/Lisbon", description: "Time zone that decides where a day ends. Default: the visitor's." },
    caption: { type: "string", default: "Shipping streak", description: "Small heading." },
    tone: toneProp("apricot", "the wall"),
  },
  example: { start: "2026-10-19", history: ["2026-10-12", "2026-10-13", "2026-10-15", "2026-10-16"], days: 35 },
  live: true,
  client: true,
};
