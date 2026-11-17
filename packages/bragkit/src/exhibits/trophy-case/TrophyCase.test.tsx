import { describe, expect, it } from "vitest";
import { describeExhibit, html } from "../../internal/testing";
import { TrophyCase } from "./TrophyCase";
import { meta as exhibit } from "./meta";

describeExhibit(TrophyCase, exhibit, import.meta.url, ["First open-source PR", "8 pins"]);

describe("TrophyCase", () => {
  it("gives each pin a colour and a shape in turn", () => {
    const out = html(TrophyCase, { pins: [{ label: "A" }, { label: "B" }, { label: "C", tone: "rose", shape: "round" }] });
    expect(out).toContain('data-pin="cobalt" data-shape="round"');
    expect(out).toContain('data-pin="rose" data-shape="shield"');
    expect(out.match(/data-pin="rose"/g)).toHaveLength(2);
  });

  it("shows letters when a pin has no icon", () => {
    const out = html(TrophyCase, { pins: [{ label: "Hello world" }] });
    expect(out).toContain(">HW<");
    expect(out).toContain("1 pin<");
  });

  it("makes a pin with an href a link", () => {
    expect(html(TrophyCase, { pins: [{ label: "Talk", href: "https://example.com/talk" }] })).toContain(
      'href="https://example.com/talk"',
    );
  });
});
