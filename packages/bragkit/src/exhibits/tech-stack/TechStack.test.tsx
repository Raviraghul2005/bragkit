import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { TechShelf, TechStack } from "./TechStack";
import { react } from "./logos";
import { meta as exhibit } from "./meta";

describeExhibit(TechStack, exhibit, import.meta.url, ["TypeScript", "PostgreSQL", "Figma"]);

describe("TechStack", () => {
  it("draws the real logo, in the brand colour, for a tool it knows", () => {
    const out = html(TechStack, { items: ["React"] });
    expect(out).toContain(`d="${react.path}"`);
    expect(out).toContain("color:#61DAFB");
    expect(out).not.toContain("bk-ts-letters");
  });

  it("falls back to letters for a tool it does not know", () => {
    const out = html(TechStack, { items: ["Made Up Tool"] });
    expect(out).toContain(">MU<");
    expect(out).not.toContain("<svg");
  });

  it("uses your own image or icon when you give one", () => {
    const out = html(TechStack, { items: [{ name: "Mine", src: "/mine.svg" }, "React"] });
    expect(out).toContain('src="/mine.svg"');
  });

  it("turns an item with an href into a link", () => {
    const out = html(TechStack, { items: [{ name: "Postgres", href: "https://postgresql.org" }, "React"] });
    expect(out).toContain('href="https://postgresql.org"');
    expect(out.match(/<a /g)).toHaveLength(1);
  });

  it("can show every logo in one quiet colour", () => {
    const out = html(TechStack, { items: ["React"], color: "ink" });
    expect(out).toContain('data-color="ink"');
    expect(out).not.toContain("color:#61DAFB");
  });

  it("has a bare shelf that takes single logos", () => {
    const out = html(TechShelf, { items: [react] });
    expect(out).toContain("bk bk-tech-stack");
    expect(out).toContain(">React<");
  });
});
