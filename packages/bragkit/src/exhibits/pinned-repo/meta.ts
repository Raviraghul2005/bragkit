import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "013",
  slug: "pinned-repo",
  name: "Pinned Repo",
  component: "PinnedRepo",
  wing: "West",
  summary: "One project, framed.",
  object: "A project card in a small frame, under glass.",
  moment: "The frame tilts gently toward your pointer, light slides across the glass, and the brass star medal shimmers.",
  how: "Pass the name, a line about it, the stars and the language. Nothing is fetched: copy the numbers from your repository, or fill them in at build time from the public GitHub API. With an href the whole frame is a link.",
  props: {
    name: { type: "string", default: "your-project", description: "The project's name." },
    description: { type: "string", placeholder: "One or two lines about it", description: "One or two lines about it." },
    stars: { type: "number", min: 0, max: 50000, step: 1, description: "Star count. 1234 is shown as 1.2k." },
    language: { type: "string", placeholder: "TypeScript", description: "Main language, shown with its usual colour dot." },
    href: { type: "string", placeholder: "https://github.com/you/project", description: "Makes the whole frame a link." },
    caption: { type: "string", default: "Repository", description: "Small label above the name." },
    tone: toneProp("plain", "the frame"),
  },
  example: {
    name: "tiny-router",
    description: "A file-based router in 900 bytes. It does one thing and then it stops.",
    stars: 1284,
    language: "TypeScript",
    href: "https://github.com",
  },
  live: false,
  client: true,
};
