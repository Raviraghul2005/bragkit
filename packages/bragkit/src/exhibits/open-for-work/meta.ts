import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "006",
  slug: "open-for-work",
  name: "Open For Work",
  component: "OpenForWork",
  wing: "East",
  summary: "A door sign that says whether you are taking work.",
  object: "A door sign hanging on a string from a brass nail.",
  moment: "Click it and it turns over in 3D, then swings on its string and settles.",
  how: "The open prop decides which side faces out. Visitors can turn it over to read the back, which changes nothing for the next visitor. With an href, a small link sits under the sign while it says open.",
  props: {
    open: { type: "boolean", default: true, description: "true shows OPEN, false shows CLOSED." },
    note: { type: "string", placeholder: "Freelance, from January", description: "A short line on the open side." },
    href: { type: "string", placeholder: "mailto:you@example.com", description: "Where the link under the sign goes." },
    linkLabel: { type: "string", default: "Say hello", description: "Text of that link." },
    onFlip: { type: "function", shape: "(open: boolean) => void", description: "Called when a visitor turns the sign over." },
    tone: toneProp("mint", "the open side"),
  },
  example: { open: true, note: "Freelance, from January", href: "mailto:hello@example.com" },
  live: false,
  client: true,
};
