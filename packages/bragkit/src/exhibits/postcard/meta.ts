import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "017",
  slug: "postcard",
  name: "Postcard",
  component: "Postcard",
  wing: "North",
  summary: "Where you are, and how to write to you.",
  object: "A picture postcard with a message, a stamp and an address side.",
  moment: "Click it and it turns over in 3D to show the back.",
  how: "The picture on the front is drawn in CSS from the tone, so there is no image to host. The back carries your message and a line that opens the visitor's email app. The side that is turned away cannot be reached with the keyboard.",
  props: {
    place: { type: "string", default: "Somewhere nice", description: "Where you are, printed on the front." },
    message: { type: "string", default: "Wish you were here.", description: "What you wrote on the back." },
    email: { type: "string", placeholder: "you@example.com", description: "The write-to-me line links to it." },
    from: { type: "string", placeholder: "Ada", description: "How the message is signed." },
    flipped: { type: "boolean", default: false, description: "Start with the back showing." },
    tone: toneProp("apricot", "the picture and the stamp"),
  },
  example: { place: "Lisbon", message: "Wish you were here. The wifi is fine and the custard tarts are better.", email: "ada@example.com", from: "Ada" },
  live: false,
  client: true,
};
