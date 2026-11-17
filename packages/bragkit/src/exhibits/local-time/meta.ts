import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "003",
  slug: "local-time",
  name: "Local Time",
  component: "LocalTime",
  wing: "East",
  summary: "Your clock, for people in other time zones.",
  object: "A small arched window with the sky behind it.",
  moment: "The sky is the colour of the hour where you live, and the sun or the moon sits where it should on its arc.",
  how: "The time comes from the visitor's own clock and your time zone, so there is nothing to fetch. It is drawn in the browser: the server renders an empty window of the same size. The sky follows the clock, not the real sunrise for your latitude.",
  props: {
    zone: {
      type: "enum",
      options: ["Europe/Lisbon", "America/New_York", "America/Los_Angeles", "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney"],
      description: "Any IANA time zone. Default: the visitor's own zone.",
    },
    label: { type: "string", placeholder: "Default: the city", description: "Place shown under the clock." },
    format: { type: "enum", options: ["12h", "24h"], default: "12h", description: "12-hour clock with AM/PM, or 24-hour." },
    note: { type: "string", placeholder: "Default: a guess from the hour", description: "Line after the place." },
    caption: { type: "string", default: "Local time", description: "Small heading." },
    at: { type: "string", placeholder: "2026-06-21T06:40:00Z", description: "Show this moment instead of now. The clock then stands still." },
    tone: toneProp("plain", "the window frame"),
  },
  example: { zone: "Europe/Lisbon" },
  live: true,
  client: true,
};
