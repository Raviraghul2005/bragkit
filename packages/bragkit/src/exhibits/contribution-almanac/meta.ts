import { toneProp, type ExhibitMeta } from "../../internal/meta";
import { sampleContributions } from "./almanac";

export const meta: ExhibitMeta = {
  number: "009",
  slug: "contribution-almanac",
  name: "Contribution Almanac",
  component: "ContributionAlmanac",
  wing: "West",
  summary: "Your year of contributions, month by month, with the numbers that matter.",
  object: "A printed almanac card pinned to the wall: twelve small calendar pages and a row of figures.",
  moment: "The days are stamped in, month by month, as the card comes into view. Point at any day or month and the readout line says what happened.",
  how: "Give it a GitHub username and it loads that user's public contributions for the last year from a free, keyless public service (github-contributions-api.jogruber.de), then shows the live dot. Or pass your own day counts from anywhere. Months wrap to fit, so it never scrolls sideways on a phone. Shades follow GitHub's rule: each is a quarter of your busy days.",
  props: {
    user: { type: "string", placeholder: "GitHub username", description: "Loads this user's public contributions for the last year. No key needed." },
    data: { type: "json", shape: "{ date: string | number | Date; count: number }[]", description: "Your own day counts, if you are not using user." },
    end: { type: "string", placeholder: "2026-11-14", description: "The last day on the card. Default: today with user, else the latest day in data." },
    months: { type: "number", default: 12, min: 3, max: 24, step: 1, description: "How many months, ending with the month of end." },
    perRow: { type: "enum", options: ["12", "6", "4", "3", "2"], default: "6", description: "How many months sit side by side when there is room: 12 is one long strip. Fewer fit on a narrow screen, always in even rows." },
    href: { type: "string", placeholder: "https://github.com/you", description: "A link for the corner. Default with user: their GitHub profile." },
    unit: { type: "string", default: "contributions", description: "What is being counted." },
    caption: { type: "string", default: "Contributions", description: "Small heading." },
    tone: toneProp("mint", "the ink (plain is black ink)"),
  },
  example: { data: sampleContributions("2026-11-14"), href: "https://github.com" },
  live: true,
  client: true,
};
