import { readFileSync } from "node:fs";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ExhibitMeta } from "./meta";

/** Renders to HTML the way a server would. */
export function html<P extends object>(Component: ComponentType<P>, props?: P): string {
  return renderToStaticMarkup(createElement(Component, (props ?? {}) as P));
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

/**
 * The tests every exhibit shares: it renders with no props, with its example props, passes
 * className and style to its root, and its stylesheet stays calm under reduced motion.
 * `shows` lists text that must appear in the example render.
 */
export function describeExhibit(
  Component: ComponentType<any>,
  meta: ExhibitMeta,
  /** The test file's own `import.meta.url`. The stylesheet is `<slug>.css` beside it. */
  testUrl: string,
  shows: string[] = [],
): void {
  const css = readFileSync(new URL(`./${meta.slug}.css`, testUrl), "utf8");

  describe(`No. ${meta.number} ${meta.name}`, () => {
    it("renders with no props", () => {
      const out = html(Component);
      expect(out).toContain(`bk bk-${meta.slug}`);
      expect(out).toContain('data-size="md"');
    });

    it("renders with its example props", () => {
      const out = html(Component, meta.example);
      expect(out).toContain(`bk bk-${meta.slug}`);
      for (const text of shows) expect(out).toContain(escapeHtml(text));
    });

    it("passes className, style, size and theme to its root", () => {
      const out = html(Component, {
        ...meta.example,
        className: "mine",
        size: "lg",
        theme: "dark",
        style: { "--bk-accent": "#ff6b00" },
      });
      expect(out).toMatch(new RegExp(`class="bk bk-${meta.slug}[^"]* mine"`));
      expect(out).toContain("--bk-accent:#ff6b00");
      expect(out).toContain('data-size="lg"');
      expect(out).toContain('data-bk-theme="dark"');
    });

    it("documents every example prop", () => {
      for (const name of Object.keys(meta.example)) expect(Object.keys(meta.props)).toContain(name);
    });

    it("keeps still under reduced motion", () => {
      // base.css switches off every animation and transition. An exhibit that also moves
      // things with a hover or state transform has to undo that itself.
      const movesOnHover = /:(hover|focus-visible|focus-within)[^{}]*\{[^}]*transform\s*:/.test(css);
      if (movesOnHover) expect(css).toContain("prefers-reduced-motion");
    });
  });
}
