import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "010",
  slug: "trophy-case",
  name: "Trophy Case",
  component: "TrophyCase",
  wing: "West",
  summary: "The small wins, as enamel pins on felt.",
  object: "Enamel pins with brass rims, pinned to a felt board in a frame.",
  moment: "Each pin tilts toward your pointer in 3D, and the gloss on the enamel slides with it.",
  how: "Pass a label for each pin and, if you like, one of ten small icons. Colours and shapes take turns unless you set them. The tilt writes two CSS variables straight to the pin, so nothing re-renders while you move.",
  props: {
    pins: {
      type: "json",
      shape: "{ label: string; icon?: PinIcon; tone?: Tone; shape?: \"round\" | \"shield\" | \"square\"; href?: string }[]",
      description: "The pins. Icons: star, bolt, heart, rocket, code, flag, crown, check, flame, globe.",
    },
    caption: { type: "string", default: "Trophy case", description: "Small label under the board." },
    tone: toneProp("mint", "the felt"),
  },
  example: {
    pins: [
      { label: "First open-source PR", icon: "code" },
      { label: "100 stars", icon: "star" },
      { label: "Shipped on a Friday", icon: "rocket" },
      { label: "Fixed it in production", icon: "flame" },
      { label: "Conference talk", icon: "flag" },
      { label: "Zero open issues, once", icon: "check" },
      { label: "Translated into 4 languages", icon: "globe" },
      { label: "Someone said thanks", icon: "heart" },
    ],
  },
  live: false,
  client: true,
};
