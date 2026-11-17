import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "016",
  slug: "signature",
  name: "Signature",
  component: "Signature",
  wing: "North",
  summary: "Sign your portfolio, like the work it is.",
  object: "A signed slip of paper.",
  moment: "The signature writes itself, left to right, when the slip scrolls into view. Then the stroke under it.",
  how: "Give it your name and it is set in a script face that is already on the visitor's device, so the look varies a little between systems. For your real signature, pass one SVG path and it is drawn as a single pen stroke. The server renders the finished signature.",
  props: {
    name: { type: "string", default: "Your name", description: "Your name, written in a script face." },
    path: { type: "string", placeholder: "M10 60 C 40 10, 60 90, 90 50", description: "Your real signature: the d of one SVG path." },
    viewBox: { type: "string", default: "0 0 300 100", description: "The viewBox of that path." },
    note: { type: "string", placeholder: "London, 1843", description: "Small line under the signature." },
    caption: { type: "string", default: "Signed", description: "Small label." },
    tone: toneProp("cobalt", "the ink"),
  },
  example: { name: "Ada Lovelace", note: "London, 1843" },
  live: false,
  client: true,
};
