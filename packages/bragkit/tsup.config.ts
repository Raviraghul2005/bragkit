import { readdirSync } from "node:fs";
import { defineConfig } from "tsup";

// One entry per exhibit (bragkit/now-playing), found by folder, plus the index, the registry
// and the primitives. ESM output is split, so the index is only a list of re-exports.
const entry: Record<string, string> = {
  index: "src/index.ts",
  registry: "src/registry.ts",
  primitives: "src/primitives/index.ts",
  "brass-plate": "src/primitives/BrassPlate.tsx",
  // Single logos for <TechKeyboard>: import { react } from "bragkit/logos".
  logos: "src/exhibits/tech-stack/logos.ts",
};
for (const dir of readdirSync("src/exhibits", { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const file = readdirSync(`src/exhibits/${dir.name}`).find((f) => /^[A-Z]\w*\.tsx$/.test(f));
  if (file) entry[dir.name] = `src/exhibits/${dir.name}/${file}`;
}

export default defineConfig({
  entry,
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  target: "es2020",
  external: ["react", "react-dom", "react/jsx-runtime"],
  // "use client" is written in the source files that need it. scripts/finish-build.mjs puts it
  // back on the matching output files, because bundling drops it.
});
