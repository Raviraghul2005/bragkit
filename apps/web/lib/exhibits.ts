import { registry, wings, type ExhibitMeta, type PropSpec } from "bragkit/registry";

export { registry, wings };
export type { ExhibitMeta, PropSpec };

export type Values = Record<string, unknown>;

export function bySlug(slug: string): ExhibitMeta | undefined {
  return registry.find((m) => m.slug === slug);
}

/** The exhibit before and after, wrapping round: walking to the next room. */
export function neighbours(slug: string): { prev: ExhibitMeta; next: ExhibitMeta } {
  const i = registry.findIndex((m) => m.slug === slug);
  const n = registry.length;
  return { prev: registry[(i - 1 + n) % n], next: registry[(i + 1) % n] };
}

const TONES = '"apricot" | "lilac" | "mint" | "rose" | "cobalt" | "plain"';

/** The TypeScript type of a prop, as text for the props table. */
export function typeText(spec: PropSpec): string {
  switch (spec.type) {
    case "enum":
      return spec.options.map((o) => `"${o}"`).join(" | ");
    case "tone":
      return TONES;
    case "json":
    case "function":
      return spec.shape;
    default:
      return spec.type;
  }
}

export function defaultText(spec: PropSpec): string {
  if (spec.type === "function" || spec.default === undefined) return "";
  return spec.type === "json" ? "" : JSON.stringify(spec.default);
}

/** Props every exhibit takes, for the bottom of each props table. */
export const sharedProps: Array<[name: string, type: string, note: string]> = [
  ["size", '"sm" | "md" | "lg"', "Default md. Set --bk-scale in CSS for anything in between."],
  ["theme", '"light" | "dark" | "auto"', "Default: follows the page. auto follows the system."],
  ["className, style, id", "", "Passed to the outer element. style takes bragkit variables such as --bk-accent."],
];

/** The starting values of the props panel: defaults, then the example on top. */
export function startValues(meta: ExhibitMeta): Values {
  const values: Values = {};
  for (const [name, spec] of Object.entries(meta.props)) {
    if (spec.type !== "function" && spec.default !== undefined) values[name] = spec.default;
  }
  return { ...values, ...meta.example };
}

function literal(value: unknown, indent: string): string {
  // A long list is shown by its first entries, so the code stays readable.
  if (Array.isArray(value) && value.length > 8) {
    const head = value.slice(0, 3).map((v) => JSON.stringify(v).replace(/"(\w+)":/g, "$1: ").replace(/,(?=\S)/g, ", "));
    return `[
${indent}  ${head.join(`,
${indent}  `)},
${indent}  // …and ${value.length - 3} more
${indent}]`;
  }
  const flat = JSON.stringify(value);
  const text = flat.length <= 60 ? flat.replace(/([{,])"(\w+)":/g, "$1 $2: ").replace(/^\{ /, "{ ").replace(/\}$/, " }") : JSON.stringify(value, null, 2).replace(/"(\w+)":/g, "$1:");
  return text.split("\n").join(`\n${indent}`).replace(/\{ +/g, "{ ").replace(/\[\{/g, "[{");
}

/** The JSX for the current values. Props that still have their default are left out. */
export function codeFor(meta: ExhibitMeta, values: Values, extra: { size?: string; theme?: string } = {}): string {
  const parts: string[] = [];
  for (const [name, spec] of Object.entries(meta.props)) {
    if (spec.type === "function") continue;
    const value = values[name];
    if (value === undefined || value === "" || value === null) continue;
    if (JSON.stringify(value) === JSON.stringify(spec.default)) continue;
    if (typeof value === "string") parts.push(`${name}=${JSON.stringify(value)}`);
    else if (value === true) parts.push(name);
    else if (typeof value === "number" || value === false) parts.push(`${name}={${value}}`);
    else parts.push(`${name}={${literal(value, "  ")}}`);
  }
  if (extra.size && extra.size !== "md") parts.push(`size="${extra.size}"`);
  if (extra.theme) parts.push(`theme="${extra.theme}"`);

  const oneLine = parts.length ? `<${meta.component} ${parts.join(" ")} />` : `<${meta.component} />`;
  const tag = oneLine.length <= 58 && !oneLine.includes("\n") ? oneLine : `<${meta.component}\n  ${parts.join("\n  ")}\n/>`;
  return `import { ${meta.component} } from "bragkit"\n\n${tag}`;
}
