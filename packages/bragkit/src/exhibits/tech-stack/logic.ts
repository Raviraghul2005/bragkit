import type { ReactNode } from "react";
import * as builtin from "./logos";
import type { Logo } from "./logos";

export interface TechItem {
  /** Full name, shown on hover and read by screen readers. */
  name: string;
  /** The logo as one SVG path in a 24 by 24 box. The built-in logos fill this in. */
  path?: string;
  /** The logo's colour, as six hex digits. */
  hex?: string;
  /** Your own logo instead: any element, such as an inline SVG. */
  icon?: ReactNode;
  /** Or an image URL. */
  src?: string;
  /** Letters shown when there is no logo. Default: the first letters of the name. */
  short?: string;
  /** Makes the frame a link. */
  href?: string;
}

/** "Next.js" → "nextjs", "C++" → "cplusplus", "Tailwind CSS" → "tailwindcss". */
export function logoKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9]/g, "");
}

// Other things people call the same tool.
const ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  reactjs: "react",
  next: "nextjs",
  vuejs: "vue",
  sveltekit: "svelte",
  solidjs: "solid",
  node: "nodejs",
  golang: "go",
  cpp: "cplusplus",
  net: "dotnet",
  postgresql: "postgres",
  mongo: "mongodb",
  tailwindcss: "tailwind",
  scss: "sass",
  html5: "html",
  css3: "css",
  k8s: "kubernetes",
  rubyonrails: "rails",
};

const LOGOS = builtin as unknown as Record<string, Logo | undefined>;

/** The built-in logo for a tool name, if bragkit has one. */
export function findLogo(name: string): Logo | undefined {
  const key = logoKey(name);
  return LOGOS[ALIASES[key] ?? key];
}

/** Letters for a tool with no logo: "Made Up Tool" → "MU", "Zig" → "Zi". */
export function shortName(name: string): string {
  const [first, second]: (string | undefined)[] = name.match(/[A-Za-z0-9]+/g) ?? [];
  if (!first) return name.slice(0, 2);
  if (second) return (first.charAt(0) + second.charAt(0)).toUpperCase();
  return first.charAt(0).toUpperCase() + first.charAt(1).toLowerCase();
}

/** True when a colour is too pale to show on the white mat, so the frame gets a dark one. */
export function isPale(hex: string): boolean {
  const n = Number.parseInt(hex, 16);
  if (hex.length !== 6 || Number.isNaN(n)) return false;
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const lum = 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
  return lum > 0.72;
}

/** Turns names into items with their built-in logos. Items you wrote yourself are left alone. */
export function withLogos(items: ReadonlyArray<string | TechItem>): TechItem[] {
  return items.map((item) => {
    const it = typeof item === "string" ? { name: item } : item;
    if (it.path || it.icon || it.src) return it;
    const logo = findLogo(it.name);
    return logo ? { ...it, name: typeof item === "string" ? logo.name : it.name, path: logo.path, hex: it.hex ?? logo.hex } : it;
  });
}
