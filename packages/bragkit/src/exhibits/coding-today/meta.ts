import type { ExhibitMeta } from "../../internal/meta";

export const meta: ExhibitMeta = {
  number: "008",
  slug: "coding-today",
  name: "Coding Today",
  component: "CodingToday",
  wing: "East",
  summary: "What you wrote today, by language.",
  object: "A fan deck of paint chips, riveted at the bottom.",
  moment: "The deck fans open when you hover it, and each chip shows its language and its time.",
  how: "Pass the languages and the minutes. Each chip takes the language's usual colour, or one you choose. Nothing is tracked or fetched: bring the numbers from your editor's time tracker, or type them. It is plain HTML and CSS and renders on the server.",
  props: {
    languages: { type: "json", shape: "{ name: string; minutes: number; color?: string }[]", description: "One paint chip per language. Three to six fan best." },
    caption: { type: "string", default: "Coding today", description: "Small heading." },
  },
  example: {
    languages: [
      { name: "TypeScript", minutes: 134 },
      { name: "CSS", minutes: 52 },
      { name: "Rust", minutes: 41 },
      { name: "Markdown", minutes: 18 },
      { name: "Shell", minutes: 7 },
    ],
  },
  live: false,
  client: false,
};
