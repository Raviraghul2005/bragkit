import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "014",
  slug: "polaroid-stack",
  name: "Polaroid Stack",
  component: "PolaroidStack",
  wing: "West",
  summary: "Your projects, as a pile of snapshots.",
  object: "A dropped pile of polaroids with handwritten captions.",
  moment: "Click and the top print travels round to the back of the pile. Hover and the pile fans out.",
  how: "Pass a picture and a caption for each photo, with a link if it has one. A photo with no picture gets a small abstract print drawn in CSS, which is what the demo shows. One real button deals the pile, so it works with a keyboard, and the link under the pile always belongs to the print on top.",
  props: {
    photos: { type: "json", shape: "{ caption: string; src?: string; alt?: string; href?: string }[]", description: "The photos, top one first. Three to six stack best." },
    caption: { type: "string", default: "Polaroids", description: "Small heading." },
    tone: toneProp("apricot", "the prints that have no picture"),
  },
  example: {
    photos: [
      { caption: "tiny-router", href: "https://example.com" },
      { caption: "The weather app" },
      { caption: "Conference, Lisbon" },
      { caption: "First keyboard build" },
    ],
  },
  live: false,
  client: true,
};
