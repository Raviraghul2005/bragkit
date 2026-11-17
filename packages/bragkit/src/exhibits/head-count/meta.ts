import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "020",
  slug: "head-count",
  name: "Head Count",
  component: "HeadCount",
  wing: "South",
  summary: "How many people have been through.",
  object: "A mechanical counter with digit wheels behind a window.",
  moment: "The wheels roll like an odometer when the counter comes into view, and again every time the number changes.",
  how: "You pass the number; Bragkit does not count visitors for you. Feed it from your analytics or a small counter of your own, and it rolls to each new value. Set live only when the number really is updating.",
  props: {
    count: { type: "number", default: 0, min: 0, max: 99999, step: 1, description: "The number on the counter." },
    label: { type: "string", default: "visitors", description: "What is being counted." },
    digits: { type: "number", default: 5, min: 1, max: 8, step: 1, description: "How many wheels, at least." },
    live: { type: "boolean", default: false, description: "Shows the live dot. Only for a count fed by live data." },
    tone: toneProp("plain", "the housing"),
  },
  example: { count: 1284, label: "visitors" },
  live: false,
  client: true,
};
