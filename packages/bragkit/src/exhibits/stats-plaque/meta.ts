import type { ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "012",
  slug: "stats-plaque",
  name: "Stats Plaque",
  component: "StatsPlaque",
  wing: "West",
  summary: "Your numbers, engraved in brass.",
  object: "An engraved brass plaque with a screw in each corner.",
  moment: "The numbers count up when the plaque scrolls into view, and one sweep of light crosses the brass.",
  how: "Pass a label and a value for each number. Values can be numbers or text such as 1.2k, 99% or $40: the number inside counts up and the rest stays put. The server renders the finished numbers, and the finished width is reserved, so nothing shifts.",
  props: {
    stats: { type: "json", shape: "{ label: string; value: number | string }[]", description: "The numbers on the plaque. Two to six fit best." },
    title: { type: "string", default: "By the numbers", description: "The line engraved at the top." },
  },
  example: {
    stats: [
      { label: "Commits", value: 4812 },
      { label: "Stars", value: "1.2k" },
      { label: "Projects shipped", value: 23 },
      { label: "Uptime", value: "99.9%" },
    ],
  },
  live: false,
  client: true,
};
