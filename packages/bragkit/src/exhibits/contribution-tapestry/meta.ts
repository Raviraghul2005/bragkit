import { toneProp, type ExhibitMeta } from "../../internal/meta";
import { sampleContributions } from "./weave";

export const meta: ExhibitMeta = {
  number: "009",
  slug: "contribution-tapestry",
  name: "Contribution Tapestry",
  component: "ContributionTapestry",
  wing: "West",
  summary: "Half a year of activity, woven into a cloth.",
  object: "A woven cloth hanging from a brass rod, with a fringe.",
  moment: "Hover a row and it lifts like fabric; the stitch under the pointer tells you its day.",
  how: "Pass one count per day. Each day is a stitch, coloured by how busy it was compared with your busiest day. It is plain HTML and CSS with no script, so it renders on the server. The data can come from anywhere: GitHub, your own commit log, words written.",
  props: {
    data: { type: "json", shape: "{ date: string | number | Date; count: number }[]", description: "One entry per day that had any activity." },
    weeks: { type: "number", default: 26, min: 8, max: 52, step: 1, description: "How many weeks of cloth. 52 is a year, and needs a wide space." },
    end: { type: "string", placeholder: "2026-11-14", description: "The last day on the cloth. Default: the latest day in data." },
    unit: { type: "string", default: "contributions", description: "What is being counted, for the caption and the tooltips." },
    caption: { type: "string", default: "Contributions", description: "Small heading." },
    tone: toneProp("lilac", "the cloth and the thread"),
  },
  example: { data: sampleContributions("2026-11-14", 26), weeks: 26 },
  live: false,
  client: false,
};
