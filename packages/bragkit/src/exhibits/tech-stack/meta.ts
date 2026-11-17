import { toneProp, type ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "005",
  slug: "tech-stack",
  name: "Tech Stack Keyboard",
  component: "TechStack",
  wing: "West",
  summary: "Every tool you use, as a key on your own keyboard.",
  object: "A mechanical keyboard with a small screen. Each keycap has a tool's logo printed on it.",
  moment: "Press a key and it goes down, and the tool's name types itself onto the keyboard's screen.",
  how: "Pass the names of your tools, or rows of them by group. About 175 tools get their real logo, in the brand's own colour, drawn inline with nothing to download; anything else gets letters, like a keyboard legend. Mark your main tools wide and they get a long key with their name. It works with no script and renders on the server.",
  props: {
    groups: {
      type: "json",
      shape: "Record<string, (string | { name, note?, wide?, href?, icon?, src? })[]>",
      description: "Rows of keys by name, in order. Use this or items.",
    },
    items: {
      type: "json",
      shape: "(string | { name, note?, wide?, group?, href?, icon?, src? })[]",
      description: "The keys, if you do not want rows. An item's group puts it in a row.",
    },
    columns: { type: "number", default: 10, min: 5, max: 16, step: 1, description: "How many keys fit across, at most. Fewer fit on a narrow screen." },
    color: { type: "enum", options: ["brand", "ink"], default: "brand", description: "Each logo in its own colour, or all in one quiet colour." },
    caption: { type: "string", default: "Tech stack", description: "Engraved on the case, and on the screen until a key is pressed." },
    tone: toneProp("plain", "the case (plain is graphite)"),
  },
  example: {
    groups: {
      Languages: [{ name: "TypeScript", wide: true, note: "daily" }, "JavaScript", "Python", "Rust", "Go", "Swift", "Bash", "SQLite", "Zig"],
      Frameworks: [{ name: "React", wide: true, note: "6 years" }, "Next.js", "Svelte", "Astro", "Vue", "Tailwind CSS", "Node.js", "Hono", "Expo"],
      Tools: ["Git", "GitHub", "Docker", "Postgres", "Redis", "Supabase", "Vercel", "Vite", "Figma", "Linux"],
    },
  },
  live: false,
  client: false,
};
