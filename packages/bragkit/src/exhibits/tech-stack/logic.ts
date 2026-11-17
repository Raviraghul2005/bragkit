import type { ReactNode } from "react";
import * as builtin from "./logos";
import type { Logo } from "./logos";

export interface TechItem {
  /** Full name, shown on the keyboard's screen and read by screen readers. */
  name: string;
  /** A short line shown on the screen after the name: "6 years", "daily". */
  note?: string;
  /** A wide key that shows the logo and the name. Use it for your main tools. */
  wide?: boolean;
  /** The row of keys this one belongs to: "Languages", "Tools". */
  group?: string;
  /** Makes the key a link. */
  href?: string;
  /** The logo as one SVG path in a 24 by 24 box. The built-in logos fill this in. */
  path?: string;
  /** The logo's colour, as six hex digits. */
  hex?: string;
  /** Your own logo instead: any element, such as an inline SVG. */
  icon?: ReactNode;
  /** Or an image URL. */
  src?: string;
  /** The letters on the key when there is no logo. Default: from the name ("AWS", "Fo"). */
  short?: string;
}

export interface KeyGroup {
  label?: string;
  items: TechItem[];
}

/** "Next.js" → "nextjs", "C++" → "cplusplus", "Tailwind CSS" → "tailwindcss". */
export function logoKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9]/g, "");
}

// Other names people use for the same tool, pointing at the export name in logos.ts.
const ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  reactjs: "react",
  next: "nextjs",
  vuejs: "vue",
  nuxtjs: "nuxt",
  sveltekit: "svelte",
  solidjs: "solid",
  alpine: "alpinejs",
  three: "threejs",
  node: "nodejs",
  golang: "go",
  cpp: "cplusplus",
  net: "dotnet",
  aspnet: "dotnet",
  postgresql: "postgres",
  psql: "postgres",
  mongo: "mongodb",
  tailwindcss: "tailwind",
  scss: "sass",
  html5: "html",
  css3: "css",
  shell: "bash",
  gnubash: "bash",
  k8s: "kubernetes",
  rubyonrails: "rails",
  ror: "rails",
  gcp: "googlecloud",
  kafka: "apachekafka",
  cockroachdb: "cockroachlabs",
  rollupjs: "rollup",
  flyio: "flyio",
  fly: "flyio",
  tanstackquery: "reactquery",
  shadcn: "shadcnui",
  radix: "radixui",
  materialui: "mui",
  claude: "anthropic",
  scikit: "scikitlearn",
  sklearn: "scikitlearn",
  wasm: "webassembly",
  intellij: "intellijidea",
  unreal: "unrealengine",
  godot: "godotengine",
  springframework: "spring",
  githubaction: "githubactions",
  nvim: "neovim",
};

const LOGOS = builtin as unknown as Record<string, Logo | undefined>;

/** The built-in logo for a tool name, if bragkit has one. */
export function findLogo(name: string): Logo | undefined {
  const key = logoKey(name);
  return LOGOS[ALIASES[key] ?? key];
}

/** Letters for a key with no logo: "AWS" → "AWS", "Made Up Tool" → "MU", "Zig" → "Zi". */
export function shortName(name: string): string {
  const trimmed = name.trim();
  if (/^[A-Z0-9.+#]{1,4}$/.test(trimmed)) return trimmed;
  const [first, second]: (string | undefined)[] = trimmed.match(/[A-Za-z0-9]+/g) ?? [];
  if (!first) return trimmed.slice(0, 2);
  if (second) return (first.charAt(0) + second.charAt(0)).toUpperCase();
  return first.charAt(0).toUpperCase() + first.charAt(1).toLowerCase();
}

/**
 * True when a colour is too pale to read on a cream keycap. Those logos get a dark keycap
 * instead, so the logo itself is never recoloured.
 */
export function isPale(hex: string): boolean {
  const n = Number.parseInt(hex, 16);
  if (hex.length !== 6 || Number.isNaN(n)) return false;
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const lum = 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
  return lum > 0.55;
}

/** Turns a name into an item with its built-in logo. Items you wrote yourself keep what they have. */
export function withLogo(item: string | TechItem): TechItem {
  const it = typeof item === "string" ? { name: item } : item;
  if (it.path || it.icon || it.src) return it;
  const logo = findLogo(it.name);
  if (!logo) return it;
  return { ...it, name: typeof item === "string" ? logo.name : it.name, path: logo.path, hex: it.hex ?? logo.hex };
}

/** The rows of the keyboard: the `groups` object if given, else `items` gathered by their `group`. */
export function toGroups<T extends TechItem>(
  items: readonly T[] | undefined,
  groups: Readonly<Record<string, readonly T[]>> | undefined,
): Array<{ label?: string; items: T[] }> {
  if (groups) return Object.entries(groups).map(([label, list]) => ({ label, items: [...list] }));
  const out: Array<{ label?: string; items: T[] }> = [];
  for (const item of items ?? []) {
    let row = out.find((g) => g.label === item.group);
    if (!row) {
      row = { label: item.group, items: [] };
      out.push(row);
    }
    row.items.push(item);
  }
  return out;
}
