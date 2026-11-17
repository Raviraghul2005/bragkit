import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "007",
  slug: "currently-reading",
  name: "Currently Reading",
  component: "CurrentlyReading",
  wing: "East",
  summary: "The book on your desk, and how far in you are.",
  object: "A cloth-bound book standing on a shelf, spine out, between plainer books.",
  moment: "Hover it and the book tilts out of the row in 3D to show its cover, with a ribbon hanging as far down as you have read.",
  how: "Pass the title, the author and how far through you are. The cover is plain cloth in the tone, or any colour you give it: there is no cover image, so there is nothing to host and no artwork to copy. It is plain HTML and CSS and renders on the server.",
  props: {
    title: { type: "string", default: "Untitled", description: "The book's title." },
    author: { type: "string", placeholder: "Who wrote it", description: "Who wrote it." },
    progress: { type: "number", default: 0, min: 0, max: 1, step: 0.01, description: "How far through, 0 to 1." },
    color: { type: "string", placeholder: "#7a2e2e", description: "The colour of the cover, as any CSS colour. Default: from the tone." },
    href: { type: "string", placeholder: "https://", description: "Makes the book a link." },
    caption: { type: "string", default: "Currently reading", description: "Small heading." },
    tone: toneProp("cobalt", "the cloth cover"),
  },
  example: { title: "Frankenstein", author: "Mary Shelley", progress: 0.62 },
  live: false,
  client: false,
};
