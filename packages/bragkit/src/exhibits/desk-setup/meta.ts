import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "018",
  slug: "desk-setup",
  name: "Desk Setup",
  component: "DeskSetup",
  wing: "North",
  summary: "What is on your desk.",
  object: "A row of desk objects drawn in line, standing on a desk.",
  moment: "Hover an object and it lights up, lifts a little and says what it is. The lamp throws light, the mug steams.",
  how: "Pick from ten drawings (monitor, laptop, keyboard, mouse, mug, plant, lamp, headphones, notebook, speaker) and give each a label. Anything else is drawn as a plain box. Give an object an href and it becomes a link, which also makes it reachable with a keyboard. It is plain HTML, SVG and CSS and renders on the server.",
  props: {
    items: { type: "json", shape: "{ kind: DeskKind; label: string; href?: string }[]", description: "What is on your desk, left to right. Four to six fit best." },
    caption: { type: "string", default: "Desk setup", description: "Small label under the desk." },
    tone: toneProp("apricot", "the light"),
  },
  example: {
    items: [
      { kind: "lamp", label: "A lamp from a flea market" },
      { kind: "monitor", label: "27 inch, one is enough" },
      { kind: "keyboard", label: "Mechanical, brown switches" },
      { kind: "mug", label: "Flat white, going cold" },
      { kind: "plant", label: "A pothos, still alive" },
    ],
  },
  live: false,
  client: false,
};
