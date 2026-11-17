import type { Tone } from "./base";

export type Wing = "East" | "West" | "North" | "South";

/** One prop of an exhibit, described well enough for the website to build a control for it. */
export type PropSpec =
  | { type: "string"; default?: string; placeholder?: string; description: string }
  | { type: "number"; default?: number; min: number; max: number; step?: number; description: string }
  | { type: "boolean"; default?: boolean; description: string }
  | { type: "enum"; options: readonly string[]; default?: string; description: string }
  | { type: "tone"; default?: Tone; description: string }
  /** Arrays and objects. `shape` is the TypeScript type, as text. */
  | { type: "json"; shape: string; default?: unknown; description: string }
  /** Callbacks. Documented, not editable on the site. */
  | { type: "function"; shape: string; description: string };

export interface ExhibitMeta {
  /** Catalogue number, "007". */
  number: string;
  /** URL name and the subpath import: `bragkit/<slug>`. */
  slug: string;
  /** "Visitors' Book". */
  name: string;
  /** The named export, "VisitorsBook". */
  component: string;
  wing: Wing;
  /** One line for the placard. */
  summary: string;
  /** The real-world object it is. */
  object: string;
  /** The one thing it does when touched. */
  moment: string;
  /** Two or three plain sentences on how it works. */
  how: string;
  props: Record<string, PropSpec>;
  /** The props of the default demo. Invented, plausible data. */
  example: Record<string, unknown>;
  /** True only if it can read real live data. */
  live: boolean;
  /** True when it runs in the browser (interaction or timers); false when it is a server component. */
  client: boolean;
}

export const toneProp = (def: Tone, what = "the exhibit"): PropSpec => ({
  type: "tone",
  default: def,
  description: `Colour of ${what}.`,
});
