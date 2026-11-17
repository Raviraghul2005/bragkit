import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "004",
  slug: "status-card",
  name: "Status Card",
  component: "StatusCard",
  wing: "East",
  summary: "One line about what you are building, on a departures board.",
  object: "A departures board with split-flap letters.",
  moment: "The letters flip into place when the board comes into view, like an airport board.",
  how: "The title is wrapped onto the board in capitals; longer titles are cut at the last line. The server renders the finished board, so it reads fine before any script runs. Change the title and it flips again.",
  props: {
    title: { type: "string", default: "Something new", description: "What you are working on." },
    note: { type: "string", placeholder: "Week 3 · on time", description: "A short line under the board text." },
    progress: { type: "number", min: 0, max: 100, step: 1, description: "How far along, 0 to 100. Adds a bar and the number." },
    caption: { type: "string", default: "Now building", description: "Small heading on the board." },
    columns: { type: "number", default: 12, min: 8, max: 20, step: 1, description: "Characters per line." },
    rows: { type: "number", default: 2, min: 1, max: 4, step: 1, description: "Lines on the board." },
    tone: toneProp("apricot", "the lamp and the progress bar"),
  },
  example: { title: "A CLI that names your variables", note: "Week 3 · on time", progress: 62, rows: 3 },
  live: false,
  client: true,
};
