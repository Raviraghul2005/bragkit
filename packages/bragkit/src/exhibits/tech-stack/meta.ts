import type { ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "005",
  slug: "tech-stack",
  name: "Tech Stack Shelf",
  component: "TechStack",
  wing: "West",
  summary: "The tools you actually use, framed and lined up on a ledge.",
  object: "Small framed logos leaning on a picture ledge.",
  moment: "Each frame lifts off the ledge, stands up straight and shows its name when you hover or focus it.",
  how: "Pass the names. About fifty common tools get their real logo, in the brand's own colour, drawn as inline SVG with nothing to download. Anything else shows its first letters, or your own icon or image. For the smallest bundle, use TechShelf with single logos from bragkit/logos.",
  props: {
    items: {
      type: "json",
      shape: "(string | { name, href?, icon?, src?, short?, path?, hex? })[]",
      description: "The tools on the ledge, as names or items. Five to seven fit best.",
    },
    color: { type: "enum", options: ["brand", "ink"], default: "brand", description: "Each logo in its own colour, or all in one quiet colour." },
    caption: { type: "string", default: "Tech stack", description: "Small label under the ledge." },
  },
  example: { items: ["TypeScript", "React", "Next.js", "Postgres", "Tailwind CSS", "Figma"] },
  live: false,
  client: false,
};
