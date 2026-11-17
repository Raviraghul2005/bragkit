// Runs after tsup.
// 1) Puts "use client" back on the outputs whose source has it.
// 2) Bundles the CSS: dist/styles.css (everything), dist/tokens.css, dist/css/base.css and
//    one file per exhibit.
// 3) With --sizes, prints gzipped sizes.
import { build } from "esbuild";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const DIRECTIVE = '"use client";';
const isClient = (file) => /^\s*["']use client["']/.test(readFileSync(file, "utf8"));
const gz = (file) => gzipSync(readFileSync(file)).length;
const kb = (n) => `${(n / 1024).toFixed(2)} KB`;

const entries = { "brass-plate": "src/primitives/BrassPlate.tsx" };
const exhibits = [];
for (const dir of readdirSync("src/exhibits", { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const file = readdirSync(`src/exhibits/${dir.name}`).find((f) => /^[A-Z]\w*\.tsx$/.test(f));
  if (!file) continue;
  entries[dir.name] = `src/exhibits/${dir.name}/${file}`;
  exhibits.push(dir.name);
}

function mark(file) {
  if (!existsSync(file)) return;
  const code = readFileSync(file, "utf8");
  if (!code.startsWith(DIRECTIVE)) writeFileSync(file, `${DIRECTIVE}\n${code}`);
}

const client = Object.entries(entries)
  .filter(([, src]) => isClient(src))
  .map(([name]) => name);
for (const name of client) {
  mark(`dist/${name}.js`);
  mark(`dist/${name}.cjs`);
}

// Output is split: the code of an entry lives in a shared chunk, and the index imports the
// chunks directly. So a chunk is a client module when it defines a "use client" component, or
// when it uses hooks that only exist in the browser build of React.
const CLIENT_HOOKS = /\buse(State|Effect|LayoutEffect|Ref|Reducer|SyncExternalStore)\b/;
const clientNames = Object.values(entries)
  .filter(isClient)
  .map((src) => src.split("/").pop().replace(/\.tsx$/, ""));
const definesClient = (code) => clientNames.some((name) => code.includes(`function ${name}(`));
let chunksMarked = 0;
for (const file of readdirSync("dist").filter((f) => /^chunk-.*\.c?js$/.test(f))) {
  const code = readFileSync(`dist/${file}`, "utf8");
  if (definesClient(code) || CLIENT_HOOKS.test(code)) {
    mark(`dist/${file}`);
    chunksMarked += 1;
  }
}

mkdirSync("dist/css", { recursive: true });
const css = (entry, outfile) =>
  build({ entryPoints: [entry], outfile, bundle: true, minify: true, logLevel: "warning" });

await css("src/styles.css", "dist/styles.css");
copyFileSync("src/tokens.css", "dist/tokens.css");

const baseEntry = "src/.base-entry.css";
writeFileSync(
  baseEntry,
  '@import "./tokens.css";\n@import "./base.css";\n@import "./primitives/primitives.css";\n@import "./internal/flap.css";\n',
);
await css(baseEntry, "dist/css/base.css");
rmSync(baseEntry);

for (const slug of exhibits) {
  const file = readdirSync(`src/exhibits/${slug}`).find((f) => f.endsWith(".css"));
  if (file) await css(`src/exhibits/${slug}/${file}`, `dist/css/${slug}.css`);
}

if (process.argv.includes("--sizes")) {
  // What one exhibit costs on its own: its source bundled alone, minified and gzipped, without React.
  console.log("\nGzipped sizes of each exhibit imported alone (minified, without React).");
  for (const slug of exhibits) {
    const out = await build({
      entryPoints: [entries[slug]],
      bundle: true,
      minify: true,
      write: false,
      format: "esm",
      jsx: "automatic",
      external: ["react", "react-dom", "react/jsx-runtime"],
      logLevel: "silent",
    });
    const js = gzipSync(out.outputFiles[0].contents).length;
    const cssFile = `dist/css/${slug}.css`;
    const cssSize = existsSync(cssFile) ? kb(gz(cssFile)) : "-";
    const kind = client.includes(slug) ? "client" : "server";
    console.log(`  ${slug.padEnd(24)} js ${kb(js).padStart(8)}   css ${cssSize.padStart(8)}   ${kind}`);
  }
  console.log(`  ${"base.css".padEnd(24)} css ${kb(gz("dist/css/base.css")).padStart(7)}`);
  console.log(`  ${"styles.css (everything)".padEnd(24)} css ${kb(gz("dist/styles.css")).padStart(7)}`);
}
console.log(`bragkit: ${client.length} client entries and ${chunksMarked} chunks marked, CSS bundled.`);
