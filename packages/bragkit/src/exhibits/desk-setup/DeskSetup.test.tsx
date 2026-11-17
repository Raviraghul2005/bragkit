import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { DeskSetup } from "./DeskSetup";
import { BOX, DRAWINGS } from "./drawings";
import { meta as exhibit } from "./meta";

describeExhibit(DeskSetup, exhibit, import.meta.url, ["A lamp from a flea market", "Mechanical, brown switches"]);

describe("DeskSetup", () => {
  it("draws the object that was asked for", () => {
    const out = html(DeskSetup, { items: [{ kind: "mug", label: "Coffee" }] });
    expect(out).toContain(`d="${DRAWINGS.mug.body}"`);
    expect(out).toContain("bk-dk-light");
  });

  it("draws a plain box for something it has no drawing for", () => {
    const out = html(DeskSetup, { items: [{ kind: "aquarium", label: "Fish" }] });
    expect(out).toContain(`d="${BOX.body}"`);
    expect(out).toContain("Fish");
  });

  it("makes an object a link when it has an href", () => {
    const out = html(DeskSetup, { items: [{ kind: "keyboard", label: "Keyboard", href: "https://example.com/kb" }, { kind: "mug", label: "Mug" }] });
    expect(out.match(/<a /g)).toHaveLength(1);
  });

  it("has ten drawings, each a closed body", () => {
    expect(Object.keys(DRAWINGS)).toHaveLength(10);
    for (const drawing of Object.values(DRAWINGS)) expect(drawing.body.trim().toLowerCase().endsWith("z")).toBe(true);
  });
});
