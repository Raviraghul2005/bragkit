// Runs the site alone on port 3100 with its own build folder, so it can run beside `npm run dev`
// (Next allows one dev server per build folder). It does not watch the package: run `npm run build:pkg`.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const web = fileURLToPath(new URL("../apps/web", import.meta.url));
const port = process.env.PORT || "3100";
const child = spawn("npx", ["next", "dev", "-p", port], {
  cwd: web,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, BK_DIST_DIR: ".next-alt" },
});
child.on("exit", (code) => process.exit(code ?? 0));
