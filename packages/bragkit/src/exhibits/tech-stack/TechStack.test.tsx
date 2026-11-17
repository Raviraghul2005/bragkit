import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { TechKeyboard, TechStack } from "./TechStack";
import { react, javascript } from "./logos";
import { meta as exhibit } from "./meta";

describeExhibit(TechStack, exhibit, import.meta.url, ["Languages", "Frameworks", "TypeScript", "PostgreSQL", "28 keys"]);

describe("TechStack", () => {
  it("prints the real logo, in the brand colour, on the key of a tool it knows", () => {
    const out = html(TechStack, { items: ["React"] });
    expect(out).toContain(`d="${react.path}"`);
    expect(out).toContain("color:#61DAFB");
    expect(out).not.toContain("bk-kb-letters");
  });

  it("puts letters on the key of a tool it does not know, like a keyboard legend", () => {
    expect(html(TechStack, { items: ["Made Up Tool"] })).toContain(">MU<");
    expect(html(TechStack, { items: ["AWS"] })).toContain(">AWS<");
  });

  it("gives a pale logo a dark keycap instead of recolouring it", () => {
    const out = html(TechStack, { items: ["JavaScript", "Rust"] });
    expect(out).toContain(`d="${javascript.path}"`);
    expect(out.match(/data-cap="dark"/g)).toHaveLength(1);
  });

  it("makes a wide key show the name, and says each name on the screen", () => {
    const out = html(TechStack, { items: [{ name: "TypeScript", wide: true, note: "daily" }] });
    expect(out).toContain('data-w="2"');
    expect(out).toContain('class="bk-kb-name">TypeScript<');
    expect(out).toContain("bk-kb-say");
    expect(out).toContain("daily");
  });

  it("builds rows from groups, or from each item's group", () => {
    const fromGroups = html(TechStack, { groups: { Languages: ["Rust"], Tools: ["Git", "Docker"] } });
    expect(fromGroups.match(/class="bk-kb-row"/g)).toHaveLength(2);
    expect(fromGroups).toContain("3 keys");
    const fromItems = html(TechStack, { items: [{ name: "Rust", group: "Languages" }, { name: "Git", group: "Tools" }, { name: "Go", group: "Languages" }] });
    expect(fromItems.match(/class="bk-kb-row"/g)).toHaveLength(2);
  });

  it("turns an item with an href into a link", () => {
    const out = html(TechStack, { items: [{ name: "Postgres", href: "https://postgresql.org" }, "React"] });
    expect(out.match(/<a /g)).toHaveLength(1);
  });

  it("has a bare keyboard that takes single logos", () => {
    const out = html(TechKeyboard, { items: [react], columns: 6 });
    expect(out).toContain("bk bk-tech-stack");
    expect(out).toContain("--bk-kb-cols:6");
  });
});
