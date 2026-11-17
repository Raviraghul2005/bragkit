import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "021",
  slug: "days-since",
  name: "Days Since",
  component: "DaysSince",
  wing: "South",
  summary: "How long it has been since the last one.",
  object: "A factory safety sign with flip numbers.",
  moment: "The number flips up to its value when the sign comes into view. With a reset button, a press flips it back to zero.",
  how: "Pass the number of days, or the date it last happened and the sign counts for you in the visitor's time zone. Counting from a date needs the visitor's clock, so the server shows dashes of the same size first. The reset is a joke for one visitor: it changes nothing for the next.",
  props: {
    days: { type: "number", min: 0, max: 999, step: 1, description: "The number on the sign." },
    since: { type: "string", placeholder: "2026-09-29", description: "Or the day it last happened. The sign counts the days since." },
    label: { type: "string", default: "an incident", description: "What it has been days without." },
    heading: { type: "string", default: "This portfolio has gone", description: "The line on the band at the top." },
    resettable: { type: "boolean", default: false, description: "Adds a reset button that flips the number to zero for this visitor." },
    onReset: { type: "function", shape: "() => void", description: "Called when the reset button is pressed." },
    tone: toneProp("apricot", "the band"),
  },
  example: { days: 47, label: "rewriting it in a new framework", resettable: true },
  live: false,
  client: true,
};
