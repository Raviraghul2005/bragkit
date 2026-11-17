// The dot colours GitHub uses for common languages.
const LANGUAGE_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f1e05a",
  python: "#3572a5",
  rust: "#dea584",
  go: "#00add8",
  ruby: "#701516",
  swift: "#f05138",
  kotlin: "#a97bff",
  java: "#b07219",
  "c++": "#f34b7d",
  c: "#555555",
  "c#": "#178600",
  php: "#4f5d95",
  html: "#e34c26",
  css: "#663399",
  scss: "#c6538c",
  shell: "#89e051",
  svelte: "#ff3e00",
  vue: "#41b883",
  markdown: "#083fa1",
  sql: "#e38c00",
  json: "#8a8a8a",
};

/** The usual colour for a language, if it has one. */
export function languageColor(name: string): string | undefined {
  return LANGUAGE_COLORS[name.trim().toLowerCase()];
}
