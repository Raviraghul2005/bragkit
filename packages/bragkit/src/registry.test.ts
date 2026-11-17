import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as bragkit from "./index";
import { registry } from "./registry";

const dir = (path: string) => new URL(path, import.meta.url);
const folders = readdirSync(dir("./exhibits/"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const styles = readFileSync(dir("./styles.css"), "utf8");

describe("the registry", () => {
  it("lists every exhibit folder once, in catalogue order", () => {
    expect(registry.map((m) => m.slug).sort()).toEqual([...folders].sort());
    const numbers = registry.map((m) => m.number);
    expect(numbers).toEqual([...numbers].sort());
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("names a real export and a stylesheet for every exhibit", () => {
    for (const meta of registry) {
      expect(typeof (bragkit as Record<string, unknown>)[meta.component], meta.component).toBe("function");
      expect(styles, meta.slug).toContain(`./exhibits/${meta.slug}/${meta.slug}.css`);
    }
  });

  it("marks client exhibits truthfully", () => {
    for (const meta of registry) {
      const source = readFileSync(dir(`./exhibits/${meta.slug}/${meta.component}.tsx`), "utf8");
      expect(/^\s*"use client"/.test(source), meta.slug).toBe(meta.client);
    }
  });

  it("only uses prefixed class names and variables in CSS", () => {
    const files = ["./base.css", "./primitives/primitives.css", "./internal/flap.css", ...folders.map((f) => `./exhibits/${f}/${f}.css`)];
    for (const file of files) {
      const css = readFileSync(dir(file), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/"[^"]*"/g, '""');
      const classes = css.match(/\.[a-zA-Z][\w-]*/g) ?? [];
      for (const c of classes) expect(c === ".bk" || c.startsWith(".bk-"), `${file}: ${c}`).toBe(true);
      const vars = css.match(/--[a-zA-Z][\w-]*/g) ?? [];
      for (const v of vars) expect(v.startsWith("--bk-"), `${file}: ${v}`).toBe(true);
    }
  });
});
